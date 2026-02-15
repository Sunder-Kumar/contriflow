import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import { generateIssueSolution, extractCodeBlocks } from '../services/aiService.js';
import { getRepositoryDetails } from '../services/repositoryService.js';
import { displayTable, printHeader, printSuccess, printError, printInfo, printSection, startSpinner } from '../utils/display.js';
import { loadConfig } from '../config/configManager.js';

async function handleSolveCommand(issueNumber, repo, options) {
  try {
    if (!repo && !issueNumber) {
      throw new Error('Usage: contriflow solve <issue_number> <owner/repo>');
    }

    if (!issueNumber || !repo) {
      throw new Error(`Please provide both issue number and repository.\nUsage: contriflow solve <issue_number> <owner/repo>\nExample: contriflow solve 123 github/copilot-cli`);
    }

    // Validate repo format
    if (!/^[^\/]+\/[^\/]+$/.test(repo)) {
      throw new Error(`Invalid repository format. Use: owner/repo (e.g., facebook/react)\nYou provided: "${repo}"`);
    }

    const [owner, repoName] = repo.split('/');

    const cfg = await loadConfig();
    if (!cfg.githubToken) {
      throw new Error('Not authenticated. Run: contriflow login');
    }

    const octokit = new Octokit({ auth: cfg.githubToken });

    printHeader('🤖 Issue Solver');

    const hasAIKey = cfg.openRouterKey ? true : false;
    if (!hasAIKey && !options.noAi) {
      printError('OpenRouter API key not configured');
      printInfo('To enable AI solution generation, set your key:');
      printInfo('  contriflow config --set-ai-key <your-key>');
      printInfo('Get a key at: https://openrouter.ai');
    }

    let spinner = await startSpinner('Fetching issue...');
    let issue;
    try {
      const issueResponse = await octokit.issues.get({
        owner,
        repo: repoName,
        issue_number: parseInt(issueNumber)
      });
      issue = issueResponse.data;
      spinner.succeed(`Issue #${issueNumber} loaded`);
    } catch (err) {
      spinner.fail('Failed to fetch issue');
      if (err.status === 404) {
        throw new Error(`Issue #${issueNumber} not found in ${repo}`);
      }
      throw err;
    }

    printSection('Issue Details');
    displayTable(
      ['Title', 'Number', 'State', 'Created', 'Author'],
      [[
        issue.title,
        `#${issue.number}`,
        issue.state,
        new Date(issue.created_at).toLocaleDateString(),
        issue.user.login
      ]]
    );

    if (issue.body) {
      const preview = issue.body.length > 300 
        ? issue.body.substring(0, 300) + '...' 
        : issue.body;
      printInfo(`\n${preview}\n`);
    }

    let repoDetails;
    try {
      const spinner2 = await startSpinner('Fetching repository details...');
      repoDetails = await getRepositoryDetails(owner, repoName);
      spinner2.succeed('Repository details loaded');
    } catch (err) {
      repoDetails = { language: 'JavaScript' };
    }

    const language = repoDetails.language || 'JavaScript';

    if (hasAIKey && !options.noAi) {
      const spinner3 = await startSpinner('Generating AI solution...');
      try {
        const solution = await generateIssueSolution(
          issue.title,
          issue.body || issue.title,
          repo,
          language
        );
        spinner3.succeed('Solution generated');

        printSection('AI-Generated Solution');
        console.log(solution);

        const codeBlocks = extractCodeBlocks(solution);
        
        const workspaceDir = path.join(os.homedir(), '.contriflow', 'patches');
        await fs.ensureDir(workspaceDir);

        const patchName = `issue-${issueNumber}-${repoName}-${Date.now()}.patch`;
        const patchPath = path.join(workspaceDir, patchName);

        // Build a structured summary to include in the patch file
        const analysisMatch = solution.split(/\n\n/)[0] || solution.substring(0, 300);
        const complexity = (codeBlocks.length === 0) ? 'Low' : (codeBlocks.length <= 2 ? 'Medium' : 'High');

        // Try to detect affected filenames from solution text and code blocks
        const filenameRegex = /([\w\.\/\-]+\.(js|ts|jsx|tsx|py|java|go|c|cpp|cs|rb|json|md))/g;
        const found = new Set();
        let m;
        while ((m = filenameRegex.exec(solution)) !== null) found.add(m[1]);
        for (const block of codeBlocks) {
          while ((m = filenameRegex.exec(block)) !== null) found.add(m[1]);
        }
        const affectedFiles = Array.from(found);

        const summary = `ISSUE ANALYSIS:\n${analysisMatch}\n\nCOMPLEXITY RATING: ${complexity}\n\nAFFECTED FILES: ${affectedFiles.length ? affectedFiles.join(', ') : 'Unknown'}\n\nEXPLANATION:\n${solution.split(/\n\n/).slice(1,3).join('\n\n') || 'See solution below.'}\n\nCOMMENTS:\nReview the suggested changes, run tests locally, and adjust code as necessary.\n`;

        const patchContent = `From: ContriFlow AI Solver
Subject: Solution for ${repo}#${issueNumber}
Date: ${new Date().toISOString()}

${summary}
---
AI-Generated Solution:

${solution}

---
Code blocks extracted: ${codeBlocks.length}
${codeBlocks.map((block, i) => `\n--- Code Block ${i + 1} ---\n${block}`).join('')}
`;

        await fs.writeFile(patchPath, patchContent, 'utf-8');

        // Also create a real git-style patch that can be applied with `git apply`
        const realPatchName = `issue-${issueNumber}-${repoName}-${Date.now()}-gitapply.patch`;
        const realPatchPath = path.join(workspaceDir, realPatchName);

        const realPatchParts = [];
        if (affectedFiles.length > 0) {
          for (const filename of affectedFiles) {
            // Try to locate a code block that seems related to this filename
            let content = '';
            for (const block of codeBlocks) {
              if (block.includes(filename) || block.includes(path.basename(filename))) {
                content = block;
                break;
              }
            }
            if (!content) {
              // Fallback: include solution summary as a commented file content
              content = `/* AI suggested changes for ${filename} */\n\n${solution}`;
            }
            const lines = content.replace(/\r\n/g, '\n').split('\n');
            realPatchParts.push(`diff --git a/${filename} b/${filename}\nnew file mode 100644\nindex 0000000..e69de29\n--- /dev/null\n+++ b/${filename}\n@@ -0,0 +1,${lines.length} @@\n${lines.map(l => `+${l}`).join('\n')}\n`);
          }
        } else if (codeBlocks.length > 0) {
          for (let i = 0; i < codeBlocks.length; i++) {
            const filename = `contriflow-ai-solution-${issueNumber}-${i + 1}.js`;
            const content = codeBlocks[i];
            const lines = content.replace(/\r\n/g, '\n').split('\n');
            realPatchParts.push(`diff --git a/${filename} b/${filename}\nnew file mode 100644\nindex 0000000..e69de29\n--- /dev/null\n+++ b/${filename}\n@@ -0,0 +1,${lines.length} @@\n${lines.map(l => `+${l}`).join('\n')}\n`);
          }
        } else {
          const filename = `contriflow-ai-solution-${issueNumber}.txt`;
          const content = solution;
          const lines = content.replace(/\r\n/g, '\n').split('\n');
          realPatchParts.push(`diff --git a/${filename} b/${filename}\nnew file mode 100644\nindex 0000000..e69de29\n--- /dev/null\n+++ b/${filename}\n@@ -0,0 +1,${lines.length} @@\n${lines.map(l => `+${l}`).join('\n')}\n`);
        }

        const realPatchContent = realPatchParts.join('\n');
        await fs.writeFile(realPatchPath, realPatchContent, 'utf-8');

        printSection('Patch File Created');
        printSuccess(`Saved to: ${patchPath}`);
        printSuccess(`Real git-apply patch saved to: ${realPatchPath}`);

        printSection('Patch File Created');
        printSuccess(`Saved to: ${patchPath}`);

        printSection('Next Steps');
        console.log(`1. Review the structured summary and AI solution above`);
        console.log(`2. View patch file: ${patchName}`);
        if (codeBlocks.length > 0) {
          console.log(`3. Extracted ${codeBlocks.length} code block(s) - review for implementation`);
        }
        console.log(`4. Create a branch: git checkout -b fix-issue-${issueNumber}`);
        console.log(`5. Implement and test the solution`);
        console.log(`6. Create a pull request: contriflow pr`);

        printSuccess(`\n✨ Solution ready! Patch saved at: ${patchPath}`);
        
      } catch (err) {
        spinner3.fail('Failed to generate solution');
        throw err;
      }
    } else {
      printSection('Issue Saved as Patch Template');
      
      const workspaceDir = path.join(os.homedir(), '.contriflow', 'patches');
      await fs.ensureDir(workspaceDir);

      const patchName = `issue-${issueNumber}-${repoName}-${Date.now()}.patch`;
      const patchPath = path.join(workspaceDir, patchName);

      const patchContent = `From: ${issue.user.login}
Subject: ${issue.title}
Repository: ${repo}
Issue: #${issueNumber}
Date: ${new Date(issue.created_at).toISOString()}

${issue.body || issue.title}

---
Labels: ${issue.labels.map(l => l.name).join(', ') || 'none'}
`;

      await fs.writeFile(patchPath, patchContent, 'utf-8');

      printSuccess(`Patch template saved to: ${patchPath}`);
      printInfo('Enable AI solution generation by setting OpenRouter key:');
      printInfo('  contriflow config --set-ai-key <your-key>');
    }

  } catch (err) {
    printError(`\n✗ Error: ${err.message}`);
    process.exit(1);
  }
}

export function solveCommand(program) {
  program
    .command('solve <issue_number> <repo>')
    .description('Solve a GitHub issue using AI and generate a patch')
    .option('--no-ai', 'Skip AI solution generation, save issue as template only')
    .option('--no-interactive', 'Skip confirmation prompts')
    .action(handleSolveCommand);
}

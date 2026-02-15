import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import {
  createPullRequest,
  getDefaultBranch,
  buildBranchName,
  buildPRTitle,
  buildPRDescription
} from '../services/prService.js';
import {
  displayTable,
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  startSpinner,
  prompt
} from '../utils/display.js';
import { loadConfig } from '../config/configManager.js';

async function handlePRCommand(issueNumber, repo, options) {
  try {
    // Validate inputs
    if (!issueNumber || !repo) {
      throw new Error('Usage: contriflow pr <issue_number> <owner/repo>');
    }

    if (!/^[^\/]+\/[^\/]+$/.test(repo)) {
      throw new Error(`Invalid repository format. Use: owner/repo (e.g., facebook/react)`);
    }

    const [owner, repoName] = repo.split('/');
    const cfg = await loadConfig();

    if (!cfg.githubToken) {
      throw new Error('Not authenticated. Run: contriflow login');
    }

    const octokit = new Octokit({ auth: cfg.githubToken });

    printHeader('🚀 Pull Request Creator');

    // Check if working directory exists
    const workspaceDir = path.join(os.homedir(), '.contriflow', 'workspace', repoName);
    if (!fs.existsSync(workspaceDir)) {
      throw new Error(`Repository not cloned. Run: contriflow clone ${repo}`);
    }

    // Get issue details
    let spinner = await startSpinner('Fetching issue details...');
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

    // Display issue info
    printSection('Issue Details');
    displayTable([{
      'Title': issue.title,
      'Number': `#${issue.number}`,
      'State': issue.state,
      'Author': issue.user.login
    }]);

    // Get user info
    spinner = await startSpinner('Fetching user information...');
    let userLogin;
    try {
      const userResponse = await octokit.users.getAuthenticated();
      userLogin = userResponse.data.login;
      spinner.succeed(`Authenticated as: ${userLogin}`);
    } catch (err) {
      spinner.fail('Failed to get user info');
      throw err;
    }

    // Initialize git
    const git = simpleGit(workspaceDir);

    // Get default branch
    spinner = await startSpinner('Getting repository default branch...');
    let defaultBranch;
    try {
      defaultBranch = await getDefaultBranch(owner, repoName);
      spinner.succeed(`Default branch: ${defaultBranch}`);
    } catch (err) {
      spinner.fail('Failed to get default branch');
      throw err;
    }

    // Check current branch and make sure we're on default
    spinner = await startSpinner('Checking git status...');
    try {
      const status = await git.status();
      if (status.current !== defaultBranch) {
        printInfo(`Switching to ${defaultBranch}...`);
        await git.checkout(defaultBranch);
      }
      spinner.succeed('Repository ready');
    } catch (err) {
      spinner.fail('Git operation failed');
      throw err;
    }

    // Create feature branch
    const branchName = buildBranchName(issueNumber, issue.title);
    spinner = await startSpinner(`Creating branch: ${branchName}...`);
    try {
      await git.checkout(['-b', branchName]);
      spinner.succeed(`Branch created: ${branchName}`);
    } catch (err) {
      spinner.fail('Failed to create branch');
      throw new Error(`Branch creation failed: ${err.message}`);
    }

    // Check for patch file
    const patchesDir = path.join(os.homedir(), '.contriflow', 'patches');
    const patchFiles = await fs.readdir(patchesDir).catch(() => []);
    const relevantPatches = patchFiles.filter(f => f.includes(`issue-${issueNumber}-${repoName}`));

    let hasPatchApplied = false;
    if (relevantPatches.length > 0 && !options.noPatch) {
      // Use most recent patch
      const latestPatch = relevantPatches.sort().pop();
      const patchPath = path.join(patchesDir, latestPatch);

      if (options.interactive !== false) {
        const applyPatch = await prompt('Apply AI-generated patch to branch?');
        if (applyPatch) {
          spinner = await startSpinner(`Applying patch: ${latestPatch}...`);
          try {
            const patchContent = await fs.readFile(patchPath, 'utf-8');
            spinner.succeed('Patch content loaded');
            printInfo(`Patch file: ${latestPatch}`);
            printInfo('Review the patch and apply changes manually or use git apply');

            hasPatchApplied = true;
          } catch (err) {
            spinner.fail('Failed to apply patch');
            throw err;
          }
        }
      } else if (!options.noPatch) {
        printInfo(`Using patch: ${latestPatch}`);
        hasPatchApplied = true;
      }
    }

    // Show next steps if no patch applied
    if (!hasPatchApplied) {
      printSection('Manual Implementation Required');
      printInfo('No AI patch found or patch skipped.');
      printInfo('Implement your fix in the cloned repository:');
      printInfo(`  cd ${workspaceDir}`);
      printInfo('  # Edit files to fix issue');
      printInfo('  git add .');
      printInfo(`  git commit -m "Fix #${issueNumber}: ${issue.title}"`);
    }

    // Check for changes
    spinner = await startSpinner('Checking for changes...');
    const status = await git.status();
    spinner.succeed('Status checked');

    if (status.modified.length === 0 && status.created.length === 0) {
      printError('No changes detected in repository');
      printInfo('Please make changes and commit them before creating a PR');
      process.exit(1);
    }

    // Confirm PR creation
    if (options.interactive !== false) {
      const confirmPR = await prompt('Ready to create pull request?');
      if (!confirmPR) {
        printInfo('PR creation cancelled');
        process.exit(0);
      }
    }

    // Create PR on GitHub
    spinner = await startSpinner('Creating pull request on GitHub...');
    try {
      const prTitle = buildPRTitle(issueNumber, issue.title);
      const prBody = buildPRDescription(issueNumber, issue.title);

      const pr = await createPullRequest(
        owner,
        repoName,
        branchName,
        defaultBranch,
        prTitle,
        prBody
      );

      spinner.succeed('Pull request created!');

      // Display PR info
      printSection('Pull Request Created');
      displayTable([{
        'PR Number': `#${pr.number}`,
        'Title': pr.title,
        'Branch': `${branchName} → ${defaultBranch}`,
        'Status': 'Open',
        'URL': pr.html_url
      }]);

      // Push branch to GitHub
      spinner = await startSpinner('Pushing branch to GitHub...');
      try {
        await git.push('origin', branchName, { '--set-upstream': null });
        spinner.succeed('Branch pushed to GitHub');
      } catch (err) {
        spinner.fail('Failed to push branch');
        printError(`Push failed: ${err.message}`);
        printInfo('Manual push: git push -u origin ' + branchName);
      }

      // Display next steps
      printSection('Next Steps');
      console.log(`1. Review your pull request: ${pr.html_url}`);
      console.log(`2. Add any additional details to the PR description`);
      console.log(`3. Request reviews from project maintainers`);
      console.log(`4. Address any review comments and push updates`);
      console.log(`5. Once approved, it will be merged!`);

      printSuccess(`\n✨ Pull Request #${pr.number} created successfully!`);
      printInfo(`Open in browser: ${pr.html_url}`);

    } catch (err) {
      spinner.fail('Failed to create pull request');
      throw err;
    }

  } catch (err) {
    printError(`\n✗ Error: ${err.message}`);
    process.exit(1);
  }
}

export function prCommand(program) {
  program
    .command('pr [issue_number] [repo]')
    .description('Create a pull request for an issue')
    .option('--no-patch', 'Skip AI patch application')
    .option('--no-interactive', 'Skip confirmation prompts')
    .action(handlePRCommand);
}

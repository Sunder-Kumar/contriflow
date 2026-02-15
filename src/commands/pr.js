import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import { generateIssueSolution } from '../services/aiService.js';
import { exec } from 'child_process';
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
    const issueHeaders = ['Title', 'Number', 'State', 'Author'];
    const issueRows = [[issue.title, `#${issue.number}`, issue.state, issue.user.login]];
    console.log(displayTable(issueHeaders, issueRows));

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

    // Create or switch to feature branch
    const branchName = buildBranchName(issueNumber, issue.title);
    // Check if branch already exists locally
    try {
      const localBranches = await git.branchLocal();
      if (localBranches.all.includes(branchName)) {
        spinner = await startSpinner(`Switching to existing branch: ${branchName}...`);
        await git.checkout(branchName);
        spinner.succeed(`Switched to existing branch: ${branchName}`);
      } else {
        spinner = await startSpinner(`Creating branch: ${branchName}...`);
        await git.checkout(['-b', branchName]);
        spinner.succeed(`Branch created: ${branchName}`);
      }
    } catch (err) {
      // If branch creation failed because it already exists remotely, try to checkout
      if (err && err.message && err.message.includes('already exists')) {
        try {
          spinner = await startSpinner(`Switching to existing branch: ${branchName}...`);
          await git.checkout(branchName);
          spinner.succeed(`Switched to existing branch: ${branchName}`);
        } catch (e) {
          spinner && spinner.fail('Failed to switch to existing branch');
          throw new Error(`Branch checkout failed: ${e.message}`);
        }
      } else {
        spinner && spinner.fail('Failed to create or switch branch');
        throw new Error(`Branch creation failed: ${err.message}`);
      }
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

            // Prefer git-apply compatible patch files (created by solve command)
            const gitApplyPatch = latestPatch.endsWith('-gitapply.patch')
              ? latestPatch
              : (relevantPatches.find(p => p.endsWith('-gitapply.patch')) || null);

            if (gitApplyPatch) {
              const gitApplyPath = path.join(patchesDir, gitApplyPatch);
              try {
                // Apply the patch to the repository
                await git.raw(['apply', gitApplyPath]);
                // Stage and commit changes
                await git.add('.');
                await git.commit(`Apply AI patch for issue #${issueNumber}`);
                spinner.succeed('Patch applied and committed');
                printInfo(`Applied patch file: ${gitApplyPatch}`);
                hasPatchApplied = true;
              } catch (applyErr) {
                spinner.fail('Failed to apply git patch');
                printError(`Git apply failed: ${applyErr.message}`);

                // If the failure is because the file already exists, try to stage & commit the existing files instead
                const existsRegex = /error: ([^:\n]+): already exists in working directory/g;
                let m;
                const existingFiles = [];
                while ((m = existsRegex.exec(String(applyErr.message))) !== null) {
                  existingFiles.push(m[1].trim());
                }

                if (existingFiles.length > 0) {
                  try {
                    printInfo(`Detected existing files: ${existingFiles.join(', ')}`);
                    // Stage the existing files if present
                    const filesToAdd = existingFiles.filter(f => fs.existsSync(path.join(workspaceDir, f)));
                    if (filesToAdd.length > 0) {
                      await git.add(filesToAdd);
                      // Commit changes if any
                      try {
                        await git.commit(`Apply existing AI patch files for issue #${issueNumber}`);
                        printSuccess('Committed existing AI patch files');
                      } catch (commitErr) {
                        // Nothing to commit or commit failed; ignore and continue
                        printInfo(`Commit skipped/failed: ${commitErr.message}`);
                      }
                    }

                    hasPatchApplied = true;
                    printInfo('Using existing files in working directory for PR creation');
                  } catch (handleErr) {
                    printInfo('Failed to auto-handle existing files: ' + handleErr.message);
                  }
                } else {
                  printInfo('You can manually apply the patch with:');
                  printInfo(`  git apply ${gitApplyPath}`);
                }
                // continue without throwing to allow manual flow
              }
            } else {
              // Not a git-apply compatible patch; save content but do not attempt to apply
              spinner.succeed('Patch content loaded');
              printInfo(`Patch file: ${latestPatch}`);
              printInfo('Patch is not git-apply compatible. Review and apply changes manually.');
              hasPatchApplied = false;
            }

          } catch (err) {
            spinner.fail('Failed to read patch');
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

    // Check for commits or uncommitted changes
    spinner = await startSpinner('Checking for changes...');
    try {
      // Fetch to update refs
      await git.fetch();
      // Count commits where branch is ahead of defaultBranch
      let commitsAheadRaw = '0';
      try {
        commitsAheadRaw = await git.raw(['rev-list', '--count', `${defaultBranch}..${branchName}`]);
      } catch (e) {
        // fallback to 0
      }
      const commitsAhead = parseInt((commitsAheadRaw || '0').trim(), 10) || 0;

      if (commitsAhead === 0) {
        // No commits ahead; check for uncommitted changes
        const status = await git.status();
        if (status.modified.length === 0 && status.created.length === 0 && status.not_added.length === 0) {
          spinner.succeed('Status checked');
          printError('No changes detected in repository');
          printInfo('Please make changes and commit them before creating a PR');
          process.exit(1);
        }
      }

      spinner.succeed('Status checked');
    } catch (err) {
      spinner.fail('Failed to check changes');
      throw err;
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

      // Try to generate an AI-assisted PR description if AI key is configured
      let solution = null;
      try {
        const cfg = await loadConfig();
        if (cfg.openRouterKey) {
          const solSpinner = await startSpinner('Generating AI-assisted PR description...');
          try {
            solution = await generateIssueSolution(issue.title, issue.body || issue.title, `${owner}/${repoName}`, 'JavaScript');
            solSpinner.succeed('AI description generated');
          } catch (aiErr) {
            solSpinner.fail('AI generation failed');
            printInfo(`Skipping AI description: ${aiErr.message}`);
            solution = null;
          }
        }
      } catch (cfgErr) {
        // ignore config load errors
      }

      const prBody = buildPRDescription(issueNumber, issue.title, solution);

      // Determine remote owner for head ref (in case origin is a fork)
      let originOwner = null;
      try {
        const originUrl = (await git.raw(['config', '--get', 'remote.origin.url'])).trim();
        const m = originUrl.match(/[/:]([^/:]+)\/([^/]+)(?:\.git)?$/);
        if (m) originOwner = m[1];
      } catch (e) {
        // ignore
      }

      const headRef = originOwner ? `${originOwner}:${branchName}` : branchName;

      let pr;
      try {
        pr = await createPullRequest(
          owner,
          repoName,
          headRef,
          defaultBranch,
          prTitle,
          prBody
        );
        spinner.succeed('Pull request created!');
      } catch (createErr) {
        // Handle common permission error when head includes remote owner
        if (createErr.message && createErr.message.includes('Resource not accessible by personal access token')) {
          printInfo('GitHub API rejected head ref with remote owner. Retrying with local branch ref...');
          try {
            pr = await createPullRequest(
              owner,
              repoName,
              branchName,
              defaultBranch,
              prTitle,
              prBody
            );
            spinner.succeed('Pull request created (fallback)');
          } catch (retryErr) {
            // rethrow original error to show clearer context
            throw createErr;
          }
        } else {
          throw createErr;
        }
      }

      // Display PR info
      printSection('Pull Request Created');
      const prHeaders = ['PR Number', 'Title', 'Branch', 'Status', 'URL'];
      const prRows = [[`#${pr.number}`, pr.title, `${branchName} → ${defaultBranch}`, 'Open', pr.html_url]];
      console.log(displayTable(prHeaders, prRows));

      // If AI solution available, post as a comment on the PR for reviewers
      if (solution) {
        try {
          await octokit.issues.createComment({ owner, repo: repoName, issue_number: pr.number, body: `AI-generated explanation and suggested changes:\n\n${solution}` });
          printInfo('Posted AI explanation as a PR comment');
        } catch (commentErr) {
          printInfo('Failed to post AI comment: ' + commentErr.message);
        }
      }

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

      // Try to open the PR URL in the default browser
      try {
        const cmd = process.platform === 'win32' ? `start "" "${pr.html_url}"` : process.platform === 'darwin' ? `open "${pr.html_url}"` : `xdg-open "${pr.html_url}"`;
        exec(cmd);
      } catch (openErr) {
        // ignore
      }

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

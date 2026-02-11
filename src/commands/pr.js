import chalk from 'chalk';
import path from 'path';
import os from 'os';
import { createPullRequest, getPullRequest } from '../services/gitService.js';
import { getIssueDetails } from '../services/issueService.js';
import {
  printHeader,
  printSuccess,
  printError,
  printSection,
  startSpinner,
  prompt,
} from '../utils/display.js';

export function prCommand(program) {
  program
    .command('pr')
    .description('Create or manage pull requests')
    .option('-r, --repo <repo>', 'Repository in format owner/repo')
    .option('-b, --branch <branch>', 'Branch name to push from')
    .option('-i, --issue <issue>', 'Link to issue number')
    .option('-t, --title <title>', 'PR title')
    .option('-d, --draft', 'Create as draft')
    .action(async (options) => {
      printHeader('Create Pull Request');

      try {
        let repoPath = options.repo;

        if (!repoPath) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'repo',
              message: 'Enter repository (owner/repo):',
              validate: (input) =>
                /^[^\/]+\/[^\/]+$/.test(input) ||
                'Invalid format. Use: owner/repo',
            },
          ]);
          repoPath = answers.repo;
        }

        const [owner, repo] = repoPath.split('/');

        let branch = options.branch;
        if (!branch) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'branch',
              message: 'Enter branch name (e.g., feature/fix-issue-123):',
              validate: (input) => input.length > 0 || 'Branch name required',
            },
          ]);
          branch = answers.branch;
        }

        let title = options.title;
        if (!title) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Enter PR title:',
              validate: (input) => input.length > 0 || 'Title required',
            },
          ]);
          title = answers.title;
        }

        let body = '';
        if (options.issue) {
          const spinner = await startSpinner('Fetching issue details...');
          const issueDetails = await getIssueDetails(
            owner,
            repo,
            options.issue
          );
          spinner.succeed();

          body = `Fixes #${options.issue}\n\n## Changes\n- Description of changes\n\n## Related Issue\n${issueDetails.title}`;
        }

        const bodyAnswers = await prompt([
          {
            type: 'editor',
            name: 'body',
            message: 'Enter PR description (opens editor):',
            default: body,
          },
        ]);

        const spinner = await startSpinner('Creating pull request...');

        const pr = await createPullRequest(owner, repo, {
          title,
          body: bodyAnswers.body,
          head: `${owner}:${branch}`,
          base: 'main',
          draft: options.draft || false,
        });

        spinner.succeed(chalk.green(`✓ Pull Request Created!`));

        printSection('PR Details');
        console.log(chalk.bold(`PR #${pr.number}`));
        console.log(chalk.cyan(`URL: ${pr.url}`));
        console.log(chalk.dim(`Status: ${pr.status}`));

        printSuccess('PR is ready for review!');
        console.log(chalk.dim(`\nShare the link with reviewers: ${pr.url}`));
      } catch (error) {
        printError(`Failed to create PR: ${error.message}`);
      }
    });
}

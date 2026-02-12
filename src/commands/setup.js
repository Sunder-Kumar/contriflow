import chalk from 'chalk';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { simpleGit } from 'simple-git';
import { initializeOctokit } from '../services/github.js';
import {
  forkRepository,
  getRepositoryDetails,
  getContributingGuidelines,
} from '../services/repositoryService.js';
import { getIssueDetails } from '../services/issueService.js';
import {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  startSpinner,
  prompt,
} from '../utils/display.js';

const WORKSPACE_DIR = path.join(os.homedir(), '.contriflow', 'workspace');

export function setupCommand(program) {
  program
    .command('setup')
    .description('Fork and clone a repository to start working')
    .option('-r, --repo <repo>', 'Repository in format owner/repo')
    .option('-i, --issue <issue>', 'Issue number (optional)')
    .action(async (options) => {
      printHeader('Setup Repository');

      try {
        let repoPath = options.repo;

        if (!repoPath) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'repo',
              message: 'Enter repository (format: owner/repo):',
              validate: (input) =>
                /^[^\/]+\/[^\/]+$/.test(input) ||
                'Invalid format. Use: owner/repo',
            },
          ]);
          repoPath = answers.repo;
        }

        const [owner, repo] = repoPath.split('/');

        const spinner = await startSpinner('Fetching repository details...');

        const repoDetails = await getRepositoryDetails(owner, repo);
        spinner.succeed(chalk.green(`✓ Repository: ${repoDetails.fullName}`));

        if (options.issue) {
          const issueSpinner = await startSpinner('Fetching issue details...');
          const issueDetails = await getIssueDetails(
            owner,
            repo,
            options.issue
          );
          issueSpinner.succeed();

          printSection('Issue Information');
          console.log(chalk.bold(issueDetails.title));
          console.log(chalk.dim(issueDetails.body.substring(0, 200) + '...'));
        }

        const contribSpinner = await startSpinner(
          'Checking for contribution guidelines...'
        );
        
        let contrib;
        try {
          contrib = await getContributingGuidelines(owner, repo);
        } catch (error) {
          contribSpinner.warn();
        }

        if (contrib) {
          contribSpinner.succeed(chalk.green('✓ Found contribution guidelines'));
          const showContrib = await prompt([
            {
              type: 'confirm',
              name: 'show',
              message: 'View the guidelines?',
              default: true,
            },
          ]);

          if (showContrib.show) {
            printSection('Contribution Guidelines');
            console.log(contrib.substring(0, 500) + '...\n');
          }
        } else {
          contribSpinner.warn(chalk.yellow('⚠ No CONTRIBUTING.md found'));
          console.log(
            chalk.yellow('\n⚠️  This repository does not have contribution guidelines.')
          );
          console.log(chalk.dim('   You should review the README or community standards.'));
          
          const continueSetup = await prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: 'Continue with setup anyway?',
              default: false,
            },
          ]);

          if (!continueSetup.proceed) {
            printInfo('Setup cancelled. Please select another repository.');
            console.log(chalk.cyan('\nTo search for repositories:'));
            console.log(chalk.gray('  contriflow search --keyword <your-keyword>'));
            return;
          }
          
          console.log('');
        }

        const forkSpinner = await startSpinner('Forking repository...');
        const forked = await forkRepository(owner, repo);
        forkSpinner.succeed(chalk.green(`✓ Forked to ${forked.fullName}`));

        const cloneSpinner = await startSpinner('Cloning repository...');
        await fs.ensureDir(WORKSPACE_DIR);
        const localPath = path.join(WORKSPACE_DIR, repo);

        // Check if directory already exists
        const dirExists = await fs.pathExists(localPath);
        if (dirExists) {
          cloneSpinner.warn(chalk.yellow(`⚠ Directory already exists at ${localPath}`));
          
          const action = await prompt([
            {
              type: 'list',
              name: 'choice',
              message: 'What would you like to do?',
              choices: [
                'Update existing repository (pull latest)',
                'Use existing repository as-is',
                'Remove and re-clone',
              ],
            },
          ]);

          if (action.choice === 'Remove and re-clone') {
            const confirmSpinner = await startSpinner('Removing existing directory...');
            await fs.remove(localPath);
            confirmSpinner.succeed();
            
            const recloneSpinner = await startSpinner('Cloning repository...');
            const git = simpleGit();
            await git.clone(forked.cloneUrl, localPath);
            recloneSpinner.succeed(chalk.green(`✓ Cloned to ${localPath}`));
          } else if (action.choice === 'Update existing repository (pull latest)') {
            const pullSpinner = await startSpinner('Pulling latest changes...');
            const repoGit = simpleGit(localPath);
            await repoGit.pull();
            pullSpinner.succeed(chalk.green(`✓ Updated repository`));
          } else {
            cloneSpinner.succeed(chalk.green(`✓ Using existing repository at ${localPath}`));
          }
        } else {
          const git = simpleGit();
          await git.clone(forked.cloneUrl, localPath);
          cloneSpinner.succeed(chalk.green(`✓ Cloned to ${localPath}`));
        }

        const upstreamSpinner = await startSpinner('Adding upstream remote...');
        const repoGit = simpleGit(localPath);
        try {
          await repoGit.addRemote('upstream', repoDetails.cloneUrl);
        } catch (error) {
          // Remote might already exist, try to update it
          try {
            await repoGit.removeRemote('upstream');
            await repoGit.addRemote('upstream', repoDetails.cloneUrl);
          } catch (removeError) {
            // Continue anyway
          }
        }
        upstreamSpinner.succeed();

        printSection('Next Steps');
        printSuccess('Repository is ready!');
        console.log(chalk.cyan(`\nLocal path: ${localPath}`));
        console.log(chalk.dim(`\nNavigate to the repository:`));
        console.log(chalk.gray(`  cd ${localPath}`));
        console.log(chalk.dim(`\nCreate a feature branch:`));
        console.log(
          chalk.gray(
            `  git checkout -b feature/fix-issue-${options.issue || '123'}`
          )
        );
        console.log(chalk.dim(`\nMake your changes and commit:`));
        console.log(chalk.gray(`  git commit -m "Fix: your fix message"`));
        console.log(chalk.dim(`\nCreate a Pull Request:`));
        console.log(
          chalk.gray(
            `  contriflow pr --repo ${repoPath} --branch feature/fix-issue-${options.issue || '123'}`
          )
        );
      } catch (error) {
        printError(`Setup failed: ${error.message}`);
      }
    });
}

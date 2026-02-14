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

      let currentSpinner = null;

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

        currentSpinner = await startSpinner('Fetching repository details...');
        const spinner = currentSpinner;

        const repoDetails = await getRepositoryDetails(owner, repo);
        spinner.succeed(chalk.green(`✓ Repository: ${repoDetails.fullName}`));
        currentSpinner = null;

        if (options.issue) {
          currentSpinner = await startSpinner('Fetching issue details...');
          const issueSpinner = currentSpinner;
          const issueDetails = await getIssueDetails(
            owner,
            repo,
            options.issue
          );
          issueSpinner.succeed();
          currentSpinner = null;

          printSection('Issue Information');
          console.log(chalk.bold(issueDetails.title));
          console.log(chalk.dim(issueDetails.body.substring(0, 200) + '...'));
        }

        currentSpinner = await startSpinner(
          'Checking for contribution guidelines...'
        );
        
        let contrib;
        try {
          contrib = await getContributingGuidelines(owner, repo);
        } catch (error) {
          currentSpinner.warn();
          currentSpinner = null;
        }

        if (contrib) {
          // keep spinner reference for consistency
          currentSpinner.succeed(chalk.green('✓ Found contribution guidelines'));
          currentSpinner = null;
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
          // spinner already warned or not set
          if (currentSpinner) {
            currentSpinner.warn(chalk.yellow('⚠ No CONTRIBUTING.md found'));
            currentSpinner = null;
          } else {
            // nothing
          }

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

        currentSpinner = await startSpinner('Forking repository...');
        const forkSpinner = currentSpinner;
        const forked = await forkRepository(owner, repo);
        forkSpinner.succeed(chalk.green(`✓ Forked to ${forked.fullName}`));
        currentSpinner = null;

        currentSpinner = await startSpinner('Cloning repository...');
        const cloneSpinner = currentSpinner;
        await fs.ensureDir(WORKSPACE_DIR);
        const localPath = path.join(WORKSPACE_DIR, repo);

        // Check if directory already exists
        const dirExists = await fs.pathExists(localPath);
        if (dirExists) {
          cloneSpinner.warn(chalk.yellow(`⚠ Directory already exists at ${localPath}`));
          currentSpinner = null;
          
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
            currentSpinner = await startSpinner('Removing existing directory...');
            const confirmSpinner = currentSpinner;
            await fs.remove(localPath);
            confirmSpinner.succeed();
            currentSpinner = null;
            
            currentSpinner = await startSpinner('Cloning repository...');
            const recloneSpinner = currentSpinner;
            const git = simpleGit();
            await git.clone(forked.cloneUrl, localPath);
            recloneSpinner.succeed(chalk.green(`✓ Cloned to ${localPath}`));
            currentSpinner = null;
          } else if (action.choice === 'Update existing repository (pull latest)') {
            currentSpinner = await startSpinner('Pulling latest changes...');
            const pullSpinner = currentSpinner;
            const repoGit = simpleGit(localPath);
            await repoGit.pull();
            pullSpinner.succeed(chalk.green(`✓ Updated repository`));
            currentSpinner = null;
          } else {
            cloneSpinner.succeed(chalk.green(`✓ Using existing repository at ${localPath}`));
          }
        } else {
          try {
            const git = simpleGit();
            await git.clone(forked.cloneUrl, localPath);
            cloneSpinner.succeed(chalk.green(`✓ Cloned to ${localPath}`));
            currentSpinner = null;
          } catch (err) {
            if (cloneSpinner) cloneSpinner.fail(chalk.red(`✗ Failed to clone: ${err.message}`));
            currentSpinner = null;
            throw err;
          }
        }

        currentSpinner = await startSpinner('Adding upstream remote...');
        const upstreamSpinner = currentSpinner;
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
        currentSpinner = null;

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
        if (currentSpinner) {
          try { currentSpinner.fail(chalk.red(`✗ Setup failed: ${error.message}`)); } catch (e) {}
        }
        printError(`Setup failed: ${error.message}`);
      }
    });
}

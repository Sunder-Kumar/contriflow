import chalk from 'chalk';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { simpleGit } from 'simple-git';
import { getRepositoryDetails } from '../services/repositoryService.js';
import {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  startSpinner,
  prompt,
  displayTable,
} from '../utils/display.js';

const WORKSPACE_DIR = path.join(os.homedir(), '.contriflow', 'workspace');

export function cloneCommand(program) {
  program
    .command('clone [repo]')
    .description(
      'Clone a repository to your workspace directory using git'
    )
    .option(
      '-a, --add-upstream',
      'Automatically add upstream remote (for forks)'
    )
    .option('-d, --directory <dir>', 'Custom directory for cloning')
    .option('--no-interactive', 'Skip confirmation prompts')
    .action(async (repoArg, options) => {
      printHeader('Clone Repository');

      try {
        let repoPath = repoArg;

        // Prompt for repository if not provided
        if (!repoPath) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'repo',
              message: 'Enter repository to clone (format: owner/repo):',
              validate: (input) =>
                /^[^\/]+\/[^\/]+$/.test(input) ||
                'Invalid format. Use: owner/repo',
            },
          ]);
          repoPath = answers.repo;
        }

        // Validate format
        if (!/^[^\/]+\/[^\/]+$/.test(repoPath)) {
          printError('Invalid repository format. Use format: owner/repo');
          return;
        }

        const [owner, repo] = repoPath.split('/');

        // Fetch repository details
        let repoDetails;
        try {
          const detailsSpinner = await startSpinner(
            `Fetching repository details for ${chalk.cyan(repoPath)}...`
          );
          repoDetails = await getRepositoryDetails(owner, repo);
          detailsSpinner.succeed(
            chalk.green(`✓ Found: ${repoDetails.fullName}`)
          );
        } catch (error) {
          printError(`Repository not found: ${repoPath}`);
          return;
        }

        // Show repository info
        printSection('Repository Information');
        const repoInfo = [
          ['Property', 'Value'],
          ['Name', chalk.cyan(repoDetails.fullName)],
          ['Stars', chalk.yellow(repoDetails.stars.toString())],
          ['Language', repoDetails.language || chalk.dim('Unknown')],
          ['URL', chalk.blue(repoDetails.url)],
          ['Clone URL', chalk.blue(repoDetails.cloneUrl)],
        ];
        console.log(displayTable(repoInfo));

        // Determine clone directory
        const cloneDir = options.directory
          ? path.resolve(options.directory)
          : path.join(WORKSPACE_DIR, repo);

        // Check if directory already exists
        if (await fs.pathExists(cloneDir)) {
          if (options.interactive) {
            const existsConfirm = await prompt([
              {
                type: 'confirm',
                name: 'overwrite',
                message: `Directory ${chalk.cyan(
                  cloneDir
                )} already exists. Proceed anyway?`,
                default: false,
              },
            ]);

            if (!existsConfirm.overwrite) {
              printInfo('Clone cancelled.');
              return;
            }
          } else {
            printError(
              `Directory already exists: ${cloneDir}. Use --directory to specify a different location.`
            );
            return;
          }
        }

        // Confirm clone
        if (options.interactive) {
          const confirm = await prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: `Clone ${chalk.cyan(
                repoDetails.fullName
              )} to ${chalk.cyan(cloneDir)}?`,
              default: true,
            },
          ]);

          if (!confirm.proceed) {
            printInfo('Clone cancelled.');
            return;
          }
        }

        // Clone the repository
        const cloneSpinner = await startSpinner(
          `Cloning ${chalk.cyan(repoDetails.fullName)} to ${chalk.cyan(
            cloneDir
          )}...`
        );

        try {
          // Ensure directory exists
          await fs.ensureDir(path.dirname(cloneDir));

          // Clone using simple-git
          const git = simpleGit();
          await git.clone(repoDetails.cloneUrl, cloneDir);

          cloneSpinner.succeed(
            chalk.green(`✓ Successfully cloned to ${chalk.cyan(cloneDir)}`)
          );
        } catch (error) {
          cloneSpinner.fail();
          printError(`Clone failed: ${error.message}`);
          return;
        }

        // Handle upstream remote if requested or if it's a fork
        if (options.addUpstream) {
          // Check if this is a fork - if owner is different from authenticated user
          // For now, just offer to add upstream based on flag
          const upstreamSpinner = await startSpinner(
            'Adding upstream remote...'
          );

          try {
            const repoGit = simpleGit(cloneDir);

            // Try to add upstream remote (will fail silently if already exists)
            const upstreamUrl = `https://github.com/${owner}/${repo}.git`;
            await repoGit.addRemote('upstream', upstreamUrl).catch(() => {
              // Remote might already exist, that's okay
            });

            upstreamSpinner.succeed(
              chalk.green(`✓ Added upstream remote: ${upstreamUrl}`)
            );
          } catch (error) {
            upstreamSpinner.warn(
              chalk.yellow(`⚠ Could not add upstream remote: ${error.message}`)
            );
          }
        }

        // Show clone result
        printSection('Clone Result');
        const cloneInfo = [
          ['Property', 'Value'],
          ['Repository', chalk.cyan(repoDetails.fullName)],
          ['Local Path', chalk.blue(cloneDir)],
          ['Clone URL', chalk.blue(repoDetails.cloneUrl)],
        ];
        console.log(displayTable(cloneInfo));

        // Show next steps
        printSection('Next Steps');
        console.log(chalk.dim('1. Navigate to repository:'));
        console.log(chalk.cyan(`   cd ${cloneDir}`));
        console.log();
        console.log(chalk.dim('2. View repository files:'));
        console.log(chalk.cyan(`   ls -la`));
        console.log();
        console.log(chalk.dim('3. Check current branch:'));
        console.log(chalk.cyan(`   git branch -a`));
        console.log();

        if (options.addUpstream) {
          console.log(chalk.dim('4. Keep in sync with upstream:'));
          console.log(chalk.cyan(`   git fetch upstream`));
          console.log(chalk.cyan(`   git merge upstream/main`));
          console.log();
        }

        console.log(chalk.dim('5. Create a feature branch:'));
        console.log(chalk.cyan(`   git checkout -b feature/your-feature`));
        console.log();
        console.log(chalk.dim('6. Use ContriFlow to find issues:'));
        console.log(chalk.cyan(`   contriflow issues ${repoPath}`));
        console.log();
        console.log(chalk.dim('7. Create a Pull Request:'));
        console.log(
          chalk.cyan(`   contriflow pr --repo ${repoPath} --branch feature/your-feature`)
        );

        printSuccess(
          `\n✓ Repository cloned successfully! Ready to start contributing.`
        );
      } catch (error) {
        printError(`Unexpected error: ${error.message}`);
      }
    });
}

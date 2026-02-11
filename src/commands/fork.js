import chalk from 'chalk';
import {
  forkRepository,
  getRepositoryDetails,
} from '../services/repositoryService.js';
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

export function forkCommand(program) {
  program
    .command('fork [repo]')
    .description('Fork a repository to your GitHub account')
    .option('-c, --clone', 'Automatically clone the forked repository')
    .option('--no-interactive', 'Skip interactive prompts')
    .action(async (repoArg, options) => {
      printHeader('Fork Repository');

      try {
        let repoPath = repoArg;

        // Prompt for repository if not provided
        if (!repoPath) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'repo',
              message: 'Enter repository to fork (format: owner/repo):',
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

        // Fetch repository details first
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
          ['Forks', repoDetails.forks.toString()],
        ];
        console.log(displayTable(repoInfo));

        // Confirm fork
        if (options.interactive) {
          const confirm = await prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: `Fork ${chalk.cyan(repoDetails.fullName)} to your account?`,
              default: true,
            },
          ]);

          if (!confirm.proceed) {
            printInfo('Fork cancelled.');
            return;
          }
        }

        // Fork the repository
        const forkSpinner = await startSpinner(
          `Forking ${chalk.cyan(repoDetails.fullName)}...`
        );

        let forkedRepo;
        try {
          forkedRepo = await forkRepository(owner, repo);
          forkSpinner.succeed(
            chalk.green(`✓ Successfully forked to ${chalk.cyan(forkedRepo.fullName)}`)
          );
        } catch (error) {
          // Check if fork already exists
          if (error.message.includes('422') || error.message.includes('already')) {
            forkSpinner.warn(
              chalk.yellow('⚠ Repository already forked to your account')
            );
            // Construct the forked repo name
            forkedRepo = {
              fullName: `${forkedRepo?.owner || 'your-username'}/${repo}`,
              cloneUrl: repoDetails.cloneUrl.replace(owner, 'your-username'),
              owner: forkedRepo?.owner || 'your-username',
            };
          } else {
            forkSpinner.fail();
            printError(`Fork failed: ${error.message}`);
            return;
          }
        }

        // Show fork result
        printSection('Fork Result');
        const forkInfo = [
          ['Property', 'Value'],
          ['Forked Repo', chalk.cyan(forkedRepo.fullName)],
          ['Clone URL', chalk.blue(forkedRepo.cloneUrl)],
        ];
        console.log(displayTable(forkInfo));

        // Offer to clone if --clone flag or user confirms
        let shouldClone = options.clone;

        if (!shouldClone && options.interactive) {
          const cloneConfirm = await prompt([
            {
              type: 'confirm',
              name: 'clone',
              message: 'Clone the forked repository to your workspace?',
              default: false,
            },
          ]);
          shouldClone = cloneConfirm.clone;
        }

        if (shouldClone) {
          printSection('Next Steps');
          printInfo(`To clone your fork, run:`);
          console.log(
            chalk.cyan(
              `  contriflow setup --repo ${forkedRepo.fullName}`
            )
          );
        } else {
          // Show helpful next steps
          printSection('Next Steps');
          console.log(chalk.dim('1. Clone your fork locally:'));
          console.log(chalk.cyan(`   git clone ${forkedRepo.cloneUrl}`));
          console.log();
          console.log(chalk.dim('2. Or use ContriFlow setup:'));
          console.log(
            chalk.cyan(
              `   contriflow setup --repo ${forkedRepo.fullName}`
            )
          );
          console.log();
          console.log(chalk.dim('3. Add upstream remote:'));
          console.log(
            chalk.cyan(
              `   git remote add upstream https://github.com/${owner}/${repo}.git`
            )
          );
        }

        printSuccess(`\n✓ Fork complete! You can now start contributing.`);
      } catch (error) {
        printError(`Unexpected error: ${error.message}`);
      }
    });
}

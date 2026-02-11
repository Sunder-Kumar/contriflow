import chalk from 'chalk';
import { initializeOctokit } from '../services/github.js';
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

export function guideCommand(program) {
  program
    .command('guide [repo]')
    .description(
      'Fetch and display CONTRIBUTING.md and CODE_OF_CONDUCT.md from a repository'
    )
    .option(
      '-c, --contributing',
      'Show only CONTRIBUTING.md'
    )
    .option(
      '-o, --code-of-conduct',
      'Show only CODE_OF_CONDUCT.md'
    )
    .option(
      '-b, --brief',
      'Show first 500 characters of each file'
    )
    .option('--no-interactive', 'Skip confirmation prompts')
    .action(async (repoArg, options) => {
      printHeader('Repository Contribution Guidelines');

      try {
        let repoPath = repoArg;

        // Prompt for repository if not provided
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
        ];
        console.log(displayTable(repoInfo));

        // Fetch guidelines
        const fetchSpinner = await startSpinner(
          `Fetching guidelines from ${chalk.cyan(repoPath)}...`
        );

        const octokit = await initializeOctokit();
        let contributing = null;
        let codeOfConduct = null;
        let contributingPath = null;
        let codeOfConductPath = null;

        try {
          // Get community profile metrics to find file paths
          const { data: metrics } = await octokit.repos.getCommunityProfileMetrics({
            owner,
            repo,
          });

          // Fetch CONTRIBUTING.md if available and not excluded
          if (
            metrics.files?.contributing &&
            !options.codeOfConduct
          ) {
            try {
              contributingPath = metrics.files.contributing.path;
              const { data: contribData } = await octokit.repos.getContent({
                owner,
                repo,
                path: contributingPath,
              });
              contributing = Buffer.from(contribData.content, 'base64').toString(
                'utf-8'
              );
            } catch (error) {
              // File not found, continue
            }
          }

          // Fetch CODE_OF_CONDUCT.md if available and not excluded
          if (
            metrics.files?.code_of_conduct &&
            !options.contributing
          ) {
            try {
              codeOfConductPath = metrics.files.code_of_conduct.path;
              const { data: cocData } = await octokit.repos.getContent({
                owner,
                repo,
                path: codeOfConductPath,
              });
              codeOfConduct = Buffer.from(cocData.content, 'base64').toString(
                'utf-8'
              );
            } catch (error) {
              // File not found, continue
            }
          }

          fetchSpinner.succeed(chalk.green('✓ Guidelines fetched'));
        } catch (error) {
          fetchSpinner.warn(
            chalk.yellow(`⚠ Could not fetch all files: ${error.message}`)
          );
        }

        // Display CONTRIBUTING.md
        if (contributing && !options.codeOfConduct) {
          printSection('CONTRIBUTING.md');
          const displayContent = options.brief
            ? contributing.substring(0, 500) + '\n...\n[truncated]'
            : contributing;
          console.log(chalk.dim(displayContent));
          console.log();
        } else if (!contributing && !options.codeOfConduct) {
          printInfo('No CONTRIBUTING.md found in this repository');
          console.log();
        }

        // Display CODE_OF_CONDUCT.md
        if (codeOfConduct && !options.contributing) {
          printSection('CODE_OF_CONDUCT.md');
          const displayContent = options.brief
            ? codeOfConduct.substring(0, 500) + '\n...\n[truncated]'
            : codeOfConduct;
          console.log(chalk.dim(displayContent));
          console.log();
        } else if (!codeOfConduct && !options.contributing) {
          printInfo('No CODE_OF_CONDUCT.md found in this repository');
          console.log();
        }

        // Show files summary
        printSection('Files Available');
        const filesTable = [
          ['File', 'Status'],
          [
            'CONTRIBUTING.md',
            contributing
              ? chalk.green('✓ Found')
              : chalk.dim('✗ Not found'),
          ],
          [
            'CODE_OF_CONDUCT.md',
            codeOfConduct
              ? chalk.green('✓ Found')
              : chalk.dim('✗ Not found'),
          ],
        ];
        console.log(displayTable(filesTable));

        // Show file paths if found
        if (contributing || codeOfConduct) {
          printSection('File Paths');
          if (contributing) {
            console.log(
              chalk.dim(`CONTRIBUTING.md: ${chalk.cyan(contributingPath)}`)
            );
          }
          if (codeOfConduct) {
            console.log(
              chalk.dim(`CODE_OF_CONDUCT.md: ${chalk.cyan(codeOfConductPath)}`)
            );
          }
          console.log();
        }

        // Show next steps
        printSection('Next Steps');
        console.log(chalk.dim('1. Review the guidelines carefully'));
        console.log();
        console.log(chalk.dim('2. Find issues to work on:'));
        console.log(chalk.cyan(`   contriflow issues ${repoPath}`));
        console.log();
        console.log(chalk.dim('3. Fork the repository:'));
        console.log(chalk.cyan(`   contriflow fork ${repoPath}`));
        console.log();
        console.log(chalk.dim('4. Clone your fork:'));
        console.log(chalk.cyan(`   contriflow clone your-username/${repo}`));
        console.log();

        // Show view online option
        console.log(chalk.dim('View online:'));
        if (contributing) {
          console.log(
            chalk.blue(
              `   ${repoDetails.url}/blob/main/${contributingPath || 'CONTRIBUTING.md'}`
            )
          );
        }
        if (codeOfConduct) {
          console.log(
            chalk.blue(
              `   ${repoDetails.url}/blob/main/${codeOfConductPath || 'CODE_OF_CONDUCT.md'}`
            )
          );
        }

        if (contributing || codeOfConduct) {
          printSuccess(
            '\n✓ Guidelines retrieved! Ready to start contributing responsibly.'
          );
        } else {
          printInfo(
            '\n⚠ No contribution guidelines found. Check repository for CONTRIBUTING.md in root or docs folder.'
          );
        }
      } catch (error) {
        printError(`Unexpected error: ${error.message}`);
      }
    });
}

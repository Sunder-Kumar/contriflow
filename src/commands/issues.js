import chalk from 'chalk';
import { searchIssues, getIssueDetails } from '../services/issueService.js';
import {
  printHeader,
  printError,
  printSection,
  startSpinner,
  formatIssueInfo,
  prompt,
} from '../utils/display.js';

export function issuesCommand(program) {
  program
    .command('issues')
    .description('Find beginner-friendly issues')
    .option('-l, --label <label>', 'Issue label (default: good-first-issue)', 'good-first-issue')
    .option('--language <language>', 'Filter by programming language')
    .option('--min-stars <number>', 'Minimum stars (default: 10)', '10')
    .option('--max-stars <number>', 'Maximum stars (default: 50000)', '50000')
    .option('-p, --per-page <number>', 'Results per page (default: 10)', '10')
    .action(async (options) => {
      printHeader('Beginner-Friendly Issues');

      try {
        const spinner = await startSpinner('Searching for issues...');

        const issues = await searchIssues({
          label: options.label,
          language: options.language,
          minStars: parseInt(options.minStars),
          maxStars: parseInt(options.maxStars),
          perPage: parseInt(options.perPage),
        });

        spinner.succeed(
          chalk.green(`✓ Found ${issues.length} issues`)
        );

        if (issues.length === 0) {
          console.log(chalk.yellow('No issues found matching criteria.'));
          return;
        }

        printSection('Available Issues');
        issues.forEach((issue, index) => {
          console.log(`\n${index + 1}. ${formatIssueInfo(issue)}`);
        });

        const selected = await prompt([
          {
            type: 'list',
            name: 'issue',
            message: 'Select an issue to view details:',
            choices: issues.map((i) => ({
              name: `#${i.number} ${i.title}`,
              value: i,
            })),
          },
        ]);

        const spinner2 = await startSpinner('Fetching issue details...');
        const details = await getIssueDetails(
          selected.issue.owner,
          selected.issue.repo,
          selected.issue.number
        );
        spinner2.succeed();

        printSection('Issue Details');
        console.log(chalk.bold(`Title: ${details.title}`));
        console.log(chalk.gray(`Author: ${details.author}`));
        console.log(chalk.gray(`Created: ${new Date(details.createdAt).toLocaleDateString()}`));
        console.log(`\n${chalk.bold('Description:')}\n${details.body}`);
        console.log(chalk.blue(`\nView online: ${details.url}`));

        const next = await prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Would you like to fork and work on this issue?',
          },
        ]);

        if (next.proceed) {
          console.log(
            chalk.cyan(
              `\nRun: contriflow setup --repo ${selected.issue.owner}/${selected.issue.repo} --issue ${selected.issue.number}`
            )
          );
        }
      } catch (error) {
        printError(`Failed to fetch issues: ${error.message}`);
      }
    });
}

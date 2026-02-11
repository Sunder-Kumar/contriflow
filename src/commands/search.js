import chalk from 'chalk';
import { searchRepositories } from '../services/repositoryService.js';
import {
  printHeader,
  printSuccess,
  printError,
  printSection,
  startSpinner,
  formatRepositoryInfo,
  prompt,
} from '../utils/display.js';

export function searchCommand(program) {
  program
    .command('search')
    .description('Search for open-source repositories')
    .option('-k, --keyword <keyword>', 'Search keyword')
    .option('-l, --language <language>', 'Filter by programming language')
    .option('--min-stars <number>', 'Minimum stars (default: 10)', '10')
    .option('--max-stars <number>', 'Maximum stars (default: 50000)', '50000')
    .option('-p, --per-page <number>', 'Results per page (default: 10)', '10')
    .action(async (options) => {
      printHeader('Repository Search');

      try {
        let keyword = options.keyword;

        if (!keyword) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'keyword',
              message: 'Enter search keyword:',
              validate: (input) => input.length > 0 || 'Keyword cannot be empty',
            },
          ]);
          keyword = answers.keyword;
        }

        const spinner = await startSpinner(
          `Searching repositories for "${keyword}"...`
        );

        const repos = await searchRepositories(keyword, {
          language: options.language,
          minStars: parseInt(options.minStars),
          maxStars: parseInt(options.maxStars),
          perPage: parseInt(options.perPage),
        });

        spinner.succeed(chalk.green(`✓ Found ${repos.length} repositories`));

        if (repos.length === 0) {
          console.log(chalk.yellow('No repositories found matching criteria.'));
          return;
        }

        printSection('Results');
        repos.forEach((repo, index) => {
          console.log(`\n${index + 1}. ${formatRepositoryInfo(repo)}`);
        });

        const selected = await prompt([
          {
            type: 'list',
            name: 'repo',
            message: 'Select a repository to explore:',
            choices: repos.map((r) => ({
              name: `${r.name} (${r.stars}⭐)`,
              value: r,
            })),
          },
        ]);

        console.log(chalk.cyan(`\nSelected: ${selected.repo.fullName}`));
        console.log(
          chalk.dim(`To fork and clone: contriflow setup --repo ${selected.repo.fullName}`)
        );
      } catch (error) {
        printError(`Search failed: ${error.message}`);
      }
    });
}

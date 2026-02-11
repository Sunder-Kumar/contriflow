import chalk from 'chalk';
import { searchRepositories } from '../services/repositoryService.js';
import {
  printHeader,
  printSuccess,
  printError,
  printSection,
  startSpinner,
  formatRepositoryInfo,
  displayTable,
  prompt,
} from '../utils/display.js';

export function searchCommand(program) {
  program
    .command('search [keyword]')
    .description('Search for open-source repositories')
    .option('-k, --keyword <keyword>', 'Search keyword (alternative to argument)')
    .option('-l, --language <language>', 'Filter by programming language')
    .option('--stars <number>', 'Minimum stars (shorthand for --min-stars)')
    .option('--min-stars <number>', 'Minimum stars (default: 10)', '10')
    .option('--max-stars <number>', 'Maximum stars (default: 50000)', '50000')
    .option('-p, --per-page <number>', 'Results per page (default: 10)', '10')
    .option('-t, --table', 'Display results in table format (default)')
    .option('--no-table', 'Display results in list format')
    .option('--interactive', 'Show interactive selection (default: true)', true)
    .option('--no-interactive', 'Skip interactive selection')
    .action(async (keywordArg, options) => {
      printHeader('🔍 Repository Search');

      try {
        // Handle keyword from argument or option
        let keyword = keywordArg || options.keyword;

        if (!keyword) {
          const answers = await prompt([
            {
              type: 'input',
              name: 'keyword',
              message: 'Enter search keyword:',
              validate: (input) =>
                input.length > 0 || 'Keyword cannot be empty',
            },
          ]);
          keyword = answers.keyword;
        }

        // Handle --stars shorthand (overrides --min-stars)
        let minStars = parseInt(options.minStars);
        if (options.stars) {
          minStars = parseInt(options.stars);
        }

        const spinner = await startSpinner(
          `Searching repositories for "${chalk.bold(keyword)}"...`
        );

        const repos = await searchRepositories(keyword, {
          language: options.language,
          minStars,
          maxStars: parseInt(options.maxStars),
          perPage: parseInt(options.perPage),
        });

        spinner.succeed(chalk.green(`✓ Found ${repos.length} repositories`));

        if (repos.length === 0) {
          console.log(chalk.yellow('No repositories found matching criteria.'));
          console.log(chalk.dim('Try adjusting your search filters.'));
          return;
        }

        // Display results
        if (options.table) {
          displaySearchTable(repos);
        } else {
          displaySearchList(repos);
        }

        // Interactive selection
        if (options.interactive) {
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

          console.log('');
          printSection('Selected Repository');
          console.log(formatRepositoryInfo(selected.repo));
          console.log(chalk.dim(
            `\nTo fork and clone: ${chalk.cyan(`contriflow setup --repo ${selected.repo.fullName}`)}`
          ));
        }
      } catch (error) {
        printError(`Search failed: ${error.message}`);
      }
    });
}

/**
 * Display search results in table format
 */
function displaySearchTable(repos) {
  printSection('Search Results (Table View)');
  console.log('');

  const headers = ['#', 'Repository', 'Stars', 'Language', 'Description'];
  const rows = repos.map((repo, index) => [
    (index + 1).toString(),
    chalk.bold.cyan(repo.fullName),
    chalk.yellow(repo.stars.toString()),
    chalk.green(repo.language || '-'),
    (repo.description || chalk.dim('No description')).substring(0, 40) +
      (repo.description && repo.description.length > 40 ? '...' : ''),
  ]);

  displayTable(headers, rows);

  console.log('');
  console.log(chalk.dim(`Repository URLs are clickable. Visit: ${repos[0].url}`));
  console.log('');
}

/**
 * Display search results in list format
 */
function displaySearchList(repos) {
  printSection('Search Results (List View)');

  repos.forEach((repo, index) => {
    console.log(`\n${index + 1}. ${formatRepositoryInfo(repo)}`);
  });

  console.log('');
}

import chalk from 'chalk';
import {
  searchIssues,
  listRepositoryIssues,
  getIssueDetails,
} from '../services/issueService.js';
import {
  printHeader,
  printError,
  printInfo,
  printSection,
  startSpinner,
  formatIssueInfo,
  displayTable,
  displayIssuesTable,
  prompt,
} from '../utils/display.js';

export function issuesCommand(program) {
  program
    .command('issues [repo]')
    .description(
      'Find and list GitHub issues (global search or repo-specific)'
    )
    .option(
      '-l, --label <label>',
      'Issue label (default: good-first-issue for global, none for repo)',
      null
    )
    .option('--language <language>', 'Filter by programming language')
    .option('--min-stars <number>', 'Minimum stars (global search only)', '10')
    .option('--max-stars <number>', 'Maximum stars (global search only)', '50000')
    .option('-p, --per-page <number>', 'Results per page (default: 10)', '10')
    .option('--state <state>', 'Issue state: open, closed, all (default: open)', 'open')
    .option('-t, --table', 'Display results in table format (default)')
    .option('--no-table', 'Display results in list format')
    .option('--interactive', 'Show interactive selection (default)', true)
    .option('--no-interactive', 'Skip interactive selection')
    .action(async (repoArg, options) => {
      try {
        // Determine if global search or repo-specific
        const isRepoSpecific = !!repoArg;

        if (isRepoSpecific) {
          await handleRepoSpecificIssues(repoArg, options);
        } else {
          await handleGlobalIssueSearch(options);
        }
      } catch (error) {
        printError(`Failed to fetch issues: ${error.message}`);
      }
    });
}

/**
 * Handle global issue search
 */
async function handleGlobalIssueSearch(options) {
  printHeader('🔍 Global Issue Search');

  let spinner = null;
  try {
    const label = options.label || 'good-first-issue';
    spinner = await startSpinner('Searching for issues...');

    const issues = await searchIssues({
      label,
      language: options.language,
      minStars: parseInt(options.minStars),
      maxStars: parseInt(options.maxStars),
      perPage: parseInt(options.perPage),
      state: options.state,
    });

    spinner.succeed(chalk.green(`✓ Found ${issues.length} issues`));

    if (issues.length === 0) {
      console.log(chalk.yellow('No issues found matching criteria.'));
      return;
    }

    // Display results
    if (options.table) {
      displayGlobalIssuesTable(issues);
    } else {
      displayGlobalIssuesList(issues);
    }

    // Interactive selection
    if (options.interactive) {
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

      let spinner2 = null;
      try {
        spinner2 = await startSpinner('Fetching issue details...');
        const details = await getIssueDetails(
          selected.issue.owner,
          selected.issue.repo,
          selected.issue.number
        );
        spinner2.succeed();

        printSection('Issue Details');
        console.log(chalk.bold(`Title: ${details.title}`));
        console.log(chalk.gray(`Repository: ${selected.issue.repository}`));
        console.log(chalk.gray(`Author: ${details.author}`));
        console.log(
          chalk.gray(
            `Created: ${new Date(details.createdAt).toLocaleDateString()}`
          )
        );
        console.log(`\n${chalk.bold('Description:')}\n${details.body || chalk.dim('No description')}`);
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
      } catch (err) {
        if (spinner2) spinner2.fail(chalk.red(`✗ Failed to fetch issue details: ${err.message}`));
        else if (spinner) spinner.fail(chalk.red(`✗ Failed during issue selection: ${err.message}`));
        return;
      }
    }
  } catch (error) {
    if (spinner) spinner.fail(chalk.red(`✗ Failed to fetch issues: ${error.message}`));
    else printError(`Failed to fetch issues: ${error.message}`);
    return;
  }
}

/**
 * Handle repository-specific issues
 */
async function handleRepoSpecificIssues(repo, options) {
  const [owner, repoName] = repo.split('/');

  if (!owner || !repoName) {
    printError('Invalid repository format. Use: owner/repo');
    return;
  }

  const labelText = options.label ? ` with label: ${options.label}` : '';
  printHeader(`📋 Issues - ${chalk.bold(repo)}${labelText}`);

  let spinner = null;
  try {
    spinner = await startSpinner(`Fetching issues from ${repo}...`);

    const issues = await listRepositoryIssues(owner, repoName, {
      label: options.label || null,
      state: options.state,
      perPage: parseInt(options.perPage),
    });

    spinner.succeed(chalk.green(`✓ Found ${issues.length} issues`));

    if (issues.length === 0) {
      printInfo('No issues found in this repository.');
      console.log(chalk.dim('Try adjusting filters or check repository status.'));
      return;
    }

    // Display results
    if (options.table) {
      const tableTitle = options.label 
        ? `📋 Issues in ${repo} with label: ${options.label}`
        : `📋 Issues in ${repo}`;
      displayIssuesTable(issues, tableTitle);
    } else {
      displayRepoIssuesList(issues);
    }

    // Interactive selection
    if (options.interactive) {
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

      let spinner2 = null;
      try {
        spinner2 = await startSpinner('Fetching issue details...');
        const details = await getIssueDetails(owner, repoName, selected.issue.number);
        spinner2.succeed();

        printSection('Issue Details');
        console.log(chalk.bold(`Title: ${details.title}`));
        console.log(chalk.gray(`Number: #${details.number}`));
        console.log(chalk.gray(`Author: ${details.author}`));
        console.log(chalk.gray(`State: ${chalk.cyan(details.state)}`));
        console.log(
          chalk.gray(
            `Created: ${new Date(details.createdAt).toLocaleDateString()}`
          )
        );
        if (details.labels.length > 0) {
          console.log(
            chalk.gray(
              `Labels: ${details.labels.map((l) => chalk.bgCyan.black(` ${l} `)).join(' ')}`
            )
          );
        }
        console.log(`\n${chalk.bold('Description:')}\n${details.body || chalk.dim('No description')}`);
        console.log(chalk.blue(`\nView online: ${details.url}`));
        console.log(chalk.gray(`Comments: ${details.comments}`));

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
              `\nRun: contriflow setup --repo ${repo} --issue ${selected.issue.number}`
            )
          );
        }
      } catch (err) {
        if (spinner2) spinner2.fail(chalk.red(`✗ Failed to fetch issue details: ${err.message}`));
        else if (spinner) spinner.fail(chalk.red(`✗ Failed during issue selection: ${err.message}`));
        return;
      }
    }
  } catch (error) {
    if (spinner) spinner.fail(chalk.red(`✗ Failed to fetch issues: ${error.message}`));
    else printError(`Failed to fetch issues: ${error.message}`);
    return;
  }
}

/**
 * Display global search results in table format
 */
function displayGlobalIssuesTable(issues) {
  displayIssuesTable(issues, '📋 Global Issue Search Results');
}

/**
 * Display global search results in list format
 */
function displayGlobalIssuesList(issues) {
  printSection('Search Results (List View)');

  issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${formatIssueInfo(issue)}`);
  });

  console.log('');
}

/**
 * Display repository issues in table format
 */
function displayRepoIssuesTable(issues) {
  displayIssuesTable(issues, '📋 Repository Issues');
}

/**
 * Display repository issues in list format
 */
function displayRepoIssuesList(issues) {
  printSection('Issues (List View)');

  issues.forEach((issue, index) => {
    const labels = issue.labels.map((l) => chalk.bgBlue.white(` ${l} `)).join(' ');
    const state = issue.state === 'open' ? chalk.green('open') : chalk.red('closed');
    
    console.log(`\n${index + 1}. ${chalk.bold(`#${issue.number} ${issue.title}`)}`);
    console.log(`   ${labels}`);
    console.log(chalk.gray(`   Author: ${issue.author} | State: ${state}`));
    console.log(chalk.blue(`   ${issue.url}`));
  });

  console.log('');
}

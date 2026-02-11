import chalk from 'chalk';
import ora from 'ora';
import { searchIssues, getIssueDetails } from '../services/issueService.js';
import { suggestFixForIssue } from '../services/ai.js';
import { ContributionDatabase } from '../db/contributionDb.js';
import {
  printHeader,
  printError,
  printSection,
  printSuccess,
  formatStreakStats,
  prompt,
  clearScreen,
} from '../utils/display.js';

const db = new ContributionDatabase();

export function contributeCommand(program) {
  program
    .command('contribute')
    .description('Start Contribute Mode: find daily issues and track streaks')
    .option('-l, --language <language>', 'Preferred programming language')
    .option('--daily', 'Show only daily challenges')
    .option('--stats', 'Show contribution statistics')
    .action(async (options) => {
      if (options.stats) {
        await showStats();
        return;
      }

      await contributeMode(options);
    });
}

async function contributeMode(options) {
  clearScreen();
  printHeader('ContriFlow Contribute Mode 🎯');

  try {
    while (true) {
      const stats = await db.getStats();
      console.log(formatStreakStats(stats));

      const menu = await prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🔍 Find new issues', value: 'search' },
            { name: '📊 View my stats', value: 'stats' },
            { name: '📝 View recent contributions', value: 'history' },
            { name: '🏆 View leaderboard', value: 'leaderboard' },
            { name: '❌ Exit', value: 'exit' },
          ],
        },
      ]);

      switch (menu.action) {
        case 'search':
          await findDailyIssues(options.language);
          break;
        case 'stats':
          await showStats();
          break;
        case 'history':
          await showHistory();
          break;
        case 'leaderboard':
          await showLeaderboard();
          break;
        case 'exit':
          console.log(chalk.cyan('\n🚀 Keep contributing! See you next time.'));
          return;
      }

      console.log('');
    }
  } catch (error) {
    printError(`Contribute mode error: ${error.message}`);
  }
}

async function findDailyIssues(language) {
  printSection('Finding daily challenges...');

  const spinner = ora(chalk.cyan('Searching for beginner-friendly issues...')).start();

  try {
    const issues = await searchIssues({
      label: 'good-first-issue',
      language,
      perPage: 5,
    });

    spinner.succeed(chalk.green(`✓ Found ${issues.length} issues`));

    if (issues.length === 0) {
      printError('No issues found. Try adjusting your filters.');
      return;
    }

    const selected = await prompt([
      {
        type: 'list',
        name: 'issue',
        message: 'Pick a challenge:',
        choices: issues.map((i) => ({
          name: `#${i.number} ${i.title}`,
          value: i,
        })),
      },
    ]);

    const spinner2 = ora(chalk.cyan('Fetching issue details...')).start();
    const details = await getIssueDetails(
      selected.issue.owner,
      selected.issue.repo,
      selected.issue.number
    );
    spinner2.succeed();

    printSection('Issue Details');
    console.log(chalk.bold(details.title));
    console.log(chalk.gray(`Repository: ${selected.issue.repository}`));
    console.log(`\n${details.body}`);
    console.log(chalk.blue(`\n${details.url}`));

    const getHelp = await prompt([
      {
        type: 'confirm',
        name: 'help',
        message: 'Would you like AI suggestions for this issue?',
      },
    ]);

    if (getHelp.help) {
      const aiSpinner = ora(chalk.cyan('Generating AI suggestions...')).start();
      try {
        const suggestion = await suggestFixForIssue(
          details.body,
          details.title,
          'JavaScript'
        );
        aiSpinner.succeed(chalk.green('✓ AI Suggestions:'));
        printSection('Suggested Fix');
        console.log(suggestion);
      } catch (error) {
        aiSpinner.fail(chalk.yellow('Could not generate suggestions'));
      }
    }

    const contribution = await prompt([
      {
        type: 'confirm',
        name: 'start',
        message: 'Ready to work on this issue?',
      },
    ]);

    if (contribution.start) {
      await db.addContribution({
        issueNumber: selected.issue.number,
        issueTitle: selected.issue.title,
        repository: selected.issue.repository,
        issueUrl: selected.issue.url,
        points: 25,
        completed: false,
      });

      printSuccess('Issue added to your tracker!');
      console.log(
        chalk.cyan(
          `\nRun: contriflow setup --repo ${selected.issue.repository} --issue ${selected.issue.number}`
        )
      );
    }
  } catch (error) {
    spinner.fail(printError(error.message));
  }
}

async function showStats() {
  const stats = await db.getStats();
  printSection('📊 Your Contribution Statistics');
  console.log(formatStreakStats(stats));
}

async function showHistory() {
  const contributions = await db.getContributions(10);
  
  if (contributions.length === 0) {
    console.log(chalk.yellow('No contributions yet. Start by finding an issue!'));
    return;
  }

  printSection('📝 Recent Contributions');
  contributions.forEach((c, i) => {
    const repoText = c.repository || 'Unknown';
    console.log(
      `${i + 1}. ${chalk.bold(c.issueTitle)} ${chalk.dim(`(${repoText})`)}`
    );
  });
}

async function showLeaderboard() {
  console.log(chalk.bold.yellow('\n🏆 Leaderboard (Coming Soon!)'));
  console.log(
    chalk.dim('Community leaderboard and profiles will be available soon.')
  );
}

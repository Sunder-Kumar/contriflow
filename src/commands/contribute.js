import chalk from 'chalk';
import { Octokit } from '@octokit/rest';
import {
  displayTable,
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  startSpinner,
  prompt
} from '../utils/display.js';
import { loadConfig } from '../config/configManager.js';
import {
  recordContribution,
  getTodayProgress,
  getStats,
  initContributionsDb,
  getLevelXP
} from '../services/contributionService.js';
import {
  findDailyIssues,
  getUserGitHubStats
} from '../services/trendingService.js';

export function contributeCommand(program) {
  program
    .command('contribute')
    .description('Start Contribute Mode: find daily issues and track streaks')
    .option('--daily', 'Find and show today\'s issue suggestions')
    .option('--track <issueNumber>', 'Track a solved issue')
    .option('--repo <repo>', 'Repository for tracking (owner/repo format)')
    .option('--dashboard', 'Show your contribution dashboard')
    .option('--streak', 'Show your streak information')
    .action(async (options) => {
      await handleContributeCommand(options);
    });
}

async function handleContributeCommand(options) {
  try {
    // Initialize contributions database
    await initContributionsDb();

    const cfg = await loadConfig();
    if (!cfg.githubToken) {
      throw new Error('Not authenticated. Run: contriflow login');
    }

    // If --daily flag
    if (options.daily) {
      await showDailyChallenge(cfg);
    }
    // If --track flag
    else if (options.track) {
      await trackIssue(options, cfg);
    }
    // If --dashboard flag
    else if (options.dashboard) {
      await showDashboard(cfg);
    }
    // If --streak flag
    else if (options.streak) {
      await showStreakInfo();
    }
    // Default: show dashboard
    else {
      await showDashboard(cfg);
    }
  } catch (error) {
    printError(`Contribute Error: ${error.message}`);
    process.exit(1);
  }
}

async function showDailyChallenge(cfg) {
  const octokit = new Octokit({ auth: cfg.githubToken });

  printHeader('🎯 Daily Contribution Challenge');

  let spinner = await startSpinner('Finding trending repositories with beginner issues...');

  try {
    const languages = ['javascript', 'python', 'typescript', 'go'];
    const issues = await findDailyIssues(octokit, languages, 3);

    spinner.succeed(`Found ${issues.length} issues to solve today!`);

    if (issues.length === 0) {
      printError('No beginner-friendly issues found today. Try again later!');
      return;
    }

    printSection('Your Daily Issues');

    const issueTable = issues.map((issue, idx) => ({
      '#': idx + 1,
      'Issue': `#${issue.number}: ${issue.title.substring(0, 40)}`,
      'Repo': issue.repository,
      'Stars': issue.repositoryStars,
      'URL': issue.url
    }));

    displayTable(issueTable, ['#', 'Issue', 'Repo', 'Stars']);

    printInfo('\n💡 Tips:');
    printInfo('  1. Click on a URL above to view the issue details');
    printInfo('  2. Run: contriflow solve <issue_number> <owner/repo>');
    printInfo('  3. After solving, run: contriflow contribute --track <issue_number> --repo <owner/repo>');
    printInfo('  4. Finally, run: contriflow pr <issue_number> <owner/repo>');

    // Show progress
    const progress = await getTodayProgress();
    printSection('Today\'s Progress');
    const progressBar = generateProgressBar(progress.progressPercent, 30);
    printInfo(`${progressBar} ${progress.solvedToday}/${progress.dailyGoal} issues`);

    if (progress.goalMet) {
      printSuccess('🎉 Daily goal met! Great work!');
    }
  } catch (error) {
    spinner.fail(`Failed to fetch issues: ${error.message}`);
  }
}

async function trackIssue(options, cfg) {
  const issueNumber = options.track;
  const repo = options.repo;

  if (!issueNumber || !repo) {
    throw new Error('Usage: contriflow contribute --track <issue_number> --repo <owner/repo>');
  }

  if (!/^[^\/]+\/[^\/]+$/.test(repo)) {
    throw new Error('Invalid repo format. Use: owner/repo');
  }

  const [owner, repoName] = repo.split('/');
  const octokit = new Octokit({ auth: cfg.githubToken });

  let spinner = await startSpinner('Fetching issue details...');

  try {
    const issue = await octokit.issues.get({
      owner,
      repo: repoName,
      issue_number: parseInt(issueNumber)
    });

    spinner.succeed('Issue fetched');

    const result = await recordContribution(
      parseInt(issueNumber),
      repo,
      issue.data.title
    );

    if (result.success) {
      printSuccess(`✅ ${result.message}`);
      printInfo(`Issue: ${issue.data.title}`);
      printInfo(`Repository: ${repo}`);

      const stats = await getStats();
      printInfo(`\n📊 Your Stats:`);
      printInfo(`   Current Streak: ${generateStreakVisual(stats.currentStreak)}`);
      printInfo(`   Level: ${stats.currentStreak > 0 ? stats.level : 0} (${stats.totalContributions}/${getLevelXP(stats.level)} XP)`);

      // Show progress
      const progress = await getTodayProgress();
      const progressBar = generateProgressBar(progress.progressPercent, 20);
      printInfo(`\n${progressBar} ${progress.solvedToday}/${progress.dailyGoal} today`);

      if (progress.goalMet) {
        printSuccess('\n🎉 You\'ve met your daily goal!');
      }
    } else {
      printError(result.message);
    }
  } catch (error) {
    spinner.fail(`Failed to track issue: ${error.message}`);
  }
}

async function showDashboard(cfg) {
  const octokit = new Octokit({ auth: cfg.githubToken });
  const stats = await getStats();

  printHeader('📊 Contribution Dashboard');

  // Get user info
  let spinner = await startSpinner('Loading your stats...');

  try {
    const config = await loadConfig();
    let userInfo = null;

    if (config.githubUsername) {
      try {
        userInfo = await getUserGitHubStats(octokit, config.githubUsername);
      } catch (err) {
        // Continue without GitHub stats
      }
    }

    spinner.succeed('Stats loaded');

    // Level and XP section
    printSection('Level & Experience');
    const level = stats.level;
    const currentXP = stats.totalContributions % getLevelXP(level);
    const requiredXP = getLevelXP(level);
    const xpPercent = Math.round((currentXP / requiredXP) * 100);
    const xpBar = generateProgressBar(xpPercent, 25);

    printInfo(`⭐ Level: ${chalk.bold(level.toString())}`);
    printInfo(`   ${xpBar} ${currentXP}/${requiredXP} XP`);

    // Streak section
    printSection('Contribution Streak');
    const streakVisual = generateStreakVisual(stats.currentStreak);
    printInfo(`🔥 Current Streak: ${chalk.yellow(streakVisual)}`);
    printInfo(`⭐ Longest Streak: ${chalk.cyan(stats.longestStreak + ' days')}`);
    printInfo(`📅 Last Contribution: ${stats.lastContributionDate || 'Never'}`);

    // Statistics section
    printSection('Statistics');
    printInfo(`✅ Total Contributions: ${chalk.green(stats.totalContributions.toString())}`);
    printInfo(`📝 Total Issues Tracked: ${stats.totalIssuesTracked || 0}`);
    printInfo(`🔀 Pull Requests Created: ${stats.totalPRsCreated}`);

    // Badges section
    if (stats.badges && stats.badges.length > 0) {
      printSection('Badges');
      const badgesToShow = stats.badges.slice(-6); // Show last 6 badges
      for (const badge of badgesToShow) {
        printInfo(`${badge.name} - ${badge.description}`);
      }
      if (stats.badges.length > 6) {
        printInfo(`... and ${stats.badges.length - 6} more badges!`);
      }
    }

    // GitHub section (if available)
    if (userInfo) {
      printSection('GitHub Profile');
      printInfo(`👤 Public Repos: ${userInfo.publicRepos}`);
      printInfo(`👥 Followers: ${userInfo.followers}`);
      printInfo(`🔗 Profile: ${userInfo.profileUrl}`);
    }

    // Today's progress
    const progress = await getTodayProgress();
    printSection('Today\'s Progress');
    const progressBar = generateProgressBar(progress.progressPercent, 30);
    printInfo(`${progressBar} ${progress.solvedToday}/${progress.dailyGoal} issues`);

    if (progress.goalMet) {
      printSuccess('🎉 Goal met! Great work!');
    } else {
      const remaining = progress.dailyGoal - progress.solvedToday;
      printInfo(`💪 ${remaining} more issue${remaining !== 1 ? 's' : ''} to reach your goal!`);
    }

    // Next steps
    printSection('Next Steps');
    printInfo('  1. Run: contriflow contribute --daily');
    printInfo('  2. Pick an issue to solve');
    printInfo('  3. Run: contriflow solve <issue_number> <owner/repo>');
    printInfo('  4. Run: contriflow pr <issue_number> <owner/repo>');
  } catch (error) {
    spinner.fail(`Failed to load dashboard: ${error.message}`);
  }
}

async function showStreakInfo() {
  const stats = await getStats();

  printHeader('🔥 Streak Information');

  printSection('Current Streak');
  printInfo(`Days: ${chalk.yellow(stats.currentStreak.toString())}`);
  if (stats.currentStreak > 0) {
    const emojis = '🔥'.repeat(Math.min(stats.currentStreak, 10));
    printInfo(`Visual: ${emojis}${stats.currentStreak > 10 ? ` (+${stats.currentStreak - 10})` : ''}`);
  }

  printSection('All-Time Record');
  printInfo(`Longest Streak: ${chalk.cyan(stats.longestStreak + ' days')}`);
  printInfo(`Started: ${stats.lastContributionDate || 'Never contributed'}`);

  printSection('Milestone Achievements');
  const milestones = [
    { days: 3, emoji: '🔥', name: 'First Fire' },
    { days: 7, emoji: '🌟', name: 'One Week' },
    { days: 14, emoji: '✨', name: 'Two Weeks' },
    { days: 30, emoji: '👑', name: 'One Month' },
    { days: 100, emoji: '🚀', name: 'Century' }
  ];

  for (const milestone of milestones) {
    const achieved = stats.currentStreak >= milestone.days ? '✅' : '⭕';
    const progress = stats.currentStreak > 0 ? Math.round((stats.currentStreak / milestone.days) * 100) : 0;
    printInfo(`${achieved} ${milestone.emoji} ${milestone.name}: ${progress}%`);
  }
}

// Helper functions
function generateProgressBar(percent, length = 30) {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  let color = chalk.red;
  if (percent >= 50) color = chalk.yellow;
  if (percent >= 80) color = chalk.green;

  return `${color(bar)} ${percent}%`;
}

function generateStreakVisual(days) {
  if (days === 0) return '(no active streak)';
  if (days <= 10) return '🔥'.repeat(days);
  return `🔥 × ${days}`;
}

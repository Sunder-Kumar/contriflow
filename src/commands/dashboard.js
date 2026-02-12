import chalk from 'chalk';
import {
  printHeader,
  printInfo,
  printSuccess,
  printError,
  printSection,
  startSpinner
} from '../utils/display.js';
import { loadConfig } from '../config/configManager.js';
import {
  getStats,
  getTodayProgress,
  getContributionsDb,
  getTodayDate,
  isToday
} from '../services/contributionService.js';
import { getUserGitHubStats } from '../services/trendingService.js';
import { Octokit } from '@octokit/rest';

export function dashboardCommand(program) {
  program
    .command('dashboard')
    .description('Display your contribution dashboard with stats, streaks, and badges')
    .option('--detailed', 'Show detailed contribution history')
    .option('--badges', 'Show all earned badges')
    .option('--stats', 'Show only statistics')
    .option('--ascii', 'Show ASCII art visualization')
    .action(async (options) => {
      await handleDashboardCommand(options);
    });
}

async function handleDashboardCommand(options) {
  try {
    const cfg = await loadConfig();
    if (!cfg.githubToken) {
      throw new Error('Not authenticated. Run: contriflow login');
    }

    // Get all stats
    const stats = await getStats();
    const progress = await getTodayProgress();
    const db = await getContributionsDb();
    const octokit = new Octokit({ auth: cfg.githubToken });

    // Get GitHub profile stats
    let githubStats = null;
    if (cfg.githubUsername) {
      try {
        githubStats = await getUserGitHubStats(octokit, cfg.githubUsername);
      } catch (err) {
        // Continue without GitHub stats
      }
    }

    // Display based on options
    if (options.badges) {
      await showBadgesOnly(stats);
    } else if (options.stats) {
      await showStatsOnly(stats);
    } else if (options.detailed) {
      await showDetailedDashboard(stats, progress, db, githubStats);
    } else if (options.ascii) {
      await showASCIIDashboard(stats, progress, githubStats);
    } else {
      // Default: show full dashboard
      await showFullDashboard(stats, progress, db, githubStats);
    }
  } catch (error) {
    printError(`Dashboard Error: ${error.message}`);
    process.exit(1);
  }
}

async function showFullDashboard(stats, progress, db, githubStats) {
  printHeader('📊 ContriFlow Dashboard');

  // Level and XP section
  printSection('Level & Experience');
  const level = stats.level;
  const currentXP = stats.totalContributions % 10;
  const requiredXP = 10;
  const xpPercent = Math.round((currentXP / requiredXP) * 100);
  const xpBar = generateProgressBar(xpPercent, 25);

  printInfo(`⭐ Level: ${chalk.bold.cyan(level.toString())}`);
  printInfo(`   ${xpBar} ${currentXP}/${requiredXP} XP`);

  // Streak section with ASCII art
  printSection('Contribution Streak');
  printStreakVisual(stats.currentStreak);
  printInfo(`🔥 Current: ${chalk.yellow(stats.currentStreak + ' days')}`);
  printInfo(`⭐ Longest: ${chalk.cyan(stats.longestStreak + ' days')}`);
  if (stats.lastContributionDate) {
    printInfo(`📅 Last: ${stats.lastContributionDate}`);
  }

  // Statistics
  printSection('Statistics');
  printInfo(`✅ Total Contributions: ${chalk.green.bold(stats.totalContributions.toString())}`);
  printInfo(`📝 Total Issues Tracked: ${chalk.green.bold((stats.totalIssuesTracked || 0).toString())}`);
  printInfo(`🔀 Pull Requests Created: ${chalk.green.bold(stats.totalPRsCreated.toString())}`);

  // Today's progress
  printSection('Today\'s Progress');
  const progressBar = generateProgressBar(progress.progressPercent, 30);
  printInfo(`${progressBar}`);
  printInfo(`${progress.solvedToday}/${progress.dailyGoal} issues today`);
  if (progress.goalMet) {
    printSuccess('✨ Daily goal achieved! Great work!');
  }

  // Badges
  if (stats.badges && stats.badges.length > 0) {
    printSection('Badges');
    displayBadgesCompact(stats.badges);
  }

  // GitHub profile
  if (githubStats) {
    printSection('GitHub Profile');
    printInfo(`👤 Username: ${chalk.cyan(cfg.githubUsername)}`);
    printInfo(`📦 Public Repos: ${githubStats.publicRepos}`);
    printInfo(`👥 Followers: ${githubStats.followers}`);
    printInfo(`🔗 Profile: ${githubStats.profileUrl}`);
  }

  // Next steps
  printSection('Quick Commands');
  printInfo('  contriflow contribute --daily     # Get today\'s issues');
  printInfo('  contriflow dashboard --badges     # See all badges');
  printInfo('  contriflow dashboard --detailed   # Full history');
  printInfo('  contriflow dashboard --ascii      # ASCII visualization');
}

async function showASCIIDashboard(stats, progress, githubStats) {
  printHeader('📊 ASCII Dashboard');

  // Header art
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║          🎯 ContriFlow Contribution Dashboard 📊          ║
╚═══════════════════════════════════════════════════════════╝
  `));

  // Level section with ASCII art
  const levelBox = generateLevelBox(stats.level);
  console.log(levelBox);

  // Streak visualization
  const streakBox = generateStreakBox(stats.currentStreak, stats.longestStreak);
  console.log(streakBox);

  // Stats section
  const statsBox = generateStatsBox(stats, progress);
  console.log(statsBox);

  // Badges grid
  if (stats.badges && stats.badges.length > 0) {
    const badgesBox = generateBadgesGrid(stats.badges);
    console.log(badgesBox);
  }

  console.log(chalk.cyan(`
╚═══════════════════════════════════════════════════════════╝
  `));
}

async function showDetailedDashboard(stats, progress, db, githubStats) {
  printHeader('📊 Detailed Dashboard');

  // All stats
  printSection('Overview');
  printInfo(`Level: ${stats.level} | XP: ${stats.totalContributions} | Streak: ${stats.currentStreak} days`);

  // Historical data
  printSection('Contribution History');
  if (db.dailyHistory && db.dailyHistory.length > 0) {
    const lastDays = db.dailyHistory.slice(-14); // Last 14 days
    
    for (const day of lastDays) {
      // Ensure count is a valid positive number
      const count = Math.max(0, parseInt(day.count) || 0);
      const percent = progress.dailyGoal > 0 
        ? Math.min(100, (count / progress.dailyGoal) * 100) 
        : 0;
      const bar = generateProgressBar(percent, 15);
      const date = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      printInfo(`${date}: ${bar} ${count} issue${count !== 1 ? 's' : ''}`);
    }
  } else {
    printInfo('No contribution history yet');
  }

  // Badges timeline
  if (stats.badges && stats.badges.length > 0) {
    printSection('Badge Timeline');
    for (const badge of stats.badges.slice(-10)) {
      const earnDate = new Date(badge.earnedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
      printInfo(`${badge.name} - ${badge.description}`);
      printInfo(`  Earned: ${earnDate}`);
    }
  }
}

async function showBadgesOnly(stats) {
  printHeader('🏆 All Earned Badges');

  if (!stats.badges || stats.badges.length === 0) {
    printInfo('No badges earned yet. Start contributing to earn badges!');
    return;
  }

  // Group badges by category
  const categories = {
    streak: [],
    volume: [],
    collaboration: [],
    achievement: [],
    special: []
  };

  for (const badge of stats.badges) {
    if (badge.id.includes('streak')) {
      categories.streak.push(badge);
    } else if (badge.id.includes('contributions')) {
      categories.volume.push(badge);
    } else if (badge.id.includes('prs')) {
      categories.collaboration.push(badge);
    } else if (badge.id.includes('daily_goal')) {
      categories.achievement.push(badge);
    } else {
      categories.special.push(badge);
    }
  }

  // Display each category
  if (categories.streak.length > 0) {
    printSection('🔥 Streak Badges');
    for (const badge of categories.streak) {
      const earnDate = new Date(badge.earnedAt).toLocaleDateString();
      printInfo(`${badge.name} - ${badge.description} (${earnDate})`);
    }
  }

  if (categories.volume.length > 0) {
    printSection('💪 Volume Badges');
    for (const badge of categories.volume) {
      const earnDate = new Date(badge.earnedAt).toLocaleDateString();
      printInfo(`${badge.name} - ${badge.description} (${earnDate})`);
    }
  }

  if (categories.collaboration.length > 0) {
    printSection('🎪 Collaboration Badges');
    for (const badge of categories.collaboration) {
      const earnDate = new Date(badge.earnedAt).toLocaleDateString();
      printInfo(`${badge.name} - ${badge.description} (${earnDate})`);
    }
  }

  if (categories.achievement.length > 0) {
    printSection('🎯 Achievement Badges');
    for (const badge of categories.achievement) {
      const earnDate = new Date(badge.earnedAt).toLocaleDateString();
      printInfo(`${badge.name} - ${badge.description} (${earnDate})`);
    }
  }

  printSection('Summary');
  printInfo(`Total Badges: ${chalk.green.bold(stats.badges.length.toString())}`);
}

async function showStatsOnly(stats) {
  printHeader('📈 Statistics');

  printInfo(`Total Contributions: ${chalk.cyan.bold(stats.totalContributions.toString())}`);
  printInfo(`Current Level: ${chalk.cyan.bold(stats.level.toString())}`);
  printInfo(`Current Streak: ${chalk.yellow.bold(stats.currentStreak.toString())} days`);
  printInfo(`Longest Streak: ${chalk.cyan.bold(stats.longestStreak.toString())} days`);
  printInfo(`Total PRs Created: ${chalk.green.bold(stats.totalPRsCreated.toString())}`);
  printInfo(`Total Issues Tracked: ${chalk.green.bold((stats.totalIssuesTracked || 0).toString())}`);
  printInfo(`Badges Earned: ${chalk.magenta.bold((stats.badges ? stats.badges.length : 0).toString())}`);

  if (stats.lastContributionDate) {
    printInfo(`Last Contribution: ${stats.lastContributionDate}`);
  }
}

// Helper functions for ASCII art and visualization

function generateProgressBar(percent, length = 30) {
  // Ensure percent is between 0 and 100
  const validPercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round((validPercent / 100) * length);
  const empty = Math.max(0, length - filled);
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  let color = chalk.red;
  if (validPercent >= 50) color = chalk.yellow;
  if (validPercent >= 80) color = chalk.green;

  return `${color(bar)} ${validPercent}%`;
}

function generateStreakVisual(days) {
  if (days === 0) return '(no active streak)';
  if (days <= 10) return '🔥'.repeat(days);
  return `🔥 × ${days}`;
}

function printStreakVisual(days) {
  if (days > 0) {
    const emojis = days <= 30 ? '🔥'.repeat(days) : `🔥 × ${days}`;
    printInfo(`   ${emojis}`);
  }
}

function displayBadgesCompact(badges) {
  if (badges.length === 0) return;

  const badgesToShow = badges.slice(-8); // Show last 8
  const badgeStr = badgesToShow.map(b => b.name).join('  ');
  printInfo(badgeStr);

  if (badges.length > 8) {
    printInfo(`... and ${badges.length - 8} more badges!`);
  }
}

function padLine(text, totalWidth = 57) {
  // Account for ANSI color codes by calculating visible length
  const visibleLength = text.replace(/\x1b\[[0-9;]*m/g, '').length;
  const padding = Math.max(0, totalWidth - visibleLength);
  return text + ' '.repeat(padding);
}

function generateLevelBox(level) {
  const line1 = `⭐ LEVEL ${String(level).padStart(2)} ⭐`;
  const line2 = `📈 XP Progress ${String(level * 10).padStart(3)}/100`;
  
  return chalk.cyan(`
┌─────────────────────────────────────────────────────────┐
│${padLine(line1.padStart(Math.ceil((57 + line1.length) / 2)))}│
│${padLine(line2.padStart(Math.ceil((57 + line2.length) / 2)))}│
└─────────────────────────────────────────────────────────┘
  `);
}

function generateStreakBox(current, longest) {
  const currentVisual = current > 0 ? '🔥'.repeat(Math.min(current, 15)) : '(inactive)';
  const line1 = `🔥 CURRENT STREAK: ${String(current).padStart(2)} days`;
  const line2 = `⭐ LONGEST STREAK: ${String(longest).padStart(2)} days`;
  
  return chalk.yellow(`
┌─────────────────────────────────────────────────────────┐
│ ${padLine(line1, 55)} │
│ ${padLine(line2, 55)} │
│ ${padLine(currentVisual, 55)} │
└─────────────────────────────────────────────────────────┘
  `);
}

function generateStatsBox(stats, progress) {
  const line1 = `✅ CONTRIBUTIONS:  ${String(stats.totalContributions).padStart(3)}`;
  const line2 = `📝 ISSUES SOLVED:   ${String(stats.totalIssuesTracked || 0).padStart(3)}`;
  const line3 = `🔀 PRS CREATED:     ${String(stats.totalPRsCreated).padStart(3)}`;
  const progressBar = generateProgressBar(progress.progressPercent, 15);
  const line4 = `🎯 TODAY: ${String(progress.solvedToday).padStart(2)}/${String(progress.dailyGoal).padStart(2)} ${progressBar}`;
  
  return chalk.green(`
┌─────────────────────────────────────────────────────────┐
│ ${padLine(line1, 55)} │
│ ${padLine(line2, 55)} │
│ ${padLine(line3, 55)} │
│ ${padLine(line4, 55)} │
└─────────────────────────────────────────────────────────┘
  `);
}

function generateBadgesGrid(badges) {
  if (badges.length === 0) return '';

  const badgesToShow = badges.slice(-12); // Last 12 badges
  let grid = chalk.magenta(`
┌─────────────────────────────────────────────────────────┐
│ 🏆 BADGES (${String(badgesToShow.length).padStart(2)})                            │
├─────────────────────────────────────────────────────────┤
`);

  for (let i = 0; i < badgesToShow.length; i += 2) {
    const badge1 = badgesToShow[i];
    const badge2 = badgesToShow[i + 1];
    const name1 = badge1.name.substring(0, 25).padEnd(25);
    const name2 = badge2 ? badge2.name.substring(0, 22).padEnd(22) : ''.padEnd(22);
    grid += `│ ${name1} ${name2} │\n`;
  }

  grid += `└─────────────────────────────────────────────────────────┘\n`;
  return grid;
}

export { handleDashboardCommand };

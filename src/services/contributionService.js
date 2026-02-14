import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONTRIBUTIONS_FILE = path.join(os.homedir(), '.contriflow', 'contributions.json');

// Initialize contributions database
async function initContributionsDb() {
  const dir = path.dirname(CONTRIBUTIONS_FILE);
  await fs.ensureDir(dir);

  if (!fs.existsSync(CONTRIBUTIONS_FILE)) {
    const initialDb = {
      version: 1,
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      lastContributionDate: null,
      dailyGoal: 3,
      issuesSolvedToday: [],
      dailyHistory: [], // Array of {date, count, issues}
      badges: [],
      totalPRsCreated: 0,
      totalIssuesTracked: 0
    };
    await fs.writeJson(CONTRIBUTIONS_FILE, initialDb, { spaces: 2 });
    return initialDb;
  }

  return await fs.readJson(CONTRIBUTIONS_FILE);
}

// Get current contributions database
async function getContributionsDb() {
  try {
    if (!fs.existsSync(CONTRIBUTIONS_FILE)) {
      return await initContributionsDb();
    }
    return await fs.readJson(CONTRIBUTIONS_FILE);
  } catch (error) {
    return await initContributionsDb();
  }
}

// Save contributions database
async function saveContributionsDb(db) {
  const dir = path.dirname(CONTRIBUTIONS_FILE);
  await fs.ensureDir(dir);
  await fs.writeJson(CONTRIBUTIONS_FILE, db, { spaces: 2 });
}

// Get today's date as YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Check if date is today
function isToday(dateStr) {
  return dateStr === getTodayDate();
}

// Check if date is yesterday
function isYesterday(dateStr) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

// Record contribution (issue solved)
async function recordContribution(issueNumber, repo, issueTitle) {
  const db = await getContributionsDb();
  const today = getTodayDate();

  // Check if this issue already recorded today
  const alreadyRecorded = db.issuesSolvedToday.some(
    i => i.number === issueNumber && i.repo === repo
  );

  if (alreadyRecorded) {
    return { success: false, message: 'Issue already recorded today' };
  }

  // Add to today's issues
  db.issuesSolvedToday.push({
    number: issueNumber,
    repo,
    title: issueTitle,
    timestamp: new Date().toISOString()
  });

  db.totalContributions++;
  db.totalIssuesTracked++;

  // Check for streak
  if (db.lastContributionDate === null) {
    // First contribution
    db.currentStreak = 1;
    db.longestStreak = 1;
  } else if (isYesterday(db.lastContributionDate)) {
    // Streak continues
    db.currentStreak++;
    if (db.currentStreak > db.longestStreak) {
      db.longestStreak = db.currentStreak;
    }
  } else if (!isToday(db.lastContributionDate)) {
    // Streak broken, reset
    db.currentStreak = 1;
  }

  db.lastContributionDate = today;

  // Add to daily history
  const existingDay = db.dailyHistory.find(d => d.date === today);
  if (existingDay) {
    existingDay.count++;
    existingDay.issues.push({
      number: issueNumber,
      repo,
      title: issueTitle
    });
  } else {
    db.dailyHistory.push({
      date: today,
      count: 1,
      issues: [{
        number: issueNumber,
        repo,
        title: issueTitle
      }]
    });
  }

  // Check for badges
  await checkAndAwardBadges(db);

  await saveContributionsDb(db);
  return { success: true, message: 'Contribution recorded!' };
}

// Record PR creation
async function recordPRCreated() {
  const db = await getContributionsDb();
  db.totalPRsCreated++;
  await saveContributionsDb(db);
}

// Check and award badges
async function checkAndAwardBadges(db) {
  const existingBadges = db.badges.map(b => b.id);

  // First contribution badge
  if (db.totalContributions === 1 && !existingBadges.includes('first_contribution')) {
    db.badges.push({
      id: 'first_contribution',
      name: '🎯 First Step',
      description: 'Recorded your first contribution',
      earnedAt: new Date().toISOString()
    });
  }

  // 3-day streak badge
  if (db.currentStreak >= 3 && !existingBadges.includes('streak_3')) {
    db.badges.push({
      id: 'streak_3',
      name: '🔥 3-Day Streak',
      description: 'Contributed for 3 consecutive days',
      earnedAt: new Date().toISOString()
    });
  }

  // 7-day streak badge
  if (db.currentStreak >= 7 && !existingBadges.includes('streak_7')) {
    db.badges.push({
      id: 'streak_7',
      name: '🌟 7-Day Streak',
      description: 'Contributed for 7 consecutive days',
      earnedAt: new Date().toISOString()
    });
  }

  // 30-day streak badge
  if (db.currentStreak >= 30 && !existingBadges.includes('streak_30')) {
    db.badges.push({
      id: 'streak_30',
      name: '👑 30-Day Streak',
      description: 'Contributed for 30 consecutive days',
      earnedAt: new Date().toISOString()
    });
  }

  // 10 contributions badge
  if (db.totalContributions >= 10 && !existingBadges.includes('contributions_10')) {
    db.badges.push({
      id: 'contributions_10',
      name: '💪 10 Contributions',
      description: 'Recorded 10 contributions',
      earnedAt: new Date().toISOString()
    });
  }

  // 25 contributions badge
  if (db.totalContributions >= 25 && !existingBadges.includes('contributions_25')) {
    db.badges.push({
      id: 'contributions_25',
      name: '🚀 25 Contributions',
      description: 'Recorded 25 contributions',
      earnedAt: new Date().toISOString()
    });
  }

  // 50 contributions badge
  if (db.totalContributions >= 50 && !existingBadges.includes('contributions_50')) {
    db.badges.push({
      id: 'contributions_50',
      name: '✨ 50 Contributions',
      description: 'Recorded 50 contributions',
      earnedAt: new Date().toISOString()
    });
  }

  // 5 PRs badge
  if (db.totalPRsCreated >= 5 && !existingBadges.includes('prs_5')) {
    db.badges.push({
      id: 'prs_5',
      name: '🎪 5 Pull Requests',
      description: 'Created 5 pull requests',
      earnedAt: new Date().toISOString()
    });
  }

  // Daily goal badge
  if (db.issuesSolvedToday.length >= db.dailyGoal && !existingBadges.includes('daily_goal_' + getTodayDate())) {
    db.badges.push({
      id: 'daily_goal_' + getTodayDate(),
      name: '🎯 Daily Goal',
      description: 'Completed your daily goal',
      earnedAt: new Date().toISOString()
    });
  }
}

// Get today's progress
async function getTodayProgress() {
  const db = await getContributionsDb();
  const today = getTodayDate();
  const todayData = db.dailyHistory.find(d => d.date === today);

  // Ensure dailyGoal is a sensible positive integer for calculations
  const dailyGoal = Number.isInteger(db.dailyGoal) && db.dailyGoal > 0 ? db.dailyGoal : 1;

  return {
    solvedToday: db.issuesSolvedToday.length,
    dailyGoal: dailyGoal,
    progressPercent: Math.round((db.issuesSolvedToday.length / dailyGoal) * 100),
    issues: db.issuesSolvedToday,
    goalMet: db.issuesSolvedToday.length >= dailyGoal
  };
}

// Get stats
async function getStats() {
  const db = await getContributionsDb();
  return {
    currentStreak: db.currentStreak,
    longestStreak: db.longestStreak,
    totalContributions: db.totalContributions,
    totalPRsCreated: db.totalPRsCreated,
    badges: db.badges,
    level: Math.floor(db.totalContributions / 10) + 1,
    lastContributionDate: db.lastContributionDate
  };
}

// Get next level XP requirements
function getLevelXP(level) {
  return level * 10;
}

export {
  initContributionsDb,
  getContributionsDb,
  saveContributionsDb,
  recordContribution,
  recordPRCreated,
  getTodayProgress,
  getStats,
  getTodayDate,
  getLevelXP,
  isToday
};

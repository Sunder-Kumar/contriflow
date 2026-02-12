# ContriFlow Dashboard - Technical Implementation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Command Structure](#command-structure)
3. [Display Functions](#display-functions)
4. [Helper Functions](#helper-functions)
5. [Data Sources](#data-sources)
6. [ASCII Art Generation](#ascii-art-generation)
7. [Progress Calculation](#progress-calculation)
8. [Badge Management](#badge-management)
9. [Error Handling](#error-handling)
10. [Performance Considerations](#performance-considerations)
11. [Configuration](#configuration)

## Architecture Overview

The ContriFlow Dashboard is implemented as a modular command system with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI Entry Point                           │
│                 (dashboard command)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌──────────┐
   │ Options │ │ Parser   │ │Validator │
   │ Handler │ │          │ │          │
   └────┬────┘ └──────────┘ └──────────┘
        │
        ▼
   ┌─────────────────────────────────┐
   │   Display Mode Router           │
   │  (Full/ASCII/Stats/Badges/etc)  │
   └────┬────────────────────────────┘
        │
   ┌────┴────────┬──────────┬────────┬──────────┐
   ▼             ▼          ▼        ▼          ▼
┌─────────┐ ┌──────┐ ┌─────┐ ┌────┐ ┌────────┐
│  Full   │ │ASCII │ │Stats│ │Badge│ │Detailed│
│Dashboard│ │Dash  │ │Only │ │Only │ │Dash    │
└────┬────┘ └──┬───┘ └──┬──┘ └──┬─┘ └────┬───┘
     │         │       │      │        │
     └────┬────┴───────┴──────┴────────┘
          │
          ▼
   ┌──────────────────────┐
   │  Data Aggregator     │
   │ (Stats, Badges, etc) │
   └────────┬─────────────┘
            │
   ┌────────┴──────────┬──────────────┐
   ▼                   ▼              ▼
┌──────────┐    ┌────────────┐ ┌────────────┐
│Contrib   │    │ Badge      │ │ Streak     │
│Service   │    │ Service    │ │ Service    │
└──────────┘    └────────────┘ └────────────┘
      │
      ▼
┌──────────────────┐
│  GitHub API /    │
│  Local Database  │
└──────────────────┘
```

### Key Components

1. **CLI Handler**: Processes command-line arguments and options
2. **Display Router**: Routes to appropriate display function based on options
3. **Display Functions**: Render dashboard in various formats
4. **Helper Functions**: Generate ASCII art, progress bars, badges
5. **Services**: Aggregate and transform data from sources
6. **Data Layer**: GitHub API and local database access

## Command Structure

### Command Definition

```javascript
// commands/dashboard.js

const dashboardCommand = {
  command: 'dashboard',
  description: 'View your contribution dashboard with statistics and badges',
  options: [
    {
      name: 'ascii',
      description: 'Display with ASCII art styling',
      type: 'boolean',
      default: false
    },
    {
      name: 'badges',
      description: 'Show badges-only view',
      type: 'boolean',
      default: false
    },
    {
      name: 'stats',
      description: 'Show statistics-only view',
      type: 'boolean',
      default: false
    },
    {
      name: 'detailed',
      description: 'Show detailed analysis with breakdowns',
      type: 'boolean',
      default: false
    },
    {
      name: 'watch',
      description: 'Enable real-time update mode',
      type: 'boolean',
      default: false
    },
    {
      name: 'json',
      description: 'Output in JSON format',
      type: 'boolean',
      default: false
    },
    {
      name: 'since',
      description: 'Filter data from specific date',
      type: 'string'
    },
    {
      name: 'until',
      description: 'Filter data until specific date',
      type: 'string'
    },
    {
      name: 'repo',
      description: 'Show stats for specific repository',
      type: 'string'
    },
    {
      name: 'daily-goal',
      description: 'Custom daily contribution goal',
      type: 'number',
      default: 10
    },
    {
      name: 'theme',
      description: 'ASCII art theme (dark, light, minimal)',
      type: 'string',
      default: 'dark'
    },
    {
      name: 'compare-weeks',
      description: 'Compare weeks for trend analysis',
      type: 'number'
    }
  ],
  handler: async (args, options) => {
    // Route to appropriate display function
  }
};
```

### Option Handling

```javascript
function parseOptions(args) {
  const options = {
    ascii: args.includes('--ascii'),
    badges: args.includes('--badges'),
    stats: args.includes('--stats'),
    detailed: args.includes('--detailed'),
    watch: args.includes('--watch'),
    json: args.includes('--json'),
    since: extractFlag(args, '--since'),
    until: extractFlag(args, '--until'),
    repo: extractFlag(args, '--repo'),
    dailyGoal: parseInt(extractFlag(args, '--daily-goal')) || 10,
    theme: extractFlag(args, '--theme') || 'dark',
    compareWeeks: parseInt(extractFlag(args, '--compare-weeks'))
  };

  // Validate mutually exclusive options
  if (options.ascii && options.json) {
    throw new Error('Cannot use --ascii and --json together');
  }

  return options;
}
```

## Display Functions

### 1. showFullDashboard()

Displays comprehensive dashboard with all available information.

```javascript
async function showFullDashboard(options) {
  try {
    // Gather data
    const userData = await contributionService.getUserStats();
    const badges = await badgeService.getUserBadges();
    const streakData = await streakService.getStreakInfo();
    
    // Build layout
    const output = [];
    output.push(buildHeaderBox(userData));
    output.push(buildLevelXPBox(userData));
    output.push(buildStatisticsBox(userData));
    output.push(buildStreakBox(streakData));
    output.push(buildTodayGoalBox(userData, options.dailyGoal));
    output.push(buildRecentBadgesBox(badges));
    
    // Display
    console.log(output.join('\n\n'));
    
    return {
      success: true,
      dataDisplayed: true
    };
  } catch (error) {
    handleDashboardError(error);
  }
}
```

**Display Sections:**
1. Header with GitHub username and profile link
2. Level and XP progress with visual bar
3. Comprehensive statistics box
4. Streak information with calendar view
5. Today's goal progress indicator
6. Recent earned badges (last 5-10)

### 2. showASCIIDashboard()

Enhanced version with ASCII art styling and decorative elements.

```javascript
async function showASCIIDashboard(options) {
  try {
    const userData = await contributionService.getUserStats();
    const badges = await badgeService.getUserBadges();
    const streakData = await streakService.getStreakInfo();
    
    // Build ASCII components
    const output = [];
    output.push(buildASCIIHeader(options.theme));
    output.push(buildLevelBox(userData, options.theme));
    output.push(buildStreakBox(streakData, options.theme));
    output.push(buildStatsBox(userData, options.theme));
    output.push(buildBadgesGrid(badges, options.theme));
    
    // Add visual separators
    const result = output.join('\n' + buildSeparator());
    console.log(result);
    
    return { success: true, ascii: true };
  } catch (error) {
    handleDashboardError(error);
  }
}
```

**Key Features:**
- Double-line borders (╔═╗╚═╝)
- Decorative header with title
- Organized section separators
- Badge grid layout with ASCII borders
- Theme support (dark, light, minimal)

### 3. showBadgesOnly()

Focused view showing only achievement badges.

```javascript
async function showBadgesOnly(options) {
  try {
    const badges = await badgeService.getUserBadges();
    const categorized = categorizeBadges(badges);
    
    const output = [];
    output.push(buildBadgesHeader(badges.length));
    
    for (const [category, badgeList] of Object.entries(categorized)) {
      output.push(buildBadgeCategory(category, badgeList));
    }
    
    output.push(buildBadgesFooter(badges.length));
    console.log(output.join('\n'));
    
  } catch (error) {
    handleDashboardError(error);
  }
}
```

**Display Organization:**
- Category headers (Streak Badges, Milestone Badges, etc.)
- Badges grouped by category
- Date earned information
- Total badge count

### 4. showStatsOnly()

Clean statistics display without visual formatting.

```javascript
async function showStatsOnly(options) {
  try {
    const userData = await contributionService.getUserStats();
    const streakData = await streakService.getStreakInfo();
    
    const stats = {
      user: userData.username,
      profile: userData.profileUrl,
      level: userData.level,
      xp: userData.xp,
      xpMax: userData.xpNextLevel,
      totalContributions: userData.totalContributions,
      pullRequests: userData.pullRequests,
      issues: userData.issues,
      codeReviews: userData.codeReviews,
      currentStreak: streakData.current,
      longestStreak: streakData.longest,
      todayContributions: userData.todayCount,
      dailyGoal: options.dailyGoal
    };
    
    if (options.json) {
      console.log(JSON.stringify(stats, null, 2));
    } else {
      // Print formatted text
      printStatsText(stats);
    }
    
  } catch (error) {
    handleDashboardError(error);
  }
}
```

**Output Format:**
- Clean key-value pairs
- Percentage calculations
- No ASCII art or boxes
- Optional JSON serialization

### 5. showDetailedDashboard()

Most comprehensive view with analytics and breakdowns.

```javascript
async function showDetailedDashboard(options) {
  try {
    // Gather comprehensive data
    const userData = await contributionService.getUserStats();
    const history = await historyService.getContributionHistory(
      options.since, 
      options.until
    );
    const badges = await badgeService.getUserBadges();
    const streakData = await streakService.getStreakInfo();
    const trends = calculateTrends(history);
    const breakdown = calculateBreakdown(userData);
    
    const output = [];
    
    // Section 1: Profile
    output.push(buildProfileSection(userData));
    
    // Section 2: Level progression
    output.push(buildLevelProgressionSection(userData));
    
    // Section 3: Contribution breakdown
    output.push(buildContributionBreakdown(breakdown));
    
    // Section 4: Streak analysis
    output.push(buildStreakAnalysis(streakData, history));
    
    // Section 5: Daily history
    output.push(buildDailyHistoryChart(history));
    
    // Section 6: Goals
    output.push(buildGoalsSection(userData, options.dailyGoal));
    
    // Section 7: Achievement timeline
    output.push(buildAchievementTimeline(badges));
    
    // Section 8: Metrics
    output.push(buildPerformanceMetrics(trends, userData));
    
    console.log(output.join('\n' + buildSectionDivider()));
    
  } catch (error) {
    handleDashboardError(error);
  }
}
```

**Sections Included:**
1. Profile information
2. Level progression with milestones
3. Contribution type breakdown
4. Streak analysis with patterns
5. Daily history visualization (30 days)
6. Goal tracking and projections
7. Achievement timeline
8. Performance metrics and trends

## Helper Functions

### 1. generateProgressBar()

Creates visual progress bar representation.

```javascript
function generateProgressBar(current, max, width = 40) {
  if (max === 0) return '░'.repeat(width);
  
  const percentage = Math.min(current / max, 1);
  const filled = Math.floor(width * percentage);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round(percentage * 100);
  
  return `${bar} ${percent}%`;
}

// Usage
const xpBar = generateProgressBar(875, 1000);
// Output: ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 87%
```

**Parameters:**
- `current`: Current value
- `max`: Maximum value
- `width`: Bar character width (default 40)

**Returns:** Formatted progress bar string

### 2. generateStreakVisual()

Creates visual representation of streak with emojis.

```javascript
function generateStreakVisual(streakLength) {
  let flameCount = Math.floor(streakLength / 10);
  if (streakLength >= 10) flameCount = Math.min(flameCount, 5);
  
  const flames = '🔥'.repeat(flameCount);
  const base = streakLength > 0 ? '✓' : '✗';
  
  return {
    text: `${streakLength} days ${flames}`,
    visual: flames || '◯',
    intensity: Math.min(flameCount / 5, 1)
  };
}

// Usage
const streak = generateStreakVisual(45);
// Output: { text: "45 days 🔥🔥🔥🔥", visual: "🔥🔥🔥🔥", intensity: 0.8 }
```

### 3. generateLevelBox()

Creates decorative box for level display.

```javascript
function generateLevelBox(level, xp, xpMax, theme = 'dark') {
  const title = `⭐ LEVEL ${level} - Expert Developer ⭐`;
  const width = Math.max(title.length + 4, 50);
  
  const themes = {
    dark: {
      top: '┏' + '━'.repeat(width - 2) + '┓',
      middle: '┃',
      bottom: '┗' + '━'.repeat(width - 2) + '┛'
    },
    light: {
      top: '╔' + '═'.repeat(width - 2) + '╗',
      middle: '║',
      bottom: '╚' + '═'.repeat(width - 2) + '╝'
    },
    minimal: {
      top: '┌' + '─'.repeat(width - 2) + '┐',
      middle: '│',
      bottom: '└' + '─'.repeat(width - 2) + '┘'
    }
  };
  
  const style = themes[theme];
  const xpBar = generateProgressBar(xp, xpMax, width - 6);
  const remaining = xpMax - xp;
  
  return [
    style.top,
    `${style.middle} ${centerText(title, width - 2)} ${style.middle}`,
    `${style.middle} XP: ${xp} / ${xpMax} ${style.middle}`,
    `${style.middle} ${xpBar} ${style.middle}`,
    `${style.middle} Next Level: ${remaining} XP remaining ${style.middle}`,
    style.bottom
  ].join('\n');
}
```

### 4. generateStreakBox()

Creates formatted box for streak information.

```javascript
function generateStreakBox(currentStreak, longestStreak, recentDays, theme = 'dark') {
  const header = 'STREAK INFORMATION';
  const width = 55;
  
  const streakText = `Current Streak: ${currentStreak} days ${generateStreakVisual(currentStreak).visual}`;
  const longestText = `Longest Streak: ${longestStreak} days ⭐`;
  
  // Build activity calendar for last 7 days
  let activityLine = 'Daily Activity: ';
  for (let i = 0; i < 7; i++) {
    activityLine += recentDays[i] ? '✓ ' : '✗ ';
  }
  
  return buildBox(
    [header, streakText, longestText, activityLine],
    width,
    theme
  );
}
```

### 5. generateStatsBox()

Creates formatted statistics box.

```javascript
function generateStatsBox(userData, theme = 'dark') {
  const stats = [
    ['Total Contributions', userData.totalContributions.toLocaleString()],
    ['Pull Requests', `${userData.pullRequests} (${percentage(userData.pullRequests, userData.totalContributions)}%)`],
    ['Issues Created', `${userData.issues} (${percentage(userData.issues, userData.totalContributions)}%)`],
    ['Code Reviews', `${userData.codeReviews} (${percentage(userData.codeReviews, userData.totalContributions)}%)`],
    ['Average Daily', userData.averageDaily.toFixed(1)]
  ];
  
  const rows = stats.map(([label, value]) => 
    `${label.padEnd(25)} ................ ${value}`
  );
  
  return buildBox(rows, 60, theme);
}
```

### 6. generateBadgesGrid()

Creates grid layout for badges.

```javascript
function generateBadgesGrid(badges, theme = 'dark', cols = 4) {
  const rows = [];
  
  for (let i = 0; i < badges.length; i += cols) {
    const rowBadges = badges.slice(i, i + cols);
    const row = buildBadgeRow(rowBadges, theme);
    rows.push(row);
  }
  
  return buildBox(rows, cols * 20, theme);
}

function buildBadgeRow(badges, theme) {
  const width = 18;
  const cells = badges.map(badge => {
    const icon = badge.icon || '🏅';
    const name = badge.name.slice(0, 12);
    const date = formatDate(badge.earnedDate);
    
    return formatBadgeCell(icon, name, date, width);
  });
  
  return cells.join(' ');
}
```

## Data Sources

### Contribution Service

```javascript
class ContributionService {
  async getUserStats() {
    // Get from database or GitHub API
    const dbStats = await database.getUserStats();
    
    return {
      username: dbStats.username,
      profileUrl: `https://github.com/${dbStats.username}`,
      level: dbStats.level,
      xp: dbStats.xp,
      xpNextLevel: calculateXpForLevel(dbStats.level + 1),
      totalContributions: dbStats.totalContributions,
      pullRequests: dbStats.pullRequests,
      issues: dbStats.issues,
      codeReviews: dbStats.codeReviews,
      todayCount: dbStats.contributionsByDate[today()] || 0,
      averageDaily: calculateDailyAverage(dbStats)
    };
  }
  
  async getContributionHistory(since, until) {
    // Returns array of daily contribution records
    const history = await database.getHistoryRange(since, until);
    return transformHistory(history);
  }
}
```

### Badge Service

```javascript
class BadgeService {
  async getUserBadges(options = {}) {
    const badges = await database.getUserBadges();
    
    // Filter by category if specified
    if (options.category) {
      return badges.filter(b => b.category === options.category);
    }
    
    // Sort by earned date (newest first)
    return badges.sort((a, b) => 
      new Date(b.earnedDate) - new Date(a.earnedDate)
    );
  }
  
  categorizeBadges(badges) {
    return badges.reduce((acc, badge) => {
      const category = badge.category || 'Special';
      if (!acc[category]) acc[category] = [];
      acc[category].push(badge);
      return acc;
    }, {});
  }
}
```

### Streak Service

```javascript
class StreakService {
  async getStreakInfo() {
    const history = await database.getRecentContributions(100);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate streaks from most recent backwards
    for (const record of history.reverse()) {
      if (record.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        currentStreak = tempStreak;
        tempStreak = 0;
      }
    }
    
    return {
      current: currentStreak,
      longest: longestStreak,
      recentDays: history.slice(-7).map(r => r.count > 0)
    };
  }
}
```

## ASCII Art Generation

### Character Sets

```javascript
const BORDER_STYLES = {
  heavy: {
    topLeft: '┏', topRight: '┓', bottomLeft: '┗', bottomRight: '┛',
    horizontal: '━', vertical: '┃', cross: '╋'
  },
  double: {
    topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝',
    horizontal: '═', vertical: '║', cross: '╬'
  },
  light: {
    topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘',
    horizontal: '─', vertical: '│', cross: '┼'
  },
  rounded: {
    topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯',
    horizontal: '─', vertical: '│', cross: '┼'
  }
};

const FILL_CHARACTERS = {
  filled: '█',
  threequarters: '▓',
  half: '▒',
  quarter: '░',
  empty: ' '
};
```

### Box Building Algorithm

```javascript
function buildBox(content, width, style, title = '') {
  const { topLeft, topRight, horizontal, vertical, bottomLeft, bottomRight } = BORDER_STYLES[style];
  
  const lines = [];
  
  // Top border
  let topBorder = topLeft + horizontal.repeat(width - 2) + topRight;
  if (title) {
    const titlePadding = (width - title.length - 2) / 2;
    topBorder = topLeft + horizontal.repeat(Math.floor(titlePadding)) + 
                ` ${title} ` + 
                horizontal.repeat(Math.ceil(titlePadding)) + topRight;
  }
  lines.push(topBorder);
  
  // Content
  for (const line of content) {
    const padding = width - line.length - 2;
    lines.push(vertical + line + ' '.repeat(Math.max(0, padding)) + vertical);
  }
  
  // Bottom border
  const bottomBorder = bottomLeft + horizontal.repeat(width - 2) + bottomRight;
  lines.push(bottomBorder);
  
  return lines.join('\n');
}
```

### Progress Bar Rendering

```javascript
function renderProgressBar(current, max, width = 40, style = 'standard') {
  const percentage = Math.min(current / max, 1);
  const filledWidth = Math.floor(width * percentage);
  
  const styles = {
    standard: { filled: '█', empty: '░' },
    gradient: { filled: ['░', '▒', '▓', '█'], empty: '░' },
    blocks: { filled: '▄', empty: '▀' },
    smooth: { filled: '●', empty: '○' }
  };
  
  const chars = styles[style];
  let bar = '';
  
  if (Array.isArray(chars.filled)) {
    // Gradient style
    for (let i = 0; i < width; i++) {
      if (i < filledWidth) {
        const intensity = Math.floor((i / filledWidth) * chars.filled.length);
        bar += chars.filled[Math.min(intensity, chars.filled.length - 1)];
      } else {
        bar += chars.empty;
      }
    }
  } else {
    // Simple style
    bar = chars.filled.repeat(filledWidth) + chars.empty.repeat(width - filledWidth);
  }
  
  return bar;
}
```

## Progress Calculation

### XP Progress Formula

```javascript
function calculateXpProgress(level) {
  // XP required for each level follows exponential growth
  // Level 1-10: 1000 XP per level
  // Level 11-20: 1500 XP per level
  // Level 21-50: 2000 XP per level
  // Level 51+: 3000 XP per level
  
  if (level < 10) return 1000 * level;
  if (level < 20) return 10000 + 1500 * (level - 10);
  if (level < 50) return 25000 + 2000 * (level - 20);
  return 85000 + 3000 * (level - 50);
}

function getCurrentLevelXpRequirement(level) {
  const current = calculateXpProgress(level);
  const next = calculateXpProgress(level + 1);
  return next - current;
}
```

### Projection Functions

```javascript
function projectLevelCompletion(currentXp, xpMax, averageXpPerDay) {
  const remaining = xpMax - currentXp;
  const daysNeeded = Math.ceil(remaining / averageXpPerDay);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysNeeded);
  
  return {
    daysRemaining: daysNeeded,
    completionDate: completionDate,
    dailyRate: averageXpPerDay.toFixed(1),
    confidence: calculateConfidence(averageXpPerDay)
  };
}

function calculateDailyAverage(stats) {
  const daysSinceStart = Math.max(
    1, 
    Math.floor((Date.now() - stats.createdAt) / (1000 * 60 * 60 * 24))
  );
  return (stats.totalXp / daysSinceStart);
}
```

### Goal Progress

```javascript
function calculateGoalProgress(todayCount, goal) {
  const percentage = Math.min((todayCount / goal) * 100, 100);
  
  return {
    current: todayCount,
    goal: goal,
    percentage: percentage.toFixed(1),
    remaining: Math.max(0, goal - todayCount),
    met: todayCount >= goal,
    status: getGoalStatus(todayCount, goal)
  };
}

function getGoalStatus(current, goal) {
  if (current >= goal) return 'MET ✓';
  const percentage = (current / goal) * 100;
  if (percentage >= 75) return 'ON TRACK ◐';
  if (percentage >= 50) return 'IN PROGRESS ◐';
  if (percentage >= 25) return 'STARTED ◯';
  return 'NOT STARTED ◯';
}
```

## Badge Management

### Badge Categorization

```javascript
class BadgeCategorizer {
  static CATEGORIES = {
    STREAK: {
      name: 'Streak Badges',
      icon: '🔥',
      badges: [
        { name: '7-Day Performer', days: 7 },
        { name: '30-Day Master', days: 30 },
        { name: '100-Day Legend', days: 100 }
      ]
    },
    MILESTONE: {
      name: 'Milestone Badges',
      icon: '🎯',
      badges: [
        { name: 'Contributor', count: 100 },
        { name: 'Expert', count: 500 },
        { name: 'Master', count: 1000 }
      ]
    },
    SPECIAL: {
      name: 'Special Achievements',
      icon: '⭐',
      badges: [
        { name: 'Rising Star', condition: 'first_pr' },
        { name: 'Code Reviewer', condition: 'first_review' }
      ]
    }
  };
  
  static categorizeBadges(badges) {
    const categorized = {};
    
    for (const [key, category] of Object.entries(this.CATEGORIES)) {
      categorized[category.name] = badges.filter(b => b.category === key);
    }
    
    return categorized;
  }
  
  static getRecentN(badges, n = 10) {
    return badges
      .sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate))
      .slice(0, n);
  }
}
```

### Badge Display

```javascript
function formatBadgeForDisplay(badge) {
  return {
    icon: badge.icon || selectIconForCategory(badge.category),
    name: badge.name,
    description: badge.description,
    earnedDate: formatDate(badge.earnedDate),
    rarity: badge.rarity || 'common',
    rarityDisplay: generateRarityDisplay(badge.rarity)
  };
}

function generateRarityDisplay(rarity) {
  const rarities = {
    common: '⭐',
    uncommon: '⭐⭐',
    rare: '⭐⭐⭐',
    epic: '⭐⭐⭐⭐',
    legendary: '⭐⭐⭐⭐⭐'
  };
  return rarities[rarity] || '⭐';
}
```

## Error Handling

### Error Types

```javascript
class DashboardError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

const ERROR_CODES = {
  AUTH_REQUIRED: 'DASHBOARD_001',
  DB_READ_ERROR: 'DASHBOARD_002',
  GITHUB_API_ERROR: 'DASHBOARD_003',
  INVALID_OPTION: 'DASHBOARD_004',
  DATA_NOT_FOUND: 'DASHBOARD_005',
  FILTER_ERROR: 'DASHBOARD_006'
};
```

### Error Recovery

```javascript
async function handleDashboardError(error) {
  if (error.code === ERROR_CODES.AUTH_REQUIRED) {
    console.error('❌ Authentication required. Run: contriflow login');
    return;
  }
  
  if (error.code === ERROR_CODES.GITHUB_API_ERROR) {
    console.warn('⚠️ GitHub API unavailable. Showing cached data...');
    // Fall back to cached data
    await showCachedDashboard();
    return;
  }
  
  if (error.code === ERROR_CODES.DB_READ_ERROR) {
    console.error('❌ Database read error:', error.message);
    console.error('Try running: contriflow sync');
    return;
  }
  
  // Generic error
  console.error('❌ Dashboard error:', error.message);
}
```

### Validation

```javascript
function validateOptions(options) {
  const errors = [];
  
  if (options.since && !isValidDate(options.since)) {
    errors.push('Invalid --since date format');
  }
  
  if (options.until && !isValidDate(options.until)) {
    errors.push('Invalid --until date format');
  }
  
  if (options.since && options.until) {
    const since = new Date(options.since);
    const until = new Date(options.until);
    if (since > until) {
      errors.push('--since must be before --until');
    }
  }
  
  if (options.dailyGoal < 1) {
    errors.push('--daily-goal must be >= 1');
  }
  
  if (!['dark', 'light', 'minimal'].includes(options.theme)) {
    errors.push(`Invalid theme: ${options.theme}`);
  }
  
  if (errors.length > 0) {
    throw new DashboardError(
      `Validation failed: ${errors.join('; ')}`,
      ERROR_CODES.INVALID_OPTION,
      { errors }
    );
  }
  
  return true;
}
```

## Performance Considerations

### Data Caching

```javascript
class DashboardCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new DashboardCache();

async function getUserStatsWithCache() {
  const cached = cache.get('user_stats');
  if (cached) return cached;
  
  const stats = await contributionService.getUserStats();
  cache.set('user_stats', stats);
  return stats;
}
```

### Lazy Loading

```javascript
async function showFullDashboard(options) {
  console.log('Loading dashboard...');
  
  // Load critical data first
  const userData = await contributionService.getUserStats();
  printHeader(userData);
  
  // Load secondary data asynchronously
  Promise.all([
    badgeService.getUserBadges(),
    streakService.getStreakInfo(),
    historyService.getRecentHistory()
  ]).then(([badges, streaks, history]) => {
    // Update display with additional data
  });
}
```

### Database Query Optimization

```javascript
// Use indexes for common queries
async function getOptimizedStats(userId) {
  // Query uses indexed fields: userId, date
  return database.query(
    `SELECT * FROM user_stats 
     WHERE user_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     ORDER BY date DESC`,
    [userId]
  );
}
```

## Configuration

### Theme Configuration

```javascript
const THEMES = {
  dark: {
    background: '\x1b[40m',
    textColor: '\x1b[37m',
    accentColor: '\x1b[36m',
    successColor: '\x1b[32m',
    warningColor: '\x1b[33m',
    errorColor: '\x1b[31m'
  },
  light: {
    background: '\x1b[47m',
    textColor: '\x1b[30m',
    accentColor: '\x1b[34m',
    successColor: '\x1b[32m',
    warningColor: '\x1b[33m',
    errorColor: '\x1b[31m'
  }
};

const DEFAULT_CONFIG = {
  dailyGoal: 10,
  theme: 'dark',
  cacheExpiry: 300000, // 5 minutes
  updateInterval: 30000, // 30 seconds in watch mode
  maxBadgesDisplay: 10,
  historyDays: 30,
  enableColors: process.stdout.isTTY,
  pageSize: 20
};
```


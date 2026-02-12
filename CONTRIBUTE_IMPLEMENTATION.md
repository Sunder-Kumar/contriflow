# Contribute Command Implementation Guide

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Service Architecture](#service-architecture)
- [Contribution Service](#contribution-service)
- [Trending Service](#trending-service)
- [Database Schema](#database-schema)
- [Badge System](#badge-system)
- [Streak Calculation](#streak-calculation)
- [XP and Level System](#xp-and-level-system)
- [GitHub API Integration](#github-api-integration)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Future Enhancements](#future-enhancements)

## Architecture Overview

The contribute command uses a modular service-based architecture with three main layers:

```
┌─────────────────────────────────────────────────────┐
│              Contribute Command Interface            │
│          (src/commands/contribute.js)                │
├─────────────────────────────────────────────────────┤
│                    Service Layer                     │
│  ┌─────────────────┬──────────────────────────────┐ │
│  │ Contribution    │     Trending                │ │
│  │ Service         │     Service                 │ │
│  │ (Track, Award)  │     (Find Issues)           │ │
│  └─────────────────┴──────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│                   Data Layer                        │
│  ┌─────────────────┬──────────────────────────────┐ │
│  │ Contributions   │     GitHub API Client       │ │
│  │ Database        │     (Search, Trending)      │ │
│  │ (JSON)          │                            │ │
│  └─────────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Service Architecture

### Overview

The contribute feature is built on two main services working in concert:

1. **contributionService**: Manages user progress, streaks, XP, badges, and statistics
2. **trendingService**: Discovers relevant issues and repositories for daily challenges

### Service Interaction Flow

```
User Command
    ↓
contribute.js (CLI handler)
    ↓
├─→ Get daily challenges → trendingService.findDailyIssues()
├─→ Track contribution → contributionService.recordContribution()
├─→ Get stats → contributionService.getStats()
├─→ Award badges → contributionService.checkAndAwardBadges()
└─→ Calculate XP → contributionService.calculateXP()
    ↓
Database (contributions.json)
    ↓
Display to user
```

## Contribution Service

### Location
`src/services/contributionService.js`

### Core Functions

#### recordContribution()

Tracks a new contribution and updates user profile.

```javascript
async recordContribution(issueNumber, repo, difficulty = 'normal') {
  /**
   * @param {number} issueNumber - GitHub issue number
   * @param {string} repo - Repository in format "owner/name"
   * @param {string} difficulty - 'beginner', 'normal', 'hard', 'expert'
   * @returns {Object} Contribution record with XP awarded
   */
  
  // 1. Validate inputs
  // 2. Fetch issue details from GitHub API
  // 3. Determine difficulty if auto-detect
  // 4. Calculate XP (base + streak multiplier + difficulty)
  // 5. Check for new contribution streak (first today?)
  // 6. Update contribution database
  // 7. Check badge eligibility
  // 8. Return confirmation with XP earned
}
```

**Implementation Details:**

```javascript
// XP Calculation
const calculateXP = (baseXP, streakDays, difficultyMultiplier) => {
  const streakBonus = 1 + (streakDays * 0.05); // Max 2.0x at 20+ days
  const cappedStreakBonus = Math.min(streakBonus, 2.0);
  return Math.floor(baseXP * cappedStreakBonus * difficultyMultiplier);
};

// Base XP values
const BASE_XP = {
  'beginner': 10,    // Small task, low complexity
  'normal': 15,      // Medium task, standard complexity
  'hard': 20,        // Complex task
  'expert': 25       // Very complex, architectural change
};

// Difficulty multipliers
const DIFFICULTY_MULTIPLIER = {
  'beginner': 1.0,
  'normal': 1.5,
  'hard': 2.0,
  'expert': 5.0
};
```

**Return Object:**

```javascript
{
  success: true,
  xpEarned: 25,
  totalXP: 525,
  leveledUp: false,
  newLevel: 5,
  streakExtended: true,
  currentStreak: 8,
  newBadges: []
}
```

#### getTodayProgress()

Retrieves user's contribution progress for the current day.

```javascript
async getTodayProgress() {
  /**
   * Returns contributions made today and progress toward daily goal
   * @returns {Object} Today's progress metrics
   */
  
  // 1. Get current timestamp in user's timezone
  // 2. Load contributions database
  // 3. Filter contributions for today
  // 4. Count contributions
  // 5. Get daily goal from config
  // 6. Calculate percentage complete
  // 7. Return progress object
}
```

**Return Object:**

```javascript
{
  today: "2025-02-28",
  contributionsToday: 2,
  dailyGoal: 3,
  percentComplete: 67,
  issues: [
    { number: 45231, repo: "facebook/react", timestamp: 1234567890 },
    { number: 52104, repo: "nodejs/node", timestamp: 1234567920 }
  ],
  timeUntilDayReset: 3600 // seconds
}
```

#### getStats()

Retrieves comprehensive statistics for user.

```javascript
async getStats(period = 'all') {
  /**
   * @param {string} period - 'day', 'week', 'month', 'year', 'all'
   * @returns {Object} Comprehensive statistics object
   */
  
  // 1. Load contribution database
  // 2. Calculate stats for requested period
  // 3. Aggregate by language, repository, type
  // 4. Calculate streaks, levels, badges
  // 5. Calculate trends and averages
  // 6. Return stats object
}
```

**Return Object:**

```javascript
{
  period: "all",
  totalContributions: 47,
  currentLevel: 5,
  totalXP: 523,
  currentStreak: 8,
  longestStreak: 23,
  badgesEarned: 12,
  
  // By Language
  byLanguage: {
    'JavaScript': { count: 23, percentage: 49 },
    'Python': { count: 15, percentage: 32 },
    'TypeScript': { count: 9, percentage: 19 }
  },
  
  // By Type
  byType: {
    'bug-fix': { count: 18, percentage: 38 },
    'feature': { count: 15, percentage: 32 },
    'documentation': { count: 10, percentage: 21 },
    'testing': { count: 4, percentage: 9 }
  },
  
  // By Repository
  topRepositories: [
    { repo: 'facebook/react', contributions: 12 },
    { repo: 'nodejs/node', contributions: 8 },
    { repo: 'vuejs/vue', contributions: 6 }
  ],
  
  // Averages
  avgXPPerDay: 13.6,
  avgContributionsPerDay: 1.3,
  avgXPPerContribution: 11.1,
  
  // Time-based
  firstContribution: "2025-01-01",
  daysSinceFirstContribution: 58,
  activeStreak: { start: "2025-02-20", days: 8 }
}
```

#### checkAndAwardBadges()

Evaluates contribution against badge criteria and awards new badges.

```javascript
async checkAndAwardBadges(contribution) {
  /**
   * @param {Object} contribution - Newly recorded contribution
   * @returns {Array} Array of newly awarded badges
   */
  
  // 1. Get user's current stats
  // 2. Load badge criteria from config
  // 3. Iterate through all badge types
  // 4. Check eligibility (may have unlocked multiple badges)
  // 5. Award new badges, update database
  // 6. Calculate bonus XP for new badges
  // 7. Return array of awarded badges
}
```

**Badge Award Triggers:**

```javascript
const BADGE_TRIGGERS = {
  // Contribution milestones
  'first-step': { type: 'contribution', value: 1 },
  'rising-star': { type: 'contribution', value: 5 },
  'rockstar': { type: 'contribution', value: 10 },
  'elite': { type: 'contribution', value: 25 },
  'legend': { type: 'contribution', value: 50 },
  
  // Streak milestones
  'three-days-strong': { type: 'streak', value: 3 },
  'silver-week': { type: 'streak', value: 7 },
  'gold-month': { type: 'streak', value: 14 },
  
  // Language specialization
  'javascript-ninja': { type: 'language', language: 'javascript', value: 10 },
  'python-master': { type: 'language', language: 'python', value: 10 },
  
  // Contribution type specialization
  'bug-hunter': { type: 'bugfix', value: 10 },
  'documentation-master': { type: 'documentation', value: 5 }
};
```

#### updateStreak()

Updates user's current and longest streak.

```javascript
async updateStreak() {
  /**
   * Called after each contribution.
   * Checks if today's streak should continue or reset.
   * @returns {Object} Updated streak information
   */
  
  // 1. Get last contribution date
  // 2. Get today's date in user timezone
  // 3. Calculate days between
  // 4. If 0 days: same day, do nothing
  // 5. If 1 day: continue streak
  // 6. If > 1 day: reset streak
  // 7. Update database
  // 8. Return updated streak
}
```

#### resetStreak()

Allows manual streak reset if needed.

```javascript
async resetStreak() {
  /**
   * Manually resets current streak while preserving longest streak.
   * @returns {Object} Confirmation with previous streak preserved
   */
  
  // 1. Get current streak
  // 2. Update longestStreak if current > longest
  // 3. Set currentStreak to 0
  // 4. Set lastContributionDate to old timestamp
  // 5. Persist to database
  // 6. Return confirmation
}
```

## Trending Service

### Location
`src/services/trendingService.js`

### Core Functions

#### findDailyIssues()

Finds three recommended issues for today's daily challenges.

```javascript
async findDailyIssues(userPreferences = {}) {
  /**
   * @param {Object} userPreferences - User's language, difficulty preferences
   * @returns {Array} Array of 3 recommended daily issues
   */
  
  // 1. Get trending repositories for user's tech stack
  // 2. For each repo, find beginner-friendly issues
  // 3. Filter by user's preferences (language, difficulty)
  // 4. Score issues by activity, stars, age
  // 5. Remove issues already completed by user
  // 6. Select top 3 diverse issues
  // 7. Return with metadata
}
```

**Return Format:**

```javascript
[
  {
    issue: {
      number: 45231,
      title: "Add Dark Mode Theme",
      url: "https://github.com/facebook/react/issues/45231",
      labels: ["feature", "UI", "beginner"]
    },
    repository: {
      fullName: "facebook/react",
      stars: 157000,
      language: "JavaScript",
      activity: "high"
    },
    metadata: {
      difficulty: "intermediate",
      estimatedTime: "2-4 hours",
      commentsCount: 12,
      createdAt: "2025-01-15T10:30:00Z",
      score: 85
    }
  },
  // ... 2 more issues
]
```

#### findTrendingRepositories()

Discovers repositories currently trending in user's tech stack.

```javascript
async findTrendingRepositories(languages = ['javascript'], limit = 10) {
  /**
   * Uses GitHub API to find trending repos in past week
   * @param {Array} languages - Programming languages to search
   * @param {number} limit - Max repos to return
   * @returns {Array} Trending repositories
   */
  
  // 1. Call GitHub Search API with trending criteria
  //    stars:>1000 created:>2025-02-21 language:javascript
  // 2. Sort by stars descending
  // 3. Filter by minimum star count (avoid dead projects)
  // 4. Deduplicate if already tracked
  // 5. Enrich with metadata (open issues count, contributors)
  // 6. Return sorted list
}
```

#### findBeginnerIssuesInRepo()

Finds beginner-friendly issues in a specific repository.

```javascript
async findBeginnerIssuesInRepo(repo, limit = 5) {
  /**
   * @param {string} repo - Repository in format "owner/name"
   * @param {number} limit - Max issues to return
   * @returns {Array} Beginner-friendly issues
   */
  
  // 1. Query GitHub API with labels filter
  //    labels: "good-first-issue", "beginner", "help-wanted"
  // 2. Filter by:
  //    - Open status only
  //    - No assignee (or assignee != user)
  //    - Created < 7 days ago (fresh issues)
  // 3. Sort by: most recent first
  // 4. Return with metadata (comments, reactions, etc)
}
```

#### getUserGitHubStats()

Retrieves user's GitHub contribution statistics for context.

```javascript
async getUserGitHubStats(username) {
  /**
   * @param {string} username - GitHub username
   * @returns {Object} User's GitHub public statistics
   */
  
  // 1. Call GitHub API /users/{username}
  // 2. Extract: public repos, followers, joined date
  // 3. Get public contributions (calendar data)
  // 4. Calculate: avg contributions per month, etc
  // 5. Return statistics object
}
```

## Database Schema

### Location
`~/.contriflow/data/contributions.json`

### Structure

```json
{
  "version": "1.0",
  "lastUpdated": "2025-02-28T15:30:00Z",
  "user": {
    "githubUsername": "alice-dev",
    "localTimezone": "America/New_York",
    "preferences": {
      "dailyGoal": 3,
      "languages": ["javascript", "typescript", "python"],
      "streakProtectionEnabled": true
    }
  },
  "progression": {
    "level": 5,
    "totalXP": 523,
    "xpThisLevel": 23,
    "xpToNextLevel": 177
  },
  "streaks": {
    "current": {
      "count": 8,
      "startDate": "2025-02-20",
      "lastContributionDate": "2025-02-28",
      "protected": false,
      "protectionExpires": null
    },
    "longest": {
      "count": 23,
      "startDate": "2025-01-15",
      "endDate": "2025-02-06"
    },
    "history": [
      {
        "count": 8,
        "startDate": "2025-01-05",
        "endDate": "2025-01-12",
        "status": "completed"
      },
      {
        "count": 13,
        "startDate": "2025-01-13",
        "endDate": "2025-01-25",
        "status": "completed"
      }
    ]
  },
  "badges": {
    "earned": [
      {
        "id": "first-step",
        "name": "First Step",
        "emoji": "🎯",
        "description": "Make your first contribution",
        "awardedDate": "2025-01-01T10:30:00Z",
        "xpReward": 50
      },
      {
        "id": "three-days-strong",
        "name": "Three Days Strong",
        "emoji": "🥉",
        "description": "Achieve 3-day streak",
        "awardedDate": "2025-01-03T14:45:00Z",
        "xpReward": 50
      },
      {
        "id": "javascript-ninja",
        "name": "JavaScript Ninja",
        "emoji": "🟡",
        "description": "10 JavaScript contributions",
        "awardedDate": "2025-02-12T09:20:00Z",
        "xpReward": 200
      }
    ],
    "available": [
      "rising-star",
      "rockstar",
      "elite",
      "silver-week",
      "gold-month"
    ],
    "inProgress": {
      "rockstar": { current: 10, required: 10, percentage: 100 },
      "elite": { current: 23, required: 25, percentage: 92 },
      "silver-week": { current: 8, required: 7, percentage: 114 }
    }
  },
  "contributions": [
    {
      "id": "contrib-001",
      "date": "2025-02-28T10:30:00Z",
      "issue": {
        "number": 45231,
        "title": "Add Dark Mode Theme",
        "url": "https://github.com/facebook/react/issues/45231"
      },
      "repository": {
        "fullName": "facebook/react",
        "language": "JavaScript",
        "stars": 157000
      },
      "pullRequest": {
        "number": 12345,
        "url": "https://github.com/facebook/react/pull/12345",
        "merged": true,
        "mergedAt": "2025-02-28T12:45:00Z"
      },
      "metadata": {
        "type": "feature",
        "difficulty": "intermediate",
        "xpEarned": 25,
        "streakDaysAtContribution": 8,
        "difficultyMultiplier": 1.5
      }
    },
    {
      "id": "contrib-002",
      "date": "2025-02-28T14:20:00Z",
      "issue": {
        "number": 52104,
        "title": "Fix Typo in Documentation",
        "url": "https://github.com/nodejs/node/issues/52104"
      },
      "repository": {
        "fullName": "nodejs/node",
        "language": "C++",
        "stars": 105000
      },
      "pullRequest": {
        "number": 52105,
        "url": "https://github.com/nodejs/node/pull/52105",
        "merged": false,
        "mergedAt": null
      },
      "metadata": {
        "type": "documentation",
        "difficulty": "beginner",
        "xpEarned": 13,
        "streakDaysAtContribution": 8,
        "difficultyMultiplier": 1.0
      }
    }
  ],
  "dailyHistory": [
    {
      "date": "2025-02-28",
      "contributions": 2,
      "xpEarned": 38,
      "issues": [45231, 52104]
    },
    {
      "date": "2025-02-27",
      "contributions": 1,
      "xpEarned": 25,
      "issues": [13407]
    }
  ],
  "stats": {
    "byLanguage": {
      "JavaScript": { count: 23, xpTotal: 280 },
      "Python": { count: 15, xpTotal: 180 },
      "TypeScript": { count: 9, xpTotal: 120 }
    },
    "byType": {
      "bug-fix": { count: 18, xpTotal: 200 },
      "feature": { count: 15, xpTotal: 215 },
      "documentation": { count: 10, xpTotal: 90 },
      "testing": { count: 4, xpTotal: 18 }
    },
    "topRepositories": [
      { repo: "facebook/react", contributions: 12 },
      { repo: "nodejs/node", contributions: 8 }
    ]
  },
  "tracking": {
    "active": [
      {
        "issue": 45231,
        "repo": "facebook/react",
        "startTime": "2025-02-28T08:30:00Z",
        "status": "in_progress"
      }
    ],
    "completed": [
      {
        "issue": 52104,
        "repo": "nodejs/node",
        "startTime": "2025-02-27T10:20:00Z",
        "endTime": "2025-02-28T12:45:00Z",
        "duration": 86400000,
        "status": "completed"
      }
    ]
  }
}
```

### Key Fields Explained

**progression**: Tracks user's level and XP progression
- `level`: Current level (1-100)
- `totalXP`: Cumulative XP earned
- `xpThisLevel`: XP earned toward current level
- `xpToNextLevel`: XP needed to advance

**streaks**: Manages current and historical streak data
- `current.count`: Active streak counter
- `current.protected`: Whether streak protection is active
- `longest`: Personal record for longest streak
- `history`: Array of all completed streaks

**badges**: Tracks earned, available, and in-progress badges
- `earned`: Array of already-awarded badges with dates
- `available`: Next badges that can be earned
- `inProgress`: Badges currently being worked toward with progress

**contributions**: Detailed record of each contribution
- Includes issue metadata, PR details, XP earned, and metadata

**dailyHistory**: Aggregated daily statistics for analytics
- Used for dashboard charts and trend analysis

**stats**: Pre-aggregated statistics by language, type, and repo
- Updated after each contribution for performance

## Badge System

### Badge Definition Structure

```javascript
const BADGES = {
  'first-step': {
    id: 'first-step',
    name: 'First Step',
    emoji: '🎯',
    description: 'Make your first contribution',
    category: 'milestone',
    xpReward: 50,
    criteria: {
      type: 'contribution',
      operator: 'eq',
      value: 1
    },
    oneTime: true,
    visible: true
  },
  
  'three-days-strong': {
    id: 'three-days-strong',
    name: 'Three Days Strong',
    emoji: '🥉',
    description: 'Achieve a 3-day streak',
    category: 'streak',
    xpReward: 50,
    criteria: {
      type: 'streak',
      operator: 'gte',
      value: 3
    },
    oneTime: false, // Can be earned in each streak cycle
    visible: true
  },
  
  'javascript-ninja': {
    id: 'javascript-ninja',
    name: 'JavaScript Ninja',
    emoji: '🟡',
    description: '10 JavaScript contributions',
    category: 'specialization',
    xpReward: 200,
    criteria: {
      type: 'language',
      language: 'javascript',
      operator: 'gte',
      value: 10
    },
    oneTime: true,
    visible: true
  }
};
```

### Badge Award Flow

```
New Contribution
    ↓
checkAndAwardBadges()
    ↓
For each badge:
  ├─ Check if already earned (if oneTime)
  ├─ Evaluate criteria against user stats
  ├─ If criteria met: mark as earned
  └─ Add XP bonus
    ↓
Update database with new badges
    ↓
Return awarded badges for display
```

## Streak Calculation

### Algorithm

```javascript
function calculateStreakStatus() {
  const today = getTodayInUserTimezone();
  const lastContributionDate = getLastContributionDate();
  const daysSinceLastContribution = today - lastContributionDate;
  
  if (daysSinceLastContribution === 0) {
    // Same day, streak already counted
    return { action: 'none', message: 'Already contributed today' };
  } else if (daysSinceLastContribution === 1) {
    // Next day, continue streak
    currentStreak++;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    return { action: 'extend', message: `Streak: ${currentStreak}` };
  } else if (daysSinceLastContribution > 1) {
    // Missed days, reset streak
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    currentStreak = 1;
    return { action: 'reset', message: 'Streak reset' };
  }
}
```

### Timezone Handling

```javascript
function getTodayInUserTimezone() {
  const userTz = config.localTimezone; // e.g., "America/New_York"
  const now = new Date();
  const userTime = now.toLocaleString('en-US', { timeZone: userTz });
  return new Date(userTime).toDateString();
}

// Example: User in UTC+5 at 23:00 UTC = 04:00 next day locally
// Their day resets 5 hours earlier than UTC
```

### Streak Protection

When enabled, provides a 1-day grace period:

```javascript
function checkStreakSafety() {
  const lastContribution = getLastContributionDate();
  const tomorrow = getTomorrow();
  const grace = 1; // 1 day protection
  
  if (streakProtectionEnabled) {
    if (lastContribution + grace >= tomorrow) {
      return { safe: true, message: 'Streak protected' };
    }
  }
  return { safe: false, message: 'Streak in danger' };
}
```

## XP and Level System

### XP Calculation Algorithm

```javascript
function calculateXP(contribution) {
  // 1. Base XP depends on difficulty
  const baseXP = BASE_XP[contribution.difficulty] || 15;
  
  // 2. Streak multiplier (increases with streak, caps at 2.0x)
  const streakDays = contribution.streakDaysAtContribution;
  const streakMultiplier = Math.min(1 + (streakDays * 0.05), 2.0);
  
  // 3. Difficulty multiplier (impacts XP significantly)
  const difficultyMult = DIFFICULTY_MULTIPLIER[contribution.difficulty] || 1.0;
  
  // 4. Total XP
  const totalXP = Math.floor(baseXP * streakMultiplier * difficultyMult);
  
  return totalXP;
}
```

### Level Progression Formula

```javascript
function calculateLevelRequirements() {
  // XP required increases per level
  // Level 1: 0 total XP
  // Level 2: 100 XP
  // Level 3: 150 XP more (250 total)
  // Level N: 50 * N XP per level
  
  // For level N, required XP = sum(50 * i for i=2 to N)
  
  const xpPerLevel = (level) => {
    if (level === 1) return 0;
    if (level === 2) return 100;
    return 50 * level;
  };
  
  const totalXPForLevel = (level) => {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += xpPerLevel(i);
    }
    return total;
  };
  
  // Example:
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 250 XP (100 + 150)
  // Level 4: 450 XP (250 + 200)
  // Level 5: 700 XP (450 + 250)
}
```

### Level Up Process

```javascript
function checkLevelUp(currentXP, currentLevel) {
  const xpRequired = getTotalXPForLevel(currentLevel + 1);
  
  if (currentXP >= xpRequired) {
    currentLevel++;
    
    // Award level-up bonus
    const bonusXP = 50 * currentLevel;
    currentXP += bonusXP;
    
    // Check for level-up badges
    if (currentLevel % 5 === 0) {
      awardLevelBadge(currentLevel);
    }
    
    // Return level-up event
    return {
      leveledUp: true,
      newLevel: currentLevel,
      bonusXP: bonusXP,
      rewards: getLevelRewards(currentLevel)
    };
  }
  
  return { leveledUp: false };
}
```

## GitHub API Integration

### Authentication

```javascript
const github = new GitHubClient(token);

// Authenticate with user's GitHub token
// Token should have scope: 'public_repo', 'read:user'
```

### Search API Usage

#### Find Trending Issues

```javascript
const query = `
  label:"good-first-issue" OR label:"beginner"
  language:javascript
  stars:>1000
  created:>${dateWeekAgo}
  sort:stars
  order:desc
`;

const results = await github.search.issues({ q: query });
```

#### Rate Limiting Handling

```javascript
async function makeAPICall(endpoint) {
  try {
    const response = await github.request(endpoint);
    
    // Check rate limit headers
    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    const reset = response.headers['x-ratelimit-reset'];
    
    if (remaining < 10) {
      logger.warn(`Rate limit low: ${remaining}/${limit}`);
    }
    
    return response.data;
  } catch (error) {
    if (error.status === 403 && error.response.message.includes('API rate limit')) {
      throw new RateLimitError('GitHub API rate limit exceeded');
    }
    throw error;
  }
}
```

### Caching Strategy

```javascript
// Cache GitHub API responses to reduce API calls
// Cache invalidates after 24 hours or manual refresh

const cache = new Map();

async function getTrendingRepos(languages, forceRefresh = false) {
  const cacheKey = `trending:${languages.join(',')}`;
  const cached = cache.get(cacheKey);
  
  if (cached && !forceRefresh && !cached.isExpired()) {
    return cached.data;
  }
  
  const data = await github.searchRepositories(query);
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    isExpired: () => Date.now() - this.timestamp > 24 * 60 * 60 * 1000
  });
  
  return data;
}
```

## Error Handling

### Error Classes

```javascript
class ContributionError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

class NoAuthenticationError extends ContributionError {}
class InvalidRepoFormatError extends ContributionError {}
class GitHubAPIError extends ContributionError {}
class DatabaseError extends ContributionError {}
class RateLimitError extends ContributionError {}
```

### Error Handling Flow

```javascript
try {
  const contribution = await recordContribution(issue, repo);
} catch (error) {
  if (error instanceof NoAuthenticationError) {
    console.error('Please authenticate first: contriflow login');
  } else if (error instanceof InvalidRepoFormatError) {
    console.error('Invalid repo format. Use: owner/repo');
  } else if (error instanceof RateLimitError) {
    console.error('GitHub API quota exceeded. Try again later.');
  } else if (error instanceof DatabaseError) {
    console.error('Database error. Your contributions may not be saved.');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Performance Considerations

### Optimization Strategies

**1. Caching**: Cache GitHub API responses for 24 hours
- Reduces API calls significantly
- Only forces refresh on manual request

**2. Lazy Loading**: Load badges and stats on demand
- Dashboard loads quick stats first
- Full badge list loads in background

**3. Batch Database Updates**: Group multiple changes
- Instead of writing after each action, batch writes
- Reduces disk I/O by 50-70%

**4. Incremental Stats**: Pre-compute stats aggregates
- Store byLanguage, byType stats pre-calculated
- Update incrementally instead of recalculating all

### Performance Metrics

| Operation | Current | Target | Method |
|-----------|---------|--------|--------|
| Record contribution | 150ms | <100ms | Batch writes |
| Load dashboard | 250ms | <150ms | Lazy load |
| Find daily issues | 800ms | <400ms | Cache trending |
| Calculate stats | 200ms | <100ms | Pre-aggregation |

## Future Enhancements

### Planned Features (v1.1+)

**1. Contribution Groups/Projects**
- Group related contributions
- Track progress on multi-issue projects
- Estimate time to completion

**2. Team Leaderboards**
- Compare with specific groups of friends
- Organization-wide stats
- Friendly competition

**3. AI-Powered Challenge Recommendations**
- Machine learning to suggest best issues for user
- Based on skill level and previous contributions
- Predict success rate on issues

**4. Contribution Streaks Analytics**
- Visualize streak patterns over time
- Identify best days/times to contribute
- Predict when user likely to break streak

**5. Contribution History Sync**
- Import historical contributions from GitHub
- Backfill contributions from before using contriflow
- Calculate historical stats

**6. Export and Sharing**
- Export contribution history as PDF report
- Share achievements on social media
- Embed stats on personal website

**7. Browser Extension**
- Badge display on GitHub profile
- Quick "Track Issue" from GitHub.com
- Weekly digest notifications

**8. Mobile App**
- Native iOS/Android app
- Daily challenges push notifications
- Quick contribution logging on mobile

**9. Offline Mode Enhancement**
- Better offline support for all features
- Sync when online
- Work on issues offline, record when online

**10. Community Features**
- Global leaderboard (opt-in)
- Achievement showcase
- Contributor spotlight
- Mentorship matching based on levels

---

**Last Updated**: February 2025
**Version**: 1.0
**Architecture Status**: Stable

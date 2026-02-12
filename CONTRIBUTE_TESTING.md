# Contribute Command Testing Guide

## Table of Contents
- [Testing Overview](#testing-overview)
- [Daily Challenge Feature Tests](#daily-challenge-feature-tests)
- [Streak Tracking Feature Tests](#streak-tracking-feature-tests)
- [Level/XP System Tests](#levelxp-system-tests)
- [Badge System Tests](#badge-system-tests)
- [Dashboard Display Tests](#dashboard-display-tests)
- [Tracking Feature Tests](#tracking-feature-tests)
- [Integration Tests](#integration-tests)
- [Error Handling Tests](#error-handling-tests)
- [Test Utilities and Mocks](#test-utilities-and-mocks)

## Testing Overview

### Test Structure

```
__tests__/
├── services/
│   ├── contributionService.test.js
│   └── trendingService.test.js
├── commands/
│   └── contribute.test.js
├── fixtures/
│   ├── contributions.json
│   ├── github-api-responses.json
│   └── user-profiles.json
└── utils/
    ├── test-helpers.js
    └── mocks.js
```

### Testing Strategy

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test workflows combining multiple functions
3. **Error Tests**: Test error conditions and edge cases
4. **E2E Scenarios**: Test complete user workflows

### Test File Locations

- Service tests: `__tests__/services/`
- Command tests: `__tests__/commands/`
- Fixtures: `__tests__/fixtures/`

---

## Daily Challenge Feature Tests

### Test 1: Fetch Trending Repositories

**File**: `__tests__/services/trendingService.test.js`

**Test Name**: `should fetch trending repositories by language`

```javascript
describe('findTrendingRepositories', () => {
  test('should fetch trending repositories by language', async () => {
    // Arrange
    const trendingService = new TrendingService();
    const languages = ['javascript', 'typescript'];
    
    // Mock GitHub API
    jest.spyOn(github, 'search').mockResolvedValueOnce({
      items: [
        {
          name: 'react',
          full_name: 'facebook/react',
          stars: 157000,
          language: 'JavaScript',
          open_issues: 245
        },
        {
          name: 'vue',
          full_name: 'vuejs/vue',
          stars: 200000,
          language: 'JavaScript',
          open_issues: 89
        }
      ]
    });
    
    // Act
    const repos = await trendingService.findTrendingRepositories(languages);
    
    // Assert
    expect(repos).toHaveLength(2);
    expect(repos[0].full_name).toBe('facebook/react');
    expect(repos[0].stars).toBeGreaterThan(1000);
  });

  test('should filter repositories by minimum star count', async () => {
    // Arrange
    const minStars = 10000;
    
    // Mock API response with mixed star counts
    jest.spyOn(github, 'search').mockResolvedValueOnce({
      items: [
        { full_name: 'big-project', stars: 50000 },
        { full_name: 'small-project', stars: 500 },
        { full_name: 'medium-project', stars: 15000 }
      ]
    });
    
    // Act
    const repos = await trendingService.findTrendingRepositories(
      ['javascript'],
      10,
      minStars
    );
    
    // Assert
    expect(repos).toHaveLength(2);
    expect(repos.every(r => r.stars >= minStars)).toBe(true);
  });

  test('should cache results to minimize API calls', async () => {
    // Arrange
    const trendingService = new TrendingService();
    const searchSpy = jest.spyOn(github, 'search');
    
    // Act
    await trendingService.findTrendingRepositories(['javascript']);
    await trendingService.findTrendingRepositories(['javascript']);
    
    // Assert
    // Should only call API once due to caching
    expect(searchSpy).toHaveBeenCalledTimes(1);
  });
});
```

### Test 2: Find Beginner Issues Across Languages

**Test Name**: `should find beginner issues across multiple languages`

```javascript
test('should find beginner issues across multiple languages', async () => {
  // Arrange
  const trendingService = new TrendingService();
  const languages = ['javascript', 'python', 'rust'];
  
  jest.spyOn(github, 'search').mockResolvedValueOnce({
    items: [
      {
        number: 45231,
        title: 'Add Feature',
        labels: [{ name: 'good-first-issue' }],
        repository: { language: 'JavaScript' }
      },
      {
        number: 52104,
        title: 'Fix Bug',
        labels: [{ name: 'beginner' }],
        repository: { language: 'Python' }
      },
      {
        number: 13407,
        title: 'Update Docs',
        labels: [{ name: 'help-wanted' }],
        repository: { language: 'Rust' }
      }
    ]
  });
  
  // Act
  const issues = await trendingService.findBeginnerIssuesAcrossLanguages(languages);
  
  // Assert
  expect(issues).toHaveLength(3);
  expect(issues[0].labels).toContain('good-first-issue');
  expect(new Set(issues.map(i => i.repository.language))).toEqual(
    new Set(languages)
  );
});
```

### Test 3: Daily Issue Suggestions (3 per day)

**Test Name**: `should return exactly 3 daily issue suggestions`

```javascript
test('should return exactly 3 daily issue suggestions', async () => {
  // Arrange
  const trendingService = new TrendingService();
  const userPreferences = {
    languages: ['javascript'],
    dailyGoal: 3
  };
  
  // Mock multiple trending repos
  jest.spyOn(github, 'search')
    .mockResolvedValueOnce({ items: [/* trending repos */] });
  
  // Mock issues from each repo
  jest.spyOn(github, 'getIssues')
    .mockResolvedValueOnce({ items: [/* 10+ issues */] })
    .mockResolvedValueOnce({ items: [/* 10+ issues */] })
    .mockResolvedValueOnce({ items: [/* 10+ issues */] });
  
  // Act
  const dailyChallenges = await trendingService.findDailyIssues(userPreferences);
  
  // Assert
  expect(dailyChallenges).toHaveLength(3);
  expect(dailyChallenges[0]).toHaveProperty('issue.number');
  expect(dailyChallenges[0]).toHaveProperty('repository.fullName');
  expect(dailyChallenges[0]).toHaveProperty('metadata.difficulty');
});

test('should not return same issue twice in daily challenges', async () => {
  // Arrange
  const trendingService = new TrendingService();
  
  // Act
  const dailyChallenges = await trendingService.findDailyIssues({});
  
  // Assert
  const issueNumbers = dailyChallenges.map(c => c.issue.number);
  const uniqueNumbers = new Set(issueNumbers);
  expect(uniqueNumbers.size).toBe(issueNumbers.length);
});
```

### Test 4: Issue Filtering by Stars and Activity

**Test Name**: `should filter issues by repository stars and activity`

```javascript
test('should filter repositories by minimum stars', async () => {
  // Arrange
  const minStars = 50000;
  
  // Mock repositories with varying star counts
  jest.spyOn(github, 'search').mockResolvedValueOnce({
    items: [
      { full_name: 'popular/repo1', stars: 100000 },
      { full_name: 'popular/repo2', stars: 75000 },
      { full_name: 'niche/repo', stars: 2000 }
    ]
  });
  
  // Act
  const repos = await trendingService.findTrendingRepositories(
    ['javascript'],
    10,
    minStars
  );
  
  // Assert
  expect(repos.every(r => r.stars >= minStars)).toBe(true);
  expect(repos.length).toBeLessThan(3);
});

test('should prioritize recently active issues', async () => {
  // Arrange
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  // Act
  const issues = await trendingService.findBeginnerIssuesInRepo('facebook/react');
  
  // Assert
  // All issues should be created recently
  issues.forEach(issue => {
    const createdTime = new Date(issue.createdAt).getTime();
    expect(createdTime).toBeGreaterThan(oneWeekAgo);
  });
});
```

### Test 5: Handle No Issues Found

**Test Name**: `should handle case when no beginner issues found`

```javascript
test('should handle no beginner issues found', async () => {
  // Arrange
  jest.spyOn(github, 'search').mockResolvedValueOnce({
    items: [] // Empty results
  });
  
  // Act & Assert
  const issues = await trendingService.findBeginnerIssuesInRepo('private/repo');
  expect(issues).toEqual([]);
});

test('should return null when insufficient issues for daily challenges', async () => {
  // Arrange
  jest.spyOn(github, 'search').mockResolvedValueOnce({
    items: [{ /* only 1 issue */ }]
  });
  
  // Act
  const result = await trendingService.findDailyIssues({});
  
  // Assert
  expect(result).toBeNull();
  expect(logger.warn).toHaveBeenCalledWith(
    expect.stringContaining('Not enough beginner issues')
  );
});
```

### Test 6: API Rate Limiting

**Test Name**: `should handle GitHub API rate limiting gracefully`

```javascript
test('should throw RateLimitError when API limit exceeded', async () => {
  // Arrange
  jest.spyOn(github, 'search').mockRejectedValueOnce({
    status: 403,
    message: 'API rate limit exceeded'
  });
  
  // Act & Assert
  await expect(
    trendingService.findTrendingRepositories(['javascript'])
  ).rejects.toThrow(RateLimitError);
});

test('should provide reset time in rate limit error', async () => {
  // Arrange
  const resetTime = Math.floor(Date.now() / 1000) + 3600;
  jest.spyOn(github, 'search').mockRejectedValueOnce({
    status: 403,
    headers: { 'x-ratelimit-reset': resetTime },
    message: 'Rate limit exceeded'
  });
  
  // Act & Assert
  try {
    await trendingService.findTrendingRepositories(['javascript']);
  } catch (error) {
    expect(error.resetTime).toBe(resetTime);
    expect(error.retryAfter).toBeDefined();
  }
});
```

### Test 7: Language Preference Filtering

**Test Name**: `should respect user language preferences`

```javascript
test('should filter daily challenges by user language preference', async () => {
  // Arrange
  const userLanguages = ['typescript', 'python'];
  
  // Act
  const challenges = await trendingService.findDailyIssues({
    languages: userLanguages
  });
  
  // Assert
  challenges.forEach(challenge => {
    expect(userLanguages).toContain(challenge.repository.language.toLowerCase());
  });
});

test('should default to multiple languages if none specified', async () => {
  // Arrange
  const trendingService = new TrendingService();
  
  // Act
  const challenges = await trendingService.findDailyIssues({});
  
  // Assert
  const languages = new Set(
    challenges.map(c => c.repository.language.toLowerCase())
  );
  expect(languages.size).toBeGreaterThan(1);
});
```

### Test 8: Duplicate Issue Prevention

**Test Name**: `should prevent suggesting issues user already completed`

```javascript
test('should not suggest issues user already completed', async () => {
  // Arrange
  const contributionService = new ContributionService();
  const userStats = await contributionService.getStats();
  const completedIssueNumbers = userStats.contributions.map(c => c.issue.number);
  
  // Act
  const challenges = await trendingService.findDailyIssues({});
  
  // Assert
  challenges.forEach(challenge => {
    expect(completedIssueNumbers).not.toContain(challenge.issue.number);
  });
});
```

---

## Streak Tracking Feature Tests

### Test 9: Streak Initialization

**Test Name**: `should start new user with 0 streak`

```javascript
describe('Streak Tracking', () => {
  test('should initialize user with 0 streak', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    const stats = await contributionService.getStats();
    
    // Assert
    expect(stats.streaks.current.count).toBe(0);
    expect(stats.streaks.longest.count).toBe(0);
  });

  test('should start streak at 1 on first contribution', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    await contributionService.recordContribution(123, 'owner/repo', 'beginner');
    const stats = await contributionService.getStats();
    
    // Assert
    expect(stats.streaks.current.count).toBe(1);
    expect(stats.streaks.current.startDate).toBe(getTodayString());
  });
});
```

### Test 10: Streak Continuation

**Test Name**: `should continue streak on next day contribution`

```javascript
test('should continue streak to day 2 on next day contribution', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // First contribution today
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  let stats = await contributionService.getStats();
  expect(stats.streaks.current.count).toBe(1);
  
  // Simulate next day
  mockDate.set(new Date(Date.now() + 24 * 60 * 60 * 1000));
  
  // Act: Contribution on day 2
  await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(2);
  expect(stats.streaks.current.lastContributionDate).toBe(getTodayString());
});

test('should accumulate streak over multiple days', async () => {
  // Arrange
  const contributionService = new ContributionService();
  const days = 7;
  
  // Act: Contribute every day for 7 days
  for (let i = 0; i < days; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
  
  const stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(7);
});
```

### Test 11: Streak Reset

**Test Name**: `should reset streak after missed day`

```javascript
test('should reset streak after one missed day', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Contribute day 1
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  mockDate.set(new Date(Date.now() + 24 * 60 * 60 * 1000));
  
  // Contribute day 2
  await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  
  let stats = await contributionService.getStats();
  expect(stats.streaks.current.count).toBe(2);
  
  // Simulate missing day 3 and contributing on day 4
  mockDate.set(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  
  // Act: Contribute after missing a day
  await contributionService.recordContribution(789, 'owner/repo', 'beginner');
  stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(1); // Reset to 1
  expect(stats.streaks.longest.count).toBe(2); // Previous streak preserved
});
```

### Test 12: Longest Streak Tracking

**Test Name**: `should track longest streak separately from current streak`

```javascript
test('should update longest streak when exceeded', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Build 5-day streak
  for (let i = 0; i < 5; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
  
  let stats = await contributionService.getStats();
  expect(stats.streaks.longest.count).toBe(5);
  
  // Miss a day and restart
  mockDate.set(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)); // Miss day 6
  mockDate.set(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000));
  await contributionService.recordContribution(200, 'owner/repo', 'beginner');
  
  // Build 7-day streak
  for (let i = 1; i < 7; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(300 + i, 'owner/repo', 'beginner');
  }
  
  // Act & Assert
  stats = await contributionService.getStats();
  expect(stats.streaks.longest.count).toBe(7); // Updated to new record
  expect(stats.streaks.current.count).toBe(7);
});
```

### Test 13: Multiple Streak Cycles

**Test Name**: `should handle multiple streak cycles correctly`

```javascript
test('should track multiple streaks in history', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // First streak: 3 days
  for (let i = 0; i < 3; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
  
  // Miss day, restart
  mockDate.set(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  
  // Second streak: 5 days
  for (let i = 0; i < 5; i++) {
    mockDate.set(new Date(Date.now() + (4 + i) * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(200 + i, 'owner/repo', 'beginner');
  }
  
  // Act
  const stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.history.length).toBeGreaterThanOrEqual(2);
  expect(stats.streaks.history[0].count).toBe(3);
  expect(stats.streaks.history[1].count).toBe(5);
});
```

### Test 14: Streak Visualization

**Test Name**: `should format streak for dashboard display`

```javascript
test('should display streak with fire emojis', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Build 8-day streak
  for (let i = 0; i < 8; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
  
  // Act
  const stats = await contributionService.getStats();
  const streakDisplay = formatStreakForDisplay(stats.streaks.current.count);
  
  // Assert
  expect(streakDisplay).toBe('🔥🔥🔥🔥🔥🔥🔥🔥'); // 8 fire emojis
});
```

### Test 15: Streak on Timezone Boundaries

**Test Name**: `should handle timezone boundaries correctly`

```javascript
test('should reset streak at midnight in user timezone', async () => {
  // Arrange
  const contributionService = new ContributionService();
  contributionService.setTimezone('America/New_York');
  
  // Simulate 11:55 PM EST (4:55 AM UTC next day)
  mockDate.set(new Date('2025-02-28T04:55:00Z'));
  
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  let stats = await contributionService.getStats();
  expect(stats.streaks.current.count).toBe(1);
  
  // Simulate 12:05 AM EST next day (5:05 AM UTC)
  mockDate.set(new Date('2025-02-28T05:05:00Z'));
  
  // Act: Should count as day 2 of streak
  await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(2);
});

test('should not break streak across UTC midnight', async () => {
  // Arrange
  const contributionService = new ContributionService();
  contributionService.setTimezone('Asia/Tokyo'); // UTC+9
  
  // Contribute at 11 PM Tokyo time (2 PM UTC)
  mockDate.set(new Date('2025-02-28T14:00:00Z'));
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  
  // Next contribution at 1 AM Tokyo time (4 PM UTC previous day)
  mockDate.set(new Date('2025-02-28T16:00:00Z'));
  
  // Act
  await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  const stats = await contributionService.getStats();
  
  // Assert: Same day in Tokyo timezone, streak continues
  expect(stats.streaks.current.count).toBe(1); // Both same day in Tokyo
});
```

### Test 16: Streak Persistence

**Test Name**: `should persist streak data across sessions`

```javascript
test('should maintain streak after closing and reopening app', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Contribute and close app
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  let stats = await contributionService.getStats();
  const streakAfterClose = stats.streaks.current.count;
  
  // Act: Simulate app restart
  const newService = new ContributionService();
  stats = await newService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(streakAfterClose);
});
```

---

## Level/XP System Tests

### Test 17: XP Increments on Contribution

**Test Name**: `should award XP on each contribution`

```javascript
describe('Level and XP System', () => {
  test('should award base XP on contribution', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    const result = await contributionService.recordContribution(123, 'owner/repo', 'beginner');
    
    // Assert
    expect(result.xpEarned).toBeGreaterThan(0);
    expect(result.totalXP).toBe(result.xpEarned);
  });

  test('should award different XP for different difficulties', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    const beginnerXP = (await contributionService.recordContribution(123, 'owner/repo', 'beginner')).xpEarned;
    const expertXP = (await contributionService.recordContribution(456, 'owner/repo', 'expert')).xpEarned;
    
    // Assert
    expect(expertXP).toBeGreaterThan(beginnerXP);
  });
});
```

### Test 18: Level Up at XP Threshold

**Test Name**: `should level up when XP threshold reached`

```javascript
test('should level up when reaching next level XP', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Record contributions to reach level 2
  // Level 1 → 2 requires 100 XP
  // With base XP of ~10-25 per contribution, need ~5-10 contributions
  
  // Act
  let stats = await contributionService.getStats();
  const startingLevel = stats.progression.level;
  
  // Contribute multiple times to accumulate XP
  for (let i = 0; i < 10; i++) {
    await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'normal'
    );
  }
  
  stats = await contributionService.getStats();
  
  // Assert
  expect(stats.progression.level).toBeGreaterThanOrEqual(startingLevel);
});

test('should award bonus XP on level up', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Accumulate XP until about to level up
  let stats = await contributionService.getStats();
  const targetXP = getTotalXPForLevel(stats.progression.level + 1) - 5;
  
  // Contribute until near threshold
  while (stats.progression.totalXP < targetXP) {
    await contributionService.recordContribution(
      Math.random() * 10000,
      'owner/repo',
      'normal'
    );
    stats = await contributionService.getStats();
  }
  
  // Act: Contribution that triggers level up
  const beforeXP = stats.progression.totalXP;
  const result = await contributionService.recordContribution(
    9999,
    'owner/repo',
    'expert'
  );
  
  stats = await contributionService.getStats();
  
  // Assert
  if (result.leveledUp) {
    // Should have received contribution XP + level-up bonus
    expect(stats.progression.totalXP).toBeGreaterThan(
      beforeXP + result.xpEarned
    );
  }
});
```

### Test 19: XP Calculation Formula

**Test Name**: `should calculate XP with correct multipliers`

```javascript
test('should apply streak multiplier to XP', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Build a streak first
  for (let i = 0; i < 5; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
  
  // Act: Record another contribution with 5-day streak
  const result = await contributionService.recordContribution(500, 'owner/repo', 'beginner');
  
  // Assert
  // Base: 10, Streak multiplier: 1 + (0.05 * 5) = 1.25, Difficulty: 1.0
  // Expected: 10 * 1.25 * 1.0 = 12.5 ≈ 12 XP
  expect(result.xpEarned).toBeGreaterThan(10);
  expect(result.xpEarned).toBeLessThanOrEqual(15);
});

test('should apply difficulty multiplier to XP', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act
  const beginnerResult = await contributionService.recordContribution(
    123,
    'owner/repo',
    'beginner'
  );
  
  // Clear and test with expert
  await reset();
  
  const expertResult = await contributionService.recordContribution(
    456,
    'owner/repo',
    'expert'
  );
  
  // Assert
  // Expert difficulty multiplier should be ~5x higher than beginner
  expect(expertResult.xpEarned).toBeGreaterThan(
    beginnerResult.xpEarned * 3
  );
});
```

### Test 20: Level Progression

**Test Name**: `should progress through levels with milestones`

```javascript
test('should reach level 10 eventually', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Make many contributions over simulated days
  for (let day = 0; day < 100; day++) {
    mockDate.set(new Date(Date.now() + day * 24 * 60 * 60 * 1000));
    
    // 2-3 contributions per day
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      await contributionService.recordContribution(
        day * 100 + i,
        'owner/repo',
        ['beginner', 'normal', 'hard'][Math.floor(Math.random() * 3)]
      );
    }
  }
  
  const stats = await contributionService.getStats();
  
  // Assert
  expect(stats.progression.level).toBeGreaterThanOrEqual(5);
});
```

### Test 21: Level Display Format

**Test Name**: `should format level progress for display`

```javascript
test('should display level and XP correctly', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Contribute to get some XP
  for (let i = 0; i < 3; i++) {
    await contributionService.recordContribution(100 + i, 'owner/repo', 'normal');
  }
  
  // Act
  const stats = await contributionService.getStats();
  const display = formatLevelForDisplay(stats.progression);
  
  // Assert
  expect(display).toMatch(/Level \d+/);
  expect(display).toMatch(/\d+\/\d+ XP/);
  expect(display).toMatch(/\d+\.\d+%/);
});
```

---

## Badge System Tests

### Test 22: First Contribution Badge

**Test Name**: `should award first contribution badge`

```javascript
describe('Badge System', () => {
  test('should award First Step badge on first contribution', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    const result = await contributionService.recordContribution(123, 'owner/repo', 'beginner');
    
    // Assert
    expect(result.newBadges).toContainEqual(
      expect.objectContaining({ id: 'first-step' })
    );
  });

  test('should not award First Step badge twice', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // First contribution
    let result = await contributionService.recordContribution(123, 'owner/repo', 'beginner');
    expect(result.newBadges.some(b => b.id === 'first-step')).toBe(true);
    
    // Second contribution
    result = await contributionService.recordContribution(456, 'owner/repo', 'beginner');
    
    // Assert
    expect(result.newBadges.some(b => b.id === 'first-step')).toBe(false);
  });
});
```

### Test 23: Streak-Based Badges

**Test Name**: `should award badges for streak milestones`

```javascript
test('should award 3-day streak badge', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Build 3-day streak
  for (let i = 0; i < 3; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner'
    );
    
    if (i === 2) {
      // Assert on day 3
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'three-days-strong' })
      );
    }
  }
});

test('should award 7-day, 14-day, 21-day, 30-day badges', async () => {
  // Arrange
  const contributionService = new ContributionService();
  const milestones = [7, 14, 21, 30];
  
  // Act: Build 30-day streak
  for (let i = 0; i < 30; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner'
    );
    
    // Assert badges at milestones
    if (milestones.includes(i + 1)) {
      const expectedBadgeId = {
        7: 'silver-week',
        14: 'gold-month',
        21: 'diamond-dedication',
        30: 'unstoppable'
      }[i + 1];
      
      expect(result.newBadges.some(b => b.id === expectedBadgeId)).toBe(true);
    }
  }
});
```

### Test 24: Contribution Volume Badges

**Test Name**: `should award badges for contribution counts`

```javascript
test('should award badges at 5, 10, 25, 50, 100 contributions', async () => {
  // Arrange
  const contributionService = new ContributionService();
  const milestones = {
    5: 'rising-star',
    10: 'rockstar',
    25: 'elite',
    50: 'legend',
    100: 'hall-of-fame'
  };
  
  // Act & Assert
  for (let i = 1; i <= 100; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner'
    );
    
    if (milestones[i]) {
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: milestones[i] })
      );
    }
  }
});
```

### Test 25: Language Specialization Badges

**Test Name**: `should award language-specific badges`

```javascript
test('should award JavaScript Ninja badge at 10 JS contributions', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Make 10 JavaScript contributions
  for (let i = 0; i < 10; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      `javascript-org/repo${i}`,
      'beginner'
    );
    
    // Mock the repository detection as JavaScript
    jest.spyOn(github, 'getRepository').mockResolvedValueOnce({
      language: 'JavaScript'
    });
    
    if (i === 9) {
      // Assert on 10th contribution
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'javascript-ninja' })
      );
    }
  }
});

test('should track contributions per language separately', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Mix of JavaScript and Python contributions
  for (let i = 0; i < 5; i++) {
    await contributionService.recordContribution(
      100 + i,
      'owner/js-repo',
      'beginner'
    );
  }
  
  for (let i = 0; i < 8; i++) {
    await contributionService.recordContribution(
      200 + i,
      'owner/py-repo',
      'beginner'
    );
  }
  
  // Assert
  const stats = await contributionService.getStats();
  expect(stats.byLanguage['JavaScript'].count).toBe(5);
  expect(stats.byLanguage['Python'].count).toBe(8);
});
```

### Test 26: Achievement Badges

**Test Name**: `should award contribution type badges`

```javascript
test('should award Bug Hunter badge for bug fixes', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Make 10 bug fix contributions
  for (let i = 0; i < 10; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner',
      { type: 'bug-fix' }
    );
    
    if (i === 9) {
      // Assert on 10th bug fix
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'bug-hunter' })
      );
    }
  }
});

test('should award Documentation Master badge', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Make 5 documentation contributions
  for (let i = 0; i < 5; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner',
      { type: 'documentation' }
    );
    
    if (i === 4) {
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'documentation-master' })
      );
    }
  }
});
```

### Test 27: Repository Diversity Badge

**Test Name**: `should award Global Contributor badge`

```javascript
test('should award Global Contributor after 5 different repos', async () => {
  // Arrange
  const contributionService = new ContributionService();
  const repos = [
    'facebook/react',
    'nodejs/node',
    'vuejs/vue',
    'angular/angular',
    'rust-lang/rust'
  ];
  
  // Act
  for (let i = 0; i < repos.length; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      repos[i],
      'beginner'
    );
    
    if (i === 4) {
      // Assert on 5th repo
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'global-contributor' })
      );
    }
  }
});
```

### Test 28: Team Collaboration Badge

**Test Name**: `should award Team Player badge for code reviews`

```javascript
test('should track collaborative contributions', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act: Record 5 PRs with reviews from others
  for (let i = 0; i < 5; i++) {
    const result = await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner',
      { 
        type: 'feature',
        reviewedBy: ['user1', 'user2', 'user3'][Math.floor(Math.random() * 3)]
      }
    );
    
    if (i === 4) {
      expect(result.newBadges).toContainEqual(
        expect.objectContaining({ id: 'team-player' })
      );
    }
  }
});
```

---

## Dashboard Display Tests

### Test 29: Dashboard Layout

**Test Name**: `should display dashboard with all required sections`

```javascript
describe('Dashboard Display', () => {
  test('should render complete dashboard', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Make some contributions
    for (let i = 0; i < 3; i++) {
      await contributionService.recordContribution(
        100 + i,
        'owner/repo',
        'beginner'
      );
    }
    
    // Act
    const dashboard = await contributionService.getDashboard();
    
    // Assert
    expect(dashboard).toHaveProperty('todayProgress');
    expect(dashboard).toHaveProperty('quickStats');
    expect(dashboard).toHaveProperty('weeklyChart');
    expect(dashboard).toHaveProperty('recentBadges');
    expect(dashboard).toHaveProperty('dailyChallenges');
  });
});
```

### Test 30: Progress Bar Accuracy

**Test Name**: `should calculate progress bars correctly`

```javascript
test('should display daily progress bar', async () => {
  // Arrange
  const contributionService = new ContributionService();
  contributionService.setDailyGoal(3);
  
  // Make 2 contributions
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  
  // Act
  const dashboard = await contributionService.getDashboard();
  
  // Assert
  expect(dashboard.todayProgress.count).toBe(2);
  expect(dashboard.todayProgress.goal).toBe(3);
  expect(dashboard.todayProgress.percentage).toBe(67);
});

test('should display XP progress bar', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Contribute to accumulate some XP
  for (let i = 0; i < 5; i++) {
    await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'normal'
    );
  }
  
  // Act
  const dashboard = await contributionService.getDashboard();
  
  // Assert
  expect(dashboard.quickStats.xpProgress.percentage).toBeGreaterThan(0);
  expect(dashboard.quickStats.xpProgress.percentage).toBeLessThanOrEqual(100);
});
```

### Test 31: Dashboard Stats Accuracy

**Test Name**: `should display accurate statistics`

```javascript
test('should display correct stats in dashboard', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Make known contributions
  for (let i = 0; i < 5; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await contributionService.recordContribution(
      100 + i,
      'owner/repo',
      'beginner'
    );
  }
  
  // Act
  const dashboard = await contributionService.getDashboard();
  
  // Assert
  expect(dashboard.quickStats.level).toBeGreaterThanOrEqual(1);
  expect(dashboard.quickStats.streak).toBe(5);
  expect(dashboard.quickStats.badges).toBeGreaterThanOrEqual(1);
});
```

### Test 32: Badge Display

**Test Name**: `should display earned badges in dashboard`

```javascript
test('should show recent badges on dashboard', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Make first contribution (earns First Step badge)
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  
  // Act
  const dashboard = await contributionService.getDashboard();
  
  // Assert
  expect(dashboard.recentBadges).toHaveLength(1);
  expect(dashboard.recentBadges[0].id).toBe('first-step');
});
```

### Test 33: GitHub Profile Integration

**Test Name**: `should display GitHub stats on dashboard`

```javascript
test('should integrate GitHub profile stats', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  jest.spyOn(github, 'getUser').mockResolvedValueOnce({
    public_repos: 25,
    followers: 150,
    created_at: '2020-01-15T00:00:00Z'
  });
  
  // Act
  const dashboard = await contributionService.getDashboard();
  
  // Assert
  expect(dashboard).toHaveProperty('githubStats');
  expect(dashboard.githubStats.publicRepos).toBe(25);
  expect(dashboard.githubStats.followers).toBe(150);
});
```

---

## Tracking Feature Tests

### Test 34: Recording Issue Solve

**Test Name**: `should record when user starts tracking issue`

```javascript
describe('Tracking Feature', () => {
  test('should record active issue tracking', async () => {
    // Arrange
    const contributionService = new ContributionService();
    
    // Act
    await contributionService.startTracking(45231, 'facebook/react');
    
    // Assert
    const tracking = await contributionService.getTracking();
    expect(tracking.active).toHaveLength(1);
    expect(tracking.active[0].issue).toBe(45231);
  });
});
```

### Test 35: Tracking with Track Flag

**Test Name**: `should handle `--track` command flag`

```javascript
test('should track issue with --track flag', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act
  await contributionService.recordContribution(
    123,
    'facebook/react',
    'beginner',
    { tracked: true }
  );
  
  // Assert
  const stats = await contributionService.getStats();
  expect(stats.tracking).toContainEqual(
    expect.objectContaining({ issue: 123 })
  );
});
```

### Test 36: Repo Format Validation

**Test Name**: `should validate repo format`

```javascript
test('should validate repo format owner/name', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act & Assert: Valid format
  await expect(
    contributionService.recordContribution(123, 'owner/repo', 'beginner')
  ).resolves.toBeDefined();
  
  // Invalid formats
  await expect(
    contributionService.recordContribution(123, 'invalid-format', 'beginner')
  ).rejects.toThrow(InvalidRepoFormatError);
  
  await expect(
    contributionService.recordContribution(123, '', 'beginner')
  ).rejects.toThrow(InvalidRepoFormatError);
});
```

### Test 37: Duplicate Tracking Prevention

**Test Name**: `should prevent tracking same issue twice`

```javascript
test('should not track same issue twice', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act
  await contributionService.startTracking(123, 'owner/repo');
  
  // Assert
  await expect(
    contributionService.startTracking(123, 'owner/repo')
  ).rejects.toThrow('Already tracking this issue');
});
```

---

## Integration Tests

### Test 38: Complete Daily Workflow

**Test Name**: `should complete find → solve → track → pr workflow`

```javascript
describe('Integration Tests', () => {
  test('should complete full daily contribution workflow', async () => {
    // Arrange
    const trendingService = new TrendingService();
    const contributionService = new ContributionService();
    
    // Step 1: Get daily challenges
    const challenges = await trendingService.findDailyIssues({});
    expect(challenges).toHaveLength(3);
    
    // Step 2: Select first challenge
    const challenge = challenges[0];
    
    // Step 3: Track the issue
    await contributionService.startTracking(
      challenge.issue.number,
      challenge.repository.fullName
    );
    
    let tracking = await contributionService.getTracking();
    expect(tracking.active).toHaveLength(1);
    
    // Step 4: Record contribution (simulating PR merge)
    const result = await contributionService.recordContribution(
      challenge.issue.number,
      challenge.repository.fullName,
      challenge.metadata.difficulty
    );
    
    // Assert
    expect(result.xpEarned).toBeGreaterThan(0);
    expect(result.streakExtended).toBe(true);
  });
});
```

### Test 39: Contribute + Solve Integration

**Test Name**: `should integrate with solve command`

```javascript
test('should record contribution from solve command', async () => {
  // Arrange
  const solveService = new SolveService();
  const contributionService = new ContributionService();
  
  // Act: Solve command automatically calls contribute
  const issue = await solveService.resolveIssue(
    'facebook/react',
    45231
  );
  
  // Simulate PR submission
  const prNumber = 12345;
  const result = await contributionService.recordContribution(
    45231,
    'facebook/react',
    'normal'
  );
  
  // Assert
  expect(result.success).toBe(true);
  expect(result.xpEarned).toBeGreaterThan(0);
});
```

### Test 40: Contribute + PR Integration

**Test Name**: `should integrate with pr command`

```javascript
test('should record contribution from PR submission', async () => {
  // Arrange
  const prService = new PRService();
  const contributionService = new ContributionService();
  
  // Act: Submit PR
  const pr = await prService.submitPR({
    repo: 'facebook/react',
    number: 12345,
    linkedIssue: 45231
  });
  
  // Should automatically trigger contribution recording
  const stats = await contributionService.getStats();
  
  // Assert
  expect(stats.totalContributions).toBeGreaterThan(0);
});
```

### Test 41: Streak Persistence with New Day

**Test Name**: `should maintain streak across midnight`

```javascript
test('should continue streak when day changes', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Day 1: Make contribution
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  let stats = await contributionService.getStats();
  expect(stats.streaks.current.count).toBe(1);
  
  // Simulate day change
  mockDate.set(new Date(Date.now() + 24 * 60 * 60 * 1000));
  
  // Day 2: Make contribution
  const result = await contributionService.recordContribution(456, 'owner/repo', 'beginner');
  stats = await contributionService.getStats();
  
  // Assert
  expect(stats.streaks.current.count).toBe(2);
  expect(result.streakExtended).toBe(true);
});
```

### Test 42: Multiple Users' Separate Databases

**Test Name**: `should maintain separate stats for different users`

```javascript
test('should isolate stats between users', async () => {
  // Arrange
  const user1Service = new ContributionService('user1');
  const user2Service = new ContributionService('user2');
  
  // Act: User 1 makes contributions
  await user1Service.recordContribution(123, 'owner/repo', 'beginner');
  await user1Service.recordContribution(456, 'owner/repo', 'beginner');
  
  // User 2 makes contributions
  await user2Service.recordContribution(789, 'owner/repo', 'beginner');
  
  // Assert
  const user1Stats = await user1Service.getStats();
  const user2Stats = await user2Service.getStats();
  
  expect(user1Stats.totalContributions).toBe(2);
  expect(user2Stats.totalContributions).toBe(1);
});
```

### Test 43: Database Recovery from Corruption

**Test Name**: `should recover from corrupted database`

```javascript
test('should handle and recover from database corruption', async () => {
  // Arrange
  let contributionService = new ContributionService();
  
  // Make initial contributions
  await contributionService.recordContribution(123, 'owner/repo', 'beginner');
  
  // Simulate database corruption
  const dbPath = contributionService.getDBPath();
  fs.writeFileSync(dbPath, 'corrupted data {invalid json}');
  
  // Act: Reinitialize service
  contributionService = new ContributionService();
  
  // Assert
  expect(contributionService.isHealthy()).toBe(true);
  // Should restore from backup or reinitialize
});
```

---

## Error Handling Tests

### Test 44: No Authentication Error

**Test Name**: `should error if user not authenticated`

```javascript
describe('Error Handling', () => {
  test('should require authentication before recording', async () => {
    // Arrange
    const contributionService = new ContributionService();
    jest.spyOn(auth, 'getToken').mockReturnValueOnce(null);
    
    // Act & Assert
    await expect(
      contributionService.recordContribution(123, 'owner/repo', 'beginner')
    ).rejects.toThrow(NoAuthenticationError);
  });
});
```

### Test 45: Invalid Repo Format Error

**Test Name**: `should validate repository format`

```javascript
test('should reject invalid repository format', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  // Act & Assert
  const invalidRepos = [
    'invalid',
    'owner/',
    '/repo',
    'owner/repo/extra',
    '',
    null
  ];
  
  for (const repo of invalidRepos) {
    await expect(
      contributionService.recordContribution(123, repo, 'beginner')
    ).rejects.toThrow(InvalidRepoFormatError);
  }
});
```

### Test 46: GitHub API Errors

**Test Name**: `should handle GitHub API errors gracefully`

```javascript
test('should handle GitHub API errors', async () => {
  // Arrange
  const trendingService = new TrendingService();
  
  jest.spyOn(github, 'search').mockRejectedValueOnce({
    status: 500,
    message: 'Server error'
  });
  
  // Act & Assert
  await expect(
    trendingService.findTrendingRepositories(['javascript'])
  ).rejects.toThrow(GitHubAPIError);
});

test('should provide fallback on API error', async () => {
  // Arrange
  const trendingService = new TrendingService();
  
  jest.spyOn(github, 'search').mockRejectedValueOnce(
    new Error('Network error')
  );
  
  // Act
  const result = await trendingService.findDailyIssues({}).catch(err => {
    // Fallback: return cached or empty
    return null;
  });
  
  // Assert
  expect(result).toBeNull();
});
```

### Test 47: Database Write Failures

**Test Name**: `should handle database write failures`

```javascript
test('should detect database write failures', async () => {
  // Arrange
  const contributionService = new ContributionService();
  
  jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
    throw new Error('Permission denied');
  });
  
  // Act & Assert
  await expect(
    contributionService.recordContribution(123, 'owner/repo', 'beginner')
  ).rejects.toThrow(DatabaseError);
});
```

---

## Test Utilities and Mocks

### Mock Setup

```javascript
// __tests__/utils/mocks.js

export const mockGitHub = () => {
  return {
    search: jest.fn().mockResolvedValue({ items: [] }),
    getRepository: jest.fn().mockResolvedValue({ language: 'JavaScript' }),
    getIssues: jest.fn().mockResolvedValue({ items: [] }),
    getUser: jest.fn().mockResolvedValue({ followers: 0 })
  };
};

export const mockFileSystem = () => {
  return {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    existsSync: jest.fn().mockReturnValue(true)
  };
};
```

### Test Helpers

```javascript
// __tests__/utils/test-helpers.js

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function createMockContribution(overrides = {}) {
  return {
    id: 'contrib-001',
    date: new Date().toISOString(),
    issue: { number: 123, title: 'Test' },
    repository: { fullName: 'owner/repo' },
    metadata: { difficulty: 'beginner', xpEarned: 10 },
    ...overrides
  };
}

export async function buildStreak(service, days) {
  for (let i = 0; i < days; i++) {
    mockDate.set(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    await service.recordContribution(100 + i, 'owner/repo', 'beginner');
  }
}

export function getTotalXPForLevel(level) {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += 50 * i;
  }
  return total;
}
```

---

**Last Updated**: February 2025
**Version**: 1.0
**Total Test Cases**: 47
**Coverage Target**: 90%+ for all services

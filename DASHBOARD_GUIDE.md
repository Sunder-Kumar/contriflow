# ContriFlow Dashboard Guide

## Table of Contents
1. [Overview](#overview)
2. [Dashboard Features](#dashboard-features)
3. [Dashboard Modes](#dashboard-modes)
4. [Usage Examples](#usage-examples)
5. [Interpreting the Dashboard](#interpreting-the-dashboard)
6. [ASCII Art Visualization](#ascii-art-visualization)
7. [Badge Display and Interpretation](#badge-display-and-interpretation)
8. [Integration with Other Commands](#integration-with-other-commands)
9. [Quick Reference Guide](#quick-reference-guide)
10. [FAQ](#faq)

## Overview

The ContriFlow Dashboard is a powerful visualization tool that displays your GitHub contribution activity, progress metrics, achievements, and streaks in real-time. It provides a comprehensive snapshot of your development journey, combining traditional statistics with beautiful ASCII art visualizations and achievement badges.

The dashboard is designed to be flexible and informative, offering multiple display modes to suit different preferences and use cases. Whether you're tracking your daily contributions, monitoring your XP progress, or showcasing your achievements, the ContriFlow Dashboard has you covered.

### Key Features

- **Real-time Statistics**: Display current contribution counts, XP levels, and streak information
- **Progress Visualization**: ASCII art-based progress bars and level indicators
- **Achievement Badges**: Showcase earned badges and milestones
- **Multiple Display Modes**: Choose between full dashboard, stats-only, badges-only, or detailed views
- **Customizable Output**: Filter and format output to match your workflow
- **GitHub Integration**: Seamless integration with GitHub profile data
- **Daily Tracking**: Monitor today's contributions and goal progress

## Dashboard Features

### Stats Display

The dashboard displays core contribution statistics:

- **Current Level**: Your current XP level (ranges from 1-100+)
- **XP Progress**: Visual progress bar showing XP accumulation toward next level
- **Total Contributions**: Lifetime count of all contributions (commits, PRs, issues)
- **Current Streak**: Number of consecutive days with contributions
- **Longest Streak**: Your best streak record
- **Pull Requests**: Total number of pull requests submitted
- **Issues**: Total number of issues created
- **Today's Contributions**: Current day's contribution count
- **Goal Progress**: Visual indicator of daily goal achievement

### ASCII Art Visualization

The dashboard uses ASCII art to create visually appealing boxes and progress indicators:

```
┌─────────────────────────────────────┐
│ LEVEL 25 | XP: 875 / 1000           │
│ ████████████████░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
```

Features include:
- Level boxes with decorative borders
- Progress bars with fill characters
- Streak visualizations with flame emojis
- Badge grids with organized layout
- Stats boxes with aligned columns

### Badge Display

Badges represent achievements and milestones:

- **Badge Categories**: Contribution milestones, streak achievements, special accomplishments
- **Visual Indicators**: Each badge includes a name, description, and award date
- **Timeline Display**: Badges shown in chronological order
- **Badge Count**: Total number of earned badges displayed

### Additional Features

- **Color Output**: Enhanced readability with terminal colors (when supported)
- **Emoji Support**: Unicode emojis for visual enhancement
- **Responsive Layout**: Adapts to different terminal sizes
- **Error Handling**: Graceful degradation if GitHub API is unavailable

## Dashboard Modes

### 1. Full Dashboard (Default)

Displays all available information in a comprehensive layout.

```
Command: contriflow dashboard
```

**Displays:**
- Personal profile header
- Level and XP progress
- Contribution statistics
- Streak information
- Recent badges (last 5-10)
- Today's goal progress

**Best for:** Getting a complete overview of your contribution profile

### 2. ASCII Dashboard

Enhanced visualization using ASCII art boxes and artistic elements.

```
Command: contriflow dashboard --ascii
```

**Displays:**
- Large ASCII art level box with decorative styling
- Level progress visualization
- Streak visualization with ASCII art
- All statistics in formatted boxes
- Badge grid with ASCII borders
- Detailed visual hierarchy

**Best for:** Terminal screenshots, aesthetics, detailed visualization

### 3. Badges-Only Mode

Focuses exclusively on your achievements.

```
Command: contriflow dashboard --badges
```

**Displays:**
- All earned badges in grid format
- Badge names and descriptions
- Award dates for each badge
- Badge categories (if applicable)
- Total badge count
- Last earned badge highlight

**Best for:** Showcasing achievements, portfolio building

### 4. Stats-Only Mode

Focused statistical display without visual elements.

```
Command: contriflow dashboard --stats
```

**Displays:**
- Level and XP (no progress bar)
- Contribution statistics (clean numbers)
- Streak information (numerical)
- Percentages and ratios
- Minimal formatting

**Best for:** Quick facts, scripting, data extraction

### 5. Detailed Dashboard

Most comprehensive display with additional analytics.

```
Command: contriflow dashboard --detailed
```

**Displays:**
- All full dashboard information
- Contribution breakdown (commits, PRs, issues)
- Daily contribution history (last 7 days)
- Weekly averages
- Streak timeline
- XP earning rate (XP per day)
- Projected level completion date
- Top contribution days
- Achievement timeline

**Best for:** Deep analysis, tracking trends, goal planning

## Usage Examples

### Example 1: Default Dashboard Display

```bash
contriflow dashboard
```

**Output:**
```
┌─ ContriFlow Dashboard ───────────────────────────────────────┐
│                                                               │
│  GitHub User: octocat                                         │
│  Profile: https://github.com/octocat                          │
│                                                               │
│  ┌─ LEVEL & XP ─────────────────────────────────────────┐    │
│  │ Level: 25                                             │    │
│  │ XP: 875 / 1000  ████████████████░░░░░░░░░░░░░░░░░░░  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─ STATISTICS ──────────────────────────────────────────┐   │
│  │ Total Contributions:  2,847                           │   │
│  │ Pull Requests:        156                             │   │
│  │ Issues Created:       89                              │   │
│  │ Current Streak:       18 days 🔥                      │   │
│  │ Longest Streak:       64 days                         │   │
│  │ Today's Contributions: 5                              │   │
│  │ Daily Goal:           8/10 ████████░░                 │   │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─ RECENT BADGES ───────────────────────────────────────┐   │
│  │ 🏅 Streak Champion (30 days)    - 2024-01-15          │   │
│  │ 🎯 Milestone: 1000 Contributions - 2024-01-10         │   │
│  │ 💎 Rare Contributor              - 2024-01-05         │   │
│  │ ⭐ Rising Star                    - 2023-12-28         │   │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Example 2: ASCII Dashboard

```bash
contriflow dashboard --ascii
```

**Output:**
```
╔══════════════════════════════════════════════════════════════════╗
║                     🚀 CONTRIFLOW DASHBOARD 🚀                   ║
║              Advanced Contribution Tracking & Analytics           ║
╚══════════════════════════════════════════════════════════════════╝

╭─────────────────────────────────────────────────────────────────╮
│                         LEVEL INFORMATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃            ⭐ LEVEL 25 - Expert Contributor ⭐          ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                                  │
│  XP Progress: 875 / 1000                                         │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 87.5%    │
│                                                                  │
│  Next Level: 125 XP remaining                                    │
│  Estimated Time: ~8 days at current rate                        │
│                                                                  │
╰─────────────────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────────────────╮
│                    STREAK INFORMATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Current Streak: 18 days 🔥🔥🔥                                  │
│  Longest Streak: 64 days ⭐                                      │
│                                                                  │
│  Daily Activity: ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✗         │
│                                                                  │
╰─────────────────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────────────────╮
│                      STATISTICS SUMMARY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Total Contributions .......... 2,847                           │
│  Pull Requests ................ 156 (5.5%)                     │
│  Issues Created ............... 89 (3.1%)                      │
│  Code Reviews ................. 234                             │
│  Total Commits ................ 2,518 (88.4%)                  │
│                                                                  │
│  Today's Activity:         5 contributions                       │
│  This Week:               42 contributions                       │
│  This Month:             187 contributions                       │
│  All-Time Average:      3.2 contributions/day                   │
│                                                                  │
╰─────────────────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────────────────╮
│                      ACHIEVEMENT BADGES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ 🏅 Streak    │ 🎯 Milestone │ 💎 Rare      │ ⭐ Rising    │ │
│  │ Champion     │ 1000 Contribs│ Contributor  │ Star         │ │
│  │              │              │              │              │ │
│  │ 30 days 🔥   │ 2024-01-10   │ 2024-01-05   │ 2023-12-28   │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  Total Badges Earned: 47                                         │
│                                                                  │
╰─────────────────────────────────────────────────────────────────╯
```

### Example 3: Badges-Only Display

```bash
contriflow dashboard --badges
```

**Output:**
```
╭────────────────────────────────────────────────────────╮
│           🏆 YOUR ACHIEVEMENTS & BADGES 🏆             │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Total Badges Earned: 47                               │
│                                                         │
│  ┌─ STREAK BADGES (8) ─────────────────────────────┐  │
│  │ 🔥 Streak Champion (7 days)    - 2024-01-15     │  │
│  │ 🔥 Streak Master (30 days)     - 2024-01-10     │  │
│  │ 🔥 Streaker (100+ days)        - 2023-12-15     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ MILESTONE BADGES (12) ─────────────────────────┐  │
│  │ 🎯 Contribution Milestone (100)  - 2023-06-20   │  │
│  │ 🎯 Contribution Milestone (500)  - 2023-09-10   │  │
│  │ 🎯 Contribution Milestone (1000) - 2024-01-10   │  │
│  │ 🎯 PR Master (50 PRs)            - 2023-11-25   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ SPECIAL BADGES (27) ────────────────────────────┐  │
│  │ 💎 Rare Contributor            - 2024-01-05     │  │
│  │ ⭐ Rising Star                  - 2023-12-28     │  │
│  │ 🌟 Dedicated Developer          - 2023-11-15    │  │
│  │ 🚀 Launch Pad Contributor       - 2023-10-08    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Example 4: Stats-Only Mode

```bash
contriflow dashboard --stats
```

**Output:**
```
CONTRIFLOW DASHBOARD - STATISTICS

User: octocat
Profile: https://github.com/octocat

LEVEL & XP
  Level: 25
  XP: 875 / 1000 (87.5%)
  Remaining: 125 XP

CONTRIBUTION STATISTICS
  Total Contributions: 2,847
  Pull Requests: 156 (5.5%)
  Issues Created: 89 (3.1%)
  Code Reviews: 234 (8.2%)
  Total Commits: 2,518 (88.4%)

STREAK INFORMATION
  Current Streak: 18 days
  Longest Streak: 64 days
  Average Streak: 12 days

DAILY INFORMATION
  Today's Contributions: 5
  Daily Average: 3.2
  Daily Goal: 10
  Goal Progress: 50%

BADGE STATISTICS
  Total Badges Earned: 47
  Streak Badges: 8
  Milestone Badges: 12
  Special Badges: 27
```

### Example 5: Detailed Dashboard

```bash
contriflow dashboard --detailed
```

**Output:**
```
╔═══════════════════════════════════════════════════════════════════╗
║              DETAILED CONTRIFLOW DASHBOARD ANALYSIS               ║
╚═══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: PROFILE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  GitHub Username: octocat
  GitHub URL: https://github.com/octocat
  Display Name: The Octocat
  Account Created: 2011-01-26
  Account Age: 13 years

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: LEVEL & PROGRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Current Level: 25
  Total XP: 24,875
  Current Level XP: 875 / 1000
  XP Earned Today: 25
  XP Earned This Week: 187
  XP Earned This Month: 840
  
  Average XP/Day: 3.2
  Days to Next Level: ~8 days
  Projected Level Completion: 2024-01-25

  Level Progression:
  Level 24 ✓ (completed on 2023-12-18)
  Level 25 ► (87.5% complete)
  Level 26 ◯ (predicted: 2024-01-25)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: CONTRIBUTION BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Contributions: 2,847
  
  Commits:        2,518 (88.4%)
  Pull Requests:    156 (5.5%)
  Issues Created:    89 (3.1%)
  Code Reviews:     234 (8.2%)
  
  Breakdown by Type:
  ├─ Bug Fixes:       421 (14.8%)
  ├─ Features:        892 (31.4%)
  ├─ Documentation:   305 (10.7%)
  ├─ Tests:           234 (8.2%)
  ├─ Refactoring:     666 (23.4%)
  └─ Other:           329 (11.5%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: STREAK ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Current Streak: 18 days 🔥🔥🔥
  Longest Streak: 64 days ⭐
  Average Streak Length: 12 days
  
  Last 7 Days Activity:
    Day 1: ✓ (5 contributions)
    Day 2: ✓ (3 contributions)
    Day 3: ✓ (7 contributions)
    Day 4: ✓ (4 contributions)
    Day 5: ✓ (6 contributions)
    Day 6: ✓ (2 contributions)
    Day 7: ✓ (3 contributions)
  
  Weekly Average: 6.0 contributions/day

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: DAILY CONTRIBUTION HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Last 30 Days:
  
  Week 1: ████░░░░░░ (40 contributions)
  Week 2: ██████░░░░ (60 contributions)
  Week 3: █████████░ (90 contributions)
  Week 4: ████████░░ (80 contributions)
  
  Month Total: 270 contributions
  Month Average: 9.0 contributions/day
  Highest Day: 15 contributions (2024-01-10)
  Lowest Day: 1 contribution (2024-01-03)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: TODAY'S GOALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Daily Goal: 10 contributions
  Today's Contributions: 5
  Remaining: 5
  Progress: 50% ████████░░░░░░░░░░░░
  
  Time Remaining: ~4 hours
  Pace: On track (5 contributions average/day)
  Status: Keep going! 💪

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: ACHIEVEMENT TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Recent Badges (Last 10):
  
  1. 🔥 Streak Champion (18 days)    - 2024-01-17 (2 days ago)
  2. 🎯 Weekly Champion              - 2024-01-16 (3 days ago)
  3. 💎 Rare Contributor             - 2024-01-15 (4 days ago)
  4. ⭐ Rising Star                   - 2024-01-14 (5 days ago)
  5. 🌟 Dedicated Developer           - 2024-01-10 (9 days ago)
  6. 🚀 Launch Pad Contributor        - 2024-01-08 (11 days ago)
  7. 🎖️ 2000 Total Contributions      - 2024-01-05 (14 days ago)
  8. 💪 Consistency Matters           - 2024-01-02 (17 days ago)
  9. 🏆 Month Champion                - 2023-12-31 (18 days ago)
  10. 🌈 Color Champion               - 2023-12-28 (21 days ago)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Statistics:
  ├─ All-Time Average: 3.2 contributions/day
  ├─ This Year Average: 3.5 contributions/day
  ├─ This Month Average: 9.0 contributions/day
  ├─ This Week Average: 6.0 contributions/day
  ├─ Last 7 Days: High activity period
  └─ Trend: ↗ Increasing

  Consistency Score: 92/100 (Excellent)
  Activity Index: High
  Engagement Level: Very Active
```

### Example 6: With Custom Timeframe

```bash
contriflow dashboard --detailed --since "2024-01-01"
```

**Output:** Displays detailed dashboard filtered to show data from January 1st, 2024 onwards.

### Example 7: With JSON Output

```bash
contriflow dashboard --stats --json
```

**Output:**
```json
{
  "user": "octocat",
  "profile": "https://github.com/octocat",
  "level": 25,
  "xp": 875,
  "xpMax": 1000,
  "totalContributions": 2847,
  "pullRequests": 156,
  "issuesCreated": 89,
  "currentStreak": 18,
  "longestStreak": 64,
  "todayContributions": 5,
  "dailyGoal": 10,
  "badges": 47
}
```

### Example 8: Exported to File

```bash
contriflow dashboard --detailed > dashboard_report.txt
contriflow dashboard --ascii > dashboard_ascii.txt
```

Creates text files with dashboard output for sharing or archiving.

### Example 9: Real-time Update (Watch Mode)

```bash
contriflow dashboard --watch
```

Continuously updates the dashboard every 30 seconds, showing real-time contribution updates.

### Example 10: Comparison View

```bash
contriflow dashboard --compare "2024-01-17" "2024-01-01"
```

Shows side-by-side comparison of dashboard metrics between two dates.

### Example 11: Specific Repository Focus

```bash
contriflow dashboard --repo "owner/repo-name"
```

Displays dashboard metrics for a specific repository only.

### Example 12: Week-over-Week Comparison

```bash
contriflow dashboard --detailed --compare-weeks 2
```

Compares this week's activity with the previous week.

### Example 13: Goal Customization

```bash
contriflow dashboard --daily-goal 15
```

Displays dashboard with a custom daily contribution goal (default is 10).

### Example 14: Theme Selection

```bash
contriflow dashboard --ascii --theme dark
contriflow dashboard --ascii --theme light
```

Selects different ASCII art themes for different terminal backgrounds.

### Example 15: Achievement Filter

```bash
contriflow dashboard --badges --filter "streak"
contriflow dashboard --badges --filter "milestone"
```

Shows only badges from specific categories.

## Interpreting the Dashboard

### Understanding XP and Levels

**XP (Experience Points):**
- Earned through contributions: commits, pull requests, issues, and code reviews
- Each action type awards different amounts of XP
- Used to track progression and unlock achievements
- Accumulates across all repositories

**Levels:**
- Represent your overall contribution tier
- Range from Level 1 (beginner) to Level 100+ (expert)
- Each level requires progressively more XP
- Unlock special badges and recognition at certain levels

**XP Breakdown:**
- Commit: 1-5 XP (based on size)
- Pull Request: 10-50 XP (based on impact)
- Issue Created: 5-25 XP (based on complexity)
- Code Review: 3-15 XP (based on thoroughness)

### Understanding Streaks

**Current Streak:**
- Count of consecutive days with at least 1 contribution
- Resets if you miss a day with zero contributions
- Indicates consistency and engagement

**Longest Streak:**
- Your personal best consecutive contribution days
- Records your highest achievement
- Motivation for maintaining streaks

**Flame Emoji (🔥):**
- Each flame represents 10 days of active streak
- 🔥 = 10+ days, 🔥🔥 = 20+ days, 🔥🔥🔥 = 30+ days

### Understanding Contribution Types

**Pull Requests:**
- Code changes submitted for review
- Indicate collaborative development
- Weight: High impact on XP

**Issues Created:**
- Bug reports, feature requests, or documentation
- Demonstrate problem-solving and initiative
- Weight: Medium impact on XP

**Commits:**
- Direct code contributions
- Form the bulk of most users' contributions
- Weight: Low-medium impact on XP

**Code Reviews:**
- Comments and approvals on others' contributions
- Show community engagement
- Weight: Medium impact on XP

### Daily Goal Interpretation

**Goal Progress:**
- Shows percentage of daily target achieved
- Default goal: 10 contributions
- Customizable per user preference

**Status Indicators:**
- ✓ Goal Met: Exceeded or met the daily target
- ◐ In Progress: On track to meet goal
- ◯ Behind: Below expected pace
- ✗ Missed: Day ended without meeting goal

### Progress Bars

Progress bars show completion percentage with visual fill:
```
████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%
```
- Filled blocks (█) = progress
- Empty blocks (░) = remaining

## ASCII Art Visualization

### Level Box

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          ⭐ LEVEL 25 - Expert Developer ⭐  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Components:**
- Top border: Double lines (┏━┓)
- Middle: Level number and title
- Bottom border: Double lines (┗━┛)
- Star emojis for visual appeal
- Centered text

### Progress Bar Styles

**Horizontal Bar:**
```
XP: 875 / 1000  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 87.5%
```

**Vertical Bar (in ASCII dashboard):**
```
███
███
███
███
███
███
███
███
███
███
```

### Streak Visualization

**Current Streak Display:**
```
Current Streak: 18 days 🔥🔥🔥
```

**Daily Activity Calendar:**
```
Activity: ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✗ ◯ ◯ ◯
```
- ✓ = Day with contributions
- ✗ = Day without contributions (streak broken)
- ◯ = Future/not yet occurred

### Badge Grid

```
┌──────────────┬──────────────┬──────────────┐
│ 🏅 Streak    │ 🎯 Milestone │ 💎 Rare      │
│ Champion     │ 1000 Contribs│ Contributor  │
│              │              │              │
│ 30 days 🔥   │ 2024-01-10   │ 2024-01-05   │
└──────────────┴──────────────┴──────────────┘
```

**Components:**
- Column borders: ├, ┤, │
- Row separators: ─, ┼
- Badge icon in top-left of each cell
- Title below icon
- Date or description at bottom

## Badge Display and Interpretation

### Badge Categories

**Streak Badges:**
- Earned by maintaining consecutive contribution days
- Named: 7-Day Performer, 30-Day Master, etc.
- Visual: 🔥 flame emoji

**Milestone Badges:**
- Earned at contribution thresholds (100, 500, 1000, etc.)
- Named: Contributor, Expert, Legend, etc.
- Visual: 🎯 target emoji

**Special Badges:**
- Earned through unique achievements or events
- Can include seasonal or limited-time badges
- Visual: Various emojis (⭐, 💎, 🚀)

**Level Badges:**
- Unlocked at specific level thresholds
- Progress through 5-level increments
- Visual: ✨ sparkle emoji

### Reading Badge Information

Each badge displays:

```
Badge Name: Streak Champion
Category: Streak Achievement
Requirement: 30 consecutive days of contributions
Earned: 2024-01-15
Rarity: Common
```

### Badge Rarity Levels

- **Common** (⭐) - Easy to obtain, high percentage of users have it
- **Uncommon** (⭐⭐) - Moderate difficulty
- **Rare** (⭐⭐⭐) - Challenging to obtain
- **Epic** (⭐⭐⭐⭐) - Very difficult
- **Legendary** (⭐⭐⭐⭐⭐) - Extremely rare

## Integration with Other Commands

### Dashboard + Clone Command

```bash
# View dashboard, then clone a repo
contriflow dashboard
contriflow clone owner/repo
```

The dashboard helps identify top repositories to contribute to.

### Dashboard + Fork Command

```bash
# Check your stats before starting a fork
contriflow dashboard --stats
contriflow fork owner/repo
```

Monitor your progress before and after major contributions.

### Dashboard + Contribute Command

```bash
# Track your contribution goals while actively contributing
contriflow dashboard --detailed --watch &
contriflow contribute
```

Watch your stats update in real-time as you contribute.

### Dashboard + Search Command

```bash
# Find good issues to contribute to based on your level
contriflow dashboard --stats
contriflow search --difficulty beginner
```

Use your current level to find appropriately-scoped issues.

### Dashboard + PR Command

```bash
# Check if you can make a PR after viewing your contribution breakdown
contriflow dashboard --detailed
contriflow pr create
```

Understand your contribution patterns before creating PRs.

### Dashboard + Issues Command

```bash
# View your issue creation stats and create new ones
contriflow dashboard --stats
contriflow issues --list
```

Track your issue contributions.

### Dashboard + Guide Command

```bash
# Get dashboard context, then access contribution guides
contriflow dashboard --detailed
contriflow guide
```

Learn based on your current stats and goals.

## Quick Reference Guide

### Common Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `contriflow dashboard` | Full dashboard view | All stats, badges, streaks |
| `contriflow dashboard --ascii` | ASCII art dashboard | Enhanced visual display |
| `contriflow dashboard --stats` | Statistics only | Numbers without formatting |
| `contriflow dashboard --badges` | Badges only | All achievements |
| `contriflow dashboard --detailed` | Complete analysis | All info with breakdowns |
| `contriflow dashboard --watch` | Real-time updates | Live updating display |
| `contriflow dashboard --json` | Machine-readable | JSON format |

### Display Options

| Option | Effect | Use Case |
|--------|--------|----------|
| `--ascii` | Enhanced ASCII art | Terminal screenshots |
| `--badges` | Achievement focus | Portfolio view |
| `--stats` | Numbers only | Data extraction |
| `--detailed` | Maximum info | Deep analysis |
| `--watch` | Real-time update | Live monitoring |
| `--json` | JSON format | Integration/scripting |
| `--since DATE` | Filter by date | Historical comparison |
| `--repo REPO` | Single repository | Specific project |

### Keyboard Shortcuts (in Watch Mode)

| Key | Action |
|-----|--------|
| `r` | Refresh immediately |
| `q` | Quit watch mode |
| `u` | Update stats from GitHub |
| `?` | Show help |

### Status Indicators

| Symbol | Meaning |
|--------|---------|
| ✓ | Achieved/Complete |
| ✗ | Not achieved |
| ◯ | Pending/Future |
| ◐ | In progress |
| 🔥 | Streak active |
| ⭐ | Achievement unlocked |

## FAQ

### Q: How often does the dashboard update?

**A:** The dashboard displays current data from your local ContriFlow database. When you run any command that fetches from GitHub (like `contriflow sync`), the dashboard automatically reflects the latest information. In watch mode (`--watch`), the dashboard refreshes every 30 seconds.

### Q: Why is my XP not showing in the dashboard?

**A:** Ensure you've authenticated with GitHub using `contriflow login` and run `contriflow sync` to fetch your latest contribution data.

### Q: What's the difference between total contributions and commits?

**A:** Total Contributions includes all types of activity: commits, pull requests, issues, and code reviews. Commits are just direct code changes you've made.

### Q: How do I compare my dashboard to a previous date?

**A:** Use the `--since` flag:
```bash
contriflow dashboard --detailed --since "2024-01-01"
```

### Q: Can I export the dashboard to a file?

**A:** Yes, redirect output to a file:
```bash
contriflow dashboard --detailed > dashboard.txt
contriflow dashboard --ascii > dashboard.txt
```

### Q: Why is my streak showing as broken?

**A:** Streaks count consecutive calendar days with at least 1 contribution. If you didn't contribute on a particular day, the streak resets. Check your contribution history with:
```bash
contriflow dashboard --detailed
```

### Q: How are XP points calculated?

**A:** Different contribution types award different XP amounts:
- Small commit: 1-2 XP
- Medium commit: 3-4 XP
- Large commit: 5 XP
- Pull request: 10-50 XP
- Issue created: 5-25 XP
- Code review: 3-15 XP

### Q: What's the maximum level?

**A:** There's no hard cap, but levels get progressively harder to reach. Most users plateau around level 50-100 depending on contribution volume.

### Q: Can I customize the daily goal?

**A:** Yes, use the `--daily-goal` flag:
```bash
contriflow dashboard --daily-goal 15
```

### Q: How do badge categories work?

**A:** Badges are organized by type:
- **Streak Badges**: For consistent daily contributions
- **Milestone Badges**: For reaching contribution thresholds
- **Special Badges**: For unique achievements or events
- **Level Badges**: For reaching certain XP levels

### Q: Are there themed ASCII dashboards?

**A:** Yes, use the `--theme` flag:
```bash
contriflow dashboard --ascii --theme dark
contriflow dashboard --ascii --theme light
contriflow dashboard --ascii --theme minimal
```

### Q: Can I see dashboard history?

**A:** Use the `--since` and `--until` flags:
```bash
contriflow dashboard --detailed --since "2024-01-01" --until "2024-01-31"
```

### Q: How do I track progress toward a specific badge?

**A:** Use the detailed view to see your progress:
```bash
contriflow dashboard --detailed | grep -i "badge"
```

### Q: What does the consistency score mean?

**A:** The consistency score (0-100) measures how regularly you contribute. It's calculated based on:
- Streak length and frequency
- Daily contribution patterns
- Meeting daily goals
- Contribution regularity over time

### Q: Can I compare with other users?

**A:** The dashboard focuses on your personal metrics. Use GitHub directly to view other users' profiles. Future versions may include comparison features.

### Q: How long does it take to reach level 25?

**A:** Depends on contribution volume. At 3-4 contributions per day, it typically takes 2-3 months of consistent contribution.

### Q: What if my GitHub profile is private?

**A:** Ensure your GitHub API token has appropriate permissions. The dashboard will still show data ContriFlow has tracked, but may not fetch new data from GitHub.

### Q: Can I reset my dashboard data?

**A:** Yes, use:
```bash
contriflow reset-stats
```

This clears all tracking data. Use with caution.

### Q: Why do badges appear to be duplicated?

**A:** Some badges can be earned multiple times at different thresholds (e.g., Milestone badges at 100, 500, 1000 contributions). The dashboard shows each instance separately.

### Q: How do I share my dashboard with others?

**A:** Export as ASCII art and share:
```bash
contriflow dashboard --ascii > my_stats.txt
```

Or as JSON for integration:
```bash
contriflow dashboard --stats --json > stats.json
```

### Q: Is there a mobile-friendly dashboard view?

**A:** The JSON output (`--json`) can be used to build mobile apps. Currently, the dashboard is optimized for terminal viewing.

### Q: What's the best time to check my dashboard?

**A:** Daily after making contributions to see your progress. The dashboard is most useful for:
- End-of-day check-in to confirm your goal was met
- Weekly review to analyze patterns
- Monthly review to track progress toward badges
- Before contributing to set your daily goal


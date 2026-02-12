# Contriflow Contribute Guide

## Table of Contents
- [Overview](#overview)
- [Getting Started with Gamification](#getting-started-with-gamification)
- [Daily Challenge Workflow](#daily-challenge-workflow)
- [Streak System](#streak-system)
- [Level and XP System](#level-and-xp-system)
- [Badge System](#badge-system)
- [Dashboard Features](#dashboard-features)
- [Usage Examples](#usage-examples)
- [Integration with Other Commands](#integration-with-other-commands)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Overview

The `contriflow contribute` command transforms open-source contribution into an engaging, gamified experience. Instead of simply tracking contributions, contriflow uses modern game mechanics to motivate consistent participation and help you level up your development skills.

### Key Gamification Features

**Streaks**: Maintain daily contribution streaks to build momentum and unlock streak-based rewards.

**Levels and XP**: Earn experience points (XP) from every contribution and advance through levels that represent your growing expertise.

**Badges**: Achieve specific milestones to earn collectible badges that showcase your accomplishment.

**Daily Challenges**: Receive curated daily suggestions for beginner-friendly issues that match your interests and skill level.

**Dashboard**: View comprehensive statistics, progress bars, and achievements all in one place.

### Why Gamification Matters

Research shows that gamification significantly increases user engagement and persistence. For open-source contributors, it provides:
- **Motivation**: Regular feedback and visible progress
- **Goals**: Clear objectives to work toward each day
- **Community**: Comparison with other contributors
- **Fun**: Making contribution feel rewarding rather than obligatory

## Getting Started with Gamification

### Initial Setup

When you first run the contribute command, contriflow automatically initializes your contribution profile:

```bash
contriflow contribute --daily
```

This command:
1. Creates your personal contribution database
2. Sets your initial level to 1 with 0 XP
3. Initializes your streak counter to 0
4. Creates an empty badge collection
5. Connects to your GitHub profile

### Understanding Your Starting Point

```
Level: 1 (0/100 XP)
Current Streak: 0 days
Longest Streak: 0 days
Badges Earned: 0/28
```

From this starting point, every contribution moves you closer to:
- Level 2 (100 XP required)
- Your first streak (1 day)
- Your first badge

## Daily Challenge Workflow

The daily challenge system is designed to make finding meaningful contribution opportunities effortless.

### What is a Daily Challenge?

Each day, contriflow identifies three beginner-friendly issues across different repositories that match your interests and skill level. These challenges are:
- **Fresh**: Different issues appear each day
- **Beginner-Friendly**: Tagged with "good-first-issue" or "beginner" labels
- **Trending**: From repositories gaining attention in your tech stack
- **Diverse**: Spanning multiple languages and domains

### Daily Challenge Workflow Steps

#### Step 1: Receive Daily Suggestions

```bash
contriflow contribute --daily
```

Output:
```
📅 Daily Challenges - Wednesday, January 15, 2025

Challenge 1: Add Dark Mode Theme
├─ Repository: facebook/react
├─ Issue #45231
├─ Tags: feature, UI, beginner
├─ Stars: ⭐⭐⭐⭐⭐ (157K)
└─ Activity: High - 12 comments today

Challenge 2: Fix Typo in Documentation
├─ Repository: nodejs/node
├─ Issue #52104
├─ Tags: documentation, beginner
├─ Stars: ⭐⭐⭐⭐⭐ (105K)
└─ Activity: Medium - 3 comments today

Challenge 3: Add Unit Tests for Validation
├─ Repository: vuejs/vue
├─ Issue #13407
├─ Tags: testing, bug-fix, beginner
├─ Stars: ⭐⭐⭐⭐⭐ (200K)
└─ Activity: High - 8 comments today

🎯 Complete any challenge today to maintain your streak!
```

#### Step 2: Explore the Issue

Once you select a challenge, explore it using:

```bash
contriflow solve facebook/react#45231
```

This opens the issue details and guides you through the contribution process.

#### Step 3: Track Your Progress

As you work on the issue, track it with contriflow:

```bash
contriflow contribute --track 45231 --repo facebook/react
```

This records your active work and shows it in your dashboard.

#### Step 4: Complete and Submit

Once you submit a pull request:

```bash
contriflow pr --number 12345 --repo facebook/react
```

Your contribution is automatically recorded, your streak advances, and you earn XP.

### Daily Challenge Customization

You can customize which challenges appear to you:

```bash
# Only show JavaScript challenges
contriflow contribute --daily --language javascript

# Only show beginner-friendly issues
contriflow contribute --daily --level beginner

# Only show issues from high-trending repos
contriflow contribute --daily --min-stars 10000

# Combine filters
contriflow contribute --daily --language typescript --min-stars 5000
```

### What Counts as "Daily"?

A daily challenge is fresh for 24 hours in your local timezone. The day resets at midnight (00:00) in your configured timezone.

## Streak System

The streak system is the heart of gamified contribution. It transforms random contributions into a consistent, rewarding habit.

### How Streaks Work

A **streak** is a continuous count of days on which you made at least one contribution. Each day you contribute, your streak advances by 1. Missing a day resets your streak to 0.

```
Day 1: Contribute → Streak: 1
Day 2: Contribute → Streak: 2
Day 3: Contribute → Streak: 3
Day 4: No contribution → Streak: 0 (reset)
Day 5: Contribute → Streak: 1 (restart)
```

### Viewing Your Streak

```bash
contriflow contribute --streak
```

Output:
```
🔥 Streak Statistics
───────────────────────────────────────────
Current Streak:   8 days 🔥🔥🔥🔥🔥🔥🔥🔥
Longest Streak:   23 days (Previous record)
Days Until Danger: 1 day (Will reset tomorrow if no contribution)

💪 Top Contributors by Streak
  1. alice-dev          → 45 days 🏆
  2. code-wizard        → 38 days
  3. bug-hunter         → 32 days
  4. [You are here]     → 8 days
  5. dev-newbie         → 5 days
```

### Streak Milestones and Rewards

Different streak milestones unlock rewards:

| Streak | Reward | XP Bonus |
|--------|--------|----------|
| 3 days | 🥉 Bronze Streak Badge | +50 XP |
| 7 days | 🥈 Silver Streak Badge | +100 XP |
| 14 days | 🥇 Gold Streak Badge | +250 XP |
| 21 days | 💎 Diamond Streak Badge | +500 XP |
| 30 days | 👑 Champion Streak Badge | +1000 XP |
| 100 days | 🌟 Legendary Streak Badge | +5000 XP |

Each milestone is achieved only once per streak cycle. When your streak resets, you can work toward these rewards again.

### Maintaining Your Streak

To maintain your streak, you must make at least one contribution per day. A contribution is defined as:

✅ **Counts as Contribution:**
- Opening a new issue
- Submitting a pull request
- Pushing code to a tracked repository
- Publishing a documentation update
- Recording a tracked issue with `--track`

❌ **Does NOT Count:**
- Comments or reactions
- Reviewing pull requests (without committing)
- Creating forks or clones
- Reading documentation

### Grace Period

Contriflow offers a 1-hour grace period for contributions. If you contribute at 11:50 PM and your streak would reset at midnight, your streak remains active.

### Protecting Your Streak

You can enable streak protection to prevent accidental resets:

```bash
contriflow contribute --protect-streak
```

When enabled, contriflow warns you 24 hours before your streak will reset:

```
⚠️  Streak Danger Warning
────────────────────────────────────────────
Your current 8-day streak will reset tomorrow 
at midnight if you don't contribute!

💡 Tip: Work on one of today's challenges to maintain your streak.

View today's challenges:
  contriflow contribute --daily
```

### Understanding Your Streak History

```bash
contriflow contribute --streak --history
```

Output:
```
📊 Streak History
──────────────────────────────────────────
Streak 1: Jan 5 - Jan 12 (8 days) → Reset
Streak 2: Jan 13 - Jan 25 (13 days) → Reset
Streak 3: Jan 26 - Feb 14 (20 days) → Active ✨

Total Contributions: 47
Average Streak Length: 13.7 days
Best Streak: 23 days (Feb 1 - Feb 23, 2024)
Streaks Completed: 12
```

## Level and XP System

The level system represents your growth as a contributor and your mastery of open-source development.

### How XP and Levels Work

Each contribution earns you experience points (XP). Accumulate enough XP and you advance to the next level.

**XP Formula:**

```
Base XP per contribution: 10 XP
Streak Multiplier: +5% per day streak
Difficulty Multiplier: 1.0x (beginner) - 5.0x (expert)

Total XP = 10 × (1 + 0.05 × streak_days) × difficulty_multiplier
```

### XP Requirements by Level

| Level | XP Required | Cumulative | Rewards |
|-------|-------------|-----------|---------|
| 1 | 0 | 0 | — |
| 2 | 100 | 100 | 🎖 Level 2 Badge |
| 3 | 150 | 250 | +50 streak protection |
| 4 | 200 | 450 | Daily challenge priority |
| 5 | 250 | 700 | 🎖 Level 5 Badge |
| 6 | 300 | 1000 | +100 streak protection |
| 7 | 350 | 1350 | Advanced filters |
| 8 | 400 | 1750 | 🎖 Level 8 Badge |
| 9 | 450 | 2200 | Custom dashboard |
| 10 | 500 | 2700 | 👑 Level 10 Champion Badge |

### Example XP Calculation

Scenario: You have a 5-day streak and submit a pull request to fix a bug (difficulty: 2.0x)

```
Base XP: 10
Streak Multiplier: 1 + (0.05 × 5) = 1.25
Difficulty: 2.0

Total XP = 10 × 1.25 × 2.0 = 25 XP
```

Your profile updates:
```
Level 3 (150/200 XP) → Level 3 (175/200 XP)
```

### Viewing Your Level Progress

```bash
contriflow contribute --level
```

Output:
```
🎮 Level & XP Progress
────────────────────────────────────────────
Current Level: 5
XP Progress: 523 / 700 XP (74.7%)
   ████████████████░░░ 

Next Level:
  Level 6 (177 XP remaining)
  Rewards: +100 streak protection, custom avatar

Total XP Earned: 523
Avg. XP per day: 13.6 XP
Projected Level 10 in: ~156 days
```

### Level Benefits

As you advance through levels, you unlock increasingly useful features:

**Level 3+**: Streak protection extends from 1 to 2 days

**Level 5+**: Early access to trending issues (see challenges 24 hours ahead)

**Level 7+**: Advanced dashboard customization

**Level 10+**: VIP contributions (highlighted on leaderboard)

## Badge System

Badges are collectible achievements that showcase your accomplishment and commitment to open-source contribution.

### Available Badges (28 Total)

#### Contribution Milestones

| Badge | Requirement | XP Reward |
|-------|-------------|-----------|
| 🎯 First Step | Make your first contribution | 50 XP |
| ✈️ Rising Star | Make 5 contributions | 100 XP |
| 🚀 Rockstar | Make 10 contributions | 250 XP |
| 💎 Elite | Make 25 contributions | 500 XP |
| 👑 Legend | Make 50 contributions | 1000 XP |
| 🌟 Hall of Fame | Make 100 contributions | 2000 XP |

#### Streak Badges

| Badge | Requirement | XP Reward |
|-------|-------------|-----------|
| 🥉 Three Days Strong | Achieve 3-day streak | 50 XP |
| 🥈 Silver Week | Achieve 7-day streak | 150 XP |
| 🥇 Gold Month | Achieve 14-day streak | 300 XP |
| 💎 Diamond Dedication | Achieve 21-day streak | 500 XP |
| 👑 Unstoppable | Achieve 30-day streak | 1000 XP |
| 🌟 Eternal Flame | Achieve 100-day streak | 5000 XP |

#### Specialization Badges

| Badge | Requirement | XP Reward |
|-------|-------------|-----------|
| 🐍 Python Master | 10 Python contributions | 200 XP |
| ☕ Java Expert | 10 Java contributions | 200 XP |
| 🟡 JavaScript Ninja | 10 JavaScript contributions | 200 XP |
| 🦀 Rust Warrior | 10 Rust contributions | 200 XP |

#### Achievement Badges

| Badge | Requirement | XP Reward |
|-------|-------------|-----------|
| 🎨 Visual Artist | 5 UI/Design contributions | 150 XP |
| 📚 Documentation Master | 5 docs contributions | 150 XP |
| 🐛 Bug Hunter | 10 bug fix contributions | 200 XP |
| ✅ Test Champion | 5 testing contributions | 150 XP |
| 🌍 Global Contributor | Contribute to 5+ different repos | 250 XP |
| 🤝 Team Player | Collaborate on 5 PRs with reviews | 200 XP |

### Viewing Your Badges

```bash
contriflow contribute --badges
```

Output:
```
🏆 Badge Collection (12/28)
────────────────────────────────────────────

Earned Badges:
✅ 🎯 First Step (50 XP) - Jan 1, 2025
✅ 🥉 Three Days Strong (50 XP) - Jan 3, 2025
✅ ✈️ Rising Star (100 XP) - Jan 8, 2025
✅ 🟡 JavaScript Ninja (200 XP) - Jan 12, 2025
✅ 🥈 Silver Week (150 XP) - Jan 20, 2025
✅ 🎨 Visual Artist (150 XP) - Feb 1, 2025
✅ 🌍 Global Contributor (250 XP) - Feb 5, 2025
✅ 🚀 Rockstar (250 XP) - Feb 10, 2025
✅ 🥇 Gold Month (300 XP) - Feb 14, 2025
✅ 🐛 Bug Hunter (200 XP) - Feb 18, 2025
✅ 📚 Documentation Master (150 XP) - Feb 22, 2025
✅ ✅ Test Champion (150 XP) - Feb 28, 2025

Next Badges to Unlock:
📌 💎 Elite (25 contributions needed, you have 23)
📌 👑 Unstoppable (30-day streak needed, current: 8 days)
📌 🤝 Team Player (5 collaborative PRs needed, you have 1)
```

### Earning Badges Faster

**Pro Tips:**
1. Work toward specialization badges in your strongest languages
2. Combine streak maintenance with contribution volume
3. Diversify contributions to unlock global badges
4. Review others' PRs to work toward the Team Player badge

## Dashboard Features

The dashboard is your central hub for viewing progress and managing contributions.

### Accessing the Dashboard

```bash
contriflow contribute --dashboard
```

### Dashboard Layout

The complete dashboard displays:

```
╔════════════════════════════════════════════════════════════════════╗
║                    🎮 Contribution Dashboard                       ║
╚════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│ 📊 TODAY'S PROGRESS                                                 │
├─────────────────────────────────────────────────────────────────────┤
│ Contributions Today: 2                                              │
│ Daily Goal: 3                                                       │
│ Progress: ██████████░░░░░░░░░░ 67%                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 🎯 QUICK STATS                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Level: 5 (523/700 XP) ██████████████░░░░░░ 74.7%                   │
│ Streak: 8 days 🔥🔥🔥🔥🔥🔥🔥🔥                                        │
│ Best Streak: 23 days                                                │
│ Badges: 12/28                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 📈 THIS WEEK                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Mon: 3 contributions ███                                            │
│ Tue: 2 contributions ██                                             │
│ Wed: 1 contribution  █                                              │
│ Thu: 4 contributions ████                                           │
│ Fri: 2 contributions ██                                             │
│ Sat: 2 contributions ██                                             │
│ Sun: 0 contributions                                                │
│ Total: 14 contributions                                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 🏆 RECENT BADGES                                                    │
├─────────────────────────────────────────────────────────────────────┤
│ ✅ Test Champion (150 XP) - Feb 28, 2025                            │
│ ✅ Documentation Master (150 XP) - Feb 22, 2025                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 💡 DAILY CHALLENGES                                                 │
├─────────────────────────────────────────────────────────────────────┤
│ Challenge 1: Add Dark Mode Theme (facebook/react#45231)             │
│ Challenge 2: Fix Typo in Docs (nodejs/node#52104)                  │
│ Challenge 3: Add Unit Tests (vuejs/vue#13407)                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Dashboard Sections Explained

**TODAY'S PROGRESS**: Shows your contribution count for today against your daily goal. The progress bar gives immediate feedback on whether you're on track.

**QUICK STATS**: Your level and XP, current streak, personal best streak, and badge count.

**THIS WEEK**: A bar chart of contributions across the week. Helps identify patterns and motivation dips.

**RECENT BADGES**: Your three most recently earned badges.

**DAILY CHALLENGES**: Today's three suggested issues to work on.

### Customizing Your Dashboard

```bash
# Show extended stats (per-language breakdown)
contriflow contribute --dashboard --extended

# Focus on specific language
contriflow contribute --dashboard --language javascript

# Show lifetime stats instead of weekly
contriflow contribute --dashboard --period lifetime

# Export dashboard to JSON
contriflow contribute --dashboard --export json > dashboard.json
```

### Reading Dashboard Stats

**Level**: Your overall progression tier. Each level unlocks new features and represents mastery.

**XP**: Experience points accumulate toward the next level. The percentage shows progress.

**Streak**: Current consecutive days of contributions. The fire emojis provide visual feedback.

**Badges**: Fraction of available badges earned. More badges mean more varied contributions.

## Usage Examples

### Example 1: Starting Your First Day

```bash
# Check what's available today
$ contriflow contribute --daily
# You see three challenges for JavaScript

# Check one out
$ contriflow solve facebook/react#45231
# You explore the issue and start working

# Track your work
$ contriflow contribute --track 45231 --repo facebook/react

# After 30 minutes, you submit a PR
$ contriflow pr --number 12345 --repo facebook/react
# ✅ Contribution recorded! Streak: 1 day, XP: +25
```

### Example 2: Building a 7-Day Streak

```bash
# Day 1-3: Make contributions daily
# Day 2 after contribution:
$ contriflow contribute --streak
# Current Streak: 2 days

# Day 3 after contribution:
$ contriflow contribute --streak
# Current Streak: 3 days
# 🎉 Badge unlocked: 🥉 Three Days Strong (+50 XP)

# Day 4: You're busy but want to maintain streak
$ contriflow contribute --daily
# Work on a quick documentation fix

# Day 5-7: Continue daily contributions
# Day 7 after contribution:
$ contriflow contribute --streak
# Current Streak: 7 days
# 🎉 Badge unlocked: 🥈 Silver Week (+150 XP)
```

### Example 3: Leveling Up

```bash
# Current status
$ contriflow contribute --level
# Level 2 (87/100 XP)

# Make 5 contributions (20 XP each, some with streak bonus)
$ contriflow contribute --track 123 --repo owner/repo1
# +25 XP (5-day streak bonus)
$ contriflow contribute --track 124 --repo owner/repo2
# +25 XP
$ contriflow contribute --track 125 --repo owner/repo3
# +25 XP
$ contriflow contribute --track 126 --repo owner/repo4
# +25 XP
$ contriflow contribute --track 127 --repo owner/repo5
# +25 XP

# Check progress
$ contriflow contribute --level
# Level 3 (12/150 XP)
# 🎉 Level up! You unlocked: +50 streak protection
```

### Example 4: Tracking an Issue You're Solving

```bash
# Start tracking an issue you're working on
$ contriflow contribute --track 45231 --repo facebook/react
# ✅ Now tracking issue #45231 in facebook/react

# Check your active tracking
$ contriflow contribute --tracking
# Active Issues:
# - facebook/react#45231 (started 2 hours ago)
# - nodejs/node#52104 (started 1 day ago)

# Once you submit PR
$ contriflow pr --number 12345 --repo facebook/react
# The tracking automatically closes and records the contribution
```

### Example 5: Completing Multiple Daily Challenges

```bash
# Morning: Get today's challenges
$ contriflow contribute --daily
# Three challenges appear

# Mid-morning: Complete Challenge 1
$ contriflow solve facebook/react#45231
$ contriflow pr --number 12345 --repo facebook/react
# +25 XP, streak extended

# Afternoon: Complete Challenge 2
$ contriflow solve nodejs/node#52104
$ contriflow pr --number 52105 --repo nodejs/node
# +25 XP, streak extended

# Evening: Complete Challenge 3
$ contriflow solve vuejs/vue#13407
$ contriflow pr --number 13408 --repo vuejs/vue
# +25 XP, streak extended

# Total today: +75 XP, 3 contributions
$ contriflow contribute --dashboard
# Shows all three contributions and boost
```

### Example 6: Earning Language-Specific Badge

```bash
# You've been contributing to Python projects
$ contriflow contribute --badges
# Progress: Python Master (7/10 contributions)

# Make 3 more Python contributions
$ contriflow contribute --track 999 --repo owner/python-repo1
$ contriflow contribute --track 1000 --repo owner/python-repo2
$ contriflow contribute --track 1001 --repo owner/python-repo3

$ contriflow contribute --badges
# 🎉 Badge unlocked: 🐍 Python Master (+200 XP)
```

### Example 7: Viewing Detailed Streak History

```bash
$ contriflow contribute --streak --history

# Output shows all streaks:
# Streak 1: Jan 5-12 (8 days) ✓
# Streak 2: Jan 13-25 (13 days) ✓
# Streak 3: Jan 26-present (8 days - active)
```

### Example 8: Setting a Daily Goal

```bash
# Set your daily contribution goal
$ contriflow contribute --daily-goal 3
# ✅ Daily goal set to 3 contributions

# Now dashboard shows progress against goal
$ contriflow contribute --dashboard
# Daily Goal: 3
# Current: 2
# Progress: ██████████░░░░░░░░░░ 67%
```

### Example 9: Protecting Your Streak

```bash
# Enable streak protection
$ contriflow contribute --protect-streak

# When you have a 5+ day streak and miss a day
$ contriflow contribute --dashboard
# ⚠️ Your 8-day streak is safe (protected)
# Tomorrow at 5 PM your protection expires
# Contribute today to maintain your streak
```

### Example 10: Filtering Challenges by Difficulty

```bash
# Only show beginner-friendly challenges
$ contriflow contribute --daily --level beginner

# Show intermediate challenges
$ contriflow contribute --daily --level intermediate

# Show expert challenges
$ contriflow contribute --daily --level expert

# Mix difficulty levels
$ contriflow contribute --daily --level beginner,intermediate
```

### Example 11: Tracking Multiple Repos

```bash
# Working on multiple projects across repos
$ contriflow contribute --track 100 --repo facebook/react
$ contriflow contribute --track 200 --repo microsoft/TypeScript
$ contriflow contribute --track 300 --repo rust-lang/rust

# View all active tracking
$ contriflow contribute --tracking
# Active Issues:
# 1. facebook/react#100 (2 hours)
# 2. microsoft/TypeScript#200 (4 hours)
# 3. rust-lang/rust#300 (1 hour)
```

### Example 12: Viewing Statistics by Language

```bash
# Get contribution stats broken down by language
$ contriflow contribute --stats --by-language

# Output:
# JavaScript: 23 contributions (38%)
# Python: 15 contributions (25%)
# TypeScript: 12 contributions (20%)
# Rust: 10 contributions (17%)
```

### Example 13: Exporting Dashboard Data

```bash
# Export your contribution data
$ contriflow contribute --dashboard --export json > my-stats.json

# Export as CSV for analysis
$ contriflow contribute --dashboard --export csv > my-stats.csv

# View the CSV in Excel or process with scripts
```

### Example 14: Checking Level Unlocks

```bash
# See what features/rewards await at next level
$ contriflow contribute --level --unlocks

# Output:
# Current Level: 5
# Next Level: 6
# Required XP: 177 more
# Unlocks:
#   - +100 streak protection
#   - Custom avatar
#   - Priority challenges
```

### Example 15: Integration Example: Full Daily Workflow

```bash
# Morning routine
$ contriflow contribute --daily
# See three challenges

# Work on challenge 1 for 30 minutes
$ contriflow solve facebook/react#45231
# Explore issue details, fork, clone, make changes
$ contriflow fork facebook/react
$ contriflow clone facebook/react-clone
# ... make changes, commit ...
$ contriflow pr --number 12345 --repo facebook/react

# Automatic update triggers
# Your dashboard now shows:
# - +25 XP toward next level
# - Streak maintained at 8 days
# - Contribution recorded
# - Progress toward next badge

$ contriflow contribute --dashboard
# Shows updated stats
```

## Integration with Other Commands

The contribute command works seamlessly with all other contriflow commands.

### Integration with `solve`

The solve command finds and helps you understand an issue. After solving it, contribute tracks the completion:

```bash
$ contriflow solve facebook/react#45231
# Opens issue details, shows related discussions
# You make and test changes

$ contriflow pr --number 12345 --repo facebook/react
# Automatically recorded as contribution
# XP awarded, streak extended
```

### Integration with `fork`

When you fork a repository and contribute to it, contributions are tracked:

```bash
$ contriflow fork facebook/react
# Creates your personal fork

$ contriflow contribute --track 45231 --repo your-username/react
# Tracks work on your fork
# When PR is merged, contribution is fully recorded
```

### Integration with `clone`

After cloning a repository, track your contributions to it:

```bash
$ contriflow clone facebook/react
# Clones the repository locally

# After making changes and submitting PR
$ contriflow pr --number 12345 --repo facebook/react
# Contribution is automatically recorded
```

### Integration with `pr`

Each time you submit or merge a pull request, it's automatically recorded:

```bash
$ contriflow pr --number 12345 --repo facebook/react
# Pull request is recorded as contribution
# +25 XP awarded
# Streak extended if it's your first contribution today
```

### Integration with `search`

Use search to find issues, then track them:

```bash
$ contriflow search "good-first-issue" --language javascript
# Find JavaScript issues

# Use the issue you want to work on
$ contriflow contribute --track 45231 --repo facebook/react
# Track your work on the found issue
```

## Best Practices

### Maintaining Consistency

**Contribute a little every day rather than a lot once a week.**

Streaks are built on consistency. One contribution per day is better than seven on Sunday.

```
❌ Bad Pattern:
Mon: 0  Tue: 0  Wed: 0  Thu: 0  Fri: 0  Sat: 0  Sun: 7
Streak resets each week

✅ Good Pattern:
Mon: 1  Tue: 1  Wed: 1  Thu: 1  Fri: 1  Sat: 1  Sun: 1
7-day streak achieved
```

### Choosing the Right Challenges

Don't always pick the easiest challenge. Balance beginner issues with slightly harder ones to build skills.

```
Week 1-2: Focus on "beginner" level challenges to build momentum
Week 3+: Mix in "intermediate" challenges to develop skills
Month 2+: Include "expert" challenges occasionally
```

### Diversifying Contributions

Work on issues across different repositories, languages, and types to unlock more badges and stay engaged.

```
✅ Diversified:
- JavaScript bug fix in facebook/react
- Python documentation in scikit-learn
- Rust feature in rust-lang/rust
- TypeScript testing in Microsoft/TypeScript

❌ Narrow Focus:
- JavaScript bug fix
- JavaScript feature
- JavaScript docs
- JavaScript test
```

### Protecting Your Streaks

When you reach a significant streak (7+ days), enable streak protection to avoid accidental resets.

```bash
$ contriflow contribute --protect-streak
# Now you have a 1-day grace period when streak would reset
```

### Balancing Speed and Quality

Don't compromise on code quality to maintain streaks. Quality contributions are worth more XP and unlock better badges.

```
Small quality fix: +25 XP (basic badge progress)
Large quality fix: +100 XP (faster badge progress)
```

## FAQ

### How do streaks work exactly?

A streak increments by 1 for each day you make at least one contribution. A contribution must be:
- A tracked issue (using `--track`)
- A submitted pull request (using `pr`)
- A recorded activity in a tracked repository

Missing a day resets your streak to 0, but your longest streak is preserved for your historical record.

### Can I reset my streak manually?

Yes, if needed:

```bash
$ contriflow contribute --reset-streak
# ⚠️ This will reset your current streak to 0
# Your longest streak record will be preserved
# Are you sure? (y/n)
```

### How do I set daily goals?

```bash
# Set goal to 3 contributions per day
$ contriflow contribute --daily-goal 3

# View your goal and progress
$ contriflow contribute --dashboard
```

### How are timezones handled?

Contriflow uses your system's timezone. The day resets at midnight (00:00) in your local timezone.

To change timezone:

```bash
$ contriflow contribute --timezone "America/New_York"
$ contriflow contribute --timezone "Europe/London"
$ contriflow contribute --timezone "Asia/Tokyo"
```

### Can I use contriflow offline?

Partially. You can:
- View your dashboard and stats (offline)
- Track issues locally (offline)

You cannot:
- Fetch daily challenges (requires GitHub API)
- View trending repositories (requires GitHub API)
- Submit pull requests (requires GitHub)

Once online, all offline activities are synced.

### How is XP calculated?

```
Base XP: 10 per contribution
Streak Multiplier: +5% per consecutive day (max 2.0x at 20+ days)
Difficulty Multiplier: 1.0x (beginner) to 5.0x (expert)

Example:
- Base: 10
- 5-day streak: ×1.25
- Hard issue: ×2.0
- Total: 10 × 1.25 × 2.0 = 25 XP
```

### What happens if I miss a day?

Your current streak resets to 0. However:
- Your longest streak record is preserved
- Your total XP is not affected
- You can restart your streak the next day
- No penalties are applied

### Can multiple people share the same machine?

Yes. Each GitHub user has their own separate contribution profile and statistics. Profiles are identified by GitHub username.

```bash
# User A logs in
$ contriflow login --github-user alice

# User B logs in
$ contriflow login --github-user bob

# Each has separate stats, streaks, and badges
```

### How do I see what badges I'm closest to earning?

```bash
$ contriflow contribute --badges
# Shows progress toward next badges
# "Next Badges to Unlock" section lists requirements
```

### Can I earn the same badge twice?

Most badges are one-time achievements. However:
- Streak badges reset with each new streak
- Language-specific badges count all contributions
- You can earn "new streak" badges in each streak cycle

### What's the maximum level?

Currently, the maximum level is 100, representing mastery across all contribution types. Only a few users have reached this milestone.

### Can I export my contribution data?

Yes:

```bash
$ contriflow contribute --export json > stats.json
$ contriflow contribute --export csv > stats.csv
```

### How often are daily challenges refreshed?

Daily challenges refresh at midnight in your local timezone. Three new beginner-friendly issues are suggested each day based on trending repositories.

### What counts as a "beginner-friendly" issue?

Issues tagged with any of:
- `good-first-issue`
- `beginner`
- `starter`
- `first-time-contributor`
- `help-wanted`
- `low-hanging-fruit`

### Can I retry failed contributions?

If you track an issue but don't submit a PR:

```bash
$ contriflow contribute --track 45231 --repo facebook/react
# Later, you give up on this issue

$ contriflow contribute --untrack 45231
# Removes the tracking, XP not awarded
```

### How do I know if I'm on the leaderboard?

```bash
$ contriflow contribute --leaderboard
# Shows top 100 contributors by:
# - Current streak
# - Level
# - Total XP
# - Badges earned

# Shows your rank in each category
```

### Is there a competitive mode?

Contriflow focuses on personal progression rather than competition. However, you can optionally:

```bash
$ contriflow contribute --leaderboard
# View global rankings
# See how you compare to other contributors
```

### What if my GitHub API quota is exceeded?

Daily challenges require GitHub API calls. If quota is exceeded:

```bash
$ contriflow contribute --daily
# ⚠️ GitHub API quota exceeded
# Please try again after 1 hour
# You can still track issues manually
```

To avoid quota issues:
- Use `--daily` once per day (not repeatedly)
- Batch your searches
- Check your quota: `contriflow status --api-quota`

### Can I contribute to issues from my own repositories?

Yes! Contributions to your own repositories count toward:
- Streaks
- XP
- Badges
- Daily progress

This encourages you to maintain your own projects.

### How do deleted issues affect streaks?

If an issue you tracked is deleted:
- Your contribution is still recorded
- Your streak is not affected
- Your XP is retained
- Badge progress is maintained

The contribution is permanent in your history.

---

**Last Updated**: February 2025
**Version**: 1.0
**Questions?** See `contriflow help contribute` or visit the GitHub repository.

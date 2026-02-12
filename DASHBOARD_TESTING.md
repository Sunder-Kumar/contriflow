# ContriFlow Dashboard - Testing Guide

## Table of Contents
1. [Display Modes Testing](#display-modes-testing)
2. [Statistics Display Testing](#statistics-display-testing)
3. [Progress Tracking Testing](#progress-tracking-testing)
4. [Badge Display Testing](#badge-display-testing)
5. [ASCII Art Testing](#ascii-art-testing)
6. [GitHub Integration Testing](#github-integration-testing)
7. [Data Integration Testing](#data-integration-testing)
8. [Error Handling Testing](#error-handling-testing)
9. [Edge Cases Testing](#edge-cases-testing)
10. [Integration Tests](#integration-tests)
11. [Performance Testing](#performance-testing)

## Display Modes Testing

### Test 1.1: Full Dashboard Display

**Test Case ID:** DISPLAY_001  
**Objective:** Verify full dashboard displays all sections correctly  
**Prerequisites:** User authenticated, data available

**Steps:**
1. Execute: `contriflow dashboard`
2. Verify output contains:
   - GitHub username and profile link
   - Level and XP progress bar
   - Contribution statistics (commits, PRs, issues)
   - Current and longest streak
   - Today's goal progress
   - Recent badges (5-10 displayed)
3. Verify formatting is aligned and readable
4. Verify all numbers are accurate

**Expected Output:**
```
├─ GitHub username displayed
├─ Level: X displayed with progress bar
├─ Total Contributions: X displayed
├─ Current Streak: X days
├─ Longest Streak: X days
├─ Today's Contributions: X
├─ Daily Goal: X/10
└─ Recent badges listed
```

**Pass Criteria:**
- ✅ All sections present and readable
- ✅ Numbers match database values
- ✅ Formatting is consistent
- ✅ No truncation or overflow

---

### Test 1.2: ASCII Dashboard Display

**Test Case ID:** DISPLAY_002  
**Objective:** Verify ASCII art dashboard renders correctly  
**Prerequisites:** User authenticated, data available

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Verify decorative elements:
   - Top border: `╔═══╗` format
   - Section separators: clear visual breaks
   - Progress bars rendered with fill characters
   - Badge grid properly aligned
3. Verify emoji display works correctly
4. Verify layout adapts to terminal width

**Expected Output:**
```
╔══════════════════════════════════════════════╗
║     🚀 CONTRIFLOW DASHBOARD 🚀              ║
╚══════════════════════════════════════════════╝

┌──────────────────────────────────────────────┐
│ LEVEL INFORMATION                            │
├──────────────────────────────────────────────┤
│ Level: 25                                    │
│ XP: 875/1000 ████████████████░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────┘
```

**Pass Criteria:**
- ✅ All borders render correctly
- ✅ Sections visually separated
- ✅ Content properly centered
- ✅ No character encoding issues

---

### Test 1.3: Badges-Only Display

**Test Case ID:** DISPLAY_003  
**Objective:** Verify badges-only mode shows achievement focus  
**Prerequisites:** User has earned at least 5 badges

**Steps:**
1. Execute: `contriflow dashboard --badges`
2. Verify:
   - Only badges displayed, no stats
   - Badges organized by category
   - Category headers present (Streak, Milestone, Special)
   - Each badge shows: name, icon, date earned
   - Total badge count displayed
3. Verify sorting (newest first)

**Expected Output:**
```
ACHIEVEMENTS & BADGES

Total Badges Earned: 47

STREAK BADGES (8):
├─ 🔥 7-Day Performer - 2024-01-10
├─ 🔥 30-Day Master - 2024-01-15
└─ ...

MILESTONE BADGES (12):
├─ 🎯 Contributor (100) - 2023-06-20
└─ ...

SPECIAL BADGES (27):
└─ ...
```

**Pass Criteria:**
- ✅ Only badges shown
- ✅ Proper categorization
- ✅ All badge info complete
- ✅ Correct total count

---

### Test 1.4: Stats-Only Display

**Test Case ID:** DISPLAY_004  
**Objective:** Verify stats-only mode displays numbers without formatting  
**Prerequisites:** User authenticated

**Steps:**
1. Execute: `contriflow dashboard --stats`
2. Verify output format:
   - No ASCII art
   - No progress bars
   - Plain text key-value pairs
   - Numbers clearly visible
3. Verify all statistics included:
   - Level and XP
   - Contribution counts
   - Streak data
   - Daily info
4. Verify JSON output option: `contriflow dashboard --stats --json`

**Expected Output:**
```
LEVEL: 25
XP: 875 / 1000
TOTAL CONTRIBUTIONS: 2847
PULL REQUESTS: 156
ISSUES CREATED: 89
CURRENT STREAK: 18
LONGEST STREAK: 64
TODAY: 5
DAILY GOAL: 10
```

**Pass Criteria:**
- ✅ No unnecessary formatting
- ✅ All numbers accurate
- ✅ JSON valid when requested
- ✅ Easy to parse/extract

---

### Test 1.5: Detailed Dashboard Display

**Test Case ID:** DISPLAY_005  
**Objective:** Verify detailed mode shows comprehensive analysis  
**Prerequisites:** 30+ days of contribution history available

**Steps:**
1. Execute: `contriflow dashboard --detailed`
2. Verify all sections present:
   - Profile information
   - Level progression with milestones
   - Contribution breakdown by type
   - Streak analysis
   - Daily history (last 30 days)
   - Goal information and projections
   - Achievement timeline
   - Performance metrics
3. Verify calculations:
   - Average calculations correct
   - Projections based on trend
   - Percentage breakdowns accurate
4. Verify formatting clear for analysis

**Expected Output Sections:**
```
PROFILE INFORMATION
├─ Username
├─ URL
└─ Account age

LEVEL & PROGRESSION
├─ Current level
├─ XP progress
├─ Days to next level
└─ Completion projection

CONTRIBUTION BREAKDOWN
├─ By type percentages
└─ Top contribution categories

STREAK ANALYSIS
├─ Current/longest
├─ Last 7 days activity
└─ Weekly average

DAILY HISTORY
├─ 30-day visualization
├─ Week breakdown
└─ Statistics

GOAL TRACKING
├─ Daily goal
├─ Today's progress
├─ Pace analysis
└─ Recommendation

ACHIEVEMENT TIMELINE
└─ Recent 10 badges

PERFORMANCE METRICS
├─ Trends
├─ Consistency score
└─ Activity analysis
```

**Pass Criteria:**
- ✅ All sections present
- ✅ All calculations verified
- ✅ Readable format maintained
- ✅ Projections are logical

---

## Statistics Display Testing

### Test 2.1: Level Display Accuracy

**Test Case ID:** STATS_001  
**Objective:** Verify level calculation and display is accurate  
**Prerequisites:** Known XP values in database

**Test Data:**
- User with 24,875 total XP
- Level boundaries: Level 24 at 24,000 XP, Level 25 at 25,000 XP

**Steps:**
1. Execute: `contriflow dashboard`
2. Query database for user XP
3. Verify displayed level = database level
4. Verify XP progression bar shows correct percentage
5. Test boundary conditions:
   - Just before level up (999/1000 XP)
   - Just after level up (1/1000 XP on new level)

**Verification:**
```javascript
assert.equal(displayedLevel, 25);
assert.equal(displayedXpCurrent, 875);
assert.equal(displayedXpMax, 1000);
assert.approximately(displayedPercentage, 87.5, 0.1);
```

**Pass Criteria:**
- ✅ Level matches database
- ✅ XP values accurate
- ✅ Percentage calculated correctly
- ✅ Boundary cases handled

---

### Test 2.2: XP Bar Calculation

**Test Case ID:** STATS_002  
**Objective:** Verify progress bar visual accuracy  
**Prerequisites:** Different XP scenarios

**Test Scenarios:**
1. 0 XP (0%)
2. 250 XP (25%)
3. 500 XP (50%)
4. 750 XP (75%)
5. 1000 XP (100%)

**Steps:**
For each scenario:
1. Set user XP to test value
2. Display dashboard
3. Count filled vs empty bar characters
4. Calculate actual percentage
5. Verify matches displayed percentage

**Verification:**
```javascript
const filledChars = (displayedBar.match(/█/g) || []).length;
const emptyChars = (displayedBar.match(/░/g) || []).length;
const totalChars = filledChars + emptyChars;
const actualPercentage = (filledChars / totalChars) * 100;
assert.approximately(actualPercentage, expectedPercentage, 2);
```

**Pass Criteria:**
- ✅ All scenarios display correct fills
- ✅ Percentage label accurate
- ✅ Visual representation matches number

---

### Test 2.3: Streak Visualization

**Test Case ID:** STATS_003  
**Objective:** Verify streak display and emoji count  
**Prerequisites:** Different streak values

**Test Scenarios:**
1. 5 days: No flame emojis
2. 10 days: 1 flame emoji
3. 25 days: 2 flame emojis
4. 40 days: 4 flame emojis
5. 100+ days: 5 flame emojis (capped)

**Steps:**
1. Set user streak to test value
2. Display dashboard
3. Count flame emojis (🔥)
4. Verify count matches expected

**Verification:**
```javascript
const streakText = '18 days 🔥🔥🔥';
const flameCount = (streakText.match(/🔥/g) || []).length;
assert.equal(flameCount, 2); // 18 days = 1 flame per 10 days
```

**Pass Criteria:**
- ✅ Correct flame count
- ✅ Flame intensity matches streak
- ✅ Text display clear

---

### Test 2.4: Total Contribution Count

**Test Case ID:** STATS_004  
**Objective:** Verify contribution count accuracy and formatting  
**Prerequisites:** Multiple contribution types recorded

**Test Data:**
- Commits: 2,518
- PRs: 156
- Issues: 89
- Code Reviews: 234
- Total: 2,847

**Steps:**
1. Verify database totals
2. Display dashboard
3. Check each contribution type displayed
4. Verify percentages calculated correctly:
   - PRs: 156/2847 = 5.5%
   - Issues: 89/2847 = 3.1%
   - Code Reviews: 234/2847 = 8.2%
   - Commits: 2368/2847 = 83.2%
5. Verify sum equals total

**Verification:**
```javascript
assert.equal(displayedTotal, 2847);
assert.equal(displayedPRs, 156);
assert.equal(displayedIssues, 89);
assert.approximately(prPercentage, 5.5, 0.1);
```

**Pass Criteria:**
- ✅ All counts accurate
- ✅ Percentages correct
- ✅ Sum verification passes
- ✅ No rounding errors

---

### Test 2.5: PR Count Display

**Test Case ID:** STATS_005  
**Objective:** Verify pull request count and percentage display  
**Prerequisites:** PR data in database

**Steps:**
1. Query database for total PRs and total contributions
2. Display dashboard
3. Verify PR count displayed
4. Verify percentage calculation
5. Test with various values:
   - Few PRs (5/100)
   - Many PRs (250/1000)
   - No PRs (0/500)

**Verification:**
```javascript
assert.equal(displayedPRCount, databasePRCount);
assert.approximately(displayedPercentage, 
  (databasePRCount / totalContributions) * 100, 0.5);
```

**Pass Criteria:**
- ✅ Count matches database
- ✅ Percentage accurate
- ✅ Edge cases handled

---

### Test 2.6: Issue Count Display

**Test Case ID:** STATS_006  
**Objective:** Verify issue count and percentage display  
**Prerequisites:** Issue data in database

**Steps:**
1. Query database for total issues and total contributions
2. Display dashboard
3. Verify issue count displayed
4. Verify percentage calculation
5. Test edge cases:
   - Many issues (200/1000)
   - Few issues (5/1000)
   - No issues (0/500)

**Verification:**
```javascript
assert.equal(displayedIssueCount, databaseIssueCount);
assert.approximately(displayedPercentage,
  (databaseIssueCount / totalContributions) * 100, 0.5);
```

**Pass Criteria:**
- ✅ Count matches database
- ✅ Percentage accurate
- ✅ Zero values handled

---

## Progress Tracking Testing

### Test 3.1: Today's Progress Bar

**Test Case ID:** PROGRESS_001  
**Objective:** Verify today's contribution progress display  
**Prerequisites:** Real-time contribution data

**Steps:**
1. Record today's contribution count: e.g., 5
2. Set daily goal: 10
3. Display dashboard
4. Verify progress bar shows 50%
5. Verify text shows "5 / 10"
6. Test throughout the day:
   - Morning: 1/10
   - Afternoon: 5/10
   - Evening: 10/10
   - Late night: 12/10 (exceeded)

**Verification:**
```javascript
const progress = 5 / 10; // 50%
const filledChars = calculateFilledChars(progress, 20);
assert.equal(filledChars, 10); // Half filled
```

**Pass Criteria:**
- ✅ Current count accurate
- ✅ Bar shows correct percentage
- ✅ Goal clearly visible
- ✅ Updates reflect real-time data

---

### Test 3.2: Goal Tracking

**Test Case ID:** PROGRESS_002  
**Objective:** Verify daily goal system  
**Prerequisites:** Daily goal configured

**Steps:**
1. Set daily goal to custom value (e.g., 15)
2. Test with contributions: 0, 5, 10, 15, 20
3. For each value:
   - Display dashboard
   - Verify displayed goal matches setting
   - Verify remaining contributions calculated: goal - current
   - Verify status indicator (met/in-progress/behind)

**Status Logic:**
- Met: current >= goal → "✓ GOAL MET"
- On Track: current > goal * 0.75 → "◐ ON TRACK"
- In Progress: current > goal * 0.5 → "◐ IN PROGRESS"
- Behind: current <= goal * 0.5 → "◯ BEHIND"

**Verification:**
```javascript
const remaining = goal - current;
assert.equal(displayedRemaining, remaining);
assert.equal(displayedStatus, expectedStatus);
```

**Pass Criteria:**
- ✅ Goal value respected
- ✅ Remaining calculated correctly
- ✅ Status indicator accurate
- ✅ Custom goals work

---

### Test 3.3: Progress Calculation

**Test Case ID:** PROGRESS_003  
**Objective:** Verify mathematical accuracy of progress  
**Prerequisites:** Multiple contribution records

**Test Scenarios:**
1. Linear progress: 1, 2, 3, 4, 5 (daily)
2. Irregular: 5, 2, 8, 1, 10 (daily)
3. Zero progress: 0, 0, 0, 0, 0 (daily)
4. Exceeding goal: 15, 12, 20, 18 (goal = 10)

**Steps:**
For each scenario:
1. Insert contribution records
2. Calculate expected totals and percentages
3. Display dashboard with --detailed
4. Verify all calculations match
5. Check daily breakdown table

**Verification:**
```javascript
const dailyTotal = contributionsByDay.reduce((a, b) => a + b, 0);
assert.equal(displayedTotal, dailyTotal);
const avgDaily = dailyTotal / days;
assert.approximately(displayedAverage, avgDaily, 0.1);
```

**Pass Criteria:**
- ✅ All calculations verified
- ✅ Totals accurate
- ✅ Averages correct
- ✅ Edge values handled

---

### Test 3.4: Goal Met Indicator

**Test Case ID:** PROGRESS_004  
**Objective:** Verify goal achievement indicators  
**Prerequisites:** Daily goal system

**Steps:**
1. Test when goal NOT met (4/10):
   - Verify indicator shows incomplete status
   - Verify "✗" or "◯" symbol
   - Progress bar < 100%

2. Test when goal IS met (10/10):
   - Verify indicator shows "✓ MET"
   - Verify celebration message if applicable
   - Progress bar at 100%

3. Test when goal EXCEEDED (15/10):
   - Verify indicator shows success
   - Verify bar shows 100% (capped)
   - Verify "Great job!" message

**Verification:**
```javascript
if (current >= goal) {
  assert.include(dashboardOutput, '✓');
  assert.include(dashboardOutput, 'MET');
} else {
  assert.include(dashboardOutput, '◯');
}
```

**Pass Criteria:**
- ✅ Correct indicator for each state
- ✅ Success messages display
- ✅ Visual feedback clear

---

## Badge Display Testing

### Test 4.1: Badge List Display

**Test Case ID:** BADGES_001  
**Objective:** Verify all user badges display correctly  
**Prerequisites:** User has 20+ badges

**Steps:**
1. Query database for all user badges
2. Execute: `contriflow dashboard --badges`
3. Count displayed badges
4. Verify each badge shows:
   - Badge icon/emoji
   - Badge name
   - Date earned
   - Category (if applicable)
5. Verify sort order (newest first)
6. Verify no duplicates

**Expected Display:**
```
🏅 Streak Champion - 30 days - 2024-01-15
🎯 Milestone: 1000 Contributions - 2024-01-10
💎 Rare Contributor - 2024-01-05
⭐ Rising Star - 2023-12-28
```

**Verification:**
```javascript
const displayedCount = dashboard.badges.length;
assert.equal(displayedCount, databaseBadgeCount);
assert.isTrue(isSortedByDate(dashboard.badges));
assert.equal(new Set(displayedBadges).size, displayedCount); // No dups
```

**Pass Criteria:**
- ✅ All badges displayed
- ✅ No duplicates
- ✅ Properly sorted
- ✅ Complete information

---

### Test 4.2: Badge Categorization

**Test Case ID:** BADGES_002  
**Objective:** Verify badges grouped by category  
**Prerequisites:** Badges of different types (Streak, Milestone, Special)

**Test Data:**
- Streak Badges: 8
- Milestone Badges: 12
- Special Badges: 27

**Steps:**
1. Execute: `contriflow dashboard --badges`
2. Verify categories displayed:
   - "STREAK BADGES (8)"
   - "MILESTONE BADGES (12)"
   - "SPECIAL BADGES (27)"
3. Verify category totals match
4. Verify each badge in correct category
5. Verify section headers clear

**Expected Output:**
```
STREAK BADGES (8):
├─ 🔥 7-Day Performer
├─ 🔥 30-Day Master
└─ ...

MILESTONE BADGES (12):
├─ 🎯 Contributor (100)
└─ ...

SPECIAL BADGES (27):
└─ ...
```

**Verification:**
```javascript
const sections = dashboard.sections;
assert.equal(sections['Streak'].count, 8);
assert.equal(sections['Milestone'].count, 12);
assert.equal(sections['Special'].count, 27);
```

**Pass Criteria:**
- ✅ All categories identified
- ✅ Counts accurate
- ✅ Badges correctly grouped
- ✅ Headers clear

---

### Test 4.3: Last N Badges Display

**Test Case ID:** BADGES_003  
**Objective:** Verify option to show recent N badges  
**Prerequisites:** User has 20+ badges

**Steps:**
1. Execute: `contriflow dashboard --recent 5`
2. Verify only 5 most recent badges shown
3. Verify others hidden
4. Test with various N values: 1, 5, 10, 50
5. Test with N > total (should show all)
6. Test with N = 0 (should show none or error)

**Verification:**
```javascript
assert.equal(displayedBadges.length, 5);
assert.equal(displayedBadges[0].date, mostRecentDate);
```

**Pass Criteria:**
- ✅ Correct number displayed
- ✅ Most recent first
- ✅ Edge values handled

---

### Test 4.4: No Badges State

**Test Case ID:** BADGES_004  
**Objective:** Verify display when user has no badges  
**Prerequisites:** New user with no badges

**Steps:**
1. Create test user with 0 badges
2. Execute: `contriflow dashboard --badges`
3. Verify appropriate message displayed
4. Verify no crash or error
5. Verify helpful message or guidance shown

**Expected Message:**
```
No badges earned yet!
Keep contributing to unlock achievements.
```

**Verification:**
```javascript
assert.include(dashboard, 'No badges');
assert.notInclude(dashboard, 'undefined');
```

**Pass Criteria:**
- ✅ Graceful handling
- ✅ No errors
- ✅ Clear message
- ✅ Encouragement provided

---

### Test 4.5: Badge Timeline

**Test Case ID:** BADGES_005  
**Objective:** Verify badge earning timeline accuracy  
**Prerequisites:** Badges earned on different dates

**Test Data:**
```
2023-12-28: Rising Star
2024-01-05: Rare Contributor
2024-01-10: Milestone 1000
2024-01-15: Streak Champion
2024-01-17: Recent Badge
```

**Steps:**
1. Execute: `contriflow dashboard --detailed`
2. Verify badge timeline section
3. Verify chronological order (newest first)
4. Verify dates displayed correctly
5. Verify "days ago" calculation:
   - 2024-01-17: "Today"
   - 2024-01-16: "1 day ago"
   - 2024-01-10: "7 days ago"

**Verification:**
```javascript
const timeline = dashboard.badgeTimeline;
assert.isTrue(isSortedDescByDate(timeline));
assert.equal(timeline[0].daysAgo, 0);
assert.approximately(timeline[1].daysAgo, 1, 1);
```

**Pass Criteria:**
- ✅ Correct chronological order
- ✅ Dates accurate
- ✅ Days calculation correct

---

## ASCII Art Testing

### Test 5.1: Level Box Rendering

**Test Case ID:** ASCII_001  
**Objective:** Verify ASCII level box renders correctly  
**Prerequisites:** ASCII mode enabled

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Find level box section
3. Verify:
   - Top border: `┏━┓` format
   - Bottom border: `┗━┛` format
   - Content properly centered
   - Star emojis present
   - Level text complete

**Expected Output:**
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃         ⭐ LEVEL 25 - Expert Developer ⭐ ┃
┃ XP: 875 / 1000                             ┃
┃ ████████████████░░░░░░░░░░░░░░░░░░░░ 87% ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Verification:**
```javascript
assert.include(box, '┏━');
assert.include(box, '┗━');
assert.include(box, 'LEVEL 25');
assert.include(box, 'Expert');
```

**Pass Criteria:**
- ✅ Borders render correctly
- ✅ Content centered
- ✅ No character encoding issues
- ✅ Layout consistent

---

### Test 5.2: Streak Box Rendering

**Test Case ID:** ASCII_002  
**Objective:** Verify ASCII streak box renders correctly  
**Prerequisites:** ASCII mode enabled

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Find streak box
3. Verify:
   - Proper border style
   - Flame emojis display
   - Daily activity calendar shows correctly
   - Numbers align properly

**Expected Output:**
```
╭─────────────────────────────────────────────────────╮
│              STREAK INFORMATION                     │
├─────────────────────────────────────────────────────┤
│ Current Streak: 18 days 🔥🔥🔥                      │
│ Longest Streak: 64 days ⭐                         │
│ Activity: ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✗ ◯ ◯ ◯                  │
╰─────────────────────────────────────────────────────╯
```

**Verification:**
```javascript
assert.include(box, '╭─');
assert.include(box, '╰─');
assert.match(box, /Current Streak: \d+ days 🔥+/);
```

**Pass Criteria:**
- ✅ Borders display
- ✅ Emojis render
- ✅ Calendar shows
- ✅ Numbers accurate

---

### Test 5.3: Stats Box Rendering

**Test Case ID:** ASCII_003  
**Objective:** Verify ASCII stats box renders correctly  
**Prerequisites:** ASCII mode enabled

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Find statistics box
3. Verify:
   - Section header clear
   - All statistics included
   - Numbers right-aligned
   - Dots for visual alignment
   - Box borders match theme

**Expected Output:**
```
┌─────────────────────────────────────────────────────┐
│              STATISTICS SUMMARY                     │
├─────────────────────────────────────────────────────┤
│ Total Contributions ............ 2,847              │
│ Pull Requests .................. 156 (5.5%)        │
│ Issues Created ................. 89 (3.1%)         │
│ Code Reviews ................... 234 (8.2%)        │
└─────────────────────────────────────────────────────┘
```

**Verification:**
```javascript
assert.include(box, 'STATISTICS');
assert.include(box, 'Total Contributions');
assert.match(box, /2,847/);
```

**Pass Criteria:**
- ✅ All content included
- ✅ Formatting consistent
- ✅ Numbers correct
- ✅ Alignment proper

---

### Test 5.4: Badge Grid Rendering

**Test Case ID:** ASCII_004  
**Objective:** Verify ASCII badge grid renders correctly  
**Prerequisites:** ASCII mode enabled, user has badges

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Find badge grid section
3. Verify:
   - Grid structure (columns and rows)
   - Badge cells properly formatted
   - Cell borders align
   - Badges evenly distributed
   - Column count matches setting (default 4)

**Expected Output:**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 🏅 Streak    │ 🎯 Milestone │ 💎 Rare      │ ⭐ Rising    │
│ Champion     │ 1000 Contribs│ Contributor  │ Star         │
│              │              │              │              │
│ 30 days 🔥   │ 2024-01-10   │ 2024-01-05   │ 2023-12-28   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Verification:**
```javascript
const grid = extractBadgeGrid(dashboard);
assert.equal(grid.columnCount, 4);
assert.isTrue(gridProperlyAligned(grid));
assert.include(grid, '🏅');
```

**Pass Criteria:**
- ✅ Grid properly structured
- ✅ Cells aligned
- ✅ Content complete
- ✅ Visual organization clear

---

### Test 5.5: Complete ASCII Dashboard

**Test Case ID:** ASCII_005  
**Objective:** Verify complete ASCII dashboard integrates all sections  
**Prerequisites:** ASCII mode, full data set

**Steps:**
1. Execute: `contriflow dashboard --ascii`
2. Verify in order:
   - Header section with decorative title
   - Level box
   - Streak box
   - Stats box
   - Badge grid
   - Footer section
3. Verify:
   - Consistent theme throughout
   - Section separators visible
   - No overlapping text
   - Terminal width respected
   - Total output fits in reasonable space

**Layout Check:**
```
Header (3 lines)
↓
Level Box (5 lines)
↓ Separator
Streak Box (5 lines)
↓ Separator
Stats Box (6 lines)
↓ Separator
Badge Grid (6 lines)
↓ Separator
Footer (1 line)
```

**Verification:**
```javascript
const sections = dashboard.split('\n\n');
assert.equal(sections.length, 6);
assert.isTrue(dashboard.length < 5000); // Reasonable size
```

**Pass Criteria:**
- ✅ All sections present
- ✅ Logical flow
- ✅ Professional appearance
- ✅ No truncation

---

## GitHub Integration Testing

### Test 6.1: GitHub Profile Integration

**Test Case ID:** GH_001  
**Objective:** Verify GitHub profile data correctly integrated  
**Prerequisites:** GitHub authentication configured

**Steps:**
1. Authenticate with GitHub: `contriflow login`
2. Execute: `contriflow dashboard`
3. Verify displayed:
   - GitHub username from profile
   - Profile URL: `https://github.com/USERNAME`
   - Display name if available
   - Avatar reference if used
4. Verify data matches logged-in user
5. Verify no exposure of private user data

**Verification:**
```javascript
assert.equal(displayedUsername, githubUsername);
assert.include(displayedUrl, githubUsername);
```

**Pass Criteria:**
- ✅ Correct user data
- ✅ No data mismatches
- ✅ Privacy respected

---

### Test 6.2: User Stats Display

**Test Case ID:** GH_002  
**Objective:** Verify user contribution stats from GitHub  
**Prerequisites:** GitHub profile with contributions

**Steps:**
1. Fetch user data from GitHub API
2. Execute: `contriflow dashboard --detailed`
3. Verify stats match GitHub:
   - PR count matches GitHub
   - Issue count matches GitHub
   - Repository count matches
   - Follower/following counts if displayed
4. Test with multiple GitHub accounts
5. Verify sync is current

**Verification:**
```javascript
const githubStats = await fetchGitHubStats(username);
assert.equal(displayedPRs, githubStats.pulls);
assert.equal(displayedIssues, githubStats.issues);
```

**Pass Criteria:**
- ✅ Stats match GitHub
- ✅ No discrepancies
- ✅ Current data shown

---

### Test 6.3: Missing Profile Handling

**Test Case ID:** GH_003  
**Objective:** Verify graceful handling when GitHub unavailable  
**Prerequisites:** No GitHub connection or invalid profile

**Steps:**
1. Execute dashboard without GitHub access
2. Verify:
   - No crash or error
   - Fallback to cached data
   - Clear message about limited data
   - Suggestion to sync when possible
3. Test with:
   - Network disconnected
   - Invalid GitHub token
   - Deleted GitHub profile

**Expected Behavior:**
```
⚠️  GitHub not available. Showing cached data (last synced: 2024-01-17)
Run 'contriflow sync' to update when connection available.
```

**Verification:**
```javascript
assert.notThrow(() => dashboard());
assert.include(output, 'cached');
```

**Pass Criteria:**
- ✅ No errors thrown
- ✅ Cached data shown
- ✅ Clear user message
- ✅ Helpful guidance

---

## Data Integration Testing

### Test 7.1: Contribution History Display

**Test Case ID:** DATA_001  
**Objective:** Verify contribution history correctly displayed  
**Prerequisites:** 30+ days of history available

**Steps:**
1. Execute: `contriflow dashboard --detailed --since "2024-01-01"`
2. Verify history section shows:
   - Last 30 days activity
   - Weekly breakdown
   - Daily breakdown (if detailed)
   - Totals for period
3. Test date filtering works:
   - --since only
   - --until only
   - Both together
4. Verify calculations:
   - Weekly totals
   - Daily totals
   - Cumulative totals

**Verification:**
```javascript
const historyTotal = history.reduce((a, b) => a + b.count, 0);
assert.equal(displayedHistoryTotal, historyTotal);
```

**Pass Criteria:**
- ✅ History displayed correctly
- ✅ Filtering works
- ✅ Calculations accurate

---

### Test 7.2: Daily History Parsing

**Test Case ID:** DATA_002  
**Objective:** Verify daily contribution data correctly parsed  
**Prerequisites:** Daily history records in database

**Test Data:**
```
2024-01-15: 8 contributions
2024-01-16: 5 contributions
2024-01-17: 12 contributions
```

**Steps:**
1. Insert test data in database
2. Execute: `contriflow dashboard --detailed`
3. Verify daily breakdown shows correct values
4. Verify visualization (bars, numbers)
5. Test with:
   - Zero contributions day
   - Very high contributions day (50+)
   - Multi-day history

**Verification:**
```javascript
assert.equal(parsedDailyData['2024-01-15'], 8);
assert.equal(parsedDailyData['2024-01-16'], 5);
```

**Pass Criteria:**
- ✅ Data parsed correctly
- ✅ Dates accurate
- ✅ Counts match database

---

### Test 7.3: Streak Data Accuracy

**Test Case ID:** DATA_003  
**Objective:** Verify streak calculation from history  
**Prerequisites:** Contribution history with streaks and breaks

**Test Data:**
```
Day 1-5: ✓ (5 days)
Day 6: ✗ (break)
Day 7-20: ✓ (14 days) ← current
```

**Steps:**
1. Set up test history
2. Execute: `contriflow dashboard`
3. Verify:
   - Current streak: 14 days
   - Previous streak: 5 days
   - Longest streak: 14 days
   - Breaks detected correctly
4. Test edge cases:
   - Start of streak (day 1)
   - End of streak
   - Single day
   - No contributions

**Verification:**
```javascript
assert.equal(currentStreak, 14);
assert.equal(longestStreak, 14);
```

**Pass Criteria:**
- ✅ Streak calculated correctly
- ✅ Breaks identified
- ✅ Edge cases handled

---

### Test 7.4: Badge Timeline Accuracy

**Test Case ID:** DATA_004  
**Objective:** Verify badge earned dates are correct  
**Prerequisites:** Multiple badges with different earn dates

**Test Data:**
```
Badge A: earned 2024-01-10
Badge B: earned 2024-01-15
Badge C: earned 2024-01-05
```

**Steps:**
1. Insert test badges
2. Execute: `contriflow dashboard --badges`
3. Verify chronological order:
   - Badge B (2024-01-15) first
   - Badge A (2024-01-10) second
   - Badge C (2024-01-05) third
4. Verify "days ago" calculation
5. Test with future dates (should handle gracefully)

**Verification:**
```javascript
const timeline = dashboard.badges;
assert.equal(timeline[0].name, 'Badge B');
assert.equal(timeline[2].name, 'Badge C');
```

**Pass Criteria:**
- ✅ Proper sort order
- ✅ Dates accurate
- ✅ "Days ago" calculated correctly

---

## Error Handling Testing

### Test 8.1: Authentication Error

**Test Case ID:** ERROR_001  
**Objective:** Verify proper error handling when not authenticated  
**Prerequisites:** User not logged in

**Steps:**
1. Clear authentication token
2. Execute: `contriflow dashboard`
3. Verify error message:
   - Friendly error text
   - Suggestion to run: `contriflow login`
   - No technical jargon or stack traces
4. Verify no crash

**Expected Message:**
```
❌ Authentication required
Please log in with: contriflow login
```

**Verification:**
```javascript
assert.include(output, 'Authentication');
assert.include(output, 'login');
assert.notThrow(() => command());
```

**Pass Criteria:**
- ✅ Clear error message
- ✅ Helpful guidance
- ✅ No crash or technical errors

---

### Test 8.2: Database Read Failure

**Test Case ID:** ERROR_002  
**Objective:** Verify error handling when database unavailable  
**Prerequisites:** Database connection fails

**Steps:**
1. Disconnect database
2. Execute: `contriflow dashboard`
3. Verify error handling:
   - Graceful degradation
   - Clear message
   - Suggestion to check connection
   - Mention sync if applicable
4. Reconnect and retry (should work)

**Expected Message:**
```
⚠️ Unable to read local data
Please run: contriflow sync
Or check your database connection
```

**Verification:**
```javascript
assert.notThrow(() => command());
assert.include(output, 'sync');
```

**Pass Criteria:**
- ✅ Handles error gracefully
- ✅ Clear message
- ✅ Recovery suggestion

---

### Test 8.3: GitHub API Failure

**Test Case ID:** ERROR_003  
**Objective:** Verify handling when GitHub API fails  
**Prerequisites:** GitHub API unavailable

**Steps:**
1. Mock GitHub API failure
2. Execute: `contriflow dashboard`
3. Verify:
   - Dashboard still displays using cache
   - Warning message about limited data
   - Shows last sync time
   - Retry suggestion
4. Verify no crash with --json or other flags

**Expected Behavior:**
```
⚠️ GitHub API temporarily unavailable
Showing cached data (last synced: 2024-01-17)
Run 'contriflow sync' to retry
```

**Verification:**
```javascript
assert.notThrow(() => command());
assert.include(output, 'cached');
```

**Pass Criteria:**
- ✅ Graceful degradation
- ✅ Clear messaging
- ✅ Cache utilized
- ✅ No errors

---

## Edge Cases Testing

### Test 9.1: Zero Contributions

**Test Case ID:** EDGE_001  
**Objective:** Verify dashboard with zero contributions  
**Prerequisites:** New user or test user

**Steps:**
1. Create user with 0 contributions
2. Execute: `contriflow dashboard`
3. Verify:
   - Level shows 1
   - XP shows 0
   - All stats show 0
   - Streak shows 0
   - No badges
   - Clear state message if appropriate
4. Verify no crashes or errors
5. Test --detailed mode too

**Expected Output:**
```
Level: 1
XP: 0 / 1000
Total Contributions: 0
Current Streak: 0 days
Longest Streak: 0 days
```

**Verification:**
```javascript
assert.equal(level, 1);
assert.equal(totalContributions, 0);
assert.notThrow(() => dashboard());
```

**Pass Criteria:**
- ✅ Zero values displayed
- ✅ No crashes
- ✅ Layout maintains integrity

---

### Test 9.2: No Badges

**Test Case ID:** EDGE_002  
**Objective:** Verify display when user has no badges  
**Prerequisites:** User with 0 badges

**Steps:**
1. Execute: `contriflow dashboard --badges`
2. Verify:
   - Clear "no badges" message
   - Total count shows 0
   - No empty grid displayed
   - Encouragement message
3. Test in full dashboard:
   - Badge section shows 0 or "not yet"
   - No crash

**Expected:**
```
Badges Earned: 0
No badges yet. Keep contributing!
```

**Verification:**
```javascript
assert.include(output, 'No badges');
assert.notInclude(output, 'undefined');
```

**Pass Criteria:**
- ✅ Clear empty state
- ✅ No layout issues
- ✅ Encouraging message

---

### Test 9.3: Very Long Streak (100+ days)

**Test Case ID:** EDGE_003  
**Objective:** Verify dashboard with exceptionally long streak  
**Prerequisites:** User with 100+ day streak

**Steps:**
1. Create user with 150 day streak
2. Execute: `contriflow dashboard`
3. Verify:
   - Streak displays as "150 days 🔥🔥🔥🔥🔥"
   - Flame count capped at 5
   - Display formatting intact
   - No truncation
4. Test with 365+ day streak
5. Test level up triggered by long streak badges

**Verification:**
```javascript
const streak = dashboard.streak;
assert.equal(streak.days, 150);
const flameCount = (streak.display.match(/🔥/g) || []).length;
assert.equal(flameCount, 5); // Capped
```

**Pass Criteria:**
- ✅ Very long streaks display
- ✅ Flame count capped appropriately
- ✅ Formatting maintained

---

### Test 9.4: Unicode Emoji Handling

**Test Case ID:** EDGE_004  
**Objective:** Verify proper emoji rendering across platforms  
**Prerequisites:** Multiple terminal environments

**Steps:**
1. Test on:
   - Linux terminal
   - Windows PowerShell
   - macOS terminal
   - Web terminal
2. Verify emojis display:
   - 🔥 Fire (streak)
   - 🏅 Medal (badges)
   - ⭐ Star (achievements)
   - ✓ Check (completed)
   - ✗ X (incomplete)
3. Test fallback for terminals without emoji support:
   - Render text alternatives
   - No crashes
   - Readable output

**Verification:**
```javascript
const hasEmoji = supportsEmoji();
const output = dashboard();
if (hasEmoji) {
  assert.include(output, '🔥');
} else {
  assert.include(output, '[FIRE]');
}
```

**Pass Criteria:**
- ✅ Emojis render correctly
- ✅ Fallbacks work on basic terminals
- ✅ Cross-platform compatibility

---

## Integration Tests

### Test 10.1: Dashboard with Clone Command

**Test Case ID:** INTEGRATION_001  
**Objective:** Verify dashboard integrates with clone workflow  
**Prerequisites:** Repository available to clone

**Steps:**
1. Execute: `contriflow dashboard`
2. Note current stats
3. Execute: `contriflow clone owner/repo`
4. Make modifications
5. Execute: `contriflow dashboard` again
6. Verify stats have been updated to reflect changes

**Verification:**
```javascript
const beforeContributions = dashboard1.totalContributions;
// ... make contributions ...
const afterContributions = dashboard2.totalContributions;
assert.isTrue(afterContributions > beforeContributions);
```

**Pass Criteria:**
- ✅ Dashboard reflects new activity
- ✅ Stats update correctly

---

### Test 10.2: Dashboard with Fork Command

**Test Case ID:** INTEGRATION_002  
**Objective:** Verify dashboard works with fork operations  
**Prerequisites:** PR ready to be forked

**Steps:**
1. Note level and badges
2. Execute: `contriflow fork --pr`
3. Sync data
4. Execute: `contriflow dashboard`
5. Verify stats updated appropriately
6. Check if new badges earned

**Pass Criteria:**
- ✅ Dashboard updates after fork
- ✅ New contributions counted
- ✅ Badges awarded if earned

---

### Test 10.3: Dashboard with Contribute Command

**Test Case ID:** INTEGRATION_003  
**Objective:** Verify dashboard syncs during contribution workflow  
**Prerequisites:** Issue available

**Steps:**
1. Execute: `contriflow dashboard --watch` (background)
2. Execute: `contriflow contribute`
3. Monitor dashboard updates in real-time
4. Complete contribution
5. Verify dashboard reflects changes immediately

**Pass Criteria:**
- ✅ Real-time updates work
- ✅ Stats change as expected

---

## Performance Testing

### Test 11.1: Dashboard Load Time

**Test Case ID:** PERF_001  
**Objective:** Verify dashboard displays within acceptable time  
**Prerequisites:** Typical user dataset

**Steps:**
1. Measure time to first render
2. Measure time to full display
3. Test with various dataset sizes:
   - Small (1 month history)
   - Medium (1 year history)
   - Large (5 years history)

**Performance Targets:**
- First render: < 500ms
- Full display: < 2 seconds
- Large dataset: < 5 seconds

**Verification:**
```javascript
const start = Date.now();
await dashboard();
const duration = Date.now() - start;
assert.isBelow(duration, 2000);
```

**Pass Criteria:**
- ✅ Meets performance targets
- ✅ Scales with data size
- ✅ No noticeable lag

---

### Test 11.2: Memory Usage

**Test Case ID:** PERF_002  
**Objective:** Verify dashboard doesn't cause memory leak  
**Prerequisites:** Dashboard command

**Steps:**
1. Measure initial memory
2. Execute dashboard 10 times
3. Measure final memory
4. Calculate growth
5. Force garbage collection
6. Verify memory released

**Memory Targets:**
- Per execution: < 50MB
- Memory growth after 10x: < 100MB
- After GC: return to baseline

**Verification:**
```javascript
const memBefore = process.memoryUsage().heapUsed;
for (let i = 0; i < 10; i++) {
  await dashboard();
}
const memAfter = process.memoryUsage().heapUsed;
const growth = (memAfter - memBefore) / 1024 / 1024;
assert.isBelow(growth, 100);
```

**Pass Criteria:**
- ✅ Memory usage acceptable
- ✅ No memory leaks
- ✅ Garbage collection works

---

### Test 11.3: Watch Mode Performance

**Test Case ID:** PERF_003  
**Objective:** Verify watch mode doesn't consume excessive resources  
**Prerequisites:** Watch mode enabled

**Steps:**
1. Start watch mode: `contriflow dashboard --watch`
2. Monitor CPU usage for 5 minutes
3. Monitor memory growth
4. Stop watch mode
5. Verify resources released

**Performance Targets:**
- CPU: < 2% average
- Memory: stable, < 100MB
- Update time: < 1 second

**Pass Criteria:**
- ✅ Low CPU usage
- ✅ Stable memory
- ✅ Quick updates

---


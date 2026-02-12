# 🚀 ContriFlow CLI - Complete Getting Started Guide

A comprehensive step-by-step guide to using ContriFlow CLI from initial setup to submitting Pull Requests with AI-powered issue solutions.

---

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Authentication](#authentication)
3. [Finding Repositories](#finding-repositories)
4. [Discovering Issues](#discovering-issues)
5. [Setting Up Your Workspace](#setting-up-your-workspace)
6. [Understanding the Issue](#understanding-the-issue)
7. [AI-Powered Issue Solving](#ai-powered-issue-solving)
8. [Verifying Your Solution](#verifying-your-solution)
9. [Creating a Pull Request](#creating-a-pull-request)
10. [Tracking Your Contributions](#tracking-your-contributions)

---

## Installation & Setup

### Step 1: Install ContriFlow CLI

#### Option A: Global Installation (Recommended)
```bash
npm install -g contriflow-cli
```

#### Option B: Local Installation
```bash
git clone https://github.com/your-username/contriflow-cli.git
cd contriflow-cli
npm install
npm link  # Makes 'contriflow' command available globally
```

#### Option C: Using npx (No Installation)
```bash
npx contriflow-cli <command> [options]
```

### Step 2: Verify Installation
```bash
contriflow --version
contriflow --help
```

You should see:
```
≡🛠 Automate your open-source contributions with ContriFlow

Usage: contriflow [options] [command]
...
```

---

## Authentication

### Step 3: Create a GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Navigate to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"

2. **Configure Token Permissions**
   - ✅ `repo` - Full control of repositories
   - ✅ `read:user` - Read user profile data
   - ✅ `user:email` - Access user email addresses
   - ✅ `workflow` - Update GitHub Actions workflows

3. **Generate & Copy Token**
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

### Step 4: Log In to ContriFlow

```bash
contriflow login
```

You'll see:
```
🔐 GitHub Personal Access Token Login

? GitHub Personal Access Token: [paste your token here]
```

**Paste your token and press Enter**

You should see:
```
✅ Authentication successful!
✅ Token stored securely at ~/.contriflow/config.json
👤 Logged in as: your-github-username
```

### Verify Login
```bash
contriflow login
```

It should show your username without asking for a new token.

---

## Finding Repositories

### Step 5: Search for Open-Source Projects

ContriFlow helps you find beginner-friendly repositories to contribute to.

#### Basic Search
```bash
contriflow search --keyword react
```

Output:
```
📦 Searching for repositories with keyword: react

Results (showing top 10):

┌─────┬────────────────────────┬───────┬────────────────────────────────┐
│ # │ Repository               │ Stars │ Description                    │
├─────┼────────────────────────┼───────┼────────────────────────────────┤
│ 1 │ facebook/react           │ 195k  │ A JavaScript library for...    │
│ 2 │ react-bootstrap/react... │ 21k   │ Bootstrap components built...  │
│ 3 │ remix-run/react-router   │ 50k   │ Declarative routing for React  │
└─────┴────────────────────────┴───────┴────────────────────────────────┘

Use 'contriflow guide <owner/repo>' to read contribution guidelines
Use 'contriflow issues <owner/repo>' to find issues
```

#### Search with Star Filter
```bash
contriflow search --keyword node --stars 5000
```

Only shows repositories with 5,000+ stars.

#### Pro Tips for Finding Good Projects
```bash
# Search for popular frameworks
contriflow search --keyword javascript --stars 10000

# Search for emerging projects
contriflow search --keyword testing --stars 500

# Search for specific tech
contriflow search --keyword machine-learning --stars 1000
```

**What to Look For:**
- ✅ Active repositories (recent commits)
- ✅ Good documentation
- ✅ Welcoming community
- ✅ Clear contribution guidelines
- ✅ "good-first-issue" or "help-wanted" labels

---

## Discovering Issues

### Step 6: Find Beginner-Friendly Issues

Once you've found an interesting repository, search for issues you can solve.

#### Find Issues in a Specific Repository
```bash
contriflow issues facebook/react --label good-first-issue
```

Output:
```
📋 Issues in facebook/react with label: good-first-issue

┌────┬──────────┬──────────────────────────────────────┬──────────────┐
│ # │ Issue ID │ Title                                │ Labels       │
├────┼──────────┼──────────────────────────────────────┼──────────────┤
│ 1 │ 25432    │ Fix typo in documentation           │ good-first-  │
│    │          │                                      │ issue        │
│ 2 │ 25401    │ Add missing TypeScript types        │ help-wanted, │
│    │          │                                      │ typescript   │
│ 3 │ 25381    │ Update deprecated API usage         │ documentation│
└────┴──────────┴──────────────────────────────────────┴──────────────┘
```

#### Find Issues by Type
```bash
# Documentation issues
contriflow issues facebook/react --label documentation

# Bug fixes
contriflow issues facebook/react --label bug

# Feature requests
contriflow issues facebook/react --label enhancement
```

#### Find Issues Globally
```bash
# Find all good-first-issues across GitHub
contriflow issues --label good-first-issue --limit 10
```

**Choose an Issue:**
- Start with "good-first-issue" or "help-wanted" labels
- Read the description carefully
- Check if anyone is already working on it
- Make sure you understand what needs to be done

---

## Setting Up Your Workspace

### Step 7: Fork the Repository

Forking creates a copy of the repository under your GitHub account.

```bash
contriflow fork facebook/react
```

Output:
```
🍴 Forking repository facebook/react...

✅ Fork successful!
📌 Forked to: https://github.com/your-username/react
```

### Step 8: Clone the Repository

This downloads the repository to your computer.

```bash
contriflow clone facebook/react
```

Output:
```
📥 Cloning your fork of facebook/react...

✅ Clone successful!
📁 Repository location: ~/contriflow-workspace/react

Repository ready for development!
```

### Step 9: Read Contribution Guidelines (Optional but Recommended)

```bash
contriflow guide facebook/react
```

This displays:
- `CONTRIBUTING.md` - How to contribute
- `CODE_OF_CONDUCT.md` - Community standards
- Development setup instructions
- Code style guidelines
- Testing requirements

Output:
```
📖 Contribution Guidelines for facebook/react

═════════════════════════════════════════
CONTRIBUTING.md
═════════════════════════════════════════

[Full content of CONTRIBUTING.md displayed]

...

═════════════════════════════════════════
CODE_OF_CONDUCT.md
═════════════════════════════════════════

[Full content of CODE_OF_CONDUCT.md displayed]
```

---

## Understanding the Issue

### Step 10: Analyze the Issue

Before writing code, understand the problem:

**Example Issue:**
```
Title: Fix button colors not updating on theme change
Number: #25432
Repository: facebook/react

Description:
When users switch between light and dark themes, 
button colors don't update automatically. The CSS 
variables should be reactive to theme changes.

Expected Behavior:
- Click "Light/Dark" toggle
- Button colors immediately change
- No page refresh needed

Actual Behavior:
- Colors remain the same
- Manual refresh is required

Steps to Reproduce:
1. Open app in browser
2. Click theme toggle button
3. Observe button colors don't change
```

**What You Need to Do:**
1. Understand the problem
2. Know what the expected result should be
3. Identify what code needs to change
4. Plan your approach

---

## AI-Powered Issue Solving

### Step 11: Use AI to Generate a Solution

ContriFlow uses OpenRouter AI to analyze the issue and suggest a fix.

#### Generate Solution Patch
```bash
contriflow solve 25432 facebook/react
```

Output:
```
🤖 Analyzing issue #25432 using AI...

═══════════════════════════════════════════════════
AI ANALYSIS
═══════════════════════════════════════════════════

Issue Type: Bug - CSS/Styling
Complexity: Medium
Files Likely Affected: 
  - src/components/Button.js
  - src/styles/theme.css

═══════════════════════════════════════════════════
PROPOSED SOLUTION
═══════════════════════════════════════════════════

The issue is that button colors are set statically
instead of using CSS custom properties that react
to theme changes.

Recommended Fix:
1. Update Button.js to use CSS variables
2. Add theme context listener
3. Update theme.css with proper variable definitions

═══════════════════════════════════════════════════
CODE PATCH
═══════════════════════════════════════════════════

--- a/src/components/Button.js
+++ b/src/components/Button.js
@@ -1,8 +1,12 @@
 import React from 'react';
+import { useTheme } from '../context/ThemeContext';
 
 export function Button({ children, ...props }) {
+  const { theme } = useTheme();
+  
   return (
     <button 
+      data-theme={theme}
       className="btn"
       {...props}
     >

...

═══════════════════════════════════════════════════
PATCH SAVED
═══════════════════════════════════════════════════

✅ Patch file saved to: ~/.contriflow/patches/25432.patch
📝 Review the patch and apply it manually if needed
```

#### Understanding the AI Output

The AI provides:
- **Issue Analysis** - What the problem is
- **Complexity Rating** - How hard it is to fix
- **Affected Files** - Which files need changes
- **Explanation** - Why this is the solution
- **Code Patch** - The actual code changes
- **Comments** - Explanation of the changes

### Step 12: Review the AI Solution

Before applying the patch, review it:

```bash
# View the generated patch
cat ~/.contriflow/patches/25432.patch
```

**Check:**
- ✅ Does the solution make sense?
- ✅ Are there any syntax errors?
- ✅ Does it follow the project's code style?
- ✅ Are there any edge cases it misses?

**If you want to modify:**
1. Edit the patch file manually
2. Or make changes directly in your code editor
3. ContriFlow will help you apply it next

---

## Verifying Your Solution

### Step 13: Test the Solution Locally

Before submitting, test that your changes work:

#### 1. Navigate to Repository
```bash
cd ~/contriflow-workspace/react
```

#### 2. Create a Feature Branch
```bash
git checkout -b fix/button-colors-theme
```

#### 3. Apply the AI-Generated Patch (Optional)
If the patch is ready:
```bash
git apply ~/.contriflow/patches/25432.patch
```

Or make the changes manually in your code editor.

#### 4. Run Tests
```bash
# Run the project's test suite
npm test

# Or if using yarn
yarn test

# Or if using pnpm
pnpm test
```

Expected output:
```
✅ All tests passed
   Total: 150
   Passed: 150
   Failed: 0
   Skipped: 0
   Time: 2.34s
```

#### 5. Build the Project
```bash
npm run build
```

Ensure there are no build errors.

#### 6. Test Manually (If Applicable)
```bash
npm start
```

1. Open the application in your browser
2. Reproduce the original issue
3. Verify your fix resolves it
4. Check for any side effects
5. Test on mobile/different browsers if needed

**Testing Checklist:**
- ✅ Original issue is fixed
- ✅ No new errors in console
- ✅ No breaking changes to other features
- ✅ Code follows project style
- ✅ All existing tests still pass
- ✅ Performance is not degraded

### Step 14: Commit Your Changes

Once testing is complete:

```bash
# See what files changed
git status

# Stage all changes
git add .

# Create a meaningful commit
git commit -m "Fix: Update button colors to react to theme changes

- Modified Button component to use CSS variables
- Added useTheme hook for reactive theme updates
- Updated theme.css with proper variable definitions
- All tests passing

Fixes #25432"
```

**Good Commit Message Format:**
```
Type: Brief description

- What was changed
- Why it was changed
- How it was tested

Fixes #issue-number
```

**Commit Types:**
- `Fix:` - Bug fixes
- `Feature:` - New features
- `Refactor:` - Code cleanup
- `Docs:` - Documentation changes
- `Test:` - Test additions/updates
- `Chore:` - Build/tool updates

---

## Creating a Pull Request

### Step 15: Push Your Changes

Upload your changes to your fork:

```bash
git push origin fix/button-colors-theme
```

Output:
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
...
To https://github.com/your-username/react.git
 * [new branch]      fix/button-colors-theme -> fix/button-colors-theme
```

### Step 16: Create Pull Request Using ContriFlow

```bash
contriflow pr 25432 facebook/react
```

This will:
1. Create a branch from your fix
2. Generate a PR description automatically
3. Open the PR on GitHub
4. Add AI-generated comments explaining the changes

Output:
```
🔧 Creating Pull Request for issue #25432...

═══════════════════════════════════════════════════
PULL REQUEST DETAILS
═══════════════════════════════════════════════════

Title: Fix button colors not updating on theme change
Repository: facebook/react
Branch: fix/button-colors-25432
Base Branch: main

═══════════════════════════════════════════════════
PR DESCRIPTION
═══════════════════════════════════════════════════

## Description
This pull request fixes the issue where button colors 
don't update when the theme changes.

## Changes Made
- Updated Button.js to use CSS variables
- Added useTheme hook for theme detection
- Modified theme.css with proper variables
- Added tests for theme switching

## How to Test
1. Run `npm test` (all tests pass)
2. Run `npm start`
3. Click theme toggle
4. Verify buttons change color immediately

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] No breaking changes
- [x] Code follows project style

Fixes #25432

═══════════════════════════════════════════════════
AI-GENERATED COMMENTS
═══════════════════════════════════════════════════

📝 Comment on Button.js changes:
"Added useTheme hook to make button colors responsive
to theme changes. The component now listens for theme
changes and updates the data-theme attribute accordingly."

📝 Comment on theme.css changes:
"Updated CSS variables to use standard naming 
conventions. Variables are now scoped to theme values
and update reactively when theme context changes."

═══════════════════════════════════════════════════
✅ PULL REQUEST CREATED
═══════════════════════════════════════════════════

🔗 PR URL: https://github.com/facebook/react/pull/12345
📊 Commits: 1
📝 Files Changed: 3
🗣️ Comments: Added AI-generated explanations

Next Steps:
1. Monitor PR for feedback
2. Address any review comments
3. Maintainers will merge when approved
```

### Step 17: Understanding AI-Generated Comments

ContriFlow automatically adds detailed comments to your PR explaining:

**What Changed:**
```
Code Changes Summary

The following modifications were made to fix the issue:

1. src/components/Button.js
   - Added useTheme hook import
   - Added theme state tracking
   - Updated button element with data-theme attribute
   - Component now reactive to theme changes

2. src/styles/theme.css
   - Added CSS custom properties for colors
   - Variables update on :root[data-theme] selector
   - Supports light/dark themes seamlessly

3. src/hooks/useTheme.js
   - New hook for theme context access
   - Returns current theme and toggle function
   - Listens to theme provider changes
```

**Why These Changes:**
```
Explanation of Solution

The original issue occurred because button colors were
hardcoded in CSS rather than using variables. This meant
changes to the theme provider didn't automatically update
button colors.

The fix uses CSS custom properties (variables) which can
be updated reactively. When the theme context changes,
the :root data-theme attribute updates, and CSS variables
automatically update button colors.

This approach is:
✅ Performant (no re-renders needed)
✅ Maintainable (clear variable structure)
✅ Scalable (works for any component)
```

**How It Works:**
```
Architecture Explanation

1. User clicks theme toggle button
2. ThemeProvider updates theme state
3. Data-theme attribute on :root element changes
4. CSS media query / selector updates
5. Button colors change via CSS variables
6. No JavaScript re-renders needed

This ensures instant visual feedback with no lag.
```

### Step 18: Responding to Code Review

When maintainers review your PR, you may get feedback:

#### Example Review Comment
```
@maintainer suggested changes

- The CSS variable naming could be more consistent
- Consider using BEM naming for the data attribute
- Add a comment explaining the theme switching logic
```

**How to Respond:**

1. **Make the requested changes**
   ```bash
   cd ~/contriflow-workspace/react
   # Edit the files based on feedback
   git add .
   git commit -m "Address code review feedback"
   git push origin fix/button-colors-25432
   ```

2. **Reply to the review**
   ```
   Thanks for the feedback! I've made the following changes:
   
   - ✅ Updated CSS variable naming to be more consistent
   - ✅ Changed data attribute to use BEM naming
   - ✅ Added explanatory comments
   
   Please review the changes!
   ```

3. **Your commit automatically updates the PR**
   - New commits are added to the same PR
   - Reviewers see the updated code
   - Conversation stays in one place

### Step 19: PR Merged! 🎉

Once approved and merged:

```
✅ Pull Request Merged!

Your contribution has been merged into facebook/react
Your fix is now part of the main project!

📊 Contribution Stats:
   - Files Changed: 3
   - Lines Added: 25
   - Lines Deleted: 5
   - Tests Added: 3
   - Issue Closed: #25432

🏆 Achievement Unlocked:
   "First Contributor" badge earned!
   
```

---

## Tracking Your Contributions

### Step 20: View Your Contribution Stats

ContriFlow tracks your contributions locally and displays them in a beautiful dashboard.

#### View Dashboard
```bash
contriflow dashboard
```

Output:
```
╔════════════════════════════════════════════════════╗
║          📊 CONTRIBUTION DASHBOARD                 ║
╚════════════════════════════════════════════════════╝

📈 STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Contributions:     5
  Pull Requests Created:   3
  Issues Solved:          5
  Current Streak:         5 days 🔥
  Longest Streak:        15 days
  Level:                  1 (50 XP needed for level 2)
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 BADGES EARNED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⭐ First Contribution       (1/1)  ✓
  🔥 Week Warrior (7-day streak)  ✓
  💪 Contributing Force       (5 PRs)  ✓
  🌟 Issue Master             (10 issues)  ⏳
  👑 Level 5 Master           (50 XP)  ⏳

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 TODAY'S PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Daily Goal: 3 issues
  Solved Today: 2 issues
  Progress: ████████░░ 67%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RECENT CONTRIBUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. facebook/react #25432     ✓ Merged
     "Fix button colors on theme change"
  
  2. vuejs/vue #18234          ✓ Merged
     "Add missing TypeScript types"
  
  3. angular/angular #15432    ✓ Open
     "Update deprecated API usage"
```

#### View Contribute Mode (Find Daily Issues)
```bash
contriflow contribute --daily
```

This suggests 3 beginner-friendly issues to solve today based on trending repositories.

Output:
```
🎮 CONTRIBUTE MODE - DAILY CHALLENGE

📌 TODAY'S SUGGESTED ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue 1: facebook/react #25432
  Title: Fix button colors not updating on theme change
  Level: Beginner
  Stars: ⭐⭐⭐⭐⭐ (195k)

Issue 2: vuejs/vue #18234
  Title: Add missing TypeScript definitions
  Level: Beginner
  Stars: ⭐⭐⭐⭐ (195k)

Issue 3: angular/angular #15432
  Title: Update deprecated API usage
  Level: Intermediate
  Stars: ⭐⭐⭐⭐⭐ (80k)

Ready to start? Pick an issue number and run:
contriflow solve <issue-number> <owner/repo>
```

---

## Complete Workflow Summary

Here's the complete journey from zero to merged PR:

### Quick Reference: Full Workflow

```bash
# 1️⃣ LOGIN
contriflow login

# 2️⃣ SEARCH FOR PROJECTS
contriflow search --keyword react --stars 5000

# 3️⃣ FIND ISSUES
contriflow issues facebook/react --label good-first-issue

# 4️⃣ READ GUIDELINES
contriflow guide facebook/react

# 5️⃣ FORK REPO
contriflow fork facebook/react

# 6️⃣ CLONE REPO
contriflow clone facebook/react

# 7️⃣ SOLVE ISSUE WITH AI
contriflow solve 25432 facebook/react

# 8️⃣ NAVIGATE TO REPO
cd ~/contriflow-workspace/react

# 9️⃣ CREATE BRANCH & TEST LOCALLY
git checkout -b fix/button-colors-theme
npm test
npm start
# Test manually...

# 🔟 COMMIT CHANGES
git add .
git commit -m "Fix: Update button colors to react to theme changes

- Modified Button component to use CSS variables
- Added useTheme hook for reactive theme updates
- Updated theme.css with proper variable definitions
- All tests passing

Fixes #25432"

# 1️⃣1️⃣ PUSH CHANGES
git push origin fix/button-colors-theme

# 1️⃣2️⃣ CREATE PR
contriflow pr 25432 facebook/react

# 1️⃣3️⃣ RESPOND TO FEEDBACK (if needed)
# Make changes locally
git add .
git commit -m "Address code review feedback"
git push origin fix/button-colors-theme

# 1️⃣4️⃣ VIEW STATS
contriflow dashboard
```

---

## Tips & Tricks

### 🎯 Finding Good First Issues

**Search strategies:**
```bash
# For JavaScript learners
contriflow search --keyword javascript --stars 1000

# For Python developers
contriflow search --keyword python --stars 500

# For web developers
contriflow search --keyword react vue angular --stars 5000

# For DevOps/Backend
contriflow search --keyword kubernetes docker --stars 2000
```

### 🤖 Using AI Effectively

**What AI is good at:**
- ✅ Suggesting architecture changes
- ✅ Identifying bugs and root causes
- ✅ Proposing code improvements
- ✅ Writing explanatory comments
- ✅ Generating test cases

**What AI might miss:**
- ⚠️ Project-specific conventions
- ⚠️ Complex business logic
- ⚠️ Performance edge cases
- ⚠️ Security implications

**Best practice:**
```bash
# Always review AI suggestions
contriflow solve 123 owner/repo

# Edit if needed
vim ~/.contriflow/patches/123.patch

# Test thoroughly before submitting
npm test && npm start
```

### ⏭️ Multiple Issues in One Day

```bash
# Solve multiple issues for the same repo
contriflow solve 123 facebook/react   # Issue 1
contriflow solve 456 facebook/react   # Issue 2
contriflow solve 789 facebook/react   # Issue 3

# Each gets its own patch file
# Create separate branches for each PR
git checkout -b fix/issue-123
git checkout -b fix/issue-456
git checkout -b fix/issue-789
```

### 📈 Building a Streak

```bash
# View your streak
contriflow dashboard

# Contribute daily to maintain streak
contriflow contribute --daily

# Track daily progress
contriflow dashboard --mode streaks
```

### 🔍 Debugging If Something Goes Wrong

```bash
# Check your authentication
contriflow login

# Verify repository is cloned correctly
cd ~/contriflow-workspace/react
git status

# Check if tests are passing
npm test

# Review the AI patch
cat ~/.contriflow/patches/25432.patch

# See available commands
contriflow --help
```

---

## Common Scenarios

### Scenario 1: Documentation Issue

**Issue:** Update outdated API documentation

```bash
# 1. Find the issue
contriflow issues facebook/react --label documentation

# 2. Read guidelines
contriflow guide facebook/react

# 3. Solve with AI
contriflow solve 25432 facebook/react
# AI might suggest: update code examples, fix descriptions

# 4. Test locally
npm test  # Docs build test
npm run build:docs

# 5. Create PR
contriflow pr 25432 facebook/react
```

### Scenario 2: Bug Fix

**Issue:** Fix a reported bug

```bash
# 1. Understand the bug
contriflow guide facebook/react
contriflow issues facebook/react --label bug

# 2. Let AI analyze
contriflow solve 25432 facebook/react
# AI suggests: identify root cause, propose fix

# 3. Test the fix
npm test
npm start
# Manually reproduce the bug
# Verify fix works

# 4. Submit PR
contriflow pr 25432 facebook/react
```

### Scenario 3: Feature Request

**Issue:** Implement a small feature

```bash
# 1. Find feature request
contriflow issues facebook/react --label enhancement

# 2. Understand requirements
contriflow guide facebook/react

# 3. Get AI suggestions
contriflow solve 25432 facebook/react
# AI suggests implementation approach

# 4. Implement & test
npm test
npm start

# 5. Create PR with detailed explanation
contriflow pr 25432 facebook/react
```

---

## Troubleshooting

### Problem: Authentication Failed
```bash
# Solution: Re-authenticate with a new token
contriflow login

# Verify token has necessary permissions:
# - repo
# - read:user
# - user:email
# - workflow
```

### Problem: Clone Failed
```bash
# Check if git is installed
git --version

# Check internet connection
ping github.com

# Try manual clone
git clone https://github.com/your-username/react.git
```

### Problem: Tests Failing
```bash
# Install dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --verbose
```

### Problem: AI Patch Won't Apply
```bash
# Review the patch
cat ~/.contriflow/patches/25432.patch

# Edit manually if needed
vim ~/.contriflow/patches/25432.patch

# Try applying again
git apply ~/.contriflow/patches/25432.patch

# Or make changes manually in your editor
```

### Problem: PR Not Appearing
```bash
# Verify your push was successful
git log
git remote -v

# Push again if needed
git push origin fix/button-colors-theme

# Check GitHub to see if branch exists
```

---

## Next Steps After First PR

### 1. Continue Contributing
```bash
# Find more issues
contriflow contribute --daily

# Solve them
contriflow solve <issue> <repo>

# Create PRs
contriflow pr <issue> <repo>
```

### 2. Build Your Portfolio
```bash
# Track your contributions
contriflow dashboard

# Watch your stats grow
# Share PRs on social media
# Build reputation in open-source
```

### 3. Become a Maintainer
After several successful contributions:
- Maintainers may invite you to the team
- Help review other PRs
- Guide new contributors
- Shape the project's future

### 4. Contribute to More Projects
```bash
# Explore different projects
contriflow search --keyword <any-tech>

# Build diverse skills
# Help multiple communities
# Grow your GitHub profile
```

---

## Resources

### External Resources
- **GitHub Docs**: https://docs.github.com
- **Git Tutorial**: https://git-scm.com/book/en/v2
- **Open Source Guide**: https://opensource.guide
- **How to Contribute**: https://guides.github.com/activities/contributing-to-open-source/

### ContriFlow Resources
- **README.md** - Complete feature overview
- **TESTING_GUIDE.md** - How tests work
- **ARCHITECTURE.md** - System design
- **Individual Guides** - For each command

---

## Summary

You now know how to:

✅ Install and authenticate ContriFlow CLI
✅ Search for repositories to contribute to
✅ Find beginner-friendly issues
✅ Set up your local development environment
✅ Use AI to analyze and solve issues
✅ Test solutions locally
✅ Create professional pull requests
✅ Respond to code review feedback
✅ Track your contributions and build streaks
✅ Become an open-source contributor

---

## Getting Help

**Still stuck?**
```bash
# Get help for any command
contriflow --help
contriflow <command> --help

# Common commands
contriflow login --help
contriflow search --help
contriflow issues --help
contriflow solve --help
contriflow pr --help
```

---

**Happy Contributing! 🚀**

Start with `contriflow login` and begin your open-source journey today!

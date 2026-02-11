# ContriFlow Issues Command - Enhanced Guide

## Overview

The `contriflow issues` command has been enhanced to support both global issue search and repository-specific issue listing. It now fetches issues with detailed information and displays them in formatted tables or lists.

## Usage Modes

### Mode 1: Global Issue Search (No Repository)

Search for beginner-friendly issues across GitHub:

```bash
contriflow issues
```

This searches for issues globally with default filter `good-first-issue`.

### Mode 2: Repository-Specific Issues

List all issues in a specific repository:

```bash
contriflow issues <owner>/<repo>
```

Examples:
```bash
contriflow issues facebook/react
contriflow issues nodejs/node
contriflow issues torvalds/linux
```

## Command Signature

```bash
contriflow issues [repo] [options]

Arguments:
  [repo]                    Repository in format owner/repo (optional)

Options:
  -l, --label <label>       Issue label to filter by
  --language <language>     Filter by programming language (global search only)
  --min-stars <number>      Minimum stars (global search only, default: 10)
  --max-stars <number>      Maximum stars (global search only, default: 50000)
  -p, --per-page <number>   Results per page (default: 10)
  --state <state>           Issue state: open, closed, all (default: open)
  -t, --table               Display in table format (default)
  --no-table                Display in list format
  --interactive             Show selection menu (default)
  --no-interactive          Skip selection menu
  -h, --help                Show help message
```

## Usage Examples

### Global Search Examples

#### Basic Global Search

```bash
$ contriflow issues
```

Searches for issues with `good-first-issue` label across all repositories.

#### Global Search with Label Filter

```bash
$ contriflow issues --label help-wanted
```

Search for `help-wanted` labeled issues globally.

#### Global Search with Language Filter

```bash
$ contriflow issues --language python --label good-first-issue
```

Search for beginner-friendly issues in Python projects.

#### Global Search with Star Range

```bash
$ contriflow issues --min-stars 100 --max-stars 10000
```

Search for issues in projects with 100-10000 stars.

### Repository-Specific Examples

#### List All Open Issues

```bash
$ contriflow issues facebook/react
```

Lists all open issues in the React repository.

#### List Issues with Specific Label

```bash
$ contriflow issues nodejs/node --label bug
```

List issues labeled as `bug` in Node.js repository.

#### List Closed Issues

```bash
$ contriflow issues kubernetes/kubernetes --state closed
```

List closed issues in Kubernetes.

#### List All Issues (Open and Closed)

```bash
$ contriflow issues torvalds/linux --state all
```

List all issues (both open and closed) in Linux.

#### Non-Interactive Mode

```bash
$ contriflow issues facebook/react --no-interactive
```

Show issues without interactive selection (good for automation).

#### List Format

```bash
$ contriflow issues nodejs/node --no-table
```

Display issues in detailed list format instead of table.

### Combined Examples

```bash
# Show specific number of results
contriflow issues facebook/react --per-page 20

# List with pagination
contriflow issues google/go-cloud --label feature-request --state all -p 15

# Python projects with help-wanted issues
contriflow issues --language python --label help-wanted --min-stars 500

# Non-interactive automation
contriflow issues angular/angular --label bug --no-interactive --table
```

## Display Formats

### Table Format (Default)

#### Global Search Table

```
───────────────────────────────────────────────────────
Search Results (Table View)
───────────────────────────────────────────────────────

# | Number | Title                     | Repository        | Labels
──┼────────┼───────────────────────────┼───────────────────┼──────────────────
1 | #12345 | Fix broken link           | facebook/react    | good-first-issue
2 | #12346 | Add missing documentation | angular/angular   | help-wanted
3 | #12347 | Update dependencies       | vuejs/vue         | good-first-issue
```

#### Repository-Specific Table

```
───────────────────────────────────────────────────────
Issues (Table View)
───────────────────────────────────────────────────────

# | Number | Title                   | Author    | Labels              | State
──┼────────┼─────────────────────────┼───────────┼─────────────────────┼───────
1 | #1234  | Button styling issue    | user1     | bug help-wanted     | open
2 | #1235  | Implement new feature   | user2     | feature-request     | open
3 | #1236  | Fix typo in docs        | user3     | documentation       | open
```

### List Format

#### Global Search List

```
───────────────────────────────────────────────────────
Search Results (List View)
───────────────────────────────────────────────────────

1. #12345 Fix broken link
   good-first-issue 
   Repository: facebook/react
   https://github.com/facebook/react/issues/12345

2. #12346 Add missing documentation
   help-wanted 
   Repository: angular/angular
   https://github.com/angular/angular/issues/12346
```

#### Repository-Specific List

```
───────────────────────────────────────────────────────
Issues (List View)
───────────────────────────────────────────────────────

1. #1234 Button styling issue
   bug help-wanted
   Author: user1 | State: open
   https://github.com/facebook/react/issues/1234

2. #1235 Implement new feature
   feature-request
   Author: user2 | State: open
   https://github.com/facebook/react/issues/1235
```

## Interactive Selection

When running in interactive mode (default), after viewing results you can select an issue:

```bash
$ contriflow issues facebook/react

[Shows table of issues]

? Select an issue to view details:
❯ #1234 Button styling issue
  #1235 Implement new feature
  #1236 Fix typo in docs
```

After selection, you see:

```
─────────────────────────────────────────────────────
Issue Details
─────────────────────────────────────────────────────
Title: Button styling issue
Number: #1234
Author: john_doe
State: open
Created: 2/11/2026
Labels:  bug  help-wanted
Comments: 3

Description:
The button styling is broken in the latest version...

View online: https://github.com/facebook/react/issues/1234

? Would you like to fork and work on this issue? (Y/n)
```

## Real-World Workflows

### Workflow 1: Find and Contribute to React Issues

```bash
# 1. List React repository issues
$ contriflow issues facebook/react --label good-first-issue

# 2. See issues in table format
# [select an issue]

# 3. Get suggested command
# Run: contriflow setup --repo facebook/react --issue 12345

# 4. Fork and start working
$ contriflow setup --repo facebook/react --issue 12345
```

### Workflow 2: Monitor Project Issues

```bash
# Check open bugs in Node.js
$ contriflow issues nodejs/node --label bug --state open --no-interactive

# Check feature requests
$ contriflow issues nodejs/node --label feature-request --state all
```

### Workflow 3: Find Beginner-Friendly Issues Globally

```bash
# Find beginner issues in popular Python projects
$ contriflow issues --language python --label good-first-issue --stars 1000 --no-interactive
```

### Workflow 4: Automated Issue Tracking

```bash
# Script to check all Kubernetes issues daily
#!/bin/bash
echo "=== Kubernetes Open Issues ==="
contriflow issues kubernetes/kubernetes --state open --per-page 5 --no-interactive

echo "=== Recent Bugs ==="
contriflow issues kubernetes/kubernetes --label bug --no-interactive
```

## Features Breakdown

### Global Search Features
- ✅ Search across all repositories
- ✅ Label filtering (default: good-first-issue)
- ✅ Language filtering
- ✅ Star range filtering (min/max)
- ✅ Interactive selection
- ✅ Colored output

### Repository-Specific Features
- ✅ List all repository issues
- ✅ Filter by label
- ✅ Filter by state (open, closed, all)
- ✅ Sort options (built-in to Octokit)
- ✅ Per-page results control
- ✅ Interactive selection
- ✅ Detailed issue information

### Display Options
- ✅ Table format (default)
- ✅ List format (detailed)
- ✅ Color-coded labels
- ✅ Issue state highlighting
- ✅ Author information
- ✅ Comment count
- ✅ Truncated descriptions

### Interaction Modes
- ✅ Interactive (shows selection menu)
- ✅ Non-interactive (direct output)
- ✅ Perfect for scripts/CI-CD

## Issue Fields Displayed

### In Table View
- **#**: Result number (1, 2, 3...)
- **Number**: GitHub issue number (#1234)
- **Title**: Issue title (truncated if needed)
- **Repository** (global) or **Author** (repo-specific)
- **Labels**: Issue labels (up to 2 shown)
- **State** (repo-specific): open/closed status

### In List View
- Issue number and title
- All labels
- Author (repo-specific)
- State (repo-specific)
- URL to GitHub issue
- Repository (global search)

### In Detail View
- Title
- Number
- Author
- State
- Creation date
- All labels
- Full description
- Comment count
- GitHub URL

## State Options

```bash
--state open      # Only open issues (default)
--state closed    # Only closed issues
--state all       # Both open and closed
```

Examples:
```bash
contriflow issues react --state closed     # Closed issues
contriflow issues node --state all         # All issues
contriflow issues angular --state open     # Open issues (default)
```

## Label Filtering

### Global Search (Requires Label)
```bash
contriflow issues                          # Uses good-first-issue (default)
contriflow issues --label help-wanted      # Search for help-wanted
contriflow issues --label bug              # Search for bug issues
```

### Repository-Specific (Optional)
```bash
contriflow issues facebook/react           # All issues
contriflow issues react --label good-first-issue  # Filtered by label
contriflow issues react --label bug        # Show only bug issues
```

## Performance Tips

### 1. Use Repository-Specific Search When Possible
```bash
# Faster - targets specific repo
contriflow issues facebook/react --label bug

# Slower - searches all repos
contriflow issues --language javascript --label bug
```

### 2. Limit Results
```bash
# Better - shows first 10
contriflow issues nodejs/node -p 10

# Worse - loads all
contriflow issues nodejs/node -p 100
```

### 3. Use Non-Interactive for Automation
```bash
# Better - no waiting for selection
contriflow issues react --no-interactive

# Worse - waits for user input
contriflow issues react
```

## Integration with Other Commands

### Search → Issues → Setup

```bash
# 1. Search repositories
$ contriflow search react

# 2. View issues in selected repo
$ contriflow issues facebook/react

# 3. Select and fork
$ contriflow setup --repo facebook/react --issue 12345
```

### Global Issues → Repository

```bash
# Find global beginner issues
$ contriflow issues --label good-first-issue

# Follow up on specific repository
$ contriflow issues facebook/react
```

## Troubleshooting

### "No issues found"

**Causes:**
- Repository has no issues with that label
- All issues are closed
- Label doesn't exist

**Solutions:**
```bash
# Try different label
contriflow issues react --label enhancement

# Include closed issues
contriflow issues react --state all

# Check label exists
contriflow issues react
```

### "Invalid repository format"

**Fix:**
```bash
# Correct
contriflow issues facebook/react

# Wrong
contriflow issues react
contriflow issues facebook-react
```

### API Rate Limit

**Solution:**
```bash
# Login to increase limits
contriflow login

# Then retry
contriflow issues react
```

## Command Comparison

| Use Case | Command |
|----------|---------|
| Find beginner issues globally | `contriflow issues` |
| Find issues in specific repo | `contriflow issues owner/repo` |
| Find issues by label | `contriflow issues --label` |
| Track project issues | `contriflow issues owner/repo --state all` |
| Automate issue checking | `contriflow issues owner/repo --no-interactive` |

## Advanced Patterns

### Pattern 1: Monitor Multiple Repositories

```bash
#!/bin/bash
repos=("facebook/react" "angular/angular" "vuejs/vue")

for repo in "${repos[@]}"; do
  echo "=== Issues in $repo ==="
  contriflow issues "$repo" --label bug --no-interactive --per-page 5
done
```

### Pattern 2: Find High-Priority Issues

```bash
contriflow issues kubernetes/kubernetes \
  --label priority/critical \
  --state open \
  --no-interactive
```

### Pattern 3: Trending Issues

```bash
contriflow issues --language typescript \
  --min-stars 5000 \
  --label good-first-issue \
  --per-page 10
```

## Getting Help

```bash
# Command help
contriflow issues --help

# Main help
contriflow --help

# Interactive exploration
contriflow issues  # Will show prompts
```

## Related Commands

- `contriflow search` - Find repositories
- `contriflow setup` - Fork and clone repository
- `contriflow contribute` - Track contributions
- `contriflow pr` - Create pull requests

---

**The issues command makes discovering and tracking GitHub issues easy!** 🚀

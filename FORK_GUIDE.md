# ContriFlow Fork Command - User Guide

## Overview

The `contriflow fork` command allows you to easily fork any public GitHub repository to your own account with a single command. It handles the forking process and provides options to automatically clone the repository for local development.

## Prerequisites

- GitHub account with personal access token
- Logged in with `contriflow login`
- Target repository exists and is publicly accessible

## Command Syntax

```bash
contriflow fork [repo] [options]

Arguments:
  [repo]  Repository in format owner/repo (optional, will prompt if not provided)

Options:
  -c, --clone       Automatically clone the forked repository to workspace
  --no-interactive  Skip confirmation prompts
  -h, --help        Display help information
```

## Basic Usage

### Simple Fork

Fork a repository with confirmation prompt:

```bash
$ contriflow fork facebook/react
```

**Output:**
```
─────────────────────────────────────────────────
Fork Repository
─────────────────────────────────────────────────

✓ Found: facebook/react

─────────────────────────────────────────────────
Repository Information
─────────────────────────────────────────────────

Property  | Value
──────────┼────────────────────────────
Name      | facebook/react
Stars     | 215000
Language  | JavaScript
URL       | https://github.com/facebook/react
Forks     | 45000

? Fork facebook/react to your account? (Y/n)
```

### Fork Without Interactive Prompts

```bash
$ contriflow fork facebook/react --no-interactive
```

Skips confirmation prompts and proceeds directly with forking.

### Fork and Auto-Clone

```bash
$ contriflow fork facebook/react --clone
```

Forks the repository and automatically clones it to your workspace (equivalent to running `contriflow setup --repo your-username/react`).

### Interactive Repo Selection

```bash
$ contriflow fork
```

Prompts you to enter the repository name:

```
? Enter repository to fork (format: owner/repo): facebook/react
```

## Usage Examples

### Example 1: Fork React Repository

```bash
$ contriflow fork facebook/react

✓ Found: facebook/react

[Repository Information displayed]

? Fork facebook/react to your account? (Y/n) Y

✓ Successfully forked to your-username/react

[Fork Result displayed]

? Clone the forked repository to your workspace? (Y/n) Y

✓ Fork complete! You can now start contributing.
```

### Example 2: Fork Multiple Repositories

```bash
# Fork React
contriflow fork facebook/react --no-interactive

# Fork Angular
contriflow fork angular/angular --no-interactive

# Fork Vue
contriflow fork vuejs/vue --no-interactive
```

### Example 3: Fork and Immediately Start Working

```bash
$ contriflow fork nodejs/node --clone

✓ Successfully forked to your-username/node

[Fork Result displayed]

✓ Fork complete! You can now start contributing.
```

### Example 4: Fork for Specific Issue

```bash
# Fork the repository
contriflow fork facebook/react

# Then set up with issue
contriflow setup --repo your-username/react --issue 12345
```

### Example 5: Batch Forking Script

```bash
#!/bin/bash

# Fork multiple repositories
repos=(
  "facebook/react"
  "angular/angular"
  "vuejs/vue"
  "django/django"
  "rails/rails"
)

for repo in "${repos[@]}"; do
  echo "Forking $repo..."
  contriflow fork "$repo" --no-interactive
  sleep 2  # Wait between requests
done

echo "All repositories forked!"
```

## Repository Information Display

When you fork a repository, the command shows:

### Table Format
```
Property  | Value
──────────┼────────────────────────────
Name      | facebook/react
Stars     | 215000
Language  | JavaScript
URL       | https://github.com/facebook/react
Forks     | 45000
```

### Fork Result
```
Property      | Value
──────────────┼────────────────────────────
Forked Repo   | your-username/react
Clone URL     | https://github.com/your-username/react.git
```

## Workflow Integration

### Workflow 1: Search → Fork → Contribute

```bash
# 1. Search for repositories
contriflow search react --stars 1000

# 2. Select and fork a repository
contriflow fork facebook/react --clone

# 3. Find issues to work on
contriflow issues your-username/react

# 4. Start contributing
contriflow contribute --language JavaScript
```

### Workflow 2: Issues → Fork → Setup

```bash
# 1. Find beginner-friendly issues
contriflow issues --label good-first-issue

# 2. Fork the repository
contriflow fork facebook/react

# 3. Setup for contribution with issue number
contriflow setup --repo your-username/react --issue 12345
```

### Workflow 3: Direct Fork and Setup

```bash
# Fork and clone in one step
contriflow fork facebook/react --clone

# Equivalent to:
# contriflow setup --repo your-username/react
```

## Features

✅ **Easy Forking**
- Simple command-line interface
- Clear confirmation prompts
- Instant feedback on fork status

✅ **Multiple Input Methods**
- Positional argument: `contriflow fork facebook/react`
- Interactive prompt: `contriflow fork`
- Non-interactive: `contriflow fork facebook/react --no-interactive`

✅ **Repository Information**
- Shows repository details before forking
- Displays stars, language, forks count
- Link to original repository

✅ **Smart Cloning**
- Optional automatic clone with `--clone` flag
- Works with workspace management
- Suggests manual clone commands if skipped

✅ **Error Handling**
- Validates repository format
- Checks if repository exists
- Handles already-forked repositories gracefully
- Clear error messages

✅ **Integration**
- Works with `contriflow setup`
- Works with `contriflow issues`
- Works with `contriflow contribute`
- Seamless workflow chaining

## Common Scenarios

### Scenario 1: Contributing to React

```bash
# Discover React repository
contriflow search react --stars 10000

# Fork it
contriflow fork facebook/react --clone

# Find issues
contriflow issues your-username/react

# Start contributing
contriflow contribute --language JavaScript
```

### Scenario 2: First-Time Contribution

```bash
# Login
contriflow login

# Find beginner issues globally
contriflow issues --label good-first-issue --no-interactive

# Fork a repository
contriflow fork facebook/react --clone

# Setup and start working
contriflow setup --repo your-username/react --issue 12345
```

### Scenario 3: Maintain Multiple Forks

```bash
# Fork several repositories
for repo in "facebook/react" "angular/angular" "vuejs/vue"; do
  contriflow fork "$repo" --no-interactive
done

# List your forks
contriflow search your-username

# Work on each
contriflow issues your-username/react
contriflow issues your-username/angular
contriflow issues your-username/vue
```

## Options in Detail

### `-c, --clone`

Automatically clone the forked repository to your ContriFlow workspace after forking.

```bash
# With clone flag
contriflow fork facebook/react --clone

# Without - just forks, doesn't clone
contriflow fork facebook/react
```

**When to use:**
- When you want immediate local access
- For quick contribution workflow
- When workspace management is needed

**When not to use:**
- When just organizing multiple forks
- When planning to fork many repositories
- When storage space is limited

### `--no-interactive`

Skips all confirmation prompts and proceeds with forking directly. Useful for automation and scripts.

```bash
# Interactive (default)
contriflow fork facebook/react
# Prompts: Fork facebook/react to your account? (Y/n)

# Non-interactive
contriflow fork facebook/react --no-interactive
# Proceeds without prompting
```

**When to use:**
- In CI/CD pipelines
- In batch fork scripts
- For automation
- When fork is already confirmed

**When not to use:**
- First-time use
- When unsure about forking
- When you want to review details

## Error Handling

### Repository Not Found

```bash
$ contriflow fork invalid/repo

❌ Repository not found: invalid/repo
```

**Solution:**
- Verify the repository name
- Check the owner username
- Try searching first: `contriflow search angular`

### Invalid Format

```bash
$ contriflow fork react

❌ Invalid repository format. Use format: owner/repo
Example: facebook/react
```

**Solution:**
- Use format: `owner/repo`
- Correct example: `contriflow fork facebook/react`

### Already Forked

```bash
$ contriflow fork facebook/react

⚠ Repository already forked to your account
```

**Solution:**
- The fork already exists
- You can proceed with setup: `contriflow setup --repo your-username/react`
- Or use clone option for workspace management

### Authentication Required

```bash
❌ GitHub token not found. Run: contriflow auth
```

**Solution:**
- Login first: `contriflow login`
- Or provide token: `contriflow login --token ghp_xxxxx`

### API Rate Limit

```bash
❌ Fork failed: API rate limit exceeded
```

**Solution:**
- Wait a few minutes
- Login to increase limits: `contriflow login`
- Unauthenticated: 60 requests/hour
- Authenticated: 5000 requests/hour

## Next Steps After Forking

### Option 1: Using contriflow setup

```bash
contriflow setup --repo your-username/react --issue 12345
```

Automatically clones and configures the repository.

### Option 2: Using contriflow contribute

```bash
contriflow contribute --language JavaScript
```

Enters gamified contribution mode with streak tracking.

### Option 3: Manual git commands

```bash
git clone https://github.com/your-username/react.git
cd react
git remote add upstream https://github.com/facebook/react.git
git fetch upstream
```

### Option 4: Using contriflow issues

```bash
contriflow issues your-username/react
```

Find issues in your fork to work on.

## Tips and Best Practices

### Tip 1: Fork Before Long-Lived Work

```bash
# Fork first
contriflow fork facebook/react --clone

# Then start long-term work
contriflow setup --repo your-username/react
```

### Tip 2: Batch Fork Related Projects

```bash
# Fork multiple related projects
contriflow fork facebook/react --no-interactive
contriflow fork facebook/create-react-app --no-interactive
contriflow fork facebook/react-native --no-interactive
```

### Tip 3: Use Without Clone, Clone Later

```bash
# Just fork
contriflow fork facebook/react --no-interactive

# Clone later with setup
contriflow setup --repo your-username/react
```

### Tip 4: Check Your Forks

```bash
# See all your forks
contriflow search your-username

# Or on GitHub
# https://github.com/your-username?tab=repositories
```

### Tip 5: Keep Forks Updated

```bash
# In your fork directory
git fetch upstream
git merge upstream/main
git push origin main
```

## Troubleshooting

### Q: Can I rename my fork?
**A:** Currently, rename happens on GitHub directly. After renaming, update setup commands with the new name.

### Q: What if fork already exists?
**A:** The command detects this and shows a warning. You can proceed with setup: `contriflow setup --repo your-username/repo`

### Q: Can I fork private repositories?
**A:** Only if you have access to them. The fork must be public or you must have permission.

### Q: How do I delete a fork?
**A:** Use GitHub.com settings or GitHub CLI:
```bash
gh repo delete your-username/repo
```

### Q: Can I fork multiple times?
**A:** GitHub allows only one fork per repository per user. Try using a different account or organization.

## Command Chaining Examples

### Example 1: Complete Contribution Flow

```bash
contriflow search react && contriflow fork facebook/react --clone && \
contriflow issues your-username/react && contriflow contribute
```

### Example 2: Setup and Start

```bash
contriflow fork nodejs/node --clone && \
contriflow setup --repo your-username/node
```

### Example 3: Batch with Delay

```bash
for repo in "facebook/react" "angular/angular" "vuejs/vue"; do
  contriflow fork "$repo" --no-interactive && sleep 2
done
```

## Integration with Other Commands

| Command | Usage |
|---------|-------|
| `contriflow search` | Find repos to fork |
| `contriflow fork` | Fork the repository |
| `contriflow setup` | Clone and configure |
| `contriflow issues` | Find work to do |
| `contriflow contribute` | Track contributions |
| `contriflow pr` | Create pull requests |

## Related Commands

- **`contriflow search`** - Find repositories to fork
- **`contriflow setup`** - Setup forked repository with cloning
- **`contriflow issues`** - Find issues in repository
- **`contriflow login`** - Authenticate with GitHub

## Getting Help

```bash
# See fork command help
contriflow fork --help

# See main help
contriflow --help

# List all commands
contriflow

# Get help for specific command
contriflow help fork
```

## Summary

The `contriflow fork` command makes it simple to:
- ✅ Fork repositories with a single command
- ✅ Review repository details before forking
- ✅ Automatically clone if needed
- ✅ Integrate with other ContriFlow commands
- ✅ Automate batch forking
- ✅ Handle errors gracefully

**Fork repositories with confidence!** 🍴

---

**Fork Command Status:** ✅ Production Ready
**Last Updated:** February 11, 2026
**Documentation:** Complete with 40+ usage examples

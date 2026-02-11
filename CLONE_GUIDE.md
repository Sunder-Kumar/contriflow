# ContriFlow Clone Command - User Guide

## Overview

The `contriflow clone` command allows you to easily clone any GitHub repository to your workspace directory using git. It integrates seamlessly with the fork and setup commands for a complete contribution workflow.

## Prerequisites

- GitHub repository (public or accessible to you)
- Git installed locally
- Optional: GitHub token for private repositories

## Command Syntax

```bash
contriflow clone [repo] [options]

Arguments:
  [repo]  Repository in format owner/repo (optional, will prompt if not provided)

Options:
  -a, --add-upstream     Automatically add upstream remote (for forks)
  -d, --directory <dir>  Custom directory for cloning (default: ~/.contriflow/workspace)
  --no-interactive       Skip confirmation prompts
  -h, --help             Display help information
```

## Basic Usage

### Simple Clone

Clone a repository to the default workspace:

```bash
$ contriflow clone facebook/react
```

**Output:**
```
─────────────────────────────────────────────────
Clone Repository
─────────────────────────────────────────────────

✓ Found: facebook/react

─────────────────────────────────────────────────
Repository Information
─────────────────────────────────────────────────

Property     | Value
─────────────┼────────────────────────────
Name         | facebook/react
Stars        | 215000
Language     | JavaScript
URL          | https://github.com/facebook/react
Clone URL    | https://github.com/facebook/react.git

? Clone facebook/react to ~/.contriflow/workspace/react? (Y/n)
```

### Non-Interactive Clone

```bash
$ contriflow clone facebook/react --no-interactive
```

Skips confirmation and proceeds directly with cloning.

### Clone to Custom Directory

```bash
$ contriflow clone facebook/react --directory ~/my-projects/react
```

Clones to specified directory instead of default workspace.

### Clone with Upstream Remote

```bash
$ contriflow clone facebook/react --add-upstream
```

Automatically adds upstream remote, useful for forked repositories:
- Origin: your fork
- Upstream: original repository

### Interactive Repo Selection

```bash
$ contriflow clone
```

Prompts you to enter the repository name:

```
? Enter repository to clone (format: owner/repo): facebook/react
```

## Usage Examples

### Example 1: Clone React Repository

```bash
$ contriflow clone facebook/react

✓ Found: facebook/react

[Repository Information displayed]

? Clone facebook/react to ~/.contriflow/workspace/react? (Y/n) Y

✓ Successfully cloned to ~/.contriflow/workspace/react

[Clone Result displayed]

─────────────────────────────────────────────────
Next Steps
─────────────────────────────────────────────────

1. Navigate to repository:
   cd ~/.contriflow/workspace/react

2. View repository files:
   ls -la

3. Check current branch:
   git branch -a

4. Create a feature branch:
   git checkout -b feature/your-feature

5. Use ContriFlow to find issues:
   contriflow issues facebook/react

6. Create a Pull Request:
   contriflow pr --repo facebook/react --branch feature/your-feature

✓ Repository cloned successfully! Ready to start contributing.
```

### Example 2: Clone Multiple Repositories

```bash
# Clone React
contriflow clone facebook/react --no-interactive

# Clone Angular
contriflow clone angular/angular --no-interactive

# Clone Vue
contriflow clone vuejs/vue --no-interactive
```

### Example 3: Clone Your Fork with Upstream

```bash
# After forking
contriflow fork facebook/react --no-interactive

# Clone your fork with upstream
contriflow clone your-username/react --add-upstream

# Navigate and sync
cd ~/.contriflow/workspace/react
git fetch upstream
git merge upstream/main
```

### Example 4: Clone to Specific Project Directory

```bash
$ contriflow clone facebook/react --directory ~/projects/my-first-contribution

✓ Successfully cloned to ~/projects/my-first-contribution
```

### Example 5: Batch Clone Script

```bash
#!/bin/bash

# Clone multiple repositories to organized location
repos=(
  "facebook/react"
  "angular/angular"
  "vuejs/vue"
  "django/django"
  "rails/rails"
)

for repo in "${repos[@]}"; do
  echo "Cloning $repo..."
  contriflow clone "$repo" --directory ~/workspace/$repo --no-interactive
  sleep 2
done

echo "All repositories cloned!"
```

## Repository Information Display

When you clone a repository, the command shows:

### Repository Details Table
```
Property     | Value
─────────────┼────────────────────────────
Name         | facebook/react
Stars        | 215000
Language     | JavaScript
URL          | https://github.com/facebook/react
Clone URL    | https://github.com/facebook/react.git
```

### Clone Result Table
```
Property    | Value
────────────┼────────────────────────────
Repository  | facebook/react
Local Path  | ~/.contriflow/workspace/react
Clone URL   | https://github.com/facebook/react.git
```

## Workflow Integration

### Workflow 1: Fork → Clone → Contribute

```bash
# 1. Fork repository
contriflow fork facebook/react --no-interactive

# 2. Clone your fork
contriflow clone your-username/react --add-upstream

# 3. Navigate to repository
cd ~/.contriflow/workspace/react

# 4. Find issues to work on
contriflow issues your-username/react

# 5. Create a branch and start coding
git checkout -b feature/fix-issue-123
```

### Workflow 2: Search → Fork → Clone → Work

```bash
# 1. Search for repositories
contriflow search react --stars 1000

# 2. Fork selected repository
contriflow fork facebook/react

# 3. Clone your fork
contriflow clone your-username/react --add-upstream

# 4. Start working
cd ~/.contriflow/workspace/react
git checkout -b feature/new-feature
```

### Workflow 3: Clone Existing Fork

```bash
# If you already have a fork on GitHub
contriflow clone your-username/react --add-upstream

# Your fork is the origin, original is upstream
git fetch upstream
git merge upstream/main
```

### Workflow 4: Setup Alternative

Clone is an alternative to setup when you just need the code:

```bash
# Full setup (fork + clone + guidelines)
contriflow setup --repo facebook/react --issue 123

# Just clone (if already forked)
contriflow clone your-username/react --add-upstream
```

## Default Workspace Location

By default, repositories are cloned to:

```
~/.contriflow/workspace/
```

**On Different Systems:**
- **Linux/Mac:** `~/.contriflow/workspace/`
- **Windows:** `%USERPROFILE%\.contriflow\workspace\`

**Examples:**
```bash
# Linux/Mac
~/.contriflow/workspace/react
~/.contriflow/workspace/angular
~/.contriflow/workspace/vue

# Windows
C:\Users\YourUsername\.contriflow\workspace\react
C:\Users\YourUsername\.contriflow\workspace\angular
```

## Custom Directory Examples

### Project-Specific Organization

```bash
# Clone to specific project folder
contriflow clone facebook/react --directory ~/projects/web-dev/react

# Clone related projects together
contriflow clone facebook/react --directory ~/projects/web-dev/react
contriflow clone angular/angular --directory ~/projects/web-dev/angular
contriflow clone vuejs/vue --directory ~/projects/web-dev/vue
```

### Language-Specific Organization

```bash
# JavaScript projects
contriflow clone facebook/react --directory ~/code/javascript/react

# Python projects
contriflow clone django/django --directory ~/code/python/django

# Ruby projects
contriflow clone rails/rails --directory ~/code/ruby/rails
```

### User-Specific Organization

```bash
# Personal projects
contriflow clone facebook/react --directory ~/personal-projects/react

# Work projects
contriflow clone company/internal-lib --directory ~/work/internal-lib

# Learning projects
contriflow clone educational/algorithm-practice --directory ~/learning/algorithms
```

## Features

✅ **Easy Cloning**
- Simple command-line interface
- Format validation
- Progress feedback with spinners

✅ **Flexible Input**
- Positional argument: `contriflow clone facebook/react`
- Interactive prompt: `contriflow clone`
- Non-interactive: `contriflow clone facebook/react --no-interactive`

✅ **Repository Information**
- Shows repository details before cloning
- Displays stars, language count
- Shows clone URL
- Verifies repository exists

✅ **Upstream Management**
- Optional automatic upstream remote
- Useful for forked repositories
- Enables syncing with original repository

✅ **Directory Control**
- Default workspace: `~/.contriflow/workspace/`
- Custom directory: `--directory` option
- Automatic directory creation
- Conflict detection and handling

✅ **Git Integration**
- Uses standard git clone
- Compatible with all git operations
- Preserves repository history
- Ready for branching and commits

✅ **Error Handling**
- Validates repository format
- Checks if repository exists
- Detects existing directories
- Clear error messages

✅ **Workflow Integration**
- Works with `contriflow fork`
- Works with `contriflow setup`
- Works with `contriflow issues`
- Works with `contriflow pr`

## Common Scenarios

### Scenario 1: Contributing to React

```bash
# 1. Clone React repository
contriflow clone facebook/react

# 2. Navigate to repository
cd ~/.contriflow/workspace/react

# 3. Create feature branch
git checkout -b feature/fix-button-styling

# 4. Make changes
# ... edit files ...

# 5. Commit changes
git commit -m "Fix: improve button styling"

# 6. Create PR via ContriFlow
contriflow pr --repo facebook/react --branch feature/fix-button-styling
```

### Scenario 2: Working on Fork

```bash
# 1. Fork the original repository
contriflow fork facebook/react --no-interactive

# 2. Clone your fork with upstream
contriflow clone your-username/react --add-upstream

# 3. Navigate to repository
cd ~/.contriflow/workspace/react

# 4. Sync with upstream
git fetch upstream
git merge upstream/main

# 5. Create feature branch from updated main
git checkout -b feature/new-feature

# 6. Work and commit
# ... edit files ...
git commit -m "Feature: add new feature"

# 7. Push and create PR
git push origin feature/new-feature
contriflow pr --repo facebook/react --branch feature/new-feature
```

### Scenario 3: Batch Clone Multiple Repositories

```bash
# Clone multiple projects to organized location
for repo in "facebook/react" "angular/angular" "vuejs/vue"; do
  echo "Cloning $repo..."
  contriflow clone "$repo" --directory ~/projects/$repo --no-interactive
done

# Now all repos are organized
ls ~/projects/
# facebook/react
# angular/angular
# vuejs/vue
```

### Scenario 4: Learning and Practice

```bash
# Clone learning resources
contriflow clone --directory ~/learning/algorithms
# ... prompt for repo ...
# educational/data-structures-algorithms

cd ~/learning/algorithms
git log --oneline | head -10
git checkout -b test/exploring-code
```

## Options in Detail

### `-a, --add-upstream`

Automatically adds upstream remote after cloning. Useful for forks.

```bash
# Without upstream
contriflow clone facebook/react

# With upstream (for your fork)
contriflow clone your-username/react --add-upstream
```

**Result:**
```bash
# After cloning with --add-upstream:
git remote -v

origin    https://github.com/your-username/react.git (fetch)
origin    https://github.com/your-username/react.git (push)
upstream  https://github.com/facebook/react.git (fetch)
upstream  https://github.com/facebook/react.git (push)
```

**Use for:**
- Forked repositories
- Keeping in sync with original
- Contributing back to original

**When not needed:**
- Direct clone of original repo
- Personal projects
- Archives/learning repos

### `-d, --directory <dir>`

Specify custom directory for cloning.

```bash
# Default workspace
contriflow clone facebook/react

# Custom directory
contriflow clone facebook/react --directory ~/my-projects/react

# Absolute path
contriflow clone facebook/react --directory /home/user/projects/react

# Relative path
contriflow clone facebook/react --directory ./repositories/react
```

**Benefits:**
- Organize by project
- Organize by language
- Organize by purpose
- Custom workflows

### `--no-interactive`

Skip confirmation prompts and proceed directly.

```bash
# Interactive (default)
contriflow clone facebook/react
# Prompts: Clone facebook/react to [path]? (Y/n)

# Non-interactive
contriflow clone facebook/react --no-interactive
# Proceeds without prompting
```

**When to use:**
- CI/CD pipelines
- Automated scripts
- Batch operations
- When confirmed

## Error Handling

### Repository Not Found

```bash
$ contriflow clone invalid/repo

❌ Repository not found: invalid/repo
```

**Solution:**
- Verify repository name
- Check owner username
- Use search: `contriflow search react`

### Invalid Format

```bash
$ contriflow clone react

❌ Invalid repository format. Use format: owner/repo
```

**Solution:**
- Use: `owner/repo` format
- Example: `contriflow clone facebook/react`

### Directory Already Exists

```bash
$ contriflow clone facebook/react

❌ Directory already exists: ~/.contriflow/workspace/react
   Use --directory to specify a different location.
```

**Solution:**
- Remove existing directory
- Use different name: `--directory ~/other-path/react`
- Use setup without clone

### Git Not Installed

```bash
❌ Clone failed: git is not installed or not in PATH
```

**Solution:**
- Install git: https://git-scm.com/
- Verify: `git --version`

### Permission Denied

```bash
❌ Clone failed: Permission denied for directory
```

**Solution:**
- Check directory permissions
- Use different location
- Check workspace directory ownership

## Next Steps After Cloning

### Option 1: Navigate and Explore

```bash
cd ~/.contriflow/workspace/react
ls -la
git log --oneline | head -5
git branch -a
```

### Option 2: Create a Feature Branch

```bash
cd ~/.contriflow/workspace/react
git checkout -b feature/my-feature
```

### Option 3: Find Issues

```bash
contriflow issues facebook/react
```

### Option 4: Sync with Upstream (if applicable)

```bash
cd ~/.contriflow/workspace/react
git fetch upstream
git merge upstream/main
```

### Option 5: Create Pull Request

```bash
contriflow pr --repo facebook/react --branch feature/my-feature
```

## Tips and Best Practices

### Tip 1: Use Upstream for Forks

```bash
# Clone your fork with upstream
contriflow clone your-username/react --add-upstream

# Keep in sync
cd ~/.contriflow/workspace/react
git fetch upstream
git rebase upstream/main
```

### Tip 2: Organize by Language

```bash
# JavaScript projects
contriflow clone facebook/react --directory ~/code/js/react
contriflow clone angular/angular --directory ~/code/js/angular

# Python projects
contriflow clone django/django --directory ~/code/py/django
```

### Tip 3: Use Meaningful Names

```bash
# Good - descriptive
contriflow clone --directory ~/workspace/my-first-contribution

# Also good - organized
contriflow clone facebook/react --directory ~/github-contributions/react
```

### Tip 4: Batch Operations

```bash
# Clone multiple in sequence
for repo in "facebook/react" "angular/angular" "vuejs/vue"; do
  contriflow clone "$repo" --no-interactive --directory ~/workspace/$repo
done
```

### Tip 5: Document Your Forks

```bash
# Keep track of what you cloned
cat > ~/workspace/README.md <<EOF
# My GitHub Contributions

## Forked Repositories
- react (facebook/react)
- angular (angular/angular)
- vue (vuejs/vue)
EOF
```

## Troubleshooting

### Q: Where are cloned repositories stored?
**A:** Default: `~/.contriflow/workspace/`. Specify custom location with `--directory`.

### Q: Can I clone private repositories?
**A:** Yes, if you have access and authentication is configured with git.

### Q: How do I update a cloned repository?
**A:**
```bash
cd ~/.contriflow/workspace/react
git pull origin main
```

### Q: How do I sync with upstream?
**A:**
```bash
cd ~/.contriflow/workspace/react
git fetch upstream
git merge upstream/main
```

### Q: Can I clone to any directory?
**A:** Yes, use `--directory /path/to/clone`

### Q: What if clone fails?
**A:** Check git installation, permissions, and directory accessibility.

## Command Comparison

| Use Case | Command |
|----------|---------|
| Basic clone | `contriflow clone facebook/react` |
| Clone to custom dir | `contriflow clone facebook/react -d ~/my-dir` |
| Clone with upstream | `contriflow clone repo --add-upstream` |
| Non-interactive | `contriflow clone facebook/react --no-interactive` |
| Full setup | `contriflow setup --repo facebook/react` |

## Integration with Other Commands

| Command | Usage |
|---------|-------|
| `contriflow search` | Find repos to clone |
| `contriflow fork` | Fork, then clone |
| `contriflow clone` | Clone repository |
| `contriflow issues` | Find work in cloned repo |
| `contriflow pr` | Create PR from cloned code |

## Related Commands

- **`contriflow fork`** - Fork repository first
- **`contriflow setup`** - Fork, clone, and setup together
- **`contriflow issues`** - Find issues in cloned repository
- **`contriflow pr`** - Create pull requests from cloned code
- **`contriflow search`** - Find repositories to clone

## Getting Help

```bash
# See clone command help
contriflow clone --help

# See main help
contriflow --help

# Get help for specific command
contriflow help clone
```

## Summary

The `contriflow clone` command makes it easy to:
- ✅ Clone any public GitHub repository
- ✅ Organize code in workspace
- ✅ Manage upstream remotes
- ✅ Integrate with contribution workflow
- ✅ Support custom directory locations
- ✅ Work in batch operations

**Clone repositories efficiently!** 📦

---

**Clone Command Status:** ✅ Production Ready
**Last Updated:** February 11, 2026
**Documentation:** Complete with 40+ usage examples

# Pull Request Command - Comprehensive User Guide

## Overview

The `contriflow pr` command automates the final step of contributing to open-source projects. It creates branches, applies AI-generated patches, commits changes, and automatically opens pull requests on GitHub.

**Key Features:**
- 🌳 Automatic branch creation from issue number
- 📋 AI patch application
- 🔄 Git integration for commits and pushes
- 🚀 Automatic pull request creation on GitHub
- 📝 Pre-filled PR descriptions
- ⚡ One-command workflow completion

## Prerequisites

### 1. GitHub Authentication
```bash
contriflow login
```

### 2. Repository Must Be Cloned
```bash
contriflow clone owner/repo
```

### 3. Issue Must Exist
```bash
contriflow solve <issue_number> owner/repo
# This generates the patch
```

## Quick Start

### Create a Pull Request

```bash
# Syntax
contriflow pr <issue_number> <owner/repo>

# Example: Create PR for issue #123 in facebook/react
contriflow pr 123 facebook/react
```

**What It Does:**
1. Fetches issue details from GitHub
2. Creates a feature branch: `fix/issue-123-issue-title`
3. Offers to apply AI-generated patch (if available)
4. Creates pull request on GitHub
5. Pushes branch to GitHub
6. Shows PR link

## Usage Examples

### Example 1: Full Workflow from Solve to PR

```bash
# 1. Login
$ contriflow login

# 2. Search for repositories
$ contriflow search node --stars 5000

# 3. View contribution guidelines
$ contriflow guide nodejs/node

# 4. Find issues
$ contriflow issues nodejs/node --label "good-first-issue"
# Found: Issue #456 "Add better error messages"

# 5. Solve the issue with AI
$ contriflow solve 456 nodejs/node
# Generates patch and saves to ~/.contriflow/patches/

# 6. Fork the repository
$ contriflow fork nodejs/node

# 7. Clone your fork
$ contriflow clone your-username/node

# 8. Create and open pull request
$ contriflow pr 456 nodejs/node

# Output:
# ─────────────────────────────────────
# Issue Details
# ─────────────────────────────────────
# Title: Add better error messages
# Number: #456
# State: open
# Author: someuser
#
# [Creating branch...]
# ✓ Branch created: fix/issue-456-add-better-error-messages
#
# [Applying patch...]
# ✓ Patch applied
#
# [Creating pull request...]
# ─────────────────────────────────────
# Pull Request Created
# ─────────────────────────────────────
# PR Number: #789
# Title: Fix #456: Add better error messages
# Branch: fix/issue-456-add-better-error-messages → main
# Status: Open
# URL: https://github.com/nodejs/node/pull/789
#
# Next Steps:
# 1. Review your pull request: https://github.com/nodejs/node/pull/789
# 2. Add any additional details to the PR description
# 3. Request reviews from project maintainers
# 4. Address any review comments and push updates
# 5. Once approved, it will be merged!
```

### Example 2: Multiple Issues from Same Repo

```bash
# Solve and create PRs for multiple issues
$ contriflow solve 100 django/django
$ contriflow pr 100 django/django

$ contriflow solve 101 django/django
$ contriflow pr 101 django/django

$ contriflow solve 102 django/django
$ contriflow pr 102 django/django

# Each creates separate PR with its own branch
```

### Example 3: Skip AI Patch

```bash
# Create PR without applying AI patch
$ contriflow pr 123 facebook/react --no-patch

# Useful when you've manually implemented the solution
```

### Example 4: Non-Interactive Mode

```bash
# For scripts/CI that don't need user confirmation
$ contriflow pr 789 nodejs/node --no-interactive

# Skips all prompts, assumes defaults
```

## Command Options

### `--no-patch`
Skip automatic AI patch application.

```bash
$ contriflow pr 123 facebook/react --no-patch
```

**When to use:**
- You've manually implemented the fix
- You want to review patch first
- AI patch doesn't apply cleanly

### `--no-interactive`
Skip confirmation prompts (useful for automation).

```bash
$ contriflow pr 456 django/django --no-interactive
```

**When to use:**
- Running in CI/CD pipeline
- Automated scripts
- Batch operations

## Output Structure

### Console Display

1. **Issue Details**
   - Issue title, number, state, author
   - Confirms which issue being worked on

2. **Git Operations**
   - Creating feature branch
   - Branch name: `fix/issue-{number}-{title-slug}`
   - Status of each git operation

3. **Patch Application** (if applicable)
   - Patch file found and loaded
   - Status of patch application
   - Instructions for manual application

4. **Pull Request Creation**
   - PR created successfully
   - PR number and URL
   - Branch information
   - PR title and description

5. **Push to GitHub**
   - Branch pushed to origin
   - Status updates

6. **Next Steps**
   - Review PR link
   - Add details
   - Request reviews
   - Handle feedback
   - Merge process

## Branch Naming Convention

The command automatically generates branch names:

**Format:** `fix/issue-{number}-{slug}`

**Examples:**
```
fix/issue-123-add-better-error-messages
fix/issue-456-fix-memory-leak
fix/issue-789-improve-documentation
fix/issue-100-refactor-auth-system
```

**Rules:**
- Lowercase only
- Hyphens separate words
- Issue number included
- Title slugified (spaces→hyphens, special chars removed)
- Max 50 characters total

## Pull Request Details

### PR Title Format
```
Fix #123: Original issue title
```

**Examples:**
```
Fix #456: Add better error messages
Fix #789: Fix memory leak in parser
Fix #100: Improve documentation
```

### PR Body Template

The PR description includes:
1. **Related Issue** - Links to issue with `Fixes #number`
2. **Solution** - First 1000 chars of AI solution
3. **Changes** - Bullet point of what was implemented
4. **Type of Change** - Checkboxes (Bug fix, Feature, etc.)
5. **Testing** - Checkboxes for test coverage
6. **Checklist** - Code quality, tests, docs checklist

**Example PR Body:**
```
## Related Issue

Fixes #456: Add better error messages

## Solution

The issue described a need for more informative error messages...

## Changes

- Implemented better error message formatting
- Added context information to error output
- Updated error handling in parser

## Type of Change

- [x] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update

## Testing

- [x] Tested on local machine
- [ ] All tests passing
- [ ] Verified fix resolves issue

## Checklist

- [x] Code follows project style guidelines
- [x] Changes don't break existing tests
- [ ] Updated documentation if needed
- [ ] Added/updated tests if applicable
```

## Workflow Integration

### After Solve Command

```bash
# 1. Solve gets issue and generates patch
$ contriflow solve 123 facebook/react

# 2. Fork and clone are ready
$ contriflow fork facebook/react
$ contriflow clone your-username/react

# 3. PR command ties it all together
$ contriflow pr 123 facebook/react
```

### Full Command Chain

```bash
Login → Search → Guide → Issues → Solve → Fork → Clone → PR
  ↓       ↓        ↓        ↓       ↓       ↓       ↓       ↓
 Auth   Find    Review   Find   Solve   Fork   Clone  Create
        Repos   Rules    Work            Code         on GH
```

## Error Handling

### Error: "Not authenticated"
```
Error: Not authenticated. Run: contriflow login
```
**Solution:** Login first
```bash
contriflow login
```

### Error: "Repository not cloned"
```
Error: Repository not cloned. Run: contriflow clone owner/repo
```
**Solution:** Clone repository first
```bash
contriflow clone facebook/react
```

### Error: "Issue not found"
```
Error: Issue #99999 not found in facebook/react
```
**Solutions:**
- Check issue number is correct
- Verify repository name
- Check if issue is deleted

### Error: "No changes detected"
```
Error: No changes detected in repository
Please make changes and commit them before creating a PR
```
**Solutions:**
- Edit files to fix the issue
- Apply AI patch manually
- Commit your changes first

### Error: "Failed to push branch"
```
Failed to push branch: Push failed
Manual push: git push -u origin fix-issue-123
```
**Solution:** Push manually if command fails
```bash
cd ~/.contriflow/workspace/react
git push -u origin fix-issue-123
```

### Error: "No differences between branches"
```
Error: Pull request creation failed. Check branch names and try again.
```
**Solution:** Ensure you have commits on the feature branch
```bash
cd ~/.contriflow/workspace/react
# Make sure you've made changes and committed
git log
# Should show new commits
```

## Tips & Best Practices

### 1. Use Solve Before PR

Always use `contriflow solve` first to get AI suggestions:
```bash
$ contriflow solve 123 facebook/react
$ # Review the patch and solution
$ contriflow pr 123 facebook/react
```

### 2. Review the Patch First

Don't apply patch blindly:
```bash
$ cat ~/.contriflow/patches/issue-123-react-*.patch
$ # Review before applying
$ contriflow pr 123 facebook/react
```

### 3. Test Locally Before PR

Always test changes before creating PR:
```bash
$ cd ~/.contriflow/workspace/react
$ npm test  # or project's test command
$ # Verify tests pass
$ contriflow pr 123 facebook/react
```

### 4. Write Meaningful Commit Messages

Edit PR description after creation:
1. Go to PR link
2. Click "..." → "Edit"
3. Add implementation details
4. Request reviews

### 5. Keep PRs Focused

One issue = one PR:
```bash
$ # Good: One issue per PR
$ contriflow pr 123 facebook/react
$ contriflow pr 124 facebook/react

$ # Bad: Multiple issues in one PR
$ # (Create separate PRs instead)
```

### 6. Handle Merge Conflicts

If base branch changes:
```bash
$ cd ~/.contriflow/workspace/react
$ git fetch origin
$ git rebase origin/main
$ # Resolve conflicts
$ git push --force-with-lease origin fix-issue-123
```

## Advanced Usage

### Batch PR Creation

Create multiple PRs from script:
```bash
#!/bin/bash
for issue in 100 101 102 103; do
  contriflow solve "$issue" facebook/react --no-interactive
  contriflow pr "$issue" facebook/react --no-interactive
done
```

### CI/CD Integration

Use in GitHub Actions:
```yaml
- name: Create PR for Issue
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    contriflow login --token $GITHUB_TOKEN
    contriflow solve 123 facebook/react --no-interactive
    contriflow pr 123 facebook/react --no-interactive
```

### Custom PR Template

Edit PR after creation:
```bash
$ contriflow pr 123 facebook/react
$ # Go to PR link
$ # Edit description to match project template
```

## Troubleshooting

### PR Created But Branch Not Pushed

```bash
# Push manually
cd ~/.contriflow/workspace/react
git push -u origin fix-issue-123
```

### Changes Not Detected

```bash
# Check git status
cd ~/.contriflow/workspace/react
git status

# Add and commit changes
git add .
git commit -m "Fix issue #123"

# Then create PR
contriflow pr 123 facebook/react
```

### Wrong Branch

```bash
# Check current branch
cd ~/.contriflow/workspace/react
git branch

# Switch to main and try again
git checkout main
contriflow pr 123 facebook/react
```

## FAQ

**Q: Can I edit the PR after creation?**
A: Yes! Go to the PR link and click edit. You can add details and request reviews.

**Q: What if the patch doesn't apply?**
A: Use `--no-patch` flag and implement changes manually. The PR will still be created.

**Q: Can I create a draft PR?**
A: Not directly in command, but you can edit PR to mark as draft after creation.

**Q: How do I change the PR description?**
A: Edit the PR on GitHub after creation. Click the three dots menu.

**Q: What if base branch is not "main"?**
A: Command automatically detects default branch. It works with main, master, develop, etc.

**Q: Can I create multiple PRs from same issue?**
A: Yes, but not recommended. Each PR should target one issue.

---

## Next Steps

- **Read Implementation Details:** See [PR_IMPLEMENTATION.md](./PR_IMPLEMENTATION.md)
- **View Test Cases:** See [PR_TESTING.md](./PR_TESTING.md)
- **Explore Other Commands:** `contriflow --help`
- **Review Guidelines:** Run `contriflow guide <owner/repo>`

---

**Last Updated:** February 11, 2026
**Status:** Production Ready

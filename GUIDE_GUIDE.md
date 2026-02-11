# ContriFlow Guide Command - User Guide

## Overview

The `contriflow guide` command fetches and displays CONTRIBUTING.md and CODE_OF_CONDUCT.md files from any GitHub repository. It helps you understand the project's contribution requirements and community standards before contributing.

## Prerequisites

- GitHub repository (public or accessible to you)
- Logged in with `contriflow login` (for private repositories)
- Internet connection for fetching files

## Command Syntax

```bash
contriflow guide [repo] [options]

Arguments:
  [repo]  Repository in format owner/repo (optional, will prompt if not provided)

Options:
  -c, --contributing     Show only CONTRIBUTING.md
  -o, --code-of-conduct  Show only CODE_OF_CONDUCT.md
  -b, --brief            Show first 500 characters of each file
  --no-interactive       Skip confirmation prompts
  -h, --help             Display help information
```

## Basic Usage

### View All Guidelines

Fetch and display both CONTRIBUTING.md and CODE_OF_CONDUCT.md:

```bash
$ contriflow guide facebook/react
```

**Output:**
```
─────────────────────────────────────────────────
Repository Contribution Guidelines
─────────────────────────────────────────────────

✓ Found: facebook/react

─────────────────────────────────────────────────
Repository Information
─────────────────────────────────────────────────

Property | Value
─────────┼──────────────────────────────
Name     | facebook/react
Stars    | 215000
Language | JavaScript
URL      | https://github.com/facebook/react

✓ Guidelines fetched

─────────────────────────────────────────────────
CONTRIBUTING.md
─────────────────────────────────────────────────

[Full content of CONTRIBUTING.md displayed]

─────────────────────────────────────────────────
CODE_OF_CONDUCT.md
─────────────────────────────────────────────────

[Full content of CODE_OF_CONDUCT.md displayed]
```

### View Only CONTRIBUTING.md

```bash
$ contriflow guide facebook/react --contributing
```

Shows only the CONTRIBUTING.md file.

### View Only CODE_OF_CONDUCT.md

```bash
$ contriflow guide facebook/react --code-of-conduct
```

Shows only the CODE_OF_CONDUCT.md file.

### Brief View (First 500 Characters)

```bash
$ contriflow guide facebook/react --brief
```

Shows truncated versions for quick preview.

### Interactive Repo Selection

```bash
$ contriflow guide
```

Prompts you to enter the repository name:

```
? Enter repository (format: owner/repo): facebook/react
```

## Usage Examples

### Example 1: Review Project Guidelines Before Contributing

```bash
# 1. Search for projects
contriflow search react --stars 10000

# 2. Review the guidelines
contriflow guide facebook/react

# 3. Find issues to work on
contriflow issues facebook/react --label good-first-issue

# 4. Fork and contribute
contriflow fork facebook/react
```

### Example 2: Quick Preview of Guidelines

```bash
# Get a quick overview without full content
contriflow guide nodejs/node --brief
```

### Example 3: Review Multiple Projects

```bash
# Compare contribution guidelines across projects
contriflow guide facebook/react --contributing
contriflow guide angular/angular --contributing
contriflow guide vuejs/vue --contributing
```

### Example 4: Check Code of Conduct

```bash
# See the community standards before contributing
contriflow guide django/django --code-of-conduct
```

### Example 5: Full Contribution Workflow

```bash
# Complete workflow with guidelines review
contriflow search "machine learning"
contriflow guide owner/project
# [Review guidelines]
contriflow issues owner/project --label good-first-issue
# [Select an issue]
contriflow fork owner/project
contriflow clone your-username/project --add-upstream
# [Start working]
```

## Repository Information Display

When you fetch guidelines, the command shows:

### Repository Details Table
```
Property | Value
─────────┼──────────────────────────────
Name     | facebook/react
Stars    | 215000
Language | JavaScript
URL      | https://github.com/facebook/react
```

### Files Available Table
```
File                  | Status
──────────────────────┼────────────
CONTRIBUTING.md       | ✓ Found
CODE_OF_CONDUCT.md    | ✓ Found
```

## Workflow Integration

### Workflow 1: Search → Guide → Fork → Contribute

```bash
# 1. Find interesting projects
contriflow search "react" --stars 5000

# 2. Review contribution guidelines
contriflow guide facebook/react

# 3. Check available issues
contriflow issues facebook/react --label good-first-issue

# 4. Fork and start contributing
contriflow fork facebook/react
contriflow clone your-username/react --add-upstream
```

### Workflow 2: Quick Guideline Review

```bash
# Get contributing guidelines quickly
contriflow guide facebook/react --contributing

# Then proceed with contribution
contriflow fork facebook/react
contriflow clone your-username/react
```

### Workflow 3: Community Standards First

```bash
# Review community standards before any contribution
contriflow guide django/django --code-of-conduct

# Then check contributing guidelines
contriflow guide django/django --contributing

# Then find work
contriflow issues django/django --label good-first-issue
```

## Features

✅ **Guideline Retrieval**
- Fetches CONTRIBUTING.md files
- Fetches CODE_OF_CONDUCT.md files
- Shows file locations
- Indicates file availability

✅ **Multiple Input Methods**
- Positional argument: `contriflow guide facebook/react`
- Interactive prompt: `contriflow guide`
- Non-interactive: `contriflow guide facebook/react --no-interactive`

✅ **Repository Information**
- Shows repository details
- Displays stars and language
- Links to GitHub repository

✅ **Flexible Viewing**
- Show both guidelines (default)
- Show only CONTRIBUTING.md
- Show only CODE_OF_CONDUCT.md
- Brief preview mode

✅ **Error Handling**
- Validates repository format
- Checks if repository exists
- Handles missing files gracefully
- Clear error messages

✅ **Integration**
- Works with `contriflow search`
- Works with `contriflow issues`
- Works with `contriflow fork`
- Works with `contriflow clone`

## Common Scenarios

### Scenario 1: First Time Contributing to React

```bash
# 1. Find React
$ contriflow search react --stars 100000

# 2. Review guidelines
$ contriflow guide facebook/react

# 3. Check available issues
$ contriflow issues facebook/react --label good-first-issue

# 4. Fork and contribute
$ contriflow fork facebook/react
$ contriflow clone your-username/react --add-upstream
```

### Scenario 2: Understand Community Standards

```bash
# Check if project has community standards
$ contriflow guide django/django --code-of-conduct

# Review expected behaviors before contributing
# Then check technical contribution guidelines
$ contriflow guide django/django --contributing
```

### Scenario 3: Quick Project Review

```bash
# Get quick overview of guidelines
$ contriflow guide kubernetes/kubernetes --brief

# Then proceed with setup
$ contriflow fork kubernetes/kubernetes
```

### Scenario 4: Compare Multiple Projects

```bash
# Review guidelines across similar projects

# Vue guidelines
$ contriflow guide vuejs/vue --contributing

# React guidelines
$ contriflow guide facebook/react --contributing

# Angular guidelines
$ contriflow guide angular/angular --contributing

# Compare and choose best fit
```

### Scenario 5: Team Onboarding

```bash
# New team member checks company project guidelines
$ contriflow guide company/internal-project

# Understands code of conduct
$ contriflow guide company/internal-project --code-of-conduct

# Reviews contribution process
$ contriflow guide company/internal-project --contributing
```

## Options in Detail

### `-c, --contributing`

Show only CONTRIBUTING.md file.

```bash
# Both files (default)
contriflow guide facebook/react

# Only CONTRIBUTING.md
contriflow guide facebook/react --contributing
```

**When to use:**
- Focus on technical contribution guidelines
- Skip code of conduct
- Quick technical review

### `-o, --code-of-conduct`

Show only CODE_OF_CONDUCT.md file.

```bash
# Both files
contriflow guide facebook/react

# Only CODE_OF_CONDUCT.md
contriflow guide facebook/react --code-of-conduct
```

**When to use:**
- Review community standards first
- Check for inclusive guidelines
- Understand project culture

### `-b, --brief`

Show first 500 characters of each file.

```bash
# Full content
contriflow guide facebook/react

# First 500 chars of each
contriflow guide facebook/react --brief
```

**When to use:**
- Quick preview
- Decide if full read needed
- Get file overview

### `--no-interactive`

Skip confirmation prompts.

```bash
# Interactive (default)
contriflow guide facebook/react

# Non-interactive
contriflow guide facebook/react --no-interactive
```

**When to use:**
- Automated workflows
- CI/CD pipelines
- Scripts

## Error Handling

### Repository Not Found

```bash
$ contriflow guide invalid/repo

❌ Repository not found: invalid/repo
```

**Solution:**
- Verify repository name
- Check owner username
- Try searching first

### Invalid Format

```bash
$ contriflow guide react

❌ Invalid repository format. Use format: owner/repo
```

**Solution:**
- Use: `owner/repo` format
- Example: `contriflow guide facebook/react`

### No Guidelines Found

```bash
$ contriflow guide archived/project

⚠ No contribution guidelines found. Check repository for 
  CONTRIBUTING.md in root or docs folder.
```

**Solutions:**
- Check repository manually on GitHub
- Look in docs/ folder on GitHub
- Check wiki pages on GitHub

### Authentication Required

```bash
❌ GitHub token not found. Run: contriflow auth
```

**Solution:**
- Login: `contriflow login`
- For private repositories

## File Locations

The command looks for files in standard GitHub locations:

1. **CONTRIBUTING.md**
   - Root: `/CONTRIBUTING.md`
   - Docs: `/docs/CONTRIBUTING.md`
   - GitHub: `/.github/CONTRIBUTING.md`

2. **CODE_OF_CONDUCT.md**
   - Root: `/CODE_OF_CONDUCT.md`
   - Docs: `/docs/CODE_OF_CONDUCT.md`
   - GitHub: `/.github/CODE_OF_CONDUCT.md`

## File Content Examples

### Typical CONTRIBUTING.md Sections
- Prerequisites (languages, tools)
- Setup instructions
- Development workflow
- Coding standards
- Testing requirements
- Submission guidelines
- Review process
- Communication channels

### Typical CODE_OF_CONDUCT.md Sections
- Project values
- Inclusion statement
- Unacceptable behavior
- Enforcement
- Incident reporting
- Attribution

## Next Steps After Reading Guidelines

### Option 1: Start Contributing Immediately

```bash
contriflow fork facebook/react
contriflow clone your-username/react --add-upstream
cd ~/.contriflow/workspace/react
git checkout -b feature/your-contribution
```

### Option 2: Find Issues First

```bash
contriflow issues facebook/react --label good-first-issue
# [Select an issue]
contriflow fork facebook/react
```

### Option 3: Read Full Repository

```bash
# After reviewing guidelines, explore repository
cd ~/.contriflow/workspace/react
git log --oneline | head -10
ls -la
cat README.md
```

## Tips and Best Practices

### Tip 1: Always Review Guidelines First

```bash
# Good: Check guidelines before any work
contriflow guide facebook/react
contriflow fork facebook/react

# Less ideal: Skip guidelines
contriflow fork facebook/react
```

### Tip 2: Check Code of Conduct for Culture Fit

```bash
# Review community standards
contriflow guide django/django --code-of-conduct

# Ensures you understand project culture
```

### Tip 3: Use Brief Mode for Quick Preview

```bash
# Get overview first
contriflow guide facebook/react --brief

# If interested, read full version
contriflow guide facebook/react
```

### Tip 4: Compare Projects Side-by-Side

```bash
# Compare contributing guidelines
echo "=== React ===" && contriflow guide facebook/react --brief
echo "=== Vue ===" && contriflow guide vuejs/vue --brief
echo "=== Angular ===" && contriflow guide angular/angular --brief
```

### Tip 5: Store Guidelines Locally

```bash
# Save for offline reference
contriflow guide facebook/react > react-guidelines.txt

# Read anytime
cat react-guidelines.txt
```

## Troubleshooting

### Q: Can't find CONTRIBUTING.md
**A:** Repository might not have one. Check if it's in docs/ or .github/ folders on GitHub.

### Q: What if no CODE_OF_CONDUCT.md?
**A:** Not all projects have one. That's okay - focus on CONTRIBUTING.md.

### Q: How to view guidelines offline?
**A:** Save to file or take screenshot before contributing.

### Q: File content is truncated in terminal?
**A:** Try brief mode or save to file for full viewing.

### Q: Can I modify guidelines locally?
**A:** No, this is read-only. Modify guidelines by forking and creating PR.

## Command Comparison

| Use Case | Command |
|----------|---------|
| View all guidelines | `contriflow guide owner/repo` |
| View contributing only | `contriflow guide owner/repo -c` |
| View code of conduct only | `contriflow guide owner/repo -o` |
| Quick preview | `contriflow guide owner/repo -b` |
| Non-interactive | `contriflow guide owner/repo --no-interactive` |

## Integration with Other Commands

| Command | Usage |
|---------|-------|
| `contriflow search` | Find repos, then guide |
| `contriflow guide` | Review guidelines |
| `contriflow issues` | Find work to do |
| `contriflow fork` | Create your fork |
| `contriflow clone` | Get code locally |

## Related Commands

- **`contriflow search`** - Find repositories
- **`contriflow issues`** - Find work to do
- **`contriflow fork`** - Fork repository
- **`contriflow clone`** - Clone to workspace

## Getting Help

```bash
# See guide command help
contriflow guide --help

# See main help
contriflow --help

# Get help for specific command
contriflow help guide
```

## Summary

The `contriflow guide` command makes it easy to:
- ✅ Review CONTRIBUTING.md files
- ✅ Understand code of conduct
- ✅ Respect project standards
- ✅ Prepare before contributing
- ✅ Compare projects
- ✅ Ensure cultural fit

**Review guidelines before contributing!** 📖

---

**Guide Command Status:** ✅ Production Ready
**Last Updated:** February 11, 2026
**Documentation:** Complete with 40+ usage examples

# Solve Command - Comprehensive User Guide

## Overview

The `contriflow solve` command uses AI to analyze GitHub issues and generate suggested solutions. It fetches issue details from GitHub, sends them to the OpenRouter AI API, generates code suggestions and explanations, and saves the results as patch files for easy reference.

**Key Features:**
- 🤖 AI-powered issue analysis
- 💾 Automatic patch file generation
- 🔍 Code block extraction
- 📋 Issue metadata preservation
- ⚡ Fast solution generation
- 🎯 Multiple solution formats

## Prerequisites

### 1. GitHub Authentication
```bash
contriflow login
```

### 2. OpenRouter API Key (Optional but Recommended)
Get a free API key at: https://openrouter.ai

Then configure it:
```bash
contriflow config --set-ai-key sk-or-v1-xxxxxxxxxxxx
```

## Quick Start

### Generate AI Solution for an Issue

```bash
# Syntax
contriflow solve <issue_number> <owner/repo>

# Example: Solve issue #123 in facebook/react
contriflow solve 123 facebook/react
```

**Output:**
- Issue details and metadata
- AI-generated analysis and solution
- Code blocks extracted
- Patch file saved

### Save Issue as Template (No AI)

```bash
# Without AI key (or skip AI)
contriflow solve 123 facebook/react --no-ai

# This saves the issue as a template for manual solving
```

## Usage Examples

### Example 1: Solve a Bug in React

```bash
# Login first
$ contriflow login

# Search for issues
$ contriflow issues facebook/react --label "good-first-issue"

# Found issue #17847 about performance
$ contriflow solve 17847 facebook/react

# Output:
# ─────────────────────────────────────
# Issue Details
# ─────────────────────────────────────
# 
# Title: Optimize re-render performance
# Number: #17847
# State: open
# Created: 2/11/2026
# Author: someuser
#
# Issue body preview...
#
# ─────────────────────────────────────
# AI-Generated Solution
# ─────────────────────────────────────
#
# ## Analysis
# The issue describes a performance bottleneck in React's...
#
# ## Proposed Solution
# [AI provides detailed solution]
#
# ```javascript
# // Code suggestion here
# ```
#
# ─────────────────────────────────────
# Patch File Created
# ─────────────────────────────────────
# 
# Saved to: /home/user/.contriflow/patches/issue-17847-react-1707602400000.patch
```

### Example 2: Solve Multiple Issues

```bash
# Solve issue #100
$ contriflow solve 100 torvalds/linux

# Review the generated patch
# Implement the solution

# Solve another issue #101
$ contriflow solve 101 django/django

# Compare different patches
$ ls ~/.contriflow/patches/
```

### Example 3: Template-Only Mode (No AI)

```bash
# Save as template without AI
$ contriflow solve 42 nodejs/node --no-ai

# Output: Patch template with issue details
# You can then manually write the solution
```

### Example 4: Full Workflow with Fork and Clone

```bash
# 1. Login
$ contriflow login

# 2. Search for repositories
$ contriflow search nodejs language:javascript --stars 5000

# 3. View guidelines
$ contriflow guide nodejs/node

# 4. Find issues
$ contriflow issues nodejs/node --label "good-first-issue"

# 5. Solve issue #12345
$ contriflow solve 12345 nodejs/node

# 6. Review the AI solution
# Check the generated patch at ~/.contriflow/patches/

# 7. Fork repository
$ contriflow fork nodejs/node

# 8. Clone your fork
$ contriflow clone your-username/node

# 9. Create branch
$ cd ~/.contriflow/workspace/node
$ git checkout -b fix-issue-12345

# 10. Implement solution
# (Use the AI-generated patch as a guide)

# 11. Test and commit
$ git add .
$ git commit -m "Fix issue #12345: description"

# 12. Create PR
$ contriflow pr
```

## Command Options

### `--no-ai`
Skip AI solution generation and save issue as template only.

```bash
$ contriflow solve 123 facebook/react --no-ai
# Saves issue metadata without AI analysis
```

**When to use:**
- No OpenRouter API key configured
- Want to manually solve the issue
- Testing or learning

### `--no-interactive`
Skip confirmation prompts (useful for scripts/CI).

```bash
$ contriflow solve 123 facebook/react --no-interactive
```

## Output Structure

### Console Output

1. **Issue Details**
   - Issue title
   - Issue number
   - Current state (open/closed)
   - Creation date
   - Author username

2. **Issue Body**
   - First 300 characters as preview
   - Full content in the saved patch

3. **AI-Generated Solution**
   - Brief analysis of the issue
   - Proposed solution(s)
   - Code examples wrapped in markdown blocks
   - Language-specific suggestions

4. **Code Blocks**
   - Automatically extracted from AI response
   - Saved separately in patch file
   - Language specified for syntax highlighting

5. **Next Steps**
   - Patch file location
   - Number of extracted code blocks
   - Suggested git workflow

### Patch File Format

**Location:** `~/.contriflow/patches/issue-{number}-{repo}-{timestamp}.patch`

**Contents:**
```
From: ContriFlow AI Solver
Subject: Solution for facebook/react#123
Date: 2026-02-11T10:30:45.000Z

[Full AI-generated solution]

---
Code blocks extracted: 2

--- Code Block 1 ---
[First code block]

--- Code Block 2 ---
[Second code block]
```

## Common Scenarios

### Scenario 1: First Time Contributing

```bash
# 1. Find an issue
$ contriflow issues expressjs/express --label "good-first-issue"

# 2. Get solution suggestion
$ contriflow solve 456 expressjs/express

# 3. Review the patch
$ cat ~/.contriflow/patches/issue-456-express-*.patch

# 4. Read guidelines
$ contriflow guide expressjs/express

# 5. Fork and implement
$ contriflow fork expressjs/express
$ contriflow clone your-username/express
```

### Scenario 2: Reviewing Multiple Solutions

```bash
# Solve several issues
$ for i in 100 101 102; do
  contriflow solve $i django/django
done

# Review all patches
$ ls -la ~/.contriflow/patches/

# Compare solutions
$ cat ~/.contriflow/patches/issue-100-django-*.patch
$ cat ~/.contriflow/patches/issue-101-django-*.patch
```

### Scenario 3: Using Without AI (Offline)

```bash
# Work offline by saving as template
$ contriflow solve 789 rust/rust --no-ai

# Later, when online, regenerate with AI
$ contriflow solve 789 rust/rust
```

### Scenario 4: Integration with Version Control

```bash
# Solve issue
$ contriflow solve 555 torvalds/linux

# Create branch from patch
$ cd ~/.contriflow/workspace/linux
$ git checkout -b implement-fix

# Copy patch content to your editor
# Implement the solution based on suggestions

# Commit and push
$ git add .
$ git commit -m "Implement fix for issue #555"
$ git push origin implement-fix
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

### Error: "Issue not found"
```
Error: Issue #99999 not found in facebook/react
```
**Solutions:**
- Check issue number is correct
- Verify repository exists
- Check if issue is deleted or closed

### Error: "Invalid repository format"
```
Error: Invalid repository format. Use: owner/repo (e.g., facebook/react)
```
**Solution:** Use correct format: `contriflow solve 123 owner/repo`

### Error: "OpenRouter API key not configured"
```
Error: OpenRouter API key not configured.
To enable AI solution generation, set your key:
  contriflow config --set-ai-key <your-key>
Get a key at: https://openrouter.ai
```
**Solution:** Either:
- Set API key: `contriflow config --set-ai-key sk-or-v1-xxxx`
- Use `--no-ai` flag to skip AI generation

### Error: "Invalid OpenRouter API key"
```
Error: Invalid OpenRouter API key. Check your configuration.
```
**Solution:**
- Verify key is correct: `cat ~/.contriflow/config.json | grep openRouterKey`
- Get new key from https://openrouter.ai
- Update: `contriflow config --set-ai-key <new-key>`

## Tips & Best Practices

### 1. Start with Good Issues
```bash
# Filter by good-first-issue label
$ contriflow issues expressjs/express --label "good-first-issue"

# Or search by language
$ contriflow issues rust/rust --label "help-wanted"
```

### 2. Review AI Suggestions Carefully
- AI can make mistakes
- Verify code before implementing
- Test thoroughly
- Read the issue comments for context

### 3. Organize Patches
```bash
# Group by repository
$ mkdir ~/contributions/react-fixes
$ cp ~/.contriflow/patches/issue-*-react-*.patch ~/contributions/react-fixes/

# Track progress
$ ls ~/contributions/*/
```

### 4. Use AI Suggestions as Starting Point
- Don't copy code blindly
- Understand the logic
- Adapt to project style
- Add your own improvements

### 5. Save Templates for Later
```bash
# Save issue without solving
$ contriflow solve 123 facebook/react --no-ai

# Revisit and solve later
$ cat ~/.contriflow/patches/issue-123-react-*.patch
```

## Workflow Integration

### With Search Command
```bash
# Search repos
$ contriflow search node --stars 1000

# Solve issues in found repos
$ contriflow solve 123 nodejs/node
$ contriflow solve 124 nodejs/node
```

### With Guide Command
```bash
# Read guidelines first
$ contriflow guide facebook/react

# Then solve issues
$ contriflow solve 456 facebook/react

# Implementation follows project standards
```

### With Fork & Clone
```bash
# Solve issue
$ contriflow solve 789 torvalds/linux

# Fork and clone
$ contriflow fork torvalds/linux
$ contriflow clone your-username/linux

# Work in cloned repo
$ cd ~/.contriflow/workspace/linux
```

## Configuration

### Setting OpenRouter API Key
```bash
# One-time setup
$ contriflow config --set-ai-key sk-or-v1-xxxxxxxxxxxx

# Verify it's set
$ cat ~/.contriflow/config.json

# Update if needed
$ contriflow config --set-ai-key sk-or-v1-yyyyyyyyyyyy
```

### Patch Directory
```bash
# All patches saved to
~/.contriflow/patches/

# Clear old patches
$ rm ~/.contriflow/patches/issue-*-old-*.patch

# Backup important patches
$ cp ~/.contriflow/patches/issue-123-*.patch ~/my-fixes/
```

## Advanced Usage

### Scripting Multiple Issues

```bash
#!/bin/bash
# solve_multiple.sh

repos=("facebook/react" "nodejs/node" "django/django")
for repo in "${repos[@]}"; do
  issues=$(contriflow issues "$repo" --label "good-first-issue" | grep -o "#[0-9]*" | tr -d '#')
  for issue in $issues; do
    contriflow solve "$issue" "$repo" --no-interactive
  done
done
```

### Creating Issue Dashboard

```bash
# Generate reports on solvable issues
$ contriflow issues expressjs/express > issues.txt
$ for issue in $(grep -o "#[0-9]*" issues.txt); do
  echo "=== Issue $issue ==="
  contriflow solve "${issue#\#}" expressjs/express --no-ai
done
```

### Exporting Solutions

```bash
# Collect all solutions
$ cat ~/.contriflow/patches/issue-*.patch > all_solutions.txt

# Share with team
$ cat all_solutions.txt | email team@project.dev
```

## FAQ

**Q: Can I edit the generated patches?**
A: Yes! Patches are plain text files. Edit them in any editor.

**Q: How does the AI know about the project?**
A: The repository name and language are sent with the issue, giving context.

**Q: Can I use my own AI API instead of OpenRouter?**
A: Currently only OpenRouter is supported. Future versions may add more providers.

**Q: What if the AI solution is wrong?**
A: Review carefully. AI suggestions are starting points, not final solutions. Always verify and test.

**Q: How long do patches stay in ~/.contriflow/patches/?**
A: Until you delete them. They don't expire automatically.

**Q: Can I solve private/internal issues?**
A: Only if your GitHub token has access to that repository.

**Q: What programming languages does it support?**
A: Any language you work with. The language is detected from the repository.

## Troubleshooting

### Check Configuration
```bash
# View saved config
$ cat ~/.contriflow/config.json

# Verify GitHub token
$ grep githubToken ~/.contriflow/config.json

# Verify OpenRouter key (if set)
$ grep openRouterKey ~/.contriflow/config.json
```

### View Patch Files
```bash
# List all patches
$ ls -la ~/.contriflow/patches/

# View specific patch
$ cat ~/.contriflow/patches/issue-123-react-*.patch

# Find patches by issue number
$ ls ~/.contriflow/patches/issue-123-*
```

### Check Permissions
```bash
# Ensure patches directory exists and is writable
$ mkdir -p ~/.contriflow/patches
$ chmod 755 ~/.contriflow/patches
```

## Integration with Git Workflow

```bash
# 1. Solve the issue
$ contriflow solve 123 facebook/react

# 2. Review the patch
$ cat ~/.contriflow/patches/issue-123-react-*.patch

# 3. Create working branch
$ git checkout -b fix-issue-123

# 4. Implement based on AI suggestion
# (Edit your code files)

# 5. Test
$ npm test

# 6. Commit
$ git commit -am "Fix issue #123: brief description"

# 7. Push
$ git push origin fix-issue-123

# 8. Create PR (using PR command or GitHub UI)
```

---

## Next Steps

- **Read Implementation Details:** See [SOLVE_IMPLEMENTATION.md](./SOLVE_IMPLEMENTATION.md)
- **View Test Cases:** See [SOLVE_TESTING.md](./SOLVE_TESTING.md)
- **Set Up OpenRouter:** Visit https://openrouter.ai
- **Explore Other Commands:** `contriflow --help`

---

**Last Updated:** February 11, 2026
**Status:** Production Ready

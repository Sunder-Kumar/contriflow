# 📋 ContriFlow CLI - Quick Reference

## Installation

```bash
npm install -g contriflow-cli
# or
npm install && npm link
```

## Setup (One-time)

```bash
# 1. Authenticate with GitHub
contriflow auth

# 2. Set OpenRouter API key (optional, for AI)
export OPENROUTER_API_KEY="your_api_key"
```

## Common Commands

### Search & Discover

```bash
# Search repositories
contriflow search --keyword "react" --language JavaScript

# Find beginner issues
contriflow issues --language Python --label "good-first-issue"

# Get specific repo details
contriflow setup --repo "owner/repo"
```

### Contribute

```bash
# Fork and clone a repo
contriflow setup --repo "owner/repo" --issue 123

# Enter gamified contribute mode
contriflow contribute --language JavaScript

# View your stats
contriflow contribute --stats
```

### Create PR

```bash
# Create pull request
contriflow pr --repo "owner/repo" \
  --branch "feature/fix-123" \
  --issue 123 \
  --title "Fix: my fix" \
  --draft
```

## Directory Layout

```
~/.contriflow/
├── config.json           # Your settings
├── workspace/            # Cloned repositories
│   ├── project1/
│   ├── project2/
│   └── ...
└── db/
    └── contributions.json # Your contribution history
```

## Helpful Links

- 🔗 GitHub Token: https://github.com/settings/tokens
- 🔗 OpenRouter API: https://openrouter.ai
- 📖 Full Docs: See README.md
- 🏗️ Architecture: See ARCHITECTURE.md
- 📝 Contributing: See CONTRIBUTING.md

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Token not found | `contriflow auth` |
| AI not working | Set `OPENROUTER_API_KEY` env var |
| Command not found | `npm install -g .` or `npm link` |
| Clone failed | Check token has `repo` scope |

## Example Workflow

```bash
# 1. Search for projects
contriflow search --keyword "vue" --language JavaScript

# 2. Find issues
contriflow issues --language JavaScript

# 3. Setup repository
contriflow setup --repo "vuejs/core" --issue 456

# 4. Navigate and code
cd ~/.contriflow/workspace/core
git checkout -b feature/fix-456

# Edit files...

# 5. Commit and push
git add .
git commit -m "fix: resolve issue #456"
git push origin feature/fix-456

# 6. Create PR
contriflow pr --repo "vuejs/core" --branch "feature/fix-456"

# 7. Track progress
contriflow contribute --stats
```

## Environment Variables

```bash
# Required for authentication (alternative to 'auth' command)
export GITHUB_TOKEN="ghp_xxxxx"

# Required for AI suggestions
export OPENROUTER_API_KEY="sk_xxxxx"
```

## Pro Tips

1. **Use Contribute Mode** - Build streaks, earn points!
   ```bash
   contriflow contribute
   ```

2. **Filter by Language** - Find issues in your preferred language
   ```bash
   contriflow issues --language "TypeScript" --min-stars 100
   ```

3. **AI Assistance** - Get code suggestions for issues
   - Use `contriflow issues` and select "Yes" for AI suggestions
   - Set `OPENROUTER_API_KEY` for better results

4. **Read CONTRIBUTING** - Always check repository guidelines
   - Automatically fetched during `contriflow setup`

5. **Link Issues** - Connect issues to PRs automatically
   ```bash
   contriflow pr --issue 123
   ```

## Getting Help

```bash
# General help
contriflow --help

# Specific command help
contriflow search --help
contriflow issues --help
contriflow contribute --help

# View documentation
cat README.md
cat ARCHITECTURE.md
cat CONTRIBUTING.md
```

---

**Start your open-source journey today! 🚀**

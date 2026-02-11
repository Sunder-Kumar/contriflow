# ContriFlow CLI - Setup Guide

## Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Git**: Latest version

## Installation

### Option 1: Install from npm (when published)

```bash
npm install -g contriflow-cli
```

### Option 2: Install from source (Development)

```bash
git clone https://github.com/yourusername/contriflow-cli.git
cd contriflow-cli
npm install
npm link
```

## First-Time Setup

### 1. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `contriflow-cli`
4. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `public_repo` - Access public repositories
   - ✅ `user` - Read user profile data
   - ✅ `read:org` (optional) - Read organization data
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### 2. Set Up Environment Variables (Optional)

```bash
# Copy example file
cp .env.example .env

# Edit with your editor
# Linux/Mac:
nano .env

# Windows:
notepad .env
```

Add:
```
GITHUB_TOKEN=ghp_your_token_here
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Authenticate ContriFlow

```bash
contriflow auth
```

When prompted, paste your GitHub token.

The token is stored securely in `~/.contriflow/config.json`

### 4. Get OpenRouter API Key (for AI suggestions)

1. Go to https://openrouter.ai
2. Sign up (free with credits)
3. Go to Dashboard → API Keys
4. Copy your API key
5. Set environment variable:
   ```bash
   export OPENROUTER_API_KEY="your_key_here"
   ```

## Quick Start

### 1. Search for a Project

```bash
contriflow search --keyword "react" --language JavaScript --min-stars 500
```

### 2. Find Issues

```bash
contriflow issues --language Python
```

### 3. Fork & Setup Repository

```bash
contriflow setup --repo "owner/repository" --issue 123
```

### 4. Start Contributing

```bash
cd ~/.contriflow/workspace/repository-name
```

Edit files, commit, and create a PR:

```bash
contriflow pr --repo "owner/repository" --branch "feature/my-fix" --issue 123
```

### 5. Track Progress

```bash
contriflow contribute --language JavaScript
```

## Troubleshooting

### "Command not found: contriflow"

**Solution**: Reinstall and link
```bash
npm link
# or
npm install -g .
```

### "GitHub token not found"

**Solution**: Run authentication
```bash
contriflow auth
```

### "EACCES: permission denied"

**Solution**: Fix npm permissions
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### "Clone failed"

**Causes & Solutions**:
- Invalid token → run `contriflow auth` with correct token
- No internet → check connection
- Insufficient permissions → token needs `repo` scope

### "AI suggestions not working"

**Solution**: Set OpenRouter API key
```bash
export OPENROUTER_API_KEY="sk-..."
contriflow issues  # Try again
```

## Configuration

Configuration is stored in: `~/.contriflow/`

```
~/.contriflow/
├── config.json           # Your settings & token
├── db/
│   └── contributions.json # Your contribution history
└── workspace/            # Cloned repositories
    ├── project1/
    ├── project2/
    └── ...
```

### Reset Configuration

```bash
# Backup first
cp ~/.contriflow/config.json ~/.contriflow/config.json.bak

# Then reset
rm ~/.contriflow/config.json
contriflow auth  # Re-authenticate
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GITHUB_TOKEN` | GitHub authentication | No* |
| `OPENROUTER_API_KEY` | AI suggestions | No** |
| `NODE_ENV` | Environment (dev/production) | No |

*Can authenticate via `contriflow auth` instead  
**Needed only for AI features

## Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/contriflow-cli.git
cd contriflow-cli

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your tokens

# Run in development mode
npm run dev

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## Project Structure

```
contriflow-cli/
├── src/
│   ├── commands/
│   │   ├── auth.js
│   │   ├── search.js
│   │   ├── issues.js
│   │   ├── setup.js
│   │   ├── contribute.js
│   │   └── pr.js
│   ├── services/
│   │   ├── github.js
│   │   ├── repositoryService.js
│   │   ├── issueService.js
│   │   ├── gitService.js
│   │   └── ai.js
│   ├── utils/
│   │   └── display.js
│   ├── config/
│   │   └── configManager.js
│   ├── db/
│   │   └── contributionDb.js
│   └── index.js
├── __tests__/
├── README.md
├── CONTRIBUTING.md
├── ARCHITECTURE.md
├── SETUP.md (this file)
├── LICENSE
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
└── package.json
```

## Common Workflows

### Daily Contribution Workflow

```bash
# 1. Start contribute mode
contriflow contribute --language JavaScript

# 2. Select an issue
# Select from menu

# 3. Fork & setup
contriflow setup --repo owner/project --issue 123

# 4. Navigate and code
cd ~/.contriflow/workspace/project-name
git checkout -b feature/fix-123

# Edit files...

# 5. Commit and push
git add .
git commit -m "fix: resolve issue #123"
git push origin feature/fix-123

# 6. Create PR
contriflow pr --repo owner/project --branch feature/fix-123 --issue 123

# 7. Track progress
contriflow contribute --stats
```

### Search & Explore

```bash
# Search repositories
contriflow search --keyword "cli" --language Python --min-stars 100

# Explore issues in repository
contriflow issues --language Python --label "good-first-issue"

# Get contributing guidelines
contriflow setup --repo owner/project
```

## Tips & Best Practices

1. **Keep tokens safe**
   - Don't commit `.env` file
   - Use different tokens for different machines
   - Rotate tokens periodically

2. **Manage workspace**
   - Check `~/.contriflow/workspace/` regularly
   - Delete old cloned repos to save space
   - Use git to sync with upstream

3. **Use contribute mode**
   - Build streaks for motivation
   - Track points and achievements
   - Share progress with community

4. **Follow guidelines**
   - Always read CONTRIBUTING.md
   - Follow code style of project
   - Write descriptive commit messages
   - Link to related issues in PRs

## Getting Help

- 📖 **Documentation**: Check [README.md](./README.md)
- 🏗️ **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🐛 **Report issues**: https://github.com/sunder-kumar/contriflow-cli/issues
- 💬 **Ask questions**: https://github.com/sunder-kumar/contriflow-cli/discussions
- 🤝 **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Next Steps

1. ✅ Install ContriFlow
2. ✅ Set up authentication
3. ✅ Search for projects
4. ✅ Find your first issue
5. ✅ Make your first contribution
6. ✅ Track your streak

**Happy Contributing! 🚀**

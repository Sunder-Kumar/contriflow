# ContriFlow CLI

🚀 **Automate your open-source contributions with ContriFlow**

A powerful GitHub automation CLI tool that helps you discover, contribute to, and track your open-source contributions effortlessly.

## Features

- ✅ **GitHub Authentication** - Secure token-based authentication
- 🔍 **Repository Search** - Find projects by keywords and filter by stars/language
- 🐞 **Issue Discovery** - Locate beginner-friendly issues (good-first-issue, help-wanted)
- 🍴 **Auto Fork & Clone** - One-command repository setup
- 📖 **Contributing Guidelines** - Automatically fetch CONTRIBUTING.md
- 🤖 **AI Assistance** - Get smart suggestions for fixing issues using OpenRouter API
- 🌳 **Git Automation** - Create branches, commit, and push automatically
- 📤 **PR Management** - Create pull requests with templates
- 📊 **Streak Tracking** - Gamified contributions with daily streaks and points
- 📈 **Contribution History** - Track all your contributions in one place

## Installation

```bash
npm install -g contriflow-cli
```

Or install locally:

```bash
npm install
npm start
```

## Quick Start

### 1. Authenticate with GitHub

```bash
contriflow auth
```

You'll need a GitHub Personal Access Token with these scopes:
- `repo` - Full control of private repositories
- `public_repo` - Access public repositories
- `user` - User profile data

Create one at: https://github.com/settings/tokens

### 2. Search for Repositories

```bash
contriflow search --keyword "react" --language JavaScript --min-stars 100
```

### 3. Find Beginner-Friendly Issues

```bash
contriflow issues --language Python --label "good-first-issue"
```

### 4. Setup Repository & Start Contributing

```bash
contriflow setup --repo "facebook/react" --issue 123
```

This will:
- Fetch repository details
- Display CONTRIBUTING.md guidelines
- Fork the repository to your account
- Clone it locally to `~/.contriflow/workspace/`
- Add upstream remote for syncing

### 5. Enter Contribute Mode (Gamified)

```bash
contriflow contribute --language JavaScript
```

Track daily contributions, build streaks, earn points, and compete on leaderboards!

### 6. Create a Pull Request

```bash
contriflow pr --repo "owner/repo" --branch "feature/fix-issue-123" --issue 123
```

## CLI Commands

### `contriflow auth`
Authenticate with your GitHub account.

**Options:**
- `-t, --token <token>` - Provide token directly (optional, will prompt if not provided)

### `contriflow search`
Search for open-source repositories.

**Options:**
- `-k, --keyword <keyword>` - Search keyword (required)
- `-l, --language <language>` - Filter by programming language
- `--min-stars <number>` - Minimum stars (default: 10)
- `--max-stars <number>` - Maximum stars (default: 50000)
- `-p, --per-page <number>` - Results per page (default: 10)

**Example:**
```bash
contriflow search --keyword "vue" --language JavaScript --min-stars 500
```

### `contriflow issues`
Find beginner-friendly issues to work on.

**Options:**
- `-l, --label <label>` - Issue label (default: good-first-issue)
- `--language <language>` - Filter by repository language
- `--min-stars <number>` - Minimum repository stars
- `--max-stars <number>` - Maximum repository stars
- `-p, --per-page <number>` - Results per page (default: 10)

**Example:**
```bash
contriflow issues --label "help-wanted" --language Python
```

### `contriflow setup`
Fork and clone a repository to start working.

**Options:**
- `-r, --repo <repo>` - Repository (format: owner/repo)
- `-i, --issue <issue>` - Issue number to link

**Example:**
```bash
contriflow setup --repo "torvalds/linux" --issue 999
```

### `contriflow contribute`
Enter gamified Contribute Mode for tracking and streaks.

**Options:**
- `-l, --language <language>` - Preferred programming language
- `--daily` - Show only daily challenges
- `--stats` - Show contribution statistics

**Features in Contribute Mode:**
- 🔍 Find new issues
- 📊 View statistics
- 📝 View contribution history
- 🏆 Leaderboard (coming soon)
- 🔥 Streak tracking
- ⭐ Points and achievements

### `contriflow pr`
Create or manage pull requests.

**Options:**
- `-r, --repo <repo>` - Repository (format: owner/repo)
- `-b, --branch <branch>` - Branch name to push
- `-i, --issue <issue>` - Link to issue number
- `-t, --title <title>` - PR title
- `-d, --draft` - Create as draft PR

**Example:**
```bash
contriflow pr --repo "owner/repo" --branch "feature/fix-bug" --issue 123
```

## Configuration

Configuration is stored in `~/.contriflow/`:
- `config.json` - Your authentication and preferences
- `db/contributions.json` - Your contribution history and stats
- `workspace/` - Cloned repositories

### Environment Variables

Set these for enhanced functionality:

```bash
# Required for AI suggestions
export OPENROUTER_API_KEY="your-api-key"

# GitHub token (optional, can also use auth command)
export GITHUB_TOKEN="your-github-token"
```

Get your OpenRouter API key for free at: https://openrouter.ai

## Workflow Example

Here's a complete workflow for contributing:

```bash
# 1. Search for a project
contriflow search --keyword "cli" --language "TypeScript"

# 2. Find issues in the project
contriflow issues --language "TypeScript"

# 3. Setup and fork the repository
contriflow setup --repo "owner/project" --issue 42

# 4. Navigate to workspace
cd ~/.contriflow/workspace/project

# 5. Create feature branch
git checkout -b feature/fix-issue-42

# 6. Make your changes
# ... edit files ...

# 7. Commit changes
git add .
git commit -m "fix: resolve issue #42"

# 8. Create Pull Request
contriflow pr --repo "owner/project" --branch "feature/fix-issue-42" --issue 42

# 9. Track in Contribute Mode
contriflow contribute --stats
```

## Advanced Usage

### AI-Powered Issue Analysis

Get smart suggestions for fixing issues:

```bash
contriflow issues --language JavaScript
# Select an issue, then choose to view AI suggestions
```

### Gamified Contributions

Track your contribution streak and points:

```bash
contriflow contribute --language Python
# View stats, build streaks, earn points
```

### Custom Filters

Search with multiple filters:

```bash
contriflow search \
  --keyword "data-science" \
  --language Python \
  --min-stars 500 \
  --max-stars 100000
```

## Troubleshooting

### "GitHub token not found"
Run `contriflow auth` to authenticate first.

### "Invalid GitHub token"
Your token may be expired. Generate a new one at https://github.com/settings/tokens

### "CONTRIBUTING.md not found"
Some repositories may not have contributing guidelines. Check the repository's README instead.

### OpenRouter API errors
1. Verify `OPENROUTER_API_KEY` is set correctly
2. Check your API usage at https://openrouter.ai
3. Ensure you have available credits

### Clone fails
- Verify your token has `repo` scope
- Check internet connection
- Try authenticating again

## Development

### Setup Development Environment

```bash
git clone https://github.com/yourusername/contriflow-cli.git
cd contriflow-cli

npm install
npm start auth
npm start search --keyword "react"
```

### Project Structure

```
contriflow-cli/
├── src/
│   ├── commands/          # CLI command handlers
│   │   ├── auth.js       # Authentication
│   │   ├── search.js     # Repository search
│   │   ├── issues.js     # Issue discovery
│   │   ├── setup.js      # Fork & clone
│   │   ├── contribute.js # Contribute mode
│   │   └── pr.js         # PR management
│   ├── services/         # Business logic
│   │   ├── github.js     # Octokit initialization
│   │   ├── repositoryService.js
│   │   ├── issueService.js
│   │   ├── gitService.js
│   │   └── ai.js         # OpenRouter AI service
│   ├── utils/           # Utilities
│   │   └── display.js   # CLI formatting & output
│   ├── config/          # Configuration management
│   │   └── configManager.js
│   ├── db/              # Local database
│   │   └── contributionDb.js
│   └── index.js         # Main entry point
├── package.json
└── README.md
```

### Scripts

```bash
npm start              # Run CLI
npm run dev           # Run with watch mode
npm test              # Run tests
npm run lint          # Run eslint
npm run format        # Format code with prettier
```

## Contributing

We welcome contributions! Here's how to contribute to ContriFlow CLI:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/yourusername/contriflow-cli/issues)
- 💬 [Discussions](https://github.com/yourusername/contriflow-cli/discussions)
- 📧 Email: support@contriflow.dev

## Roadmap

- [ ] Web dashboard for contribution tracking
- [ ] Community leaderboards
- [ ] Team collaborations
- [ ] Automated testing for contributions
- [ ] Code review assistance
- [ ] Achievement badges and milestones
- [ ] Integration with more AI providers
- [ ] CI/CD pipeline integration

## Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Octokit](https://github.com/octokit/rest.js) - GitHub API
- [OpenRouter](https://openrouter.ai) - AI assistance
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI
- [Ora](https://github.com/sindresorhus/ora) - Loading spinners

---

**Happy Contributing! 🚀** Build your open-source portfolio with ContriFlow.

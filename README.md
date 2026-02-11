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

### 1. Log in to ContriFlow

```bash
contriflow login
```

Interactive login that validates your GitHub token and securely stores your credentials.

Alternative (simpler):
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

### `contriflow login`
Securely log in with your GitHub account (recommended).

Interactive login that validates your token with GitHub API, displays your profile information, and securely stores credentials.

**Options:**
- `-t, --token <token>` - Provide token directly (non-interactive, for automation)
- `--check` - Check if already logged in
- `--logout` - Log out and remove stored credentials

**Examples:**
```bash
# Interactive login (recommended)
contriflow login

# Non-interactive (for scripts/CI/CD)
contriflow login --token ghp_xxxxxxxxxxxxxxxxxxxxx

# Check login status
contriflow login --check

# Log out
contriflow login --logout
```

For detailed guide: See [LOGIN_GUIDE.md](./LOGIN_GUIDE.md)

### `contriflow auth`
Authenticate with your GitHub account (simpler alternative).

**Options:**
- `-t, --token <token>` - Provide token directly (optional, will prompt if not provided)

### `contriflow search`
Search for open-source repositories on GitHub.

**Arguments:**
- `[keyword]` - Search term (optional, prompts if not provided)

**Options:**
- `-k, --keyword <keyword>` - Search keyword (alternative to argument)
- `-l, --language <language>` - Filter by programming language
- `--stars <number>` - Minimum stars (shorthand for --min-stars)
- `--min-stars <number>` - Minimum stars (default: 10)
- `--max-stars <number>` - Maximum stars (default: 50000)
- `-p, --per-page <number>` - Results per page (default: 10)
- `-t, --table` - Display in table format (default)
- `--no-table` - Display in list format
- `--interactive` - Show interactive selection (default)
- `--no-interactive` - Skip interactive selection

**Examples:**
```bash
# Search with positional argument
contriflow search react

# Search with star filter
contriflow search react --stars 1000

# Search with language filter
contriflow search "web framework" --language python --stars 500

# Non-interactive table display
contriflow search typescript --stars 1000 --no-interactive --table

# List format
contriflow search cli --language go --no-table
```

For detailed usage: See [SEARCH_GUIDE.md](./SEARCH_GUIDE.md)

### `contriflow issues`
Find and list GitHub issues - supports global search and repository-specific queries.

**Arguments:**
- `[repo]` - Repository in format owner/repo (optional)

**Options:**
- `-l, --label <label>` - Issue label to filter by
- `--language <language>` - Filter by repository language (global search only)
- `--min-stars <number>` - Minimum repository stars (global search only, default: 10)
- `--max-stars <number>` - Maximum repository stars (global search only, default: 50000)
- `-p, --per-page <number>` - Results per page (default: 10)
- `--state <state>` - Issue state: open, closed, all (default: open)
- `-t, --table` - Display in table format (default)
- `--no-table` - Display in detailed list format
- `--interactive` - Show interactive selection (default)
- `--no-interactive` - Skip interactive selection (good for scripts/CI-CD)

**Examples:**
```bash
# Global search - find beginner issues
contriflow issues
contriflow issues --label help-wanted --language python

# Repository-specific - list issues in a project
contriflow issues facebook/react
contriflow issues nodejs/node --label bug

# List closed issues
contriflow issues angular/angular --state closed

# Show all issues (open + closed)
contriflow issues torvalds/linux --state all --per-page 5

# Non-interactive for automation
contriflow issues facebook/react --no-interactive

# List format for more details
contriflow issues kubernetes/kubernetes --no-table
```

For comprehensive guide: See [ISSUES_GUIDE.md](./ISSUES_GUIDE.md)

For testing and verification: See [ISSUES_TESTING.md](./ISSUES_TESTING.md)

For implementation details: See [ISSUES_IMPLEMENTATION.md](./ISSUES_IMPLEMENTATION.md)

### `contriflow fork`
Fork a repository to your GitHub account using the GitHub API.

**Arguments:**
- `[repo]` - Repository in format owner/repo (optional, will prompt if not provided)

**Options:**
- `-c, --clone` - Automatically clone the forked repository
- `--no-interactive` - Skip confirmation prompts
- `-h, --help` - Display help information

**Examples:**
```bash
# Interactive fork with confirmation
contriflow fork facebook/react

# Non-interactive fork
contriflow fork nodejs/node --no-interactive

# Fork and auto-clone
contriflow fork angular/angular --clone

# Interactive repo selection
contriflow fork
```

**Features:**
- Shows repository information before forking
- Confirms fork action (interactive mode)
- Handles already-forked repositories
- Suggests next steps (clone, setup, manual git)
- Integrates with `contriflow setup` for cloning

For comprehensive guide: See [FORK_GUIDE.md](./FORK_GUIDE.md)

For testing and verification: See [FORK_TESTING.md](./FORK_TESTING.md)

For implementation details: See [FORK_IMPLEMENTATION.md](./FORK_IMPLEMENTATION.md)

### `contriflow clone`
Clone a repository to your workspace directory using git.

**Arguments:**
- `[repo]` - Repository in format owner/repo (optional, will prompt if not provided)

**Options:**
- `-a, --add-upstream` - Automatically add upstream remote (for forks)
- `-d, --directory <dir>` - Custom directory for cloning (default: ~/.contriflow/workspace)
- `--no-interactive` - Skip confirmation prompts
- `-h, --help` - Display help information

**Examples:**
```bash
# Simple clone to default workspace
contriflow clone facebook/react

# Non-interactive clone
contriflow clone nodejs/node --no-interactive

# Clone with upstream remote (for forks)
contriflow clone your-username/react --add-upstream

# Clone to custom directory
contriflow clone angular/angular --directory ~/projects/angular

# Interactive repo selection
contriflow clone
```

**Features:**
- Shows repository information before cloning
- Git-based cloning to workspace or custom location
- Optional upstream remote for forks
- Automatic directory creation
- Conflict detection for existing directories
- Clear next steps for working with cloned code

For comprehensive guide: See [CLONE_GUIDE.md](./CLONE_GUIDE.md)

For testing and verification: See [CLONE_TESTING.md](./CLONE_TESTING.md)

For implementation details: See [CLONE_IMPLEMENTATION.md](./CLONE_IMPLEMENTATION.md)

### `contriflow guide <owner>/<repo>`
Fetch and display contribution guidelines from a repository.

**Syntax:**
```bash
contriflow guide facebook/react
```

**Features:**
- Fetches CONTRIBUTING.md and CODE_OF_CONDUCT.md
- Shows repository information and contribution guidelines
- Supports filtering to specific files
- Brief mode for quick preview
- Interactive and non-interactive modes
- Clear next steps for contributing

**Options:**
- `-c, --contributing` - Show only CONTRIBUTING.md
- `-o, --code-of-conduct` - Show only CODE_OF_CONDUCT.md
- `-b, --brief` - Show first 500 characters (quick preview)
- `--no-interactive` - Skip confirmation prompts

**Examples:**

View all guidelines:
```bash
contriflow guide facebook/react --no-interactive
```

View only contributing guidelines:
```bash
contriflow guide django/django --contributing
```

Quick preview with brief mode:
```bash
contriflow guide nodejs/node --brief
```

For comprehensive guide: See [GUIDE_GUIDE.md](./GUIDE_GUIDE.md)

For testing and verification: See [GUIDE_TESTING.md](./GUIDE_TESTING.md)

For implementation details: See [GUIDE_IMPLEMENTATION.md](./GUIDE_IMPLEMENTATION.md)

### `contriflow solve <issue_number> <owner>/<repo>`
Solve a GitHub issue using AI and generate a patch file.

**Syntax:**
```bash
contriflow solve 123 facebook/react
```

**Features:**
- Fetches issue content from GitHub
- Sends issue to AI for analysis
- Generates code patch and explanation
- Saves solution as patch file
- Extracts code blocks automatically
- Works with or without AI key

**Prerequisites:**
- GitHub authentication (required)
- OpenRouter API key (optional, for AI solutions)

**Options:**
- `--no-ai` - Save issue as template without AI generation
- `--no-interactive` - Skip confirmation prompts

**Examples:**

Solve issue with AI:
```bash
contriflow solve 123 facebook/react
```

Save as template without AI:
```bash
contriflow solve 456 django/django --no-ai
```

**Setting AI Key:**
```bash
contriflow config --set-ai-key sk-or-v1-xxxxxxxxxxxx
```
Get a key at: https://openrouter.ai

For comprehensive guide: See [SOLVE_GUIDE.md](./SOLVE_GUIDE.md)

For testing and verification: See [SOLVE_TESTING.md](./SOLVE_TESTING.md)

For implementation details: See [SOLVE_IMPLEMENTATION.md](./SOLVE_IMPLEMENTATION.md)

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

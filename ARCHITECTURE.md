# API Documentation

## Services

### GitHub Service (`src/services/github.js`)

Handles Octokit initialization and token verification.

```javascript
// Initialize Octokit with token
import { initializeOctokit } from './services/github.js';
const octokit = await initializeOctokit(token);

// Get initialized instance
import { getOctokit } from './services/github.js';
const octokit = getOctokit();

// Verify token is valid
import { verifyToken } from './services/github.js';
const user = await verifyToken(token);
```

### Repository Service (`src/services/repositoryService.js`)

Repository search and management.

```javascript
import { 
  searchRepositories,
  getRepositoryDetails,
  getContributingGuidelines,
  forkRepository,
  checkIfForked
} from './services/repositoryService.js';

// Search repositories
const repos = await searchRepositories('react', {
  language: 'JavaScript',
  minStars: 100,
  maxStars: 50000,
  perPage: 10
});

// Get detailed information
const details = await getRepositoryDetails('facebook', 'react');

// Fetch contributing guidelines
const guidelines = await getContributingGuidelines('facebook', 'react');

// Fork repository
const forked = await forkRepository('facebook', 'react');
```

### Issue Service (`src/services/issueService.js`)

Discover and manage GitHub issues.

```javascript
import {
  searchIssues,
  getIssueDetails,
  getIssueComments,
  filterIssuesByLanguage
} from './services/issueService.js';

// Search for beginner-friendly issues
const issues = await searchIssues({
  label: 'good-first-issue',
  language: 'Python',
  perPage: 10
});

// Get issue details
const issue = await getIssueDetails('owner', 'repo', 123);

// Get comments on issue
const comments = await getIssueComments('owner', 'repo', 123);

// Filter by language
const filtered = await filterIssuesByLanguage(issues, 'JavaScript');
```

### Git Service (`src/services/gitService.js`)

Git operations and pull request management.

```javascript
import {
  createBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
  getPullRequest,
  updatePullRequest
} from './services/gitService.js';

// Create a feature branch
await createBranch('/path/to/repo', 'feature/fix-bug', 'main');

// Commit changes
await commitChanges('/path/to/repo', 'Fix: resolve bug #123', ['src/file.js']);

// Push to remote
await pushBranch('/path/to/repo', 'feature/fix-bug', 'https://github.com/user/repo');

// Create pull request
const pr = await createPullRequest('owner', 'repo', {
  title: 'Fix: bug resolution',
  body: 'This PR fixes issue #123',
  head: 'user:feature/fix-bug',
  base: 'main'
});
```

### AI Service (`src/services/ai.js`)

AI-powered suggestions using OpenRouter.

```javascript
import {
  suggestFixForIssue,
  generateCommitMessage
} from './services/ai.js';

// Get fix suggestions for an issue
const suggestion = await suggestFixForIssue(
  'Issue body content',
  'Issue title',
  'JavaScript'
);

// Generate commit message
const message = await generateCommitMessage(
  'Issue title',
  'Description of fix'
);
```

## Configuration

### Config Manager (`src/config/configManager.js`)

```javascript
import {
  ensureConfigDir,
  saveConfig,
  loadConfig,
  getToken,
  saveToken,
  getConfigPath,
  getDbPath
} from './config/configManager.js';

// Ensure config directory exists
await ensureConfigDir();

// Load/save full config
const config = await loadConfig();
config.key = 'value';
await saveConfig(config);

// Token management
const token = await getToken();
await saveToken(newToken);

// Get file paths
const configPath = getConfigPath('custom.json');
const dbPath = getDbPath('data.json');
```

## Database

### Contribution Database (`src/db/contributionDb.js`)

Track user contributions locally.

```javascript
import { ContributionDatabase } from './db/contributionDb.js';

const db = new ContributionDatabase();

// Add contribution
await db.addContribution({
  issueNumber: 123,
  issueTitle: 'Fix bug',
  repository: 'owner/repo',
  issueUrl: 'https://...',
  points: 25,
  completed: false
});

// Get statistics
const stats = await db.getStats();
// { total, streak, points, lastContribution }

// Get contributions
const contributions = await db.getContributions(20);

// Search
const results = await db.searchContributions('react');
```

## Display Utilities

### Display Module (`src/utils/display.js`)

CLI output and formatting utilities.

```javascript
import {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printWarning,
  printSection,
  startSpinner,
  prompt,
  formatRepositoryInfo,
  formatIssueInfo,
  formatStreakStats,
  displayTable
} from './utils/display.js';

// Print formatted output
printHeader('My Title');
printSuccess('Operation successful');
printError('Something went wrong');
printInfo('Information message');
printWarning('Warning message');

// Sections
printSection('Section Title');

// Loading spinner
const spinner = await startSpinner('Loading...');
spinner.succeed('Done!');
spinner.fail('Failed!');

// Interactive prompts
const answer = await prompt([{
  type: 'input',
  name: 'name',
  message: 'Enter your name:'
}]);

// Format data
console.log(formatRepositoryInfo(repo));
console.log(formatIssueInfo(issue));
console.log(formatStreakStats(stats));

// Display table
displayTable(['Column 1', 'Column 2'], [
  ['Row 1 Col 1', 'Row 1 Col 2'],
  ['Row 2 Col 1', 'Row 2 Col 2']
]);
```

## Common Workflows

### Search → Setup → Contribute

```javascript
import { searchRepositories } from './services/repositoryService.js';
import { searchIssues } from './services/issueService.js';
import { forkRepository } from './services/repositoryService.js';

// 1. Search repositories
const repos = await searchRepositories('react', { minStars: 100 });

// 2. Get issues from selected repo
const issues = await searchIssues({ 
  label: 'good-first-issue',
  perPage: 5 
});

// 3. Fork repository
const forked = await forkRepository('facebook', 'react');
```

### Create and Push PR

```javascript
import { createBranch, commitChanges, pushBranch } from './services/gitService.js';
import { createPullRequest } from './services/gitService.js';

const repoPath = '/path/to/repo';

// 1. Create branch
await createBranch(repoPath, 'feature/fix-123', 'main');

// 2. Make changes (edit files)

// 3. Commit changes
await commitChanges(repoPath, 'Fix: resolved issue #123', ['src/file.js']);

// 4. Push to remote
await pushBranch(repoPath, 'feature/fix-123', 'https://github.com/user/repo');

// 5. Create PR
const pr = await createPullRequest('user', 'repo', {
  title: 'Fix: issue #123',
  body: 'Resolved the bug',
  head: 'user:feature/fix-123',
  base: 'main'
});
```

## Error Handling

All services throw descriptive errors:

```javascript
try {
  await someOperation();
} catch (error) {
  console.error(error.message);
  // Example: "GitHub token not found. Run: contriflow auth"
}
```

## Testing Examples

See `__tests__/` directory for comprehensive test examples.

```javascript
import { searchRepositories } from './services/repositoryService.js';

describe('repositoryService', () => {
  test('searches repositories successfully', async () => {
    const repos = await searchRepositories('react');
    expect(repos).toBeDefined();
    expect(repos.length).toBeGreaterThan(0);
  });
});
```

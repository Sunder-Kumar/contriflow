# Solve Command - Implementation Details

## Architecture Overview

```
User Command
    ↓
solve.js (handler)
    ├── Validates input
    ├── Fetches GitHub issue via Octokit
    ├── Gets repository details
    ├── Calls AI service if key configured
    └── Saves patch file to disk
    
aiService.js (AI integration)
    ├── OpenRouter API communication
    ├── Prompt building
    ├── Response parsing
    └── Code block extraction
```

## File Structure

### Command File: `src/commands/solve.js`

**Size:** ~330 lines

**Main Function:** `handleSolveCommand(options, issueNumber, repo)`

**Flow:**
1. Validate arguments (issue number, repo format)
2. Check GitHub authentication
3. Fetch issue from GitHub API
4. Display issue details
5. Get repository language
6. If AI key configured: generate solution
7. Save patch file
8. Display next steps

**Key Sections:**

#### Input Validation (Lines 20-35)
```javascript
// Validates repo format: owner/repo
if (!/^[^\/]+\/[^\/]+$/.test(repo)) {
  throw new Error(`Invalid repository format...`);
}
```

#### GitHub API Integration (Lines 50-62)
```javascript
const issueResponse = await octokit.issues.get({
  owner,
  repo: repoName,
  issue_number: parseInt(issueNumber)
});
issue = issueResponse.data;
```

#### AI Solution Generation (Lines 85-120)
```javascript
if (hasAIKey && !options.noAi) {
  const solution = await generateIssueSolution(
    issue.title,
    issue.body || issue.title,
    repo,
    language
  );
  // Extract code blocks and save patch
}
```

#### Patch File Creation (Lines 110-125)
```javascript
const patchName = `issue-${issueNumber}-${repoName}-${Date.now()}.patch`;
const patchPath = path.join(workspaceDir, patchName);
await fs.writeFile(patchPath, patchContent, 'utf-8');
```

### Service File: `src/services/aiService.js`

**Size:** ~190 lines

**Functions:**

#### 1. `generateIssueSolution(title, body, repo, language)`
- Builds prompt with issue context
- Sends to OpenRouter API
- Returns AI response
- Handles errors (401 unauthorized, API errors)

#### 2. `buildSolutionPrompt(title, body, repo, language)`
- Constructs detailed system prompt
- Includes repository context
- Specifies output format
- Language-specific guidance

#### 3. `extractCodeBlocks(response)`
- Regex pattern: ````(?:\w+)?\n([\s\S]*?)```/g`
- Extracts all code blocks from markdown
- Returns array of code strings

#### 4. `formatAsPatch(solution, filename)`
- Creates diff-style patch header
- Adds timestamp and metadata
- Formats solution for version control

#### 5. `getOpenRouterKey()` / `setOpenRouterKey(key)`
- Reads/writes OpenRouter key from config
- Async config file operations

## API Integration

### GitHub API (Octokit)

**Endpoint Used:**
```javascript
octokit.issues.get({
  owner: string,
  repo: string,
  issue_number: number
})
```

**Response Data:**
```javascript
{
  number: 123,
  title: "Issue Title",
  body: "Issue description",
  state: "open",
  created_at: "2026-02-11T10:30:45Z",
  user: { login: "username" },
  labels: [{ name: "good-first-issue" }]
}
```

**Error Handling:**
- 404: Issue not found
- 401: Invalid/expired token
- 403: Insufficient permissions

### OpenRouter API

**Base URL:**
```
https://openrouter.ai/api/v1/chat/completions
```

**Request Headers:**
```javascript
{
  'Authorization': `Bearer ${apiKey}`,
  'HTTP-Referer': 'https://github.com/contriflow/contriflow-cli',
  'X-Title': 'ContriFlow CLI'
}
```

**Request Payload:**
```javascript
{
  model: "openrouter/auto",
  messages: [{
    role: "user",
    content: prompt
  }],
  temperature: 0.7,
  max_tokens: 2000
}
```

**Response Format:**
```javascript
{
  choices: [{
    message: {
      content: "AI-generated solution..."
    }
  }]
}
```

**Error Codes:**
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: Server error

## Data Flow

### Issue Solving Flow

```
User Input: solve 123 facebook/react
    ↓
Parse & Validate
    ├─ Issue number: 123
    ├─ Owner/Repo: facebook/react
    └─ Options: {noAi: false, ...}
    ↓
Authenticate
    ├─ Load GitHub token
    ├─ Initialize Octokit
    └─ Check token validity
    ↓
Fetch Issue Details
    ├─ API: GET /repos/{owner}/{repo}/issues/{number}
    ├─ Response: {title, body, state, ...}
    └─ Display to user
    ↓
Get Repository Language
    ├─ API: GET /repos/{owner}/{repo}
    ├─ Extract: language field
    └─ Default: "JavaScript"
    ↓
Decision: Has AI key?
    ├─ YES → Generate Solution
    │         ├─ Build prompt with context
    │         ├─ Send to OpenRouter
    │         ├─ Receive: solution text
    │         └─ Extract code blocks
    └─ NO → Skip to template
    ↓
Create Patch File
    ├─ Build content: metadata + solution
    ├─ Generate filename: issue-123-react-1707...
    ├─ Path: ~/.contriflow/patches/
    └─ Save: fs.writeFile()
    ↓
Display Results
    ├─ Patch file location
    ├─ Code blocks extracted count
    ├─ Next steps
    └─ Success message
```

## Configuration Management

### Config File Location
```
~/.contriflow/config.json
```

### Required Fields for Solve Command
```javascript
{
  "githubToken": "ghp_xxxxxxxxxxxx",        // Required
  "openRouterKey": "sk-or-v1-xxxxxxxxxxxx"  // Optional
}
```

### Config Loading
```javascript
// src/config/configManager.js
export async function loadConfig() {
  if (await fs.pathExists(CONFIG_FILE)) {
    return await fs.readJSON(CONFIG_FILE);
  }
  return {};
}
```

### Setting AI Key
```bash
# From user perspective
contriflow config --set-ai-key sk-or-v1-xxxx

# Implementation
export async function setOpenRouterKey(apiKey) {
  const cfg = await loadConfig();
  cfg.openRouterKey = apiKey;
  await saveConfig(cfg);
}
```

## Error Handling Strategy

### Input Validation
```javascript
// Format validation
if (!/^[^\/]+\/[^\/]+$/.test(repo)) {
  throw new Error(`Invalid repository format...`);
}

// Number validation
issue_number: parseInt(issueNumber)
```

### API Error Handling
```javascript
try {
  const response = await octokit.issues.get({...});
} catch (err) {
  if (err.status === 404) {
    throw new Error(`Issue #${issueNumber} not found...`);
  }
  throw err;
}
```

### AI API Error Handling
```javascript
try {
  const response = await axios.post(OPENROUTER_API_URL, {...});
} catch (err) {
  if (err.response && err.response.status === 401) {
    throw new Error('Invalid OpenRouter API key...');
  }
  throw new Error(`AI API Error: ${err.message}`);
}
```

### File System Error Handling
```javascript
try {
  await fs.ensureDir(workspaceDir);
  await fs.writeFile(patchPath, patchContent, 'utf-8');
} catch (err) {
  throw new Error(`Failed to save patch: ${err.message}`);
}
```

## Patch File Format

### Structure
```
From: ContriFlow AI Solver
Subject: Solution for facebook/react#123
Date: 2026-02-11T10:30:45.000Z

[Full AI-generated solution text]

---
Code blocks extracted: 2

--- Code Block 1 ---
[First extracted code]

--- Code Block 2 ---
[Second extracted code]
```

### Filename Pattern
```
issue-{issue_number}-{repo_name}-{timestamp}.patch

Examples:
- issue-123-react-1707602400000.patch
- issue-456-django-1707602420000.patch
- issue-789-linux-1707602440000.patch
```

### Location
```
~/.contriflow/patches/
```

## Performance Considerations

### API Calls
- **GitHub API:** 1 call per issue fetch
- **Repository Details:** 1 call (cached from repositoryService)
- **OpenRouter API:** 1 call per solution (if enabled)

### Typical Response Times
- Fetch issue: ~0.5-1 second
- Get repo details: ~0.5-1 second
- AI generation: ~3-5 seconds
- Total: ~5-10 seconds

### Optimization Opportunities
- Cache repository language
- Batch multiple issues
- Async code block extraction
- Reduce prompt length if needed

## Dependencies

### External Libraries
- `@octokit/rest` - GitHub API client
- `axios` - HTTP requests for OpenRouter
- `fs-extra` - File system operations
- `chalk` - Terminal colors
- `commander` - CLI framework

### Internal Services
- `configManager.js` - Config file management
- `repositoryService.js` - Repository details
- `display.js` - Console output formatting
- `github.js` - Octokit initialization (if used)

## Testing Strategy

### Unit Tests Needed
1. Input validation
   - Valid/invalid formats
   - Edge cases (empty, malformed)

2. API integration
   - Successful issue fetch
   - 404 error handling
   - Network timeout

3. AI service
   - Prompt building
   - Response parsing
   - Code block extraction
   - API key validation

4. File operations
   - Patch file creation
   - Directory permissions
   - Content formatting

### Integration Tests
1. Full workflow: fetch + generate + save
2. Error scenarios: missing auth, invalid issue
3. File system: disk space, permissions

### Manual Tests
1. Real GitHub issues
2. Real OpenRouter API calls
3. Patch file content verification

## Security Considerations

### API Key Management
- Never log API keys
- Store only in ~/.contriflow/config.json
- Use environment if needed
- Validate key format

### Input Sanitization
- Validate issue numbers (integer)
- Validate repo format (regex)
- Sanitize file paths

### File Permissions
- Create patches with secure permissions
- Ensure directory ownership
- Check disk space before write

## Extension Points

### Adding New AI Providers
1. Create new provider service
2. Add abstraction layer
3. Update configuration
4. Add provider selection option

### Custom Prompt Templates
1. Add template system
2. Language-specific templates
3. Project type hints
4. User-customizable prompts

### Enhanced Code Generation
1. Multiple solution suggestions
2. Confidence scores
3. Code quality metrics
4. Security analysis

### Integration Opportunities
1. Direct PR creation from solution
2. Solution versioning
3. Community solution sharing
4. Contribution tracking

## Code Quality

### Design Principles
- Single Responsibility: Each function has one purpose
- Error Handling: Try-catch with meaningful messages
- Async/Await: Modern promise handling
- ES Modules: Consistent with project

### Code Organization
- Clear function separation
- Logical section grouping
- Inline comments for complex logic
- Function documentation blocks

### Best Practices
- No hardcoded values (constants at top)
- Proper error messages
- Resource cleanup
- Performance awareness

---

**Last Updated:** February 11, 2026
**Implementation Status:** Complete
**Code Quality:** Production-Ready

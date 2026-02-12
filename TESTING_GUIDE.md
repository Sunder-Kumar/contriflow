# 🧪 Testing Guide - How to Write Tests for ContriFlow CLI

**Purpose:** This guide explains how to customize and implement the example tests in `__tests__/example.test.js`

---

## Overview

The `__tests__/example.test.js` file is a **template** with test structures ready for you to implement. Each test has:

1. **A descriptive name** - What the test checks
2. **A TODO comment** - Explanation of what to test
3. **Example code** - How to implement the test
4. **A placeholder** - `expect(true).toBe(true)` to replace

---

## How to Customize Tests

### Step 1: Understand the Structure

```javascript
test('should do something', async () => {
  // TODO: Description of what this test does
  // Example: const result = await functionToTest();
  // expect(result.success).toBe(true);
  expect(true).toBe(true);  // ← REPLACE THIS
});
```

### Step 2: Replace the Placeholder

Remove the placeholder line and add real test code:

```javascript
test('should do something', async () => {
  // TODO: Test authentication with valid token
  // Example: const result = await loginCommand({ token: validToken });
  // expect(result.success).toBe(true);
  
  // YOUR IMPLEMENTATION HERE:
  const result = await loginCommand({ token: 'valid_github_token' });
  expect(result.success).toBe(true);
  expect(result.username).toBeDefined();
});
```

### Step 3: Import Required Functions

Add imports at the top of the test file:

```javascript
import { loginCommand } from '../src/commands/login.js';
import { searchRepositories } from '../src/services/repositoryService.js';
import { recordContribution } from '../src/services/contributionService.js';
// ... import other functions you're testing
```

---

## Test Implementation Examples

### Authentication Test

```javascript
test('should authenticate with valid token', async () => {
  // Import: import { loginCommand } from '../src/commands/login.js';
  const result = await loginCommand({ token: process.env.TEST_GITHUB_TOKEN });
  expect(result.success).toBe(true);
  expect(result.username).toBeDefined();
  expect(result.username).not.toBeNull();
});
```

### Repository Search Test

```javascript
test('should search repositories by keyword', async () => {
  // Import: import { searchRepositories } from '../src/services/repositoryService.js';
  const repos = await searchRepositories('react', { minStars: 1000 });
  expect(repos.length).toBeGreaterThan(0);
  expect(repos[0].name).toBeDefined();
  expect(repos[0].stars).toBeGreaterThanOrEqual(1000);
});
```

### Issue Discovery Test

```javascript
test('should find good-first-issue labeled issues', async () => {
  // Import: import { findIssues } from '../src/services/issueService.js';
  const issues = await findIssues('facebook', 'react', 'good-first-issue');
  expect(issues.length).toBeGreaterThan(0);
  expect(issues[0].labels).toContain('good-first-issue');
  expect(issues[0].number).toBeDefined();
});
```

### Contribution Tracking Test

```javascript
test('should add contribution to database', async () => {
  // Import: import { recordContribution } from '../src/services/contributionService.js';
  const result = await recordContribution(123, 'owner/repo', 'Fix bug');
  expect(result.success).toBe(true);
  
  const stats = await getStats();
  expect(stats.totalContributions).toBeGreaterThan(0);
});
```

### AI Solution Test

```javascript
test('should generate AI solution for issue', async () => {
  // Import: import { generateIssueSolution } from '../src/services/aiService.js';
  const issueDescription = 'Fix broken button in navbar';
  const solution = await generateIssueSolution(issueDescription);
  
  expect(solution).toBeDefined();
  expect(solution.length).toBeGreaterThan(0);
  expect(solution).toContain('code');
});
```

### PR Creation Test

```javascript
test('should create pull request', async () => {
  // Import: import { createPullRequest } from '../src/services/prService.js';
  const pr = await createPullRequest({
    issueNumber: 123,
    repo: 'owner/repo',
    branch: 'fix/issue-123-fix-bug'
  });
  
  expect(pr.success).toBe(true);
  expect(pr.prUrl).toContain('github.com');
  expect(pr.prUrl).toContain('pull');
});
```

---

## Running Tests

### Install Jest

```bash
npm install --save-dev jest
```

### Update package.json

Add test script:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- __tests__/example.test.js

# Run specific test
npm test -- --testNamePattern="should authenticate"
```

---

## Test Categories & Implementation Priority

### Priority 1: Core Functionality (MUST HAVE)
- [x] Authentication tests
- [x] Repository search tests
- [x] Issue discovery tests
- [x] Fork/clone tests
- [x] Contribution tracking tests

### Priority 2: Advanced Features (IMPORTANT)
- [ ] AI solution tests
- [ ] PR creation tests
- [ ] Gamification/badge tests
- [ ] Dashboard tests

### Priority 3: Error Handling (RECOMMENDED)
- [ ] API error tests
- [ ] Auth error tests
- [ ] Database error tests
- [ ] Network error tests

### Priority 4: Integration (NICE TO HAVE)
- [ ] Full workflow tests
- [ ] Multi-step tests
- [ ] Command integration tests

---

## Best Practices for Testing

### 1. Use Environment Variables for Secrets
```javascript
const token = process.env.TEST_GITHUB_TOKEN;
// Never hardcode real tokens!
```

### 2. Mock External APIs (For Faster Tests)
```javascript
jest.mock('../src/services/repositoryService.js', () => ({
  searchRepositories: jest.fn().mockResolvedValue([
    { name: 'test-repo', stars: 1000 }
  ])
}));
```

### 3. Create Test Fixtures/Helpers
```javascript
const createTestIssue = () => ({
  number: 123,
  title: 'Test Issue',
  body: 'Test body',
  labels: ['good-first-issue']
});
```

### 4. Use Descriptive Test Names
```javascript
// Good ✓
test('should increment streak when contributing next day', () => {});

// Bad ✗
test('test streak', () => {});
```

### 5. Test One Thing Per Test
```javascript
// Good ✓
test('should create repository fork', () => {
  // Only test fork, not clone
});

// Bad ✗
test('should fork and clone repository', () => {
  // Testing multiple things
});
```

---

## Common Test Patterns

### Async Functions
```javascript
test('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Error Handling
```javascript
test('should throw error on invalid input', async () => {
  await expect(loginCommand({ token: '' })).rejects.toThrow();
});
```

### Database Operations
```javascript
test('should save and retrieve contribution', async () => {
  await recordContribution(123, 'repo', 'title');
  const stats = await getStats();
  expect(stats.totalContributions).toBe(1);
});
```

### Multiple Assertions
```javascript
test('should return complete user profile', async () => {
  const user = await getUser();
  expect(user.username).toBeDefined();
  expect(user.email).toBeDefined();
  expect(user.repos).toBeGreaterThan(0);
});
```

---

## Debugging Tests

### Run Tests with Logging
```bash
npm test -- --verbose
```

### Run Single Test
```bash
npm test -- --testNamePattern="should authenticate"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

---

## Next Steps

1. **Install Jest:** `npm install --save-dev jest`
2. **Setup:** Update `package.json` with test script
3. **Customize:** Replace `expect(true).toBe(true)` with real tests
4. **Run:** `npm test`
5. **Check Coverage:** `npm run test:coverage`

---

## Example: Complete Customized Test

Here's a complete example of a properly implemented test:

```javascript
import { loginCommand } from '../src/commands/login.js';
import { loadConfig } from '../src/config/configManager.js';

describe('Authentication - Complete Example', () => {
  test('should successfully authenticate with valid GitHub token', async () => {
    // Setup
    const validToken = process.env.TEST_GITHUB_TOKEN;
    expect(validToken).toBeDefined(); // Ensure token is set in environment

    // Action
    const result = await loginCommand({ token: validToken });

    // Assertions
    expect(result.success).toBe(true);
    expect(result.username).toBeDefined();
    expect(result.username).not.toEqual('');
    expect(result.message).toContain('successfully');

    // Verify it's saved
    const config = await loadConfig();
    expect(config.githubToken).toBe(validToken);
    expect(config.githubUsername).toBe(result.username);
  });
});
```

---

## Summary

The `__tests__/example.test.js` file is your **testing template**. It provides:

✅ Complete test structure  
✅ Descriptive test names  
✅ Implementation examples  
✅ Comments for guidance  

Your job is to:

1. Install Jest
2. Import the functions you want to test
3. Replace `expect(true).toBe(true)` with real tests
4. Run `npm test`
5. Watch your tests pass! ✨

---

**Start with Priority 1 tests (core functionality) and work your way up!**

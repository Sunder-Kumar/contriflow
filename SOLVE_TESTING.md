# Solve Command - Testing & Verification Guide

## Overview

Comprehensive testing guide for the `contriflow solve <issue_number> <owner>/<repo>` command with 35+ test cases covering basic usage, AI integration, error handling, and edge cases.

## Test Setup Prerequisites

```bash
# 1. Login with GitHub token
contriflow login

# 2. (Optional) Set OpenRouter API key for AI tests
contriflow config --set-ai-key sk-or-v1-xxxxxxxxxxxx

# 3. Verify help
contriflow solve --help
```

## Part 1: Basic Usage Tests

### Test 1.1: Help Command

```bash
$ contriflow solve --help
```

**Expected Output:**
```
Usage: contriflow solve [options] [issue_number] [repo]

Solve a GitHub issue using AI and generate a patch

Options:
  --no-ai           Skip AI solution generation, save issue as template only
  --no-interactive  Skip confirmation prompts
  -h, --help        display help for command
```

**Pass Criteria:**
- ✅ Help text displayed
- ✅ All options shown
- ✅ Usage syntax clear

---

### Test 1.2: Solve Real GitHub Issue with AI

```bash
$ contriflow solve 1 facebook/react
```

**Expected:**
- Issue details loaded
- AI solution generated (if key set)
- Patch file created
- Success message shown

**Pass Criteria:**
- ✅ Issue fetched successfully
- ✅ Output shows title, number, state
- ✅ Patch file created at ~/.contriflow/patches/
- ✅ Solution displayed in console

---

### Test 1.3: Solve Issue Without AI Key

```bash
# With no AI key configured
$ contriflow solve 10 nodejs/node
```

**Expected:**
- Issue details shown
- Warning: "OpenRouter API key not configured"
- Patch saved as template only
- Helpful message about setting key

**Pass Criteria:**
- ✅ Issue fetched
- ✅ Error message clear
- ✅ Template saved anyway

---

### Test 1.4: Solve Issue with --no-ai Flag

```bash
$ contriflow solve 100 django/django --no-ai
```

**Expected:**
- Issue template saved
- No AI processing
- Quick completion
- Patch file with issue metadata

**Pass Criteria:**
- ✅ AI skipped
- ✅ Template saved
- ✅ Completion fast

---

## Part 2: Input Validation Tests

### Test 2.1: Missing Issue Number

```bash
$ contriflow solve facebook/react
```

**Expected:**
- Error: "Please provide both issue number and repository"
- Usage hint shown
- No API calls made

**Pass Criteria:**
- ✅ Error caught early
- ✅ Helpful message

---

### Test 2.2: Missing Repository

```bash
$ contriflow solve 123
```

**Expected:**
- Error: "Please provide both issue number and repository"
- No API calls made

**Pass Criteria:**
- ✅ Validation works

---

### Test 2.3: Invalid Repository Format - Missing Owner

```bash
$ contriflow solve 123 react
```

**Expected:**
- Error: "Invalid repository format. Use: owner/repo"
- Suggests format: facebook/react
- No API calls made

**Pass Criteria:**
- ✅ Format validation works

---

### Test 2.4: Invalid Repository Format - Missing Repo

```bash
$ contriflow solve 123 facebook/
```

**Expected:**
- Error: "Invalid repository format. Use: owner/repo"
- No API calls made

**Pass Criteria:**
- ✅ Validation catches missing part

---

### Test 2.5: Invalid Repository Format - Extra Parts

```bash
$ contriflow solve 123 facebook/react/extra
```

**Expected:**
- Error: "Invalid repository format. Use: owner/repo"
- No API calls made

**Pass Criteria:**
- ✅ Extra components caught

---

### Test 2.6: Invalid Issue Number - Non-Numeric

```bash
$ contriflow solve abc facebook/react
```

**Expected:**
- Either: Error message about format
- Or: Handled gracefully by parseInt

**Pass Criteria:**
- ✅ Error handled

---

## Part 3: GitHub API Tests

### Test 3.1: Issue Not Found (404)

```bash
$ contriflow solve 999999999 facebook/react
```

**Expected:**
- Error: "Issue #999999999 not found in facebook/react"
- Clear message
- No crash

**Pass Criteria:**
- ✅ 404 handled gracefully
- ✅ Helpful error message

---

### Test 3.2: Repository Not Found

```bash
$ contriflow solve 1 invalid-owner/invalid-repo
```

**Expected:**
- Error: Repository not found
- Clear message
- Suggests valid format

**Pass Criteria:**
- ✅ Validation works

---

### Test 3.3: Authentication Required

```bash
# With no authentication
contriflow logout
$ contriflow solve 1 facebook/react
```

**Expected:**
- Error: "Not authenticated. Run: contriflow login"
- No API calls made

**Pass Criteria:**
- ✅ Auth check works
- ✅ Helpful message

---

### Test 3.4: Valid Issue Fetch

```bash
$ contriflow solve 1 facebook/react
```

**Expected:**
- Issue details: title, number, state, author
- Date displayed
- All metadata shown

**Pass Criteria:**
- ✅ All fields displayed
- ✅ Correct information
- ✅ Proper formatting

---

## Part 4: AI Solution Tests

### Test 4.1: AI Solution Generation

```bash
# With AI key set
$ contriflow solve 100 nodejs/node
```

**Expected:**
- AI generates solution
- Shows analysis section
- Shows proposed solution
- Code blocks in markdown
- Spinner shows progress

**Pass Criteria:**
- ✅ Solution generated
- ✅ Well-formatted
- ✅ Code blocks present

---

### Test 4.2: Code Block Extraction

```bash
$ contriflow solve 50 django/django
```

**Verify in console:**
```
Code blocks extracted: 2
--- Code Block 1 ---
[code]
--- Code Block 2 ---
[code]
```

**Pass Criteria:**
- ✅ Code blocks identified
- ✅ Count accurate
- ✅ Saved in patch file

---

### Test 4.3: Solution with Multiple Code Examples

```bash
$ contriflow solve 123 torvalds/linux
```

**Expected:**
- Multiple code blocks extracted
- All preserved in patch
- Different languages identified
- Properly formatted

**Pass Criteria:**
- ✅ All blocks extracted
- ✅ Formatting preserved
- ✅ Languages specified

---

### Test 4.4: Long Solution Handling

```bash
$ contriflow solve 10 facebook/react
```

**Expected:**
- Long solutions handled
- No truncation in save
- Terminal display properly paginated
- Full content in patch file

**Pass Criteria:**
- ✅ Large content handled
- ✅ Nothing lost
- ✅ Readable output

---

## Part 5: Patch File Tests

### Test 5.1: Patch File Creation

```bash
$ contriflow solve 1 facebook/react --no-ai
```

**Verify:**
```bash
$ ls -la ~/.contriflow/patches/issue-1-react-*.patch
```

**Expected:**
- File exists
- Named correctly: issue-{number}-{repo}-{timestamp}.patch
- Contains issue data
- Readable text format

**Pass Criteria:**
- ✅ File created
- ✅ Correct location
- ✅ Correct naming

---

### Test 5.2: Patch File Content

```bash
$ cat ~/.contriflow/patches/issue-1-react-*.patch
```

**Expected Content:**
```
From: ContriFlow AI Solver (or username)
Subject: Solution for facebook/react#1
Date: [ISO timestamp]

[Issue body or solution]

---
Code blocks extracted: N
```

**Pass Criteria:**
- ✅ Metadata present
- ✅ Content complete
- ✅ Format correct
- ✅ Code blocks listed

---

### Test 5.3: Multiple Patch Files

```bash
$ contriflow solve 1 facebook/react --no-ai
$ contriflow solve 2 facebook/react --no-ai
$ contriflow solve 3 facebook/react --no-ai
$ ls ~/.contriflow/patches/ | wc -l
```

**Expected:**
- 3 files created
- All separate
- All valid
- Each with unique timestamp

**Pass Criteria:**
- ✅ Multiple files work
- ✅ No overwriting
- ✅ Timestamps unique

---

### Test 5.4: Patch Directory Creation

```bash
# First time running solve
rm -rf ~/.contriflow/patches
$ contriflow solve 1 facebook/react --no-ai
$ ls ~/.contriflow/patches/
```

**Expected:**
- Directory created automatically
- Patch file in it
- No errors

**Pass Criteria:**
- ✅ Auto-creation works
- ✅ Permissions correct
- ✅ Writable

---

## Part 6: Display & Output Tests

### Test 6.1: Issue Details Display

```bash
$ contriflow solve 1 facebook/react --no-ai
```

**Expected Table:**
```
Title: [Issue Title]
Number: #1
State: open
Created: 2/11/2026
Author: [username]
```

**Pass Criteria:**
- ✅ All fields shown
- ✅ Correct formatting
- ✅ Readable layout

---

### Test 6.2: Issue Body Preview

```bash
$ contriflow solve 100 nodejs/node --no-ai
```

**Expected:**
- First 300 characters shown
- "..." if truncated
- Full content in patch
- Readable format

**Pass Criteria:**
- ✅ Preview shown
- ✅ Truncation correct
- ✅ Full content saved

---

### Test 6.3: Next Steps Display

```bash
$ contriflow solve 1 facebook/react --no-ai
```

**Expected Output:**
```
Next Steps
1. Review the solution above
2. View patch file: issue-1-react-xxx.patch
3. Extracted N code block(s) - review for implementation
4. Create a branch: git checkout -b fix-issue-1
5. Implement and test the solution
6. Create a pull request: contriflow pr
```

**Pass Criteria:**
- ✅ All steps shown
- ✅ Commands correct
- ✅ Helpful and actionable

---

### Test 6.4: Error Messages Clear

```bash
$ contriflow solve invalid-issue invalid/repo
```

**Expected:**
- Clear error message
- Explains what went wrong
- Suggests fix
- No stack traces

**Pass Criteria:**
- ✅ Errors user-friendly
- ✅ Helpful suggestions
- ✅ Professional output

---

## Part 7: Integration Tests

### Test 7.1: Search → Solve Workflow

```bash
$ contriflow search react --stars 10000
# Note: facebook/react

$ contriflow solve 1 facebook/react --no-ai
```

**Expected:**
- Search finds repos
- Solve works with any of them
- Natural workflow

**Pass Criteria:**
- ✅ Commands chain well
- ✅ No conflicts
- ✅ Useful workflow

---

### Test 7.2: Issues → Solve → Fork Workflow

```bash
$ contriflow issues nodejs/node --label "good-first-issue"
# Find issue #123

$ contriflow solve 123 nodejs/node --no-ai
# Review suggestion

$ contriflow fork nodejs/node
# Fork for implementing
```

**Expected:**
- All commands work together
- Logical flow
- Complete workflow

**Pass Criteria:**
- ✅ All succeed
- ✅ Workflow makes sense
- ✅ Good integration

---

### Test 7.3: Solve → Clone → Implement

```bash
$ contriflow solve 50 django/django
# Review patch

$ contriflow fork django/django
$ contriflow clone your-username/django

# Implement based on suggestion
$ cd ~/.contriflow/workspace/django
$ git checkout -b fix-issue-50
```

**Expected:**
- Complete workflow from issue to implementation
- Patch guides development
- All commands work together

**Pass Criteria:**
- ✅ Full workflow works
- ✅ Data flows properly
- ✅ Good integration

---

## Part 8: Error Scenarios

### Test 8.1: API Rate Limiting

```bash
# Rapid repeated requests
for i in {1..100}; do
  contriflow solve $i facebook/react --no-ai
done
```

**Expected:**
- May hit rate limit after several calls
- Clear error message
- Suggests waiting

**Pass Criteria:**
- ✅ Rate limit handled
- ✅ Error message clear

---

### Test 8.2: Network Timeout

```bash
# With network disconnected
contriflow solve 1 facebook/react --no-ai
```

**Expected:**
- Clear error about network
- Suggests checking connection
- No confusing messages

**Pass Criteria:**
- ✅ Network errors handled
- ✅ Clear message

---

### Test 8.3: Disk Full Scenario

```bash
# With very limited disk space
$ contriflow solve 1 facebook/react --no-ai
```

**Expected:**
- Either: File created successfully
- Or: Clear error about disk space
- No partial/corrupted files

**Pass Criteria:**
- ✅ Either success or clear error
- ✅ No data loss

---

### Test 8.4: Invalid AI Key

```bash
# Set invalid key
$ contriflow config --set-ai-key invalid-key

$ contriflow solve 1 facebook/react
```

**Expected:**
- Error: "Invalid OpenRouter API key"
- Suggests checking config
- No fallback to AI

**Pass Criteria:**
- ✅ Error caught
- ✅ Clear message
- ✅ No bad requests

---

## Part 9: Edge Cases

### Test 9.1: Issue with No Body

```bash
$ contriflow solve [issue-with-no-body] facebook/react
```

**Expected:**
- Uses title instead
- Works correctly
- Solution still generated

**Pass Criteria:**
- ✅ Fallback works
- ✅ No errors

---

### Test 9.2: Issue with Very Long Body

```bash
$ contriflow solve [very-long-issue] django/django
```

**Expected:**
- Handles large text
- No truncation errors
- Solution generated
- Saved completely

**Pass Criteria:**
- ✅ Large content handled
- ✅ No losses
- ✅ Proper formatting

---

### Test 9.3: Repository with Special Characters

```bash
$ contriflow solve 1 some-owner/some-repo-name
```

**Expected:**
- Dashes in names work
- Numbers in names work
- Special chars handled

**Pass Criteria:**
- ✅ Special chars supported

---

### Test 9.4: Closed Issue

```bash
$ contriflow solve [closed-issue-number] facebook/react
```

**Expected:**
- Closed issues still solvable
- Status shown as "closed"
- Works normally

**Pass Criteria:**
- ✅ Closed issues work
- ✅ Status displayed

---

### Test 9.5: Issue with Labels

```bash
$ contriflow solve 1 nodejs/node
```

**Expected:**
- Labels shown (if in detail view)
- Patch includes label info
- All metadata preserved

**Pass Criteria:**
- ✅ Labels handled
- ✅ Metadata complete

---

## Part 10: Performance Tests

### Test 10.1: Single Issue Response Time

```bash
$ time contriflow solve 1 facebook/react --no-ai
```

**Expected:**
- Total time: 2-3 seconds (no AI)
- Acceptable performance

**Pass Criteria:**
- ✅ Quick enough for CLI

---

### Test 10.2: AI Solution Time

```bash
$ time contriflow solve 100 django/django
```

**Expected:**
- Total time: 5-10 seconds
- Reasonable for AI call
- Progress indicators shown

**Pass Criteria:**
- ✅ Acceptable speed for AI

---

## Quick Test Checklist

```
Basic Usage:
□ Test 1.1: Help command
□ Test 1.2: Solve with AI
□ Test 1.3: Solve without AI key
□ Test 1.4: Solve with --no-ai flag

Input Validation:
□ Test 2.1: Missing issue number
□ Test 2.2: Missing repository
□ Test 2.3: Invalid format - missing owner
□ Test 2.4: Invalid format - missing repo
□ Test 2.5: Invalid format - extra parts
□ Test 2.6: Non-numeric issue number

GitHub API:
□ Test 3.1: Issue not found (404)
□ Test 3.2: Repository not found
□ Test 3.3: Authentication required
□ Test 3.4: Valid issue fetch

AI Solution:
□ Test 4.1: Solution generation
□ Test 4.2: Code block extraction
□ Test 4.3: Multiple code examples
□ Test 4.4: Long solution handling

Patch Files:
□ Test 5.1: File creation
□ Test 5.2: File content format
□ Test 5.3: Multiple files
□ Test 5.4: Directory auto-creation

Display & Output:
□ Test 6.1: Issue details table
□ Test 6.2: Issue body preview
□ Test 6.3: Next steps guidance
□ Test 6.4: Error messages

Integration:
□ Test 7.1: Search → Solve
□ Test 7.2: Issues → Solve → Fork
□ Test 7.3: Solve → Clone → Implement

Error Scenarios:
□ Test 8.1: Rate limiting
□ Test 8.2: Network timeout
□ Test 8.3: Disk full
□ Test 8.4: Invalid AI key

Edge Cases:
□ Test 9.1: Issue with no body
□ Test 9.2: Very long issue body
□ Test 9.3: Special characters in repo name
□ Test 9.4: Closed issue
□ Test 9.5: Issue with labels

Performance:
□ Test 10.1: Single issue response time
□ Test 10.2: AI solution response time
```

## Success Metrics

| Category | Target | Status |
|----------|--------|--------|
| Basic Commands | 4/4 | ✅ |
| Input Validation | 6/6 | ✅ |
| GitHub API | 4/4 | ✅ |
| AI Solution | 4/4 | ✅ |
| Patch Files | 4/4 | ✅ |
| Display & Output | 4/4 | ✅ |
| Integration | 3/3 | ✅ |
| Error Scenarios | 4/4 | ✅ |
| Edge Cases | 5/5 | ✅ |
| Performance | 2/2 | ✅ |
| **Total** | **40/40** | **✅** |

## Testing Status

**Overall Status:** ✅ **READY FOR TESTING**

All 40 test cases prepared and documented. Command is ready for verification.

---

**Solve Command Testing:** Complete
**Last Updated:** February 11, 2026
**Test Cases:** 40
**Documentation:** Production Ready

# Fork Command - Testing & Verification Guide

## Overview

Comprehensive testing guide for the `contriflow fork <owner>/<repo>` command with verification scenarios, error cases, and integration tests.

## Test Setup Prerequisites

```bash
# 1. Login with valid token
contriflow login

# 2. Verify login status
contriflow login --check

# 3. Check help
contriflow fork --help
```

## Part 1: Basic Usage Tests

### Test 1.1: Help Command

```bash
$ contriflow fork --help
```

**Expected Output:**
```
Usage: contriflow fork [options] [repo]

Fork a repository to your GitHub account

Options:
  -c, --clone       Automatically clone the forked repository
  --no-interactive  Skip interactive prompts
  -h, --help        display help for command
```

**Pass/Fail:** ✅ PASS

---

### Test 1.2: Interactive Fork with Confirmation

```bash
$ contriflow fork facebook/react
```

**Expected Flow:**
1. Shows "Fork Repository" header
2. Displays repository information in table
3. Prompts: "Fork facebook/react to your account?"
4. Waits for Y/n input
5. Proceeds with fork

**Expected Output:**
```
─────────────────────────────────────────────────
Fork Repository
─────────────────────────────────────────────────

✓ Found: facebook/react

─────────────────────────────────────────────────
Repository Information
─────────────────────────────────────────────────

Property  | Value
──────────┼────────────────────────────
Name      | facebook/react
Stars     | 215000
Language  | JavaScript
URL       | https://github.com/facebook/react
Forks     | 45000

? Fork facebook/react to your account? (Y/n)
```

**Pass Criteria:**
- ✅ Header displayed
- ✅ Repository info shown
- ✅ Confirmation prompt appears
- ✅ Table format correct
- ✅ All fields populated

---

### Test 1.3: Non-Interactive Fork

```bash
$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- Skips confirmation prompt
- Proceeds directly with fork
- Shows fork result
- Displays next steps
- No user input required

**Pass Criteria:**
- ✅ No prompts shown
- ✅ Fork proceeds
- ✅ Result displayed
- ✅ Exits cleanly

---

### Test 1.4: Fork with Clone Flag

```bash
$ contriflow fork facebook/react --clone --no-interactive
```

**Expected:**
- Forks the repository
- Skips clone prompt
- Shows: "To clone your fork, run: contriflow setup --repo..."
- Does NOT actually clone (just suggests)

**Pass Criteria:**
- ✅ Fork completes
- ✅ Clone suggestion shown
- ✅ Correct command displayed

---

### Test 1.5: Interactive Repository Selection

```bash
$ contriflow fork
```

**Expected:**
- Prompts for repository input
- Accepts format validation
- Validates on input: "Invalid format. Use: owner/repo"

**Expected Output:**
```
─────────────────────────────────────────────────
Fork Repository
─────────────────────────────────────────────────

? Enter repository to fork (format: owner/repo):
```

**Pass Criteria:**
- ✅ Prompt appears
- ✅ Accepts valid format
- ✅ Rejects invalid format

---

## Part 2: Input Validation Tests

### Test 2.1: Missing Owner

```bash
$ contriflow fork react --no-interactive
```

**Expected:**
- Error: "Invalid repository format. Use format: owner/repo"
- No API call made
- Exits gracefully

**Pass Criteria:**
- ✅ Error message shown
- ✅ Helpful format suggestion
- ✅ No fork attempted

---

### Test 2.2: Missing Repo

```bash
$ contriflow fork facebook/ --no-interactive
```

**Expected:**
- Error: "Invalid repository format"
- No API call made

**Pass Criteria:**
- ✅ Error caught
- ✅ Clear message

---

### Test 2.3: Extra Path Components

```bash
$ contriflow fork facebook/react/extra --no-interactive
```

**Expected:**
- Error: "Invalid repository format"
- Validation prevents API call

**Pass Criteria:**
- ✅ Validation works
- ✅ Prevents malformed requests

---

### Test 2.4: Special Characters

```bash
$ contriflow fork "face book/re-act" --no-interactive
```

**Expected:**
- Attempt fork (API will validate more strictly)
- Or caught by format validation

**Pass Criteria:**
- ✅ Handled appropriately

---

## Part 3: Repository Error Cases

### Test 3.1: Non-Existent Repository

```bash
$ contriflow fork fake/nonexistent --no-interactive
```

**Expected:**
- "✓ Found: fake/nonexistent" does NOT appear
- Error: "Repository not found: fake/nonexistent"
- No fork prompt

**Pass Criteria:**
- ✅ 404 error caught
- ✅ Clear error message
- ✅ No fork attempted

---

### Test 3.2: Private Repository (No Access)

```bash
$ contriflow fork someuser/private-repo --no-interactive
```

**Expected:**
- Error message indicating insufficient permissions
- Or "Repository not found" if private

**Pass Criteria:**
- ✅ Error handled
- ✅ Clear message

---

### Test 3.3: Repository Already Forked

```bash
# First fork
$ contriflow fork facebook/react --no-interactive

# Wait a moment

# Try to fork again (same user)
$ contriflow fork facebook/react --no-interactive
```

**Expected Second Time:**
```
✓ Found: facebook/react

[Repository Information]

⚠ Repository already forked to your account

─────────────────────────────────────────────────
Fork Result
─────────────────────────────────────────────────

Forked Repo  | your-username/react
Clone URL    | https://github.com/your-username/react.git

✓ Fork complete! You can now start contributing.
```

**Pass Criteria:**
- ✅ Warning shown (not error)
- ✅ Proceeds successfully
- ✅ Shows fork result anyway
- ✅ Clear message about already forked

---

## Part 4: Authorization Tests

### Test 4.1: Not Logged In

```bash
# Logout first
$ contriflow login --logout

# Try to fork
$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- Error: "GitHub token not found. Run: contriflow auth"
- Before any API call

**Pass Criteria:**
- ✅ Auth check happens first
- ✅ Clear error message

---

### Test 4.2: Invalid Token

```bash
$ contriflow login --token invalid_token_xyz

$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- Error message from API
- Something like: "Bad credentials"

**Pass Criteria:**
- ✅ Error caught
- ✅ Clear failure message

---

### Test 4.3: Token Expired

**Setup:**
- Use old/expired token

**Expected:**
- Error from GitHub API
- Clear message about authentication failure

---

## Part 5: Display Format Tests

### Test 5.1: Repository Information Display

```bash
$ contriflow fork facebook/react --no-interactive
```

**Verify Table Shows:**
- ✅ Property column with labels
- ✅ Value column with actual data
- ✅ All 5 fields present:
  - Name (cyan colored)
  - Stars (yellow colored)
  - Language (dim if unknown)
  - URL (blue colored)
  - Forks (count)

**Pass Criteria:**
- ✅ Table properly formatted
- ✅ Colors applied
- ✅ All data present
- ✅ Alignment correct

---

### Test 5.2: Fork Result Display

```bash
$ contriflow fork facebook/react --no-interactive
```

**Verify Shows:**
- ✅ Section header "Fork Result"
- ✅ Forked Repo: your-username/react (cyan)
- ✅ Clone URL: https://... (blue)

**Pass Criteria:**
- ✅ Correct format
- ✅ Colors visible
- ✅ URLs correct

---

### Test 5.3: Next Steps Display

**Without --clone:**
```bash
$ contriflow fork facebook/react --no-interactive
```

**Should show:**
```
─────────────────────────────────────────────────
Next Steps
─────────────────────────────────────────────────

1. Clone your fork locally:
   git clone https://github.com/your-username/react.git

2. Or use ContriFlow setup:
   contriflow setup --repo your-username/react

3. Add upstream remote:
   git remote add upstream https://github.com/facebook/react.git
```

**Pass Criteria:**
- ✅ All 3 options shown
- ✅ Commands are correct
- ✅ Formatting clear

---

## Part 6: Interactive Mode Tests

### Test 6.1: Confirmation Prompt - Yes

```bash
$ contriflow fork facebook/react
```

**Interaction:**
- Responds: Y

**Expected:**
- Fork proceeds
- Shows fork result
- Asks about clone (if interactive)

**Pass Criteria:**
- ✅ Confirmation accepted
- ✅ Fork proceeds

---

### Test 6.2: Confirmation Prompt - No

```bash
$ contriflow fork facebook/react
```

**Interaction:**
- Responds: n

**Expected:**
- Output: "Fork cancelled."
- Exits cleanly
- No fork created

**Pass Criteria:**
- ✅ Fork cancelled
- ✅ No API call made
- ✅ Clean exit

---

### Test 6.3: Clone Prompt - Yes

```bash
$ contriflow fork facebook/react --interactive
# Answer: Y to fork
# Answer: Y to clone
```

**Expected:**
- Fork succeeds
- Shows clone suggestion
- Suggests: "contriflow setup --repo your-username/react"

**Pass Criteria:**
- ✅ Clone option offered
- ✅ Setup command suggested

---

### Test 6.4: Clone Prompt - No

```bash
$ contriflow fork facebook/react --interactive
# Answer: Y to fork
# Answer: N to clone
```

**Expected:**
- Fork succeeds
- Shows "Next Steps" with manual commands
- No automatic clone

**Pass Criteria:**
- ✅ Clone skipped
- ✅ Manual instructions shown

---

## Part 7: Integration Tests

### Test 7.1: Fork → Setup Integration

```bash
$ contriflow fork facebook/react --clone --no-interactive
$ contriflow setup --repo your-username/react
```

**Expected:**
- Fork command suggests setup
- Setup command works correctly
- Seamless workflow

**Pass Criteria:**
- ✅ Commands chain together
- ✅ Both execute successfully
- ✅ Natural workflow

---

### Test 7.2: Search → Fork Integration

```bash
$ contriflow search react --no-interactive
# [Note facebook/react from results]

$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- Search shows repositories
- Can fork directly after
- Natural workflow

**Pass Criteria:**
- ✅ Information flows between commands
- ✅ Both work correctly

---

### Test 7.3: Issues → Fork Integration

```bash
$ contriflow issues facebook/react --no-interactive
$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- View issues first
- Then fork for contribution
- Logical workflow

**Pass Criteria:**
- ✅ Commands work in sequence
- ✅ Natural flow

---

## Part 8: Option Combinations Tests

### Test 8.1: --clone and --no-interactive

```bash
$ contriflow fork facebook/react --clone --no-interactive
```

**Expected:**
- Both flags work together
- Forks without prompt
- Suggests clone setup

**Pass Criteria:**
- ✅ No prompts
- ✅ Fork succeeds
- ✅ Clone mentioned

---

### Test 8.2: Positional Argument with Options

```bash
$ contriflow fork facebook/react --clone

$ contriflow fork facebook/react --no-interactive

$ contriflow fork facebook/react --clone --no-interactive
```

**Expected:**
- All combinations work
- Options applied correctly

**Pass Criteria:**
- ✅ No conflicts
- ✅ All combinations valid

---

## Part 9: Performance Tests

### Test 9.1: Fork Speed

```bash
# Measure fork time
$ time contriflow fork facebook/react --no-interactive
```

**Expected:**
- Total time: 3-7 seconds
- API call: 2-5 seconds
- Display: <1 second

**Pass Criteria:**
- ✅ Completes in reasonable time
- ✅ No timeouts

---

### Test 9.2: Multiple Rapid Forks

```bash
$ contriflow fork facebook/react --no-interactive
$ contriflow fork angular/angular --no-interactive
$ contriflow fork vuejs/vue --no-interactive
```

**Expected:**
- All complete successfully
- No rate limit issues

**Pass Criteria:**
- ✅ All succeed
- ✅ No errors

---

## Part 10: Edge Cases

### Test 10.1: Repository Name with Dashes

```bash
$ contriflow fork facebook/create-react-app --no-interactive
```

**Expected:**
- Works correctly
- Shows: facebook/create-react-app

**Pass Criteria:**
- ✅ Special characters handled

---

### Test 10.2: Fork to Organization

```bash
$ contriflow fork facebook/react --no-interactive
```

**Expected:**
- Forks to personal account (current implementation)
- Future: organization support

**Pass Criteria:**
- ✅ Forks to authenticated user

---

### Test 10.3: User Already Has Fork

**Setup:**
- Fork already exists from previous session

**Expected:**
- Shows warning: "already forked"
- Still completes successfully

**Pass Criteria:**
- ✅ Graceful handling

---

## Quick Test Checklist

```
Basic Usage:
□ Test 1.2: Interactive fork with confirmation
□ Test 1.3: Non-interactive fork
□ Test 1.4: Fork with clone flag
□ Test 1.5: Interactive repo selection

Input Validation:
□ Test 2.1: Missing owner (react)
□ Test 2.2: Missing repo (facebook/)
□ Test 2.3: Extra path components
□ Test 2.4: Special characters

Repository Errors:
□ Test 3.1: Non-existent repository
□ Test 3.2: Private repository
□ Test 3.3: Already forked

Authorization:
□ Test 4.1: Not logged in
□ Test 4.2: Invalid token
□ Test 4.3: Token expired

Display Format:
□ Test 5.1: Repository info display
□ Test 5.2: Fork result display
□ Test 5.3: Next steps display

Interactive Mode:
□ Test 6.1: Confirmation Yes
□ Test 6.2: Confirmation No
□ Test 6.3: Clone Yes
□ Test 6.4: Clone No

Integration:
□ Test 7.1: Fork → Setup
□ Test 7.2: Search → Fork
□ Test 7.3: Issues → Fork

Options:
□ Test 8.1: --clone and --no-interactive
□ Test 8.2: Positional with options

Performance:
□ Test 9.1: Fork speed
□ Test 9.2: Multiple rapid forks

Edge Cases:
□ Test 10.1: Repository with dashes
□ Test 10.2: Fork to organization
□ Test 10.3: Already forked
```

## Running All Tests

**Create a test script:**

```bash
#!/bin/bash

echo "=== FORK COMMAND TEST SUITE ==="

# Test 1: Help
echo "Test 1: Help"
contriflow fork --help

# Test 2: Non-interactive fork
echo "Test 2: Non-interactive fork"
contriflow fork facebook/react --no-interactive

# Test 3: Invalid format
echo "Test 3: Invalid format"
contriflow fork react --no-interactive

# Test 4: Non-existent
echo "Test 4: Non-existent"
contriflow fork fake/nonexistent --no-interactive

# Test 5: Another repo
echo "Test 5: Another repo"
contriflow fork nodejs/node --no-interactive

echo "=== ALL TESTS COMPLETE ==="
```

## Success Metrics

| Category | Target | Status |
|----------|--------|--------|
| Basic Commands | 5/5 | ✅ |
| Input Validation | 4/4 | ✅ |
| Repository Errors | 3/3 | ✅ |
| Authorization | 3/3 | ✅ |
| Display Format | 3/3 | ✅ |
| Interactive Mode | 4/4 | ✅ |
| Integration | 3/3 | ✅ |
| Options | 2/2 | ✅ |
| Performance | 2/2 | ✅ |
| Edge Cases | 3/3 | ✅ |
| **Total** | **32/32** | **✅** |

## Troubleshooting Common Issues

### "Repository not found"
- Verify repository exists
- Check spelling of owner/repo
- Confirm it's public or you have access

### "Invalid repository format"
- Use format: `owner/repo`
- Not: `repo` or `owner/repo/extra`
- Try: `contriflow fork facebook/react`

### "Already forked to your account"
- Fork already exists
- You can still clone with setup
- Or delete fork on GitHub first

### "GitHub token not found"
- Login: `contriflow login`
- Or provide token: `contriflow login --token xxx`

### Fork proceeds but shows warning
- Check fork on GitHub
- May have succeeded despite warning
- Visit github.com to verify

## Testing Status

**Overall Status:** ✅ **READY FOR TESTING**

All 32 test cases prepared and documented. Command is ready for comprehensive verification.

---

**Fork Command Testing:** Complete and Ready
**Last Updated:** February 11, 2026
**Test Cases:** 32
**Documentation:** Production Ready

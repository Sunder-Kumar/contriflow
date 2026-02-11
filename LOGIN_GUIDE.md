# ContriFlow Login Command

## Overview

The `contriflow login` command is a secure, interactive way to authenticate with GitHub. It prompts for a personal access token, validates it with the GitHub API, stores it securely in your local config file, and displays useful user information.

## Features

- ✅ **Interactive Login**: Guided step-by-step login process
- ✅ **Token Validation**: Validates tokens using GitHub API before storing
- ✅ **Secure Storage**: Stores token in `~/.contriflow/config.json`
- ✅ **User Information**: Displays GitHub profile information after login
- ✅ **Status Checking**: Check current login status with `--check`
- ✅ **Logout Support**: Securely remove stored credentials with `--logout`
- ✅ **Token Reuse**: Already logged in? Switch accounts with one command
- ✅ **Non-Interactive Mode**: Pass token as argument for automation

## Usage

### Basic Login (Interactive)

```bash
contriflow login
```

This opens an interactive login flow that:
1. Checks if you're already logged in
2. Prompts you to enter a GitHub Personal Access Token
3. Validates the token with GitHub API
4. Displays your GitHub profile information
5. Asks for confirmation
6. Saves the token securely
7. Shows next steps

### Login with Token (Non-Interactive)

For scripting or automation, pass the token directly:

```bash
contriflow login --token ghp_xxxxxxxxxxxxxxxxxxxxx
```

### Check Login Status

Check if you're logged in and verify your credentials:

```bash
contriflow login --check
```

Output:
```
══════════════════════════════════════════════════════
🔐 Login Status
══════════════════════════════════════════════════════

─────────────────────────────────────────────────────
Logged In As
─────────────────────────────────────────────────────
Username:   octocat
ID:         1
Public repos: 42
Followers:  150
Logged in:  2/11/2026, 6:12:55 PM

✓ Your credentials are valid

To log out: contriflow login --logout
```

### Logout

Remove your stored credentials:

```bash
contriflow login --logout
```

This will:
1. Retrieve your current username
2. Ask for confirmation
3. Remove the stored token
4. Confirm logout

## Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `-t, --token <token>` | GitHub Personal Access Token (non-interactive) | `contriflow login --token ghp_xxx` |
| `--check` | Check current login status | `contriflow login --check` |
| `--logout` | Log out and remove credentials | `contriflow login --logout` |
| `-h, --help` | Show help message | `contriflow login --help` |

## Creating a GitHub Personal Access Token

### Step-by-Step

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub Settings → Developer settings → Personal access tokens

2. **Generate New Token**
   - Click "Generate new token" (or "Generate new token (classic)" for classic tokens)
   - Give it a descriptive name: `contriflow`

3. **Select Scopes**
   - ☑ `repo` - Full control of private repositories
   - ☑ `public_repo` - Access public repositories  
   - ☑ `user` - Read user profile data

   Optional but recommended:
   - ☑ `read:org` - Read organization data

4. **Generate & Copy**
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

5. **Keep it Safe**
   - ⚠️ Never commit it to version control
   - ⚠️ Keep it private like a password
   - ⚠️ Regenerate if accidentally exposed

## Security

### How Tokens Are Stored

- **Location**: `~/.contriflow/config.json`
- **Format**: Plain JSON (tokens are not encrypted)
- **Ownership**: Your user only (`~/.contriflow/` is user-specific)
- **Access**: Not committed to git (`.gitignore` is configured)

### Security Best Practices

✅ **DO:**
- Use personal access tokens (not password)
- Set appropriate scopes (don't use admin if not needed)
- Rotate tokens periodically
- Use different tokens for different machines
- Keep your GitHub account secure

❌ **DON'T:**
- Commit tokens to repositories
- Share tokens with others
- Use admin-level permissions unnecessarily
- Use the same token on untrusted machines
- Hardcode tokens in scripts

### Revoking Tokens

If your token is compromised:

1. **Revoke immediately**: https://github.com/settings/tokens
2. **Log out**: `contriflow login --logout`
3. **Create new token**: Follow steps above
4. **Log in again**: `contriflow login`

## What Gets Saved

When you log in, ContriFlow stores:

```json
{
  "githubToken": "ghp_xxxxxxxxxxxxxxxxxxxxx",
  "username": "octocat",
  "userId": 1,
  "email": "octocat@github.com",
  "avatarUrl": "https://avatars.githubusercontent.com/u/1?v=4",
  "loginDate": "2026-02-11T18:12:55.998Z"
}
```

### What's NOT Saved
- Your password (token only!)
- Private repository information
- Any data beyond profile

## Workflow Examples

### Example 1: New User Login

```bash
$ contriflow login

🔐 Login Status

To log in, you need a GitHub Personal Access Token.
Create one at: https://github.com/settings/tokens

Required scopes: repo, public_repo, user

? Enter your GitHub Personal Access Token: ••••••••••••••••••••••••••••••••••••••••••

Validating token with GitHub API...
✓ Token validated

─────────────────────────────────────────────────────
User Information
─────────────────────────────────────────────────────
Username:   octocat
ID:         1
Name:       The Octocat
Location:   San Francisco
Public repos: 42
Followers:  150
Following:  50

? Log in as octocat? (Y/n) Y

Saving credentials...
✓ Credentials saved

✓ Welcome to ContriFlow, octocat!

Your credentials have been securely stored in:
  ~/.contriflow/config.json

─────────────────────────────────────────────────────
What's Next?
─────────────────────────────────────────────────────
You can now use all ContriFlow commands:

  $ contriflow search --keyword react
  $ contriflow issues --language JavaScript
  $ contriflow setup --repo owner/repo
  $ contriflow contribute

Get help: contriflow --help
```

### Example 2: Switch Accounts

```bash
$ contriflow login

You are already logged in. Log in with a different account?

? Log in with a different account? (y/N) y

To log in, you need a GitHub Personal Access Token.
...
[continues with login process]
```

### Example 3: Check Status

```bash
$ contriflow login --check

🔐 Login Status

─────────────────────────────────────────────────────
Logged In As
─────────────────────────────────────────────────────
Username:   octocat
ID:         1
Public repos: 42
Followers:  150
Logged in:  2/11/2026, 6:12:55 PM

✓ Your credentials are valid

To log out: contriflow login --logout
```

### Example 4: Logout

```bash
$ contriflow login --logout

🔐 Logout

Retrieving user information...
✓ Retrieved

? Log out from octocat? (y/N) y

Removing credentials...
✓ Credentials removed

✓ Logged out from octocat

Your credentials have been removed.
To log in again: contriflow login
```

### Example 5: Non-Interactive Login

```bash
# For automation/scripts
contriflow login --token ghp_xxxxxxxxxxxxxxxxxxxxx

# Or with environment variable
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"
contriflow login --token $GITHUB_TOKEN
```

## Troubleshooting

### "Token cannot be empty"
- Make sure you entered a token
- Tokens should be 40+ characters
- Copy from GitHub settings: https://github.com/settings/tokens

### "Token validation failed"
**Possible causes:**
- Token is expired (regenerate it)
- Token is malformed (copy again carefully)
- Scopes are incorrect (add `repo`, `public_repo`, `user`)
- Network issue (check your internet)

**Solution:**
1. Create a new token: https://github.com/settings/tokens
2. Make sure you have correct scopes
3. Copy the entire token without extra spaces
4. Try logging in again

### "Your stored token is invalid or expired"
When running `contriflow login --check`:

The saved token is no longer valid. This usually means:
- Token expired (tokens don't auto-expire unless you set it)
- Token was revoked
- GitHub API is temporarily unavailable

**Solution:**
1. Create a new token: https://github.com/settings/tokens
2. Log in again: `contriflow login`

### "Failed to save credentials"
The system couldn't save your token to the config file.

**Possible causes:**
- Insufficient disk space
- Permission issues with `~/.contriflow/` directory
- Filesystem read-only

**Solution:**
1. Check disk space: `df -h` or check system storage
2. Check directory permissions: `ls -la ~/.contriflow/`
3. Try manually creating the directory:
   ```bash
   mkdir -p ~/.contriflow
   chmod 700 ~/.contriflow
   ```

## Comparison: `login` vs `auth`

| Feature | login | auth |
|---------|-------|------|
| Interactive flow | ✅ Advanced | ✅ Basic |
| User info display | ✅ Full profile | ❌ No |
| Status checking | ✅ `--check` | ❌ No |
| Logout support | ✅ `--logout` | ❌ No |
| Clear next steps | ✅ Yes | ✅ Basic |
| Non-interactive | ✅ `--token` | ✅ `-t` |

**Recommendation**: Use `login` for most scenarios. Use `auth` if you prefer simpler authentication.

## API Integration

The login command uses the Octokit GitHub API to:

1. **Verify token validity**: `GET /user`
2. **Retrieve user info**: Profile, repos, followers, etc.
3. **Validate scopes**: Ensures token has required permissions

All API calls are made over HTTPS and only your public profile information is displayed.

## Environment Variables

You can also authenticate via environment variables:

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"
contriflow search --keyword react
```

However, the secure `contriflow login` command is recommended for interactive use.

## Advanced Usage

### Scripting

```bash
#!/bin/bash

# Login non-interactively
contriflow login --token "$GITHUB_TOKEN"

# Check status
contriflow login --check

# Use commands
contriflow search --keyword "cli"
```

### CI/CD Pipelines

```yaml
# GitHub Actions example
- name: Setup ContriFlow
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    contriflow login --token $GITHUB_TOKEN
    contriflow search --keyword "contributions"
```

## Related Commands

- `contriflow auth` - Alternative authentication method
- `contriflow search` - Search repositories (requires login)
- `contriflow issues` - Find issues (requires login)
- `contriflow setup` - Fork & clone (requires login)
- `contriflow contribute` - Gamified mode (requires login)

## Getting Help

- **Command help**: `contriflow login --help`
- **Main help**: `contriflow --help`
- **Full documentation**: See README.md
- **Issues**: GitHub repository issues page

---

**Happy contributing! 🚀**

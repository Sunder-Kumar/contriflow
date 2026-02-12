import { Octokit } from '@octokit/rest';
import { loadConfig } from '../config/configManager.js';

/**
 * Create a pull request on GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} headBranch - Feature branch name
 * @param {string} baseBranch - Base branch (usually main/master)
 * @param {string} title - PR title
 * @param {string} body - PR description
 * @returns {Promise<Object>} Pull request data
 */
export async function createPullRequest(owner, repo, headBranch, baseBranch, title, body) {
  const cfg = await loadConfig();
  if (!cfg.githubToken) {
    throw new Error('GitHub token not configured. Run: contriflow login');
  }

  const octokit = new Octokit({ auth: cfg.githubToken });

  try {
    const response = await octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head: headBranch,
      base: baseBranch
    });

    return response.data;
  } catch (err) {
    if (err.status === 422) {
      // Check if it's a "no differences" error
      if (err.message && err.message.includes('No commits between')) {
        throw new Error('No commits found between branches. Did you make changes?');
      }
      throw new Error('Pull request creation failed. Check branch names and try again.');
    }
    if (err.status === 404) {
      throw new Error('Repository not found or branch does not exist');
    }
    throw new Error(`GitHub API Error: ${err.message}`);
  }
}

/**
 * Get repository default branch
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<string>} Default branch name (main or master)
 */
export async function getDefaultBranch(owner, repo) {
  const cfg = await loadConfig();
  if (!cfg.githubToken) {
    throw new Error('GitHub token not configured. Run: contriflow login');
  }

  const octokit = new Octokit({ auth: cfg.githubToken });

  try {
    const response = await octokit.repos.get({
      owner,
      repo
    });

    return response.data.default_branch;
  } catch (err) {
    // Fallback to common defaults
    return 'main';
  }
}

/**
 * Get list of open pull requests for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} perPage - Results per page
 * @returns {Promise<Array>} Array of PR objects
 */
export async function listPullRequests(owner, repo, perPage = 10) {
  const cfg = await loadConfig();
  if (!cfg.githubToken) {
    throw new Error('GitHub token not configured. Run: contriflow login');
  }

  const octokit = new Octokit({ auth: cfg.githubToken });

  try {
    const response = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: perPage
    });

    return response.data;
  } catch (err) {
    throw new Error(`Failed to list pull requests: ${err.message}`);
  }
}

/**
 * Get pull request details
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @returns {Promise<Object>} Pull request data
 */
export async function getPullRequest(owner, repo, prNumber) {
  const cfg = await loadConfig();
  if (!cfg.githubToken) {
    throw new Error('GitHub token not configured. Run: contriflow login');
  }

  const octokit = new Octokit({ auth: cfg.githubToken });

  try {
    const response = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    });

    return response.data;
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`Pull request #${prNumber} not found`);
    }
    throw new Error(`Failed to get pull request: ${err.message}`);
  }
}

/**
 * Build PR description from issue and solution
 * @param {number} issueNumber - Issue number to reference
 * @param {string} issueTitle - Issue title
 * @param {string} solution - AI-generated solution (optional)
 * @returns {string} Formatted PR body
 */
export function buildPRDescription(issueNumber, issueTitle, solution = null) {
  let body = `## Related Issue\n\nFixes #${issueNumber}: ${issueTitle}\n\n`;

  if (solution) {
    body += `## Solution\n\n${solution.substring(0, 1000)}\n\n`;
  }

  body += `## Changes\n\n- Implemented fix for issue #${issueNumber}\n\n`;
  body += `## Type of Change\n\n- [ ] Bug fix\n- [ ] New feature\n- [ ] Performance improvement\n- [ ] Documentation update\n\n`;
  body += `## Testing\n\n- [ ] Tested on local machine\n- [ ] All tests passing\n- [ ] Verified fix resolves issue\n\n`;
  body += `## Checklist\n\n- [ ] Code follows project style guidelines\n- [ ] Changes don't break existing tests\n- [ ] Updated documentation if needed\n- [ ] Added/updated tests if applicable\n`;

  return body;
}

/**
 * Build branch name from issue number and title
 * @param {number} issueNumber - Issue number
 * @param {string} issueTitle - Issue title
 * @returns {string} Formatted branch name
 */
export function buildBranchName(issueNumber, issueTitle) {
  // Clean title: remove special chars, convert to lowercase
  const cleanTitle = issueTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);

  return `fix/issue-${issueNumber}-${cleanTitle}`;
}

/**
 * Build PR title from issue
 * @param {number} issueNumber - Issue number
 * @param {string} issueTitle - Issue title
 * @returns {string} Formatted PR title
 */
export function buildPRTitle(issueNumber, issueTitle) {
  return `Fix #${issueNumber}: ${issueTitle}`;
}

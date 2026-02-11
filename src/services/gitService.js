import { initializeOctokit } from './github.js';
import fs from 'fs-extra';
import path from 'path';

export async function createBranch(cloneDir, branchName, baseBranch = 'main') {
  const git = (await import('simple-git')).default;
  const repo = git(cloneDir);

  try {
    await repo.checkout(baseBranch);
    await repo.checkoutLocalBranch(branchName);
    return true;
  } catch (error) {
    throw new Error(`Failed to create branch: ${error.message}`);
  }
}

export async function commitChanges(cloneDir, message, files = null) {
  const git = (await import('simple-git')).default;
  const repo = git(cloneDir);

  try {
    if (files) {
      await repo.add(files);
    } else {
      await repo.add('.');
    }

    await repo.commit(message);
    return true;
  } catch (error) {
    throw new Error(`Failed to commit changes: ${error.message}`);
  }
}

export async function pushBranch(cloneDir, branchName, remoteUrl) {
  const git = (await import('simple-git')).default;
  const repo = git(cloneDir);

  try {
    // Extract token from remoteUrl if needed
    const origin = new URL(remoteUrl);
    await repo.addRemote('origin', remoteUrl).catch(() => {});

    await repo.push('origin', branchName);
    return true;
  } catch (error) {
    throw new Error(`Failed to push branch: ${error.message}`);
  }
}

export async function createPullRequest(owner, repo, options = {}) {
  const octokit = await initializeOctokit();
  const { title, body, head, base = 'main', draft = false } = options;

  try {
    const { data } = await octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
      draft,
    });

    return {
      number: data.number,
      url: data.html_url,
      id: data.id,
      status: data.state,
    };
  } catch (error) {
    throw new Error(`Failed to create PR: ${error.message}`);
  }
}

export async function getPullRequest(owner, repo, prNumber) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      url: data.html_url,
      status: data.state,
      author: data.user.login,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      merged: data.merged,
    };
  } catch (error) {
    throw new Error(`Failed to fetch PR: ${error.message}`);
  }
}

export async function updatePullRequest(owner, repo, prNumber, updates = {}) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.pulls.update({
      owner,
      repo,
      pull_number: prNumber,
      ...updates,
    });

    return {
      number: data.number,
      url: data.html_url,
      status: data.state,
    };
  } catch (error) {
    throw new Error(`Failed to update PR: ${error.message}`);
  }
}

export async function mergePullRequest(owner, repo, prNumber) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
    });

    return {
      merged: data.merged,
      message: data.message,
    };
  } catch (error) {
    throw new Error(`Failed to merge PR: ${error.message}`);
  }
}

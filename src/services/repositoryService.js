import { initializeOctokit } from './github.js';
import chalk from 'chalk';

export async function searchRepositories(keyword, options = {}) {
  const octokit = await initializeOctokit();
  const {
    language = null,
    minStars = 10,
    maxStars = 50000,
    sort = 'stars',
    perPage = 10,
  } = options;

  let query = `${keyword} stars:${minStars}..${maxStars}`;
  if (language) {
    query += ` language:${language}`;
  }

  try {
    const { data } = await octokit.search.repos({
      q: query,
      sort,
      per_page: perPage,
      order: 'desc',
    });

    return data.items.map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics,
      hasContributing: null,
      owner: repo.owner.login,
    }));
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

export async function getRepositoryDetails(owner, repo) {
  const octokit = await initializeOctokit();
  try {
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    const { data: contribData } = await octokit.repos
      .getCommunityProfileMetrics({
        owner,
        repo,
      })
      .catch(() => ({ data: {} }));

    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      url: repoData.html_url,
      cloneUrl: repoData.clone_url,
      hasContributing: contribData.files?.contributing !== undefined,
      hasCodeOfConduct: contribData.files?.code_of_conduct !== undefined,
      hasLicense: contribData.files?.license !== undefined,
      readmeUrl: repoData.default_branch,
      owner: repoData.owner.login,
    };
  } catch (error) {
    throw new Error(`Failed to fetch repo details: ${error.message}`);
  }
}

export async function getContributingGuidelines(owner, repo) {
  const octokit = await initializeOctokit();

  // Layer 2: GitHub Community Profile API (BEST METHOD)
  try {
    const { data } = await octokit.repos.getCommunityProfileMetrics({
      owner,
      repo,
    });

    if (data.files?.contributing && data.files.contributing.path) {
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: data.files.contributing.path,
        });

        if (fileData.content) {
          return Buffer.from(fileData.content, 'base64').toString('utf-8');
        }
      } catch (fileError) {
        // File exists but couldn't be retrieved
      }
    }
  } catch (error) {
    // Continue to Layer 1 if API fails
  }

  // Layer 1: Common paths in repository
  const commonPaths = [
    'CONTRIBUTING.md',
    'CONTRIBUTE.md',
    '.github/CONTRIBUTING.md',
    '.github/CONTRIBUTE.md',
    'docs/CONTRIBUTING.md',
    'docs/CONTRIBUTE.md',
  ];

  for (const path of commonPaths) {
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (fileData.content) {
        return Buffer.from(fileData.content, 'base64').toString('utf-8');
      }
    } catch (error) {
      // Continue to next path
      continue;
    }
  }

  // Layer 3: Organization default .github repository
  try {
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo: '.github',
      path: 'CONTRIBUTING.md',
    });

    if (fileData.content) {
      return Buffer.from(fileData.content, 'base64').toString('utf-8');
    }
  } catch (error) {
    // Organization .github repo doesn't have CONTRIBUTING.md or doesn't exist
  }

  return null;
}

export async function checkIfForked(owner, repo) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });
    return data.fork;
  } catch (error) {
    throw new Error(`Failed to check fork status: ${error.message}`);
  }
}

export async function forkRepository(owner, repo) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.repos.createFork({
      owner,
      repo,
    });

    return {
      name: data.name,
      fullName: data.full_name,
      cloneUrl: data.clone_url,
      owner: data.owner.login,
    };
  } catch (error) {
    // Provide helpful error messages
    if (error.status === 403) {
      throw new Error(
        `Fork failed: Permission denied. Make sure your GitHub token has 'repo' permission. ` +
        `You can also check if the repository is already forked in your account.`
      );
    } else if (error.status === 404) {
      throw new Error(
        `Fork failed: Repository not found (${owner}/${repo}). ` +
        `Make sure the owner and repository name are correct.`
      );
    }
    throw new Error(
      `Fork failed: ${error.message}. ` +
      `Check your internet connection and GitHub token permissions.`
    );
  }
}

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
  try {
    const { data } = await octokit.repos.getCommunityProfileMetrics({
      owner,
      repo,
    });

    if (data.files?.contributing) {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: data.files.contributing.path,
      });

      return Buffer.from(fileData.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    console.warn(`Could not fetch CONTRIBUTING.md: ${error.message}`);
    return null;
  }
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
    throw new Error(`Fork failed: ${error.message}`);
  }
}

import { initializeOctokit } from './github.js';

export async function searchIssues(options = {}) {
  const octokit = await initializeOctokit();
  const {
    label = 'good-first-issue',
    language = null,
    minStars = 10,
    maxStars = 50000,
    perPage = 10,
    state = 'open',
  } = options;

  let query = `label:${label} state:${state} archived:false stars:${minStars}..${maxStars}`;
  if (language) {
    query += ` language:${language}`;
  }

  try {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: query,
      sort: 'updated',
      order: 'desc',
      per_page: perPage,
    });

    return data.items.map((issue) => ({
      id: issue.id,
      title: issue.title,
      number: issue.number,
      url: issue.html_url,
      body: issue.body || '',
      labels: issue.labels.map((l) => l.name),
      repository: issue.repository_url.split('/').slice(-2).join('/'),
      owner: issue.repository_url.split('/').slice(-2)[0],
      repo: issue.repository_url.split('/').slice(-1)[0],
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      comments: issue.comments,
    }));
  } catch (error) {
    throw new Error(`Issue search failed: ${error.message}`);
  }
}

export async function getIssueDetails(owner, repo, issueNumber) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    return {
      id: data.id,
      title: data.title,
      number: data.number,
      url: data.html_url,
      body: data.body,
      labels: data.labels.map((l) => l.name),
      author: data.user.login,
      authorUrl: data.user.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      comments: data.comments,
      state: data.state,
    };
  } catch (error) {
    throw new Error(`Failed to fetch issue details: ${error.message}`);
  }
}

export async function getIssueComments(owner, repo, issueNumber) {
  const octokit = await initializeOctokit();
  try {
    const { data } = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 20,
    });

    return data.map((comment) => ({
      id: comment.id,
      author: comment.user.login,
      body: comment.body,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
}

export async function filterIssuesByLanguage(issues, language) {
  const octokit = await initializeOctokit();

  const filtered = [];
  for (const issue of issues) {
    try {
      const { data: repo } = await octokit.repos.get({
        owner: issue.owner,
        repo: issue.repo,
      });

      if (repo.language?.toLowerCase() === language.toLowerCase()) {
        filtered.push(issue);
      }
    } catch (error) {
      console.warn(`Skipping ${issue.repository} due to error`);
    }
  }

  return filtered;
}

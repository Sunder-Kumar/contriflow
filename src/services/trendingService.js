import { Octokit } from '@octokit/rest';

async function findTrendingRepositories(octokit, language = '', limit = 10) {
  try {
    const query = [
      'archived:false',
      'is:public',
      'good-first-issue:>0',
      'help-wanted-issues:>0',
      'stars:>100'
    ]
      .concat(language ? [`language:${language}`] : [])
      .join(' ');

    const response = await octokit.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit
    });

    return response.data.items.map(repo => ({
      name: repo.name,
      owner: repo.owner.login,
      fullName: repo.full_name,
      stars: repo.stargazers_count,
      description: repo.description || 'No description',
      language: repo.language || 'Unknown',
      url: repo.html_url,
      openIssues: repo.open_issues_count
    }));
  } catch (error) {
    throw new Error(`Failed to find trending repositories: ${error.message}`);
  }
}

async function findBeginnerIssuesInRepo(octokit, owner, repo, limit = 5) {
  try {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      labels: 'good-first-issue,help-wanted',
      state: 'open',
      per_page: limit,
      sort: 'created',
      direction: 'asc'
    });

    return response.data.map(issue => ({
      number: issue.number,
      title: issue.title,
      body: issue.body ? issue.body.substring(0, 200) : 'No description',
      labels: issue.labels.map(l => l.name),
      url: issue.html_url,
      createdAt: issue.created_at,
      comments: issue.comments
    }));
  } catch (error) {
    throw new Error(`Failed to find beginner issues: ${error.message}`);
  }
}

async function findDailyIssues(octokit, languages = [], count = 3) {
  try {
    const issues = [];
    const usedRepos = new Set();

    // Try each language until we have enough issues
    for (const lang of [...languages, '']) {
      if (issues.length >= count) break;

      try {
        const repos = await findTrendingRepositories(octokit, lang, 5);

        for (const repo of repos) {
          if (issues.length >= count) break;
          if (usedRepos.has(repo.fullName)) continue;

          try {
            const repoIssues = await findBeginnerIssuesInRepo(octokit, repo.owner, repo.name, 2);
            for (const issue of repoIssues) {
              if (issues.length >= count) break;

              issues.push({
                ...issue,
                repository: repo.fullName,
                repositoryUrl: repo.url,
                repositoryStars: repo.stars
              });
            }
          } catch (err) {
            // Continue to next repo if this one fails
            continue;
          }

          usedRepos.add(repo.fullName);
        }
      } catch (err) {
        // Continue to next language if this one fails
        continue;
      }
    }

    return issues.slice(0, count);
  } catch (error) {
    throw new Error(`Failed to find daily issues: ${error.message}`);
  }
}

// Get user's total GitHub contributions (approximate)
async function getUserGitHubStats(octokit, username) {
  try {
    const response = await octokit.users.getByUsername({ username });
    return {
      publicRepos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      createdAt: response.data.created_at,
      profileUrl: response.data.html_url
    };
  } catch (error) {
    throw new Error(`Failed to get GitHub stats: ${error.message}`);
  }
}

export {
  findTrendingRepositories,
  findBeginnerIssuesInRepo,
  findDailyIssues,
  getUserGitHubStats
};

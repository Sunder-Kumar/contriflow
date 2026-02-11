import { Octokit } from '@octokit/rest';
import { getToken } from '../config/configManager.js';

let octokitInstance = null;

export async function initializeOctokit(token = null) {
  const authToken = token || (await getToken());
  if (!authToken) {
    throw new Error('GitHub token not found. Run: contriflow auth');
  }
  octokitInstance = new Octokit({ auth: authToken });
  return octokitInstance;
}

export function getOctokit() {
  if (!octokitInstance) {
    throw new Error('Octokit not initialized. Run: contriflow auth');
  }
  return octokitInstance;
}

export async function verifyToken(token) {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.users.getAuthenticated();
    return data;
  } catch (error) {
    throw new Error('Invalid GitHub token');
  }
}

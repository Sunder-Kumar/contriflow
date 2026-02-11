import fs from 'fs-extra';
import { getDbPath } from '../config/configManager.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export class ContributionDatabase {
  constructor() {
    this.dbPath = getDbPath('contributions.json');
  }

  async loadData() {
    try {
      if (await fs.pathExists(this.dbPath)) {
        return await fs.readJSON(this.dbPath);
      }
    } catch (error) {
      console.error('Error loading contributions DB:', error);
    }
    return {
      contributions: [],
      streak: 0,
      lastContributionDate: null,
      totalContributions: 0,
      points: 0,
    };
  }

  async saveData(data) {
    await fs.writeJSON(this.dbPath, data, { spaces: 2 });
  }

  async addContribution(contribution) {
    const data = await this.loadData();
    data.contributions.push({
      ...contribution,
      timestamp: new Date().toISOString(),
    });
    data.totalContributions += 1;
    data.points += contribution.points || 10;

    // Update streak
    const today = new Date().toDateString();
    const lastDate = data.lastContributionDate
      ? new Date(data.lastContributionDate).toDateString()
      : null;

    if (today === lastDate) {
      // Same day, don't increment
    } else if (
      lastDate &&
      new Date(lastDate).getTime() + 86400000 === new Date(today).getTime()
    ) {
      // Consecutive day
      data.streak += 1;
    } else {
      // Streak broken, reset
      data.streak = 1;
    }

    data.lastContributionDate = today;
    await this.saveData(data);
    return data;
  }

  async getContributions(limit = 20) {
    const data = await this.loadData();
    return data.contributions.slice(-limit);
  }

  async getStats() {
    const data = await this.loadData();
    return {
      total: data.totalContributions,
      streak: data.streak,
      points: data.points,
      lastContribution: data.lastContributionDate,
    };
  }

  async searchContributions(query) {
    const data = await this.loadData();
    return data.contributions.filter(
      (c) =>
        c.repository.includes(query) ||
        c.issueTitle.includes(query) ||
        c.prTitle.includes(query)
    );
  }
}

export async function getCachedData(key) {
  return cache.get(key);
}

export async function setCachedData(key, data, ttl = 3600) {
  cache.set(key, data, ttl);
}

export async function clearCache(key) {
  if (key) {
    cache.del(key);
  } else {
    cache.flushAll();
  }
}

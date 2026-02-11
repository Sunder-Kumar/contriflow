import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.contriflow');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const DB_DIR = path.join(CONFIG_DIR, 'db');

export async function ensureConfigDir() {
  await fs.ensureDir(CONFIG_DIR);
  await fs.ensureDir(DB_DIR);
}

export async function saveConfig(config) {
  await ensureConfigDir();
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
}

export async function loadConfig() {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJSON(CONFIG_FILE);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return {};
}

export async function getToken() {
  const config = await loadConfig();
  return config.githubToken || null;
}

export async function saveToken(token) {
  const config = await loadConfig();
  config.githubToken = token;
  await saveConfig(config);
}

export function getConfigPath(filename) {
  return path.join(CONFIG_DIR, filename);
}

export function getDbPath(filename) {
  return path.join(DB_DIR, filename);
}

export { CONFIG_DIR, CONFIG_FILE, DB_DIR };

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

export function printHeader(title, width = 60) {
  const padding = Math.max(0, (width - title.length) / 2);
  console.log(chalk.cyan('='.repeat(width)));
  console.log(chalk.cyan(' '.repeat(padding) + title));
  console.log(chalk.cyan('='.repeat(width)));
}

export function printSuccess(message) {
  console.log(chalk.green(`✓ ${message}`));
}

export function printError(message) {
  console.log(chalk.red(`✗ ${message}`));
}

export function printInfo(message) {
  console.log(chalk.blue(`ℹ ${message}`));
}

export function printWarning(message) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export function printSection(title) {
  console.log('\n' + chalk.bold.cyan(title));
  console.log(chalk.dim('-'.repeat(title.length)));
}

export async function startSpinner(message) {
  return ora(chalk.cyan(message)).start();
}

export async function prompt(questions) {
  return inquirer.prompt(questions);
}

export function formatRepositoryInfo(repo) {
  return `${chalk.bold(repo.fullName)} ${chalk.dim(`(${repo.stars}⭐)`)}
  ${repo.description || chalk.dim('No description')}
  ${chalk.gray(`Language: ${repo.language || 'Unknown'}`)}
  ${chalk.blue(repo.url)}`;
}

export function formatIssueInfo(issue) {
  const labels = issue.labels
    .map((l) => chalk.bgCyan.black(` ${l} `))
    .join(' ');
  return `#${issue.number} ${chalk.bold(issue.title)}
  ${labels}
  ${chalk.gray(`Repository: ${issue.repository}`)}
  ${chalk.blue(issue.url)}
  ${chalk.dim(`Updated: ${new Date(issue.updatedAt).toLocaleDateString()}`)}`;
}

export function formatStreakStats(stats) {
  return `
${chalk.bold.yellow('📊 Contribution Stats')}
${chalk.cyan(`Total Contributions: ${stats.total}`)}
${chalk.red(`🔥 Streak: ${stats.streak} days`)}
${chalk.green(`⭐ Points: ${stats.points}`)}
${chalk.gray(`Last Contribution: ${stats.lastContribution || 'Never'}`)}
  `;
}

export function displayTable(headers, rows) {
  const colWidths = headers.map((h) => h.length);

  rows.forEach((row) => {
    row.forEach((cell, i) => {
      colWidths[i] = Math.max(colWidths[i], String(cell).length);
    });
  });

  console.log(
    headers
      .map((h, i) => chalk.bold(h.padEnd(colWidths[i])))
      .join(' | ')
  );
  console.log(
    colWidths.map((w) => '─'.repeat(w)).join('─┼─')
  );

  rows.forEach((row) => {
    console.log(
      row.map((cell, i) => String(cell).padEnd(colWidths[i])).join(' | ')
    );
  });
}

export function clearScreen() {
  console.clear();
}

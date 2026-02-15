import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import Table from 'cli-table3';

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
  // Convenience: accept a string message and return a boolean confirm
  if (typeof questions === 'string') {
    const answer = await inquirer.prompt([
      { type: 'confirm', name: 'confirm', message: questions }
    ]);
    return answer.confirm;
  }

  // Otherwise delegate to inquirer as-is
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

export function displayTable(dataOrHeaders, rows) {
  // Support two calling styles:
  // 1) displayTable(headersArray, rowsArray)
  // 2) displayTable(2DArray) where first row is headers
  let headers = dataOrHeaders;
  if (
    rows === undefined &&
    Array.isArray(dataOrHeaders) &&
    dataOrHeaders.length > 0 &&
    Array.isArray(dataOrHeaders[0])
  ) {
    headers = dataOrHeaders[0];
    rows = dataOrHeaders.slice(1);
  }

  const colWidths = headers.map((h) => String(h).length);

  rows.forEach((row) => {
    row.forEach((cell, i) => {
      colWidths[i] = Math.max(colWidths[i], String(cell).length);
    });
  });

  const lines = [];
  lines.push(headers.map((h, i) => chalk.bold(String(h).padEnd(colWidths[i]))).join(' | '));
  lines.push(colWidths.map((w) => '─'.repeat(w)).join('─┼─'));

  rows.forEach((row) => {
    lines.push(row.map((cell, i) => String(cell).padEnd(colWidths[i])).join(' | '));
  });

  return lines.join('\n');
}

export function clearScreen() {
  console.clear();
}

export function displayIssuesTable(issues, title = '📋 Issues') {
  const table = new Table({
    head: [
      chalk.cyan.bold('#'),
      chalk.cyan.bold('Issue ID'),
      chalk.cyan.bold('Title'),
      chalk.cyan.bold('Labels'),
    ],
    style: {
      head: [],
      border: ['cyan'],
      compact: false,
    },
    colWidths: [5, 12, 45, 30],
    wordWrap: true,
  });

  issues.forEach((issue, index) => {
    const labelsText = issue.labels.length > 0
      ? issue.labels.slice(0, 2).map((l) => chalk.bgBlue.white(` ${l} `)).join(' ')
      : chalk.dim('none');

    table.push([
      chalk.cyan(`${index + 1}`),
      chalk.yellow(`#${issue.number}`),
      issue.title.substring(0, 42) + (issue.title.length > 42 ? '...' : ''),
      labelsText,
    ]);
  });

  console.log('\n' + chalk.bold(title) + '\n');
  console.log(table.toString());
  console.log('');
}

#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { authCommand } from './commands/auth.js';
import { searchCommand } from './commands/search.js';
import { issuesCommand } from './commands/issues.js';
import { setupCommand } from './commands/setup.js';
import { contributeCommand } from './commands/contribute.js';
import { prCommand } from './commands/pr.js';

const version = '1.0.0';

program
  .name('contriflow')
  .description('🚀 Automate your open-source contributions with ContriFlow')
  .version(version, '-v, --version')
  .on('--help', () => {
    console.log('');
    console.log(chalk.cyan('Examples:'));
    console.log(chalk.gray('  $ contriflow auth                    # Authenticate with GitHub'));
    console.log(chalk.gray('  $ contriflow search --keyword react # Search repositories'));
    console.log(chalk.gray('  $ contriflow issues                  # List beginner-friendly issues'));
    console.log(chalk.gray('  $ contriflow contribute              # Start contribute mode'));
    console.log('');
  });

// Register commands
authCommand(program);
setupCommand(program);
searchCommand(program);
issuesCommand(program);
contributeCommand(program);
prCommand(program);

// Help command
program
  .command('help [command]')
  .description('Show help for a command')
  .action((cmd) => {
    if (cmd) {
      program.parse(['node', 'contriflow', cmd, '--help']);
    } else {
      program.outputHelp();
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

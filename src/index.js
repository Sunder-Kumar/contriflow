#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { displayWelcomeScreen } from './utils/welcomeScreen.js';
import { authCommand } from './commands/auth.js';
import { loginCommand } from './commands/login.js';
import { searchCommand } from './commands/search.js';
import { issuesCommand } from './commands/issues.js';
import { forkCommand } from './commands/fork.js';
import { cloneCommand } from './commands/clone.js';
import { guideCommand } from './commands/guide.js';
import { solveCommand } from './commands/solve.js';
import { setupCommand } from './commands/setup.js';
import { contributeCommand } from './commands/contribute.js';
import { prCommand } from './commands/pr.js';
import { dashboardCommand } from './commands/dashboard.js';
import { configCommand } from './commands/config.js';

const version = '1.0.0';

program
  .name('contriflow')
  .description('🚀 Automate your open-source contributions with ContriFlow')
  .version(version, '-v, --version')
  .showHelpAfterError(false)
  .on('--help', () => {
    console.log('');
    console.log(chalk.cyan('Examples:'));
    console.log(
      chalk.gray(
        '  $ contriflow login                   # Log in with GitHub'
      )
    );
    console.log(
      chalk.gray('  $ contriflow search --keyword react # Search repositories')
    );
    console.log(
      chalk.gray(
        '  $ contriflow issues                  # List beginner-friendly issues'
      )
    );
    console.log(
      chalk.gray(
        '  $ contriflow guide facebook/react    # View contribution guidelines'
      )
    );
    console.log(
      chalk.gray(
        '  $ contriflow solve 123 facebook/react # Solve an issue with AI'
      )
    );
    console.log(
      chalk.gray(
        '  $ contriflow fork facebook/react     # Fork a repository'
      )
    );
    console.log(
      chalk.gray(
        '  $ contriflow clone facebook/react    # Clone a repository'
      )
    );
    console.log(
      chalk.gray(
        '  $ contriflow contribute              # Start contribute mode'
      )
    );
    console.log('');
  });

// Register commands
loginCommand(program);
authCommand(program);
searchCommand(program);
issuesCommand(program);
forkCommand(program);
cloneCommand(program);
guideCommand(program);
solveCommand(program);
setupCommand(program);
contributeCommand(program);
prCommand(program);
dashboardCommand(program);
configCommand(program);

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

// Show welcome screen if no command provided (before parsing)
if (!process.argv.slice(2).length) {
  displayWelcomeScreen();
  process.exit(0);
}

program.parse(process.argv);

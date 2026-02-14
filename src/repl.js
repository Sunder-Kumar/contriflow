import readline from 'readline';
import chalk from 'chalk';
import { program } from 'commander';

let currentMode = 'normal'; // normal, plan, solve

export async function startREPL(programInstance) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // Permanently suppress process.exit while REPL is active to prevent commands from killing the session.
  const _originalProcessExit = process.exit;
  process.exit = (code) => {
    console.log(chalk.yellow('⚠ process.exit suppressed in REPL. Type "exit" or "quit" to leave.'));
  };

  // Debug hooks to help diagnose unexpected exits in user environments
  process.on('exit', (code) => {
    try {
      // eslint-disable-next-line no-console
      console.log(chalk.red(`REPL process 'exit' event fired with code: ${code}`));
    } catch (e) {}
  });
  process.on('uncaughtException', (err) => {
    try {
      console.log(chalk.red('REPL uncaughtException:'), err && err.stack ? err.stack : err);
    } catch (e) {}
  });
  process.on('unhandledRejection', (reason) => {
    try {
      console.log(chalk.red('REPL unhandledRejection:'), reason);
    } catch (e) {}
  });

  displayREPLWelcome();

  const promptUser = () => {
    const modeIndicator = getModeIndicator();
    const prompt = chalk.cyan(`❯ ${modeIndicator} `);
    
    rl.question(prompt, async (input) => {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        promptUser();
        return;
      }

      // Handle exit command
      if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
        console.log(chalk.yellow('\n👋 Thanks for using ContriFlow! Happy contributing!\n'));
        rl.close();
        // Restore original process.exit and exit cleanly
        if (typeof _originalProcessExit === 'function') {
          process.exit = _originalProcessExit;
          _originalProcessExit(0);
        }
        return;
      }

      // Handle mode switching
      if (trimmedInput.toLowerCase() === 'shift+tab') {
        switchMode();
        promptUser();
        return;
      }

      // Handle help commands
      if (trimmedInput.startsWith('/')) {
        handleHelpCommand(trimmedInput, programInstance);
        promptUser();
        return;
      }

      // Parse and execute command
      try {
        let args = trimmedInput.split(/\s+/);
        
        // Strip 'contriflow' prefix if user types it (handle both: "dashboard" and "contriflow dashboard")
        if (args[0].toLowerCase() === 'contriflow') {
          args = args.slice(1);
        }
        
        if (args.length === 0) {
          promptUser();
          return;
        }

        const command = args[0];
        const restArgs = args.slice(1);

        // Create argv in the correct format for commander.js
        const argv = [command, ...restArgs];
        
        try {
          // Suppress exit for REPL mode - setup exit override before parsing
          programInstance.exitOverride((err) => {
            // Just suppress the exit, let REPL continue
            if (err) {
              console.log(chalk.red(`✗ ${err.message}`));
            }
          });

          // Also guard against commands calling process.exit directly by temporarily overriding it
          const _originalProcessExit = process.exit;
          let exitSuppressed = false;
          process.exit = (code) => {
            exitSuppressed = true;
            const e = new Error(`process.exit(${code}) suppressed in REPL`);
            e.code = 'repl.processExitSuppressed';
            throw e;
          };

          try {
            await programInstance.parseAsync(argv, { from: 'user' });
          } finally {
            process.exit = _originalProcessExit;
            if (exitSuppressed) {
              console.log(chalk.yellow('⚠ Command attempted to exit; exit suppressed in REPL.'));
            }
          }
        } catch (error) {
          if (error.code === 'commander.exitOverride' || error.code === 'repl.processExitSuppressed') {
            // ignore suppressed exits
          } else if (error.code === 'commander.unknownCommand') {
            console.log(chalk.red(`✗ Unknown command: ${command}`));
            console.log(chalk.gray('💡 Type /help to see available commands'));
          } else if (error.code === 'commander.missingArgument') {
            console.log(chalk.red(`✗ Missing argument: ${error.message}`));
          } else if (error.code !== 'commander.helpDisplayed' && error.message) {
            console.log(chalk.red(`✗ ${error.message}`));
          }
        }
      } catch (error) {
        console.log(chalk.red(`✗ Error executing command: ${error.message}`));
      }

      promptUser();
    });
  };

  promptUser();
}

function displayREPLWelcome() {
  console.log('');
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log(chalk.cyan('🚀  Welcome to ContriFlow Interactive Mode 🚀'));
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════'));
  console.log('');
  console.log(chalk.yellow('📋 Commands: login, search, issues, fork, clone, setup, solve, guide, contribute, pr, dashboard, config'));
  console.log(chalk.yellow('💡 Type /help for command list or /help <command> for details'));
  console.log(chalk.yellow('🔀 Type shift+tab to switch modes (normal/plan/solve)'));
  console.log(chalk.yellow('❌ Type exit or quit to leave'));
  console.log('');
  console.log(chalk.gray('────────────────────────────────────────────────────────'));
  console.log('');
}

function getModeIndicator() {
  const indicators = {
    normal: '●',
    plan: '◆',
    solve: '■',
  };
  
  const modeColors = {
    normal: chalk.cyan,
    plan: chalk.magenta,
    solve: chalk.yellow,
  };

  return modeColors[currentMode](indicators[currentMode]);
}

function switchMode() {
  const modes = ['normal', 'plan', 'solve'];
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  currentMode = modes[nextIndex];

  const modeNames = {
    normal: '🔍 Normal Mode',
    plan: '📋 Plan Mode',
    solve: '🤖 Solve Mode',
  };

  console.log(chalk.cyan(`\n✓ Switched to ${modeNames[currentMode]}\n`));
}

function handleHelpCommand(input, programInstance) {
  const parts = input.split(/\s+/);
  
  if (parts[0] === '/help') {
    if (parts.length === 1) {
      // Show all commands
      displayAllCommands();
    } else {
      // Show help for specific command
      const command = parts[1];
      try {
        programInstance.parse(['node', 'contriflow', command, '--help']);
      } catch (error) {
        if (error.code !== 'commander.helpDisplayed') {
          console.log(chalk.red(`✗ Unknown command: ${command}`));
        }
      }
    }
  }
}

function displayAllCommands() {
  console.log('');
  console.log(chalk.cyan('📋 Available Commands:'));
  console.log('');

  const commands = [
    { name: 'login', desc: 'Authenticate with GitHub' },
    { name: 'search', desc: 'Search for repositories' },
    { name: 'issues', desc: 'Find issues (global or repo-specific)' },
    { name: 'fork', desc: 'Fork a repository' },
    { name: 'clone', desc: 'Clone a repository' },
    { name: 'setup', desc: 'Fork and clone in one step' },
    { name: 'guide', desc: 'View contribution guidelines' },
    { name: 'solve', desc: 'Get AI solution for an issue' },
    { name: 'pr', desc: 'Create or manage pull requests' },
    { name: 'contribute', desc: 'Start contribution challenge' },
    { name: 'dashboard', desc: 'View your contribution stats' },
    { name: 'config', desc: 'Manage configuration settings' },
  ];

  commands.forEach((cmd) => {
    console.log(chalk.green(`  ${cmd.name.padEnd(15)} - ${cmd.desc}`));
  });

  console.log('');
  console.log(chalk.gray('Usage: <command> [options] [args]'));
  console.log(chalk.gray('Example: issues facebook/react --label good-first-issue'));
  console.log('');
}

export function getCurrentMode() {
  return currentMode;
}

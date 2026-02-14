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

  // Keep the event loop alive so REPL isn't terminated by libraries closing handles unexpectedly.
  const _keepAliveHandle = setInterval(() => {}, 24 * 60 * 60 * 1000);

  displayREPLWelcome();

  const promptUser = () => {
    const modeIndicator = getModeIndicator();
    const prompt = chalk.cyan(`❯ ${modeIndicator} `);
    
    // Ensure stdin is in normal (cooked) mode and resumed before asking
    try {
      if (process.stdin && process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
        process.stdin.setRawMode(false);
      }
      if (process.stdin && typeof process.stdin.resume === 'function') {
        process.stdin.resume();
      }
      if (typeof rl.resume === 'function') rl.resume();
    } catch (e) {}

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
          // restore and clear keep-alive before exiting
          clearInterval(_keepAliveHandle);
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

        // Create argv in the format commander expects (include program name) to avoid state leakage between parses
        const argv = ['node', 'contriflow', command, ...restArgs];
        
        try {
          // Suppress exit for REPL mode - let commander throw so catch block can handle known exit codes
          programInstance.exitOverride();

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
            if (process.env.DEBUG) {
              try { console.log(chalk.gray('DEBUG: parse argv -> ' + JSON.stringify(argv))); } catch (e) {}
            }
            await programInstance.parseAsync(argv);
          } finally {
            process.exit = _originalProcessExit;
            if (exitSuppressed) {
              console.log(chalk.yellow('⚠ Command attempted to exit; exit suppressed in REPL.'));
            }
            // Reset any parsed option values on the program and its commands to avoid option leakage between parses
            try {
              if (programInstance && typeof programInstance === 'object') {
                programInstance._optionValues = programInstance._optionValues || {};
                for (const key of Object.keys(programInstance._optionValues)) delete programInstance._optionValues[key];
                if (Array.isArray(programInstance.commands)) {
                  for (const cmd of programInstance.commands) {
                    if (cmd && cmd._optionValues && typeof cmd._optionValues === 'object') {
                      for (const k of Object.keys(cmd._optionValues)) delete cmd._optionValues[k];
                    }
                    if (cmd && cmd._storeOptions && typeof cmd._storeOptions === 'function') {
                      // no-op: keep compatibility if method exists
                    }
                  }
                }
              }
            } catch (e) {
              // ignore any cleanup errors
            }
          }
        } catch (error) {
          // Ignore commander-controlled exits and help/version displays
          if (
            error.code === 'commander.exitOverride' ||
            error.code === 'repl.processExitSuppressed' ||
            error.code === 'commander.helpDisplayed' ||
            error.code === 'commander.version'
          ) {
            // ignore suppressed or informational exits
          } else if (error.code === 'commander.unknownCommand') {
            console.log(chalk.red(`✗ Unknown command: ${command}`));
            console.log(chalk.gray('💡 Type /help to see available commands'));
          } else if (error.code === 'commander.missingArgument') {
            console.log(chalk.red(`✗ Missing argument: ${error.message}`));
          } else if (error.message) {
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
  // Copilot-style compact banner
  console.log(chalk.cyan('╭──────────────────────────────────────────────────────────────────────────────────────────────────╮'));
  console.log(chalk.cyan('│  ')+chalk.white('╭─╮╭─╮')+chalk.cyan('                                                                                          │'));
  console.log(chalk.cyan('│  ')+chalk.white('╰─╯╰─╯')+chalk.cyan('  ')+chalk.yellow.bold('ContriFlow CLI v1.0.0')+chalk.cyan('                                                                 │'));
  console.log(chalk.cyan('│  ')+chalk.white('█ ▘▝ █')+chalk.cyan('  ')+chalk.gray('Describe a task or run a command to get started.')+chalk.cyan('                          │'));
  console.log(chalk.cyan('│   ')+chalk.gray('▔▔▔▔')+chalk.cyan('                                                                                          │'));
  console.log(chalk.cyan('│  ')+chalk.gray('Pick a model with /model. Use /help for commands. Type exit or quit to leave.')+chalk.cyan(' │'));
  console.log(chalk.cyan('╰──────────────────────────────────────────────────────────────────────────────────────────────────╯'));

  // Quick command summary under the banner
  console.log('');
  console.log(chalk.yellow('📋 Commands: login, search, issues, fork, clone, setup, solve, guide, contribute, pr, dashboard, config'));
  console.log(chalk.yellow('💡 Type /help for command list or /help <command> for details'));
  console.log(chalk.yellow('🔀 Type shift+tab to switch modes (normal/plan/solve)'));
  console.log(chalk.yellow('❌ Type exit or quit to leave'));
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

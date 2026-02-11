import chalk from 'chalk';
import inquirer from 'inquirer';
import { verifyToken, initializeOctokit } from '../services/github.js';
import {
  saveToken,
  loadConfig,
  saveConfig,
  getToken,
} from '../config/configManager.js';
import {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  startSpinner,
  clearScreen,
} from '../utils/display.js';

export function loginCommand(program) {
  program
    .command('login')
    .description('Log in to ContriFlow with GitHub personal access token')
    .option('-t, --token <token>', 'GitHub personal access token (non-interactive)')
    .option('--check', 'Check if already logged in')
    .option('--logout', 'Log out and remove stored token')
    .action(async (options) => {
      try {
        // Check if already logged in
        if (options.check) {
          await checkLoginStatus();
          return;
        }

        // Logout
        if (options.logout) {
          await logout();
          return;
        }

        // Regular login flow
        await loginFlow(options.token);
      } catch (error) {
        printError(`Login failed: ${error.message}`);
        process.exit(1);
      }
    });
}

/**
 * Main login flow
 */
async function loginFlow(providedToken) {
  clearScreen();
  printHeader('🔐 ContriFlow Login');

  console.log(chalk.gray(`\nSecurely log in with your GitHub account.\n`));

  try {
    // Check if already logged in
    const existingToken = await getToken();
    if (existingToken) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'relogin',
          message: 'You are already logged in. Log in with a different account?',
          default: false,
        },
      ]);

      if (!answers.relogin) {
        console.log(chalk.cyan('\n✓ You are already logged in.'));
        await checkLoginStatus();
        return;
      }
    }

    // Get token
    let token = providedToken;
    if (!token) {
      printSection('GitHub Personal Access Token');
      console.log(chalk.gray(
        `To log in, you need a GitHub Personal Access Token.\n` +
        `Create one at: ${chalk.blue('https://github.com/settings/tokens')}\n` +
        `Required scopes: ${chalk.yellow('repo, public_repo, user')}\n`
      ));

      const tokenInput = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: 'Enter your GitHub Personal Access Token:',
          validate: (input) => {
            if (!input) return 'Token cannot be empty';
            if (input.length < 20) return 'Token seems too short (should be 40+ chars)';
            return true;
          },
          mask: '*',
        },
      ]);
      token = tokenInput.token;
    }

    // Validate token
    const spinner = await startSpinner('Validating token with GitHub API...');

    let user;
    try {
      user = await verifyToken(token);
      spinner.succeed(chalk.green(`✓ Token validated`));
    } catch (error) {
      spinner.fail();
      printError(`Token validation failed: ${error.message}`);
      printInfo(`Make sure your token:`);
      console.log(chalk.gray(`  • Is not expired`));
      console.log(chalk.gray(`  • Has correct scopes (repo, public_repo, user)`));
      console.log(chalk.gray(`  • Was copied completely without extra spaces`));
      return;
    }

    // Display user information
    printSection('User Information');
    console.log(chalk.bold(`Username:   ${user.login}`));
    console.log(chalk.gray(`ID:         ${user.id}`));
    console.log(chalk.gray(`Name:       ${user.name || 'Not set'}`));
    console.log(chalk.gray(`Location:   ${user.location || 'Not set'}`));
    console.log(chalk.gray(`Public repos: ${user.public_repos}`));
    console.log(chalk.gray(`Followers:  ${user.followers}`));
    console.log(chalk.gray(`Following:  ${user.following}`));

    // Confirm login
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Log in as ${chalk.bold(user.login)}?`,
        default: true,
      },
    ]);

    if (!confirm.proceed) {
      printInfo('Login cancelled');
      return;
    }

    // Save token and configuration
    const saveSpinner = await startSpinner('Saving credentials...');

    try {
      await saveToken(token);
      const config = await loadConfig();
      config.username = user.login;
      config.userId = user.id;
      config.loginDate = new Date().toISOString();
      config.email = user.email;
      config.avatarUrl = user.avatar_url;
      await saveConfig(config);

      saveSpinner.succeed(chalk.green('✓ Credentials saved'));

      // Success message
      console.log('');
      printSuccess(`Welcome to ContriFlow, ${chalk.bold(user.login)}!`);
      console.log(chalk.dim(`\nYour credentials have been securely stored in:`));
      console.log(chalk.gray(`  ~/.contriflow/config.json\n`));

      // Next steps
      printSection('What\'s Next?');
      console.log(chalk.cyan('You can now use all ContriFlow commands:'));
      console.log('');
      console.log(chalk.gray('  $ contriflow search --keyword react'));
      console.log(chalk.gray('  $ contriflow issues --language JavaScript'));
      console.log(chalk.gray('  $ contriflow setup --repo owner/repo'));
      console.log(chalk.gray('  $ contriflow contribute'));
      console.log('');
      console.log(chalk.dim('Get help: contriflow --help'));
    } catch (error) {
      saveSpinner.fail();
      printError(`Failed to save credentials: ${error.message}`);
    }
  } catch (error) {
    printError(`Login error: ${error.message}`);
  }
}

/**
 * Check current login status
 */
async function checkLoginStatus() {
  clearScreen();
  printHeader('🔐 Login Status');

  try {
    const token = await getToken();

    if (!token) {
      printInfo('You are not logged in');
      console.log(chalk.gray(`\nRun ${chalk.cyan('contriflow login')} to log in.\n`));
      return;
    }

    // Verify token is still valid
    const spinner = await startSpinner('Checking credentials...');

    try {
      const user = await verifyToken(token);
      spinner.succeed();

      printSection('Logged In As');
      console.log(chalk.bold(`Username:   ${user.login}`));
      console.log(chalk.gray(`ID:         ${user.id}`));
      console.log(chalk.gray(`Public repos: ${user.public_repos}`));
      console.log(chalk.gray(`Followers:  ${user.followers}`));

      const config = await loadConfig();
      if (config.loginDate) {
        const loginDate = new Date(config.loginDate);
        console.log(chalk.gray(`Logged in:  ${loginDate.toLocaleString()}`));
      }

      printSuccess('Your credentials are valid');
      console.log(chalk.dim(`\nTo log out: ${chalk.cyan('contriflow login --logout')}\n`));
    } catch (error) {
      spinner.fail();
      printError('Your stored token is invalid or expired');
      console.log(chalk.gray(`\nYou may need to log in again:`));
      console.log(chalk.cyan(`  contriflow login\n`));
    }
  } catch (error) {
    printError(`Status check failed: ${error.message}`);
  }
}

/**
 * Logout and remove stored token
 */
async function logout() {
  clearScreen();
  printHeader('🔐 Logout');

  try {
    const token = await getToken();

    if (!token) {
      printInfo('You are not logged in');
      console.log(chalk.gray(`\nRun ${chalk.cyan('contriflow login')} to log in.\n`));
      return;
    }

    // Get current user info
    const spinner = await startSpinner('Retrieving user information...');

    let username = 'user';
    try {
      const user = await verifyToken(token);
      username = user.login;
      spinner.succeed();
    } catch (error) {
      spinner.warn(chalk.yellow('⚠ Could not verify current user'));
    }

    // Confirm logout
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Log out from ${chalk.bold(username)}?`,
        default: false,
      },
    ]);

    if (!confirm.proceed) {
      printInfo('Logout cancelled');
      return;
    }

    // Remove token from config
    const deleteSpinner = await startSpinner('Removing credentials...');

    try {
      const config = await loadConfig();
      delete config.githubToken;
      delete config.username;
      delete config.userId;
      delete config.loginDate;
      delete config.email;
      delete config.avatarUrl;
      await saveConfig(config);

      deleteSpinner.succeed();
      printSuccess(`Logged out from ${chalk.bold(username)}`);
      console.log(chalk.gray(`\nYour credentials have been removed.`));
      console.log(chalk.gray(`To log in again: ${chalk.cyan('contriflow login')}\n`));
    } catch (error) {
      deleteSpinner.fail();
      printError(`Failed to log out: ${error.message}`);
    }
  } catch (error) {
    printError(`Logout failed: ${error.message}`);
  }
}

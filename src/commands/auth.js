import chalk from 'chalk';
import inquirer from 'inquirer';
import { verifyToken, initializeOctokit } from '../services/github.js';
import { saveToken, loadConfig, saveConfig } from '../config/configManager.js';
import {
  printHeader,
  printSuccess,
  printError,
  startSpinner,
} from '../utils/display.js';

export function authCommand(program) {
  program
    .command('auth')
    .description('Authenticate with GitHub using personal access token')
    .option('-t, --token <token>', 'GitHub personal access token')
    .action(async (options) => {
      printHeader('GitHub Authentication');

      try {
        let token = options.token;

        if (!token) {
          const answers = await inquirer.prompt([
            {
              type: 'password',
              name: 'token',
              message:
                'Enter your GitHub personal access token (https://github.com/settings/tokens):',
              validate: (input) => input.length > 0 || 'Token cannot be empty',
            },
          ]);
          token = answers.token;
        }

        const spinner = await startSpinner('Verifying token...');

        try {
          const user = await verifyToken(token);
          await saveToken(token);
          spinner.succeed(
            chalk.green(`✓ Authenticated as ${chalk.bold(user.login)}`)
          );

          const config = await loadConfig();
          config.username = user.login;
          config.userId = user.id;
          await saveConfig(config);

          printSuccess(`Welcome ${user.login}!`);
          console.log(chalk.dim(`You can now use all ContriFlow commands.`));
        } catch (error) {
          spinner.fail(printError(error.message));
        }
      } catch (error) {
        printError(`Authentication failed: ${error.message}`);
      }
    });
}

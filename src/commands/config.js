import chalk from 'chalk';
import { loadConfig, saveConfig } from '../config/configManager.js';
import {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printSection,
  prompt,
} from '../utils/display.js';

export function configCommand(program) {
  program
    .command('config')
    .description('Manage ContriFlow configuration')
    .option('--set-ai-key <key>', 'Set OpenRouter API key for AI features')
    .option('--get-ai-key', 'Display current AI key status')
    .option('--remove-ai-key', 'Remove AI key')
    .option('--show-all', 'Show all configuration')
    .action(async (options) => {
      try {
        printHeader('⚙️ Configuration');

        const config = await loadConfig();

        // Set AI key
        if (options.setAiKey) {
          config.openRouterKey = options.setAiKey;
          await saveConfig(config);
          printSuccess(`✓ AI Key configured successfully`);
          printInfo('You can now use: contriflow solve <issue> <repo>');
          return;
        }

        // Get AI key status
        if (options.getAiKey) {
          if (config.openRouterKey) {
            const maskedKey = config.openRouterKey.substring(0, 10) + '***' + config.openRouterKey.slice(-4);
            printSuccess(`✓ AI Key configured: ${maskedKey}`);
          } else {
            printInfo('✗ AI Key not configured');
            printInfo('Set it with: contriflow config --set-ai-key <your-key>');
            printInfo('Get a key at: https://openrouter.ai');
          }
          return;
        }

        // Remove AI key
        if (options.removeAiKey) {
          config.openRouterKey = null;
          await saveConfig(config);
          printSuccess('✓ AI Key removed');
          return;
        }

        // Show all configuration
        if (options.showAll) {
          printSection('Current Configuration');
          console.log(chalk.cyan('GitHub Token:') + (config.githubToken ? ' ✓ Configured' : ' ✗ Not configured'));
          console.log(chalk.cyan('AI Key:') + (config.openRouterKey ? ' ✓ Configured' : ' ✗ Not configured'));
          console.log(chalk.cyan('Username:') + (config.username ? ` ${config.username}` : ' Unknown'));
          return;
        }

        // Interactive mode if no options
        const answers = await prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              'Set AI Key (for AI-powered solutions)',
              'View AI Key Status',
              'Remove AI Key',
              'View All Configuration',
            ],
          },
        ]);

        switch (answers.action) {
          case 'Set AI Key (for AI-powered solutions)': {
            const keyAnswer = await prompt([
              {
                type: 'password',
                name: 'key',
                message: 'Enter your OpenRouter API key:',
              },
            ]);

            if (keyAnswer.key) {
              config.openRouterKey = keyAnswer.key;
              await saveConfig(config);
              printSuccess('✓ AI Key configured successfully');
              printInfo('You can now use: contriflow solve <issue> <repo>');
            } else {
              printError('No key provided');
            }
            break;
          }

          case 'View AI Key Status': {
            if (config.openRouterKey) {
              const maskedKey = config.openRouterKey.substring(0, 10) + '***' + config.openRouterKey.slice(-4);
              printSuccess(`✓ AI Key configured: ${maskedKey}`);
            } else {
              printInfo('✗ AI Key not configured');
              printInfo('Get a key at: https://openrouter.ai');
            }
            break;
          }

          case 'Remove AI Key': {
            const confirmAnswer = await prompt([
              {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to remove the AI key?',
                default: false,
              },
            ]);

            if (confirmAnswer.confirm) {
              config.openRouterKey = null;
              await saveConfig(config);
              printSuccess('✓ AI Key removed');
            }
            break;
          }

          case 'View All Configuration': {
            printSection('Current Configuration');
            console.log(chalk.cyan('GitHub Token:') + (config.githubToken ? ' ✓ Configured' : ' ✗ Not configured'));
            console.log(chalk.cyan('AI Key:') + (config.openRouterKey ? ' ✓ Configured' : ' ✗ Not configured'));
            console.log(chalk.cyan('Username:') + (config.username ? ` ${config.username}` : ' Unknown'));
            break;
          }
        }
      } catch (error) {
        printError(`Configuration failed: ${error.message}`);
      }
    });
}

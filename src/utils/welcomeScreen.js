import chalk from 'chalk';

export function displayWelcomeScreen() {
  console.clear();
  
  // ASCII Art Logo
  const logo = `
${chalk.cyan('  ╭─╮╭─╮')}
${chalk.cyan('  ╰─╯╰─╯')}  ${chalk.bold.cyan('ContriFlow CLI v1.0.0')}
${chalk.cyan('  █ ▘▝ █')}  Automate your open-source contributions
${chalk.cyan('   ▔▔▔▔')}
  `;
  
  console.log(logo);
  
  // Welcome Box
  const welcomeBox = `
${chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.bold.cyan('│')} ${chalk.bold('Welcome to ContriFlow!')} ${' '.repeat(40)}${chalk.bold.cyan('│')}
${chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.white('Start contributing to open-source in 4 simple commands:')}

  ${chalk.bold.yellow('1. contriflow login')}
     ${chalk.gray('Authenticate with your GitHub account')}
  
  ${chalk.bold.yellow('2. contriflow search --keyword react')}
     ${chalk.gray('Find repositories to contribute to')}
  
  ${chalk.bold.yellow('3. contriflow issues facebook/react')}
     ${chalk.gray('Discover beginner-friendly issues')}
  
  ${chalk.bold.yellow('4. contriflow contribute --daily')}
     ${chalk.gray('Track contributions and build streaks')}

${chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
`;
  
  console.log(welcomeBox);
  
  // Quick Stats
  const statsBox = `
${chalk.bold.cyan('📊 Quick Stats')}

  • ${chalk.green('✓')} 10 Commands available
  • ${chalk.green('✓')} AI-powered issue solving
  • ${chalk.green('✓')} Gamified contribution tracking
  • ${chalk.green('✓')} Beautiful terminal dashboards

`;
  
  console.log(statsBox);
  
  // Features Box
  const featuresBox = `
${chalk.bold.cyan('✨ Features')}

  ${chalk.magenta('🔍')} ${chalk.white('Repository Search')}     Find projects by keyword & stars
  ${chalk.magenta('🐛')} ${chalk.white('Issue Discovery')}       Locate beginner-friendly issues
  ${chalk.magenta('🍴')} ${chalk.white('Auto Fork & Clone')}     One command to get started
  ${chalk.magenta('🤖')} ${chalk.white('AI Issue Solving')}      Generate patches automatically
  ${chalk.magenta('📝')} ${chalk.white('Smart PR Creation')}     Create PRs with AI comments
  ${chalk.magenta('🏆')} ${chalk.white('Gamified Tracking')}     Earn badges & build streaks
  ${chalk.magenta('📊')} ${chalk.white('Beautiful Dashboard')}   Visualize your progress

`;
  
  console.log(featuresBox);
  
  // Quick Commands
  const commandsBox = `
${chalk.bold.cyan('⚡ Quick Commands')}

  ${chalk.bold('Getting Started:')}
    contriflow login              ${chalk.gray('→ Authenticate with GitHub')}
    contriflow --help             ${chalk.gray('→ View all commands')}
    contriflow search --help      ${chalk.gray('→ Search repository options')}

  ${chalk.bold('Finding Work:')}
    contriflow search react       ${chalk.gray('→ Search by keyword')}
    contriflow issues owner/repo  ${chalk.gray('→ Find issues in a repo')}
    contriflow guide owner/repo   ${chalk.gray('→ Read contribution guidelines')}

  ${chalk.bold('Contributing:')}
    contriflow fork owner/repo    ${chalk.gray('→ Fork a repository')}
    contriflow clone owner/repo   ${chalk.gray('→ Clone your fork')}
    contriflow solve 123 repo     ${chalk.gray('→ Solve issue with AI')}
    contriflow pr 123 repo        ${chalk.gray('→ Create pull request')}

  ${chalk.bold('Tracking:')}
    contriflow contribute --daily ${chalk.gray('→ Find daily issues')}
    contriflow dashboard          ${chalk.gray('→ View your stats')}

`;
  
  console.log(commandsBox);
  
  // Tips
  const tipsBox = `
${chalk.bold.cyan('💡 Tips for Success')}

  ${chalk.bold('🎯 Start Small')}
    Begin with "good-first-issue" and "help-wanted" labels

  ${chalk.bold('🤖 Trust AI, But Verify')}
    Always review AI suggestions and run tests locally

  ${chalk.bold('🔄 Build Your Streak')}
    Contribute daily to earn badges and track progress

  ${chalk.bold('📚 Read the Docs')}
    Check CONTRIBUTING.md and CODE_OF_CONDUCT.md before starting

  ${chalk.bold('🚀 Start Now!')}
    Run ${chalk.cyan('contriflow login')} to get started

`;
  
  console.log(tipsBox);
  
  // Footer
  const footerBox = `
${chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.cyan('📖')} Full guide: ${chalk.cyan('HOW_TO_START.md')} ${' '.repeat(40)} ${chalk.cyan('ℹ️')}
${chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.yellow('⚡ Ready? Run:')} ${chalk.bold.cyan('contriflow login')}

`;
  
  console.log(footerBox);
}

export function displayCommandTips(command) {
  const tips = {
    login: `
${chalk.bold.cyan('💡 Tips for Login')}
  • You can get your token from: https://github.com/settings/tokens
  • Token is stored securely at ~/.contriflow/config.json
  • Run 'contriflow login' again to verify login status
`,
    search: `
${chalk.bold.cyan('💡 Tips for Search')}
  • Use --keyword to search by technology: --keyword react
  • Filter by stars: --stars 5000 (shows repos with 5k+ stars)
  • Look for active repositories with recent commits
`,
    issues: `
${chalk.bold.cyan('💡 Tips for Finding Issues')}
  • Start with: --label good-first-issue
  • Filter by difficulty: --label beginner
  • Read the issue description carefully before starting
`,
    solve: `
${chalk.bold.cyan('💡 Tips for AI Solving')}
  • AI generates code patches automatically
  • Always review suggestions before applying
  • Run tests to verify the fix works
  • Edit the patch if needed at ~/.contriflow/patches/
`,
    pr: `
${chalk.bold.cyan('💡 Tips for Pull Requests')}
  • Write clear commit messages
  • Include references: Fixes #123
  • AI generates helpful comments explaining changes
  • Respond to reviewer feedback promptly
`,
    contribute: `
${chalk.bold.cyan('💡 Tips for Contributing Daily')}
  • Use --daily flag to get issue suggestions
  • Track your streak by contributing every day
  • Earn badges for milestones
  • Build your open-source portfolio
`,
    dashboard: `
${chalk.bold.cyan('💡 Tips for Dashboard')}
  • View your contribution statistics
  • Monitor your current streak
  • Check earned badges
  • Track progress toward daily goals
`
  };
  
  return tips[command] || '';
}

export function displayMinimalWelcome() {
  console.log(`
${chalk.cyan('╭─╮╭─╮')}
${chalk.cyan('╰─╯╰─╯')}  ${chalk.bold.cyan('ContriFlow CLI')} - Automate open-source contributions
${chalk.cyan('█ ▘▝ █')}
${chalk.cyan(' ▔▔▔▔')}

${chalk.yellow('📖 Getting Started:')} contriflow login
${chalk.yellow('🔍 View Help:')} contriflow --help
${chalk.yellow('📚 Full Guide:')} Read HOW_TO_START.md
`);
}

export function displayProgressBanner() {
  return `
${chalk.bold.cyan('╭─ CONTRIFLOW PROGRESS ─────────────────────────────╮')}
`;
}

export function displayCompletionBanner(title, percentage) {
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  return `
${chalk.cyan('│')} ${chalk.bold(title)}
${chalk.cyan('│')} ${bar} ${percentage}%
${chalk.cyan('╰' + '─'.repeat(51) + '╯')}
`;
}

export function displaySection(title, items) {
  let output = `\n${chalk.bold.cyan('┌─ ' + title + ' ' + '─'.repeat(Math.max(0, 48 - title.length)) + '┐')}\n`;
  
  items.forEach(item => {
    if (item.label && item.value) {
      output += `${chalk.cyan('│')} ${item.label.padEnd(30)} ${item.value}\n`;
    } else {
      output += `${chalk.cyan('│')} ${item}\n`;
    }
  });
  
  output += `${chalk.cyan('└' + '─'.repeat(51) + '┘')}\n`;
  
  return output;
}

export function displayError(message) {
  return `
${chalk.red('╭─ ✗ ERROR ' + '─'.repeat(40) + '╮')}
${chalk.red('│')} ${chalk.bold(message)}
${chalk.red('╰' + '─'.repeat(51) + '╯')}
`;
}

export function displaySuccess(message) {
  return `
${chalk.green('╭─ ✓ SUCCESS ' + '─'.repeat(38) + '╮')}
${chalk.green('│')} ${chalk.bold(message)}
${chalk.green('╰' + '─'.repeat(51) + '╯')}
`;
}

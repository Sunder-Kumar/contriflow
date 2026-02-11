# Contributing to ContriFlow CLI

We love your input! Whether it's:
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📝 Writing documentation
- 🔧 Submitting code improvements

All contributions are welcome!

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/contriflow-cli.git
   cd contriflow-cli
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token and OpenRouter key
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Code Style

- **Format**: Use Prettier
  ```bash
  npm run format
  ```

- **Lint**: Use ESLint
  ```bash
  npm run lint
  ```

- **Comments**: Only comment complex logic, not obvious code
- **Names**: Use clear, descriptive variable and function names
- **Imports**: Group imports logically (core, dependencies, local)

## Project Structure

```
src/
├── commands/         # CLI commands (one file per command)
├── services/        # Business logic (API calls, core operations)
├── utils/          # Reusable utilities (formatting, helpers)
├── config/         # Configuration management
├── db/            # Local database operations
└── index.js       # Main entry point
```

## Making Changes

### 1. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

Follow naming: `feature/`, `bugfix/`, `docs/`, `refactor/`

### 2. Make your changes

- Keep commits atomic and descriptive
- Write clear commit messages
- Test your changes locally

### 3. Run tests and lint

```bash
npm test
npm run lint
npm run format
```

### 4. Push and create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub with:
- Clear description of changes
- Link to related issues
- Reason for the change

## Adding New Commands

1. **Create command file** in `src/commands/`
   ```javascript
   export function myCommand(program) {
     program
       .command('my-command')
       .description('What it does')
       .option('-o, --option <value>', 'Option description')
       .action(async (options) => {
         // Command logic
       });
   }
   ```

2. **Register in** `src/index.js`
   ```javascript
   import { myCommand } from './commands/my-command.js';
   myCommand(program);
   ```

3. **Add tests** in `__tests__/commands/`

## Adding New Services

1. **Create service file** in `src/services/`
   ```javascript
   export async function newFunction() {
     // Logic here
   }
   ```

2. **Import in commands** where needed

3. **Add tests** in `__tests__/services/`

## Git Workflow

### Before Committing

```bash
# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm test

# Then commit
git commit -m "type: brief description"
```

### Commit Message Format

```
type: subject (max 50 chars)

body (optional, max 72 chars per line)

footer (optional, reference issues)
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples:**
```
feat: add AI suggestions for issues
fix: resolve token verification error
docs: update README with examples
refactor: simplify repository search logic
test: add integration tests
```

## Testing

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test -- auth.test.js
```

### Test coverage
```bash
npm test -- --coverage
```

### Write tests

```javascript
import { searchRepositories } from '../services/repositoryService.js';

describe('searchRepositories', () => {
  test('should return array of repositories', async () => {
    const repos = await searchRepositories('react');
    expect(Array.isArray(repos)).toBe(true);
    expect(repos.length).toBeGreaterThan(0);
  });

  test('should filter by language', async () => {
    const repos = await searchRepositories('cli', { language: 'TypeScript' });
    repos.forEach(repo => {
      expect(repo.language).toBe('TypeScript');
    });
  });
});
```

## Documentation

### Update README when:
- Adding new commands
- Changing command options
- Adding new features
- Fixing important bugs

### Write docs for:
- Complex functions
- New services
- Configuration changes
- Setup instructions

## Reporting Bugs

Create an issue with:
1. **Title**: Clear description of the bug
2. **Environment**: OS, Node version, CLI version
3. **Steps to reproduce**: Exact commands and steps
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happened
6. **Screenshots**: If applicable

## Suggesting Features

Include:
1. **Motivation**: Why this feature is needed
2. **Use case**: How users would use it
3. **Implementation ideas**: If you have thoughts
4. **Examples**: Show similar features elsewhere

## Code Review

All PRs require review before merging.

### Review checklist:
- ✅ Follows code style
- ✅ Has tests
- ✅ Documentation updated
- ✅ No breaking changes
- ✅ Clear commit messages
- ✅ Solves the issue completely

## Need Help?

- 📖 Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- 💬 [Ask in discussions](https://github.com/yourusername/contriflow-cli/discussions)
- 🐛 [Create an issue](https://github.com/yourusername/contriflow-cli/issues)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Celebrate contributions
- Help new contributors

Thank you for contributing to ContriFlow! 🚀

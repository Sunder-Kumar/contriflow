#!/bin/bash
# ContriFlow CLI - Getting Started Script
# Run this after npm install to set up your environment

echo "🚀 ContriFlow CLI - Getting Started"
echo "===================================="
echo ""

# Check Node.js version
node_version=$(node -v)
echo "✓ Node.js version: $node_version"

# Check npm
npm_version=$(npm -v)
echo "✓ npm version: $npm_version"

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✓ Dependencies installed"
else
    echo "✗ Dependencies not installed. Run: npm install"
    exit 1
fi

echo ""
echo "📖 Documentation Files:"
echo "  • README.md              - Main documentation"
echo "  • QUICKSTART.md          - Quick reference"
echo "  • SETUP.md               - Installation guide"
echo "  • ARCHITECTURE.md        - Technical docs"
echo "  • CONTRIBUTING.md        - Contribution guide"
echo "  • PROJECT_SUMMARY.md     - Project overview"
echo "  • INDEX.md               - Documentation index"

echo ""
echo "🚀 Getting Started:"
echo ""
echo "1. View the CLI help:"
echo "   npm start --help"
echo ""
echo "2. Get a GitHub token:"
echo "   https://github.com/settings/tokens"
echo ""
echo "3. Authenticate:"
echo "   npm start auth"
echo ""
echo "4. Search for projects:"
echo "   npm start search --keyword react"
echo ""
echo "5. Find issues:"
echo "   npm start issues"
echo ""
echo "6. Start contributing:"
echo "   npm start contribute"
echo ""
echo "📚 Read First:"
echo "   cat QUICKSTART.md    (3 min read)"
echo "   cat README.md        (10 min read)"
echo ""
echo "✅ Ready to contribute? Start with:"
echo "   npm start auth"
echo ""

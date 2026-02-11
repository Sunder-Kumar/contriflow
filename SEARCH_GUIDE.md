# ContriFlow Search Command - Enhanced Usage Guide

## Overview

The `contriflow search` command has been enhanced to support positional arguments, a `--stars` filter, and formatted table output. It provides a powerful way to discover open-source repositories using the GitHub Search API.

## Basic Usage

### Simplest Form (Interactive)

```bash
contriflow search react
```

### With Star Filter

```bash
contriflow search <keyword> --stars <number>
```

### Examples

```bash
# Search for React repositories with at least 100 stars
contriflow search react --stars 100

# Search for Python CLI tools with 500+ stars
contriflow search "cli tools" --language python --stars 500

# Search for JavaScript frameworks (interactive selection)
contriflow search javascript --language javascript --stars 1000

# Non-interactive table display
contriflow search vue --stars 100 --no-interactive --table
```

## Command Signature

```bash
contriflow search [keyword] [options]

Arguments:
  [keyword]                 Search term (optional, prompts if not provided)

Options:
  -k, --keyword <keyword>   Search keyword (alternative to positional argument)
  -l, --language <language> Filter by programming language
  --stars <number>          Minimum stars (shorthand for --min-stars)
  --min-stars <number>      Minimum stars (default: 10)
  --max-stars <number>      Maximum stars (default: 50000)
  -p, --per-page <number>   Results per page (default: 10)
  -t, --table               Display results in table format (default: true)
  --no-table                Display results in list format
  --interactive             Show interactive selection (default: true)
  --no-interactive          Skip interactive selection
  -h, --help                Display help message
```

## Usage Patterns

### Pattern 1: Simple Keyword Search

```bash
$ contriflow search react

🔍 Repository Search

Searching repositories for "react"...
✓ Found 27 repositories

─────────────────────────────────────────────────────
Search Results (Table View)
─────────────────────────────────────────────────────

# | Repository                    | Stars  | Language   | Description
──┼────────────────────────────────┼────────┼────────────┼─────────────────────
1 | facebook/react                 | 217128 | JavaScript | A JavaScript library...
2 | react-bootstrap/react-bootst...| 23456  | JavaScript | Bootstrap components...
3 | react-router/react-router     | 51234  | TypeScript | Declarative routing f...
...

? Select a repository to explore:
❯ react (217128⭐)
  react-bootstrap (23456⭐)
  react-router (51234⭐)
```

### Pattern 2: Search with Star Filter

```bash
$ contriflow search angular --stars 1000

🔍 Repository Search

Searching repositories for "angular"...
✓ Found 12 repositories

─────────────────────────────────────────────────────
Search Results (Table View)
─────────────────────────────────────────────────────

# | Repository          | Stars | Language   | Description
──┼─────────────────────┼───────┼────────────┼──────────────────
1 | angular/angular     | 94256 | TypeScript | Angular framework
2 | angular/angular.js | 59234 | JavaScript | AngularJS framework
...
```

### Pattern 3: Language-Specific Search

```bash
$ contriflow search "web framework" --language python --stars 500

🔍 Repository Search

Searching repositories for "web framework"...
✓ Found 8 repositories

# | Repository        | Stars | Language | Description
──┼──────────────────┼───────┼──────────┼─────────────────────
1 | pallets/flask     | 68234 | Python   | Flask micro framework
2 | django/django     | 81234 | Python   | Django web framework
...
```

### Pattern 4: Non-Interactive Table Display

```bash
$ contriflow search typescript --stars 1000 --no-interactive --table

🔍 Repository Search

Searching repositories for "typescript"...
✓ Found 15 repositories

─────────────────────────────────────────────────────
Search Results (Table View)
─────────────────────────────────────────────────────

# | Repository        | Stars  | Language   | Description
──┼──────────────────┼────────┼────────────┼────────────────────
1 | microsoft/TypeScript | 102456 | TypeScript | TypeScript compiler
2 | vuejs/vue          | 215678 | TypeScript | Vue.js framework
...
```

### Pattern 5: List Format Output

```bash
$ contriflow search go --stars 500 --no-table

🔍 Repository Search

Searching repositories for "go"...
✓ Found 9 repositories

─────────────────────────────────────────────────────
Search Results (List View)
─────────────────────────────────────────────────────

1. golang/go (118234⭐)
   Go programming language
   Language: Go
   https://github.com/golang/go

2. kubernetes/kubernetes (115456⭐)
   Kubernetes container orchestration
   Language: Go
   https://github.com/kubernetes/kubernetes

...
```

## Features

### ✅ Positional Arguments
- Specify keyword directly: `contriflow search react`
- No need for `--keyword` flag
- More intuitive command syntax

### ✅ Star Filtering
- `--stars <number>` - Quick filter by minimum stars
- Example: `contriflow search python --stars 1000`
- Alternative: `--min-stars` and `--max-stars` for range

### ✅ Table Display
- Clean, formatted table output
- Shows: #, Repository, Stars, Language, Description
- Column-aligned and easy to read
- **Default output format**

### ✅ List Display
- Traditional list format with full details
- Use `--no-table` flag
- Shows: name, description, language, URL
- Color-coded information

### ✅ Interactive Selection
- Select repository from results
- View full details of selected repo
- Get setup command suggestion
- Use `--no-interactive` to skip

### ✅ Language Filter
- Filter by programming language
- Example: `contriflow search cli --language rust`
- Works with all output formats

### ✅ Results Per Page
- Control number of results
- Default: 10 repositories
- Use `-p, --per-page <number>`

## Command Options Explained

### Keyword/Search Term

```bash
# As positional argument (preferred)
contriflow search "react hooks"

# As option (alternative)
contriflow search --keyword "react hooks"

# Interactive (if not provided)
contriflow search
# Will prompt: Enter search keyword:
```

### Star Filter (`--stars`)

```bash
# Filter by minimum stars
contriflow search docker --stars 500

# Equivalent to
contriflow search docker --min-stars 500

# Use --min-stars and --max-stars for range
contriflow search cli --min-stars 100 --max-stars 10000
```

### Language Filter (`--language`)

```bash
# Filter by language
contriflow search framework --language python

# Supports any GitHub language
# JavaScript, Python, Go, Rust, TypeScript, Java, C++, etc.
contriflow search database --language golang
```

### Output Format

```bash
# Table format (default)
contriflow search react --table

# List format
contriflow search react --no-table

# Mix: table + no interactive
contriflow search react --table --no-interactive
```

### Results Per Page

```bash
# Default: 10 results
contriflow search react

# Increase to 20 results
contriflow search react --per-page 20

# Limit to 5 results
contriflow search react -p 5
```

## Real-World Examples

### Example 1: Find Popular React Libraries

```bash
contriflow search react --stars 1000 --language javascript
```

**Shows:** React libraries with 1000+ stars in JavaScript

### Example 2: Explore Go Projects

```bash
contriflow search "networking" --language go --stars 500 --per-page 15
```

**Shows:** 15 Go networking projects with 500+ stars

### Example 3: Python Web Frameworks

```bash
contriflow search "web framework" --language python --stars 1000 --no-interactive --table
```

**Shows:** Python web frameworks with 1000+ stars in non-interactive table format

### Example 4: Beginner-Friendly Projects

```bash
contriflow search cli --stars 100 --language javascript --per-page 5
```

**Shows:** 5 JavaScript CLI tools with 100+ stars (usually beginner-friendly)

### Example 5: CI/CD Tools

```bash
contriflow search "ci/cd" --min-stars 500 --max-stars 50000 --no-interactive
```

**Shows:** CI/CD tools with 500-50000 stars, non-interactive list format

## Table Display Format

### Columns

| Column | Description | Example |
|--------|-------------|---------|
| `#` | Result number | 1, 2, 3... |
| `Repository` | Full repository name | facebook/react |
| `Stars` | Star count (color-coded) | 217128 |
| `Language` | Primary language | JavaScript |
| `Description` | First 40 chars of description | "A JavaScript library..." |

### Color Coding

- Repository name: **Bold Cyan**
- Stars count: **Yellow**
- Language: **Green**
- Description: **Dim/Gray**
- Truncated marker: `...`

### Example Table

```
# | Repository                        | Stars  | Language   | Description
──┼──────────────────────────────────┼────────┼────────────┼──────────────────
1 | facebook/react                   | 217128 | JavaScript | A JavaScript library...
2 | angular/angular                  | 94256  | TypeScript | Angular framework...
3 | vuejs/vue                        | 215678 | JavaScript | The JavaScript framew...
4 | sveltejs/svelte                  | 79234  | JavaScript | Cybernetically enhanc...
5 | nextjs/next.js                   | 127456 | TypeScript | The React Framework...
```

## Integration with Other Commands

### After Search: Fork and Contribute

```bash
# 1. Search for interesting project
$ contriflow search "cli tool" --stars 500 --language python

# 2. Select repository (interactive)
? Select a repository to explore:
❯ pallets/click (9234⭐)

# 3. Get suggested command
To fork and clone: contriflow setup --repo pallets/click

# 4. Fork and start contributing
$ contriflow setup --repo pallets/click
```

### Combining with Search Modes

```bash
# Get quick stats in table format
contriflow search machine-learning --stars 1000 --no-interactive --table

# Get full details for selected repo
contriflow search machine-learning --stars 1000 --interactive --no-table
```

## Performance Tips

### 1. Use Higher Star Count for Popular Keywords

```bash
# Better: narrows results
contriflow search "web framework" --stars 1000

# Worse: too many results
contriflow search "web framework" --stars 10
```

### 2. Use Language Filter to Narrow Results

```bash
# Better: specific language
contriflow search framework --language rust

# Worse: all languages
contriflow search framework
```

### 3. Limit Results Per Page

```bash
# Better: manageable results
contriflow search cli --per-page 10

# Worse: overwhelming results
contriflow search cli --per-page 100
```

## Troubleshooting

### "No repositories found"

**Causes:**
- Keyword is too specific
- Star filter is too high
- Language filter excludes all results

**Solutions:**
```bash
# Lower the star requirement
contriflow search react --stars 10

# Remove language filter
contriflow search react --stars 100

# Try different keywords
contriflow search "react library" --stars 100
```

### "API rate limit exceeded"

**Cause:** Made too many searches too quickly

**Solution:**
```bash
# Wait a few minutes, then try again
# or use authentication
contriflow login  # Increases rate limits
contriflow search react --stars 100
```

### "Token not found"

**Cause:** Not logged in (optional for search)

**Solution:**
```bash
# You don't need to log in for public searches
# But logging in increases rate limits
contriflow login
contriflow search react --stars 100
```

## Advanced Patterns

### Pattern A: Discover New Projects

```bash
# Find emerging projects (100-1000 stars)
contriflow search "machine learning" --min-stars 100 --max-stars 1000 --language python
```

### Pattern B: Find Stable, Well-Maintained

```bash
# Find mature projects (10000+ stars)
contriflow search "database" --stars 10000 --language go --per-page 5
```

### Pattern C: Compare Frameworks

```bash
# Compare Python web frameworks
contriflow search "web framework" --language python --stars 1000 --no-interactive

# Compare JavaScript frameworks
contriflow search "web framework" --language javascript --stars 1000 --no-interactive
```

## Search Tips

✅ **DO:**
- Use quotes for multi-word searches: `"machine learning"`
- Use language filters for specificity
- Set reasonable star minimums
- Use table format for scanning
- Use list format for details

❌ **DON'T:**
- Search with `--stars 1` (too many results)
- Search without language filter for popular terms
- Forget to login (limits rate)
- Use very broad keywords alone

## Related Commands

- `contriflow login` - Log in (increases API rate limits)
- `contriflow issues` - Find issues to work on
- `contriflow setup --repo <owner/repo>` - Fork and clone
- `contriflow contribute` - Track contributions

## Command Comparison

| Use Case | Command |
|----------|---------|
| Find repositories | `contriflow search` |
| Find issues | `contriflow issues` |
| Track stats | `contriflow contribute --stats` |
| Fork & setup | `contriflow setup` |

## Getting Help

```bash
# Command help
contriflow search --help

# Main help
contriflow --help

# Search with guidance
contriflow search  # Will prompt for keyword
```

---

**The search command makes discovering open-source projects easy and fun!** 🚀

# commit-prep

Prepares and creates a git commit with proper validation.

## Description
Performs pre-commit validation, runs all checks, and helps create a well-formatted commit with proper attribution.

## Usage
```
/commit-prep [commit message]
```

## What it does
1. Runs final validation checks (TypeScript, linting, build)
2. Shows git status and staged changes
3. Reviews git diff to understand what's being committed
4. Creates commit with provided message (or prompts for one)
5. Adds Claude Code attribution to commit
6. Confirms commit was successful

This ensures commits meet project standards and include proper attribution.
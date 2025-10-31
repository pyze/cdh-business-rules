# research-setup

Sets up a local research branch for investigation tasks.

## Description
Creates a local research branch for analysis, exploration, or investigation tasks that don't require code changes to be committed to remote.

## Usage
```
/research-setup [issue-number] [description]
```

## What it does
1. Ensures clean working directory
2. Fetches latest changes from origin
3. Creates local research branch: `research-issue-{number}-{description}`
4. Reminds about research workflow constraints
5. Provides guidance on documenting findings

Research branches are LOCAL ONLY and should be deleted after findings are documented in GitHub issues.
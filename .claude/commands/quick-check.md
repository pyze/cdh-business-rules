# quick-check

Performs a quick health check of the codebase.

## Description
Runs essential checks to ensure the codebase is in good state: type checking, linting, and build verification.

## Usage
```
/quick-check
```

## What it does
1. TypeScript compilation check (`npx tsc --noEmit`)
2. Linting check (`pnpm lint`)
3. Build verification (`pnpm build`)
4. Reports any issues found

This is useful before committing changes or when diagnosing issues with the codebase.
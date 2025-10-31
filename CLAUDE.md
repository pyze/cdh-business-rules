# Systematic Development Process

This document defines development processes for various task types.

**WORKFLOW SELECTION**: Choose the appropriate workflow based on task complexity:

**Quick Tasks** (Default for simple requests):
- Simple questions, clarifications, or explanations
- Reading files or exploring codebase
- No formal process required

**Development Workflow** (For code changes):
- Use full 7-phase process for complex features or significant refactoring
- Use streamlined version for bug fixes and minor updates
- Documentation updates scaled to change significance

**Research Workflow** (For investigation without code changes):
- Analysis, brainstorming, or exploration tasks
- Document findings in GitHub issues

**WORKFLOW BOUNDARIES**: 
- Each workflow is INDEPENDENT and must be completed fully before starting new work
- Workflows end with git commit (Phase 6.5) and documentation completion
- New tasks require NEW workflow starting from Phase 1, regardless of relationship to previous work

---

## Phase 1: Pre-Work Validation

**Before starting any development task, complete these validation steps:**

### 1.1 Clean Working Directory Check

```bash
git status
```

- Ensure no uncommitted changes or dirty files
- If dirty files exist, commit them or ask how to proceed before starting new work

### 1.2 Review System Instructions and Plan Clarification

- **Read**: Project-specific coding guidelines and documentation
  - Review the Coding Guidelines section below for code style, testing requirements, and development patterns
  - Review `docs/ai-lessons-learned.md` for established technical patterns and debugging techniques
  - Review package.json scripts for development workflow commands
- **Review relevant library documentation**: Determine the libraries involved in the implementation
- **Clarify the Plan**: Iterate with the user over a plan to implement. If there are any ambiguities, ask the user to clarify. Ask one question at a time.

### 1.3 Git Workflow Setup

**Branch Selection**:
1. Check for existing related work: `gh pr list` and `git branch -a`
2. Use existing branch if continuing previous work
3. Create new branch only for entirely new features

**Quick Check** (for all workflows):
```bash
git status  # Ensure clean working directory
git fetch origin  # Get latest changes
```

**For EXISTING related work**:
```bash
git checkout existing-feature-branch
git pull origin existing-feature-branch
```

**For NEW work only**:
```bash
git checkout main
git pull origin main
git checkout -b feature/descriptive-name
```

**Merge Conflict Prevention**:
- Sync with main before starting work: `git fetch origin && git merge origin/main`
- Regularly sync during development to prevent drift
- Final sync before pushing to ensure clean PR

### 1.4 Development Environment Setup

**Standard Commands**:
```bash
pnpm install  # Install dependencies
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run linting
pnpm start    # Start production server
```

---

## Phase 2: Analysis & Planning

**Use systematic thinking to create a comprehensive plan before implementation.**

### 2.1 Think Tool Analysis

- Analyze the problem, constraints, and potential approaches
- Consider multiple solutions and their tradeoffs
- Identify dependencies and integration points
- Assess risks and potential issues

### 2.2 Requirements Integration

- Follow coding guidelines from the Coding Guidelines section
- Apply established patterns from `docs/ai-lessons-learned.md`
- Consider React/Next.js best practices and project structure
- Plan testing approach using appropriate frameworks

### 2.3 Documentation Planning

**Documentation should be proportional to change significance:**

**Major Features/Refactoring**: Update relevant documentation files
- Technical patterns → ai-lessons-learned.md
- User workflows → use-cases.md  
- Architecture changes → system-architecture.md
- Business impact → business-context.md

**Bug Fixes/Minor Updates**: 
- Update only directly affected documentation
- Focus on ai-lessons-learned.md for reusable patterns

**Trivial Changes** (typos, formatting):
- Documentation updates optional unless patterns discovered

### 2.4 Execution Plan Creation

Create step-by-step plan including:
- Implementation approach with specific steps
- Testing strategy
- Integration points
- Documentation updates (if needed)
- Git workflow

---

## Phase 3: Plan Review & Clarification

**For complex tasks, present your plan for validation:**

### 3.1 Plan Presentation

- Present complete execution plan for review
- Highlight any assumptions or areas of uncertainty

### 3.2 Clarifying Questions

- Ask questions ONE AT A TIME until plan is validated
- Wait for response before asking the next question

### 3.3 Final Plan Confirmation

- Confirm final approach before beginning implementation
- Ensure alignment on scope and expectations

---

## Phase 4: Systematic Execution

**Implement the validated plan:**

### 4.1 Development Environment Setup

```bash
pnpm install  # If needed
pnpm dev      # Start development server
```

### 4.2 Implementation Guidelines

- Follow coding guidelines and established patterns
- Use appropriate React/Next.js development tools
- Test incrementally during development
- Follow TypeScript best practices

### 4.3 Testing and Validation

```bash
npx tsc --noEmit  # Type checking
pnpm lint         # Linting
pnpm build        # Build verification
```

---

## Phase 5: User Approval & Review

**For significant changes, obtain user approval before committing:**

### 5.1 Work Completion Summary

- Present completed implementation
- Summarize changes made
- Highlight any deviations from plan

### 5.2 Request User Approval

- Ask for user approval before proceeding to commit
- Address any feedback or requested changes

---

## Phase 6: Documentation and Commit

### 6.1 Documentation Updates

Update documentation proportional to change significance (see Phase 2.3).

### 6.2 Final Validation

```bash
npx tsc --noEmit
pnpm lint
pnpm build
```

### 6.3 Git Commit

- Commit all changes including any documentation updates
- Use clear, descriptive commit messages

### 6.4 Workflow Completion

After committing, the current workflow is complete. New tasks require starting from Phase 1.

---

## Research Workflow

**For investigation/analysis tasks without code changes:**

### R1: Research Setup
- Verify GitHub issue exists
- Create local research branch: `git checkout -b research-issue-{number}`

### R2: Investigation
- Use think tool for systematic analysis
- Document findings incrementally
- Update GitHub issue with progress

### R3: Research Completion
- Post comprehensive findings to GitHub issue
- Delete local research branch
- Convert findings to implementation issues if needed

---

## Task Management

Use TodoWrite and TodoRead tools when:
- Working on multi-step features (3+ distinct steps)
- Debugging complex issues requiring systematic investigation
- Managing multiple related tasks
- User explicitly requests task tracking

Skip todo tools for:
- Single-step tasks or simple fixes
- Quick questions or file reads
- Exploratory searches
- Documentation-only changes

---

## Coding Guidelines

### TypeScript and React Patterns
- Use TypeScript strictly with full type coverage
- React functional components with hooks
- Clear interfaces for component props
- Appropriate state management patterns

### Next.js Best Practices
- Use App Router patterns for routing
- Follow RESTful patterns for API routes
- Leverage server components for performance
- Mark client components explicitly

### Testing Requirements
- Unit tests for business logic
- Component tests with React Testing Library
- Integration tests for API interactions
- Comprehensive TypeScript types

### Code Style
- Follow established file structure patterns
- Clear, descriptive naming conventions
- Consistent import organization
- Proper error handling and loading states
- Performance optimization patterns

---

## Process Compliance

This process ensures:
- ✅ Thoughtful analysis before implementation
- ✅ Proper validation and testing
- ✅ Proportional documentation
- ✅ Alignment with best practices
- ✅ Systematic approach when needed
- ✅ Flexibility for simple tasks

## Workflow Independence

**CRITICAL WORKFLOW RULE**: Each workflow (development or research) is completely independent:

### Development Workflow Independence
- No carryover between workflows: Each workflow starts fresh from Phase 1
- Git commits end workflows: After committing work, the workflow is complete
- New tasks = New workflows: Any subsequent work requires starting a new workflow
- Complete isolation: Each workflow must be self-contained and fully executed

### Research Workflow Independence  
- No carryover between research tasks: Each research task starts fresh from R1
- GitHub issue updates end workflows: After final research documentation, the workflow is complete
- Research to implementation transition: Converting research findings to implementation requires starting new development workflows
- Local branch isolation: Research branches are deleted after completion, no persistence in git history
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
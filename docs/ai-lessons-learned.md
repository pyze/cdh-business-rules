# AI Development Lessons Learned

This document captures reusable technical patterns and debugging techniques discovered during development.

## React Component Patterns

### Component Organization
- Use functional components with TypeScript interfaces for props
- Organize components by feature in dedicated directories
- Separate UI components from business logic components

### State Management Patterns
- Use React hooks for local component state
- Implement custom hooks for reusable stateful logic
- Consider context for shared state between components

## Floating Chat Widget Patterns

### Multi-State Widget Architecture
- Implement three distinct states: 'closed' | 'welcome' | 'expanded'
- Use state transitions to guide user through progressive disclosure
- Auto-advance from welcome to expanded state after timeout

### Global Component Placement
- Add floating widgets to root layout for universal availability
- Use fixed positioning with high z-index for overlay behavior
- Handle click-outside events to manage widget state

### Progressive Chat Engagement
- Start with minimal UI (floating button)
- Show contextual welcome message with branding
- Expand to full chat interface on user interaction
- Include suggested questions for user guidance

### Chat Widget State Management
- Use single state variable for widget visibility states
- Implement smooth transitions between states with CSS animations
- Handle edge cases like rapid state changes and user interruptions

### Contextual Chat Integration
- Pass UI context (page state, dashboard metrics, simulation results) to chat API
- Create context manager to gather relevant UI state for each chat request
- Support multiple simulation history for comparison discussions
- Structure context data hierarchically: page → dashboard/rules → simulation details
- Use callback patterns to capture simulation completion events for real-time context updates

### Chat UX Optimization Patterns
- **Focus Management**: Automatically return keyboard focus to input field after AI response completes
- **Delayed Focus**: Use setTimeout with 100ms delay to ensure DOM updates complete before focusing
- **State-Aware Focus**: Only focus input when chat widget is in expanded state to avoid focus conflicts
- **Error Recovery Focus**: Maintain input focus during error scenarios for seamless user recovery

### localStorage-Based Context Architecture
- **Critical Pattern**: Use localStorage as single source of truth for chatbot context to avoid React prop timing issues
- **Session Management**: Implement session-based storage that clears on page load but persists during navigation
- **Context Independence**: Completely decouple chatbot context from React component state and props
- **Lazy Context Creation**: Create UI context at message send time rather than component render time
- **Error Resilience**: Gracefully handle localStorage errors with try/catch blocks and fallback behavior
- **Hot Reload Survival**: localStorage-based approach survives development hot reloads unlike React state

### Context Storage Patterns
- Store dashboard context in localStorage on state changes: `localStorage.setItem('dashboardContext', JSON.stringify(context))`
- Store simulation session data with arrays for multi-simulation tracking: `localStorage.setItem('simulationSession', JSON.stringify(sessionData))`
- Clear session data on page component mount to establish new user sessions
- Read context lazily in chatbot when sending messages to avoid stale data
- Handle serialization errors by falling back to basic context without UI state

## Next.js Development Patterns

### App Router Patterns
- Use Server Components by default for better performance
- Mark Client Components explicitly with "use client" when needed
- Leverage layout.tsx files for shared UI across routes

### API Route Patterns
- Follow RESTful conventions for API endpoints
- Implement proper error handling with appropriate HTTP status codes
- Use TypeScript interfaces for request/response types

## TypeScript Best Practices

### Type Safety Patterns
- Enable strict mode in tsconfig.json
- Define clear interfaces for component props and API responses
- Use type guards for runtime type checking

### Development Efficiency
- Leverage TypeScript's inference where possible
- Use generic types for reusable components
- Implement proper error boundaries with typed error states

## Testing Strategies

### Component Testing
- Use React Testing Library for component testing
- Test user interactions rather than implementation details
- Mock external dependencies and API calls

### Integration Testing
- Test complete user workflows end-to-end
- Validate API integrations with realistic data
- Test error scenarios and edge cases

## Performance Optimization

### React Performance
- Use React.memo for expensive component renders
- Implement proper key props for list items
- Optimize re-renders with useCallback and useMemo

### Next.js Optimizations
- Leverage static generation where appropriate
- Implement proper image optimization with next/image
- Use dynamic imports for code splitting

## Error Handling Patterns

### User Experience
- Implement error boundaries for graceful failure handling
- Provide meaningful error messages to users
- Include loading states for async operations

### Development Debugging
- Use React Developer Tools for component debugging
- Implement proper logging for development and production
- Use TypeScript strict mode to catch errors early
- Restart Next.js development server when CSS changes don't appear (hot reload limitations)
- Check for conflicting inline styles when CSS classes aren't applying correctly

## Styling Patterns

### Tailwind CSS
- Use consistent spacing and color scales
- Implement responsive design patterns
- Create reusable component variants with class-variance-authority

### Component Styling
- Co-locate styles with components
- Use CSS modules for component-specific styles
- Implement consistent design system patterns

### Chat Message Styling Patterns
- Use gradient backgrounds for visual depth and modern appearance
- Implement distinct color schemes for user vs assistant messages
- Apply shadow effects (`shadow-sm`) for subtle depth enhancement
- Use theme-aware styling with dark mode variants for assistant messages
- Maintain high contrast ratios for accessibility compliance
- Apply consistent border radius with directional cuts (`rounded-br-none`, `rounded-bl-none`) for chat bubble effect

## Build and Deployment

### Development Workflow
- Use pnpm for package management
- Run type checking and linting before commits
- Implement pre-commit hooks for code quality

### Production Considerations
- Optimize bundle size with proper tree shaking
- Implement proper environment variable management
- Use Docker for consistent deployment environments

### Cloud Deployment Patterns
- **Google Cloud Run**: Serverless container deployment with automatic scaling
- **Artifact Registry**: Centralized container image storage and management
- **Cloud Build**: Automated CI/CD pipeline with `cloudbuild.yaml` configuration
- **Environment Variables**: Secure injection of API keys and configuration via Cloud Run environment
- **Deployment Scripts**: Automated deployment via bash scripts with error handling and rollback capabilities
- **Build Duration**: Optimize for ~3-4 minute build times with efficient Docker layer caching
- **Health Checks**: Implement proper container health monitoring for production reliability

## AI/Chat Integration Patterns

### Context-Aware Chat Systems
- Implement hierarchical context structure: PageContext → DashboardContext → SimulationContext
- Use synchronous context formatting to avoid Promise display issues in UI
- Design context managers to gather and format UI state for AI consumption
- Support simulation history tracking for multi-simulation comparison capabilities

### API Context Passing
- Accept optional `uiContext` parameter in chat API endpoints
- Merge UI context with domain knowledge (strategy/rules context)
- Fallback gracefully when UI context is not provided
- Structure system prompts to utilize both static and dynamic context effectively

### Simulation Integration Patterns
- Track simulation inputs, results, and detailed rule pass/fail status
- Implement callback patterns for real-time simulation completion handling
- Support simulation history for comparison and iterative improvement discussions
- Format simulation results with detailed rule evaluation context for AI analysis
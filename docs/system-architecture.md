# System Architecture

This document describes the technical infrastructure, component relationships, and architectural decisions for the branded chat frontend application.

## Application Architecture

### Next.js Application Structure
- **App Router**: Using Next.js 13+ App Router for modern routing patterns
- **Server Components**: Leveraging server-side rendering for optimal performance
- **Client Components**: Strategic use of client-side interactivity where needed
- **API Routes**: RESTful API endpoints for chat functionality and data management

### Component Hierarchy
```
app/
├── layout.tsx (Root layout with global providers)
├── page.tsx (Main chat interface)
├── dashboard/ (Analytics and metrics)
├── context-chat/ (Context-aware chat)
├── json-chat/ (JSON-based chat)
├── responses-chat/ (Response analysis)
└── api/ (API route handlers)
    ├── chat/ (Standard chat endpoints)
    ├── chat-context/ (Contextual chat)
    ├── chat-direct/ (Direct chat)
    ├── chat-json/ (JSON chat)
    ├── chat-new/ (New chat sessions)
    ├── chat-responses/ (Response analysis)
    └── chat-simple/ (Simplified chat)
```

### Component Architecture
```
components/
├── ui/ (Reusable UI components from shadcn/ui)
├── floating-chatbot.tsx (Global floating chat widget)
├── chat-message.tsx (Individual message display - reused in widget)
├── dashboard/ (Dashboard-specific components)
│   ├── client-dashboard-wrapper.tsx
│   ├── dashboard.tsx
│   ├── metric-card.tsx
│   └── charts/ (Various chart components)
└── theme-provider.tsx (Theme and styling context)
```

## Technology Stack

### Frontend Framework
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Core UI library with modern hooks and patterns
- **TypeScript 5**: Static typing and development tooling

### UI and Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework with gradient and shadow utilities
- **Radix UI**: Headless UI component primitives
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library with Tailwind integration
- **Chat Styling**: Modern gradient-based color scheme with theme-aware dark mode support

### State Management and Data
- **React Hooks**: Built-in state management for component state
- **Context API**: Global state management for themes and app-wide state
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation and schema parsing

### Development Tools
- **TypeScript**: Static type checking and IDE support
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting (configured through Next.js)
- **pnpm**: Package management with efficient dependency handling
- **Next.js Dev Server**: Hot reload with occasional restart requirements for CSS changes

## Data Flow Architecture

### Floating Chat Widget Data Flow
```
User Click → Widget State Transition → Chat Input → Context Collection (localStorage) → API Route → OpenAI → Streaming Response → Widget Message Display
```

### Contextual Chat Data Flow
```
Page Interaction → Context Storage (localStorage) → User Chat Message → Lazy Context Reading → Enhanced API Request → AI Response with Context
```

### Dashboard Data Flow
```
Page Load → Static Data → Dashboard Components → Chart Rendering → Interactive Metrics Display
```

### State Management Patterns
- **Widget State**: useState for chat widget visibility (closed/welcome/expanded)
- **Chat Messages**: useState array for conversation history
- **Dashboard State**: Component-level state for dashboard interactions
- **Global State**: Root layout manages floating widget availability
- **Context Storage**: localStorage-based architecture for chatbot context independence

### localStorage-Based Context Architecture
- **Context Independence**: Chatbot context completely decoupled from React component state
- **Session Management**: Browser session-based storage that persists across navigation
- **Context Types**:
  - `dashboardContext`: Current dashboard metrics and visible charts
  - `simulationSession`: Array of all simulation runs with timestamps
  - `rulesContext`: Selected nodes and rule details
- **Storage Strategy**: 
  - Clear session data on page component mount (new session)
  - Store context changes immediately via useEffect hooks
  - Read context lazily when sending chat messages
- **Error Resilience**: Graceful fallback when localStorage is unavailable or corrupted

### API Communication
- **Chat API**: Streaming responses from OpenAI via /api/chat-json endpoint
- **Request/Response Types**: TypeScript interfaces for message format
- **Error Handling**: User-friendly error display in chat widget
- **Loading States**: Progressive loading indicators in chat interface

## External Integrations

### Chat Service Integration
- **OpenAI API**: Primary chat AI service integration
- **WebSocket Support**: Real-time communication capabilities (WebSocket library included)
- **Fallback Mechanisms**: Error handling for service unavailability

### Authentication and Security
- **Session Management**: User session handling and persistence
- **API Security**: Secure API communication with proper authentication
- **Input Validation**: Client and server-side input sanitization

## Deployment Architecture

### Container Configuration
- **Docker**: Containerized deployment with Dockerfile
- **Cloud Run**: Google Cloud deployment configuration (cloudbuild.yaml)
- **Port Configuration**: Dynamic port assignment for cloud deployment (port 3000)
- **Health Checks**: Application health monitoring endpoints

### Production Deployment Infrastructure
- **Google Cloud Project**: `pyze-automation-dev3`
- **Cloud Run Service**: `cibc-business-rules-demo`
- **Deployment Region**: `us-east1`
- **Artifact Registry**: Docker images stored in `cibc-business-rules-demo-repo`
- **Image Repository**: `us-east1-docker.pkg.dev/pyze-automation-dev3/cibc-business-rules-demo-repo/cibc-business-rules-demo`
- **Service URL**: `https://cibc-business-rules-demo-635110435158.us-east1.run.app`
- **Deployment Method**: Automated via `deploy_cloud_run.sh` script with Cloud Build integration

### Build and Optimization
- **Next.js Build**: Optimized production builds with static generation
- **Bundle Analysis**: Code splitting and tree shaking for optimal bundle sizes
- **Asset Optimization**: Image and static asset optimization
- **TypeScript Compilation**: Type checking and compilation in build pipeline

### Environment Management
- **Environment Variables**: Configuration management for different deployment environments
  - `NODE_ENV=production` for production builds
  - `OPENAI_API_KEY` for AI service integration
  - Dynamic port assignment via Cloud Run environment
- **Feature Flags**: Runtime configuration for feature toggles
- **Monitoring**: Application performance and error monitoring

### Cloud Build Configuration
- **Build Triggers**: Automated builds via `cloudbuild.yaml` configuration
- **Build Duration**: Typical build time ~3-4 minutes for full deployment
- **Artifact Storage**: Container images stored in Google Artifact Registry
- **Build Environment**: Cloud Build with Docker support and multi-stage builds
- **Substitution Variables**: Dynamic image tagging and environment variable injection

## Performance Architecture

### Client-Side Performance
- **Code Splitting**: Dynamic imports for route-based code splitting
- **Image Optimization**: Next.js Image component for optimized loading
- **Caching Strategies**: Browser caching for static assets
- **Bundle Optimization**: Minimized JavaScript and CSS bundles

### Server-Side Performance
- **Server Components**: Reduced client-side JavaScript through server rendering
- **Static Generation**: Pre-built pages for optimal loading performance
- **API Optimization**: Efficient API route handling and response caching
- **Database Optimization**: Efficient data queries and caching strategies

### Monitoring and Observability
- **Performance Metrics**: Client and server performance monitoring
- **Error Tracking**: Comprehensive error logging and reporting
- **User Analytics**: User interaction tracking and behavior analysis
- **System Health**: Application uptime and performance monitoring

## Security Architecture

### Data Protection
- **Input Sanitization**: Comprehensive input validation and sanitization
- **XSS Prevention**: Cross-site scripting protection measures
- **CSRF Protection**: Cross-site request forgery prevention
- **Content Security Policy**: Browser security policy implementation

### API Security
- **Authentication**: Secure user authentication and session management
- **Authorization**: Role-based access control for different features
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Communication**: HTTPS enforcement and secure headers

### Privacy and Compliance
- **Data Minimization**: Collection of only necessary user data
- **Session Security**: Secure session management and token handling
- **Audit Logging**: Comprehensive logging for security audit trails
- **Compliance**: GDPR and privacy regulation compliance measures
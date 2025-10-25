# Copilot Instructions

## Repository Overview

SeaPunk Manager is a TypeScript-based web application for managing a tabletop RPG game system. It's a monorepo using Turborepo for workspace management, consisting of:

- Next.js frontend (React)
- NestJS backend (REST API)
- Shared UI library
- Shared types package
- Configuration packages

**Tech Stack:**

- TypeScript (strict mode)
- Next.js 14 (app router)
- NestJS 10
- Prisma ORM
- TanStack Query
- Tailwind CSS
- Shadcn/ui components

## Project Layout

### Key Directories

```
/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend-rest/      # NestJS REST API
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configurations
```

### Critical Configuration Files

- `/turbo.json` - Turborepo configuration
- `/apps/frontend/next.config.js` - Next.js configuration
- `/apps/backend-rest/nest-cli.json` - NestJS configuration
- `/apps/backend-rest/prisma/schema.prisma` - Database schema
- `/packages/config/eslint/index.js` - Shared ESLint config

## Build and Development Instructions

### Environment Setup

1. Node.js version: 18.x or higher
2. Required global packages:

```bash
npm install -g turbo
```

### First-time Setup

```bash
# Install all dependencies (ALWAYS run this first)
npm install
# Initialize database (required for backend)
cd apps/backend-rest
npx prisma generate
npx prisma db push
```

### Development Workflow

#### Starting Development Servers

```bash
# From repository root:
npm run dev     # Starts all workspaces
# Or individually:
cd apps/frontend && npm run dev
cd apps/backend-rest && npm run dev
```

Expected startup times:

- Frontend: ~10 seconds
- Backend: ~5 seconds
- Full stack: ~15 seconds

#### Building

```bash
# From repository root:
npm run build   # Builds all workspaces
```

⚠️ Important: Always build packages in this order:

1. `packages/types`
2. `packages/ui`
3. `apps/*`

### Validation Steps

#### Linting

```bash
npm run lint    # Lints all workspaces
```

Common lint errors:

- Unused imports: Run `npm run lint:fix`
- Import order: Ensure imports follow pattern: external -> internal -> types

#### Testing

```bash
npm run test    # Runs all tests
```

#### Type Checking

```bash
npm run typecheck  # Checks types in all workspaces
```

### Common Issues & Solutions

1. **Prisma Client Generation**
   - Error: `PrismaClientInitializationError`
   - Solution: Run `npx prisma generate` in `apps/backend-rest`

2. **Next.js Build Failures**
   - Error: `Error: Cannot find module '@seapunk/ui'`
   - Solution: Build packages first: `cd packages/ui && npm run build`

3. **Type Errors After Package Changes**
   - Solution: Rebuild types package: `cd packages/types && npm run build`

## Architecture Guidelines

### Frontend Structure

- Pages: `/apps/frontend/app/**/page.tsx`
- Components:
  - Shared: `/apps/frontend/components/`
  - Feature-specific: `/apps/frontend/app/**/components/`
- Hooks: `/apps/frontend/hooks/`
- Services: `/apps/frontend/services/`

### Backend Structure

- Modules: `/apps/backend-rest/src/**/`
- DTOs: `/apps/backend-rest/src/**/dto/`
- Services: `/apps/backend-rest/src/**/services/`

### Shared Packages

- UI Components: `/packages/ui/src/components/`
- Types: `/packages/types/src/`

## Continuous Integration

GitHub Actions workflow runs:

1. Type checking
2. Linting
3. Tests
4. Build verification

Success criteria:

- No TypeScript errors
- No lint errors
- All tests passing
- Successful build of all workspaces

## Best Practices

1. **Type Safety**
   - Use strict TypeScript
   - No `any` types
   - Prefer interfaces over types

2. **Component Structure**
   - Business logic in hooks
   - UI logic in components
   - Data fetching via services

3. **State Management**
   - Use TanStack Query for server state
   - Local state with React hooks
   - No global state management

4. **API Calls**
   - Use service layer abstractions
   - Type all request/response DTOs
   - Handle errors consistently

## Package-Specific Guidelines

Each package and app in the monorepo has its own README with detailed best practices:

- Frontend App (`apps/frontend/README.md`):
  - Component architecture
  - State management
  - Performance optimization
  - Testing requirements

- Backend REST API (`apps/backend-rest/README.md`):
  - Module organization
  - Controller design
  - Database practices
  - Security guidelines

- UI Package (`packages/ui/README.md`):
  - Component design
  - Accessibility requirements
  - Styling guidelines
  - Testing specifications

- Types Package (`packages/types/README.md`):
  - Type organization
  - Interface design
  - Validation requirements
  - Documentation standards

Trust these instructions for initial guidance. Only perform additional searches if specific information is missing or needs verification.

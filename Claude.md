# Sabai Flow - Development Guidelines

## Project Overview

**User Grevience Management System** is a multi-tenant hospitality management SaaS platform built for businesses in Thailand that combine cannabis, bar, restaurant, and accommodation services. The system is being developed to replace our internal B3T Accounting tool (used by Bud Brew Beyond) and will be offered as a service to similar hospitality businesses.

**Hackathon Project**: Appropriate user grevience management system with user, admin and super-admin features

**Philosophy**: Ship fast, iterate quickly, but never compromise on data integrity, security, or performance. Warnings are fine, breaking bugs are not.

**Core Principles**:
1. **Less code is better** - If you can achieve the same functionality with fewer lines of code, that's cleaner and more maintainable. Avoid clunky workarounds.
2. **Test before you code** - When creating any frontend-backend-database flow, write comprehensive tests for all use cases BEFORE writing the actual implementation code.


---

## Core Technical Stack

### Frontend (apps/web)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (pragmatic config)
- **UI Components**: shadcn/ui + Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand (domain-sliced stores)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js

### Backend (apps/server)
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript (pragmatic config)
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Authentication**: JWT based authentication
- **Storage**: Supabase Storage

---

## Project Structure

### Monorepo Root Structure
```
apps/
├── web/                    # Frontend application
├── server/                 # Backend application
├── CLAUDE.md               # Development guidelines
├── package.json            # Root package.json
└── tsconfig.json           # Root tsconfig

packages/
├── config/
│   ├── package.json
│   └── tsconfig.base.json
│
├── db/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema/
│   │       └── schema.prisma
│   ├── src/
│   │   └── index.ts
│   ├── .gitignore
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── env/
│   ├── src/
│   │   ├── server.ts
│   │   └── web.ts
│   ├── package.json
│   └── tsconfig.json

```

### Backend Structure (server)
```
server/
├── src/
│   ├── controllers/       # HTTP request handlers
│   ├── services/          # Business logic layer
│   ├── routes/            # Route definitions (v1/)
│   │   └── v1/
│   │       ├── auth.routes.ts
│   │       ├── user.routes.ts
│   │       ├── admin.routes.ts
│   │       └── super-admin.routes.ts
│   │       
│   ├── middleware/        # Express middleware
│   │   ├── authentication.ts        # JWT authentication middleware
│   │   ├── authorization.ts      # Authorization middleware
│   │   ├── validate.ts    # Input validation middleware
│   │   └── rate-limit.ts  # Rate limiting middleware
│   │
│   ├── lib/               # Core libraries
│   │   ├── prisma.ts      # Prisma client and database connection
│   │   ├── logger.ts      # Logging utility
│   │   ├── error-handler.ts       #Global Error handling
│   │   └── config.ts      # Configuration management
│   │
│   ├── worker/
│   │   ├── src/
│   │   │   ├── index.ts         # Worker bootstrap
│   │   │   │
│   │   │   ├── queues/          # BullMQ queues
│   │   │   │   ├── grievance.queue.ts
│   │   │   │   ├── duplicate.queue.ts
│   │   │   │   └── routing.queue.ts
│   │   │   │
│   │   │   ├── workers/         # BullMQ Workers
│   │   │   │   ├── grievance.worker.ts
│   │   │   │   ├── duplicate.worker.ts
│   │   │   │   └── routing.worker.ts
│   │   │   │
│   │   │   ├── processors/      # Pure business logic (AI steps)
│   │   │   │   ├── grievance.processor.ts
│   │   │   │   ├── duplicate.processor.ts
│   │   │   │   └── routing.processor.ts
│   │   │   │
│   │   │   ├── services/        # External integrations
│   │   │   │   ├── gemini.service.ts
│   │   │   │   └── grievance.service.ts
│   │   │   │
│   │   │   ├── prompts/
│   │   │   │   ├── master.prompt.ts
│   │   │   │   ├── duplicate.prompt.ts
│   │   │   │   └── routing.prompt.ts
│   │   │   │
│   │   │   ├── events/          # Event emission helpers
│   │   │   │   ├── grievance.events.ts
│   │   │   │   └── duplicate.events.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── safeJson.ts
│   │   │   │   └── jobId.ts
│   │   │   │
│   │   │   └── types/
│   │   │       └── job.types.ts
│   │   │
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Helper functions
│   ├── prisma/            # Prisma schema and migrations
│   └── index.ts           # Express entry point
└── tsconfig.json
```

### Frontend Structure (apps/server)
```
web/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (auth)/       # Auth route group
│   │   │   ├── signup/
│   │   │   └── login
│   │   │
│   │   ├── (platform)/   # Platform super admin routes
│   │   │   └── admin/
│   │   │
│   │   ├── (platform)/   # Platform citizen routes
│   │   │   └── grievances/
│   │   │
│   │   ├── (platform)/   # Platform admin routes
│   │   │   └── officer/
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   └── features/     # Feature-specific components
│   │       ├── grievance/
│   │       ├── organization/
│   │       └── user/
│   ├── lib/
│   │   ├── api/          # API client functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── schemas/      # Zod validation schemas
│   |
│   └── types/            # TypeScript types
├── public/
└── tsconfig.json         # Paths configured: @/* -> ./src/*
```

**Important**: All imports use `@/` alias pointing to `src/*`

---

## Code Quality Standards

### TypeScript Configuration (Pragmatic)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    // Warnings, not errors - fix when you can
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": false
  }
}
```

**Why**: Focus on bugs that break the app (type mismatches, null errors), not code style (unused variables).

### ESLint & Prettier

**ESLint rules**:
- Use `@typescript-eslint/recommended`
- Use `eslint-config-prettier`
- Enforce consistent import order (auto-fixable)
- Use logger instead of console.log (warning, not error)
- No arbitrary line limits - use your judgment

**Prettier**: Semi-colons: true, Single quotes: true, Trailing comma: es5, Print width: 100, Tab width: 2

**If a file feels too large, split it. If a function feels too complex, refactor it. No strict number rules.**

---

## Backend Best Practices

### 1. Validation with Zod
- All API endpoints must validate input using Zod
- Define schemas in `services/{domain}/{domain}.validation.ts`
- Share schemas with frontend when possible

### 2. Error Handling
- Use custom error classes (AppError, ValidationError, UnauthorizedError, NotFoundError, etc.)
- Global error handler middleware catches and formats all errors
- Log errors with structured logging (pino)

### 3. Authentication & Authorization
- Authenticate with JWT tokens, implement refresh tokens
- Fetch user's role, location_id, and permissions
- Role based access for user, admin and super-admin.
- Use middleware for permission-based authorization

### 4. Rate Limiting
- Redis-based rate limiting
- Per-organization and per-IP limits
- Fail open if Redis is unavailable

### 5. Caching Strategy
- Cache frequently-read data (menus, configs, room status) with Redis
- Cache-aside pattern with `wrap()` utility
- Invalidate caches on updates
- TTL: 5-10 minutes for dynamic data, longer for static

---

## Frontend Best Practices

### 1. Component Structure
- Follow atomic design principles
- Keep components small and focused
- Use composition over inheritance

### 2. Data Fetching (TanStack Query)
- Define API functions in `lib/api/{domain}.api.ts`
- Create custom hooks in `lib/hooks/use{Domain}.ts`
- Use optimistic updates for better UX
- Handle loading and error states

### 3. Form Handling
- React Hook Form + Zod for all forms
- Share validation schemas with backend
- Show inline error messages
- Handle submission loading states

### 4. State Management (React Query)
- Domain-sliced stores
- Keep stores small and focused
- Use selectors to prevent unnecessary re-renders
- Persist critical state (cart, user preferences)

### 5. Offline Support
- Service Worker + IndexedDB for local cache
- Sync when back online
- Show offline indicator to users

---

## Development Principles

### The Golden Rules

1. **Ship Fast, But Not Broken**
   - Move quickly on features, but never compromise data integrity
   - Bugs in UI are annoying, bugs in billing are catastrophic
   - Warnings are acceptable, runtime errors are not

2. **Less Code is Better**
   - If you can achieve the same functionality with fewer lines, do it
   - Avoid clunky workarounds and over-engineering
   - Simpler code is easier to maintain and debug

3. **Perfect is the Enemy of Done**
   - Get to 80% quickly, iterate to 100% based on real usage
   - Don't over-engineer for scale you don't have yet
   - Build for 10 customers first, then 100, then 1000

4. **User Data is Sacred**
   - Always use database transactions for critical operations
   - Multi-tenant isolation is non-negotiable
   - Log everything that touches money

5. **Observability > Perfection**
   - Structured logging from day one
   - Error tracking from day one
   - Better to ship with good monitoring than wait for perfect code

6. **Security is Not Optional**
   - Validate all inputs (Zod schemas)
   - Never trust external APIs
   - Rate limit everything public
   - Test auth and permissions for every new feature

### When in Doubt
- **Feature or Fix?** Fix critical bugs first, features second
- **Optimize Now or Later?** Later, unless it's currently breaking

---

## Success Criteria

### MVP Goals (24 hours)
- Successfully deployed in B3 (Bud Brew Beyond) locations
- Zero data loss incidents
- POS operations work offline and sync reliably
- Appropriate hackathon-ready project (24 hour hackathon)

### Production Goals (24 hours)
- 99%+ uptime for critical operations
- API response time p95 <300ms (POS <200ms)
- Appropriate hackathon-ready project (24 hour hackathon)
- 5-10 external customers successfully using the system
---

**This document should be updated as we learn and grow. Focus on shipping value, not following rules perfectly.**

**Last Updated**: 2026-1-03
**Version**: 1.0 (GFGBQ Edition)
**Maintained By**: Call of Code Team
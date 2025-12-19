# Sungaze

> 100% TypeScript solar utility stack sharing logic/types via `@sungaze/core` and UI via `@sungaze/ui`

## Architecture

**Monorepo:** Turborepo + pnpm (Strict Mode)

**Core Goal:** Type-safe solar utility stack with shared logic, types, and UI components across web, mobile, and API applications.

## Tech Stack

### Apps

- **`apps/api`** - Fastify 5.6 server
  - Purpose: Solar data engine and persistent user state
  - Port: `3001`
  - Features: Type-safe API with Zod schemas exported from `@sungaze/core`

- **`apps/web`** - Next.js 16.1 (App Router)
  - Purpose: SEO-friendly solar dashboards
  - Uses: Turbopack for fast development
  - Features: React 19 Server/Client components, async params/searchParams

- **`apps/mobile`** - Expo SDK 54 (React Native 0.83)
  - Purpose: Field-use mobile app with location tracking
  - Features: NativeWind v4 for styling, Expo Router for navigation

### Shared Packages

- **`@sungaze/core`** - The single source of truth
  - Solar math (SunCalc)
  - Shared Zod schemas for API/Form validation
  - Shared TypeScript interfaces
  - Exports Zod-inferred types for type-safe contracts

- **`@sungaze/ui`** - Shared component library
  - Uses NativeWind v4 (Tailwind CSS)
  - Supports React 19 Server/Client component patterns
  - Works across Web (PostCSS) and Mobile (NativeWind)

- **`@sungaze/config`** - Shared configuration
  - Base TypeScript configuration (`tsconfig.base.json`)
  - Base ESLint configuration (`eslint.base.config.mjs`)
  - Prettier configuration (`prettier.config.mjs`)
  - Centralized settings for consistency across all packages

## Key Patterns

### React 19 Patterns
- **`useActionState`** - For form handling
- **`useOptimistic`** - For optimistic data updates

### Next.js 16 Patterns
- **Async params/searchParams** - Mandatory async handling in App Router
- **Server Components** - Default rendering strategy
- **Turbopack** - Fast development builds

### Type Safety
- **Zod Schemas** - Defined in `@sungaze/core`
- **Type Inference** - API exports Zod-inferred types to prevent runtime drift
- **Shared Interfaces** - Single source of truth for TypeScript types

### Styling
- **Unified Tailwind** - Shared configuration from `@sungaze/config`
- **NativeWind v4** - Mobile styling (consumes shared Tailwind config)
- **PostCSS** - Web styling (consumes shared Tailwind config)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+ (enforced via `packageManager` field)

### Installation

```bash
# Install dependencies for all workspaces
pnpm install
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm --filter @sungaze/web dev      # Next.js web app
pnpm --filter @sungaze/api dev      # Fastify API server
pnpm --filter @sungaze/mobile dev   # Expo mobile app
```

### Building

```bash
# Build all apps and packages
pnpm build

# Build specific app/package
pnpm --filter @sungaze/core build   # Build core package
pnpm --filter @sungaze/web build    # Build Next.js app
pnpm --filter @sungaze/api build    # Build API server
```

### Type Checking

```bash
# Type-check all workspaces
pnpm type-check

# Type-check specific workspace
pnpm --filter @sungaze/core type-check
```

### Linting

```bash
# Lint all workspaces
pnpm lint

# Lint specific workspace
pnpm --filter @sungaze/web lint
```

### Formatting

```bash
# Format all files (TypeScript, JavaScript, JSON, CSS, Markdown)
pnpm format

# Check formatting without changing files
pnpm format:check
```

**Note:** Format on save is configured via `.vscode/settings.json`. Files will automatically format when saved in Cursor/VSCode.

## Useful Commands

### Root Level Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm start` | Start all apps in production mode |
| `pnpm lint` | Lint all workspaces |
| `pnpm type-check` | Type-check all workspaces |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without changing files |
| `pnpm clean` | Clean all build artifacts and node_modules |

### App-Specific Commands

#### Web (`apps/web`)
```bash
pnpm --filter @sungaze/web dev        # Start Next.js dev server (Turbopack)
pnpm --filter @sungaze/web build      # Build for production
pnpm --filter @sungaze/web start      # Start production server
pnpm --filter @sungaze/web lint       # Run ESLint
```

#### API (`apps/api`)
```bash
pnpm --filter @sungaze/api dev        # Start Fastify dev server (watch mode)
pnpm --filter @sungaze/api build      # Compile TypeScript
pnpm --filter @sungaze/api start      # Start production server
pnpm --filter @sungaze/api lint       # Run ESLint
```

#### Mobile (`apps/mobile`)
```bash
pnpm --filter @sungaze/mobile dev     # Start Expo dev server
pnpm --filter @sungaze/mobile ios     # Start iOS simulator
pnpm --filter @sungaze/mobile android # Start Android emulator
pnpm --filter @sungaze/mobile web     # Start web version
pnpm --filter @sungaze/mobile build   # Export static build
pnpm --filter @sungaze/mobile lint    # Run ESLint
```

### Package-Specific Commands

#### Core (`packages/core`)
```bash
pnpm --filter @sungaze/core build      # Build TypeScript
pnpm --filter @sungaze/core type-check # Type-check without building
```

#### UI (`packages/ui`)
```bash
pnpm --filter @sungaze/ui build        # Build TypeScript
pnpm --filter @sungaze/ui type-check   # Type-check without building
```

## Project Structure

```
sungaze/
├── apps/
│   ├── api/          # Fastify 5.6 server
│   ├── web/          # Next.js 16.1 app
│   └── mobile/       # Expo SDK 54 app
├── packages/
│   ├── core/         # Shared logic, types, Zod schemas
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configuration (TS, ESLint, Prettier)
├── .vscode/          # Editor settings (format on save, extensions)
├── .editorconfig     # Editor configuration
├── .prettierrc.mjs   # Prettier config (references shared config)
├── .prettierignore   # Files to exclude from formatting
├── package.json      # Root workspace configuration
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo configuration
```

## Development Workflow

1. **Make changes** to shared packages (`@sungaze/core`, `@sungaze/ui`)
2. **Format code** - Files auto-format on save (or run `pnpm format`)
3. **Build packages** - Turborepo will automatically rebuild dependents
4. **Test changes** - Run type-check and lint across affected workspaces
5. **Start apps** - Use `pnpm dev` to start all apps with hot reload

## Type Safety Workflow

1. **Define schemas** in `@sungaze/core` using Zod
2. **Export inferred types** from Zod schemas
3. **Import types** in apps for type-safe API contracts
4. **Validate at runtime** using Zod schemas in API
5. **Type-check** using `pnpm type-check` to catch errors early

## Configuration

### Shared Configs

All packages and apps extend shared configurations from `@sungaze/config`:

- **TypeScript**: All `tsconfig.json` files extend `packages/config/tsconfig.base.json`
- **ESLint**: Base config available at `packages/config/eslint.base.config.mjs`
- **Prettier**: Shared config at `packages/config/prettier.config.mjs`

### Editor Setup

The project includes editor configuration for consistent development:

- **`.vscode/settings.json`** - Format on save enabled with Prettier
- **`.vscode/extensions.json`** - Recommended extensions (Prettier, ESLint, TypeScript)
- **`.editorconfig`** - Editor settings for consistency
- **`.prettierrc.mjs`** - Root Prettier config (references shared config)

**Recommended Extensions** (install when prompted):
- Prettier - Code formatter
- ESLint
- TypeScript and JavaScript Language Features

## Styling Workflow

1. **Configure Tailwind** in `@sungaze/config`
2. **Use components** from `@sungaze/ui` (works on web and mobile)
3. **NativeWind** automatically handles mobile styling
4. **PostCSS** handles web styling

## Contributing

When adding new features:

1. Add shared logic/types to `@sungaze/core`
2. Add shared UI components to `@sungaze/ui`
3. Use Zod schemas for validation
4. Export types from schemas for type safety
5. Follow React 19 patterns (`useActionState`, `useOptimistic`)
6. Follow Next.js 16 patterns (async params/searchParams)

### Code Style

- **Formatting**: Code is automatically formatted on save (Prettier)
- **Linting**: ESLint runs on all TypeScript files
- **Type Safety**: All packages use strict TypeScript settings
- **Configs**: Extend shared configs from `@sungaze/config` when possible

## License

ISC


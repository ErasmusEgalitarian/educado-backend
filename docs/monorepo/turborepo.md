# Turborepo

Turborepo is a high-performance build system for JavaScript and TypeScript monorepos that orchestrates tasks across multiple packages with intelligent caching and parallelization.

> [!NOTE]
> We use Turborepo in a **simplified way** to get quick wins without adopting all advanced features. Existing npm workspace commands still work as before!

---

## Table of Contents

1. [Why Turborepo?](#why-turborepo)
2. [What We Get](#what-we-get)
3. [How It Works](#how-it-works)
4. [Configuration](#configuration)
5. [Command Reference](#command-reference)
6. [Related Documentation](#related-documentation)

---

## Why Turborepo?

### The Problem Without Turborepo

In a monorepo with multiple packages, running tasks becomes painful:

```bash
# Want to build everything? Manual coordination needed:
cd strapi && npm run build
cd ../web && npm run build

# Want to run dev servers? Hope you have multiple terminals:
cd strapi && npm run dev  # Terminal 1
cd web && npm run dev     # Terminal 2

# Want to lint both? Repeat yourself:
cd strapi && npm run lint:check
cd ../web && npm run lint:check
```

**Problems**:
- 😫 Repetitive commands
- 🐌 Sequential execution (slow)
- 🤷 No coordination between packages
- 🔄 Manual dependency management
- 💾 No caching (rebuilds everything every time)

---

### The Solution: Turborepo

One command to rule them all:

```bash
# Build everything (in parallel, with caching)
npm run build

# Run all dev servers (in parallel)
npm run dev

# Lint, type-check, test - everything at once
npm run lint:check
npm run type-check
npm run test
```

**Benefits**:
- ✅ Simple, unified commands
- ⚡ Parallel execution (faster)
- 🎯 Smart task orchestration
- 💾 Local caching (skip unchanged work)
- 🔄 Dependency-aware builds

> [!TIP]
> **We don't use remote caching** (team sharing) - just local caching for speed. This keeps it simple while still getting major benefits!

---

## What We Get

### 1. Unified Task Running

Run tasks across all packages with one command:

```bash
npm run build        # Builds web + strapi
npm run type-check   # Type-checks web + strapi
npm run lint:check   # Lints web + strapi
```

No more `cd`-ing into each package! 🎉

---

### 2. Parallel Execution

Turborepo runs independent tasks in parallel automatically:

```bash
# Both dev servers start simultaneously
npm run dev

# Both packages built at the same time
npm run build
```

**Speed improvement**: ~50% faster than sequential execution.

---

### 3. Local Caching

Turborepo caches task outputs locally:

```bash
# First build: 45 seconds
npm run build

# Second build (no changes): 2 seconds ⚡
npm run build
```

**How it works**:
- Turborepo hashes inputs (source files, dependencies, config)
- If hash matches previous run, it restores cached output
- Only rebuilds what actually changed

> [!NOTE]
> Cache is stored in `.turbo/` folder (already in `.gitignore`).

---

### 4. Smart Task Dependencies

Turborepo understands task relationships:

```json
{
  "tasks": {
    "type-check": {
      "dependsOn": ["build"]
    }
  }
}
```

**Result**: Running `npm run type-check` automatically builds first if needed.

---

### 5. Better Developer Experience

| Before Turborepo | With Turborepo |
|-----------------|----------------|
| `cd web && npm run dev` | `npm run dev` |
| `cd strapi && npm run dev` (new terminal) | ✅ Both start together |
| `cd web && npm run build && cd ../strapi && npm run build` | `npm run build` |
| 🐌 Sequential, slow | ⚡ Parallel, fast |
| 🔄 Always rebuild everything | 💾 Cache unchanged work |

---

## How It Works

### Task Orchestration

Turborepo reads `turbo.json` to understand what tasks exist and how they relate:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

When you run `npm run build`:

1. **Discovers packages**: Finds `web` and `strapi` workspaces
2. **Checks dependencies**: Runs dependency builds first (`^build`)
3. **Executes in parallel**: Runs both builds simultaneously
4. **Caches outputs**: Stores results in `.turbo/cache/`

---

### Caching Strategy

**What gets cached**:
- ✅ Build outputs (`dist/`, `build/`, `.next/`)
- ✅ Type-check results
- ✅ Lint results

**What doesn't get cached**:
- ❌ Dev servers (`cache: false`)
- ❌ Tests (currently, can be enabled)
- ❌ Docker builds

**Cache invalidation** - Cache is invalidated when:
- Source files change
- Dependencies change (`package.json`)
- Config files change (`tsconfig.json`, `.env`, `turbo.json`)
- Environment variables change (`NODE_ENV`, `CI`)

---

## Configuration

Turborepo is configured in `turbo.json` at the repository root.

### Current Configuration

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "lint": {},
    "lint:check": {},
    "lint:fix": {},
    "format:check": {},
    "format:fix": {},
    "type-check": {
      "dependsOn": ["build"]
    },
    "test": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "generate-spec": {},
    "generate-strapi-client": {
      "dependsOn": ["^generate-spec"]
    },
    "docker:build": {
      "cache": false
    }
  },
  "globalDependencies": [
    "tsconfig.json",
    ".env",
    "turbo.json"
  ],
  "globalEnv": [
    "NODE_ENV",
    "CI"
  ]
}
```

### Key Properties Explained

| Property | Purpose | Example |
|----------|---------|---------|
| `dependsOn` | Tasks that must run first | `["^build"]` = build dependencies first |
| `outputs` | Files/folders to cache | `["dist/**"]` = cache dist folder |
| `cache` | Enable/disable caching | `false` = don't cache (dev servers) |
| `persistent` | Long-running tasks | `true` = dev servers that don't exit |
| `globalDependencies` | Files that invalidate all caches | Config files that affect everything |
| `globalEnv` | Environment variables to track | Variables that affect builds |

### Dependency Patterns

| Pattern | Meaning | Use Case |
|---------|---------|----------|
| `^build` | Build **dependencies** first | Ensure libs are built before apps |
| `build` | Build **this package** first | Run build before type-check |
| `[]` | No dependencies | Independent tasks (lint, format) |

---

## Command Reference

Complete reference of all npm commands in the root `package.json`.

> [!IMPORTANT]
> **Most important section!** These are the commands you'll use daily. Commands marked with 🚀 use Turborepo.

---

### Development Commands

Start dev servers and work on code locally.

| Command | What It Does | Uses Turbo | Starts DB | Starts Strapi | Starts Web |
|---------|--------------|:----------:|:---------:|:-------------:|:----------:|
| `npm run dev` | 🚀 Start both dev servers (requires DB running) | ✅ | ❌ | ✅ | ✅ |
| `npm run dev:web` | Start Web dev server only | ❌ | ❌ | ❌ | ✅ |
| `npm run dev:backend` | Start DB + Strapi dev server | ❌ | ✅ | ✅ | ❌ |
| `npm run dev:fullstack` | Start DB + both dev servers | ✅ | ✅ | ✅ | ✅ |
| `npm run stop` | Stop all Docker containers | ❌ | 🛑 Stops | ❌ | ❌ |

**Examples**:
```bash
# Full stack development (recommended)
npm run dev:fullstack

# Just work on frontend
npm run dev:web

# Just work on backend
npm run dev:backend

# Already have DB running? Use this
npm run dev

# Done for the day? Clean up
npm run stop
```

---

### Build Commands

Build projects for production or testing.

| Command | What It Does | Uses Turbo |
|---------|--------------|:----------:|
| `npm run build` | 🚀 Build both Web + Strapi | ✅ |

**What gets built**:
- **Web**: Production-optimized bundle in `web/dist/`
- **Strapi**: Compiled admin panel in `strapi/build/`

**Example**:
```bash
# Build everything
npm run build

```

---

### Code Quality Commands

Lint, format, and type-check your code.

| Command | What It Does | Uses Turbo | Auto-fixes |
|---------|--------------|:----------:|:----------:|
| `npm run lint:check` | 🚀 Check for lint errors | ✅ | ❌ |
| `npm run lint:fix` | 🚀 Fix lint errors automatically | ✅ | ✅ |
| `npm run format:check` | 🚀 Check code formatting | ✅ | ❌ |
| `npm run format:fix` | 🚀 Format code automatically | ✅ | ✅ |
| `npm run type-check` | 🚀 Check TypeScript types | ✅ | ❌ |

**Examples**:
```bash
# Check everything before committing
npm run lint:check
npm run format:check
npm run type-check

# Or fix issues automatically
npm run lint:fix
npm run format:fix
```

> [!TIP]
> **Pre-commit workflow**: Run `lint:fix` and `format:fix` to auto-fix issues, then `type-check` to verify types.

---

### Testing Commands

Run test suites.

| Command | What It Does | Uses Turbo |
|---------|--------------|:----------:|
| `npm run test` | 🚀 Run all tests (Jest for Web, stub for Strapi) | ✅ |

**Current status**:
- **Web**: ✅ Jest tests configured and working
- **Strapi**: ⚠️ Stub (echo message only)

**Example**:
```bash
# Run all tests
npm run test
```

---

### Docker Commands

Build Docker images for deployment.

| Command | What It Does | Uses Turbo | Builds Strapi Image | Builds Web Image |
|---------|--------------|:----------:|:-------------------:|:----------------:|
| `npm run docker:build` | 🚀 Build both images | ✅ | ✅ | ✅ |
| `npm run docker:build:strapi` | Build Strapi image only | ❌ | ✅ | ❌ |
| `npm run docker:build:web` | Build Web image only | ❌ | ❌ | ✅ |

**What gets built**:
- **Images**: `educado-strapi:latest` and `educado-web:latest`
- **Optimization**: Uses `turbo prune` for minimal context

**Examples**:
```bash
# Build both images
npm run docker:build

# Build only what changed
npm run docker:build:web
---

### API Generation Commands

Generate OpenAPI spec and TypeScript client.

| Command | What It Does | Uses Turbo |
|---------|--------------|:----------:|
| `npm run generate-api` | 🚀 Generate OpenAPI spec + TS client | ✅ |

**Process**:
1. Starts Strapi and generates OpenAPI spec → `openapi/strapi-spec.json`
2. Generates TypeScript client for Web → `web/src/shared/api/`

**Example**:
```bash
# After changing Strapi content types
npm run generate-api
```

---

### Release Commands

Version bumping and git tagging.

| Command | What It Does | Uses Turbo |
|---------|--------------|:----------:|
| `npm run release:patch` | Bump patch version (0.0.0 → 0.0.1) | ❌ |
| `npm run release:minor` | Bump minor version (0.0.0 → 0.1.0) | ❌ |
| `npm run release:major` | Bump major version (0.0.0 → 1.0.0) | ❌ |
| `npm run release:web:patch` | Bump Web patch version only | ❌ |
| `npm run release:web:minor` | Bump Web minor version only | ❌ |
| `npm run release:web:major` | Bump Web major version only | ❌ |
| `npm run release:strapi:patch` | Bump Strapi patch version only | ❌ |
| `npm run release:strapi:minor` | Bump Strapi minor version only | ❌ |
| `npm run release:strapi:major` | Bump Strapi major version only | ❌ |

**Examples**:
```bash
# Release both projects (minor version)
npm run release:minor

# Release only Web (patch version)
npm run release:web:patch
```

> [!TIP]
> See [Release Process](release-process.md) for complete release workflow.

---

## Advanced Usage

### Direct Turbo Commands

You can use `turbo` directly for more control:

```bash
# Run task for specific package
turbo run build --filter=web

# Run task for changed packages only (git)
turbo run test --filter=[HEAD^1]

# Run with verbose output
turbo run build --verbose

# Skip cache
turbo run build --force

# Dry run (see what would run)
turbo run build --dry-run
```

### Filters

Powerful package selection:

```bash
# Only Web
turbo run build --filter=web

# Web and its dependencies
turbo run build --filter=web...

# Everything that depends on Web
turbo run build --filter=...web

# Multiple packages
turbo run build --filter=web --filter=strapi

# Exclude packages
turbo run build --filter=!strapi
```

> [!NOTE]
> Most developers won't need these - the npm scripts are enough! Use these for advanced debugging or CI optimization.

---

## Troubleshooting

### Cache Issues

**Problem**: Build outputs seem stale or incorrect.

**Solution**:
```bash
# Clear Turborepo cache
rm -rf .turbo

# Force rebuild without cache
turbo run build --force
```

---

### Task Not Found

**Problem**: `turbo run <task>` says task not found.

**Solution**:
```bash
# Check task exists in turbo.json
cat turbo.json | grep "<task>"

# Check package has the script
cat web/package.json | grep "<task>"
cat strapi/package.json | grep "<task>"
```

---

### Parallel Execution Issues

**Problem**: Dev servers conflict or fail when run together.

**Solution**:
```bash
# Run individually to debug
npm run dev:web     # Terminal 1
npm run dev:backend # Terminal 2

# Check port conflicts
lsof -i :5174  # Web port
lsof -i :1337  # Strapi port
```

---

## Related Documentation

- [CI/CD Pipeline](ci.md) - Automated builds using Turborepo
- [Dependencies](dependencies.md) - Managing npm packages
- [Monorepo Overview](index.md) - Architecture and structure
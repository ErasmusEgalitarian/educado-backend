
## Managing dependencies (npm workspaces)

Complete guide to managing npm dependencies in the Educado monorepo using npm workspaces.

> [!IMPORTANT]
> The monorepo uses **npm workspaces** - all dependency management happens from the **root directory** with a single `package-lock.json`.

---

## Overview

### Key Concepts

- 📦 **Single lockfile** - `package-lock.json` at root (always commit after changes)
- 🎯 **Workspace-scoped installs** - Target specific packages with `-w` flag
- 🚀 **No CD required** - Manage all dependencies from project root

> [!CAUTION]
> **Avoid installing dependencies at the root level!**
> 
> Dependencies should belong to specific workspaces (`web` or `strapi`), not the root `package.json`. Root should only contain:
> - Workspace configuration
> - Shared dev tools (Turborepo, linters)
> - Build/release scripts
> 
> **Wrong**: `npm install react` (installs to root)  
> **Right**: `npm install -w web react` (installs to web workspace)

---

## Quick Reference

### Web Frontend

| Action | Command |
|--------|---------|
| **Add runtime dependency** | `npm install -w web <package>` |
| **Add dev dependency** | `npm install -w web -D <package>` |
| **Remove dependency** | `npm uninstall -w web <package>` |
| **Update dependency** | `npm update -w web <package>` |

**Examples**:
```bash
# Add React Query
npm install -w web @tanstack/react-query

# Add dev tool (TypeScript types)
npm install -w web -D @types/react

# Remove a package
npm uninstall -w web axios

# Update to latest compatible version
npm update -w web vite
```

---

### Strapi Backend

| Action | Command |
|--------|---------|
| **Add runtime dependency** | `npm install -w strapi <package>` |
| **Add dev dependency** | `npm install -w strapi -D <package>` |
| **Remove dependency** | `npm uninstall -w strapi <package>` |
| **Update dependency** | `npm update -w strapi <package>` |

**Examples**:
```bash
# Add Strapi plugin
npm install -w strapi @strapi/plugin-graphql

# Add dev tool
npm install -w strapi -D @types/node

# Remove a package
npm uninstall -w strapi lodash

# Update to latest compatible version
npm update -w strapi @strapi/strapi
```

---

## Workspace-Wide Operations

### Install All Dependencies

Install all dependencies for every workspace:

```bash
npm install
```

**When to use**:
- 🆕 Fresh clone/setup
- 🔄 After pulling changes with `package.json` updates
- 🧹 After cleaning `node_modules`

---

### Update All Dependencies

Safely update all dependencies (respects version ranges):

```bash
npm update
```

**What it does**:
- ✅ Updates to latest **minor** and **patch** versions
- ❌ Won't update **major** versions (prevents breaking changes)
- 📝 Updates `package-lock.json`

**Example**:
```json
// package.json has "react": "^18.2.0"
// npm update will: 18.2.0 → 18.3.1 ✅
// npm update won't: 18.2.0 → 19.0.0 ❌
```

> [!TIP]
> For major version updates, use `npm install -w <workspace> <package>@latest` explicitly.

---

## Alternative: Classic Approach

Prefer working inside workspace directories? That works too:

```bash
# Navigate to workspace
cd web
npm install <package>

# Or for Strapi
cd strapi
npm install <package>
```

**Trade-offs**:
- ✅ Familiar workflow
- ✅ Tab completion for workspace files
- ❌ Requires changing directories
- ❌ Easy to forget which directory you're in

---

## Best Practices

### After Dependency Changes

Always verify your changes work:

```bash
# 1. Type check
npm run type-check

# 2. Full build
npm run build

# 3. Run tests (if available)
npm run test
```

> [!TIP]
> See the [Command Reference](turborepo.md#command-reference) for all code quality commands and what each one does.

### Commit the Lockfile

```bash
# Always commit package-lock.json
git add package-lock.json
git commit -m "chore: update dependencies"
```

> [!IMPORTANT]
> **Never** add `package-lock.json` to `.gitignore`. It ensures consistent dependency versions across all environments, especially in CI/CD.

---

## Common Workflows

### Adding a New Feature with Dependencies

```bash
# 1. Add required packages
npm install -w web axios react-hook-form

# 2. Verify installation
npm run type-check

# 3. Commit lockfile
git add package-lock.json web/package.json
git commit -m "feat: add form validation dependencies"
```

---

### Updating Outdated Dependencies

```bash
# 1. Check for outdated packages
npm outdated

# 2. Update specific workspace
npm update -w web

# 3. Test everything still works
npm run build && npm run type-check

# 4. Commit changes
git add package-lock.json web/package.json
git commit -m "chore: update web dependencies"
```

---

### Removing Unused Dependencies

```bash
# 1. Remove package
npm uninstall -w strapi unused-package

# 2. Verify builds still work
npm run build

# 3. Commit changes
git add package-lock.json strapi/package.json
git commit -m "chore: remove unused dependency"
```

---

## Troubleshooting

### Dependency Not Found After Install

**Problem**: Package installed but TypeScript can't find it.

**Solution**:

In your editor/IDE, try restarting the TypeScript server or reloading the window to refresh module resolution.

If that doesn't work, run:
```bash
# Rebuild node_modules
rm -rf node_modules
npm install

# Check package is in correct workspace
cat web/package.json | grep <package-name>
```

---

### Lockfile Conflicts

**Problem**: Git merge conflicts in `package-lock.json`.

**Solution**:
```bash
# Accept one version
git checkout --ours package-lock.json
# or
git checkout --theirs package-lock.json

# Regenerate lockfile
rm package-lock.json
npm install
```

---

### Wrong Workspace Installation

**Problem**: Accidentally installed to root instead of workspace.

**Solution**:
```bash
# 1. Remove from root
npm uninstall <package>

# 2. Install to correct workspace
npm install -w web <package>

# 3. Verify
cat package.json | grep <package>  # Should NOT appear
cat web/package.json | grep <package>  # Should appear here
```

---

## Next Steps

Now that you know how to manage dependencies:

- 🚀 **Daily development**: [Command Reference](turborepo.md#command-reference) - All npm commands
- 🤝 **Contribute code**: [Contributions Guide](contributions.md) - Git workflow and PR process
- 🔧 **Task orchestration**: [Turborepo Guide](turborepo.md) - How Turborepo works

**Back to basics:**
- [Monorepo Overview](index.md) - Documentation roadmap

---

## Related Documentation

- [Monorepo Overview](index.md) - Workspace structure
- [Turborepo](turborepo.md) - Task orchestration
- [Getting Started](getting-started.md) - Initial setup
es)
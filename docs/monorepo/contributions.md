# Contributing to the Educado Monorepo

Complete guide for contributing to the Educado project, including Git workflow, branching strategy, and best practices.

> [!TIP]
> **New to the project?** Start with [Getting Started](getting-started.md) to set up your local environment, then check the [Command Reference](turborepo.md#command-reference) for daily development commands.

---

## Table of Contents

1. [Branching Strategy](#branching-strategy)
2. [Git Workflow](#git-workflow)
3. [Pull Request Process](#pull-request-process)
4. [Best Practices](#best-practices)

---

## Branching Strategy

### Branch Overview

```
main (production)
  ↑
  └─ dev (integration)
      ↑
      ├─ feat/web/course-page
      ├─ fix/strapi/cors-issue
      └─ chore/update-dependencies
```

| Branch | Purpose | Protected | Merge Strategy |
|--------|---------|-----------|----------------|
| `main` | Production releases | ✅ | From `dev` only, semver tags |
| `dev` | Integration branch per sprint | ✅ | Squash & merge from feature branches |
| `feat/*` | New features | ❌ | Squash & merge to `dev` |
| `fix/*` | Bug fixes | ❌ | Squash & merge to `dev` |

> [!IMPORTANT]
> **Always create feature branches from `dev`**, not from `main`. The `dev` branch is our integration point for all work.

---

### Branch Naming Conventions

#### Recommended Format

Use descriptive, structured names that reflect the scope and purpose:

| Type | Format | Example |
|------|--------|---------|
| **Feature** | `feat/<area>/<description>` | `feat/web/course-page` |
| **Bug Fix** | `fix/<area>/<description>` | `fix/strapi/cors-issue` |
| **Refactor** | `refactor/<area>/<description>` | `refactor/web/auth-module` |
| **Chore** | `chore/<description>` | `chore/update-dependencies` |
| **Docs** | `docs/<description>` | `docs/turborepo-guide` |

**Examples**:
```bash
feat/web/course-page         # New course page feature
fix/strapi/cors              # Fix CORS configuration
refactor/web/auth-module     # Refactor authentication
chore/update-dependencies    # Dependency updates
docs/ci-pipeline            # CI/CD documentation
```

#### Relaxed Alternative

For simpler cases, a more relaxed naming is acceptable:

```bash
fix/strapi-issue-123        # Fix with issue number
chore/update-strapi         # Simple chore description
feat/web-new-dashboard      # Simple feature description
```

> [!NOTE]
> **Monorepo Consideration**: Since we have multiple projects (web + strapi), include the area in your branch name to make it clear which part of the codebase you're working on.

---

## Git Workflow

### 1. Set Up Your Branch

#### Create a New Branch

```bash
# Ensure dev is up to date
git checkout dev
git pull origin dev

# Create and switch to your feature branch
git checkout -b feat/web/course-page
```

#### First Push (Set Upstream)

```bash
# Make your first commit
git add .
git commit -m "feat: initialize course page component"

# Push and set upstream tracking
git push -u origin feat/web/course-page
```

> [!TIP]
> The `-u` flag sets up tracking so future `git push` and `git pull` commands know which remote branch to use.

---

### 2. Work on Your Changes

#### Make Changes Iteratively

```bash
# Make changes to files
# ...

# Stage specific files
git add path/to/file1.ts path/to/file2.ts

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add course listing component"

# Push to remote
git push
```

#### Check Status and Remotes

```bash
# See what's changed
git status

# See all remotes
git remote -v

# Fetch latest from all remotes (doesn't merge)
git fetch --all
```

---

### 3. Keep Your Branch Updated

#### Rebase on Latest Dev

Before submitting a PR, rebase your branch onto the latest `dev`:

```bash
# 1. Ensure dev is up to date
git checkout dev
git pull origin dev

# 2. Switch to your feature branch
git checkout feat/web/course-page

# 3. Rebase onto dev
git rebase dev
```

**What happens during rebase**:
- Git replays your commits on top of the latest `dev`
- Conflicts may need to be resolved
- Your branch history is rewritten

#### Resolve Rebase Conflicts

If conflicts occur during rebase:

```bash
# 1. Git pauses and shows conflicting files
# Edit the files and resolve conflicts

# 2. Stage the resolved files
git add path/to/resolved-file.ts

# 3. Continue the rebase
git rebase --continue

# If you want to abort and start over
git rebase --abort
```

---

### 4. Force Push (Safely!)

After rebasing, you'll need to force push since history was rewritten:

```bash
# Safe force push
git push --force-with-lease
```

> [!CAUTION]
> **Why `--force-with-lease` instead of `--force`?**
> 
> `--force-with-lease` is safer! It ensures you only force push if your local branch matches the remote's history at the time you fetched. This prevents accidentally overwriting changes someone else pushed.
> 
> **Never use `--force`** unless you absolutely know what you're doing.

---

### 5. Additional Git Operations

#### Pull Changes from Remote

```bash
# Pull from specific branch (fetch + merge)
git pull origin dev

# Pull from current branch's upstream
git pull
```

#### Push Changes to Remote

```bash
# Push to specific branch
git push origin feat/web/course-page

# Push to current branch's upstream
git push
```

#### Clean Up Stale Remote Branches

When remote branches are deleted, your local `git branch -a` might still show them:

```bash
# Fetch and prune in one command
git fetch --prune origin

# Configure Git to prune automatically on pull
git config --global fetch.prune true
```

This removes remote-tracking references that no longer exist on the remote.

---

## Pull Request Process

### 1. Before Creating a PR

**Pre-PR Checklist**:

```bash
# 1. Ensure branch is up to date with dev
git checkout dev
git pull origin dev
git checkout your-branch
git rebase dev
git push --force-with-lease

# 2. Run code quality checks
npm run lint:fix
npm run format:fix
npm run type-check

# 3. Run tests
npm run test

# 4. Build to verify
npm run build
```

> [!TIP]
> See the [Command Reference](turborepo.md#command-reference) for all quality check commands.

---

### 2. Create the Pull Request

1. **Push your branch**: `git push`
2. **Open PR on GitHub/Gitea**
3. **Target branch**: `dev` (not `main`!)
4. **Fill out PR template** (if available)
5. **Request reviewers**

**PR Title Format**:
```
feat(web): add course listing page
fix(strapi): resolve CORS configuration issue
chore: update npm dependencies
docs: add turborepo documentation
```

**PR Description Should Include**:
- What changed and why
- How to test the changes
- Screenshots (if UI changes)
- Related issues/tickets

---

### 3. Respond to Review Feedback

```bash
# Make requested changes
# ...

# Commit changes
git add .
git commit -m "refactor: address PR review comments"

# Push (no need to rebase during review unless requested)
git push
```

---

### 4. Merge Strategy

Once approved, merge using **Squash and Merge**:

- ✅ Combines all commits into one
- ✅ Cleaner history on `dev`
- ✅ Easier to revert if needed
- ✅ Clearer changelog

**Example**:
```
Before: 15 commits "wip", "fix typo", "actually fix typo"
After:  1 commit "feat(web): add course listing page (#123)"
```

---

## Best Practices

### Commit Messages

Use clear, descriptive commit messages following conventional commits:

**Format**: `<type>(<scope>): <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `docs`: Documentation
- `test`: Adding tests
- `style`: Code formatting

**Examples**:
```bash
feat(web): add course search functionality
fix(strapi): resolve database connection timeout
refactor(web): simplify authentication logic
chore: update React to v18.3.1
docs: add Docker optimization guide
```

---

### Code Quality

**Before committing**:

```bash
# Auto-fix linting issues
npm run lint:fix

# Auto-format code
npm run format:fix

# Verify TypeScript types
npm run type-check

# Run tests
npm run test
```

**During development**:
- Follow existing code style and conventions
- Keep changes focused and modular
- Add/update tests for new features
- Update documentation when needed

---

### Monorepo Considerations

Since we're in a monorepo:

- **Scope your changes**: Prefer changing one project (web or strapi) per PR when possible
- **Run focused tests**: Use `npm run test -w web` to test specific workspace
- **Clear branch names**: Include project in name (`feat/web/...` vs `feat/strapi/...`)
- **Lockfile**: Always commit `package-lock.json` changes

---

### Documentation Updates

Documentation changes follow the same process:

1. Create branch: `docs/add-docker-guide`
2. Make changes to markdown files
3. Preview locally if possible
4. Create PR targeting `dev`
5. Squash and merge

> [!TIP]
> Documentation-only changes may skip PR checks automatically. See [CI/CD Pipeline](ci.md#pr-checks) for details.

---

## Quick Reference

### Common Git Commands

```bash
# Create and switch to new branch
git checkout -b feat/web/new-feature

# Check status
git status

# Stage and commit
git add .
git commit -m "feat(web): add new feature"

# Push first time
git push -u origin feat/web/new-feature

# Push subsequent times
git push

# Update branch with latest dev
git checkout dev && git pull origin dev
git checkout feat/web/new-feature
git rebase dev
git push --force-with-lease

# Clean up merged branches locally
git branch -d feat/web/completed-feature

# Remove stale remote references
git fetch --prune origin
```

---

### Workflow Summary

```
1. git checkout dev && git pull origin dev
2. git checkout -b feat/web/new-feature
3. [make changes]
4. git add . && git commit -m "feat(web): description"
5. git push -u origin feat/web/new-feature
6. [create PR on GitHub/Gitea]
7. [respond to feedback]
8. git checkout dev && git pull origin dev
9. git checkout feat/web/new-feature && git rebase dev
10. git push --force-with-lease
11. [squash & merge PR]
```

---

## Troubleshooting

### "Your branch has diverged"

**Problem**: After rebasing, git says your branches have diverged.

**Solution**: This is expected! Use `git push --force-with-lease` after rebasing.

---

### Merge Conflicts During Rebase

**Problem**: Conflicts occur during `git rebase dev`.

**Solution**:
```bash
# 1. Resolve conflicts in your editor
# 2. Stage resolved files
git add path/to/resolved-file.ts
# 3. Continue rebase
git rebase --continue

# Or abort and try again later
git rebase --abort
```

---

### Accidentally Committed to Wrong Branch

**Problem**: Made commits on `dev` instead of a feature branch.

**Solution**:
```bash
# 1. Create feature branch (keeps commits)
git checkout -b feat/web/my-feature

# 2. Reset dev to match remote
git checkout dev
git reset --hard origin/dev

# 3. Continue work on feature branch
git checkout feat/web/my-feature
```

## Next Steps

Now that you understand the contribution workflow:

- 📖 **Learn CI/CD**: [CI/CD Pipeline](ci.md) - See what happens when you push code
- 🚀 **Release process**: [Release Process](release-process.md) - How to create releases

**Back to basics:**
- [Monorepo Overview](index.md) - Documentation roadmap
- [Command Reference](turborepo.md#command-reference) - All npm commands explained

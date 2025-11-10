# Release Process for Educado Monorepo
This document outlines the release process for the Educado monorepo, which contains two main projects: the web frontend (React + Vite) and the backend (Strapi v5 + Postgres).

It sounds fancy, but it is not that bad. This automation could be omitted but it can be easier to do workflows by code rather than by memory.

## Sprint-to-Production Workflow (Recommended)

**Goal**: Deliver increments from `dev` into `main` each sprint (Or when makes sense), then create a release that triggers production builds.

### The Simple Path (PR + Squash Merge)

This is the **recommended approach** for most sprint releases:

1. **Open PR from `dev` → `main`**
   ```bash
   # Ensure dev is up to date
   git checkout dev
   git pull origin dev
   ```
   - Open a PR on GitHub: `dev` → `main`
   - Title: "Release Sprint XX - [date]" or "Release v0.X.0"
   - Review changes, run CI checks

2. **Squash and Merge the PR**
   - Use GitHub's "Squash and merge" button
   - Customize the squash commit message to be meaningful:
     ```
     Release v0.2.0 - Sprint 12
     
     - Feature: New dashboard filters
     - Feature: Certificate generation
     - Fix: Login redirect bug
     - Fix: CORS issue on staging
     ```
   - This creates a single, clean commit on `main` with all sprint changes

3. **Create Release Tag on `main`**
   ```bash
   # Pull the merged main
   git checkout main
   git pull origin main
   
   # Run release script (bumps version, creates tag, pushes)
   npm run release:minor
   # Or for specific project:
   npm run release:web:minor
   npm run release:strapi:minor
   ```

4. **CI Automatically Builds Production Images**
   - Tag push triggers `build-release.yml`
   - Docker images built and pushed to registry
   - GitHub release created with changelog

5. **Keep `dev` in sync** (optional but recommended)
   ```bash
   # After release, sync dev with main to avoid divergence
   git checkout dev
   git merge --no-ff main -m "sync: merge main release back to dev"
   git push origin dev
   ```

### When to Use Cherry-Picking (Selective Releases)

Use cherry-picking **only when**:
- You need a hotfix on `main` without all of `dev`
- Certain PRs in `dev` aren't ready for production
- You're doing an emergency patch release

**Cherry-Pick Workflow:**

1. **Identify the commits/PRs you want**
   ```bash
   # List recent commits on dev
   git log --oneline origin/dev --not origin/main
   
   # Or find PR merge commits
   git log --merges --oneline origin/dev
   ```

2. **Create a release branch from `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b release/cherry-pick-$(date +%Y%m%d)
   ```

3. **Cherry-pick the commits**
   ```bash
   # For regular commits:
   git cherry-pick <commit-sha>
   
   # For PR merge commits (use parent 1):
   git cherry-pick -m 1 <merge-commit-sha>
   
   # Cherry-pick a range:
   git cherry-pick <start-sha>^..<end-sha>
   ```
   
   Resolve conflicts as they appear, then continue:
   ```bash
   git add .
   git cherry-pick --continue
   ```

4. **Open PR and squash merge** (same as simple path)
   ```bash
   git push origin release/cherry-pick-$(date +%Y%m%d)
   ```
   - Open PR: `release/cherry-pick-YYYYMMDD` → `main`
   - Squash merge with descriptive message
   - Run release script on `main`

### Key Principles

✅ **DO:**
- Work on features in `dev` branch
- Test thoroughly in `dev` environment
- Merge `dev` → `main` via PR at end of sprint
- Use squash merge for clean history
- Create release tags on `main` after merge
- Let CI handle Docker builds and releases

❌ **DON'T:**
- Push directly to `main` (use PRs)
- Create release tags on `dev` or feature branches
- Skip testing before merging to `main`
- Cherry-pick unless you have a specific reason

### Quick Reference

| Scenario | Command |
|----------|---------|
| Sprint release (all of dev) | Open PR `dev` → `main`, squash merge, then `npm run release:minor` |
| Web-only release | Squash merge, then `npm run release:web:minor` |
| Strapi-only release | Squash merge, then `npm run release:strapi:minor` |
| Hotfix (selective) | Cherry-pick commits to release branch, PR → `main`, release |
| Patch release (bug fixes) | Same flow, use `npm run release:patch` |

## 🚀 Quick Release Commands

### Bump and Release Web
```bash
npm run release:web:patch   # 0.0.0 → 0.0.1 (bug fixes)
npm run release:web:minor   # 0.0.0 → 0.1.0 (new features)
npm run release:web:major   # 0.0.0 → 1.0.0 (breaking changes)
```

### Bump and Release Strapi
```bash
npm run release:strapi:patch   # 0.1.0 → 0.1.1
npm run release:strapi:minor   # 0.1.0 → 0.2.0
npm run release:strapi:major   # 0.1.0 → 1.0.0
```

### Bump and Release Both (Unified)
```bash
npm run release:patch   # Bumps root version, releases both
npm run release:minor
npm run release:major
```

## 📋 What Happens Step-by-Step

### Example: `npm run release:web:minor`

#### Step 1: Version Bump (`npm version minor --workspace=web`)
1. ✅ Reads current version from `web/package.json`: `0.0.0`
2. ✅ Bumps MINOR version: `0.0.0` → `0.1.0`
3. ✅ Updates `web/package.json` with `"version": "0.1.0"`
4. ✅ Creates git commit: `"0.1.0"` or `"web 0.1.0"`
5. ❌ Does NOT create git tag yet
6. ❌ Does NOT push to remote yet

#### Step 2: Tag Creation (`npm run tag:web`)
1. ✅ Reads new version from `web/package.json`: `0.1.0`
2. ✅ Creates git tag: `web-v0.1.0`
3. ✅ Pushes tags to remote: `git push --tags`

#### Step 3: CI Workflows Triggered (Automatic)

**Build Release Workflow (`build-release.yml`):**
1. ✅ Detects tag pattern: `web-v*`
2. ✅ Builds Docker image for web only
3. ✅ Pushes images with tags:
   - `registry/educado-web:0.1.0` (exact version)
   - `registry/educado-web:0.1` (minor version)
   - `registry/educado-web:0` (major version)
   - `registry/educado-web:latest` (latest release)

**Create Release Workflow (`create-release.yml`):**
1. ✅ Detects tag: `web-v0.1.0`
2. ✅ Generates release notes from git commits
3. ✅ Creates GitHub Release with:
   - Title: "Web v0.1.0"
   - Tag: `web-v0.1.0`
   - Body: Auto-generated changelog + Docker image info
   - Assets: (none by default, can add artifacts)

## 🔍 Understanding npm version

### What `npm version` Does:
- ✅ Bumps version in `package.json`
- ✅ Creates git commit (if in git repo)
- ✅ Can create git tag (with `--git-tag-version` flag, default: true)
- ❌ Does NOT push to remote
- ❌ Does NOT create GitHub releases

### Our Custom Behavior:
We use `npm version` **without** auto-tagging, then create custom tags:
```json
{
  "scripts": {
    "release:web:minor": "npm version minor --workspace=web && npm run tag:web"
  }
}
```

This way we can:
- Control tag format: `web-v1.2.3` instead of `v1.2.3`
- Separate versioning from tagging
- Have project-specific tags in monorepo

## 📦 Docker Image Tagging Strategy

### Development Images (dev branch)
```
registry/educado-web:dev-abc1234    # Specific commit
registry/educado-web:dev-latest     # Latest dev
```

### Release Images (version tags)
```
registry/educado-web:0.1.0          # Exact version (pin in production)
registry/educado-web:0.1            # Minor version (auto-updates patches)
registry/educado-web:0              # Major version (auto-updates minor)
registry/educado-web:latest         # Latest release (bleeding edge)
```

**Recommendation**: Pin to exact versions in production (`0.1.0`)

## 🎯 GitHub Releases

### What Gets Created Automatically:
- ✅ Release title: "Web v0.1.0"
- ✅ Release tag: `web-v0.1.0`
- ✅ Release body with:
  - Project name
  - Docker image URLs
  - Auto-generated changelog from commits
  - Tag reference

### What's NOT Included (can add later):
- ❌ Release assets/artifacts
- ❌ Manually written release notes
- ❌ Migration guides
- ❌ Breaking change warnings

### Customizing Release Notes:
Edit `.github/workflows/create-release.yml` to:
- Parse conventional commits
- Group changes by type (feat/fix/docs)
- Add breaking change warnings
- Include contributor credits

## 🔄 Complete Release Workflow

### Sprint Release Example (Recommended)
```bash
# 1. Open PR from dev → main on GitHub
# 2. Review, approve, squash and merge via UI
# 3. After merge:

git checkout main
git pull origin main

# 4. Bump version and create release
npm run release:minor

# Result:
# - package.json versions bumped ✅
# - Git commit: "0.2.0" or similar ✅
# - Git tag: web-v0.2.0, strapi-v0.2.0 (or unified v0.2.0) ✅
# - Pushed to remote ✅
# - CI builds Docker images ✅
# - GitHub release created ✅

# 5. Sync dev with main
git checkout dev
git merge --no-ff main -m "sync: merge main release back to dev"
git push origin dev
```

### Hotfix Example (Cherry-Pick)
```bash
# 1. Find the commit you need
git log --oneline origin/dev --not origin/main

# 2. Create release branch
git checkout main
git pull origin main
git checkout -b release/hotfix-auth-bug

# 3. Cherry-pick the fix
git cherry-pick abc1234

# 4. Push and open PR
git push origin release/hotfix-auth-bug
# Open PR: release/hotfix-auth-bug → main
# Squash and merge via UI

# 5. Create patch release
git checkout main
git pull origin main
npm run release:patch
```

### Original Examples (For Reference)

#### For Web Feature Release:
```bash
# 1. Make changes, commit them
git add .
git commit -m "feat: add new dashboard widget"

# 2. Bump version and release
npm run release:web:minor

# Result:
# - web/package.json: 0.0.0 → 0.1.0 ✅
# - Git commit: "web 0.1.0" ✅
# - Git tag: web-v0.1.0 ✅
# - Pushed to remote ✅
# - CI builds Docker images ✅
# - GitHub release created ✅
```

#### For Strapi Bug Fix:
```bash
# 1. Fix bug, commit
git add .
git commit -m "fix: resolve CORS issue"

# 2. Bump patch version
npm run release:strapi:patch

# Result:
# - strapi/package.json: 0.1.0 → 0.1.1 ✅
# - Git tag: strapi-v0.1.1 ✅
# - Only Strapi image built ✅
```

#### For Synchronized Release (Both Projects):
```bash
# 1. Update both projects, commit
git add .
git commit -m "feat: major API changes"

# 2. Bump unified version
npm run release:major

# Result:
# - package.json: 1.0.0 → 2.0.0 ✅
# - Git tag: v2.0.0 ✅
# - Both images built ✅
```

## 🛠️ Customization Options

### Add Breaking Change Detection:
```bash
# In create-release.yml, scan commits for BREAKING CHANGE
if git log $LAST_TAG..HEAD | grep -q "BREAKING CHANGE"; then
  echo "⚠️ **BREAKING CHANGES**" >> release_notes.md
fi
```

### Add Changelog Sections:
```bash
# Group commits by type
echo "### Features" >> release_notes.md
git log --grep="^feat:" --pretty=format:"- %s" >> release_notes.md

echo "### Bug Fixes" >> release_notes.md
git log --grep="^fix:" --pretty=format:"- %s" >> release_notes.md
```

### Add Release Assets:
```yaml
- name: Upload artifacts
  uses: softprops/action-gh-release@v1
  with:
    files: |
      dist/*.zip
      build/*.tar.gz
```

## 📊 Version History Tracking

### View All Releases:
```bash
git tag --list "web-v*"          # Web versions
git tag --list "strapi-v*"       # Strapi versions
git tag --list "v*.*.*"          # Unified versions
```

### View Release Info:
```bash
git show web-v0.1.0              # Show tag details
git log web-v0.1.0..web-v0.2.0   # Compare versions
```

### Rollback Version:
```bash
# Revert to previous version
git checkout web-v0.1.0
# Or delete bad tag
git tag -d web-v0.2.0
git push origin :refs/tags/web-v0.2.0
```

## 🚨 Important Notes

1. **Tag Format Matters**: CI uses tag patterns to determine what to build
   - `web-v*` → Only builds web
   - `strapi-v*` → Only builds strapi
   - `v*` → Builds both

2. **Version Commits**: The version bump creates a commit, so working directory must be clean

3. **No Rollback**: Once pushed, tags are permanent (conventionally). Delete carefully.

4. **Changelog Quality**: Better commit messages = better release notes
   - Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
   - Write clear, descriptive messages
   - Reference issues: `fix: resolve login bug (#123)`

5. **Main Branch Protection**: Always use PRs to merge into `main`
   - Squash merge for clean history
   - Ensures CI checks pass before release
   - Provides review opportunity

6. **Sprint Workflow**: Keep it simple
   - Develop and test in `dev`
   - Merge `dev` → `main` via PR at sprint end
   - Create release tag on `main`
   - CI does the rest (builds, Docker push, release creation)

7. **When Main is Behind Dev**: This is normal and expected!
   - `dev` is ahead during active development
   - At sprint end, merge `dev` → `main` via PR
   - After release, optionally sync `main` → `dev` to keep them aligned
   - Never worry about `main` being "behind" – that's the intended workflow

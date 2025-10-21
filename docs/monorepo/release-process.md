# Release Process for Educado Monorepo
This document outlines the release process for the Educado monorepo, which contains two main projects: the web frontend (React + Vite) and the backend (Strapi v5 + Postgres).

It sounds fancy, but it is not that bad. This automation could be omitted but it can be easier to do workflows by code rather than by memory.

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
3. ✅ Creates GitHub/Gitea Release with:
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
- ❌ Does NOT create GitHub/Gitea releases

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

## 🎯 GitHub/Gitea Releases

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

### For Web Feature Release:
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
# - GitHub/Gitea release created ✅
```

### For Strapi Bug Fix:
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

### For Synchronized Release (Both Projects):
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

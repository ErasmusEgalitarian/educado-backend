# Contributing to the Educado Monorepo

This page outlines how you can contribute to the Educado monorepo, including guidelines for code contributions, documentation updates, and best practices to follow.

> [!TIP]
> **New to the project?** Start with [Getting Started](getting-started.md) to set up your local environment, then check the [Command Reference](turborepo.md#command-reference) for daily development commands.

---

## At-a-Glance
- main: production releases
- dev: integration branch per sprint
- feature branches: created from dev
- Releases: at end of sprint, dev → main using semver
- PRs: target dev, squash-and-merge

Branching and naming
- Create branches from dev
  - Feature: feat/<area>/<desc> (e.g., feat/web/course-page)
  - Fix: fix/<area>/<desc> (e.g., fix/strapi/cors)
  - Refactor: refactor/<area>/<desc>
  - Chore: chore/<desc>
  - Docs: docs/<desc>
- Relaxed but OK: fix/strapi-issue-123, chore/update-dependencies, feat/web-new-dashboard

## Code Contributions

1. **Create a Branch**: Create a new branch **based on the `dev` branch** for your feature or bug fix.

Since we are working in a monorepo, please ensure that your branch name reflects the scope of your changes (e.g., `feat/web/course-page`, `fix/strapi/nasty-bug`).

Try and be consistent, but a more relaxed naming such as:

- `fix/strapi-issue-123`
- `chore/update-dependencies`
- `chore/update-strapi`
- `refactor/web-auth-module`
- `feat/web-new-dashboard`
- `docs/short-description`

can also be used.

**Dev branch** is the main integration branch where all features are merged before going to production. Please ensure your branch is up to date with `dev` before submitting a pull request.

1. **Make Changes**: Implement your changes in the new branch.
2. **Write Tests**: Ensure that your changes are covered by tests.
3. **Submit a Pull Request**: Once you're satisfied with your changes, submit a pull request to the main repository.

## Rebasing and Merging

Before merging your changes, it's important to rebase your branch onto the latest `dev` branch to ensure a smooth integration. You can do this by running the following commands:

```bash
git checkout dev
git pull origin dev
git checkout <your-branch>
git rebase origin/dev
```

Resolve any conflicts that may arise during the rebase process. Once your branch is up to date with `dev`, you can proceed to merge it.

You will often have to force push your branch after a rebase. Use the following command to do so safely:

```bash
git push origin your-feature-branch --force-with-lease
```

When your pull request is approved, you can merge it using the "Squash and Merge" option on GitHub. This will combine all your commits into a single commit for a cleaner history.

## Documentation Updates

We welcome updates to the documentation! If you find any inaccuracies or have suggestions for improvement, please follow the same process as code contributions.

## Best Practices

- Write clear and concise commit messages.
- Follow the existing code style and conventions.
- Keep your changes focused and modular.
- Test your changes thoroughly before submitting a pull request.

Thank you for your contributions to the Educado monorepo!'















ADD THESE BELOW

## 4. Remote Operations

*   **List remotes:**
    ```bash
    git remote -v
    ```
*   **Fetch changes from all remotes (without merging):**
    ```bash
    git fetch --all
    ```
*   **Pull changes from a specific remote branch (fetch + merge):**
    ```bash
    git pull origin <branch-name>
    ```
*   **Push local changes to a remote branch:**
    ```bash
    git push origin <branch-name>
    ```
*   **Set upstream for a new branch (first push):**
    ```bash
    git push -u origin <branch-name>
    ```

## 5. Rebasing and Squashing

### Basic Rebase

1.  **Ensure target branch is up-to-date:**
    ```bash
    git checkout main # or dev
    git pull origin main # or dev
    ```
2.  **Switch to your feature branch:**
    ```bash
    git checkout your-feature-branch
    ```
3.  **Rebase your feature branch onto the target:**
    ```bash
    git rebase main # or dev
    ```

## 6. Force Pushing with `--force-with-lease`

When you rebase, you rewrite history. If your branch has already been pushed to a remote, you'll need to force push. Use `--force-with-lease` for safety.

*   **Force push your rebased branch:**
    ```bash
    git push origin your-feature-branch --force-with-lease
    ```
    *   **Why `--force-with-lease`?** It's safer than `git push --force`. It ensures that you only force push if your local branch's history matches the remote's history at the time you fetched. This prevents you from accidentally overwriting changes pushed by someone else in the meantime.

## 7. Pruning Remote-Tracking Branches

When remote branches are deleted, your local `git branch -a` might still show them. Pruning removes these stale references.

*   **Fetch and prune:**
    ```bash
    git fetch --prune origin
    ```
    *   This command fetches new changes from `origin` and removes any remote-tracking branches that no longer exist on the remote.

*   **Configure Git to prune automatically on `pull`:**
    ```bash
    git config --global fetch.prune true
    ```
    *   With this setting, `git pull` will also prune stale remote-tracking branches.

---

## Next Steps

Now that you understand the contribution workflow:

- 📖 **Learn CI/CD**: [CI/CD Pipeline](ci.md) - See what happens when you push code
- 🐳 **Understand Docker**: [Docker & Turborepo](docker-turborepo.md) - How containers are built
- 🚀 **Release process**: [Release Process](release-process.md) - How to create releases

**Back to basics:**
- [Monorepo Overview](index.md) - Documentation roadmap
- [Command Reference](turborepo.md#command-reference) - All npm commands explained

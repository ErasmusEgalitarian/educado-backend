# Educado Monorepo

Welcome to the Educado Monorepo documentation. This is your starting point for understanding the project structure, development workflows, and tooling.

---

## What is This Monorepo?

The Educado project uses a **monorepo** (monolithic repository) strategy where both the backend (Strapi CMS) and web application (React + Vite) live in a single repository.

**Key benefits**:
- 🔄 **Shared tooling** - Common configuration across projects
- 🚀 **Atomic changes** - Update API and frontend in one commit
- 📦 **Unified versioning** - Coordinated releases
- 🎯 **Better DX** - Single `git clone`, one `npm install`
- 🔗 **Resource sharing** - Shared `.env`, OpenAPI specs, type safety

> [!TIP]
> New to monorepos? See [Turborepo documentation](turborepo.md#why-turborepo) for more on how this improves your workflow.

---

## Project Structure

```
educado-backend/
├── .github/workflows/    # CI/CD automation
├── docs/
│   ├── monorepo/        # 👈 You are here
│   ├── web/             # Frontend documentation
│   └── strapi/          # Backend documentation
├── strapi/              # Strapi CMS backend
├── web/                 # React + Vite frontend
├── openapi/             # Shared API specifications
├── docker-compose.yml   # Local development stack
├── turbo.json          # Turborepo configuration
└── package.json        # Root workspace config
```

---

## Documentation Roadmap

Follow this path to get productive quickly:

### 🚀 Getting Started (5-10 minutes)

1. **[Getting Started](getting-started.md)** ⭐ **Start here!**  
   Set up your local environment and run the project in 5 minutes

2. **[Turborepo Command Reference](turborepo.md#command-reference)**  
   Learn the daily commands you'll use (`npm run dev`, `npm run build`, etc.)

3. **[Environment Variables](environment-variables.md)**  
   Configure your local `.env` file properly

---

### 💻 Daily Development

4. **[Turborepo Guide](turborepo.md)**  
   Understand how task orchestration, caching, and parallel execution work

5. **[Managing Dependencies](dependencies.md)**  
   Install, update, and manage npm packages in the monorepo

6. **[Contributions Guide](contributions.md)**  
   Git workflow, branching strategy, and PR process

---

### 🚢 Deployment & Operations

7. **[Docker & Deployment](docker-and-deployment.md)**  
   Containerization, Docker Compose, and production deployment

8. **[CI/CD Pipeline](ci.md)**  
   Automated builds, PR checks, and deployment workflows

9. **[Release Process](release-process.md)**  
   Semantic versioning, tagging, and creating releases

---

## Quick Start Commands

Already set up? Here are the most common commands:

```bash
# Development
npm run dev:fullstack    # Start database + backend + frontend
npm run dev:backend      # Start database + backend only
npm run dev:web          # Start frontend only
npm run stop             # Stop all Docker containers

# Code Quality
npm run lint:fix         # Auto-fix linting issues
npm run format:fix       # Auto-format code
npm run type-check       # Check TypeScript types

# Building
npm run build            # Build both projects
```

> [!TIP]
> See the complete [Command Reference](turborepo.md#command-reference) for all available commands.

---

## Quick Links by Role

### 👨‍💻 For Developers

**First time here?**
- [Getting Started](getting-started.md) - Setup guide
- [Command Reference](turborepo.md#command-reference) - Daily commands
- [Environment Variables](environment-variables.md) - Configuration

**Working on features?**
- [Contributions Guide](contributions.md) - Git workflow
- [Turborepo Guide](turborepo.md) - Task orchestration
- [Managing Dependencies](dependencies.md) - Package management

**Deep dives:**
- [Web Documentation](../web/index.md) - Frontend architecture
- [Strapi Documentation](../strapi/index.md) - Backend architecture

---

### 🔧 For DevOps

**Infrastructure:**
- [CI/CD Pipeline](ci.md) - Automated workflows
- [Deployment](../deployment.md) - Deployment modes

**Operations:**
- [Release Process](release-process.md) - Version & deploy
- [Environment Variables](environment-variables.md) - Configuration reference

---

## Core Technologies

This monorepo is built with:

- **Monorepo Tools**: npm workspaces + Turborepo 2.5.8
- **Backend**: Strapi v5 + PostgreSQL 16 + TypeScript
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **Infrastructure**: Docker + GitHub/Gitea Actions

> [!NOTE]
> For complete technology details, see [Web Docs](../web/index.md) and [Strapi Docs](../strapi/index.md).

---

## Getting Help

| Problem | Solution |
|---------|----------|
| **Setup issues** | [Getting Started Troubleshooting](getting-started.md#troubleshooting) |
| **Command questions** | [Command Reference](turborepo.md#command-reference) |
| **CI/CD failing** | [CI/CD Troubleshooting](ci.md#troubleshooting) |
| **Git workflow** | [Contributions Guide](contributions.md) |

---

## Related Documentation

- [Web Application](../web/index.md) - Complete frontend documentation
- [Strapi Backend](../strapi/index.md) - Complete backend documentation
- [Project README](../../README.md) - Project overview and screenshots
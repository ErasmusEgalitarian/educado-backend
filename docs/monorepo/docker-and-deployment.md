# 🐳 Docker & Deployment

This section explains how Docker is used in the Educado monorepo, primarily for deployment purposes.

---

## Table of Contents

- [What is Docker?](#what-is-docker)
- [Docker Compose](#docker-compose)
- [Development vs Production](#development-vs-production)
- [Docker Commands](#docker-commands)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## What is Docker?

**Docker** packages applications and their dependencies into isolated, portable containers that:

- ✅ **Run consistently** across different environments (dev, staging, production)
- ✅ **Bundle everything** the app needs (runtime, libraries, dependencies)
- ✅ **Isolate processes** from the host system and other containers
- ✅ **Start quickly** (seconds vs minutes for VMs)

**Why use Docker for deployment?**

| Benefit | Description |
|---------|-------------|
| **Consistency** | "Works on my machine" → "Works everywhere" |
| **Portability** | Build once, run on any server with Docker installed |
| **Simplicity** | Single command to deploy the entire stack |

CI/CD pipelines build and push Docker images to a registry, then production servers pull and run these images using Docker Compose.

---

## Docker Compose

**Docker Compose** orchestrates multi-container applications using a single YAML file (`docker-compose.yml`):

```bash
# Without Compose: Manual container management
docker run -d --name db postgres:16
docker run -d --name api --link db myapp-api
docker run -d --name web --link api myapp-web

# With Compose: Single command
docker compose up -d
```

Compose handles:
- 🔧 **Service definitions** (web, strapi, database)
- 🌐 **Networks** between containers
- 💾 **Volumes** for persistent data
- 🔗 **Dependencies** (database starts before API)

---

## Development vs Production

> [!IMPORTANT]  
> **Docker is NOT used during local development**, except for the PostgreSQL database.

### Development Workflow

```bash
# Start only database + Strapi in dev mode
npm run dev:backend

# Start database + both services in dev mode
npm run dev:fullstack
```

**Why no Docker in development?**
- 🔥 Hot reload works better natively
- 🐛 Debugging is easier without container layers
- ⚡ Faster iteration without rebuilds

> [!CAUTION]  
> **Never make changes inside Strapi containers!** Always edit code on your host machine and restart the container if needed.

### Production Deployment

```bash
# Build and start all services (web, strapi, database)
npm run docker:build:up

# Or build images only
npm run docker:build
```

---

## Docker Commands

### Quick Reference

| Command | Description |
|---------|-------------|
| `npm run docker:build:up` | Build and start all services in detached mode |
| `npm run docker:down` | Stop and remove all containers |
| `npm run docker:restart` | Restart all running containers |
| `npm run docker:build` | Build Docker images using Turborepo |
| `npm run docker:build:strapi` | Build only Strapi Docker image |
| `npm run docker:build:web` | Build only Web Docker image |

For complete Turborepo command reference, see [Turborepo Commands](turborepo.md#command-reference).

---

## CI/CD Integration

### Automated Image Building

CI/CD pipelines automatically build and push Docker images to the container registry:

| Workflow | Trigger | Image Tag | Description |
|----------|---------|-----------|-------------|
| `build-dev.yaml` | Push to `dev` branch | `dev` | Development images |
| `build-prod.yaml` | Push to `main` branch | `v<version>`, `latest` | Production images |

### Deployment Workflow

```mermaid
graph LR
    A[Push Code] --> B[CI Pipeline]
    B --> C[Build Images]
    C --> D[Push to Registry]
    D --> E[Server Pulls Images]
    E --> F[Docker Compose Up]
```

1. **Developer** pushes code to `main` or `dev`
2. **CI Pipeline** builds Docker images
3. **Images** are pushed to GitHub Container Registry
4. **Server** pulls latest images
5. **Docker Compose** starts the updated containers

> [!TIP]  
> Any server with Docker can pull and run pre-built images without needing the source code or build tools.

```bash
# Pull and run production images
docker pull ghcr.io/erasmusegalitarian/educado-web:latest
docker pull ghcr.io/erasmusegalitarian/educado-strapi:latest
docker compose up -d
```

For more details, see [CI/CD Documentation](ci.md).

---

## Troubleshooting

### Build Failures

**Problem:** `docker compose up -d --build` fails

**Solution:**
```bash
# Build using Turborepo (recommended)
npm run docker:build

# Then start with pre-built images
docker compose up -d
```

### Port Conflicts

**Problem:** `Error: Port 5174 is already in use`

**Solution:**
```bash
# Find and stop the conflicting process
lsof -i :5174

# Then start Docker
npm run docker:build:up
```

### Database Connection Issues

> [!CAUTION]  
> If Strapi shows authentication errors on startup, ensure you don't have another PostgreSQL instance running locally that conflicts with the Dockerized database.

**Solution:**
```bash
# Check if database is running
docker ps | grep strapiDB

# View database logs
docker compose logs strapiDB

# Verify environment variables
cat .env | grep DATABASE
```

### Container Won't Start

**Problem:** Container exits immediately

**Solution:**
```bash
# Check logs for specific service
npm run docker:logs:web
npm run docker:logs:strapi

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Stale Images

**Problem:** Changes not reflected after rebuild

**Solution:**
```bash
# Clean up and rebuild from scratch
npm run docker:down
docker system prune -a
npm run docker:build:up
```

---

## Next Steps

- 📖 [CI/CD Pipelines](ci.md) - Automated builds and deployments
- 🔐 [Environment Variables](environment-variables.md) - Configure Docker services
- 🚀 [Release Process](release-process.md) - Version management and tagging
- 🏗️ [Turborepo Commands](turborepo.md#command-reference) - Build and development commands

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or review the CI pipeline logs for automated builds.

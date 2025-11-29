# Getting Started

Get the Educado monorepo running locally in **5 minutes**. This guide focuses on getting you up and running quickly-detailed explanations are in the [other documentation sections](#next-steps).

## What You'll Get Running

- 🗄️ **PostgreSQL Database** - Running in Docker
- ⚙️ **Strapi Backend** - Headless CMS on http://localhost:1337
- 🌐 **Web Application** - React + Vite frontend on http://localhost:5174

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 22 LTS** - [Download here](https://nodejs.org/)
- ✅ **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/) (or Docker Engine)
- ✅ **Git** - [Download here](https://git-scm.com/)

Verify installations:
```bash
node --version    # Should show v22.x.x
docker --version  # Should show Docker version
git --version     # Should show git version
```

---

## Quick Start (5 Steps)

### Step 1: Clone and Install

```bash
# Clone the repository (choose HTTPS or SSH)
git clone https://github.com/ErasmusEgalitarian/educado-backend.git educado
# OR with SSH:
# git clone git@github.com:ErasmusEgalitarian/educado-backend.git educado

cd educado
npm install
```

**What this does**: Downloads the code and installs all dependencies for both projects (web + strapi).

---

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Open `.env` in your editor and set these **minimum** required variables:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=           # ← Leave empty for now, we'll fill this in Step 4
VITE_FRONTEND_PORT=5174
```

> **Note**: Don't worry about the other variables yet. See [Environment Variables](environment-variables.md) for complete reference.

---

### Step 3: Start the Backend

```bash
# Start PostgreSQL database and Strapi backend
npm run dev:backend
```

**What this does**: 
- Starts PostgreSQL in Docker (port 5432)
- Starts Strapi development server (port 1337)

**Wait for**: `Server started on: http://0.0.0.0:1337` message

> **Alternative**: If you prefer manual control, see [Manual Startup](#manual-startup-optional) below.

---

### Step 4: Create Strapi Admin & API Token

1. **Open Strapi Admin Panel**: http://localhost:1337/admin

2. **Create your admin account** (first-time only):
   - Fill in your email and password
   - Click "Let's start"

3. **Generate API Token**:
   - Navigate to **Settings** (⚙️ icon in sidebar)
   - Click **API Tokens** under "Global Settings"
   - Click **+ Create new API Token**
   - Name: `Development`
   - Token type: **Full access**
   - Click **Save**
   - **Copy the token** (you won't see it again!)

4. **Add token to `.env`**:
   ```env
   VITE_STRAPI_API_TOKEN=your_copied_token_here
   ```

> **Important**: The web app needs this token to communicate with Strapi. See [Strapi Documentation](../strapi/index.md#authentication) for more details.

---

### Step 5: Start the Web App

Open a **new terminal** (keep Strapi running) and run:

```bash
npm run dev:web
```

**What this does**: Starts the Vite development server with hot module replacement.

**Open**: http://localhost:5174

You should see the Educado web application! 🎉

---

## ⚡ One-Liner (Full Stack)

Once you've completed the initial setup, you can start everything with:

```bash
npm run dev:fullstack
```

This runs both backend and frontend simultaneously.

---

## Verify Everything Works

Check that all services are running:

| Service | URL | Status Check |
|---------|-----|--------------|
| **Strapi Admin** | http://localhost:1337/admin | Should show login/dashboard |
| **Strapi API** | http://localhost:1337/api | Should show available endpoints |
| **Web App** | http://localhost:5174 | Should show application |
| **PostgreSQL** | localhost:5432 | Running in Docker |

---

## Common Commands

### Development

```bash
# Start full stack (database + backend + frontend)
npm run dev:fullstack

# Start backend only (database + Strapi)
npm run dev:backend

# Start web only
npm run dev:web

# Start backend with initial data seeding. This creates some sample data in Strapi.
cd strapi && npm run dev:seed

# Stop all Docker containers
npm run stop
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint:check      # Check for issues
npm run lint:fix        # Auto-fix issues

# Formatting
npm run format:check    # Check formatting
npm run format:fix      # Auto-fix formatting

# Run tests
npm run test
```

### Building

```bash
# Build everything
npm run build

# Build specific project
npm run build:web
npm run build:strapi
```

### API Generation

```bash
# Generate OpenAPI spec and TypeScript client
npm run generate-api
```

> [!TIP]
> These are just the most common commands. See the complete [Command Reference in Turborepo docs](turborepo.md#command-reference) for all available commands, including Docker builds, releases, and advanced usage.

---

## Manual Startup (Optional)

If you prefer more control over what's running:

### Start Database Only

```bash
docker compose up -d strapiDB
```

### Start Strapi Manually

```bash
cd strapi
npm run develop
```

### Start Web Manually

```bash
cd web
npm run dev
```

---

## Troubleshooting

### Port Already in Use

**Symptom**: Error like `EADDRINUSE: address already in use :::1337`

**Solution**: 
```bash
# Find and kill process using the port
lsof -ti:1337 | xargs kill -9   # macOS/Linux
# Or change port in strapi/config/server.ts
```

### Database Connection Failed

**Symptom**: Strapi can't connect to PostgreSQL

**Solution**:
```bash
# Ensure database is running
docker ps | grep postgres

# Restart database
docker compose restart strapiDB

# Check database logs
docker compose logs strapiDB
```

### `npm install` Fails

**Symptom**: Errors during dependency installation

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Token Not Working

**Symptom**: Web app shows authentication errors

**Solution**:
- Verify token is correctly copied in `.env`
- Ensure no extra spaces around the token
- Try regenerating the token in Strapi admin
- Restart the web dev server after updating `.env`

---

## Next Steps

Now that you have everything running:

### For Developers

- 📖 **Learn the stack**: [Web Documentation](../web/index.md) | [Strapi Documentation](../strapi/index.md)
- � **Daily commands**: [Command Reference](turborepo.md#command-reference) - Complete list of npm commands
- �🔧 **Understand the tools**: [Turborepo Guide](turborepo.md) - How task orchestration works
- 🤝 **Start contributing**: [Contribution Guide](contributions.md) - Git workflow and PR process
- 🌍 **Configure environment**: [Environment Variables](environment-variables.md) - Complete configuration reference

### For DevOps

- 🚀 **CI/CD setup**: [CI/CD Pipeline](ci.md)
- 📦 **Deployment**: [Web Deployment](../web/deployment.md)

### Understanding the Monorepo

- 📚 **Overview**: [Monorepo Documentation](index.md)
- 🏗️ **Architecture**: How the projects work together
- 🔄 **Workflows**: Development and release processes

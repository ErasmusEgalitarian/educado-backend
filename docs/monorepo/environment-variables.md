# Environment Variables

Complete reference for environment configuration in the Educado monorepo.

> [!IMPORTANT]
> All environment variables are centralized in the **root `.env` file** and shared across all packages.

---

## Overview

The monorepo uses a **shared environment file** approach:
- 📁 Single `.env` file at project root
- 🔄 All packages load variables from parent directory
- 🎯 No duplicate configuration needed

### File Structure

```plaintext
educado-backend/
├── .env                    # ⭐ Main environment variables file
├── .env.example            # Template for new developers
├── docker-compose.yml
├── package.json
├── web/
│   └── package.json        # Scripts load from ../
├── strapi/
│   └── package.json        # Scripts load from ../
└── ...
```

> [!TIP]
> Copy `.env.example` to `.env` when setting up the project for the first time.

---

## Variable Reference

### 🌐 Strapi Server

Configuration for the Strapi backend server.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOST` | Server bind address | `0.0.0.0` | ✅ |
| `PORT` | Server port | `1337` | ✅ |

**Example**:
```bash
HOST=0.0.0.0
PORT=1337
```

>[!NOTE]
> Strapi itself occupies port 5173 when running the development server.
> Therefore, the web has been bumped to port 5174 to avoid conflicts.

---

### 🔐 Strapi Secrets

Security keys for Strapi authentication and encryption.

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_KEYS` | Application encryption keys (comma-separated) | ✅ |
| `API_TOKEN_SALT` | Salt for API token generation | ✅ |
| `ADMIN_JWT_SECRET` | JWT secret for admin authentication | ✅ |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens | ✅ |
| `ENCRYPTION_KEY` | General encryption key | ✅ |
| `JWT_SECRET` | JWT secret for API authentication | ✅ |

**Example**:
```bash
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=randomSaltString
ADMIN_JWT_SECRET=randomAdminSecret
TRANSFER_TOKEN_SALT=randomTransferSalt
ENCRYPTION_KEY=randomEncryptionKey
JWT_SECRET=randomJWTSecret
```

> [!CAUTION]
> **Never commit real secrets to git!** Use strong, randomly generated values in production.

**Generate Secrets**:
```bash
# Generate random secrets (Linux/Mac)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 🗄️ Postgres Database

Database connection configuration for Strapi.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_CLIENT` | Database type | `postgres` | ✅ |
| `DATABASE_HOST` | Database host | `127.0.0.1` | ✅ |
| `DATABASE_PORT` | Database port | `5432` | ✅ |
| `DATABASE_NAME` | Database name | `strapi` | ✅ |
| `DATABASE_USERNAME` | Database user | `strapi-admin` | ✅ |
| `DATABASE_PASSWORD` | Database password | `educado` | ✅ |
| `DATABASE_SSL` | Enable SSL connection | `false` | ✅ |
| `DATABASE_FILENAME` | SQLite filename (not used with Postgres) | - | ❌ |

**Example (Development)**:
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi-admin
DATABASE_PASSWORD=educado
DATABASE_SSL=false
```

**Example (Production)**:
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=db.production.example.com
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_prod_user
DATABASE_PASSWORD=strongProductionPassword
DATABASE_SSL=true
```

> [!NOTE]
> `DATABASE_FILENAME` is only used for SQLite databases and can be left empty when using Postgres.

---

### 🎨 Web Frontend

Configuration for the React + Vite frontend application.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_STRAPI_API_TOKEN` | Strapi API authentication token | - | ✅ |
| `VITE_STRAPI_URL` | Strapi backend URL | `http://localhost:1337` | ✅ |
| `VITE_FRONTEND_PORT` | Vite dev server port | `5174` | ✅ |

**Example (Development)**:
```bash
VITE_STRAPI_API_TOKEN=your-api-token-here
VITE_STRAPI_URL=http://localhost:1337
VITE_FRONTEND_PORT=5174
```

**Example (Production)**:
```bash
VITE_STRAPI_API_TOKEN=prod-api-token
VITE_STRAPI_URL=https://api.educado.com
VITE_FRONTEND_PORT=5174
```

> [!TIP]
> **Vite Prefix**: All Vite environment variables must start with `VITE_` to be exposed to the frontend code.

**Getting API Token**:
1. Start Strapi: `npm run dev:strapi`
2. Login to admin panel: `http://localhost:1337/admin`
3. Go to **Settings** → **API Tokens** → **Create new API Token**
4. Set permissions and copy token to `VITE_STRAPI_API_TOKEN`

---

## Setup Guide

### First Time Setup

1. **Copy example file**:
   ```bash
   cp .env.example .env
   ```

2. **Generate Strapi secrets**:
   ```bash
   # Generate all 6 secrets
   for i in {1..6}; do openssl rand -base64 32; done
   ```

3. **Update `.env` with generated values**:
   ```bash
   APP_KEYS=<secret1>,<secret2>,<secret3>,<secret4>
   API_TOKEN_SALT=<secret5>
   ADMIN_JWT_SECRET=<secret6>
   # ... etc
   ```

4. **Set database credentials** (use defaults for local dev)

5. **Get Strapi API token** (after first Strapi startup)

6. **Verify configuration**:
   ```bash
   npm run dev
   ```

---

## Environment Loading

### How It Works

Each package's scripts are configured to load environment variables from the parent directory:


---

## Next Steps

Now that your environment is configured:

- 🚀 **Start developing**: [Command Reference](turborepo.md#command-reference) - Daily development commands
- 🤝 **Contribute code**: [Contributions Guide](contributions.md) - Git workflow and PR process
- 📦 **Manage packages**: [Managing Dependencies](dependencies.md) - Install and update dependencies

**Back to basics:**
- [Monorepo Overview](index.md) - Documentation roadmap
- [Getting Started](getting-started.md) - Initial setup guide

---

## Related Documentation

- [Getting Started](getting-started.md) - Initial setup guide
- [Monorepo Overview](index.md) - Project structure

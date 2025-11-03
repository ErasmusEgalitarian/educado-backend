# Educado Backend (Strapi CMS)

The Educado backend is powered by Strapi v5, a flexible headless CMS that manages content models, user permissions, and RESTful APIs for the content creator platform.

## 🎯 Features

- **Headless CMS**: Flexible content modeling with structured types and relations
- **Admin UI**: Robust interface for content management and permissions
- **RESTful APIs**: Auto-generated endpoints for all content types
- **OpenAPI Documentation**: Typed API specification for client generation
- **Media Library**: File upload management with S3 integration
- **Role-Based Access**: Granular permissions for users and API tokens

## 🛠️ Technology Stack

- **Strapi v5** - Headless CMS framework
- **PostgreSQL 16** - Relational database
- **Node.js 22 LTS** - Runtime environment
- **TypeScript** - Type-safe backend code
- **Docker** - Containerized development and deployment

## 📚 Documentation

For detailed technical documentation, content types, plugins, and API guides, see:

**[→ Strapi Technical Documentation](../docs/strapi/index.md)**

## 🚀 Quick Start

```bash
# From repository root
npm install
npm run dev:backend
```

Visit http://localhost:1337/admin to access the Strapi admin panel.

**[→ Complete Setup Guide](../docs/monorepo/getting-started.md)**

## 🗄️ Database

- **Development**: PostgreSQL runs in Docker (`strapiDB` service)
- **Data Persistence**: Uses Docker volume `strapi-data`
- **Media Storage**: Files stored in `strapi-uploads` volume

## 📖 Related Documentation

- [Monorepo Overview](../docs/monorepo/index.md)
- [Getting Started](../docs/monorepo/getting-started.md)
- [Environment Variables](../docs/monorepo/environment-variables.md)
- [Docker Setup](../docs/docker-turborepo-optimization.md)

## 📚 Learn More

- [Strapi Documentation](https://docs.strapi.io) - Official Strapi docs
- [Strapi Tutorials](https://strapi.io/tutorials) - Community tutorials
- [Strapi Blog](https://strapi.io/blog) - Latest updates and best practices

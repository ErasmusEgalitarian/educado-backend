# Educado Content Creator Web Application

The web application is the operational interface for Educado's content creators and administrators. It provides a fast, intuitive UI for composing, managing, and publishing educational content.

![Educado Web Interface](/assets/educado-web-courses-overview.png)

## 🎯 Features

- **Content Management**: Create and organize courses, lectures, and exercises
- **User-Friendly Editor**: Intuitive interface built with modern UI components
- **Real-Time Updates**: Hot module replacement for rapid development
- **Type-Safe API**: Automatically generated client from backend OpenAPI spec
- **Responsive Design**: Works seamlessly across devices

## 🛠️ Technology Stack

- **React 18** + **TypeScript** - Modern UI development
- **Vite** - Lightning-fast build tool and dev server
- **shadcn/ui** - Accessible, customizable component library built on Radix UI
- **TanStack Query** - Powerful data fetching with caching and background updates
- **TanStack Table** - Headless table primitives for rich data grids
- **React Hook Form** - Performant form validation
- **Tailwind CSS** - Utility-first styling

## 📚 Documentation

For detailed technical documentation, architecture, and development guides, see:

**[→ Web Technical Documentation](../docs/web/index.md)**

## 🚀 Quick Start

```bash
# From repository root
npm install
npm run dev:web
```

Visit http://localhost:5174

**[→ Complete Setup Guide](../docs/monorepo/getting-started.md)**

## 🧪 Testing

```bash
# Run Jest tests
npm run test

# Run Cypress tests
npm run cypress_local
```

## 📖 Related Documentation

- [Monorepo Overview](../docs/monorepo/index.md)
- [Getting Started](../docs/monorepo/getting-started.md)
- [Environment Variables](../docs/monorepo/environment-variables.md)
- [Contributing Guide](../docs/monorepo/contributions.md)

# Web Application Technical Documentation

Complete technical documentation for the Educado content creator web application.

## Overview

The web application is built with modern React patterns and provides an intuitive interface for content creators to manage educational materials. It emphasizes speed, type safety, and developer experience.

## Architecture

### Technology Stack

#### Core Framework
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server with HMR

#### UI & Styling
- **shadcn/ui** - Accessible component library built on Radix UI
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library

#### Data Management
- **TanStack Query (React Query)** - Server state management
  - Declarative data fetching
  - Automatic caching and background updates
  - Request deduplication
  - Optimistic updates
- **Zustand** - Client state management

#### Routing & Forms
- **React Router v6** - Client-side routing
- **React Hook Form** - Performant form validation
- **Zod** - Schema validation

#### Tables & Data Display
- **TanStack Table** - Headless table primitives
  - Sorting, filtering, pagination
  - Virtualization support
  - Fully customizable

### Project Structure

```
web/
├── src/
│   ├── App.tsx                 # Root component
│   ├── main.tsx               # Application entry point
│   ├── features/              # Feature-based modules
│   │   ├── auth/             # Authentication
│   │   ├── courses/          # Course management
│   │   ├── lectures/         # Lecture management
│   │   └── exercises/        # Exercise management
│   ├── shared/               # Shared utilities
│   │   ├── api/             # Generated API client
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── types/           # TypeScript types
│   └── unplaced/            # Components pending organization
├── public/                   # Static assets
├── __tests__/               # Jest tests
├── cypress/                 # E2E tests
└── i18n/                    # Internationalization
```

## Key Features

### Type-Safe API Client

The web app uses an automatically generated API client from the backend's OpenAPI specification:

```bash
npm run generate-strapi-client
```

This ensures:
- ✅ Type safety for all API calls
- ✅ Auto-completion in IDE
- ✅ Compile-time error checking
- ✅ Automatic updates when backend changes

### Component Library (shadcn/ui)

Components are copy-paste, fully customizable, and accessible:

```typescript
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

// Fully typed, accessible, themeable
<Button variant="primary">Click me</Button>
```

Benefits:
- Own the code (no npm package bloat)
- Full customization
- Built on Radix UI (accessible by default)
- Tailwind styling

### Data Fetching with TanStack Query

```typescript
import { useQuery } from "@tanstack/react-query"
import { coursesApi } from "@/shared/api"

function Courses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.getCourses()
  })

  // Automatic caching, background refetch, stale-while-revalidate
}
```

### Form Validation

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
})

function CourseForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  })
  
  // Type-safe, validated forms
}
```

## Development

### Running Locally

```bash
# From repository root
npm run dev:web

# Or from web directory
cd web
npm run dev
```

Visits http://localhost:5174

### Environment Variables

Required variables (in root `.env`):

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_token_here
VITE_FRONTEND_PORT=5174
```

All client-side env vars must be prefixed with `VITE_`.

### Building

```bash
# Development build
npm run build

# Production build (with optimizations)
NODE_ENV=production npm run build
```

**Note**: Production builds currently have issues. The app runs in dev mode even in Docker. See [Web Deployment Modes](../web-deployment-modes.md) for details.

## Testing

### Jest (Unit Tests)

```bash
# Run all tests
npm run test

# Update snapshots
npm run updateSnapshots

# Watch mode
npm run test -- --watch
```

### Cypress (E2E Tests)

```bash
# Open Cypress UI
npx cypress open

# Run headless
npm run cypress_local
```

Test files location: `cypress/e2e/`

## Code Quality

### Linting

```bash
# Check for issues
npm run lint:check

# Fix issues automatically
npm run lint:fix

# Compact format (CI-friendly)
npm run lint:compact
```

### Formatting

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format:fix
```

### Type Checking

```bash
npm run type-check
```

## Performance Optimization

### Code Splitting

Vite automatically code-splits by route. Additional splits can be added:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### Asset Optimization

- Images optimized via Vite
- SVGs inlined when small
- Fonts preloaded

### Query Optimization

- Prefetch queries for predictable navigation
- Use `staleTime` to reduce unnecessary refetches
- Implement pagination for large lists

## Deployment

### Docker

Currently uses Vite dev server (see [Web Deployment Modes](../web-deployment-modes.md)):

```bash
# Build image
npm run docker:build:web

# Run container
docker run -p 5174:5174 educado-web:latest
```

### Production (Future)

Once build issues are resolved:

```bash
docker build -f web/Dockerfile.production -t web:prod .
```

This will create a ~50MB nginx image serving static files.

## Troubleshooting

### Common Issues

**API calls failing**
- Check `VITE_STRAPI_API_TOKEN` is set
- Verify backend is running on `VITE_STRAPI_URL`
- Check browser console for CORS errors

**Build fails**
- Clear `.turbo` cache: `rm -rf .turbo`
- Clear node_modules: `npm ci`
- Check for TypeScript errors: `npm run type-check`

**Hot reload not working**
- Restart dev server
- Check Vite config
- Ensure WSL users have proper file watching setup

## Best Practices

### Component Organization

```typescript
// ✅ Good: Collocate related files
features/
  courses/
    components/
      CourseCard.tsx
      CourseForm.tsx
    hooks/
      useCourses.ts
    types/
      course.types.ts
    
// ❌ Bad: Separate by type
components/
  CourseCard.tsx
  UserCard.tsx
hooks/
  useCourses.ts
  useUsers.ts
```

### API Calls

```typescript
// ✅ Good: Use generated client
import { coursesApi } from "@/shared/api"
const courses = await coursesApi.getCourses()

// ❌ Bad: Manual fetch
const res = await fetch('/api/courses')
```

### State Management

```typescript
// ✅ Good: Server state with React Query
const { data } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses
})

// ✅ Good: Client state with Zustand
const theme = useThemeStore(state => state.theme)

// ❌ Bad: Server state in local state
const [courses, setCourses] = useState([])
useEffect(() => {
  fetchCourses().then(setCourses)
}, [])
```

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## Related Documentation

- [Monorepo Overview](../monorepo/index.md)
- [Getting Started](../monorepo/getting-started.md)
- [CI/CD Pipeline](../monorepo/ci.md)
- [Environment Variables](../monorepo/environment-variables.md)

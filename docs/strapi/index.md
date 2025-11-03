# Strapi Backend Technical Documentation

Complete technical documentation for the Educado Strapi CMS backend.

## Overview

The backend is built on Strapi v5 (headless CMS) and provides a flexible content management system with auto-generated APIs, authentication, and media management. It serves the web application and provides content creators with tools to manage courses, lectures, exercises, and student data.

## Architecture

### Technology Stack

#### Core Framework
- **Strapi v5** - Headless CMS framework
- **Node.js 22** - Runtime environment
- **TypeScript** - Type-safe development
- **PostgreSQL 16** - Primary database

#### Key Capabilities
- Auto-generated REST & GraphQL APIs
- Built-in authentication (JWT + API tokens)
- Role-based access control (RBAC)
- Media library with upload processing
- Extensible plugin system
- Content versioning

### Project Structure

```
strapi/
├── src/
│   ├── index.ts              # Entry point
│   ├── api/                  # Content types
│   │   ├── certificate/
│   │   ├── content-creator/
│   │   ├── course/
│   │   ├── course-category/
│   │   ├── course-selection/
│   │   ├── exercise/
│   │   ├── exercise-option/
│   │   ├── feedback/
│   │   ├── lecture/
│   │   └── student/
│   ├── components/           # Reusable content components
│   │   └── content/
│   ├── extensions/           # Core modifications
│   │   └── documentation/
│   └── admin/               # Admin panel customization
├── config/                  # Configuration files
│   ├── admin.ts
│   ├── api.ts
│   ├── database.ts
│   ├── middlewares.ts
│   ├── plugins.ts
│   └── server.ts
├── database/
│   └── migrations/          # Database migrations
├── public/
│   ├── uploads/            # User-uploaded media
│   └── robots.txt
└── types/
    └── generated/          # Auto-generated types
```

## Content Types

### Core Entities

#### Course
- **Fields**: title, description, category, lectures, exercises, difficulty level
- **Relations**: 
  - Has many lectures (one-to-many)
  - Has many exercises (one-to-many)
  - Belongs to category (many-to-one)
  - Has many course selections (students enrolled)
- **Features**: Rich text editor, media attachments, versioning

#### Lecture
- **Fields**: title, content, order, duration, resources
- **Relations**: 
  - Belongs to course (many-to-one)
  - Has media (images, videos, documents)
- **Features**: Content blocks (text, code, quiz), ordering

#### Exercise
- **Fields**: question, type (multiple choice, free text), difficulty, points
- **Relations**:
  - Belongs to course (many-to-one)
  - Has many options (for multiple choice)
- **Features**: Auto-grading support, feedback system

#### Student
- **Fields**: name, email, enrolled courses, progress tracking
- **Relations**:
  - Has many course selections
  - Has many feedback submissions
- **Features**: Progress analytics, certification tracking

#### Content Creator
- **Fields**: name, bio, expertise, courses created
- **Relations**:
  - Has many courses (author)
- **Features**: Profile management, analytics

### Components

Reusable content structures:

- **Content.TextBlock** - Rich text with formatting
- **Content.CodeBlock** - Syntax-highlighted code snippets
- **Content.MediaBlock** - Images, videos, embeds
- **Content.QuizBlock** - Interactive questions

## API Endpoints

### Auto-Generated REST API

All content types automatically expose CRUD endpoints:

```
GET    /api/courses          # List all courses
GET    /api/courses/:id      # Get single course
POST   /api/courses          # Create course
PUT    /api/courses/:id      # Update course
DELETE /api/courses/:id      # Delete course
```

### Authentication

```bash
# Login
POST /api/auth/local
{
  "identifier": "user@example.com",
  "password": "password123"
}

# Returns JWT token for subsequent requests
{
  "jwt": "eyJhbGc...",
  "user": { ... }
}

# Use token in requests
Authorization: Bearer eyJhbGc...
```

### API Tokens

For server-to-server communication:

1. Create token in Admin Panel: Settings → API Tokens
2. Set permissions (read-only, full access, custom)
3. Use in requests:

```bash
Authorization: Bearer <api_token>
```

### GraphQL API

Available at `/graphql`:

```graphql
query {
  courses {
    data {
      id
      attributes {
        title
        description
        lectures {
          data {
            attributes {
              title
            }
          }
        }
      }
    }
  }
}
```

## Configuration

### Database

Configured in `config/database.ts`:

```typescript
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false)
    }
  }
});
```

### Server

Server configuration in `config/server.ts`:

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS')
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false)
  }
});
```

### Environment Variables

Required variables (in root `.env`):

```env
# Server
HOST=0.0.0.0
PORT=1337
STRAPI_URL=http://localhost:1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_password
DATABASE_SSL=false

# Security
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random_salt
ADMIN_JWT_SECRET=random_secret
TRANSFER_TOKEN_SALT=random_salt
JWT_SECRET=random_secret

# Admin
ADMIN_PATH=/admin
ADMIN_EMAIL=admin@educado.com
ADMIN_PASSWORD=secure_password
```

Generate secrets:

```bash
openssl rand -base64 32
```

## Plugins

### Built-in Plugins

- **Upload** - Media library and file uploads
- **Users & Permissions** - Authentication and RBAC
- **Documentation** - OpenAPI spec generation
- **GraphQL** - GraphQL API
- **i18n** - Internationalization (if enabled)

### Custom Plugin Configuration

In `config/plugins.ts`:

```typescript
export default ({ env }) => ({
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Educado API',
        description: 'API documentation for Educado backend'
      }
    }
  },
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024 // 10MB
    }
  }
});
```

## Development

### Running Locally

```bash
# From repository root
npm run dev:strapi

# Or from strapi directory
cd strapi
npm run develop
```

Admin panel: http://localhost:1337/admin

### Database Migrations

Strapi uses automatic schema synchronization in development. For production:

```bash
# Export schema
npm run strapi export

# Import schema
npm run strapi import
```

### Custom API Logic

Add custom controllers, services, or routes:

```typescript
// src/api/course/controllers/course.ts
export default {
  async customEndpoint(ctx) {
    const data = await strapi.service('api::course.course').customMethod();
    ctx.body = data;
  }
};

// src/api/course/routes/custom-routes.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/custom',
      handler: 'course.customEndpoint'
    }
  ]
};
```

### Lifecycle Hooks

Add logic before/after CRUD operations:

```typescript
// src/api/course/content-types/course/lifecycles.ts
export default {
  async beforeCreate(event) {
    // Validate or modify data before creation
    event.params.data.slug = slugify(event.params.data.title);
  },
  
  async afterCreate(event) {
    // Trigger actions after creation
    await strapi.service('api::notification.notification')
      .notifyNewCourse(event.result);
  }
};
```

## Testing

### API Testing

```bash
# Using curl
curl http://localhost:1337/api/courses \
  -H "Authorization: Bearer <token>"

# Using Postman or Insomnia
# Import OpenAPI spec from /documentation
```

### Integration Tests

```bash
# Run tests (if configured)
npm run test
```

## OpenAPI Specification

Strapi automatically generates OpenAPI specs via the Documentation plugin:

**Endpoints**:
- OpenAPI JSON: http://localhost:1337/documentation/json
- OpenAPI YAML: http://localhost:1337/documentation/yaml (if enabled)

**Usage**:

```bash
# Generate web client from spec
cd web
npm run generate-strapi-client
```

This keeps the frontend API client in sync with the backend automatically.

## Performance Optimization

### Database Indexing

```typescript
// In schema.json for content type
{
  "indexes": [
    {
      "name": "course_title_idx",
      "columns": ["title"]
    }
  ]
}
```

### Caching

Configure in `config/middlewares.ts`:

```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::cache',
    config: {
      type: 'mem',
      maxAge: 3600000 // 1 hour
    }
  },
  // ... other middlewares
];
```

### Query Optimization

```typescript
// ❌ Bad: N+1 queries
const courses = await strapi.entityService.findMany('api::course.course');
for (const course of courses) {
  const lectures = await strapi.entityService.findMany('api::lecture.lecture', {
    filters: { course: course.id }
  });
}

// ✅ Good: Single query with population
const courses = await strapi.entityService.findMany('api::course.course', {
  populate: ['lectures']
});
```

## Deployment

### Docker

Production-ready container:

```bash
# Build image
npm run docker:build:strapi

# Run container
docker run -p 1337:1337 \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PASSWORD=secret \
  educado-strapi:latest
```

### Environment Setup

Production checklist:

- ✅ Set `NODE_ENV=production`
- ✅ Use strong secrets (APP_KEYS, JWT_SECRET, etc.)
- ✅ Enable SSL for database connection
- ✅ Configure proper CORS origins
- ✅ Set up automated backups
- ✅ Configure logging

### Database Backups

```bash
# Backup PostgreSQL
pg_dump -h localhost -U strapi strapi > backup.sql

# Restore
psql -h localhost -U strapi strapi < backup.sql
```

## Security

### Best Practices

1. **API Tokens**: Use read-only tokens when possible
2. **Rate Limiting**: Configure in `config/middlewares.ts`
3. **CORS**: Whitelist specific origins
4. **SSL**: Always use HTTPS in production
5. **Secrets**: Never commit secrets to git
6. **Permissions**: Follow principle of least privilege

### Role-Based Access Control

Configure in Admin Panel:

1. Settings → Users & Permissions → Roles
2. Define roles (Public, Authenticated, Admin, etc.)
3. Set permissions per content type and action
4. Assign users to roles

## Troubleshooting

### Common Issues

**Database connection fails**
- Verify PostgreSQL is running
- Check DATABASE_* environment variables
- Test connection: `psql -h localhost -U strapi -d strapi`

**Admin panel won't load**
- Clear `.strapi` cache: `rm -rf .strapi`
- Rebuild admin: `npm run build`
- Check browser console for errors

**API returns 403 Forbidden**
- Check API token is valid
- Verify permissions for content type
- Ensure CORS is configured correctly

**Migrations fail**
- Backup database first
- Check migration files in `database/migrations/`
- Manually run SQL if needed

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
STRAPI_LOG_LEVEL=debug
```

## CLI Commands

### Strapi CLI

```bash
# Create new content type
npm run strapi generate

# Build admin panel
npm run build

# Export/import data
npm run strapi export
npm run strapi import

# Database operations
npm run strapi database:migrate
npm run strapi database:reset

# User management
npm run strapi admin:create-user
npm run strapi admin:reset-password
```

## Best Practices

### Content Modeling

```typescript
// ✅ Good: Clear relationships
{
  "course": {
    "lectures": { "type": "relation", "relation": "oneToMany" },
    "category": { "type": "relation", "relation": "manyToOne" }
  }
}

// ❌ Bad: Storing relations as JSON
{
  "course": {
    "lectureIds": { "type": "json" }
  }
}
```

### API Design

```typescript
// ✅ Good: Use populate for related data
const course = await strapi.entityService.findOne('api::course.course', id, {
  populate: {
    lectures: true,
    category: true,
    author: {
      fields: ['name', 'email']
    }
  }
});

// ❌ Bad: Manual joins
const course = await strapi.entityService.findOne('api::course.course', id);
const lectures = await findLecturesByCourse(course.id);
```

### Error Handling

```typescript
// ✅ Good: Proper error responses
async customAction(ctx) {
  try {
    const data = await someOperation();
    return ctx.send(data);
  } catch (error) {
    return ctx.badRequest('Operation failed', { error: error.message });
  }
}
```

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [GraphQL Playground](http://localhost:1337/graphql)
- [OpenAPI Spec](http://localhost:1337/documentation)

## Related Documentation

- [Monorepo Overview](../monorepo/index.md)
- [Getting Started](../monorepo/getting-started.md)
- [CI/CD Pipeline](../monorepo/ci.md)
- [Environment Variables](../monorepo/environment-variables.md)
- [Database Documentation](../database/) (if exists)

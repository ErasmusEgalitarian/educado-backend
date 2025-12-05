# Multi-stage build optimized with Turborepo
# Stage 1: Prune the monorepo to only include strapi dependencies
FROM node:22-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include strapi and its dependencies
RUN turbo prune strapi --docker

# Stage 2: Install dependencies
FROM node:22-alpine AS installer
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git libc6-compat
WORKDIR /app

# Copy package files from pruned output
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# Install dependencies
RUN npm install -g node-gyp

# Install dependencies, then explicitly install musl-compatible native binaries
# This fixes native module issues on Alpine (@swc/core for TS, @rollup for Vite/admin build)
RUN npm config set fetch-retry-maxtimeout 600000 -g && \
    npm ci && \
    npm install @swc/core-linux-x64-musl @rollup/rollup-linux-x64-musl --no-save || true

# Stage 3: Build the application
FROM node:22-alpine AS builder
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git libc6-compat
WORKDIR /app

# Copy dependencies and source code
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

# Copy openapi spec (needed for build script)
COPY --from=pruner /app/openapi/ ./openapi/

# Ensure the target directory exists and copy the spec file before build
RUN mkdir -p ./strapi/public/openapi && \
    cp ./openapi/strapi-spec.json ./strapi/public/openapi/strapi-spec.json

# Build the application using turbo
RUN npm install -g turbo
RUN turbo run build --filter=strapi

# Stage 4: Production runtime
FROM node:22-alpine AS runner
RUN apk update && apk add --no-cache vips-dev bash
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy node_modules from builder stage (they include workspace deps)
COPY --from=builder --chown=strapi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /app/strapi/node_modules ./strapi/node_modules

# Copy the entire built app (includes dist, config, public, package.json)
COPY --from=builder --chown=strapi:nodejs /app/strapi ./strapi

USER strapi
WORKDIR /app/strapi

EXPOSE 1337

ENV NODE_ENV=production

CMD ["npm", "run", "start"]

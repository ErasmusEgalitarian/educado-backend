# Multi-stage build optimized with Turborepo
# Using Vite dev server since build is currently broken
# TODO: Switch to production build with nginx once build issues are resolved

# Stage 1: Prune the monorepo to only include web dependencies
FROM node:22-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include web and its dependencies
RUN turbo prune web --docker

# Stage 2: Install dependencies and run dev server
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from pruned output
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# Install dependencies with correct platform binaries for Alpine/musl
# Using --ignore-scripts to prevent running postinstall before we fix the platform binaries
RUN npm ci --ignore-scripts

# Explicitly install the correct platform-specific native binaries for Alpine (musl)
RUN cd /app/web && npm install \
    lightningcss-linux-x64-musl \
    @tailwindcss/oxide-linux-x64-musl \
    --save-optional --ignore-scripts

# Copy source code from pruned output
COPY --from=pruner /app/out/full/ .

WORKDIR /app/web

# Expose Vite dev server port
EXPOSE 5174

# Set environment variables for Vite to listen on all interfaces
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5174

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]

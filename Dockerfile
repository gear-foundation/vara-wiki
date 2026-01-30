# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies with clean install
RUN npm ci --only=production --force

# Stage 2: Build application
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy dependency files for build
COPY package.json package-lock.json ./

# Install all dependencies (skip postinstall: fumadocs-mdx needs content which is not copied yet)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Run fumadocs-mdx (postinstall equivalent - requires content to be present)
RUN npx fumadocs-mdx

# Build the application with standalone output
RUN NODE_OPTIONS="--localstorage-file=/tmp/localstorage" npm run build

# Stage 3: Production runtime
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000

# Start the Next.js server
CMD ["node", "server.js"]

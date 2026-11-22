# Stage 1: Build application
FROM node:24.22.3-trixie-slim@sha256:af02d57b57719b9657a45199a79264a9437940cd55b3c7b3fc99615654f124a0 AS builder
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

# Stage 2: Production runtime
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:6abfcb367ebc291572c774c1592a986be2ab26a2486f73093401327495a5962a AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build from builder
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static
COPY --from=builder --chown=65532:65532 /app/public ./public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start the Next.js server
CMD ["server.js"]

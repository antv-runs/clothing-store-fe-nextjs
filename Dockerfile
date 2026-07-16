# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests first for caching
COPY package.json package-lock.json ./

# Install dependencies (production + dev for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Next.js production bundle
RUN npm run build

# Stage 2: Run the built app with a lightweight Node runtime
FROM node:20-alpine AS runner

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["node", "node_modules/next/dist/bin/next", "start"]

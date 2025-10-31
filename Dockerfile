# Dockerfile

# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
# Alpine Linux needs libc6-compat for some Node.js native modules
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
# Install dependencies using npm
RUN npm ci

# 2. Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Make GEMINI_API_KEY available as a build argument
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Run the Next.js build
RUN npm run build

# 3. Production image, copy only necessary artifacts
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1 # Disable telemetry at runtime

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential output from the builder stage
COPY --from=builder /app/public ./public

# Copy standalone output
# Ensure your next.config.mjs has `output: 'standalone'`
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Set the port environment variable (Cloud Run will set this, but good default)
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Command to run the Next.js server (from the standalone output)
CMD ["node", "server.js"]

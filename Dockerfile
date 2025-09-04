# Multi-stage Dockerfile for Next.js 15 + React 19 app with Prisma
# Uses Yarn 1.x and removes Synology/QNAP @eaDir folders before build

# 1) Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2) Build the app
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Defensive: remove NAS-generated @eaDir folders that break Next.js build
RUN find . -type d -name '@eaDir' -prune -exec rm -rf {} + || true

# Generate Prisma Client for Linux (musl)
RUN yarn prisma generate

# Build (uses the script from package.json; currently with --turbopack)
RUN yarn build

# 3) Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy only what is needed to run "next start"
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
# Prisma generated client (custom output in this repo)
COPY --from=builder /app/generated ./generated

EXPOSE 3000
# Bind to 0.0.0.0 for access from NAS network
CMD ["yarn", "start", "-p", "3000", "-H", "0.0.0.0"]


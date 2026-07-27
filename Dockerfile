# Stage 1: Build stage (Debian-based Node 20)
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Copy application source
COPY . .

# Build NestJS application
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# Stage 2: Production runner stage (Debian Bookworm)
FROM node:20-slim AS runner

# Install OpenSSL & CA-certificates for AWS RDS & PostgreSQL SSL compatibility
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

# Copy compiled app, pruned node_modules, and Prisma schema from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose backend port
EXPOSE 3003

# Start NestJS backend application
CMD ["node", "dist/src/main.js"]
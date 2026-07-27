# Stage 1: Build stage (Debian-based Node 20)
FROM node:20-slim AS builder

# Install build dependencies for native node C++ modules (bcrypt) & OpenSSL for Prisma
RUN apt-get update && apt-get install -y python3 make g++ openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies with legacy peer deps fallback
RUN npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Generate Prisma Client & Build NestJS application
RUN npx prisma generate
RUN npm run build

# Stage 2: Production runner stage (Debian Bookworm)
FROM node:20-slim AS runner

# Install OpenSSL & CA-certificates for AWS RDS & PostgreSQL SSL compatibility
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

# Copy compiled app, node_modules, package.json, and Prisma schema from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose backend port
EXPOSE 3003

# Start NestJS backend application
CMD ["node", "dist/main.js"]
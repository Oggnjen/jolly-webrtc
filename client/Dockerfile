# syntax=docker/dockerfile:1.4
# Build stage
FROM node:22.17.1-alpine AS builder


# Install build tools for native deps (Tailwind, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN --mount=type=cache,target=/app/node_modules/.cache \
    npm run build

# Production stage
FROM node:22.17.1-alpine AS production

WORKDIR /app

# Copy built assets and production dependencies
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "preview"]
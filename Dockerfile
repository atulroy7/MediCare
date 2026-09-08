# ==========================================
# Multi-Stage Dockerfile for MediCare Full-Stack
# Builds React/Vite Frontend + Express Backend
# Single Container Deployment (Render, Koyeb, Railway, Fly.io)
# ==========================================

# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Production Backend Server ---
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Install Backend Dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy Backend Source Code
COPY backend/ ./backend/

# Copy Built Frontend from Stage 1 into backend accessible path
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Default Port
EXPOSE 5000

# Set Working Directory to backend
WORKDIR /app/backend

# Start the full-stack server
CMD ["node", "server.js"]

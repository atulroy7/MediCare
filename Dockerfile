# ==========================================
# Multi-Stage Dockerfile for MediCare Full-Stack
# Stage 1 → Builds React/Vite frontend
# Stage 2 → Production Express server that serves it
# Single Container: ONE URL for everything
# ==========================================

# ─── Stage 1: Build React Frontend ────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install deps (use npm install, not npm ci, to handle lock file drift)
COPY frontend/package*.json ./
RUN npm install --prefer-offline

# Copy source and build
COPY frontend/ ./
# No VITE_API_URL needed — in production the frontend uses window.location.origin/api
RUN npm run build


# ─── Stage 2: Production Express Server ──────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Install production backend dependencies
# Use npm install --omit=dev instead of npm ci for lock-file resilience
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev --prefer-offline

# Copy backend source
COPY backend/ ./backend/

# Copy the built React app into the backend's sibling folder
# server.js resolves: path.resolve(__dirname, '../frontend/dist')
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port (Render/Railway/Koyeb will use $PORT env var)
EXPOSE 5000

# Run from backend directory
WORKDIR /app/backend

# Health check so the platform knows when it's ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-5000}/ping || exit 1

CMD ["node", "server.js"]

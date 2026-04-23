# movie-ticket-frontend/Dockerfile
# ── Stage 1: Build ──────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build production bundle
RUN npm run build

# ── Stage 2: Serve với Nginx ─────────────────────────
FROM nginx:alpine

# Copy build output vào nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx để handle React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ── Build Stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Production Stage ───────────────────────────────────────────────────────
FROM node:20-slim

WORKDIR /app

# Create non-root user for security
RUN groupadd -r electioniq && useradd -r -g electioniq electioniq

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set ownership
RUN chown -R electioniq:electioniq /app

USER electioniq

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["node", "src/app.js"]

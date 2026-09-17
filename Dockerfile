# ─── Multi-Stage Dockerfile für SiGeKo-Planer (Next.js 15 + Prisma SQLite) ───

# Stage 1: Basis-Image mit Alpine & C-Bibliotheken für Prisma
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl sqlite
WORKDIR /app

# Stage 2: Abhängigkeiten installieren
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 3: Anwendung kompilieren (Standalone Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Prisma Client für Linux x64/musl generieren
RUN npx prisma generate
RUN mkdir -p public
RUN npm run build

# Stage 4: Schlanker Produktions-Container (< 180MB)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Sicherheitskonformer Non-Root User
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone Server, Static Assets & Prisma kopieren
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=deps /app/node_modules/tsx ./node_modules/tsx

# Entrypoint-Skript für automatische DB-Initialisierung
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Berechtigungen für persistentes SQLite Volume
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Mountpoint für SQLite-Datenbankdatei (dev.db)
VOLUME ["/app/prisma"]

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]

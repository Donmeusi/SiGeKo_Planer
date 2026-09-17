#!/bin/sh
set -e

echo "🚀 [SiGeKo-Planer Docker] Initialisiere Container-Umgebung..."

# Sicherstellen, dass das Prisma-Verzeichnis existiert und beschreibbar ist
mkdir -p /app/prisma

# Stets das neueste Schema aus dem Image in das gemountete Prisma-Verzeichnis kopieren
if [ -f "/app/schema.prisma" ]; then
  cp -f /app/schema.prisma /app/prisma/schema.prisma 2>/dev/null || true
fi

SCHEMA_FILE="/app/schema.prisma"
if [ ! -f "$SCHEMA_FILE" ]; then
  SCHEMA_FILE="/app/prisma/schema.prisma"
fi

# Datenbank-Migration / Schema-Push ausführen
echo "📦 [SiGeKo-Planer Docker] Synchronisiere SQLite-Datenbankschema (Prisma)..."
if [ -f "./node_modules/prisma/build/index.js" ]; then
  node ./node_modules/prisma/build/index.js db push --schema="$SCHEMA_FILE" --skip-generate || true
elif command -v prisma >/dev/null 2>&1; then
  prisma db push --schema="$SCHEMA_FILE" --skip-generate || true
else
  npx prisma db push --schema="$SCHEMA_FILE" --skip-generate 2>/dev/null || true
fi

# Optional: Beispieldaten laden falls gewünscht
if [ "$SEED_DATABASE" = "true" ] || [ "$SEED_DATABASE" = "1" ]; then
  echo "🌱 [SiGeKo-Planer Docker] SEED_DATABASE aktiv: Lade Musterdaten..."
  if [ -f "./node_modules/tsx/dist/cli.mjs" ]; then
    node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts || echo "⚠️ Seed übersprungen oder bereits vorhanden."
  elif command -v tsx >/dev/null 2>&1; then
    tsx prisma/seed.ts || echo "⚠️ Seed übersprungen oder bereits vorhanden."
  else
    npx tsx prisma/seed.ts || echo "⚠️ Seed übersprungen oder bereits vorhanden."
  fi
fi

echo "✅ [SiGeKo-Planer Docker] Bereit! Starte Next.js Server auf Port ${PORT:-3000}..."
exec "$@"

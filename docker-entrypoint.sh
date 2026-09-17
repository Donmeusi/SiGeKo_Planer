#!/bin/sh
set -e

echo "🚀 [SiGeKo-Planer Docker] Initialisiere Container-Umgebung..."

# Sicherstellen, dass das Prisma-Verzeichnis existiert und beschreibbar ist
mkdir -p /app/prisma

# Datenbank-Migration / Schema-Push ausführen
echo "📦 [SiGeKo-Planer Docker] Synchronisiere SQLite-Datenbankschema (Prisma)..."
if [ -f "./node_modules/prisma/build/index.js" ]; then
  node ./node_modules/prisma/build/index.js db push --skip-generate
elif command -v prisma >/dev/null 2>&1; then
  prisma db push --skip-generate
else
  npx prisma db push --skip-generate
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

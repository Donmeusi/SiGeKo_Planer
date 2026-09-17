#!/bin/sh
set -e

echo "🚀 [SiGeKo-Planer Docker] Initialisiere Container-Umgebung..."

# Sicherstellen, dass das Prisma-Verzeichnis existiert und beschreibbar ist
mkdir -p /app/prisma

# Datenbank-Migration / Schema-Push ausführen
echo "📦 [SiGeKo-Planer Docker] Synchronisiere SQLite-Datenbankschema (Prisma)..."
npx prisma db push --skip-generate

# Optional: Beispieldaten laden falls gewünscht
if [ "$SEED_DATABASE" = "true" ] || [ "$SEED_DATABASE" = "1" ]; then
  echo "🌱 [SiGeKo-Planer Docker] SEED_DATABASE aktiv: Lade Musterdaten..."
  npx tsx prisma/seed.ts || echo "⚠️ Seed übersprungen oder bereits vorhanden."
fi

echo "✅ [SiGeKo-Planer Docker] Bereit! Starte Next.js Server auf Port ${PORT:-3000}..."
exec "$@"

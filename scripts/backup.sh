#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux MySQL Veritabanı Yedekleme Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
CLI_JS="$BACKEND_DIR/dist/cli/backupCli.js"

echo "================================================="
echo "📦 Kalem Gümrük MySQL Veritabanı Yedeği Alınıyor..."
echo "🕒 Tarih: $(date)"
echo "================================================="

cd "$BACKEND_DIR"

if [ ! -f "$CLI_JS" ]; then
  echo "⚙️ Backend derleniyor (dist/cli/backupCli.js bulunamadı)..."
  npm run build
fi

node "$CLI_JS" create "Sunucu CLI (scripts/backup.sh) üzerinden alındı"

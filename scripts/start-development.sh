#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux Development (Geliştirme) Başlatma Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "================================================="
echo "🛠️ Kalem Gümrük [DEVELOPMENT] Ortamı Başlatılıyor..."
echo "🕒 Tarih: $(date)"
echo "📡 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo "================================================="

mkdir -p "$ROOT_DIR/logs"
mkdir -p "$ROOT_DIR/backend/data/backups"
mkdir -p "$ROOT_DIR/backend/uploads"

export NODE_ENV=development

# Concurrently ile canlı dev sunucuları başlat
npm run dev

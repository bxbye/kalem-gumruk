#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux Production Başlatma Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "================================================="
echo "🚀 Kalem Gümrük [PRODUCTION] Başlatılıyor..."
echo "🕒 Tarih: $(date)"
echo "📁 Proje Dizini: $ROOT_DIR"
echo "================================================="

# Loglar dizinini oluştur
mkdir -p "$ROOT_DIR/logs"
mkdir -p "$ROOT_DIR/backend/data/backups"
mkdir -p "$ROOT_DIR/backend/uploads"

export NODE_ENV=production

# 1. Bağımlılıkları kontrol et / yükle
echo "📦 Bağımlılıklar kontrol ediliyor..."
npm install

# 2. Backend ve Frontend Derlemesi
echo "🔨 Backend TypeScript derleniyor..."
npm run build:backend

echo "⚡ Frontend Next.js üretim sürümü derleniyor..."
npm run build:frontend

# 3. PM2 Kontrolü ve Başlatma
if command -v pm2 >/dev/null 2>&1; then
  echo "♻️ PM2 ile üretim servisleri başlatılıyor / güncelleniyor..."
  pm2 startOrReload ecosystem.config.cjs --env production
  pm2 save
  echo "-------------------------------------------------"
  pm2 status
  echo "-------------------------------------------------"
  echo "✅ Servisler PM2 ile arka planda başarıyla ayağa kaldırıldı!"
  echo "📜 Backend Logları: pm2 logs kalem-backend"
  echo "📜 Frontend Logları: pm2 logs kalem-frontend"
else
  echo "⚠️ PM2 kurulu değil. Arka plan servis yönetimi için 'npm install -g pm2' önerilir."
  echo "Standart 'npm start' komutu ile başlatılıyor..."
  npm run start
fi

echo "================================================="

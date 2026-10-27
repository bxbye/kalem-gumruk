#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux Sıfır Kesinti Dağıtım (Deploy) Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "================================================="
echo "🚀 Kalem Gümrük Linux Otomatik Dağıtım Başlıyor"
echo "🕒 Tarih: $(date)"
echo "================================================="

# 1. Dağıtım öncesi güvenlik yedeği al
echo "🛡️ 1/5: Mevcut veritabanının güvenlik yedeği alınıyor..."
"$SCRIPT_DIR/backup.sh" || true

# 2. Git güncellemelerini çek (eğer git reposu ise)
if [ -d "$ROOT_DIR/.git" ]; then
  echo "📥 2/5: En son kod güncellemeleri çekiliyor (git pull)..."
  git pull origin main || git pull || echo "Git pull atlandı veya yerel değişiklikler mevcut."
fi

# 3. Paketleri güncelle
echo "📦 3/5: Paketler yükleniyor..."
npm install

# 4. Derleme
echo "🔨 4/5: Backend ve Frontend derleniyor..."
npm run build:backend
npm run build:frontend

# 5. Sıfır kesintiyle yeniden yükle (Zero-downtime Reload)
echo "♻️ 5/5: PM2 servisleri yeniden yükleniyor..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --env production
  pm2 save
  echo "-------------------------------------------------"
  pm2 status
  echo "-------------------------------------------------"
else
  echo "⚠️ PM2 bulunamadı. Servisleri yeniden başlatmak için pm2 önerilir."
fi

echo "================================================="
echo "🎉 Dağıtım Başarıyla Tamamlandı!"
echo "================================================="

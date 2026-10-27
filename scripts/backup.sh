#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux Veritabanı Yedekleme Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
DATA_DIR="$BACKEND_DIR/data"
BACKUP_DIR="$DATA_DIR/backups"
DB_FILE="$DATA_DIR/kalem.sqlite"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/kalem_db_${TIMESTAMP}_manual_cli.sqlite"

echo "================================================="
echo "📦 Kalem Gümrük Veritabanı Yedeği Alınıyor..."
echo "🕒 Tarih: $(date)"
echo "📁 Hedef: $BACKUP_FILE"
echo "================================================="

if [ ! -f "$DB_FILE" ]; then
  echo "❌ Hata: Ana veritabanı dosyası bulunamadı: $DB_FILE"
  exit 1
fi

# SQLite yerleşik online backup komutu (veritabanı çalışırken tutarlı kopyalar)
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"
else
  # sqlite3 yüklü değilse Node.js üzerinden better-sqlite3 API'sini çalıştır
  node -e "
    const Database = require('better-sqlite3');
    const db = new Database('$DB_FILE');
    db.backup('$BACKUP_FILE').then(() => {
      console.log('Node.js better-sqlite3 ile yedek başarıyla oluşturuldu.');
      process.exit(0);
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  "
fi

if [ -f "$BACKUP_FILE" ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Yedekleme Başarılı!"
  echo "📊 Dosya Boyutu: $FILE_SIZE"
  echo "📄 Dosya: $BACKUP_FILE"
else
  echo "❌ Hata: Yedek dosyası oluşturulamadı."
  exit 1
fi

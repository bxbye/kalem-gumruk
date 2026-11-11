#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux MySQL Veritabanı Geri Yükleme Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
BACKUP_DIR="$BACKEND_DIR/data/backups"
CLI_JS="$BACKEND_DIR/dist/cli/backupCli.js"

echo "================================================="
echo "🔄 Kalem Gümrük MySQL Veritabanı Geri Yükleme"
echo "================================================="

if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Hata: Yedekleme dizini bulunamadı: $BACKUP_DIR"
  exit 1
fi

cd "$BACKEND_DIR"

if [ ! -f "$CLI_JS" ]; then
  echo "⚙️ Backend derleniyor (dist/cli/backupCli.js bulunamadı)..."
  npm run build
fi

SELECTED_BACKUP="$1"

if [ -z "$SELECTED_BACKUP" ]; then
  echo "📋 Mevcut Yedekler (.json):"
  echo "-------------------------------------------------"

  BACKUPS=($(ls -t "$BACKUP_DIR"/*.json 2>/dev/null || true))
  if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo "⚠️ Hiçbir yedek dosyası (.json) bulunamadı!"
    exit 1
  fi

  for i in "${!BACKUPS[@]}"; do
    FILE="${BACKUPS[$i]}"
    FNAME=$(basename "$FILE")
    FSIZE=$(du -h "$FILE" | cut -f1)
    FTIME=$(date -r "$FILE" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || stat -c "%y" "$FILE" 2>/dev/null || echo "Bilinmiyor")
    echo "  [$((i+1))] $FNAME ($FSIZE) - $FTIME"
  done

  echo "-------------------------------------------------"
  read -p "Geri yüklemek istediğiniz yedeğin numarasını giriniz [1-${#BACKUPS[@]}]: " CHOICE

  if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt ${#BACKUPS[@]} ]; then
    echo "❌ Geçersiz seçim! İşlem iptal edildi."
    exit 1
  fi

  SELECTED_BACKUP="${BACKUPS[$((CHOICE-1))]}"
fi

FNAME=$(basename "$SELECTED_BACKUP")
echo ""
echo "⚠️ DİKKAT: MySQL veritabanı şu yedekten geri yüklenecektir:"
echo "👉 $FNAME"
echo "Mevcut verilerinizin kaybolmaması için işlem öncesinde otomatik güvenlik yedeği alınacaktır."
echo ""
read -p "Devam etmek istiyor musunuz? (e/h): " CONFIRM
if [[ "$CONFIRM" != "e" && "$CONFIRM" != "E" && "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "İşlem iptal edildi."
  exit 0
fi

node "$CLI_JS" restore "$FNAME"

echo "================================================="
echo "🎉 MySQL Veritabanı Başarıyla Geri Yüklendi!"
echo "================================================="

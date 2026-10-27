#!/usr/bin/env bash
# ==============================================================================
# Kalem Gümrük Müşavirliği - Linux Veritabanı Geri Yükleme Betiği
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
DATA_DIR="$BACKEND_DIR/data"
BACKUP_DIR="$DATA_DIR/backups"
DB_FILE="$DATA_DIR/kalem.sqlite"

echo "================================================="
echo "🔄 Kalem Gümrük Veritabanı Geri Yükleme Sihirbazı"
echo "================================================="

if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Hata: Yedekleme dizini bulunamadı: $BACKUP_DIR"
  exit 1
fi

# Parametre verilmiş mi?
SELECTED_BACKUP="$1"

if [ -z "$SELECTED_BACKUP" ]; then
  echo "📋 Mevcut Yedekler:"
  echo "-------------------------------------------------"
  
  # Yedek dosyalarını listele
  BACKUPS=($(ls -t "$BACKUP_DIR"/*.sqlite 2>/dev/null || true))
  
  if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo "⚠️ Hiçbir yedek dosyası (.sqlite) bulunamadı!"
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

# Dosya var mı?
if [ ! -f "$SELECTED_BACKUP" ] && [ -f "$BACKUP_DIR/$SELECTED_BACKUP" ]; then
  SELECTED_BACKUP="$BACKUP_DIR/$SELECTED_BACKUP"
fi

if [ ! -f "$SELECTED_BACKUP" ]; then
  echo "❌ Hata: Seçilen yedek dosyası bulunamadı: $SELECTED_BACKUP"
  exit 1
fi

FNAME=$(basename "$SELECTED_BACKUP")
echo ""
echo "⚠️ DİKKAT: Veritabanı şu yedekten geri yüklenecektir:"
echo "👉 $FNAME"
echo "Mevcut verilerinizin kaybolmaması için işlem öncesinde otomatik güvenlik yedeği alınacaktır."
echo ""
read -p "Devam etmek istiyor musunuz? (e/h): " CONFIRM
if [[ "$CONFIRM" != "e" && "$CONFIRM" != "E" && "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "İşlem iptal edildi."
  exit 0
fi

# 1. Mevcut halin emniyet yedeğini al
PRE_RESTORE="$BACKUP_DIR/kalem_db_$(date +"%Y-%m-%d_%H-%M-%S")_pre_restore_cli.sqlite"
if [ -f "$DB_FILE" ]; then
  echo "🛡️ Mevcut veritabanının güvenlik yedeği alınıyor: $(basename "$PRE_RESTORE")..."
  cp "$DB_FILE" "$PRE_RESTORE"
fi

# 2. PM2 servisini geçici olarak durdur (çalışıyorsa)
PM2_RUNNING=false
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q "kalem-backend"; then
    echo "⏸️ Backend servisi geçici olarak duraklatılıyor..."
    pm2 stop kalem-backend || true
    PM2_RUNNING=true
  fi
fi

# 3. Dosyaları kopyala
echo "📂 Yedek geri yükleniyor..."
cp -f "$SELECTED_BACKUP" "$DB_FILE"

# WAL ve SHM geçici dosyalarını sil
rm -f "${DB_FILE}-wal" "${DB_FILE}-shm"

# 4. PM2 servisini yeniden başlat
if [ "$PM2_RUNNING" = true ]; then
  echo "▶️ Backend servisi yeniden başlatılıyor..."
  pm2 start kalem-backend
fi

echo "================================================="
echo "🎉 Veritabanı Başarıyla Geri Yüklendi!"
echo "📄 Yüklenen Yedek: $FNAME"
echo "🛡️ Güvenlik Yedeği: $(basename "$PRE_RESTORE")"
echo "================================================="

# Kalem Gümrük Müşavirliği - Web Platformu

Bu proje, yüksek performanslı ve tam bağımsız iki servisten oluşan modern bir monorepo mimarisine sahiptir:

1. **Backend (`/backend`)**: Node.js + Express (TypeScript) + Drizzle ORM + SQLite (WAL Mode)
2. **Frontend (`/frontend`)**: Next.js 16 (App Router + React 19 + Tailwind CSS v4)

---

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkların Kurulumu
Tüm servislerin paketlerini kurmak için kök dizinden sırayla veya alt dizinlerde:

```bash
# Kök bağımlılıklar
npm install

# Backend bağımlılıkları
cd backend && npm install && cd ..

# Frontend bağımlılıkları
cd frontend && npm install && cd ..
```

### 2. Ortam Değişkenleri (.env)
- **Backend:** `backend/.env.example` dosyasını `backend/.env` olarak kopyalayın (Varsayılan port: `5001`, Admin şifresi: `kalem1997`).
- **Frontend:** `frontend/.env.local` dosyası mevcuttur (Varsayılan backend URL: `http://localhost:5001`).

### 3. Geliştirme Modunda Çalıştırma (Dev Mode)

Kök dizinden tek bir komutla hem backend hem frontend eşzamanlı başlar:

```bash
npm run dev
```

* Backend: [http://localhost:5001](http://localhost:5001)
* Frontend: [http://localhost:3000](http://localhost:3000)
* Healthcheck: [http://localhost:5001/health](http://localhost:5001/health)

İstenirse servisler bağımsız da başlatılabilir:

```bash
# Sadece Backend
npm run dev:backend

# Sadece Frontend
npm run dev:frontend
```

---

## 🏗 Mimari Yapı

```
kalem-gumruk/
├── backend/                       # Node.js REST API Servisi (Port: 5001)
│   ├── src/
│   │   ├── db/                    # Drizzle ORM + SQLite (WAL modu)
│   │   ├── routes/                # 14 REST API rotası (Admin, Formlar, İletişim vb.)
│   │   ├── services/              # Nodemailer SMTP, TCMB Döviz Önbelleği, Multer Depolama
│   │   └── server.ts              # Express API Giriş Noktası
│   ├── data/                      # kalem.sqlite (Veritabanı)
│   └── uploads/                   # Yüklenen CV ve evraklar
│
├── frontend/                      # Next.js 16 Web Uygulaması (Port: 3000)
│   ├── app/                       # App Router ([lang] i18n, /admin, vb.)
│   ├── components/                # UI Bileşenleri
│   ├── data/                      # Statik içerikler & çeviriler (tr, en, ar, es)
│   ├── middleware.ts              # Coğrafi konum & dil tespit yönlendirmesi
│   └── next.config.mjs            # Reverse-proxy rewrites (/api/* -> backend:5001)
│
└── package.json                   # Kök orkestrasyon scriptleri
```

---

## 🛡 Veritabanı ve Performans
- **SQLite (WAL Modu):** Ağ gecikmesi 0ms olan yerel SQLite mimarisi ile okuma işlemleri mikrosaniye mertebesinde tamamlanır.
- **TCMB Kur Önbelleği:** Kurlar 15 dakikalık in-memory önbellek ile anında sunulur.
- **Next.js Reverse Proxy:** Frontend `next.config.mjs` içindeki `rewrites` kuralı sayesinde tarayıcıdan gelen `/api/*` istekleri arka planda `http://localhost:5001` backend'ine iletilir.

---

## 🌐 Cloudflare Tunnel ile Canlıya Alma (Production Deployment)

Bu proje, Cloudflare'ın **Ücretsiz (Free)** planında yer alan **Cloudflare Tunnel (Zero Trust)** ile sıfır port açarak ve maksimum güvenlikle çalışacak şekilde optimize edilmiştir.

### 1. Sunucuda Projeyi Derleme ve Başlatma (PM2)
```bash
# Bağımlılıkları kur ve derle
npm install
npm run build

# PM2 ile arka planda çalıştır
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 2. Cloudflare Dashboard'dan Tünel Bağlama
1. **Cloudflare Zero Trust** paneline girin (`Zero Trust > Networks > Tunnels`).
2. **Create a Tunnel** butonuna tıklayın, `cloudflared` seçeneğini seçin.
3. Size verilen tek satırlık kurulum komutunu sunucunuzun terminalinde çalıştırın.
4. **Public Hostnames** sekmesinde alan adınızı ekleyin:
   - **Domain:** `siteniz.com` (veya `www.siteniz.com`)
   - **Type:** `HTTP`
   - **URL:** `localhost:3000`
5. Kaydedin. Siteniz SSL, DDoS koruması, CDN ve çalışan SQLite API ile anında yayına girecektir!

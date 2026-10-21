# Kalem Gümrük Müşavirliği — Yeni Nesil Web Sitesi

1997 yılından bu yana faaliyet gösteren **Kalem Gümrük Müşavirliği Ltd. Şti.** için özel olarak geliştirilmiş, yüksek performanslı, SEO odaklı ve kurumsal kimliğe tam uyumlu yeni web platformu.

---

## 🚀 Öne Çıkan Özellikler

1. **Evrim Web Gümrük Entegrasyonu:**
   * Müşterilerin anlık beyanname, intaç ve dekont takibi yapabilmesi için doğrudan [webgumruk.com](https://webgumruk.com) portalına açılan kurumsal butonlar.
2. **Gümrükçü Masası (Faydalı Araçlar Hub'ı):**
   * Sektör çalışanlarının her gün kullandığı resmi sistemler tek ekranda: **BİLGE, TAREKS, GTİP Arama, TCMB Kurları, E-Birlik, Liman Sorgulama, Alo 136**.
3. **Kopyala-Yapıştır Sirküler / Mevzuat Yönetimi:**
   * Gümrük müşavirinin Resmi Gazete tebliğlerini kopyalayıp 30 saniyede sitede yayına alabileceği şifreli `/admin` paneli.
4. **Şirket E-Postasına Anlık Bildirim (Nodemailer API):**
   * Formlar doğrudan `info@kalemgumruk.com` adresine kurumsal HTML şablonu ve bot korumasıyla iletilir.
5. **Akıllı WhatsApp Yönlendirmesi:**
   * Sağ altta yüzen canlı destek butonu ve hazır mesaj şablonu: *"Merhaba Kalem Gümrük, web siteniz üzerinden ulaşıyorum..."*
6. **Maksimum SEO & Google Otoritesi:**
   * **JSON-LD Schema.org** (`CustomsBrokerage` ve `LocalBusiness`) zengin sonuç etiketleri.
   * Eski WordPress bağlantıları için `next.config.mjs` üzerinde tanımlı **301 kalıcı yönlendirmeleri**.
   * Dinamik `sitemap.xml` ve `robots.txt`.
   * Tüm sayfalar **SSG (Static Site Generation)** ile önceden derlenmiş saf HTML olarak sunulur.

---

## 🛠 Teknoloji Yığını

* **Framework:** Next.js 16 (App Router, SSG/ISR)
* **Stil:** Tailwind CSS v4
* **İkonlar:** Lucide React
* **Tipografi:** Kurumsal ve modern sans-serif
* **E-Posta:** Nodemailer (SMTP)
* **Veri Deposu:** JSON / File-based (Sıfır ek veritabanı maliyeti, taşınabilir)

---

## 💻 Çalıştırma ve Geliştirme

```bash
# Bağımlılıkları yükleme
npm install

# Geliştirme sunucusunu başlatma (http://localhost:3000)
npm run dev

# Canlıya hazırlık (Production Build)
npm run build

# Canlı sunucuyu başlatma
npm run start
```

---

## 🔐 Yönetici Paneli Erişimi

* **Adres:** `http://localhost:3000/admin` (veya `https://kalemgumruk.com/admin`)
* **Varsayılan Şifre:** `kalem1997`
*(Şifreyi değiştirmek için `.env` dosyasında `ADMIN_PASSWORD=yeni_sifreniz` tanımlayabilirsiniz).*

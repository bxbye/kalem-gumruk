export interface SirkulerSeedItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  regulationType?: string | null;
  officialGazetteNumber?: string | null;
  relatedGtip?: string | null;
  summary: string;
  content: string;
  expertNote?: string | null;
  sourceUrl?: string | null;
  pdfUrl?: string | null;
  author: string;
  date: string;
}

export const defaultSirkuler: SirkulerSeedItem[] = [
  {
    "id": "sirkuler-2026-04",
    "slug": "ithalatta-ilave-gumruk-vergisi-degisiklik-2026",
    "title": "İthalatta İlave Gümrük Vergisi Uygulanmasına Dair Kararda Değişiklik",
    "category": "İthalat & Vergi",
    "regulationType": "Cumhurbaşkanı Kararı",
    "officialGazetteNumber": "32696",
    "relatedGtip": "84. ve 85. Fasıllar",
    "summary": "Resmi Gazete'de yayımlanan karar ile bazı sanayi ve tüketim ürünlerinin gümrük vergisi ve ek mali yükümlülük oranları güncellendi.",
    "content": "Resmi Gazete'de yayımlanan 9821 Sayılı Cumhurbaşkanı Kararı ile İthalatta İlave Gümrük Vergisi (İGV) Uygulanmasına İlişkin Kararda önemli değişiklikler yapılmıştır.\n\nKarar kapsamında:\n1. 84. ve 85. fasıllarda yer alan bazı elektronik ve mekanik aksamların ilave gümrük vergisi oranları revize edilmiştir.\n2. Yatırım Teşvik Belgesi (YTB) kapsamında yapılan ithalatlarda muafiyet şartları korunmaya devam edecektir.\n3. AB ve EFTA menşeli ürünlerde ATR ve menşe kurallarına ilişkin kontrol prosedürleri sıkılaştırılmıştır.\n\nDetaylı bilgi ve ürünlerinizin GTİP bazlı vergi etkileri için Kalem Gümrük Müşavirliği operasyon ekibimizle iletişime geçebilirsiniz.",
    "expertNote": "İthalatçı firmalarımızın gümrük vergisi avantajını kaybetmemek adına sevkiyat yola çıkmadan önce ATR dolaşım belgelerinin geçerlilik sürelerini ve fatura beyanlarını operasyon ekibimizle teyit etmeleri önemle tavsiye olunur.",
    "sourceUrl": "https://www.resmigazete.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-10-18"
  },
  {
    "id": "sirkuler-2026-03",
    "slug": "dahilde-isleme-rejimi-sure-uzatimlari-2026",
    "title": "Dahilde İşleme Rejimi (DİR) Süre Uzatımları ve Ek Süre Hakları",
    "category": "Dahilde İşleme",
    "regulationType": "Bakanlık Genelgesi",
    "officialGazetteNumber": "2026/18",
    "relatedGtip": "Tüm İhracat Taahhütlü Hammaddeler",
    "summary": "DİİB sahibi ihracatçılar için mücbir sebep ve haklı nedenlere istinaden verilen ek süre başvuru şartları açıklandı.",
    "content": "Ticaret Bakanlığı İhracat Genel Müdürlüğü tarafından yayımlanan genelge doğrultusunda, Dahilde İşleme İzin Belgesi (DİİB) kapsamındaki ihracat taahhüt hesaplarının kapatılmasında yaşanan küresel hammadde ve lojistik aksaklıkları dikkate alınarak ek süre başvuru süreçleri kolaylaştırılmıştır.\n\nBelge sahibi firmalarımızın süre sonundan en az 15 iş günü önce Bakanlık otomasyon sistemi üzerinden müracaatlarını tamamlamaları gerekmektedir. Kalem Gümrük olarak taahhüt kapatma dosyalarınızı titizlikle hazırlıyoruz.",
    "expertNote": "DİİB taahhüt kapatma sürelerinin aşılması durumunda uygulanan gecikme zammı ve faiz risklerine karşı, belgenizin açık kalan ithalat/ihracat dengesini Evrim portalımızdan anlık takip edebilirsiniz.",
    "sourceUrl": "https://ticaret.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-09-25"
  },
  {
    "id": "sirkuler-2026-02",
    "slug": "tareks-yeni-urun-guvenligi-denetimleri",
    "title": "TAREKS Kapsamında Yeni Ürün Güvenliği Denetimleri",
    "category": "Mevzuat & Denetim",
    "regulationType": "Ürün Güvenliği Tebliği",
    "officialGazetteNumber": "32628",
    "relatedGtip": "CE İşaretli Sanayi Ürünleri",
    "summary": "CE işareti ve standart uygunluk denetimine tabi ürün gruplarında TAREKS risk analiz kriterleri güncellendi.",
    "content": "Dış Ticarette Risk Esaslı Denetim Sistemi (TAREKS) üzerinden yürütülen ithalat denetimlerinde, test raporları ve uygunluk beyanlarının (DoC) akredite kuruluşlardan temin edilme zorunluluğuna ilişkin yeni tebliğ yürürlüğe girmiştir.\n\nGümrük tescil öncesinde TAREKS referans numarası temin edilmeyen ürünlerin gümrükleme işlemleri yapılamayacağından, ithalatçı firmalarımızın sevkiyat yola çıkmadan önce evraklarını müşavirliğimize iletmeleri önemle rica olunur.",
    "expertNote": "TAREKS başvurularında test raporu tarihlerinin ve akreditasyon sertifikalarının güncelliği tescil süresini doğrudan etkilemektedir.",
    "sourceUrl": "https://tareks.ticaret.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-08-10"
  },
  {
    "id": "sirkuler-2026-05",
    "slug": "ncts-faz-5-transit-sistemi-yeni-beyan-kurallari",
    "title": "NCTS Faz-5 Transit Sistemi Ulusal Geçiş ve Yeni Beyan Kuralları",
    "category": "Transit & Lojistik",
    "regulationType": "Gümrükler Genel Müdürlüğü Genelgesi",
    "officialGazetteNumber": "2026/09",
    "relatedGtip": "Tüm Transit Taşımaları",
    "summary": "Ortak Transit Sözleşmesi kapsamındaki NCTS Faz-5 geçişiyle birlikte elektronik transit beyannamelerinde yeni veri setleri zorunlu hale getirildi.",
    "content": "Ortak Transit Sözleşmesi tarafı olan ülkemiz gümrüklerinde NCTS Faz-5 sürümüne entegrasyon tamamlanmıştır. Yeni sistemle birlikte asıl sorumlu ve taşıyıcı bilgilerinin doğrulanması, sınır geçiş bildirimlerinin anlık eşleşmesi ve teminat mektuplarının otomatik bloke/çözüm süreçleri devreye alınmıştır.",
    "expertNote": "Transit beyanlarınızın sınır kapılarında beklememesi için ön bildirimlerin sefer öncesi müşavirliğimize ulaştırılması gerekmektedir.",
    "sourceUrl": "https://gumruk.ticaret.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-07-28"
  },
  {
    "id": "sirkuler-2026-06",
    "slug": "antrepolarda-sayim-ve-dijital-kamera-standartlari",
    "title": "Antrepolarda Sayım ve Dijital Kamera Takip Standartları Genelgesi",
    "category": "Antrepo & Depolama",
    "regulationType": "Bakanlık Tebliği",
    "officialGazetteNumber": "32590",
    "relatedGtip": "A, B ve C Tipi Genel & Özel Antrepolar",
    "summary": "Genel ve özel antrepolarda stok takip sistemlerinin Bakanlık veri tabanına entegrasyonu ve kamera kayıt zorunlulukları yeniden düzenlendi.",
    "content": "Gümrük Genel Tebliği (Antrepolar) Seri No: 1 uyarınca, antrepolarda eşya giriş-çıkış hareketlerinin anlık barkod/RFID entegrasyonuyla Bakanlığa bildirilmesi ve yüksek çözünürlüklü kamera kayıtlarının en az 1 yıl süreyle saklanması esası getirilmiştir.",
    "expertNote": "Antrepo kullanıcılarımızın yıllık fiziki sayım tutanakları ile Evrim sistemindeki beyanname eşleştirmeleri uzman ekibimizce periyodik denetlenmektedir.",
    "sourceUrl": "https://www.resmigazete.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-07-04"
  },
  {
    "id": "sirkuler-2026-07",
    "slug": "gumruk-kiymetinde-royalty-ve-lisans-ucretleri",
    "title": "Gümrük Kıymetinde Royalty ve Lisans Ücretlerinin Beyanı",
    "category": "Gümrük Kıymeti",
    "regulationType": "Müsteşarlık Kararı",
    "officialGazetteNumber": "32572",
    "relatedGtip": "Markalı ve Patentli İthal Eşyalar",
    "summary": "İthal eşyanın satış koşulu olarak ödenen royalty, marka ve lisans bedellerinin gümrük kıymetine dahil edilme kriterleri açıklandı.",
    "content": "4458 sayılı Gümrük Kanunu'nun 27. maddesi uyarınca, ithal edilen eşyaya ilişkin olarak alıcının doğrudan veya dolaylı olarak ödemek zorunda olduğu royalty ve lisans ücretlerinin kıymete ilavesi hususunda teftiş raporları doğrultusunda denetimler artırılmıştır.",
    "expertNote": "Sonradan kontrol ve ceza risklerini önlemek adına marka sahipleriyle yapılan sözleşmelerin ithalat öncesinde gümrük müşavirlerimizce incelenmesi kritiktir.",
    "sourceUrl": "https://ticaret.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-06-15"
  },
  {
    "id": "sirkuler-2026-08",
    "slug": "serbest-bolgelerde-uretim-ve-kazanc-istisnasi",
    "title": "Serbest Bölgelerde Üretim ve Dış Ticaret Kazanç İstisnası Rehberi",
    "category": "Serbest Bölgeler",
    "regulationType": "Maliye & Ticaret Ortak Tebliği",
    "officialGazetteNumber": "32545",
    "relatedGtip": "Serbest Bölge Kullanıcıları",
    "summary": "Serbest bölgelerde imalatçı firmaların yurt dışına yaptıkları satışlardan elde ettikleri gelirlerde kurumlar vergisi muafiyeti şartları güncellendi.",
    "content": "Serbest Bölge Kanunu çerçevesinde üretim ruhsatı bulunan mükelleflerin ürettikleri ürünlerin ihracatından doğan kazançlarının %100 oranında vergiden müstesna tutulmasına ilişkin başvuru ve gümrük onay süreçleri dijitalleştirilmiştir.",
    "expertNote": "Serbest bölgeden dahilde serbest dolaşıma giriş beyannamelerinde özel tüketim vergisi ve KDV mahsup işlemlerinde müşavirliğimiz tam yetkilidir.",
    "sourceUrl": "https://www.resmigazete.gov.tr",
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-05-20"
  },
  {
    "id": "sirkuler-1792801370856",
    "slug": "test-sirku-0856",
    "title": "Test Sirkü",
    "category": "Tarife & GTİP",
    "regulationType": "Cumhurbaşkanı Kararı",
    "officialGazetteNumber": null,
    "relatedGtip": "dwadaw",
    "summary": "awdawd",
    "content": "awddw",
    "expertNote": "awdaw",
    "sourceUrl": null,
    "pdfUrl": null,
    "author": "Kalem Gümrük Mevzuat Kurulu",
    "date": "2026-10-24"
  }
];

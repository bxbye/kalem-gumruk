export interface GerekliBaglanti {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  url: string;
  image: string;
  description: string;
  tag: string;
}

export const gerekliBaglantilarData: GerekliBaglanti[] = [
  {
    id: "ups",
    title: "UPS Kargo Takip Portalı",
    shortTitle: "UPS Kargo",
    category: "Kargo & Hava/Deniz",
    url: "https://www.ups.com.tr/",
    image: "/images/baglantilar/ups.jpg",
    description: "Hızlı kurye ve uluslararası express kargo gönderilerinizin anlık takibi.",
    tag: "Express Kargo",
  },
  {
    id: "fedex",
    title: "FedEx Tracking Servisi",
    shortTitle: "FedEx",
    category: "Kargo & Hava/Deniz",
    url: "https://www.fedex.com/tr-tr/tracking.html",
    image: "/images/baglantilar/fedex.jpg",
    description: "FedEx uluslararası hava kargo konşimento ve teslimat takibi.",
    tag: "Express Kargo",
  },
  {
    id: "dhl",
    title: "DHL Gümrük MH Sistemi",
    shortTitle: "DHL Gümrük MH",
    category: "Kargo & Hava/Deniz",
    url: "https://gumruk.dhl.com.tr/",
    image: "/images/baglantilar/dhl.png",
    description: "DHL Express gümrük müşavirlik takip ve ordino onay portalı.",
    tag: "Gümrük & Hava",
  },
  {
    id: "tnt",
    title: "TNT GYS Takip Sistemi",
    shortTitle: "TNT GYS",
    category: "Kargo & Hava/Deniz",
    url: "https://denizergumruk.com.tr/",
    image: "/images/baglantilar/tnt.png",
    description: "TNT hava kargo gönderileri gümrükleme yönetim sistemi.",
    tag: "Express Kargo",
  },
  {
    id: "turkish-cargo",
    title: "Turkish Cargo Konşimento Takibi",
    shortTitle: "Turkish Cargo",
    category: "Kargo & Hava/Deniz",
    url: "https://www.turkishcargo.com.tr/tr/online-islemler/kargo-takibi",
    image: "/images/baglantilar/turkish-cargo.png",
    description: "Türk Hava Yolları Kargo AWB numarasıyla anlık rezervasyon ve varış kontrolü.",
    tag: "Hava Kargo",
  },
  {
    id: "dpworld",
    title: "DP World Yarımca Liman Portalı",
    shortTitle: "DP World Yarımca",
    category: "Liman & Konteyner",
    url: "https://portal.dpworld.com.tr/",
    image: "/images/baglantilar/dpworld.png",
    description: "Konteyner sahası ardiye, tartım (VGM) ve kapı giriş/çıkış operasyonları.",
    tag: "Konteyner Limanı",
  },
  {
    id: "evyapport",
    title: "Evyap Port Konteyner Takip",
    shortTitle: "Evyap Port",
    category: "Liman & Konteyner",
    url: "https://evyapport.com/",
    image: "/images/baglantilar/evyapport.png",
    description: "Kocaeli Evyap Port konteyner durumu, gümrük muayene ve kapı randevu sistemi.",
    tag: "Konteyner Limanı",
  },
  {
    id: "gtb-laboratuvar",
    title: "GTB Laboratuvar (LARA) Tahlil Sorgulama",
    shortTitle: "GTB Laboratuvar",
    category: "Resmi Sistemler",
    url: "https://uygulama.gtb.gov.tr/LaraTahlilSorgulama/Ekranlar/Index.aspx",
    image: "/images/baglantilar/gtb-laboratuvar.png",
    description: "Gümrük ve Dış Ticaret Bölge Müdürlüğü tahlil ve kimyagerlik rapor sorgulama.",
    tag: "Bakanlık Sistemi",
  },
  {
    id: "beyanname-sorgulama",
    title: "GTB Beyanname Durum Sorgulama",
    shortTitle: "Beyanname Sorgulama",
    category: "Resmi Sistemler",
    url: "https://uygulama.gtb.gov.tr/BeyannameSorgulama/",
    image: "/images/baglantilar/beyanname-sorgulama.png",
    description: "Tescil edilmiş gümrük beyannamelerinin sarı/kırmızı hat ve intaç kontrolü.",
    tag: "Bakanlık Sistemi",
  },
  {
    id: "e-arsiv",
    title: "GİB E-Arşiv Fatura Portalı",
    shortTitle: "GİB E-Arşiv",
    category: "Maliye & E-Belge",
    url: "https://earsivportal.efatura.gov.tr/intragiris.html",
    image: "/images/baglantilar/e-arsiv.png",
    description: "Gelir İdaresi Başkanlığı interaktif e-arşiv fatura düzenleme ve onay portalı.",
    tag: "GİB Portal",
  },
  {
    id: "e-fatura",
    title: "GTB E-Fatura Sistemi",
    shortTitle: "GTB E-Fatura",
    category: "Maliye & E-Belge",
    url: "https://efatura.gtb.gov.tr/",
    image: "/images/baglantilar/e-fatura.png",
    description: "Gümrük ihracat ve ithalat işlemlerine tabi kayıtlı e-fatura teyit sistemi.",
    tag: "Gümrük E-Fatura",
  },
];

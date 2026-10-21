export interface CustomTool {
  id: string;
  title: string;
  category: "Gümrük & Bakanlık" | "Kurlar & Finans" | "Birlikler & Denetim" | "Liman & Lojistik";
  description: string;
  url: string;
  badge?: string;
  iconName: string;
}

export const customsTools: CustomTool[] = [
  {
    id: "evrim-portal",
    title: "Evrim Web Gümrük",
    category: "Gümrük & Bakanlık",
    description: "Kalem Gümrük müşterileri için anlık beyanname, intaç, ardiye ve dekont takibi.",
    url: "https://webgumruk.com",
    badge: "Müşteri Portalı",
    iconName: "LayoutDashboard",
  },
  {
    id: "bilge-sistemi",
    title: "BİLGE Sistemi (E-Gümrük)",
    category: "Gümrük & Bakanlık",
    description: "Ticaret Bakanlığı Bilgisayarlı Gümrük Etkinlikleri e-İşlemler kapısı.",
    url: "https://uygulama.gtb.gov.tr/Bilge",
    badge: "Resmi Sistem",
    iconName: "ShieldCheck",
  },
  {
    id: "tareks",
    title: "TAREKS Sistemi",
    category: "Birlikler & Denetim",
    description: "Dış Ticarette Risk Esaslı Denetim Sistemi ve ürün güvenliği izinleri.",
    url: "https://tareks.ticaret.gov.tr",
    badge: "Bakanlık",
    iconName: "FileCheck2",
  },
  {
    id: "gtip-sorgulama",
    title: "GTİP & Tarife Cetveli Arama",
    category: "Gümrük & Bakanlık",
    description: "Gümrük Tarife İstatistik Pozisyonu (GTİP) tespiti ve güncel vergi oranları.",
    url: "https://uygulama.gtb.gov.tr/Tara",
    badge: "Tarife Rehberi",
    iconName: "Search",
  },
  {
    id: "tcmb-kurlar",
    title: "TCMB Gümrük Kurları",
    category: "Kurlar & Finans",
    description: "Gümrük beyannamelerinde geçerli Merkez Bankası resmi gösterge kurları.",
    url: "https://www.tcmb.gov.tr/kurlar/kurlar_tr.html",
    badge: "Canlı Veri",
    iconName: "Coins",
  },
  {
    id: "e-birlik",
    title: "E-Birlik (TİM / İMMİB / İİB)",
    category: "Birlikler & Denetim",
    description: "İhracatçı birlikleri tescil, nispi aidat ve onay işlemleri portali.",
    url: "https://ebirlik.tim.org.tr",
    badge: "İhracat",
    iconName: "Globe",
  },
  {
    id: "liman-kumport",
    title: "Kumport Liman Takip",
    category: "Liman & Lojistik",
    description: "Ambarlı Kumport konteyner ardiye, tartım (VGM) ve kapı çıkış sorgulama.",
    url: "https://online.kumport.com.tr",
    badge: "Liman",
    iconName: "Ship",
  },
  {
    id: "liman-marport",
    title: "Marport Liman Takip",
    category: "Liman & Lojistik",
    description: "Marport konteyner durumu, ordino ve gümrük blokaj kontrolü.",
    url: "https://www.marport.com.tr",
    badge: "Liman",
    iconName: "Anchor",
  },
  {
    id: "alo-136",
    title: "Alo 136 Gümrük Muhafaza",
    category: "Gümrük & Bakanlık",
    description: "Ticaret Bakanlığı resmi gümrük ihbar, mevzuat ve bilgi hattı.",
    url: "https://ticaret.gov.tr",
    badge: "Resmi Hat",
    iconName: "PhoneCall",
  },
];

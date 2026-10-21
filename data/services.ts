export interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  iconName: string;
  features: string[];
  detailedContent: string;
}

export const servicesData: ServiceItem[] = [
  {
    slug: "ithalat",
    title: "İthalat Gümrükleme İşlemleri",
    shortDesc:
      "Eşyanın Türkiye Gümrük Bölgesine girişinden tescil, vergi hesabı ve adresinize teslimine kadar eksiksiz operasyon.",
    iconName: "ArrowDownToLine",
    features: [
      "Eşyaya ait doğru GTİP (Tarife Pozisyonu) tespiti ve maliyet fizibilitesi",
      "Ordino, konşimento ve nakliye evraklarının takibi",
      "İthalat izinleri, TAREKS, TSE ve Bakanlık uygunluk belgelerinin temini",
      "Gümrük vergisi, KDV, ÖTV, İGV ve fon hesaplamaları",
      "Kırmızı/Sarı hat muayene ve tescil işlemlerinin sahada takibi",
      "Gümrükten çekilen eşyaların firmanıza sevkiyat organizasyonu",
    ],
    detailedContent:
      "İthalat rejimi, dış ticaretin en hassas ve maliyetli aşamalarından biridir. Kalem Gümrük Müşavirliği olarak 1997 yılından gelen saha tecrübemiz ve dijital takip altyapımızla, eşyanız limana veya sınıra gelmeden önce ön inceleme başlatır, olası gecikme ve ardiye masraflarını sıfıra indiririz.",
  },
  {
    slug: "ihracat",
    title: "İhracat Gümrükleme İşlemleri",
    shortDesc:
      "Dünya pazarlarına açılan ürünleriniz için hızlı tescil, dolaşım belgeleri ve güvenli çıkış desteği.",
    iconName: "ArrowUpFromLine",
    features: [
      "İhracat beyannamesinin hızla tescil edilmesi ve kapatılması",
      "A.TR, EUR.1, Menşe Şahadetnamesi (Certificate of Origin) düzenlenmesi",
      "İlgili İhracatçı Birlikleri (İMMİB, İİB vb.) onay ve üyelik işlemleri",
      "Konsolosluk ve elçilik tasdik süreçlerinin yürütülmesi",
      "Gümrük çıkış beyannamesi (GCB) ve intaç tarihi takibi (KDV iadesi için)",
    ],
    detailedContent:
      "İhracat operasyonlarında hız ve evrak doğruluğu esastır. İhracatçı müşterilerimizin vergi iadelerini zamanında alabilmeleri için beyanname kapanışlarını anlık takip eder, Evrim Web Gümrük portalımız üzerinden anında dijital arşiv olarak sunarız.",
  },
  {
    slug: "dahilde-haricte-isleme",
    title: "Dahilde & Hariçte İşleme Rejimi (DİR)",
    shortDesc:
      "İhracat taahhütlü hammadde alımlarında gümrük vergisi ve KDV muafiyeti sağlayan DİR yönetimi.",
    iconName: "Repeat",
    features: [
      "Dahilde İşleme İzin Belgesi (DİİB) müracaat ve revize işlemleri",
      "DİİB kapsamındaki ithalat ve ihracat beyannamelerinin kapatılması",
      "Teminat çözümü ve taahhüt kapatma dosyasının hazırlanması",
      "Hariçte işleme kapsamında tamir ve işçilik operasyonları",
    ],
    detailedContent:
      "Dahilde İşleme Rejimi, üretici ve ihracatçılar için büyük vergi avantajları sağlar. Ancak taahhütlerin takibi uzmanlık gerektirir. Kalem Gümrük, süre aşımları ve vergi cezaları riskini ortadan kaldıran titiz bir DİR takip sistemi sunar.",
  },
  {
    slug: "antrepo-transit",
    title: "Antrepo & Transit Ticaret",
    shortDesc:
      "Gümrüklü antrepo depolama, millileştirme ve üçüncü ülkelere transit eşya taşımacılığı.",
    iconName: "Warehouse",
    features: [
      "Genel ve özel antrepo rejim beyannamelerinin açılması",
      "Kısmi çekim ve gümrükleme işlemleri",
      "Serbest dolaşımda olmayan eşyanın transit sevkiyatı (NCTS / T1 / T2)",
      "Transit ticaret danışmanlığı ve kambiyo mevzuatı uyumu",
    ],
    detailedContent:
      "Eşyanızın vergilerini ödemeden güvenle depolanması veya üçüncü ülkelere sevk edilmesi süreçlerinde antrepo ve transit rejiminin tüm mevzuat gerekliliklerini profesyonelce yerine getiriyoruz.",
  },
  {
    slug: "serbest-bolge",
    title: "Serbest Bölge İşlemleri",
    shortDesc:
      "Türkiye'deki serbest bölgelerde faaliyet gösteren firmalar için özel gümrük çözümleri.",
    iconName: "Building2",
    features: [
      "Serbest Bölge İşlem Formu (SBİF) tanzimi ve onayı",
      "Serbest bölgeden Türkiye'ye ithalat veya yurtdışına ihracat",
      "Bölge içi mal devir ve envanter kontrolleri",
    ],
    detailedContent:
      "AHL Serbest Bölgesi, İstanbul İhtisas Serbest Bölgesi ve Kocaeli Serbest Bölgesi başta olmak üzere tüm serbest bölge gümrüklerinde aktif operasyon yürütüyoruz.",
  },
  {
    slug: "danismanlik",
    title: "Gümrük & Dış Ticaret Danışmanlığı",
    shortDesc:
      "YYS, sonradan kontrol, yatırım teşvik ve gümrük ihtilaflarında stratejik müşavirlik.",
    iconName: "Briefcase",
    features: [
      "Yetkilendirilmiş Yükümlü Statüsü (YYS) ve OKSB hazırlık danışmanlığı",
      "Sonradan Kontrol denetimlerine yönelik şirket içi ön denetimler",
      "Yatırım Teşvik Belgesi (YTB) alımı ve makine-teçhizat ithalatı",
      "Gümrük uzlaşma, ceza itirazları ve hukuki danışmanlık",
    ],
    detailedContent:
      "Gümrük mevzuatı sürekli değişen ve hata kabul etmeyen dinamik bir alandır. Alanında uzman A Karne sahibi gümrük müşavirlerimiz, firmanızın cezai yaptırımlarla karşılaşmasını önler ve maksimum teşvikten yararlanmanızı sağlar.",
  },
];

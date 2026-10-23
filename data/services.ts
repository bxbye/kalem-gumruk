export interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  iconName: string;
  category: "gumruk" | "rejim" | "danismanlik";
  features: string[];
  detailedContent: string;
}

export const servicesData: ServiceItem[] = [
  {
    slug: "ithalat",
    title: "İthalat Gümrükleme İşlemleri",
    shortDesc:
      "Eşyanın Türkiye Gümrük Bölgesine girişinden tescil, GTİP tespiti, vergi tahakkuku ve adresinize teslimine kadar eksiksiz operasyon.",
    iconName: "ArrowDownToLine",
    category: "gumruk",
    features: [
      "İthal edilecek eşya ile ilgili fizibilite çalışmasının yapılması",
      "Eşya ile ilgili GTİP (Gümrük Tarife İstatistik Pozisyonu) tespiti ve maliyet fizibilitesi",
      "Nakliye firmasından eşyanın ve evrak bilgilerinin takibi ve ordinonun alınması",
      "İlgili kurum ve kuruluşlardan eşyanın ithalat mevzuatı gereği izin belgelerinin (TSE, TAREKS, Bakanlıklar) alınması",
      "Gümrük vergi, teminat, resim ve harçların doğru olarak hesaplanması",
      "Gümrük kabul ve tescil işlemlerine başlayarak eşyanın muayenesinin sahada yapılması",
      "Tahakkukların yapılarak ilgili teminat veya vergi ödemelerinin yapılması",
      "Verilen talimata göre bildirilen adrese eşya teslimi için nakliye organizasyonunun yapılması",
    ],
    detailedContent:
      "İthalat rejimi, dış ticaretin en hassas ve maliyetli aşamalarından biridir. Kalem Gümrük Müşavirliği olarak 1997 yılından gelen saha tecrübemiz ve dijital takip altyapımızla, eşyanız limana veya sınıra gelmeden önce ön inceleme başlatır, olası gecikme ve ardiye masraflarını sıfıra indiririz. İthalat sürecindeki tüm mevzuat gerekliliklerini, izin belgelerini ve vergi hesaplarını titizlikle tamamlıyoruz.",
  },
  {
    slug: "ihracat",
    title: "İhracat Gümrükleme İşlemleri",
    shortDesc:
      "Dünya pazarlarına açılan ürünleriniz için hızlı tescil, dolaşım belgeleri, birlik onayları ve güvenli çıkış desteği.",
    iconName: "ArrowUpFromLine",
    category: "gumruk",
    features: [
      "İhraç edilecek eşya ile ilgili fizibilite çalışmasının ve GTİP analizinin yapılması",
      "İlgili İhracatçı Birliklerine (İMMİB, İİB vb.) üyelik ve beyanname onay işlemlerinin yapılması",
      "A.TR, EUR.1, Menşe Şahadetnamesi (Certificate of Origin) ve FORM A belgelerinin düzenlenmesi",
      "Ülke durumuna ve alıcı talebine göre konsolosluk ve elçilik tasdik işlemlerinin yapılması",
      "İhraç edilecek eşyanın gümrük beyannamesinin düzenlenmesi ve beyanname işlemlerinin sonuçlandırılması",
      "Yurtdışına gönderilecek vesaiklerin kontrolü ve nakliyeci firmaya teslimi",
      "Gümrük Çıkış Beyannamesi (GCB) ve intaç takibi ile KDV iadesi süreçlerine hazır hale getirilmesi",
    ],
    detailedContent:
      "İhracat operasyonlarında hız ve evrak doğruluğu esastır. İhracatçı müşterilerimizin vergi iadelerini zamanında alabilmeleri için beyanname kapanışlarını anlık takip eder, Evrim Web Gümrük portalımız üzerinden anında dijital arşiv olarak sunarız. Tüm gümrük idarelerinde hızlı işlem kapama prensibiyle çalışıyoruz.",
  },
  {
    slug: "dahilde-isleme",
    title: "Dahilde İşleme Rejimi (DİR) İşlemleri",
    shortDesc:
      "İhracat taahhütlü hammadde ve ambalaj alımlarında gümrük vergisi ve KDV muafiyeti sağlayan DİİB yönetimi.",
    iconName: "Repeat",
    category: "rejim",
    features: [
      "Dahilde İşleme Rejimi Kapsamında Dahilde İşleme İzin Belgesi (DİİB) alımı",
      "DİİB kapsamındaki ithalat ve ihracat eşyalarının stok ve miktar takibinin yapılması",
      "Belge süre takibi ve süre aşımlarına karşı proaktif uyarı mekanizması",
      "DİİB revize, ek süre ve kapasite güncelleme işlemlerinin yapılması",
      "Dahilde İşleme İzin Belgesi taahhüt kapatma dosyasının hazırlanması ve belgenin kapatılması",
      "Gümrük idarelerine verilen teminat mektuplarının çözümü ve iadesinin sağlanması",
    ],
    detailedContent:
      "Dahilde İşleme Rejimi, üretici ve ihracatçılar için büyük vergi ve maliyet avantajları sağlar. Ancak taahhütlerin ve sürelerin takibi derin uzmanlık gerektirir. Kalem Gümrük, süre aşımları ve vergi cezaları riskini ortadan kaldıran titiz bir DİR takip sistemiyle belgenizin alımından teminat çözümüne kadar tüm adımları yönetir.",
  },
  {
    slug: "haricte-isleme",
    title: "Hariçte İşleme Hizmetleri",
    shortDesc:
      "Tamir, bakım, yenileme veya işleme amacıyla geçici olarak yurt dışına gönderilen eşyaların güvenli rejim yönetimi.",
    iconName: "RefreshCw",
    category: "rejim",
    features: [
      "Hariçte İşleme Rejimi Kapsamında Hariçte İşleme İzin Belgesi (HİİB) veya izin alımı",
      "Tamir, bakım, işçilik veya işleme amacıyla yurt dışına geçici gönderim işlemleri",
      "Yurt dışındaki işleme sürelerinin takibi ve süre uzatım başvurularının yapılması",
      "Ayniyet tespit tutanaklarının gümrük muayene memuru nezdinde düzenlenmesi",
      "İşlenmiş ürünlerin geri getirilmesinde katma değer vergi farkı hesabı ve gümrük muafiyeti uygulanması",
      "Hariçte işleme dosyasının ve rejim taahhütlerinin resmi olarak kapatılması",
    ],
    detailedContent:
      "Hariçte İşleme Rejimi, serbest dolaşımdaki eşyanın daha ileri bir safhada işlenmek, tamir edilmek veya yenilenmek üzere geçici olarak Türkiye Gümrük Bölgesi dışına çıkarılması ve işlem görmüş ürünlerin tam veya kısmi muafiyetle geri getirilmesini kapsar. Kalem Gümrük ayniyet tespitinden vergi muafiyeti hesaplamalarına kadar tüm süreci hatasız yürütür.",
  },
  {
    slug: "antrepo",
    title: "Antrepo Rejimi İşlemleri",
    shortDesc:
      "İthal eşyaların vergileri ödenmeksizin genel veya özel gümrüklü antrepolarda depolanması ve kısmi millileştirilmesi.",
    iconName: "Warehouse",
    category: "rejim",
    features: [
      "Antrepo Rejimi Kapsamında ithal edilmek istenen eşya için antrepo beyannamesi düzenleyerek antrepoya alınması",
      "Genel ve özel antrepolarda boşaltma, yer tespiti ve gümrük gözetimi takibi",
      "Antrepo stok takibi, süre takibi ve ardiye maliyet optimizasyonu",
      "Antrepodan kısmi çekim ve parça parça millileştirme ithalat beyannamelerinin tanzimi",
      "Antrepoda gümrük gözetiminde elleçleme (etiketleme, ayrıştırma, ambalajlama) izinleri",
      "Antrepo devir ve gümrük gözetiminde mülkiyet devir işlemlerinin sonuçlandırılması",
    ],
    detailedContent:
      "Antrepo rejimi, eşyanızın ithalat vergilerini henüz ödemeden güvenli depolarda muhafaza edilmesine ve ihtiyaç duyuldukça parça parça millileştirilmesine imkan tanır. Kalem Gümrük Müşavirliği, İstanbul ve çevre illerdeki en uygun genel/özel antrepoların koordinasyonunu ve rejim beyanlarını titizlikle gerçekleştirir.",
  },
  {
    slug: "transit",
    title: "Transit Rejimi İşlemleri",
    shortDesc:
      "Serbest dolaşımda olmayan eşyanın Türkiye Gümrük Bölgesi içinde veya üçüncü ülkelere taşınması için transit beyanı ve teminat takibi.",
    iconName: "Truck",
    category: "rejim",
    features: [
      "Transit Rejimi Kapsamında ön bilgi verilmesi, güzergah ve mevzuat yönlendirmesi",
      "NCTS (Yeni Bilgisayarlı Transit Sistemi) üzerinden T1, T2 ve TR transit beyannamelerinin düzenlenmesi",
      "Gümrük İdareleriyle gerekli izin yazışmalarının ve mühür tatbikinin yapılması",
      "Kapsamlı teminat ve münferit teminat çözümleri ile taşıma güvencesi sunulması",
      "Liman, serbest bölge, hava kargo ve kara sınır kapıları arasındaki transit aktarma takipleri",
      "Varış gümrüğünde transit beyannamesinin kapatılması ve teminat ibrası",
    ],
    detailedContent:
      "Transit rejimi, ithalat vergilerine ve ticaret politikası önlemlerine tabi tutulmayan eşyanın gümrük gözetimi altında bir noktadan diğerine taşınmasını sağlar. Kalem Gümrük, NCTS altyapısı ve deneyimli saha personeliyle transit beyannamelerini anında tescil eder, teminat ve varış onaylarını eksiksiz tamamlar.",
  },
  {
    slug: "serbest-bolge",
    title: "Serbest Bölge İşlemleri",
    shortDesc:
      "Türkiye serbest bölgelerindeki firmalar için SBİF tanzimi, bölge içi mal devri ve vergi muafiyetli gümrükleme.",
    iconName: "Building2",
    category: "rejim",
    features: [
      "Serbest Bölge mevzuatı hakkında bilgi aktarımının yapılması ve yönlendirilmesi",
      "Giriş, Çıkış işlem formlarının (SBİF) ve gümrük statü belgelerinin tanzimi ve onay işlemlerinin yapılması",
      "Serbest bölgeden Türkiye'ye ithalat ve serbest bölgeden yurt dışına ihracat operasyonları",
      "Bölge içi mal devir, envanter kontrolleri ve üretim takip onayları",
      "Gümrük statü belgelerinin (A.TR, Menşe vb.) hazırlanması ve bölge müdürlüğü onayları",
      "İstanbul İhtisas, AHL, Kocaeli, Bursa ve diğer tüm serbest bölgelerde tam saha hakimiyeti",
    ],
    detailedContent:
      "Serbest bölgeler; vergi, harç ve gümrük muafiyetleriyle dış ticaret firmalarına önemli avantajlar sunar. Kalem Gümrük, serbest bölgelerdeki giriş-çıkış işlem formlarının (SBİF) onayından serbest bölgeden iç piyasaya ithalat veya yurtdışına ihracat operasyonlarına kadar eksiksiz hizmet verir.",
  },
  {
    slug: "danismanlik",
    title: "Dış Ticaret & Gümrük Danışmanlığı",
    shortDesc:
      "Dış ticaretin her alanında A karne gümrük müşavirlerimizle mevzuat yönlendirmesi, teşvik projeleri ve YYS hazırlığı.",
    iconName: "Briefcase",
    category: "danismanlik",
    features: [
      "Firmamız dış ticaretin her alanında istenen detayda bilgiyi müşterilerine sunmaktadır",
      "Teşvik Mevzuatı proje ve işlemleri danışmanlığı (Yatırım Teşvik Belgesi alımı ve revizesi)",
      "Dış Ticaret Mevzuatı, kambiyo mevzuatı destek ve yönlendirme",
      "Gümrük uzlaşma destek ve yönlendirme toplantılarında müşavirlik",
      "Basitleştirilmiş Usul İşlemleri (Yetkilendirilmiş Yükümlü Statüsü - YYS ve Onaylanmış Kişi Statü Belgesi - OKSB)",
      "Gümrük ve Dış Ticaret ile ilgili her türlü ihtilaflı işlemlerin çözümü ve ön denetimler",
    ],
    detailedContent:
      "Gümrük mevzuatı sürekli güncellenen ve hata kabul etmeyen dinamik bir yapıya sahiptir. Kalem Gümrük Müşavirliği olarak, firmalarımızın dış ticaret operasyonlarını mevzuata tam uyumlu hale getiriyor, Yatırım Teşvik, YYS ve sonradan kontrol denetimlerinde şirketinizin en güçlü güvencesi oluyoruz.",
  },
  {
    slug: "hukuk",
    title: "Gümrük Hukuk Hizmetleri",
    shortDesc:
      "Gümrük mevzuatından doğan idari para cezaları, ek tahakkuk kararları ve uyuşmazlıklarda teknik & hukuki destek.",
    iconName: "Scale",
    category: "danismanlik",
    features: [
      "Gümrük ve Dış Ticaret Mevzuatından kaynaklanan idari para cezaları ve vergi farklarına itiraz süreçleri",
      "4458 sayılı Gümrük Kanunu 242. madde uyarınca gümrük müdürlüklerine ve bölge müdürlüklerine idari itiraz başvuruları",
      "Gümrük Uzlaşma Komisyonu toplantılarında firmayı temsilen teknik ve hukuki savunma sunumu",
      "5607 sayılı Kaçakçılıkla Mücadele Kanunu kapsamındaki süreçlerde teknik müşavirlik desteği",
      "Vergi ve İdare Mahkemelerinde açılan gümrük davaları için teknik bilirkişi düzeyinde dosya hazırlığı",
      "GTİP (tarife) ve kıymet ihtilaflarında bağlayıcı tarife/menşe bilgisi başvuruları ve hukuki risk raporlaması",
    ],
    detailedContent:
      "Gümrük işlemlerinde karşılaşılan tarife, kıymet veya menşe kaynaklı ek tahakkuk ve para cezası kararları doğru yönetilmediğinde ciddi maliyetlere yol açabilir. Kalem Gümrük Müşavirliği, A karne yetkili müşavirleri ve alanında uzman hukuk danışmanlarıyla itiraz, uzlaşma ve mahkeme süreçlerinde firmanızın haklarını en üst seviyede savunur.",
  },
  {
    slug: "sigorta",
    title: "Sigorta Hizmetleri",
    shortDesc:
      "Uluslararası taşımacılıkta emtianızın tüm risklere karşı tam teminatla korunmasını sağlayan nakliyat sigortası çözümleri.",
    iconName: "Shield",
    category: "danismanlik",
    features: [
      "Uluslararası emtia nakliyat sigortaları (Institute Cargo Clauses All Risks / Geniş Teminat)",
      "Denizyolu, havayolu, karayolu ve demiryolu sevkiyatlarında eşyanın yükleme anından varışına kadar kesintisiz poliçe güvencesi",
      "Gümrüklü antrepo, serbest bölge ve geçici depolama sahalarında yangın ve emtia güvence sigortaları",
      "Incoterms teslim şekillerine (özellikle CIF, CIP) tam uyumlu sigorta poliçesi tanzimi",
      "Hasar vukuunda ekspertiz koordinasyonu, tutanak düzenlenmesi ve hızlı tazminat takibi",
      "Dış ticaret operasyonlarınıza özel en uygun prim ve en geniş teminat optimizasyonu",
    ],
    detailedContent:
      "Dış ticarette ürünlerin taşınması esnasında kaza, hasar, ıslanma veya kayıp gibi beklenmedik riskler telafisi güç zararlar doğurabilir. Kalem Gümrük Sigorta Hizmetleri, lider sigorta şirketleriyle entegre çalışarak yükleme noktasından varış deposuna kadar emtianızı en uygun maliyet ve en geniş teminatlarla güvence altına alır.",
  },
];

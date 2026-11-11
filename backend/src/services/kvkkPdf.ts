import path from "path";
import { createRequire } from "module";
import PDFDocument from "pdfkit";
import type { CompanySettings } from "./settings.js";

const require = createRequire(import.meta.url);

function getDejaVuFontPaths() {
  const pkgPath = require.resolve("dejavu-fonts-ttf/package.json");
  const ttfDir = path.join(path.dirname(pkgPath), "ttf");
  return {
    regular: path.join(ttfDir, "DejaVuSans.ttf"),
    bold: path.join(ttfDir, "DejaVuSans-Bold.ttf"),
    italic: path.join(ttfDir, "DejaVuSans-Oblique.ttf"),
  };
}

/**
 * Veritabanındaki güncel firma iletişim bilgileriyle (unvan, adres, telefon, e-posta)
 * dinamik olarak 6698 Sayılı KVKK Aydınlatma Metni PDF belgesi üretir.
 */
export async function generateKvkkPdfBuffer(company: CompanySettings): Promise<Buffer> {
  const fonts = getDejaVuFontPaths();
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 48, bottom: 52, left: 48, right: 48 },
    info: {
      Title: `KVKK Aydınlatma Metni - ${company.name}`,
      Author: company.name,
      Subject: "6698 Sayılı Kişisel Verilerin Korunması Kanunu Aydınlatma Metni",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.registerFont("Regular", fonts.regular);
  doc.registerFont("Bold", fonts.bold);
  doc.registerFont("Italic", fonts.italic);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const primary = "#1E2A3A";
  const accent = "#0E7490";
  const textDark = "#1E293B";
  const textMuted = "#475569";

  // Üst Kurumsal Başlık
  doc.font("Bold").fontSize(13).fillColor(primary).text(company.name.toUpperCase(), {
    continued: false,
  });
  doc.moveDown(0.15);
  doc
    .font("Bold")
    .fontSize(8.5)
    .fillColor(accent)
    .text("6698 SAYILI KVKK KAPSAMINDA KURUMSAL AYDINLATMA METNİ");

  const headerBottomY = doc.y + 8;
  doc
    .moveTo(doc.page.margins.left, headerBottomY)
    .lineTo(doc.page.width - doc.page.margins.right, headerBottomY)
    .lineWidth(2)
    .strokeColor(primary)
    .stroke();

  doc.y = headerBottomY + 14;

  // Doküman Ana Başlığı
  doc
    .font("Bold")
    .fontSize(13.5)
    .fillColor(primary)
    .text("KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ AYDINLATMA METNİ", {
      align: "center",
    });
  doc.moveDown(0.25);
  doc
    .font("Regular")
    .fontSize(9)
    .fillColor(textMuted)
    .text('6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") m. 10 Uyarınca Bilgilendirme', {
      align: "center",
    });

  doc.moveDown(0.9);

  // Veri Sorumlusu Bilgi Kutusu (Dinamik Site Ayarlarından Gelir)
  const boxTop = doc.y;
  const infoLines = [
    { label: "Veri Sorumlusu: ", value: company.name },
    { label: "Adres: ", value: company.address },
    {
      label: "Telefon / E-Posta: ",
      value: `${company.phone}  |  ${company.email}  |  https://kalemgumruk.com`,
    },
  ];

  // Kutunun yüksekliğini hesapla
  let boxContentHeight = 14;
  doc.font("Regular").fontSize(9);
  for (const line of infoLines) {
    boxContentHeight += doc.heightOfString(`${line.label}${line.value}`, {
      width: pageWidth - 22,
    }) + 3;
  }

  doc
    .rect(doc.page.margins.left, boxTop, pageWidth, boxContentHeight)
    .fillAndStroke("#F8FAFC", "#CBD5E1");
  doc.rect(doc.page.margins.left, boxTop, 3.5, boxContentHeight).fill("#44B9CD");

  doc.y = boxTop + 8;
  for (const line of infoLines) {
    doc
      .font("Bold")
      .fontSize(8.8)
      .fillColor(primary)
      .text(line.label, doc.page.margins.left + 12, doc.y, {
        continued: true,
        width: pageWidth - 22,
      })
      .font("Regular")
      .fillColor(textDark)
      .text(line.value, {
        width: pageWidth - 22,
      });
    doc.y += 2;
  }

  doc.y = boxTop + boxContentHeight + 14;

  const addSectionTitle = (title: string) => {
    if (doc.y > doc.page.height - 110) {
      doc.addPage();
    }
    doc.font("Bold").fontSize(10.5).fillColor(primary).text(title);
    const lineY = doc.y + 2;
    doc
      .moveTo(doc.page.margins.left, lineY)
      .lineTo(doc.page.width - doc.page.margins.right, lineY)
      .lineWidth(0.75)
      .strokeColor("#E2E8F0")
      .stroke();
    doc.y = lineY + 6;
  };

  const addParagraph = (text: string) => {
    doc.font("Regular").fontSize(9.3).fillColor(textDark).text(text, {
      align: "justify",
      lineGap: 2.2,
    });
    doc.moveDown(0.5);
  };

  const addBullet = (lead: string | null, body: string) => {
    const bulletX = doc.page.margins.left + 8;
    const textWidth = pageWidth - 16;
    if (doc.y > doc.page.height - 85) {
      doc.addPage();
    }
    if (lead) {
      doc
        .font("Bold")
        .fontSize(9.2)
        .fillColor(primary)
        .text(`•  ${lead}: `, bulletX, doc.y, { continued: true, width: textWidth, lineGap: 2 })
        .font("Regular")
        .fillColor(textDark)
        .text(body, { width: textWidth, align: "justify", lineGap: 2 });
    } else {
      doc
        .font("Regular")
        .fontSize(9.2)
        .fillColor(textDark)
        .text(`•  ${body}`, bulletX, doc.y, { width: textWidth, align: "justify", lineGap: 2 });
    }
    doc.moveDown(0.25);
  };

  // 1. Bölüm
  addSectionTitle("1. Veri Sorumlusunun Kimliği ve Amaç");
  addParagraph(
    `${company.name} ("Şirket") olarak, müşterilerimizin, iş ortaklarımızın, çalışan adaylarımızın ve web sitemizi ziyaret eden ilgili kişilerin kişisel verilerinin güvenliğine ve gizliliğine büyük önem veriyoruz. Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca veri sorumlusu sıfatıyla sizleri bilgilendirmek amacıyla hazırlanmıştır.`
  );

  // 2. Bölüm
  addSectionTitle("2. İşlenen Kişisel Veri Kategorileri");
  addBullet(
    "Kimlik ve İletişim Bilgileri",
    "Ad, soyad, telefon numarası, e-posta adresi, firma/kurum unvanı ve gümrük vekaletnamesi süreçlerinde yetkili kişi bilgileri."
  );
  addBullet(
    "Müşteri İşlem ve Gümrük Operasyon Verileri",
    "İletişim, fiyat teklifi, danışmanlık ve dijital asistan formları aracılığıyla iletilen GTİP kodu, eşya tanımı, hedef gümrük/liman bilgisi, sevkiyat detayları ve yüklenen ticari belgeler (fatura, konşimento, çeki listesi vb.)."
  );
  addBullet(
    "İnsan Kaynakları ve Başvuru Verileri",
    "Kariyer ve staj başvuru formları ile paylaşılan özgeçmiş (CV), deneyim, öğrenim ve ön yazı bilgileri."
  );
  addBullet(
    "Müşteri Değerlendirme Verileri",
    "Hizmet değerlendirme formu kapsamında paylaşılan puan, hizmet türü ve yorum içerikleri."
  );
  addBullet(
    "İşlem Güvenliği Verileri",
    "Web sitesi formlarının kötüye kullanımını ve spam saldırılarını önlemek amacıyla işlenen IP adresi, başvuru zaman damgası ve referans takip kodu bilgileri."
  );
  doc.moveDown(0.3);

  // 3. Bölüm
  addSectionTitle("3. Kişisel Verilerin İşlenme Amaçları");
  addBullet(
    null,
    "İthalat, ihracat, antrepo, transit, dahilde işleme ve dış ticaret mevzuatı danışmanlığı hizmetlerinin yürütülmesi ve fiyat tekliflerinin hazırlanması,"
  );
  addBullet(
    null,
    "İletişim taleplerinizin, bilgi ve belge isteklerinizin yanıtlanması ile müşteri ilişkileri süreçlerinin yönetilmesi,"
  );
  addBullet(
    null,
    "4458 sayılı Gümrük Kanunu, Vergi Usul Kanunu ve ilgili dış ticaret mevzuatı kapsamındaki yasal yükümlülüklerin yerine getirilmesi,"
  );
  addBullet(
    null,
    "İş ve staj başvurularının değerlendirilmesi ile insan kaynakları süreçlerinin yürütülmesi,"
  );
  addBullet(
    null,
    "Web sitesi bilgi güvenliğinin sağlanması, sahte/otomatik bot gönderimlerinin engellenmesi ve hizmet kalitemizin artırılması."
  );
  doc.moveDown(0.3);

  // 4. Bölüm
  addSectionTitle("4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebepleri");
  addParagraph(
    "Kişisel verileriniz; web sitemizde yer alan iletişim, fiyat teklifi, kariyer/staj, değerlendirme ve dinamik formlar, dijital asistan (chatbot), e-posta, telefon ve WhatsApp iletişim kanalları üzerinden elektronik ortamda otomatik veya kısmen otomatik yöntemlerle toplanmaktadır."
  );
  addParagraph(
    "Bu veriler, KVKK'nın 5. maddesinde belirtilen; kanunlarda açıkça öngörülmesi, bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması, veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması, bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması, ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatlerimizin bulunması hukuki sebeplerine dayanılarak; ayrıca İK havuzunda değerlendirme, müşteri yorumu yayımlama veya iletişime geçme gibi açık rıza gerektiren hallerde ise açık rızanız doğrultusunda işlenmektedir."
  );

  // 5. Bölüm
  addSectionTitle("5. Kişisel Verilerin Aktarılması");
  addParagraph(
    "Kişisel verileriniz ve ticari sırlarınız hiçbir koşulda üçüncü kişilere pazarlama veya ticari menfaat amacıyla satılmaz ve devredilmez. Verileriniz yalnızca hizmetin ifası ve yasal zorunluluklar kapsamında KVKK'nın 8. ve 9. maddelerine uygun olarak; T.C. Ticaret Bakanlığı, Gümrük Müdürlükleri, yetkili kamu kurum ve kuruluşları, lojistik/antrepo iş ortaklarımız ile hukuki uyuşmazlıklarda yetkili yargı ve idari mercilerle gerekli teknik ve idari tedbirler alınarak paylaşılabilir."
  );

  // 6. Bölüm
  addSectionTitle("6. Saklama Süresi ve Veri Güvenliği");
  addParagraph(
    "Şirketimiz, kişisel verilerinizi 256-bit SSL/TLS şifreli iletim, erişim yetkilendirmesi, güvenlik duvarı ve düzenli yedekleme önlemleri ile korumaktadır. Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta (Gümrük Kanunu, Türk Ticaret Kanunu, Vergi Usul Kanunu ve İş Kanunu) öngörülen yasal saklama/zamanaşımı süreleri boyunca muhafaza edilir; sürenin sona ermesi veya işleme amacının ortadan kalkması hâlinde re'sen veya talebiniz üzerine silinir, yok edilir ya da anonim hâle getirilir."
  );

  // 7. Bölüm
  addSectionTitle("7. İlgili Kişinin KVKK Madde 11 Kapsamındaki Hakları");
  addParagraph("KVKK'nın 11. maddesi uyarınca Şirketimize başvurarak kendinizle ilgili olarak;");
  addBullet(null, "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme,");
  addBullet(null, "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,");
  addBullet(null, "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,");
  addBullet(null, "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,");
  addBullet(null, "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,");
  addBullet(null, "Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,");
  addBullet(null, "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,");
  addBullet(null, "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.");
  doc.moveDown(0.3);

  // 8. Bölüm
  addSectionTitle("8. Başvuru Yöntemi");
  addParagraph(
    `Yukarıda belirtilen haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca kimliğinizi tevsik edici belgelerle birlikte ıslak imzalı dilekçe ile ${company.address} adresimize elden veya noter aracılığıyla gönderebilir ya da sistemimizde kayıtlı e-posta adresiniz üzerinden ${company.email} adresine iletebilirsiniz. Başvurularınız talebin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılır.`
  );

  doc.moveDown(0.6);
  doc
    .font("Italic")
    .fontSize(8)
    .fillColor(textMuted)
    .text(`${company.name}  •  https://kalemgumruk.com  •  ${company.email}  •  ${company.phone}`, {
      align: "center",
    });

  doc.end();
  return done;
}

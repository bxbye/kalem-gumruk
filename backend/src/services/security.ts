import crypto from "crypto";

const SECURITY_SECRET =
  process.env.SECURITY_SECRET ||
  process.env.SESSION_SECRET ||
  "kalem-gumruk-security-challenge-salt-2026";

// Tek kullanımlık token listesi (Replay attack önleme, 15 dk süreli)
const usedTokens = new Map<string, number>();

// Eski tokenları periyodik temizle
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of usedTokens.entries()) {
    if (now > expiry) {
      usedTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

export interface HumanChallenge {
  token: string;
  question: string;
}

/**
 * Hem yerel geliştirmede (localhost) hem canlıda (production) %100 ücretsiz,
 * harici servis bağımlılığı olmadan çalışan İnsan Doğrulaması (Anti-Bot Challenge).
 */
export function generateHumanChallenge(): HumanChallenge {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2..9
  const num2 = Math.floor(Math.random() * 7) + 1; // 1..7
  const isAddition = Math.random() > 0.35; // %65 toplama, %35 çıkarma

  let questionText = "";
  let answer = 0;

  if (isAddition) {
    answer = num1 + num2;
    questionText = `${num1} + ${num2} = ?`;
  } else {
    const higher = Math.max(num1, num2);
    const lower = Math.min(num1, num2);
    answer = higher - lower;
    questionText = `${higher} - ${lower} = ?`;
  }

  const timestamp = Date.now();
  const nonce = crypto.randomBytes(6).toString("hex");

  // HMAC imza oluştur
  const payload = `${answer}:${timestamp}:${nonce}`;
  const signature = crypto
    .createHmac("sha256", SECURITY_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 24);

  const token = `${timestamp}.${nonce}.${signature}`;

  return {
    token,
    question: questionText,
  };
}

/**
 * İnsan Doğrulama Cevabını Kontrol Eder
 */
export function verifyHumanChallenge(
  token?: string,
  userAnswer?: string | number
): { valid: boolean; reason?: string } {
  if (!token || userAnswer === undefined || userAnswer === null || String(userAnswer).trim() === "") {
    return { valid: false, reason: "Lütfen güvenlik doğrulaması (insan doğrulaması) alanını doldurunuz." };
  }

  // Token daha önce kullanılmış mı?
  if (usedTokens.has(token)) {
    return { valid: false, reason: "Güvenlik doğrulama kodu zaten kullanılmış. Lütfen sayfayı yenileyip tekrar deneyiniz." };
  }

  const parts = String(token).split(".");
  if (parts.length !== 3) {
    return { valid: false, reason: "Geçersiz güvenlik doğrulaması token formatı." };
  }

  const [tsStr, nonce, expectedSignature] = parts;
  const timestamp = Number(tsStr);

  if (isNaN(timestamp)) {
    return { valid: false, reason: "Geçersiz güvenlik doğrulaması zaman damgası." };
  }

  const now = Date.now();
  const elapsed = now - timestamp;

  // 15 dakikadan eski tokenlar geçersizdir
  if (elapsed > 15 * 60 * 1000) {
    return { valid: false, reason: "Güvenlik doğrulama süreniz doldu. Lütfen soruyu yenileyiniz." };
  }

  // 500 ms'den hızlı cevaplar insan olamayacak kadar hızlıdır (bot kontrolü)
  if (elapsed < 500) {
    return { valid: false, reason: "Güvenlik kontrolü çok hızlı yanıtlandı. Bot davranışı tespit edildi." };
  }

  const cleanAnswer = String(userAnswer).trim();
  const payload = `${cleanAnswer}:${timestamp}:${nonce}`;
  const actualSignature = crypto
    .createHmac("sha256", SECURITY_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 24);

  if (!crypto.timingSafeEqual(Buffer.from(actualSignature), Buffer.from(expectedSignature))) {
    return { valid: false, reason: "Güvenlik doğrulaması cevabınız hatalı. Lütfen işlemi kontrol ediniz." };
  }

  // Başarılı olduğunda token'ı 15 dakikalığına kara listeye al (Replay engelleme)
  usedTokens.set(token, now + 15 * 60 * 1000);

  return { valid: true };
}

/**
 * Tüm formlar için merkezi, kapsamlı spam ve güvenlik kontrolörü
 */
export interface SpamGuardOptions {
  honeypot?: string;
  formLoadedAt?: number | string;
  challengeToken?: string;
  challengeAnswer?: string | number;
  turnstileToken?: string;
  kvkkConsent?: boolean | string | number;
  ip?: string;
  files?: any[];
  maxFiles?: number;
}

export async function validateFormSpamGuard(opts: SpamGuardOptions): Promise<{ valid: boolean; reason?: string }> {
  // 1. Honeypot (Gizli tuzak alan) doldurulmuşsa -> Kesinlikle spam bot
  if (opts.honeypot && String(opts.honeypot).trim() !== "") {
    return { valid: false, reason: "Spam bot davranışı tespit edildi." };
  }

  // 2. KVKK Onayı Zorunluluğu
  const isKvkkApproved =
    opts.kvkkConsent === true ||
    opts.kvkkConsent === "true" ||
    opts.kvkkConsent === 1 ||
    opts.kvkkConsent === "1";

  if (!isKvkkApproved) {
    return { valid: false, reason: "Devam edebilmek için KVKK aydınlatma metnini onaylamanız gerekmektedir." };
  }

  // 3. Dosya Sayısı Sınırı (Maksimum 2 dosya)
  const maxAllowed = opts.maxFiles || 2;
  if (Array.isArray(opts.files) && opts.files.length > maxAllowed) {
    return { valid: false, reason: `En fazla ${maxAllowed} adet dosya yükleyebilirsiniz.` };
  }

  // 4. Zaman Tuzağı Kontrolü (İnsan hızından hızlı gönderim)
  if (opts.formLoadedAt) {
    const elapsed = Date.now() - Number(opts.formLoadedAt);
    if (!isNaN(elapsed) && elapsed < 1200) {
      return { valid: false, reason: "Form beklenenden çok hızlı dolduruldu. Lütfen tekrar deneyiniz." };
    }
  }

  // 5. İnsan Doğrulaması (Challenge Kontrolü)
  // Geliştirme ve prod dahil her iki ortamda ücretsiz çalışır
  const challengeCheck = verifyHumanChallenge(opts.challengeToken, opts.challengeAnswer);
  if (!challengeCheck.valid) {
    return challengeCheck;
  }

  return { valid: true };
}

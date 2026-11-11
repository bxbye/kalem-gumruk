const HTML_TAG_REGEX =
  /<\/?(p|div|br|strong|b|em|i|u|s|del|h[1-6]|ul|ol|li|blockquote|a|img|figure|figcaption|hr)\b[^>]*>/i;

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "hr",
  "div",
  "span",
]);

const SELF_CLOSING_TAGS = new Set(["br", "hr", "img"]);

export function isHtmlContent(input?: string | null): boolean {
  if (!input || typeof input !== "string") return false;
  return HTML_TAG_REGEX.test(input);
}

export function stripHtml(input?: string | null): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function plainTextToHtml(text?: string | null): string {
  if (!text || typeof text !== "string") return "";
  if (isHtmlContent(text)) return text;

  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtmlText(para).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function sanitizeUrl(rawUrl: string, allowRelative: boolean): string | null {
  const cleaned = rawUrl.trim().replace(/[\u0000-\u0020]+/g, "");
  if (!cleaned) return null;

  if (allowRelative && cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return cleaned;
  }

  if (/^(https?:|mailto:|tel:)/i.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-zA-Z0-9_-]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    const val = match[2] ?? match[3] ?? match[4] ?? "";
    attrs[name] = val;
  }
  return attrs;
}

/**
 * Rich text editor çıktısını XSS risklerine karşı güvenli HTML'e dönüştürür.
 * Yalnızca güvenli biçimlendirme etiketlerine ve güvenli src/href protokollerine izin verir.
 */
export function sanitizeRichHtml(html?: string | null): string {
  if (!html || typeof html !== "string") return "";

  // Tehlikeli blokları içerikleriyle birlikte tamamen temizle
  const withoutDangerousBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");

  return withoutDangerousBlocks.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (full, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    const isClosing = full.startsWith("</");
    if (isClosing) {
      return SELF_CLOSING_TAGS.has(tag) ? "" : `</${tag}>`;
    }

    if (tag === "br" || tag === "hr") {
      return `<${tag} />`;
    }

    const attrs = parseAttributes(String(rawAttrs || ""));

    if (tag === "a") {
      const safeHref = attrs.href ? sanitizeUrl(attrs.href, true) : null;
      if (!safeHref) return "<span>";
      const isExternal = /^https?:/i.test(safeHref);
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtmlText(safeHref)}"${targetAttr}>`;
    }

    if (tag === "img") {
      const safeSrc = attrs.src ? sanitizeUrl(attrs.src, true) : null;
      if (!safeSrc) return "";
      const safeAlt = attrs.alt ? escapeHtmlText(attrs.alt) : "Mevzuat görseli";
      return `<img src="${escapeHtmlText(safeSrc)}" alt="${safeAlt}" loading="lazy" />`;
    }

    return `<${tag}>`;
  });
}

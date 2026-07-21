export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

export function normalizeKey(value: unknown): string {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function normalizeCompanyName(value: unknown): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|company|co|gmbh|sas|s\.a\.s|sa|plc|ag|bv)\b\.?/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function firstNonEmpty(...values: unknown[]): string | null {
  for (const value of values) {
    const text = normalizeText(value);
    if (text) return text;
  }
  return null;
}

export function toDomain(value?: string | null): string | null {
  if (!value) return null;
  const text = normalizeText(value);
  if (!text || /not publicly listed|contact form only/i.test(text)) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const url = new URL(withProtocol);
    return url.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    const match = text.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/i);
    return match ? match[1].replace(/^www\./i, "").toLowerCase() : null;
  }
}

export function toWebsite(value?: string | null): string | null {
  if (!value) return null;
  const text = normalizeText(value);
  if (!text || /not publicly listed|contact form only/i.test(text)) return null;
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) return `https://${text}`;
  const match = text.match(/https?:\/\/[^\s),]+/i);
  return match ? match[0] : null;
}

export function parseSpreadsheetPriority(value: unknown): "A" | "B" | "C" | "HOLD" | null {
  const text = normalizeText(value).toUpperCase();
  if (text === "A" || text === "B" || text === "C" || text === "HOLD") return text;
  return null;
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = normalizeText(value).replace(/,/g, "");
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

import { ContactRouteType } from "../types.js";
import { normalizeText, toWebsite } from "./normalizeText.js";

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const nonEmailMarkers = [
  "not publicly listed",
  "contact form only",
  "not listed",
  "n/a",
  "none",
  "unknown"
];

export function extractEmails(value: unknown): string[] {
  const text = normalizeText(value);
  if (!text || nonEmailMarkers.some((marker) => text.toLowerCase().includes(marker))) return [];
  const matches = text.match(emailRegex) ?? [];
  return Array.from(new Set(matches.map((email) => email.toLowerCase())));
}

export function isValidEmail(email?: string | null): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim().toLowerCase());
}

export function extractUrls(value: unknown): string[] {
  const text = normalizeText(value);
  if (!text) return [];
  const matches = text.match(/https?:\/\/[^\s),]+/gi) ?? [];
  return Array.from(new Set(matches.map((url) => url.replace(/[.;]+$/, ""))));
}

export function classifyUrlRoute(url?: string | null): ContactRouteType | null {
  if (!url) return null;
  const text = url.toLowerCase();
  if (/supplier|vendor|procure|sourcing|onboard|portal/.test(text)) return "supplier_portal";
  if (/contact|inquiry|enquir|support/.test(text)) return "contact_form";
  return "website_only";
}

export function detectContactRoutes(input: {
  publicEmail?: string | null;
  contactUrl?: string | null;
  supplierRoute?: string | null;
  website?: string | null;
  phone?: string | null;
}): {
  email: string | null;
  contact_form_url: string | null;
  supplier_portal_url: string | null;
  route_type: ContactRouteType;
} {
  const email = extractEmails(input.publicEmail)[0] ?? null;
  const routeText = [input.contactUrl, input.supplierRoute].filter(Boolean).join(" ");
  const urls = extractUrls(routeText);
  const normalizedContactUrl = toWebsite(input.contactUrl);
  const normalizedSupplierUrl = toWebsite(input.supplierRoute);
  const routeUrls = [...urls, normalizedContactUrl, normalizedSupplierUrl].filter(Boolean) as string[];
  const supplier = routeUrls.find((url) => classifyUrlRoute(url) === "supplier_portal") ?? null;
  const form = routeUrls.find((url) => classifyUrlRoute(url) === "contact_form") ?? null;

  if (email) return { email, contact_form_url: form, supplier_portal_url: supplier, route_type: "email" };
  if (supplier) return { email: null, contact_form_url: form, supplier_portal_url: supplier, route_type: "supplier_portal" };
  if (form) return { email: null, contact_form_url: form, supplier_portal_url: null, route_type: "contact_form" };
  if (normalizeText(input.phone) && !/not publicly listed|contact form only/i.test(normalizeText(input.phone))) {
    return { email: null, contact_form_url: null, supplier_portal_url: null, route_type: "phone" };
  }
  if (toWebsite(input.website)) return { email: null, contact_form_url: null, supplier_portal_url: null, route_type: "website_only" };
  return { email: null, contact_form_url: null, supplier_portal_url: null, route_type: "needs_review" };
}

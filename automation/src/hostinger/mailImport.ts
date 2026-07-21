import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { normalizeContact } from "../rules/normalizeContact.js";
import { firstNonEmpty, normalizeCompanyName, normalizeKey, parseNumber, parseSpreadsheetPriority, toDomain, toWebsite } from "../rules/normalizeText.js";
import type { ImportedRow } from "../types.js";
import { getStore } from "./store.js";

type ImportReport = {
  files: string[];
  rows_seen: number;
  rows_imported: number;
  rows_skipped: number;
  ready_for_draft: number;
  needs_manual_review: number;
  do_not_contact: number;
  by_route: Record<string, number>;
  skipped: Array<{ file: string; sheet: string; row: number; reason: string }>;
};

function valueByAliases(row: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    for (const [key, value] of Object.entries(row)) {
      if (normalizeKey(key) === normalizedAlias) {
        const text = firstNonEmpty(value);
        if (text) return text;
      }
    }
  }
  return null;
}

function rowToImported(sourceFile: string, sourceSheet: string, rowNumber: number, row: Record<string, unknown>): ImportedRow | null {
  const company = valueByAliases(row, ["Company", "Company Name"]);
  if (!company) return null;
  const category = valueByAliases(row, ["Category", "Buyer Type", "Company Type", "Vanilla Channel Fit", "Relevant Capabilities"]);
  const route = valueByAliases(row, ["Contact / Supplier URL", "Contact URL", "Best Contact Route", "Procurement Route", "Source URL"]);
  const website = valueByAliases(row, ["Website"]);
  const publicEmail = valueByAliases(row, ["Public Email", "Email"]);
  const notes = [
    valueByAliases(row, ["Vanilla Relevance", "Vanilla Buyer Fit", "Buyer Fit"]),
    valueByAliases(row, ["Why This Buyer Matters", "Why It Matters"]),
    valueByAliases(row, ["Recommended First Approach", "First Move"]),
    valueByAliases(row, ["Verification Notes", "Data Confidence"])
  ].filter(Boolean).join(" | ");

  return {
    source_file: sourceFile,
    source_sheet: sourceSheet,
    row_number: rowNumber,
    company_name: company,
    normalized_company_name: normalizeCompanyName(company),
    website: toWebsite(website),
    domain: toDomain(website),
    phone: valueByAliases(row, ["Public Phone", "Phone"]),
    public_email: publicEmail,
    contact_form_url: route,
    supplier_portal_url: valueByAliases(row, ["Procurement Route", "Best Contact Route"]),
    notes: notes || null,
    spreadsheet_segment: category,
    spreadsheet_priority: parseSpreadsheetPriority(valueByAliases(row, ["Priority Tier", "Priority"])),
    spreadsheet_score: parseNumber(valueByAliases(row, ["Score"])),
    recommended_role: valueByAliases(row, ["Recommended Role to Target", "Best Buyer Role", "Recommended Contact Role"]),
    headquarters: valueByAliases(row, ["Headquarters", "HQ / Primary Country", "HQ / Country"])
  };
}

export async function importMailListHostinger(mailListDir = process.env.MAIL_LIST_DIR ?? "../mail_list"): Promise<ImportReport> {
  const store = getStore();
  const absoluteDir = path.resolve(process.cwd(), mailListDir);
  const report: ImportReport = {
    files: [],
    rows_seen: 0,
    rows_imported: 0,
    rows_skipped: 0,
    ready_for_draft: 0,
    needs_manual_review: 0,
    do_not_contact: 0,
    by_route: {},
    skipped: []
  };
  const suppressed = await store.suppressedEmails();
  const files = fs.readdirSync(absoluteDir).filter((file) => file.toLowerCase().endsWith(".xlsx"));
  report.files = files;
  const seen = new Set<string>();

  for (const file of files) {
    const workbook = XLSX.readFile(path.join(absoluteDir, file), { cellDates: true });
    for (const sheetName of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: null });
      for (const [index, rawRow] of rows.entries()) {
        report.rows_seen += 1;
        const imported = rowToImported(file, sheetName, index + 2, rawRow);
        if (!imported) {
          report.rows_skipped += 1;
          report.skipped.push({ file, sheet: sheetName, row: index + 2, reason: "missing_company" });
          continue;
        }
        const normalized = normalizeContact(imported, suppressed);
        const dedupeKey = [normalized.normalized_company_name, normalized.domain ?? "", normalized.public_email ?? ""].join("|");
        if (seen.has(dedupeKey)) {
          report.rows_skipped += 1;
          report.skipped.push({ file, sheet: sheetName, row: index + 2, reason: "duplicate_in_import" });
          continue;
        }
        seen.add(dedupeKey);
        const account = await store.upsertAccount({
          company_name: normalized.company_name,
          normalized_company_name: normalized.normalized_company_name,
          domain: normalized.domain ?? null,
          website: normalized.website ?? null,
          headquarters: normalized.headquarters ?? null,
          buyer_segment: normalized.buyer_segment,
          priority: normalized.priority,
          lead_score: normalized.lead_score,
          notes: normalized.notes ?? null,
          source_file: normalized.source_file
        });
        await store.upsertContact({
          account_id: account.id,
          contact_name: null,
          role_title: normalized.recommended_role ?? "",
          contact_role: normalized.contact_role,
          public_email: normalized.public_email ?? "",
          email_status: normalized.email_status === "missing" ? "unknown" : normalized.email_status,
          phone: normalized.phone ?? null,
          contact_status: normalized.contact_status
        });
        report.rows_imported += 1;
        report[normalized.contact_status] += 1;
        report.by_route[normalized.contact_route_type] = (report.by_route[normalized.contact_route_type] ?? 0) + 1;
      }
    }
  }
  return report;
}

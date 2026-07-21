import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import type { DraftWithContext } from "./types.js";

export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function sendApprovedDraft(draft: DraftWithContext) {
  const dryRun = process.env.EMAIL_DRY_RUN !== "false";
  if (dryRun) {
    return { ok: true, dry_run: true, message_id: null };
  }
  if (!emailConfigured()) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.");
  }
  if (!draft.public_email) {
    throw new Error("Draft contact has no recipient email.");
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
  const result = await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    replyTo: process.env.SMTP_REPLY_TO ?? process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: draft.public_email,
    subject: draft.subject,
    text: draft.body
  });
  return { ok: true, dry_run: false, message_id: result.messageId };
}

export async function checkInbox() {
  if (!process.env.IMAP_HOST || !process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
    return { ok: true, configured: false, checked: 0, note: "IMAP is not configured." };
  }
  const dryRun = process.env.EMAIL_DRY_RUN !== "false";
  if (dryRun) {
    return { ok: true, configured: true, dry_run: true, checked: 0 };
  }
  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: String(process.env.IMAP_SECURE ?? "true") === "true",
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASSWORD
    }
  });
  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      let checked = 0;
      for await (const _message of client.fetch("1:*", { envelope: true, flags: true }, { uid: true })) {
        checked += 1;
        if (checked >= 25) break;
      }
      return { ok: true, configured: true, checked };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}

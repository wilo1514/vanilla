export type Id = string;

export type BuyerAccount = {
  id: Id;
  company_name: string;
  normalized_company_name: string;
  domain: string | null;
  website: string | null;
  headquarters: string | null;
  buyer_segment: string;
  priority: string;
  lead_score: number;
  notes: string | null;
  source_file: string | null;
  created_at: string;
  updated_at: string;
};

export type BuyerContact = {
  id: Id;
  account_id: Id;
  contact_name: string | null;
  role_title: string | null;
  contact_role: string;
  public_email: string | null;
  email_status: "valid" | "invalid" | "unknown";
  phone: string | null;
  contact_status: "ready_for_draft" | "needs_manual_review" | "do_not_contact";
  unsubscribed: boolean;
  bounced: boolean;
  created_at: string;
  updated_at: string;
};

export type OutreachDraft = {
  id: Id;
  account_id: Id;
  contact_id: Id;
  channel: "email";
  template_key: string;
  subject: string;
  body: string;
  status: "pending_approval" | "approved" | "rejected" | "sent" | "send_failed";
  risk_status: string;
  claims_used: string[];
  reviewed_by: string | null;
  review_notes: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SampleRequest = {
  id: Id;
  account_id: Id;
  contact_id: Id;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  request_payload: Record<string, unknown>;
  created_at: string;
};

export type Campaign = {
  id: Id;
  name: string;
  status: "draft" | "active" | "paused" | "complete";
  segment_filter: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: Id;
  account_id: Id | null;
  contact_id: Id | null;
  task_type: string;
  status: "new" | "in_progress" | "done" | "dismissed";
  notes: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Suppression = {
  email: string;
  reason: "unsubscribe" | "bounce" | "manual";
  source: string;
  created_at: string;
};

export type DraftWithContext = OutreachDraft & {
  company_name: string;
  public_email: string | null;
  priority: string;
  lead_score: number;
  buyer_segment: string;
};

export type LeadWithContact = BuyerAccount & {
  contact_id: string | null;
  contact_name: string | null;
  public_email: string | null;
  contact_status: string | null;
  email_status: string | null;
};

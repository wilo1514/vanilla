create extension if not exists pgcrypto;

create table if not exists buyer_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  normalized_company_name text not null,
  domain text,
  website text,
  headquarters text,
  buyer_segment text not null default 'unknown',
  spreadsheet_segment text,
  priority text not null default 'HOLD',
  lead_score integer not null default 0,
  source_file text,
  source_sheet text,
  source_row integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists buyer_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references buyer_accounts(id) on delete cascade,
  contact_name text,
  role_title text,
  contact_role text not null default 'unknown_contact',
  public_email text,
  email_status text not null default 'missing',
  phone text,
  contact_status text not null default 'needs_manual_review',
  unsubscribed boolean not null default false,
  bounced boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_routes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references buyer_accounts(id) on delete cascade,
  contact_id uuid references buyer_contacts(id) on delete cascade,
  route_type text not null,
  route_value text,
  source text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists suppression_list (
  id uuid primary key default gen_random_uuid(),
  email text,
  domain text,
  reason text not null,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists outreach_drafts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references buyer_accounts(id) on delete cascade,
  contact_id uuid references buyer_contacts(id) on delete set null,
  channel text not null default 'email',
  template_key text not null,
  subject text,
  body text not null,
  status text not null default 'pending_approval',
  risk_status text not null default 'SAFE',
  claims_used jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  review_notes text
);

create table if not exists outreach_events (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references outreach_drafts(id) on delete set null,
  account_id uuid references buyer_accounts(id) on delete cascade,
  contact_id uuid references buyer_contacts(id) on delete set null,
  event_type text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists sample_requests (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references buyer_accounts(id) on delete set null,
  contact_id uuid references buyer_contacts(id) on delete set null,
  company_name text,
  contact_name text,
  email text,
  phone text,
  request_payload jsonb not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table sample_requests add column if not exists account_id uuid;
alter table sample_requests add column if not exists contact_id uuid;

create table if not exists social_drafts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  template_key text not null,
  body text not null,
  status text not null default 'pending_approval',
  risk_status text not null default 'SAFE',
  claims_used jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_notes text
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references buyer_accounts(id) on delete cascade,
  contact_id uuid references buyer_contacts(id) on delete set null,
  task_type text not null,
  status text not null default 'open',
  due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_buyer_accounts_domain on buyer_accounts(domain);
create index if not exists idx_buyer_contacts_email on buyer_contacts(public_email);
create index if not exists idx_outreach_drafts_status on outreach_drafts(status);
create index if not exists idx_suppression_email on suppression_list(email);
create unique index if not exists ux_suppression_identity
  on suppression_list ((coalesce(email, '')), (coalesce(domain, '')), reason);
create unique index if not exists ux_buyer_accounts_identity
  on buyer_accounts (normalized_company_name, (coalesce(domain, '')));
create unique index if not exists ux_buyer_contacts_identity
  on buyer_contacts (account_id, (coalesce(public_email, '')), (coalesce(role_title, '')));

delete from contact_routes a
using contact_routes b
where a.id > b.id
  and a.account_id = b.account_id
  and coalesce(a.contact_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(b.contact_id, '00000000-0000-0000-0000-000000000000'::uuid)
  and a.route_type = b.route_type
  and coalesce(a.route_value, '') = coalesce(b.route_value, '');

create unique index if not exists ux_contact_routes_identity
  on contact_routes (account_id, (coalesce(contact_id, '00000000-0000-0000-0000-000000000000'::uuid)), route_type, (coalesce(route_value, '')));

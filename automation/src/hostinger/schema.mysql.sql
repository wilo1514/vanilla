create table if not exists buyer_accounts (
  id char(36) primary key,
  company_name varchar(255) not null,
  normalized_company_name varchar(255) not null,
  domain varchar(255) not null default '',
  website varchar(500) null,
  headquarters varchar(255) null,
  buyer_segment varchar(80) not null default 'unknown',
  priority varchar(12) not null default 'HOLD',
  lead_score int not null default 0,
  notes text null,
  source_file varchar(255) null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key ux_account_identity (normalized_company_name, domain),
  key idx_accounts_score (lead_score),
  key idx_accounts_segment (buyer_segment)
);

create table if not exists buyer_contacts (
  id char(36) primary key,
  account_id char(36) not null,
  contact_name varchar(255) null,
  role_title varchar(255) not null default '',
  contact_role varchar(80) not null default 'unknown',
  public_email varchar(255) not null default '',
  email_status enum('valid','invalid','unknown') not null default 'unknown',
  phone varchar(100) null,
  contact_status enum('ready_for_draft','needs_manual_review','do_not_contact') not null default 'needs_manual_review',
  unsubscribed boolean not null default false,
  bounced boolean not null default false,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key ux_contact_identity (account_id, public_email, role_title),
  key idx_contacts_email (public_email),
  key idx_contacts_status (contact_status),
  constraint fk_contacts_account foreign key (account_id) references buyer_accounts(id) on delete cascade
);

create table if not exists sample_requests (
  id char(36) primary key,
  account_id char(36) not null,
  contact_id char(36) not null,
  company_name varchar(255) not null,
  contact_name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(100) null,
  request_payload json not null,
  created_at timestamp not null default current_timestamp,
  key idx_sample_requests_account (account_id),
  constraint fk_sample_account foreign key (account_id) references buyer_accounts(id) on delete cascade,
  constraint fk_sample_contact foreign key (contact_id) references buyer_contacts(id) on delete cascade
);

create table if not exists outreach_drafts (
  id char(36) primary key,
  account_id char(36) not null,
  contact_id char(36) not null,
  channel varchar(30) not null default 'email',
  template_key varchar(120) not null,
  subject varchar(500) not null,
  body mediumtext not null,
  status enum('pending_approval','approved','rejected','sent','send_failed') not null default 'pending_approval',
  risk_status varchar(50) not null default 'ok',
  claims_used json not null,
  reviewed_by varchar(255) null,
  review_notes text null,
  sent_at timestamp null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key idx_drafts_status (status),
  key idx_drafts_contact (contact_id),
  constraint fk_drafts_account foreign key (account_id) references buyer_accounts(id) on delete cascade,
  constraint fk_drafts_contact foreign key (contact_id) references buyer_contacts(id) on delete cascade
);

create table if not exists tasks (
  id char(36) primary key,
  account_id char(36) null,
  contact_id char(36) null,
  task_type varchar(120) not null,
  status enum('new','in_progress','done','dismissed') not null default 'new',
  notes text null,
  due_at timestamp null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key idx_tasks_status (status)
);

create table if not exists suppression_list (
  email varchar(255) primary key,
  reason enum('unsubscribe','bounce','manual') not null,
  source varchar(120) not null default 'system',
  created_at timestamp not null default current_timestamp
);

create table if not exists campaigns (
  id char(36) primary key,
  name varchar(255) not null,
  status enum('draft','active','paused','complete') not null default 'draft',
  segment_filter varchar(120) null,
  notes text null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp
);

create table if not exists inbound_emails (
  id char(36) primary key,
  message_id varchar(500) not null,
  from_email varchar(255) not null,
  subject varchar(500) null,
  body mediumtext null,
  classification varchar(80) not null default 'needs_review',
  created_at timestamp not null default current_timestamp,
  unique key ux_inbound_message (message_id)
);

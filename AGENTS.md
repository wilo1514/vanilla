# AGENTS.md - The Vanilla Republic Low-AI Growth System

You are the implementation agent for The Vanilla Republic.

## Main Goal

Build a deterministic B2B growth system for The Vanilla Republic using code, decision trees, templates, CRM data, and n8n orchestration.

The system must minimize AI usage. AI may be used during development through Codex, but the runtime system must not depend on OpenAI, Apollo, Hunter, ZeroBounce, or other paid enrichment tools.

## Language Rule

All brand-facing content must be written in English.

This includes:
- Website copy
- Landing page copy
- Email drafts
- Social media drafts
- Buyer messages
- CRM labels
- Form labels
- Technical buyer pages

Spanish may only be used for internal notes if explicitly requested by the owner.

## Runtime Rule

The production automation must be deterministic.

Use:
- Code
- Rules
- Decision trees
- Templates
- CSV imports
- CRM status
- Human approval

Do not use AI calls in normal daily automation unless explicitly enabled.

## Current Assets

Use `source_docs` as the source of truth.

Approved evidence includes:
- Product: Vanilla Tahitensis Beans
- Origin: Ecuador, Naranjal / Guayas
- Brand: The Vanilla Republic
- Operator shown in documents: VANILLA HOLD S.A.S / VANILLA HOLDS S.A.S
- Certification body: Kiwa BCS Oko-Garantie GmbH
- NOP organic addendum under US National Organic Program, 7 CFR Part 205
- EU organic certificate for operator/exporter
- Eurofins report for August 2025 / Harvest 2
- Reported vanillin result for that sample: 8,273 +/- 847 mg/kg
- Production process includes harvest after more than seven months from pollination, washing, sorting, thermal kill step, fermentation, sun drying, shade drying, selection, storage, and lot identification

## Brand Position

The Vanilla Republic offers single-origin Ecuadorian Vanilla Tahitensis beans for professional buyers who evaluate flavor with proof.

Brand signature:
Vanilla. Perfected.

Primary commercial line:
Single-origin Ecuadorian Vanilla Tahitensis beans for buyers who measure flavor with proof.

## Approved Claim Style

Use:
- Single-origin Ecuadorian Vanilla Tahitensis beans
- Estate-grown
- Estate-cured
- Lot-documented
- Certified organic under applicable programs
- Independently analyzed for selected harvests
- Built for professional buyers
- Request the current lot sheet
- Request technical documentation
- Request a sample kit

Vanillin wording:
"Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 +/- 847 mg/kg vanillin."

Do not say:
- All lots have 8,273 mg/kg vanillin
- Guaranteed vanillin level
- Highest vanillin in the world
- Best vanilla in the world
- Superior to Madagascar
- Superior to Tahiti
- Traditional origins average a fraction
- Carbon neutral
- Sustainable without proof
- Medicinal
- Therapeutic
- Health benefits

If a claim is unsupported, mark it:
NEEDS REVIEW

## Buyer Segments

Use these normalized buyer segments:
- extract_house
- flavor_house
- specialty_distributor
- premium_food_manufacturer
- chocolatier
- pastry_chef
- bakery
- luxury_hospitality
- private_label
- gourmet_retail
- unknown

## Automation Rules

Do not send emails automatically at first.
Generate drafts and put them into `pending_approval`.

Do not publish social posts automatically.
Generate drafts and put them into `pending_approval`.

Do not contact anyone if:
- `contact_status` is `do_not_contact`
- `email_status` is `invalid`
- email appears in `suppression_list`
- `unsubscribed` is true
- `bounced` is true
- missing lawful footer data

## Website Rules

The website must be updated for B2B conversion.

Every page must push one of these actions:
- Request Sample Kit
- Request Technical Documentation
- Request Current Lot Sheet
- Book a Buyer Call
- Explore Distribution

## Hostinger Rule

The site will be hosted on Hostinger. Before implementing changes, inspect the current website folder and detect whether it is:
- static HTML/CSS/JS
- WordPress export/theme
- React/Vite
- Next.js
- another framework

Then propose the safest update path for Hostinger.

## Engineering Rules

Use Node.js/TypeScript for deterministic automation.
Use PostgreSQL for CRM storage when available.
Use CSV import/export for easy manual control.
Use Handlebars or simple template interpolation for emails and social posts.
Use n8n as orchestrator, not as the business logic engine.
Business logic belongs in code under `automation/src/rules`.

No hardcoded secrets.
Use `.env` files.
Document every command and every workflow.

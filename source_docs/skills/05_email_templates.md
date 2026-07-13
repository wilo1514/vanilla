@'
# Skill: Email Templates

Emails must be generated using deterministic templates, not AI.

Template selection must use:
- buyer_segment
- contact_role
- priority
- pipeline_stage

Every email must include:
- honest subject
- short body
- clear CTA
- signature
- physical mailing address placeholder
- opt-out line

Footer:
The Vanilla Republic
[Physical Mailing Address]
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.

Do not send automatically.
Generated emails must be saved as pending_approval.

Main CTAs:
- Would it make sense to send you the current lot sheet?
- Would you like to review the technical documentation?
- Should I send the sample kit details?
- Would you be the right person to review this?
'@ | Set-Content -Encoding UTF8 .\skills\05_email_templates.md
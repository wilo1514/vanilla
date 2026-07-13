# Skill: Low-AI Runtime

The system must minimize AI usage.

AI can be used during development through Codex, but the runtime automation must use:
- deterministic code
- decision trees
- templates
- CRM data
- manual approval queues

Do not build runtime features that require OpenAI API calls unless explicitly requested.

Allowed deterministic operations:
- CSV import
- data normalization
- email format validation
- duplicate detection
- segment classification
- lead scoring
- template selection
- draft generation
- approval queue
- status updates
- reporting

Disallowed by default:
- AI-generated emails per contact
- AI social post generation per day
- AI buyer research
- AI enrichment
- automatic outbound sending without approval

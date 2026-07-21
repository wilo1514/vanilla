import fs from "node:fs";
import path from "node:path";

const outDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

function n(id, name, type, position, parameters = {}) {
  return {
    id,
    name,
    type,
    typeVersion: type.includes("httpRequest") ? 4.2 : 1,
    position,
    parameters
  };
}

function sticky(id, name, position, content, width = 340, height = 220) {
  return n(id, name, "n8n-nodes-base.stickyNote", position, { content, width, height, color: 3 });
}

function http(id, name, position, method, path, body = "{}") {
  return n(id, name, "n8n-nodes-base.httpRequest", position, {
    method,
    url: `={{ $env.AUTOMATION_API_URL + '${path}' }}`,
    sendBody: method !== "GET",
    contentType: "json",
    specifyBody: "json",
    jsonBody: body,
    options: { timeout: 120000 }
  });
}

function setNode(id, name, position, values) {
  return n(id, name, "n8n-nodes-base.set", position, {
    keepOnlySet: false,
    values
  });
}

function ifNode(id, name, position, leftValue, operation, rightValue) {
  return n(id, name, "n8n-nodes-base.if", position, {
    conditions: {
      options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
      conditions: [
        {
          id: `${id}-condition`,
          leftValue,
          rightValue,
          operator: { type: typeof rightValue === "number" ? "number" : "string", operation }
        }
      ],
      combinator: "and"
    }
  });
}

function switchNode(id, name, position, rules) {
  return n(id, name, "n8n-nodes-base.switch", position, {
    rules: {
      values: rules.map((rule, index) => ({
        outputKey: rule.outputKey,
        conditions: {
          options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
          conditions: [
            {
              id: `${id}-rule-${index}`,
              leftValue: rule.leftValue,
              rightValue: rule.rightValue,
              operator: { type: rule.type ?? "number", operation: rule.operation }
            }
          ],
          combinator: "and"
        }
      }))
    },
    options: { fallbackOutput: "extra" }
  });
}

function workflow(id, name, nodes, connections) {
  return {
    id,
    name,
    active: false,
    nodes,
    connections,
    settings: {
      executionOrder: "v1",
      saveManualExecutions: true
    },
    tags: [{ name: "Vanilla Republic Local" }, { name: "No Auto Send" }]
  };
}

const buyerImport = workflow(
  "vr-local-buyer-import",
  "Buyer XLSX/CSV Import - Decision Tree",
  [
    sticky("bi-note", "Workflow Rules", [-420, -240],
      "Purpose: import buyer spreadsheets, score contacts, and route only valid email contacts toward draft creation.\n\nNo AI. No Apollo. No Hunter. No ZeroBounce. No automatic email sending.\n\nAutomation API owns deterministic normalization and scoring."),
    n("bi-manual", "Manual Trigger", "n8n-nodes-base.manualTrigger", [-360, 80]),
    http("bi-health", "Preflight: Automation API Health", [-120, 80], "GET", "/health"),
    ifNode("bi-api-ok", "API and PostgreSQL Ready?", [120, 80], "={{ $json.ok }}", "true", true),
    http("bi-import", "Import XLSX Mail Lists", [380, -60], "POST", "/contacts/import", "{}"),
    ifNode("bi-imported", "Any Rows Imported?", [640, -60], "={{ $json.rows_imported || 0 }}", "gt", 0),
    setNode("bi-report", "Import Report Summary", [900, -180], {
      string: [
        { name: "report_type", value: "mail_list_import" },
        { name: "files", value: "={{ ($json.files || []).join(', ') }}" }
      ],
      number: [
        { name: "rows_seen", value: "={{ $json.rows_seen || 0 }}" },
        { name: "rows_imported", value: "={{ $json.rows_imported || 0 }}" },
        { name: "ready_for_draft", value: "={{ $json.ready_for_draft || 0 }}" },
        { name: "needs_manual_review", value: "={{ $json.needs_manual_review || 0 }}" },
        { name: "do_not_contact", value: "={{ $json.do_not_contact || 0 }}" }
      ]
    }),
    switchNode("bi-route", "Route Import Outcome", [1160, -180], [
      { outputKey: "ready_for_draft", leftValue: "={{ $json.ready_for_draft || 0 }}", operation: "gt", rightValue: 0 },
      { outputKey: "manual_review", leftValue: "={{ $json.needs_manual_review || 0 }}", operation: "gt", rightValue: 0 },
      { outputKey: "suppressed", leftValue: "={{ $json.do_not_contact || 0 }}", operation: "gt", rightValue: 0 }
    ]),
    http("bi-score", "Recalculate Lead Priority", [1420, -300], "POST", "/contacts/score", "{}"),
    http("bi-generate", "Generate Drafts: Pending Approval Only", [1680, -300], "POST", "/drafts/generate", "{ \"limit\": 500 }"),
    http("bi-pending", "Read Pending Approval Queue", [1940, -300], "GET", "/drafts/pending"),
    setNode("bi-manual-queue", "Manual Review Queue", [1420, -80], {
      string: [{ name: "next_action", value: "Review contact forms, supplier portals, phones, and website-only records manually." }]
    }),
    setNode("bi-suppression-note", "Suppression Confirmed", [1420, 140], {
      string: [{ name: "next_action", value: "Do not contact suppressed, bounced, unsubscribed, or invalid records." }]
    }),
    setNode("bi-no-import", "No New Import Work", [900, 160], {
      string: [{ name: "next_action", value: "No rows were imported. Check source files or duplicates." }]
    }),
    setNode("bi-api-down", "Stop: API or Database Not Ready", [380, 260], {
      string: [{ name: "next_action", value: "Start Docker stack and verify /health before retrying." }]
    })
  ],
  {
    "Manual Trigger": { main: [[{ node: "Preflight: Automation API Health", type: "main", index: 0 }]] },
    "Preflight: Automation API Health": { main: [[{ node: "API and PostgreSQL Ready?", type: "main", index: 0 }]] },
    "API and PostgreSQL Ready?": { main: [[{ node: "Import XLSX Mail Lists", type: "main", index: 0 }], [{ node: "Stop: API or Database Not Ready", type: "main", index: 0 }]] },
    "Import XLSX Mail Lists": { main: [[{ node: "Any Rows Imported?", type: "main", index: 0 }]] },
    "Any Rows Imported?": { main: [[{ node: "Import Report Summary", type: "main", index: 0 }], [{ node: "No New Import Work", type: "main", index: 0 }]] },
    "Import Report Summary": { main: [[{ node: "Route Import Outcome", type: "main", index: 0 }]] },
    "Route Import Outcome": { main: [[{ node: "Recalculate Lead Priority", type: "main", index: 0 }], [{ node: "Manual Review Queue", type: "main", index: 0 }], [{ node: "Suppression Confirmed", type: "main", index: 0 }], [{ node: "No New Import Work", type: "main", index: 0 }]] },
    "Recalculate Lead Priority": { main: [[{ node: "Generate Drafts: Pending Approval Only", type: "main", index: 0 }]] },
    "Generate Drafts: Pending Approval Only": { main: [[{ node: "Read Pending Approval Queue", type: "main", index: 0 }]] }
  }
);

const generateDrafts = workflow(
  "vr-local-generate-drafts",
  "Generate Outreach Drafts - Approval Gate",
  [
    sticky("gd-note", "Workflow Rules", [-420, -240],
      "Creates email drafts only. It never sends email.\n\nDecision tree: health check -> generate deterministic drafts -> branch by created/skipped -> read approval queue."),
    n("gd-manual", "Manual Trigger", "n8n-nodes-base.manualTrigger", [-360, 80]),
    http("gd-health", "Preflight: Automation API Health", [-120, 80], "GET", "/health"),
    ifNode("gd-api-ok", "API and PostgreSQL Ready?", [120, 80], "={{ $json.ok }}", "true", true),
    http("gd-generate", "Generate Email Drafts", [380, -60], "POST", "/drafts/generate", "{ \"limit\": 500 }"),
    ifNode("gd-created", "New Drafts Created?", [640, -60], "={{ $json.created || 0 }}", "gt", 0),
    http("gd-pending-new", "Read Pending Queue", [900, -180], "GET", "/drafts/pending"),
    ifNode("gd-skipped", "Only Duplicates / No Template?", [900, 80], "={{ $json.skipped || 0 }}", "gt", 0),
    setNode("gd-no-action", "No Draft Action Needed", [1160, 180], {
      string: [{ name: "next_action", value: "No new drafts were created. Review skipped count or import more ready_for_draft contacts." }]
    }),
    setNode("gd-api-down", "Stop: API or Database Not Ready", [380, 260], {
      string: [{ name: "next_action", value: "Start Docker stack and verify /health before retrying." }]
    })
  ],
  {
    "Manual Trigger": { main: [[{ node: "Preflight: Automation API Health", type: "main", index: 0 }]] },
    "Preflight: Automation API Health": { main: [[{ node: "API and PostgreSQL Ready?", type: "main", index: 0 }]] },
    "API and PostgreSQL Ready?": { main: [[{ node: "Generate Email Drafts", type: "main", index: 0 }], [{ node: "Stop: API or Database Not Ready", type: "main", index: 0 }]] },
    "Generate Email Drafts": { main: [[{ node: "New Drafts Created?", type: "main", index: 0 }]] },
    "New Drafts Created?": { main: [[{ node: "Read Pending Queue", type: "main", index: 0 }], [{ node: "Only Duplicates / No Template?", type: "main", index: 0 }]] },
    "Only Duplicates / No Template?": { main: [[{ node: "Read Pending Queue", type: "main", index: 0 }], [{ node: "No Draft Action Needed", type: "main", index: 0 }]] }
  }
);

const exportPending = workflow(
  "vr-local-export-pending",
  "Export Pending Approval - Review Queue",
  [
    sticky("ep-note", "Workflow Rules", [-420, -240],
      "Exports/reads drafts for human review only.\n\nNo automatic approval. No automatic send. Reviewer must approve or reject manually."),
    n("ep-manual", "Manual Trigger", "n8n-nodes-base.manualTrigger", [-360, 80]),
    http("ep-pending", "Read Pending Drafts", [-100, 80], "GET", "/drafts/pending"),
    ifNode("ep-has-drafts", "Pending Drafts Exist?", [160, 80], "={{ ($json.drafts || []).length }}", "gt", 0),
    switchNode("ep-risk", "Human Review Routing", [420, -80], [
      { outputKey: "normal_review", leftValue: "={{ ($json.drafts || []).filter(d => d.risk_status === 'ok').length }}", operation: "gt", rightValue: 0 },
      { outputKey: "claim_review", leftValue: "={{ ($json.drafts || []).filter(d => d.risk_status !== 'ok').length }}", operation: "gt", rightValue: 0 }
    ]),
    setNode("ep-normal", "Queue: Standard Review", [700, -220], {
      string: [{ name: "next_action", value: "Open the exported CSV, review message quality, then approve or reject in API/n8n." }]
    }),
    setNode("ep-claims", "Queue: Claim Guard Review", [700, 0], {
      string: [{ name: "next_action", value: "Review claims_used and risk_status before approval. Do not send automatically." }]
    }),
    setNode("ep-empty", "No Pending Drafts", [420, 220], {
      string: [{ name: "next_action", value: "Generate drafts manually after importing ready_for_draft contacts." }]
    })
  ],
  {
    "Manual Trigger": { main: [[{ node: "Read Pending Drafts", type: "main", index: 0 }]] },
    "Read Pending Drafts": { main: [[{ node: "Pending Drafts Exist?", type: "main", index: 0 }]] },
    "Pending Drafts Exist?": { main: [[{ node: "Human Review Routing", type: "main", index: 0 }], [{ node: "No Pending Drafts", type: "main", index: 0 }]] },
    "Human Review Routing": { main: [[{ node: "Queue: Standard Review", type: "main", index: 0 }], [{ node: "Queue: Claim Guard Review", type: "main", index: 0 }]] }
  }
);

const sampleRequest = workflow(
  "vr-local-sample-request",
  "Sample Request Webhook - Lead Intake",
  [
    sticky("sr-note", "Workflow Rules", [-520, -260],
      "Receives landing form payloads and forwards them to the deterministic API.\n\nAPI normalizes lead, scores it, saves account/contact/sample_request, and creates a new task.\n\nNo outreach is generated automatically."),
    n("sr-webhook", "Webhook: Sample Request", "n8n-nodes-base.webhook", [-460, 80], {
      httpMethod: "POST",
      path: "vanilla/sample-request",
      responseMode: "responseNode",
      options: {}
    }),
    ifNode("sr-consent", "Consent Is True?", [-200, 80], "={{ $json.body?.consent_to_contact === true }}", "true", true),
    ifNode("sr-email", "Email Format Present?", [60, -80], "={{ /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test($json.body?.email || '') }}", "true", true),
    http("sr-save", "Save Lead in Automation API", [340, -160], "POST", "/webhooks/sample-request", "={{ JSON.stringify($json.body || {}) }}"),
    ifNode("sr-saved", "Lead Saved?", [620, -160], "={{ $json.ok }}", "true", true),
    n("sr-response-ok", "Respond: Received", "n8n-nodes-base.respondToWebhook", [900, -260], {
      respondWith: "json",
      responseBody: "={{ { ok: true, message: $json.message, lead_id: $json.lead_id } }}"
    }),
    n("sr-response-api-error", "Respond: API Error", "n8n-nodes-base.respondToWebhook", [900, -40], {
      respondWith: "json",
      responseCode: 503,
      responseBody: "={{ { ok: false, message: 'Automation API could not save the lead.' } }}"
    }),
    n("sr-response-validation", "Respond: Validation Error", "n8n-nodes-base.respondToWebhook", [340, 200], {
      respondWith: "json",
      responseCode: 400,
      responseBody: "={{ { ok: false, message: 'Required fields are missing or invalid.' } }}"
    })
  ],
  {
    "Webhook: Sample Request": { main: [[{ node: "Consent Is True?", type: "main", index: 0 }]] },
    "Consent Is True?": { main: [[{ node: "Email Format Present?", type: "main", index: 0 }], [{ node: "Respond: Validation Error", type: "main", index: 0 }]] },
    "Email Format Present?": { main: [[{ node: "Save Lead in Automation API", type: "main", index: 0 }], [{ node: "Respond: Validation Error", type: "main", index: 0 }]] },
    "Save Lead in Automation API": { main: [[{ node: "Lead Saved?", type: "main", index: 0 }]] },
    "Lead Saved?": { main: [[{ node: "Respond: Received", type: "main", index: 0 }], [{ node: "Respond: API Error", type: "main", index: 0 }]] }
  }
);

const unsubscribe = workflow(
  "vr-local-unsubscribe",
  "Unsubscribe Handler - Suppression Tree",
  [
    sticky("un-note", "Workflow Rules", [-520, -240],
      "Adds email to suppression list and marks contacts do_not_contact.\n\nNo outbound messages. Use for local webhook tests or manual pasted unsubscribe events."),
    n("un-webhook", "Webhook: Unsubscribe", "n8n-nodes-base.webhook", [-460, 80], {
      httpMethod: "POST",
      path: "vanilla/unsubscribe",
      responseMode: "responseNode",
      options: {}
    }),
    ifNode("un-email", "Valid Email Present?", [-200, 80], "={{ /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test($json.body?.email || '') }}", "true", true),
    http("un-save", "Write Suppression: Unsubscribe", [80, -80], "POST", "/suppression/unsubscribe", "={{ JSON.stringify({ email: $json.body.email, source: $json.body.source || 'n8n_local_unsubscribe' }) }}"),
    n("un-ok", "Respond: Suppressed", "n8n-nodes-base.respondToWebhook", [360, -80], {
      respondWith: "json",
      responseBody: "={{ { ok: true, reason: 'unsubscribe', email: $json.email } }}"
    }),
    n("un-bad", "Respond: Invalid Email", "n8n-nodes-base.respondToWebhook", [80, 200], {
      respondWith: "json",
      responseCode: 400,
      responseBody: "={{ { ok: false, message: 'Valid email is required.' } }}"
    })
  ],
  {
    "Webhook: Unsubscribe": { main: [[{ node: "Valid Email Present?", type: "main", index: 0 }]] },
    "Valid Email Present?": { main: [[{ node: "Write Suppression: Unsubscribe", type: "main", index: 0 }], [{ node: "Respond: Invalid Email", type: "main", index: 0 }]] },
    "Write Suppression: Unsubscribe": { main: [[{ node: "Respond: Suppressed", type: "main", index: 0 }]] }
  }
);

const bounceImport = workflow(
  "vr-local-bounce-import",
  "Bounce Import - Suppression Tree",
  [
    sticky("bo-note", "Workflow Rules", [-520, -240],
      "Imports bounced emails into suppression.\n\nManual/local only. No deliverability verification claim. No ZeroBounce."),
    n("bo-manual", "Manual Trigger", "n8n-nodes-base.manualTrigger", [-460, 80]),
    setNode("bo-input", "Paste Bounce Email Here", [-220, 80], {
      string: [
        { name: "email", value: "bounce-simulation@example.com" },
        { name: "source", value: "n8n_local_bounce_simulation" }
      ]
    }),
    ifNode("bo-email", "Valid Email Present?", [40, 80], "={{ /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test($json.email || '') }}", "true", true),
    http("bo-save", "Write Suppression: Bounce", [320, -80], "POST", "/suppression/bounce", "={{ JSON.stringify({ email: $json.email, source: $json.source }) }}"),
    setNode("bo-ok", "Bounce Suppressed", [600, -80], {
      string: [{ name: "next_action", value: "Contact is marked do_not_contact. Do not generate or send outreach." }]
    }),
    setNode("bo-invalid", "Invalid Bounce Record", [320, 200], {
      string: [{ name: "next_action", value: "Fix the bounce input email format before importing." }]
    })
  ],
  {
    "Manual Trigger": { main: [[{ node: "Paste Bounce Email Here", type: "main", index: 0 }]] },
    "Paste Bounce Email Here": { main: [[{ node: "Valid Email Present?", type: "main", index: 0 }]] },
    "Valid Email Present?": { main: [[{ node: "Write Suppression: Bounce", type: "main", index: 0 }], [{ node: "Invalid Bounce Record", type: "main", index: 0 }]] },
    "Write Suppression: Bounce": { main: [[{ node: "Bounce Suppressed", type: "main", index: 0 }]] }
  }
);

const testEmail = workflow(
  "vr-local-test-email-draft",
  "Manual Test Email Draft - Approval Only",
  [
    sticky("te-note", "Workflow Rules", [-520, -240],
      "Manual local email ecosystem test.\n\nCreates a pending approval draft for a controlled test inbox and records a controlled reply-to inbox.\n\nNo SMTP. No Gmail API. No automatic sending."),
    n("te-manual", "Manual Trigger", "n8n-nodes-base.manualTrigger", [-460, 80]),
    setNode("te-config", "Test Recipient Settings", [-220, 80], {
      string: [
        { name: "recipient", value: "your-test-recipient@example.com" },
        { name: "reply_to", value: "your-reply-to@example.com" }
      ]
    }),
    ifNode("te-email", "Recipient and Reply-To Valid?", [40, 80], "={{ /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test($json.recipient || '') && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test($json.reply_to || '') }}", "true", true),
    http("te-create", "Create Pending Test Draft", [320, -80], "POST", "/drafts/test-email", "={{ JSON.stringify({ recipient: $json.recipient, reply_to: $json.reply_to }) }}"),
    ifNode("te-created", "Draft Created?", [600, -80], "={{ $json.ok }}", "true", true),
    http("te-pending", "Read Pending Approval Queue", [880, -180], "GET", "/drafts/pending"),
    setNode("te-error", "Stop: Test Draft Failed", [880, 40], {
      string: [{ name: "next_action", value: "Check automation API health and PostgreSQL before retrying." }]
    }),
    setNode("te-invalid", "Stop: Invalid Test Email Settings", [320, 200], {
      string: [{ name: "next_action", value: "Use valid recipient and reply-to email addresses." }]
    })
  ],
  {
    "Manual Trigger": { main: [[{ node: "Test Recipient Settings", type: "main", index: 0 }]] },
    "Test Recipient Settings": { main: [[{ node: "Recipient and Reply-To Valid?", type: "main", index: 0 }]] },
    "Recipient and Reply-To Valid?": { main: [[{ node: "Create Pending Test Draft", type: "main", index: 0 }], [{ node: "Stop: Invalid Test Email Settings", type: "main", index: 0 }]] },
    "Create Pending Test Draft": { main: [[{ node: "Draft Created?", type: "main", index: 0 }]] },
    "Draft Created?": { main: [[{ node: "Read Pending Approval Queue", type: "main", index: 0 }], [{ node: "Stop: Test Draft Failed", type: "main", index: 0 }]] }
  }
);

const workflows = [
  ["01-buyer-import.json", buyerImport],
  ["02-generate-outreach-drafts.json", generateDrafts],
  ["03-export-pending-approval.json", exportPending],
  ["04-sample-request-webhook.json", sampleRequest],
  ["05-unsubscribe-handler.json", unsubscribe],
  ["06-bounce-import.json", bounceImport],
  ["07-manual-test-email-draft.json", testEmail]
];

for (const [file, data] of workflows) {
  fs.writeFileSync(path.join(outDir, file), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log(`Wrote ${workflows.length} deterministic n8n workflows.`);

import fs from "node:fs";
import path from "node:path";

function copyDirIfExists(source, target) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true });
  }
}

const emailTemplates = {
  "extract_house_intro.hbs": `Subject: Ecuadorian Vanilla Tahitensis beans for extraction review

Hello {{contactGreeting}},

I am reaching out from The Vanilla Republic, an Ecuadorian producer of single-origin Vanilla Tahitensis beans.

We work with professional buyers who need lot-documented beans for extraction, formulation, and technical review. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Would you like to review the current lot sheet and technical documentation?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "flavor_house_intro.hbs": `Subject: Single-origin Ecuador vanilla for flavor development

Hello {{contactGreeting}},

The Vanilla Republic offers single-origin Ecuadorian Vanilla Tahitensis beans for professional buyers evaluating natural vanilla options with documentation.

For selected harvests, we provide lot documentation and independent analysis. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Would it make sense to send you the current lot sheet?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "distributor_intro.hbs": `Subject: Ecuadorian Vanilla Tahitensis beans for specialty distribution

Hello {{contactGreeting}},

I am contacting you from The Vanilla Republic. We produce estate-grown and estate-cured Ecuadorian Vanilla Tahitensis beans for professional buyers and specialty channels.

Our beans are lot-documented, and selected harvests are independently analyzed. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Should I send the sample kit details for your review?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "manufacturer_intro.hbs": `Subject: Lot-documented Ecuador vanilla for product teams

Hello {{contactGreeting}},

The Vanilla Republic grows, cures, sorts, and documents single-origin Ecuadorian Vanilla Tahitensis beans for professional buyers.

For manufacturers, we can share current lot information, technical documentation, and sample kit details before any commercial discussion. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Would you be the right person to review this?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "chef_chocolatier_intro.hbs": `Subject: Single-origin Ecuadorian Vanilla Tahitensis beans

Hello {{contactGreeting}},

The Vanilla Republic offers estate-grown and estate-cured Ecuadorian Vanilla Tahitensis beans for professional culinary buyers.

Our current buyer materials include lot documentation and technical details. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Should I send the sample kit details?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "followup_technical_docs.hbs": `Subject: Technical documentation for Ecuadorian Vanilla Tahitensis beans

Hello {{contactGreeting}},

Following up with a concise technical route for The Vanilla Republic.

We can provide the current lot sheet, available certification documentation, and selected harvest analysis for our single-origin Ecuadorian Vanilla Tahitensis beans. Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 \u00b1 847 mg/kg vanillin.

Would you like to review the technical documentation?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`,
  "breakup_permission.hbs": `Subject: Should I close the loop?

Hello {{contactGreeting}},

I do not want to send irrelevant follow-up.

The Vanilla Republic offers single-origin Ecuadorian Vanilla Tahitensis beans for professional buyers who evaluate flavor with proof. If this is relevant, I can send the current lot sheet or sample kit details.

Should I close the loop, or is there a better person to contact?

Best regards,
The Vanilla Republic
{{physicalMailingAddress}}
If you prefer not to receive further messages from us, reply "unsubscribe" and we will remove you from future outreach.
`
};

function writeEmailTemplates(targetRoot) {
  const target = path.join(targetRoot, "src", "templates", "emails");
  fs.mkdirSync(target, { recursive: true });
  for (const [filename, content] of Object.entries(emailTemplates)) {
    fs.writeFileSync(path.join(target, filename), content, "utf8");
  }
}

const distServer = path.join(process.cwd(), "dist", "hostinger", "server.js");
if (!fs.existsSync(distServer)) {
  throw new Error("Expected dist/hostinger/server.js after TypeScript build.");
}

const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });

const publicIndex = path.join(publicDir, "index.html");
if (!fs.existsSync(publicIndex)) {
  fs.writeFileSync(
    publicIndex,
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>The Vanilla Republic API</title></head><body>The Vanilla Republic API is running.</body></html>\n"
  );
}

fs.writeFileSync(path.join(process.cwd(), "dist", "app.js"), "import \"./hostinger/server.js\";\n");
fs.copyFileSync(path.join(process.cwd(), "package.json"), path.join(process.cwd(), "dist", "package.json"));
fs.copyFileSync(path.join(process.cwd(), "package-lock.json"), path.join(process.cwd(), "dist", "package-lock.json"));
writeEmailTemplates(path.join(process.cwd(), "dist"));
copyDirIfExists(path.join(process.cwd(), "src", "hostinger"), path.join(process.cwd(), "dist", "src", "hostinger"));
copyDirIfExists(path.join(process.cwd(), "mail_list"), path.join(process.cwd(), "dist", "mail_list"));
copyDirIfExists(path.join(process.cwd(), "..", "mail_list"), path.join(process.cwd(), "dist", "mail_list"));
fs.writeFileSync(
  path.join(process.cwd(), "dist", ".htaccess"),
  [
    "PassengerEnabled on",
    "PassengerAppType node",
    "PassengerStartupFile app.js",
    "PassengerAppRoot /home/u871072566/domains/lemonchiffon-goat-232287.hostingersite.com/public_html",
    "PassengerNodejs /opt/alt/alt-nodejs22/root/usr/bin/node",
    "",
    "RewriteEngine On",
    "RewriteRule ^\\.builds - [F,L]",
    ""
  ].join("\n")
);

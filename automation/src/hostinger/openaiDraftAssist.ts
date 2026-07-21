import OpenAI from "openai";

export async function maybeRefineDraftWithOpenAI(input: { subject: string; body: string; companyName: string }) {
  if (process.env.ENABLE_OPENAI_DRAFT_ASSIST !== "true" || !process.env.OPENAI_API_KEY) {
    return input;
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_DRAFT_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You refine B2B email drafts for The Vanilla Republic. Keep all brand-facing content in English. Do not invent claims. Do not claim every lot has the Eurofins result. Use only the approved wording when mentioning vanillin: Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin. Avoid highest, best, guaranteed, superior-to-origin, carbon-neutral, health, medicinal, or therapeutic claims. Return JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Lightly improve clarity and professionalism. Keep the same commercial intent. Return subject and body.",
          companyName: input.companyName,
          subject: input.subject,
          body: input.body
        })
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "draft_refinement",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            subject: { type: "string" },
            body: { type: "string" }
          },
          required: ["subject", "body"]
        }
      }
    }
  });
  const parsed = JSON.parse(response.output_text) as { subject: string; body: string };
  return {
    subject: parsed.subject.trim(),
    body: parsed.body.trim()
  };
}

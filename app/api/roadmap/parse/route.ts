import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a product management assistant. Parse raw backlog text into structured JSON.
Infer effort, description, and category from context clues.
Respond ONLY with valid JSON — no markdown, no preamble.`;

const RequestSchema = z.object({
  rawText: z.string().min(1).max(20000),
});

const EFFORT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const CATEGORIES = [
  "Growth",
  "Retention",
  "Infrastructure",
  "Debt",
  "Compliance",
  "Delight",
] as const;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Parse the following backlog text into structured items. Return up to 200 items.

Raw text:
${parsed.data.rawText}

Return a JSON object with this exact shape:
{
  "items": [
    {
      "name": "<concise item name>",
      "description": "<1 sentence description, or null>",
      "effort": ${JSON.stringify(EFFORT_SIZES)} | null,
      "categoryTag": ${JSON.stringify(CATEGORIES)} | null
    }
  ]
}

Rules:
- One item per distinct feature/initiative
- Infer effort from words like "small", "large", "quick", "complex"
- Infer category from context (e.g. "auth" → Infrastructure, "onboarding" → Retention)
- If unsure, set effort and categoryTag to null`,
        },
      ],
    });

    const text =
      response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("") ?? "";

    let parsed_json: { items: Array<{ name: string; description?: string; effort?: string; categoryTag?: string }> };
    try {
      parsed_json = JSON.parse(text);
    } catch {
      return Response.json({ error: "Failed to parse AI response as JSON" }, { status: 500 });
    }

    const items = (parsed_json.items ?? []).map((item) => ({
      id: nanoid(),
      name: item.name,
      description: item.description ?? undefined,
      effort: EFFORT_SIZES.includes(item.effort as typeof EFFORT_SIZES[number])
        ? (item.effort as typeof EFFORT_SIZES[number])
        : undefined,
      categoryTag: CATEGORIES.includes(item.categoryTag as typeof CATEGORIES[number])
        ? (item.categoryTag as typeof CATEGORIES[number])
        : undefined,
    }));

    return Response.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Parse failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

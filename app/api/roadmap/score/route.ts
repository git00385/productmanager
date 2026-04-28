import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a senior product strategist with deep expertise in product prioritization frameworks including RICE, ICE, MoSCoW, Weighted Scoring, Opportunity Scoring, and Value vs Effort matrices. You give precise, opinionated, data-grounded prioritization recommendations. You always explain your reasoning concisely. You respond only in valid JSON — no markdown, no preamble.`;

const BacklogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  effort: z.enum(["XS", "S", "M", "L", "XL"]).optional(),
  categoryTag: z
    .enum(["Growth", "Retention", "Infrastructure", "Debt", "Compliance", "Delight"])
    .optional(),
});

const RequestSchema = z.object({
  items: z.array(BacklogItemSchema).min(1).max(200),
  businessGoal: z.enum([
    "Grow Revenue",
    "Improve Retention",
    "Reduce Churn",
    "Expand Market",
    "Reduce Costs",
    "Improve NPS",
    "Regulatory Compliance",
  ]),
  secondaryGoals: z
    .array(
      z.enum([
        "Grow Revenue",
        "Improve Retention",
        "Reduce Churn",
        "Expand Market",
        "Reduce Costs",
        "Improve NPS",
        "Regulatory Compliance",
      ])
    )
    .default([]),
  capacity: z.object({
    engineers: z.number().int().min(1).max(100),
    weeks: z.number().int().min(1).max(52),
  }),
  timeHorizon: z.enum(["Next Sprint", "Next Quarter", "Next 6 Months", "Next Year"]),
  framework: z.enum([
    "RICE",
    "ICE",
    "MoSCoW",
    "Weighted Scoring",
    "Opportunity Scoring",
    "Value vs Effort",
  ]),
  strategicContext: z.string().optional(),
  constraints: z.string().optional(),
});

function buildPrompt(input: z.infer<typeof RequestSchema>): string {
  const itemsList = input.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name}${item.description ? ": " + item.description : ""}${item.effort ? " [Effort: " + item.effort + "]" : ""}`
    )
    .join("\n");

  return `Score and prioritize this product backlog using the ${input.framework} framework.

Business context:
- Primary goal: ${input.businessGoal}
- Secondary goals: ${input.secondaryGoals.length ? input.secondaryGoals.join(", ") : "None"}
- Team capacity: ${input.capacity.engineers} engineers for ${input.capacity.weeks} weeks
- Time horizon: ${input.timeHorizon}
- Strategic context: ${input.strategicContext || "None provided"}
- Constraints: ${input.constraints || "None provided"}

Backlog items:
${itemsList}

Return a JSON object with this exact shape:
{
  "rankedItems": [
    {
      "id": "<original item id>",
      "score": <number 1-100>,
      "rank": <number starting at 1>,
      "tier": "Must Have" | "Should Have" | "Could Have" | "Won't Have",
      "frameworkScores": { "<criterion>": <value> },
      "reasoning": "<2-3 sentence explanation>",
      "suggestedQuarter": "Q1" | "Q2" | "Q3" | "Q4" | "Backlog",
      "categoryTag": "Growth" | "Retention" | "Infrastructure" | "Debt" | "Compliance" | "Delight",
      "risks": "<one sentence on key risk or dependency>",
      "fitForCapacity": true | false
    }
  ],
  "summary": "<3-4 sentence executive summary of the prioritization>",
  "strategicWarnings": ["<warning 1>", "<warning 2>"],
  "capacityAlert": "<null or a message if backlog significantly exceeds capacity>",
  "topRecommendation": "<the single most important thing to build next and why>"
}`;
}

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
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt(parsed.data) }],
        });

        let fullText = "";
        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
          }
        }

        const finalMessage = await anthropicStream.finalMessage();
        console.log(
          `[roadmap/score] tokens — input: ${finalMessage.usage.input_tokens}, output: ${finalMessage.usage.output_tokens}`
        );

        // Validate and enrich with original item data before sending
        let result: Record<string, unknown>;
        try {
          result = JSON.parse(fullText);
        } catch {
          throw new Error("AI returned invalid JSON");
        }

        // Merge original item fields back into scored items
        const itemMap = new Map(parsed.data.items.map((i) => [i.id, i]));
        if (Array.isArray(result.rankedItems)) {
          result.rankedItems = (result.rankedItems as Array<Record<string, unknown>>).map((scored) => {
            const original = itemMap.get(scored.id as string);
            return {
              ...original,
              ...scored,
              // Preserve original effort if AI didn't set one
              effort: scored.effort ?? original?.effort,
            };
          });
        }

        controller.enqueue(encoder.encode(JSON.stringify(result)));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Scoring failed";
        controller.enqueue(
          encoder.encode(JSON.stringify({ error: message }))
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Accel-Buffering": "no",
      "Cache-Control": "no-cache",
    },
  });
}

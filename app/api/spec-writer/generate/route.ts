import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are an expert Product Manager with 10+ years of experience at top-tier tech companies. You write exceptionally clear, structured, and actionable Product Requirements Documents. Your specs are known for being thorough yet concise, always tying features back to user needs and business outcomes. You write in markdown format. You never use filler phrases. Every sentence earns its place.`;

const RequestSchema = z.object({
  featureIdea: z.string().min(20, "Feature idea must be at least 20 characters"),
  productContext: z.string().optional(),
  targetUsers: z.string().optional(),
  scope: z.enum(["Full PRD", "One-Pager", "User Stories Only", "Technical Spec"]),
  tone: z.enum(["Professional", "Concise", "Detailed", "Engineering-focused"]),
  sections: z
    .array(
      z.enum([
        "Problem Statement",
        "Goals & Success Metrics",
        "User Stories",
        "Functional Requirements",
        "Non-Functional Requirements",
        "Out of Scope",
        "Open Questions",
        "Timeline & Milestones",
        "Stakeholder Map",
      ])
    )
    .min(1, "Select at least one section"),
});

function buildUserPrompt(input: z.infer<typeof RequestSchema>): string {
  const sectionList = input.sections.map((s) => `- ${s}`).join("\n");
  return `Write a ${input.scope} for the following feature idea.

Tone: ${input.tone}
Target users: ${input.targetUsers ?? "not specified"}
Product context: ${input.productContext ?? "not provided"}

Feature idea:
${input.featureIdea}

Include the following sections (and only these sections):
${sectionList}

Format each section with a clear ## heading. Use bullet points, tables, and numbered lists where appropriate. End with a brief "Open Questions" section if not already included. Output only the PRD — no preamble, no meta-commentary.`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
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
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildUserPrompt(parsed.data) }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const finalMessage = await anthropicStream.finalMessage();
        const usage = finalMessage.usage;
        console.log(
          `[spec-writer] tokens — input: ${usage.input_tokens}, output: ${usage.output_tokens}`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(encoder.encode(`\n\n[ERROR]: ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Accel-Buffering": "no",
      "Cache-Control": "no-cache",
    },
  });
}

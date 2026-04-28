import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a senior product strategist who just completed a detailed prioritization analysis of a product backlog. You have deep expertise in product frameworks including RICE, ICE, MoSCoW, and Opportunity Scoring. Answer questions about the roadmap with precision and confidence. Be concise but thorough. Use markdown formatting.`;

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const RequestSchema = z.object({
  roadmapContext: z.string(),
  question: z.string().min(1).max(2000),
  history: z.array(ChatMessageSchema).default([]),
});

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

  const { roadmapContext, question, history } = parsed.data;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Here is the full roadmap prioritization context:\n\n${roadmapContext}\n\nPlease keep this context in mind for all follow-up questions.`,
    },
    {
      role: "assistant",
      content:
        "Understood. I have reviewed the full prioritization analysis. I'm ready to answer any follow-up questions about the roadmap, individual items, trade-offs, or strategic considerations.",
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: question,
    },
  ];

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Chat failed";
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

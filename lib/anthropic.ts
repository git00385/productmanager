import Anthropic from "@anthropic-ai/sdk";
import { withRetry } from "./utils";

const MODEL = "claude-sonnet-4-20250514" as const;

/** Lazily-initialised Anthropic client (server-only). */
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface ClaudeOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Single-turn Claude call. Returns the assistant text and token counts.
 * Automatically retries transient errors up to 3 times.
 */
export async function callClaude(
  prompt: string,
  systemPrompt: string,
  options: ClaudeOptions = {}
): Promise<ClaudeResult> {
  const client = getClient();

  const response = await withRetry(() =>
    client.messages.create({
      model: MODEL,
      max_tokens: options.maxTokens ?? 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    })
  );

  const content =
    response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("") ?? "";

  return {
    content,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

/**
 * Streaming Claude call. Yields text chunks as they arrive.
 * Use in API route handlers with a ReadableStream response.
 */
export async function callClaudeStream(
  prompt: string,
  systemPrompt: string,
  options: ClaudeOptions = {}
): Promise<ReadableStream<string>> {
  const client = getClient();

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: options.maxTokens ?? 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  return new ReadableStream<string>({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(event.delta.text);
        }
      }
      controller.close();
    },
  });
}

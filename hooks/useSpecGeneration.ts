"use client";

import { useState, useRef, useCallback } from "react";
import type { SpecInput } from "@/types/spec-writer";

type GenerationStatus = "idle" | "streaming" | "done" | "error";

interface UseSpecGenerationReturn {
  content: string;
  status: GenerationStatus;
  error: string | null;
  generate: (input: SpecInput) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

/**
 * Handles the streaming fetch to /api/spec-writer/generate.
 * Exposes content as it streams in, an abort handle, and status flags.
 */
export function useSpecGeneration(): UseSpecGenerationReturn {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (input: SpecInput) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setContent("");
    setError(null);
    setStatus("streaming");

    try {
      const response = await fetch("/api/spec-writer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setContent((prev) => prev + chunk);
      }

      setStatus("done");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User stopped — leave content as-is, return to idle
        setStatus("idle");
        return;
      }
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setContent("");
    setError(null);
    setStatus("idle");
  }, []);

  return { content, status, error, generate, stop, reset };
}

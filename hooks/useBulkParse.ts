"use client";

import { useState, useCallback } from "react";
import type { BacklogItem } from "@/types/roadmap";

type ParseStatus = "idle" | "parsing" | "done" | "error";

interface UseBulkParseReturn {
  status: ParseStatus;
  error: string | null;
  parse: (rawText: string) => Promise<BacklogItem[]>;
  reset: () => void;
}

export function useBulkParse(): UseBulkParseReturn {
  const [status, setStatus] = useState<ParseStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback(async (rawText: string): Promise<BacklogItem[]> => {
    setStatus("parsing");
    setError(null);

    try {
      const response = await fetch("/api/roadmap/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const data = (await response.json()) as { items?: BacklogItem[]; error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${response.status}`);
      }

      setStatus("done");
      return data.items ?? [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Parse failed";
      setError(message);
      setStatus("error");
      return [];
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, parse, reset };
}

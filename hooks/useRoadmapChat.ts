"use client";

import { useState, useRef, useCallback } from "react";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";

type ChatStatus = "idle" | "streaming" | "error";

interface UseRoadmapChatReturn {
  status: ChatStatus;
  error: string | null;
  send: (question: string) => Promise<void>;
  stop: () => void;
}

export function useRoadmapChat(): UseRoadmapChatReturn {
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { scoredItems, summary, topRecommendation, chatHistory, addChatMessage, updateLastChatMessage } =
    useRoadmapStore();

  const send = useCallback(
    async (question: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setStatus("streaming");

      addChatMessage({ role: "user", content: question, timestamp: new Date() });
      addChatMessage({ role: "assistant", content: "", timestamp: new Date() });

      const roadmapContext = JSON.stringify({
        summary,
        topRecommendation,
        rankedItems: scoredItems,
      });

      const historyForApi = chatHistory.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const response = await fetch("/api/roadmap/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roadmapContext,
            question,
            history: historyForApi,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = (await response.json()) as { error?: string };
          throw new Error(err.error ?? `HTTP ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          updateLastChatMessage(accumulated);
        }

        setStatus("idle");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setStatus("idle");
          return;
        }
        const message = err instanceof Error ? err.message : "Chat failed";
        setError(message);
        setStatus("error");
        updateLastChatMessage(`Error: ${message}`);
      }
    },
    [scoredItems, summary, topRecommendation, chatHistory, addChatMessage, updateLastChatMessage]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, []);

  return { status, error, send, stop };
}

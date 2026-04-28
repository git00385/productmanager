"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { useRoadmapChat } from "@/hooks/useRoadmapChat";

export function RoadmapChat() {
  const { chatHistory } = useRoadmapStore();
  const { send, stop, status } = useRoadmapChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isStreaming = status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  function handleSend() {
    const q = input.trim();
    if (!q || isStreaming) return;
    setInput("");
    send(q);
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
        <MessageSquare className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">Dig Deeper</p>
        <p className="text-xs text-muted-foreground ml-1">Ask follow-up questions about your roadmap</p>
      </div>

      {/* Message list */}
      {chatHistory.length > 0 && (
        <div className="max-h-96 overflow-y-auto px-4 py-3 space-y-4">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">AI</span>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/40 prose prose-sm prose-invert max-w-none"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content || "…"}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 px-4 py-3 border-t border-border bg-background/50">
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder='E.g. "Why is the mobile app ranked so low?" or "What if we doubled capacity?"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button type="button" variant="outline" size="icon" onClick={stop}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

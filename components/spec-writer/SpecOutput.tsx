"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SpecActionBar } from "./SpecActionBar";
import { cn } from "@/lib/utils";

interface SpecOutputProps {
  content: string;
  isStreaming: boolean;
  onSave: (title: string) => Promise<void>;
  onRegenerate: () => void;
  isSaved: boolean;
  savedAt: Date | null;
  className?: string;
}

/** Right-pane PRD output — handles empty, streaming, and generated states. */
export function SpecOutput({
  content,
  isStreaming,
  onSave,
  onRegenerate,
  isSaved,
  savedAt,
  className,
}: SpecOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Untitled Spec");
  const [isSaving, setIsSaving] = useState(false);
  const hasContent = content.length > 0;

  // Auto-scroll to top when new content arrives after streaming starts
  useEffect(() => {
    if (isStreaming && content.length < 50) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isStreaming, content.length]);

  // Infer title from the first # heading in the content
  useEffect(() => {
    if (!hasContent) return;
    const match = content.match(/^#\s+(.+)$/m);
    if (match?.[1]) setTitle(match[1].trim());
  }, [content, hasContent]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(title);
    } finally {
      setIsSaving(false);
    }
  }

  // Empty state
  if (!hasContent && !isStreaming) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full text-center p-8 print:hidden", className)}>
        <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-base font-medium text-muted-foreground">Your spec will appear here.</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Fill in the details and hit Generate.</p>
      </div>
    );
  }

  // Skeleton loading state (first ~500ms before content starts)
  if (isStreaming && content.length === 0) {
    return (
      <div className={cn("p-6 space-y-4", className)}>
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <div className="pt-2 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="pt-2 space-y-2">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border shrink-0 print:hidden">
        {/* Inline title edit */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="flex-1 bg-transparent text-sm font-semibold text-foreground focus:outline-none focus:ring-0 truncate"
          aria-label="Document title"
        />

        <div className="flex items-center gap-2 shrink-0">
          {isStreaming && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating…
            </Badge>
          )}
          <SpecActionBar
            content={content}
            title={title}
            isSaved={isSaved}
            savedAt={savedAt}
            isSaving={isSaving}
            onSave={handleSave}
            onRegenerate={onRegenerate}
          />
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5 print:overflow-visible print:px-0 print:py-0"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 mt-0 text-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold mt-7 mb-3 text-foreground pl-3 border-l-2 border-primary">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold mt-4 mb-2 text-foreground">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-foreground/90 leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-3 space-y-1 text-sm text-foreground/90">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm text-foreground/90">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="text-left px-3 py-2 bg-secondary text-xs font-semibold text-foreground border border-border">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-sm text-foreground/90 border border-border">{children}</td>
            ),
            code: ({ children, className: codeClass }) => {
              const isBlock = codeClass?.startsWith("language-");
              return isBlock ? (
                <code className="block bg-secondary rounded-lg px-4 py-3 text-xs font-mono text-foreground overflow-x-auto mb-3">
                  {children}
                </code>
              ) : (
                <code className="bg-secondary rounded px-1.5 py-0.5 text-xs font-mono text-foreground">
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-primary pl-4 text-sm text-muted-foreground italic mb-3">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="border-border my-5" />,
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-0.5" />
        )}
      </div>

      {/* Print styles injected inline to keep file self-contained */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; color: black; }
        }
      `}</style>
    </div>
  );
}

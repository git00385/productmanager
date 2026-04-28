"use client";

import { useState } from "react";
import { Copy, Download, FileText, Save, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SpecActionBarProps {
  content: string;
  title: string;
  isSaved: boolean;
  savedAt: Date | null;
  isSaving: boolean;
  onSave: () => void;
  onRegenerate: () => void;
  className?: string;
}

/** Floating action toolbar shown above the generated spec. */
export function SpecActionBar({
  content,
  title,
  isSaved,
  savedAt,
  isSaving,
  onSave,
  onRegenerate,
  className,
}: SpecActionBarProps) {
  const [copied, setCopied] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportMd() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    window.print();
  }

  function handleRegenerateClick() {
    if (isSaved) {
      setShowRegenConfirm(true);
    } else {
      onRegenerate();
    }
  }

  return (
    <>
      <div className={cn("flex items-center gap-2 flex-wrap print:hidden", className)}>
        {isSaved && savedAt && (
          <Badge variant="success" className="text-xs mr-1">
            <Check className="h-3 w-3 mr-1" />
            Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        )}

        <Button size="sm" variant="ghost" onClick={handleCopy} title="Copy markdown">
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1.5 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>

        <Button size="sm" variant="ghost" onClick={handleExportMd} title="Export Markdown">
          <FileText className="h-3.5 w-3.5" />
          <span className="ml-1.5 text-xs">Export MD</span>
        </Button>

        <Button size="sm" variant="ghost" onClick={handleExportPdf} title="Export PDF">
          <Download className="h-3.5 w-3.5" />
          <span className="ml-1.5 text-xs">Export PDF</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onSave}
          disabled={isSaving}
          title="Save to workspace"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="ml-1.5 text-xs">{isSaving ? "Saving…" : "Save"}</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleRegenerateClick}
          title="Regenerate"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="ml-1.5 text-xs">Regenerate</span>
        </Button>
      </div>

      {/* Regenerate confirmation modal */}
      {showRegenConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl space-y-4">
            <h3 className="font-semibold text-foreground">Regenerate spec?</h3>
            <p className="text-sm text-muted-foreground">
              This will replace the current output. Your saved version in history won't be affected.
            </p>
            <div className="flex gap-3 justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowRegenConfirm(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowRegenConfirm(false);
                  onRegenerate();
                }}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

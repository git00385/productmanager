"use client";

import { useState } from "react";
import { Wand2, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SectionSelector } from "./SectionSelector";
import {
  DEFAULT_SECTIONS,
  EXAMPLE_INPUT,
  type SpecInput,
  type SpecScope,
  type SpecTone,
  type SpecSection,
} from "@/types/spec-writer";

const SCOPES: SpecScope[] = ["Full PRD", "One-Pager", "User Stories Only", "Technical Spec"];
const TONES: SpecTone[] = ["Professional", "Concise", "Detailed", "Engineering-focused"];

interface SpecInputFormProps {
  onGenerate: (input: SpecInput) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

/** Left-pane form for collecting spec generation inputs. */
export function SpecInputForm({ onGenerate, onStop, isStreaming, disabled }: SpecInputFormProps) {
  const [featureIdea, setFeatureIdea] = useState("");
  const [productContext, setProductContext] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [scope, setScope] = useState<SpecScope>("Full PRD");
  const [tone, setTone] = useState<SpecTone>("Professional");
  const [sections, setSections] = useState<SpecSection[]>(DEFAULT_SECTIONS);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({ featureIdea, productContext, targetUsers, scope, tone, sections });
  }

  function handleExample() {
    setFeatureIdea(EXAMPLE_INPUT.featureIdea);
    setProductContext(EXAMPLE_INPUT.productContext ?? "");
    setTargetUsers(EXAMPLE_INPUT.targetUsers ?? "");
    setScope(EXAMPLE_INPUT.scope);
    setTone(EXAMPLE_INPUT.tone);
    setSections(EXAMPLE_INPUT.sections);
  }

  const canGenerate = featureIdea.trim().length >= 20 && !disabled;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full overflow-y-auto p-5">
      {/* Feature Idea */}
      <div className="space-y-1.5">
        <Label htmlFor="featureIdea">
          Feature Idea <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="featureIdea"
          value={featureIdea}
          onChange={(e) => setFeatureIdea(e.target.value)}
          placeholder="Describe your feature idea, paste a Slack thread, customer request, or rough notes..."
          rows={5}
          disabled={isStreaming || disabled}
          className="w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none field-sizing-content min-h-[96px]"
        />
        <p className={`text-xs text-right ${featureIdea.length < 20 ? "text-muted-foreground" : "text-primary"}`}>
          {featureIdea.length} chars {featureIdea.length < 20 && `(${20 - featureIdea.length} more needed)`}
        </p>
      </div>

      {/* Product Context */}
      <div className="space-y-1.5">
        <Label htmlFor="productContext">Product Context</Label>
        <textarea
          id="productContext"
          value={productContext}
          onChange={(e) => setProductContext(e.target.value)}
          placeholder="What product is this for? Who are your users? What problem does it solve?"
          rows={3}
          disabled={isStreaming || disabled}
          className="w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
        />
      </div>

      {/* Target Users */}
      <div className="space-y-1.5">
        <Label htmlFor="targetUsers">Target Users</Label>
        <Input
          id="targetUsers"
          value={targetUsers}
          onChange={(e) => setTargetUsers(e.target.value)}
          placeholder="e.g. Enterprise admins, B2C consumers, internal ops team"
          disabled={isStreaming || disabled}
        />
      </div>

      {/* Scope */}
      <div className="space-y-1.5">
        <Label htmlFor="scope">Scope</Label>
        <select
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value as SpecScope)}
          disabled={isStreaming || disabled}
          className="w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tone */}
      <div className="space-y-1.5">
        <Label htmlFor="tone">Tone</Label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value as SpecTone)}
          disabled={isStreaming || disabled}
          className="w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Sections */}
      <div className="space-y-1.5">
        <Label>Include Sections</Label>
        <SectionSelector
          selected={sections}
          onChange={setSections}
          disabled={isStreaming || disabled}
        />
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1 pb-2">
        {isStreaming ? (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={onStop}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop generating
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full"
            disabled={!canGenerate}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generate Spec →
          </Button>
        )}

        <button
          type="button"
          onClick={handleExample}
          disabled={isStreaming || disabled}
          className="w-full text-xs text-center text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed py-1"
        >
          Try an example
        </button>
      </div>
    </form>
  );
}

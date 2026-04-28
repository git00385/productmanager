import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  module: string;
  description: string;
  icon: string;
}

/** Placeholder card displayed for modules not yet implemented. */
export function ComingSoon({ module, description, icon }: ComingSoonProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-10 pb-10 space-y-4">
          <div className="text-5xl">{icon}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold">{module}</h2>
              <Badge variant="warning" className="text-xs">Coming soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>This module is under active development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

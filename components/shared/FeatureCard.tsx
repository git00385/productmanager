interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

/** Reusable feature card for landing page and module overviews. */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card hover:bg-secondary border border-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-200 group">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

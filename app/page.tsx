import Link from "next/link";
import Logo from "@/components/Logo";
import { FeatureCard } from "@/components/shared/FeatureCard";

const FEATURES = [
  { icon: "🗺️", title: "Roadmap Intelligence", description: "AI-powered prioritization that aligns your roadmap with business goals, user needs, and team capacity — automatically." },
  { icon: "📊", title: "Metrics & Insights", description: "Surface what matters. Get instant analysis of product KPIs, trend anomalies, and actionable recommendations." },
  { icon: "🧠", title: "Smart Spec Writer", description: "Turn rough ideas into polished PRDs in seconds. The agent structures your thinking and fills in the gaps." },
  { icon: "🔬", title: "Research Synthesizer", description: "Ingest interviews, surveys, and support tickets. Get structured themes, quotes, and next steps instantly." },
  { icon: "🏃", title: "Sprint Planner", description: "Scope work, estimate capacity, and draft sprint goals — with full awareness of team availability and priorities." },
  { icon: "📣", title: "Stakeholder Updates", description: "Generate crisp, tailored updates for leadership, engineers, or customers — tuned to audience and cadence." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Connect your tools", desc: "Link Jira, Notion, Amplitude, Slack, and more in minutes." },
  { step: "02", title: "Ask or automate", desc: "Chat naturally or set up recurring workflows that run on schedule." },
  { step: "03", title: "Ship with confidence", desc: "Get clear, structured outputs ready for your team and stakeholders." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-base font-semibold tracking-tight">PM Agent</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <Logo size={88} className="mb-8" />
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          Now in early access
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Your AI-powered
          <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent"> Product Manager</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          PM Agent handles the grind — roadmaps, specs, metrics, research synthesis, and stakeholder updates — so you can focus on building great products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="bg-secondary text-secondary-foreground border border-border px-8 py-4 rounded-xl text-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            Sign in →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything a PM needs, automated</h2>
          <p className="mt-3 text-muted-foreground text-lg">Six core workflows. Zero busywork.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border px-6 py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
        <p className="text-muted-foreground text-lg mb-14">Three steps from idea to output.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-primary/20">{s.step}</span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 text-center">
        <Logo size={52} className="mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to 10x your output?</h2>
        <p className="text-muted-foreground text-lg mb-8">Join hundreds of PMs already using PM Agent.</p>
        <Link
          href="/signup"
          className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
        >
          Get early access
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex items-center justify-between text-sm text-muted-foreground max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <span>PM Agent</span>
        </div>
        <span>© 2026 PM Agent. All rights reserved.</span>
      </footer>
    </main>
  );
}

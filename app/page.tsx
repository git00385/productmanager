import Logo from "@/components/Logo";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: "🗺️",
    title: "Roadmap Intelligence",
    description:
      "AI-powered prioritization that aligns your roadmap with business goals, user needs, and team capacity — automatically.",
  },
  {
    icon: "📊",
    title: "Metrics & Insights",
    description:
      "Surface what matters. Get instant analysis of product KPIs, trend anomalies, and actionable recommendations.",
  },
  {
    icon: "🧠",
    title: "Smart Spec Writer",
    description:
      "Turn rough ideas into polished PRDs in seconds. The agent structures your thinking and fills in the gaps.",
  },
  {
    icon: "🔬",
    title: "Research Synthesizer",
    description:
      "Ingest interviews, surveys, and support tickets. Get structured themes, quotes, and next steps instantly.",
  },
  {
    icon: "🏃",
    title: "Sprint Planner",
    description:
      "Scope work, estimate capacity, and draft sprint goals — with full awareness of team availability and priorities.",
  },
  {
    icon: "📣",
    title: "Stakeholder Updates",
    description:
      "Generate crisp, tailored updates for leadership, engineers, or customers — tuned to audience and cadence.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-lg font-semibold tracking-tight">PM Agent</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div className="mb-8">
          <Logo size={96} />
        </div>
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          Now in early access
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
          Your AI-powered
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"> Product Manager</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          PM Agent handles the grind — roadmaps, specs, metrics, research synthesis, and stakeholder updates — so you can focus on building great products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
            Start for free
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors">
            Watch demo →
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything a PM needs, automated</h2>
          <p className="mt-3 text-slate-400 text-lg">Six core workflows. Zero busywork.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/10 px-6 py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
        <p className="text-slate-400 text-lg mb-14">Three steps from idea to output.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Connect your tools", desc: "Link Jira, Notion, Amplitude, Slack, and more in minutes." },
            { step: "02", title: "Ask or automate", desc: "Chat naturally or set up recurring workflows that run on schedule." },
            { step: "03", title: "Ship with confidence", desc: "Get clear, structured outputs ready for your team and stakeholders." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-indigo-500/30">{s.step}</span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center">
        <Logo size={56} className="mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to 10x your output?</h2>
        <p className="text-slate-400 text-lg mb-8">Join hundreds of PMs already using PM Agent.</p>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
          Get early access
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span>PM Agent</span>
        </div>
        <span>© 2026 PM Agent. All rights reserved.</span>
      </footer>
    </main>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Quote,
  FlaskConical,
  Layers,
  Gauge,
  Network,
  Beer,
  type LucideIcon,
} from "lucide-react";
import HexBackground from "@/components/HexBackground";
import Footer from "@/components/Footer";
import { handleSpotlight } from "@/lib/interactions";

const STATS = [
  { label: "Informants", value: "15" },
  { label: "Interviews", value: "17" },
  { label: "Design", value: "Single case" },
  { label: "Paradigm", value: "Interpretive" },
];

interface Section {
  icon: LucideIcon;
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    icon: FlaskConical,
    title: "Method & paradigm",
    body: "A qualitative single-case study of Carlsberg Group, written within an interpretive paradigm — I report how informants construct value rather than claiming objective productivity. Evidence comes from 17 semi-structured interviews with 15 informants across the organisation, from citizen developers and champions to leadership and external partners (incl. Microsoft).",
  },
  {
    icon: Layers,
    title: "Theoretical lens",
    body: "A dual frame: Kotter's Accelerate (2012) for the organisational level, and functional-affordance theory — Markus & Silver (2008) with Bernhard et al.'s emergence / perception / actualization (2013) — for the individual level. The central contribution couples them: Kotter's accelerators act as enabling conditions for affordance actualization. Ries' vanity-vs-actionable metrics (2011) is used as an analytical corrective on \"lasting value\".",
  },
  {
    icon: Network,
    title: "What I found",
    body: "Value emerges across three thresholds. Perception is shaped by a peer champion network and an \"AI out of IT\" narrative (countered by job-loss fear). Actualization hinges on self-teaching, a concentration of expertise, and time as the real effort cost. And lasting value depends on honest measurement, resisting decay, and anchoring agents into everyday work — not the raw count of agents built.",
  },
  {
    icon: Gauge,
    title: "The scale gap",
    body: "At a group of ~30,000 employees with ~2,500 premium licenses, roughly 8,000 agents had been built but only 4–500 were actively used — a vivid illustration of the gap between enthusiasm and real, lasting value, and why organisational and individual conditions (not tooling alone) decide the outcome.",
  },
];

const CASES = [
  {
    name: "Mathias' On-trade agent",
    text: "A key-account manager builds an agent that turns scattered customer data into actionable prep — a clear value producer, later sustained by a colleague. Followed from perception through actualization to a measured dashboard.",
  },
  {
    name: "Farkhod's Carlsberg Message Bank",
    text: "A champion builds a widely-used agent over a year (~150 users), then watches engagement decay — a micro-narrative of why anchoring and ownership matter as much as the initial build.",
  },
];

const Carlsberg = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "Carlsberg thesis · Anders Adalberth Andersen";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <HexBackground />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-semibold tracking-tight transition-opacity hover:opacity-80">
              Anders<span className="text-muted-foreground">.</span>
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="container px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-3 flex w-fit items-center justify-center gap-2 sm:mx-auto">
              <Beer className="h-4 w-4" /> Bachelor thesis · Microsoft × Carlsberg
            </span>
            <h1 className="section-heading text-3xl font-bold sm:text-5xl">
              Citizen Development of AI Agents at Carlsberg
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              How do non-technical employees turn Microsoft Copilot agents into real, lasting
              business value — and what conditions make it possible?
            </p>
          </div>

          {/* Research question */}
          <div className="mx-auto mt-10 max-w-3xl">
            <div
              onMouseMove={handleSpotlight}
              className="glass-card spotlight rounded-2xl p-6 sm:p-8"
            >
              <Quote className="h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-lg font-medium leading-relaxed text-foreground/90 sm:text-xl">
                Which organizational and individual conditions enable non-technical employees at
                Carlsberg to create real and lasting business value through agents in Microsoft
                Copilot?
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl px-4 py-5 text-center">
                <div className="text-xl font-bold sm:text-2xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sections */}
        <section className="container px-5 pb-12 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.title}
                  onMouseMove={handleSpotlight}
                  className="glass-card spotlight flex flex-col rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="hex-clip flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br from-white to-neutral-300 text-neutral-900 shadow-lg">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h2 className="text-lg font-semibold leading-tight">{sec.title}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{sec.body}</p>
                </div>
              );
            })}
          </div>

          {/* Cases */}
          <div className="mx-auto mt-10 max-w-5xl">
            <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Two cases that carry the analysis
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {CASES.map((c) => (
                <div
                  key={c.name}
                  onMouseMove={handleSpotlight}
                  className="spotlight rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-base font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
            Written in collaboration with Microsoft · Copenhagen Business School, 2026. Findings are
            informants' constructions, reported within an interpretive frame — no causal or ROI claims.
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Carlsberg;

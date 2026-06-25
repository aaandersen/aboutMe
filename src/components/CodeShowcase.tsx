import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import CodeBackground from "@/components/CodeBackground";

const manifest = `{
  "name": "Account Insights",
  "description": "Surfaces account health and next-best actions for non-technical teams.",
  "instructions": "Ground every answer in the live dashboard. Always cite the account and the metric.",
  "knowledge": [
    { "type": "graph_connector", "id": "sales-dashboard" }
  ],
  "actions": [
    { "id": "getAccount", "spec": "actions/accounts.openapi.yaml" },
    { "id": "logVisit",   "spec": "actions/visits.openapi.yaml" }
  ],
  "capabilities": ["CodeInterpreter", "WebSearch"]
}`;

const outcomes = [
  "Grounded in real data sources — not guesswork",
  "Typed actions that call real APIs and write back",
  "Governed and instrumented so value is measurable",
];

const CodeShowcase = () => {
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);
  const [lit, setLit] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Type the manifest out, like it's being written live, once it scrolls in.
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(manifest.length);
      return;
    }
    let c = 0;
    const id = window.setInterval(() => {
      c = Math.min(manifest.length, c + 3);
      setCount(c);
      if (c >= manifest.length) window.clearInterval(id);
    }, 12);
    return () => window.clearInterval(id);
  }, [revealed]);

  // Light the outcome checkmarks green, one after another, once in view.
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(outcomes.length);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setLit(n);
      if (n >= outcomes.length) window.clearInterval(id);
    }, 480);
    return () => window.clearInterval(id);
  }, [revealed]);

  const typing = count < manifest.length;

  return (
    <section
      id="build"
      className="relative overflow-hidden border-y border-white/[0.06] bg-background py-16 sm:py-24"
      ref={sectionRef}
    >
      <CodeBackground />
      <div className="container relative z-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Code panel */}
          <div
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
            style={{
              transition: "opacity .7s ease, transform .7s ease",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                agent.manifest.json
              </span>
            </div>
            <div className="relative">
              {/* Invisible full manifest reserves the height so nothing jumps. */}
              <pre
                className="overflow-hidden p-5 font-mono text-[13px] leading-relaxed opacity-0"
                aria-hidden="true"
              >
                <code className="whitespace-pre">{manifest}</code>
              </pre>
              {/* Visible text that types itself in. */}
              <pre className="absolute inset-0 overflow-hidden p-5 font-mono text-[13px] leading-relaxed text-foreground/85">
                <code className="whitespace-pre">
                  {manifest.slice(0, count)}
                  <span className={`text-primary ${typing ? "" : "type-caret"}`}>▋</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Explanation */}
          <div
            style={{
              transition: "opacity .7s ease .1s, transform .7s ease .1s",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(20px)",
            }}
          >
            <span className="eyebrow mb-3 flex w-fit">How I build</span>
            <h2 className="section-heading text-3xl font-bold md:text-4xl">
              From a brief to a working agent
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every agent starts as a manifest: clear instructions, the right
              knowledge sources, and typed actions wired to real systems. From
              low-code in Copilot Studio to pro-code orchestration over MCP, I keep
              them grounded, governed, and measurable.
            </p>

            <ul className="mt-6 space-y-3">
              {outcomes.map((item, i) => {
                const on = i < lit;
                return (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        on
                          ? "scale-100 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.55)]"
                          : "scale-90 bg-white/10 text-foreground/40"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span
                      className={`text-sm transition-colors duration-500 ${
                        on ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>

            <a
              href="https://aicockpit.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center text-sm font-semibold text-foreground hover:underline"
            >
              Explore a live build — The AI Cockpit
              <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;

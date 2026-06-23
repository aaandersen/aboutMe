import { useState, useEffect, useRef } from "react";
import { handleSpotlight } from "@/lib/interactions";

interface StackItem {
  name: string;
  role: string;
  description: string;
}

const stack: StackItem[] = [
  {
    name: "Microsoft Copilot Studio",
    role: "Low-code agents",
    description:
      "Declarative agents with topics, knowledge, and actions — the fastest path from idea to a working assistant.",
  },
  {
    name: "Microsoft 365 Agents SDK",
    role: "Pro-code agents",
    description:
      "Custom engine agents and orchestration when a use case outgrows low-code boundaries.",
  },
  {
    name: "Model Context Protocol",
    role: "Tools & context",
    description:
      "Standardised MCP servers that give agents real tools and grounded, governed context.",
  },
  {
    name: "Power Platform",
    role: "Automation & apps",
    description:
      "Power Automate flows and Power Apps that let citizen developers ship solutions safely.",
  },
  {
    name: "Azure",
    role: "Cloud backbone",
    description:
      "Static Web Apps, Functions, and Entra ID for secure, scalable products around the agents.",
  },
  {
    name: "TypeScript & React",
    role: "Product surface",
    description:
      "The dashboards and front-ends that make agent value visible and adoptable.",
  },
];

const TechStack = () => {
  const [revealed, setRevealed] = useState(false);
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

  return (
    <section id="stack" className="bg-white/[0.015] py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Toolkit</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            The stack I build on
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A modular set of Microsoft and web capabilities I compose to turn AI
            ideas into governed, production-ready agents.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((item, index) => (
            <div
              key={item.name}
              onMouseMove={handleSpotlight}
              className="spotlight group bg-background p-6 transition-colors hover:bg-white/[0.02]"
              style={{
                transition: "opacity .6s ease, transform .6s ease",
                transitionDelay: `${index * 70}ms`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(18px)",
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

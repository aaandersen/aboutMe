import { useState, useEffect, useRef } from "react";

const stats = [
  {
    value: "3",
    label: "Microsoft certifications",
    sub: "AI Business Professional · Copilot & Agent Admin · Power Platform",
  },
  {
    value: "2026",
    label: "BSc Business Admin. & IT",
    sub: "Copenhagen Business School",
  },
  {
    value: "2",
    label: "AI products shipped live",
    sub: "aiusagetracker.org · aicockpit.org",
  },
  {
    value: "15",
    label: "Thesis informants",
    sub: "Microsoft × Carlsberg single-case study",
  },
];

const StatsBand = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/10 bg-white/[0.015] !py-0"
      aria-label="Key facts"
    >
      <div className="container">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="border-white/10 py-10 sm:px-6 lg:border-l lg:first:border-l-0 lg:first:pl-0"
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${index * 90}ms`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(18px)",
              }}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-5xl font-bold tracking-tight md:text-6xl">
                  {stat.value}
                </span>
                <span className="mt-3 block text-sm font-semibold uppercase tracking-wide text-foreground/90">
                  {stat.label}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {stat.sub}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default StatsBand;


import { useState, useEffect, useRef } from "react";
import { Building, GraduationCap, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleSpotlight } from "@/lib/interactions";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  type: "education" | "work";
  description: string[];
  badge?: string;
  expanded?: boolean;
}

const TimelineData: TimelineItem[] = [
  {
    id: "1",
    title: "BSc in Business Administration & IT — HA(it.)",
    organization: "Copenhagen Business School (CBS)",
    period: "August 2023 – June 2026",
    type: "education",
    badge: "Graduated 2026",
    expanded: true,
    description: [
      "Graduated in June 2026, combining business administration with information technology.",
      "Bachelor thesis (in collaboration with Microsoft): investigated the organizational and individual conditions that enable non-technical employees at Carlsberg to create real and lasting business value through citizen development of AI agents in Microsoft Copilot.",
      "Relevant courses: Organizational Theory, Accounting, Finance, Micro- & Macroeconomics, Programming (SQL, JavaScript & HTML/CSS), IT Project Management.",
      "Selected projects: SCRUM-based business planning & web development, and cloud deployments on Azure and DigitalOcean (Ubuntu)."
    ]
  },
  {
    id: "2",
    title: "GYMNASIE HTX",
    organization: "NEXT SUKKERTOPPEN",
    period: "August 2018 - January 2021",
    type: "education",
    description: [
      "Mathematics A and Programming B.",
      "SOP Project: Algorithmic Forecasting of Epidemic Development via the SIR Model."
    ]
  },
  {
    id: "3",
    title: "Content Creator",
    organization: "TMC Nordic",
    period: "October 2024 - August 2025",
    type: "work",
    description: [
      "Develop and produce digital content to enhance the brand's online presence.",
      "Optimize SEO strategies and work with digital marketing."
    ]
  },
  {
    id: "4",
    title: "Substitute Teacher",
    organization: "Rødovre School",
    period: "August 2022 - August 2025",
    type: "work",
    description: [
      "Teach and guide students in various subjects with a focus on structured learning and engagement.",
      "Develop teaching materials and ensure effective classroom management."
    ]
  },
  {
    id: "5",
    title: "Content Creator",
    organization: "Trendhim",
    period: "April 2024 – August 2024",
    type: "work",
    description: [
      "Wrote and optimized product descriptions and blog posts to improve SEO and customer experience.",
      "Worked with brand storytelling and digital marketing."
    ]
  },
  {
    id: "6",
    title: "Content Creator",
    organization: "EASIS A/S",
    period: "June 2024 - August 2024",
    type: "work",
    description: [
      "Created digital content and optimized social media platforms to increase brand engagement."
    ]
  },
  {
    id: "7",
    title: "Operator",
    organization: "Danish Patient Safety Authority",
    period: "July 2021 - January 2022",
    type: "work",
    description: [
      "Managed data registration and coordinated administrative tasks with precision and confidentiality."
    ]
  },
  {
    id: "8",
    title: "Technology Specialist (Student Worker)",
    organization: "Microsoft",
    period: "August 2025 – Present",
    type: "work",
    badge: "Current",
    expanded: true,
    description: [
      "Supporting customers in adopting AI and Microsoft Copilot, with a focus on agents and citizen development.",
      "Helping organizations turn AI enthusiasm into measurable, lasting business value."
    ]
  }
];

const PRESENT_TO_PAST = ["8", "1", "3", "4", "6", "5", "7", "2"];

const Timeline = () => {
  const [filter, setFilter] = useState<"all" | "education" | "work">("all");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["8"]));
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ordered = PRESENT_TO_PAST.map((id) => TimelineData.find((i) => i.id === id))
    .filter((item): item is TimelineItem => Boolean(item))
    .filter((item) => filter === "all" || item.type === filter);

  const scrollByCards = (direction: number) => {
    scrollRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });
  };

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
    <section
      id="experience"
      className="overflow-hidden bg-white/[0.015] py-16 sm:py-24 !px-0"
      ref={sectionRef}
    >
      <div className="container">
        <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow mb-3">Career</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            Experience &amp; Education
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            My journey from CBS to Microsoft — newest first. Scroll back through
            time and tap any point to read more.
          </p>
        </div>

        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={filter === "work" ? "default" : "outline"}
              onClick={() => setFilter("work")}
              size="sm"
              className="rounded-full"
            >
              <Building className="mr-2 h-4 w-4" />
              Work
            </Button>
            <Button
              variant={filter === "education" ? "default" : "outline"}
              onClick={() => setFilter("education")}
              size="sm"
              className="rounded-full"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Education
            </Button>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll to more recent"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-foreground transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Scroll back in time"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-foreground transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal, scrollable timeline — present on the left, scroll back in time */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />

        <div ref={scrollRef} className="hide-scrollbar overflow-x-auto scroll-smooth">
          <div className="flex min-w-max px-4 sm:px-10 lg:px-16">
            {ordered.map((item, index) => {
              const isOpen = expanded.has(item.id);
              const Icon = item.type === "education" ? GraduationCap : Building;
              return (
                <article
                  key={item.id}
                  className="w-[280px] shrink-0 px-3 sm:w-[320px]"
                  style={{
                    transitionDelay: `${index * 70}ms`,
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "translateY(0)" : "translateY(24px)",
                    transition: "opacity .6s ease, transform .6s ease",
                  }}
                >
                  <div className="flex h-6 items-center justify-center whitespace-nowrap text-sm font-semibold text-foreground/90">
                    {item.period}
                  </div>

                  <div className="relative my-4 h-4">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
                    <span
                      className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background ${
                        item.badge
                          ? "border-white shadow-[0_0_14px_rgba(255,255,255,0.45)]"
                          : "border-white/35"
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    onMouseMove={handleSpotlight}
                    aria-expanded={isOpen}
                    className="glass-card card-hover spotlight w-full rounded-2xl p-5 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-900 shadow-md ${
                          item.type === "education"
                            ? "bg-gradient-to-br from-white to-neutral-300"
                            : "bg-gradient-to-br from-neutral-200 to-neutral-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.organization}</p>
                      </div>
                    </div>

                    {item.badge && (
                      <Badge className="mt-3 border-0 bg-white/10 text-foreground hover:bg-white/10">
                        {item.badge}
                      </Badge>
                    )}

                    <div className="mt-3 flex items-center text-xs font-semibold text-primary">
                      {isOpen ? "Show less" : "Read more"}
                      <ChevronDown
                        className={`ml-1 h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "mt-3 grid-rows-[1fr] border-t pt-3" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="space-y-2 overflow-hidden">
                        {item.description.map((desc, i) => (
                          <p key={i} className="text-sm leading-relaxed text-foreground/75">
                            {desc}
                          </p>
                        ))}
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

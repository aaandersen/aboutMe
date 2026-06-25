import { useState, useEffect, useRef } from "react";
import { Bot, Workflow, Users, Gauge, type LucideIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { handleSpotlight } from "@/lib/interactions";
import NeuralBackground from "@/components/NeuralBackground";
import CarouselDots from "@/components/CarouselDots";

interface Capability {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const capabilities: Capability[] = [
  {
    title: "Agent development",
    description:
      "Designing and building custom agents in Microsoft Copilot Studio and the Microsoft 365 Agents SDK — grounding them with the right knowledge, tools, and actions.",
    icon: Bot,
    gradient: "from-white to-neutral-300",
  },
  {
    title: "Multi-agent orchestration",
    description:
      "Composing agents into coordinated workflows — routing, hand-offs, and tool-calling wired together over the Model Context Protocol (MCP).",
    icon: Workflow,
    gradient: "from-neutral-200 to-neutral-400",
  },
  {
    title: "Citizen development at scale",
    description:
      "Enabling non-technical builders to ship agents safely — guardrails, governance, and a champion network that turns enthusiasm into real adoption.",
    icon: Users,
    gradient: "from-white to-neutral-400",
  },
  {
    title: "Value & measurement",
    description:
      "Instrumenting agents with usage analytics so impact is judged on real, lasting business value — actionable metrics, not vanity numbers.",
    icon: Gauge,
    gradient: "from-neutral-100 to-neutral-300",
  },
];

const AgentExpertise = () => {
  const [revealed, setRevealed] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const sectionRef = useRef<HTMLElement>(null);

  // Re-fire on every viewport entry so the reveal replays when you scroll back.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance the mobile carousel; pause on hover, honour reduced motion.
  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = api.rootNode();
    let timer = window.setInterval(() => api.scrollNext(), 4500);
    const pause = () => window.clearInterval(timer);
    const resume = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => api.scrollNext(), 4500);
    };
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);

    return () => {
      window.clearInterval(timer);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
    };
  }, [api]);

  const renderCard = (cap: Capability, index: number) => {
    const Icon = cap.icon;
    return (
      <div
        key={cap.title}
        onMouseMove={handleSpotlight}
        className="glass-card card-hover spotlight h-full rounded-2xl p-6"
        style={{
          transitionDelay: `${index * 90}ms`,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className={`hex-clip flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-to-br ${cap.gradient} text-neutral-900 shadow-lg`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-tight">{cap.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {cap.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="agents"
      className="relative overflow-hidden border-y border-white/[0.06] bg-background py-16 sm:py-24"
      ref={sectionRef}
    >
      <NeuralBackground />
      <div className="container relative z-10">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          <span className="eyebrow mb-3">What I do</span>
          <h2 className="section-heading mb-4 max-w-3xl text-3xl font-bold md:text-4xl">
            Developing &amp; orchestrating AI agents
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            My core focus: turning isolated AI capabilities into networks of agents
            that coordinate, act, and deliver measurable value — from a single
            Copilot agent to an orchestrated, governed system.
          </p>
        </div>

        {/* Mobile: swipeable carousel keeps the section short */}
        <div className="sm:hidden">
          <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
            <CarouselContent>
              {capabilities.map((cap, index) => (
                <CarouselItem key={cap.title} className="basis-full">
                  {renderCard(cap, index)}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <CarouselDots api={api} />
        </div>

        {/* Tablet & up: full grid */}
        <div className="mx-auto hidden max-w-5xl grid-cols-2 gap-6 sm:grid">
          {capabilities.map((cap, index) => renderCard(cap, index))}
        </div>
      </div>
    </section>
  );
};

export default AgentExpertise;

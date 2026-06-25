
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Bot,
  BarChart3,
  LayoutDashboard,
  LineChart,
  Cloud,
  CalendarHeart,
  Music2,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { handleSpotlight } from "@/lib/interactions";
import CarouselDots from "@/components/CarouselDots";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  image?: string;
  gradient: string;
  link?: string;
  linkLabel?: string;
  meta?: string;
  featured?: boolean;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "thesis",
    title: "Citizen Development of AI Agents at Carlsberg",
    description:
      "In collaboration with Microsoft, I researched the organizational and individual conditions that enable non-technical employees at Carlsberg to create real and lasting business value through AI agents in Microsoft Copilot. A qualitative single-case study (15 informants, 17 interviews) bridging Kotter's change theory with affordance theory.",
    technologies: ["AI Agents", "Microsoft Copilot", "Citizen Development", "Qualitative Research", "Change Management"],
    icon: Bot,
    image: "/uploads/carlsberggroup-logo.svg",
    gradient: "from-neutral-700 to-neutral-950",
    meta: "Microsoft × Carlsberg",
    featured: true,
  },
  {
    id: "usage",
    title: "AI Usage Tracker",
    description:
      "A full-stack analytics dashboard for tracking and visualizing AI & Copilot usage across an organization — leaderboards, stored-data insights, and a built-in chat agent. Built on Azure Static Web Apps with an Azure Functions backend and Entra ID authentication.",
    technologies: ["Azure SWA", "Azure Functions", "React", "TypeScript", "Entra ID"],
    icon: BarChart3,
    image: "/uploads/aiusagetracker.png",
    gradient: "from-neutral-700 to-neutral-900",
    link: "https://aiusagetracker.org",
    linkLabel: "Visit aiusagetracker.org",
  },
  {
    id: "cockpit",
    title: "The AI Cockpit",
    description:
      "A platform for surfacing, voting on, and prioritizing AI use-cases and agent ideas — with user profiles, an MCP server, and SWA authentication. Helps teams turn AI enthusiasm into an actionable pipeline.",
    technologies: ["Azure SWA", "MCP Server", "React", "TypeScript", "SWA Auth"],
    icon: LayoutDashboard,
    image: "/uploads/AIcockpit.png",
    gradient: "from-neutral-600 to-neutral-900",
    link: "https://aicockpit.org",
    linkLabel: "Visit aicockpit.org",
  },
  {
    id: "famtime",
    title: "FamTime",
    description:
      "An AI-driven planner that automatically finds free slots across the family's calendars and suggests when to spend time together \u2014 taking the coordination work out of planning family time. Built with React, TypeScript, and Firebase.",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS", "Vite"],
    icon: CalendarHeart,
    image: "/uploads/famtime.png",
    gradient: "from-neutral-700 to-neutral-900",
  },
  {
    id: "joetunes",
    title: "JoeTunes",
    description:
      "A playful web app that lets guests at Joe & The Juice shape the in-caf\u00e9 soundtrack by voting on their favourite songs \u2014 turning the playlist into a shared, interactive experience.",
    technologies: ["JavaScript", "HTML", "CSS", "Web App"],
    icon: Music2,
    image: "/uploads/joetunes.png",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    id: "svaneeng",
    title: "Svaneeng Calendar System",
    description:
      "A calendar and scheduling system built for Svaneeng \u2014 bringing bookings and events together in one shared, easy-to-manage overview.",
    technologies: ["Web App", "Scheduling", "Calendar"],
    icon: CalendarDays,
    image: "/uploads/Svaneeng.png",
    gradient: "from-neutral-600 to-neutral-900",
  },
  {
    id: "forecasting",
    title: "Algorithmic Forecasting (SIR Model)",
    description:
      "Higher-secondary (HTX) SOP project modelling epidemic development with the SIR model — demonstrating mathematics, algorithms, and predictive data analysis.",
    technologies: ["Mathematics", "Algorithms", "Modelling"],
    icon: LineChart,
    image: "/uploads/forecasting.svg",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure & Web Apps",
    description:
      "Deployed and maintained web applications on Azure and DigitalOcean using Ubuntu servers — covering provisioning, hosting, and ongoing infrastructure management.",
    technologies: ["Azure", "DigitalOcean", "Ubuntu", "Cloud"],
    icon: Cloud,
    image: "/uploads/cloud.svg",
    gradient: "from-neutral-600 to-neutral-800",
  },
];

const Portfolio = () => {
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

  // Auto-advance the carousel; pause on hover, honour reduced motion.
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

  return (
    <section id="portfolio" className="bg-white/[0.015] py-16 sm:py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Selected work</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            Project Portfolio
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From a Microsoft × Carlsberg research thesis to full-stack AI products.
          </p>
        </div>

        <div
          className="mx-auto max-w-6xl px-0 sm:px-12"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transition: "opacity .6s ease, transform .6s ease",
          }}
        >
          <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
            <CarouselContent>
              {portfolioItems.map((item) => {
                const Icon = item.icon;
                return (
                  <CarouselItem key={item.id} className="sm:basis-1/2 lg:basis-1/3">
                    <Card
                      onMouseMove={handleSpotlight}
                      className="card-hover spotlight flex h-full flex-col overflow-hidden border-border"
                    >
                      <div
                        className={`relative flex h-28 items-center overflow-hidden bg-gradient-to-br ${item.gradient} px-6`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                              <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                            </div>
                            <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/10" />
                            <div className="pointer-events-none absolute -right-2 bottom-2 h-16 w-16 rounded-full bg-white/10" />
                          </>
                        )}
                      </div>

                      <CardContent className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {item.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-4">
                          {item.description}
                        </p>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-auto inline-flex items-center pt-4 text-sm font-medium text-foreground hover:underline"
                          >
                            {item.linkLabel ?? "View project"}
                            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden border-white/15 bg-white/[0.03] sm:flex" />
            <CarouselNext className="hidden border-white/15 bg-white/[0.03] sm:flex" />
          </Carousel>
          <CarouselDots api={api} />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

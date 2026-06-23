
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Bot,
  BarChart3,
  LayoutDashboard,
  LineChart,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { handleSpotlight } from "@/lib/interactions";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
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
    gradient: "from-neutral-600 to-neutral-900",
    link: "https://aicockpit.org",
    linkLabel: "Visit aicockpit.org",
  },
  {
    id: "forecasting",
    title: "Algorithmic Forecasting (SIR Model)",
    description:
      "Higher-secondary (HTX) SOP project modelling epidemic development with the SIR model — demonstrating mathematics, algorithms, and predictive data analysis.",
    technologies: ["Mathematics", "Algorithms", "Modelling"],
    icon: LineChart,
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure & Web Apps",
    description:
      "Deployed and maintained web applications on Azure and DigitalOcean using Ubuntu servers — covering provisioning, hosting, and ongoing infrastructure management.",
    technologies: ["Azure", "DigitalOcean", "Ubuntu", "Cloud"],
    icon: Cloud,
    gradient: "from-neutral-600 to-neutral-800",
  },
];

const Portfolio = () => {
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

  const revealStyle = (index: number) => ({
    transitionDelay: `${index * 90}ms`,
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(20px)",
  });

  return (
    <section id="portfolio" className="bg-white/[0.015] py-24" ref={sectionRef}>
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

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioItems.map((item, index) => {
            const Icon = item.icon;

            if (item.featured) {
              return (
                <Card
                  key={item.id}
                  onMouseMove={handleSpotlight}
                  className="card-hover spotlight overflow-hidden border-border md:col-span-2"
                  style={revealStyle(index)}
                >
                  <div className="grid md:grid-cols-5">
                    <div
                      className={`relative flex flex-col justify-between gap-8 overflow-hidden bg-gradient-to-br ${item.gradient} p-8 md:col-span-2`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                        <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="relative z-10">
                        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          Bachelor Thesis · 2026
                        </span>
                        <p className="mt-3 text-sm font-medium text-white/90">{item.meta}</p>
                      </div>
                      <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-white/10" />
                      <div className="pointer-events-none absolute -right-4 top-6 h-20 w-20 rounded-full bg-white/10" />
                    </div>
                    <CardContent className="p-8 md:col-span-3">
                      <h3 className="text-2xl font-semibold leading-tight">{item.title}</h3>
                      <p className="mt-3 text-muted-foreground">{item.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            }

            return (
              <Card
                key={item.id}
                onMouseMove={handleSpotlight}
                className="card-hover spotlight overflow-hidden border-border"
                style={revealStyle(index)}
              >
                <div
                  className={`relative flex h-28 items-center overflow-hidden bg-gradient-to-br ${item.gradient} px-6`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -right-2 bottom-2 h-16 w-16 rounded-full bg-white/10" />
                </div>

                <CardContent className="p-6">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      {item.linkLabel ?? "View project"}
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

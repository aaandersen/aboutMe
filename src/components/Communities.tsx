import { useState, useEffect, useRef } from "react";
import { Building2, Users, Network, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { handleSpotlight } from "@/lib/interactions";

interface Group {
  name: string;
  org: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  link?: string;
}

const groups: Group[] = [
  {
    name: "ERP peer group",
    org: "A.P. Møller",
    description:
      "A knowledge-sharing group where ERP practitioners exchange experience and align on best practice across the organisation.",
    tags: ["Knowledge sharing", "ERP"],
    icon: Building2,
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_apmaeoller-knowledgesharing-activity-7417511067469127681-Rz8u",
  },
  {
    name: "CRM ERFA group",
    org: "Cross-company forum",
    description:
      "An experience-exchange (ERFA) group exploring digital transformation and how AI agents are reshaping CRM.",
    tags: ["Digital transformation", "Agents"],
    icon: Users,
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_digitaltransformation-erfa-agents-activity-7425631509304410112-7Ltf",
  },
  {
    name: "Enterprise group",
    org: "Cross-company forum",
    description:
      "A peer forum for enterprise practitioners to align on strategy and tooling — where stakeholder management turns shared lessons into action.",
    tags: ["Enterprise", "Stakeholder management"],
    icon: Network,
  },
];

const Communities = () => {
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
    <section id="communities" className="py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Facilitation</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            Communities I facilitate
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Beyond building agents, I bring people together — running
            cross-organisation peer groups where practitioners share experience,
            align stakeholders, and turn digital-transformation lessons into
            practice.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {groups.map((group, index) => {
            const Icon = group.icon;
            return (
              <div
                key={group.name}
                onMouseMove={handleSpotlight}
                className="glass-card card-hover spotlight flex flex-col rounded-2xl p-6"
                style={{
                  transitionDelay: `${index * 90}ms`,
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity .6s ease, transform .6s ease",
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-foreground">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-tight">
                  {group.name}
                </h3>
                <p className="text-sm text-muted-foreground">{group.org}</p>

                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {group.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {group.link && (
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center text-sm font-medium text-foreground hover:underline"
                  >
                    View on LinkedIn
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Communities;

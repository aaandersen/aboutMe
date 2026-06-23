import { useState, useEffect, useRef } from "react";
import { Building2, Users, ArrowUpRight, type LucideIcon } from "lucide-react";
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
    name: "ERP — A.P. Møller group",
    org: "Microsoft community",
    description:
      "A Microsoft community I run for ERP leaders across major brands — facilitating knowledge sharing and aligning stakeholders around enterprise change.",
    tags: ["ERP", "Knowledge sharing", "Stakeholder management"],
    icon: Building2,
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_apmaeoller-knowledgesharing-activity-7417511067469127681-Rz8u",
  },
  {
    name: "CRM — Enterprise group",
    org: "Microsoft community",
    description:
      "A Microsoft enterprise community on CRM and digital transformation — convening big brands to explore how AI agents reshape customer engagement.",
    tags: ["CRM", "Digital transformation", "Agents"],
    icon: Users,
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_digitaltransformation-erfa-agents-activity-7425631509304410112-7Ltf",
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
            Communities I run
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            I run two Microsoft communities that bring leaders from major brands
            together — driving knowledge sharing, digital transformation, and the
            stakeholder management that turns conversation into change.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
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

        {/* Member brand logos — placeholders until the company list is provided. */}
        <div className="mx-auto mt-12 max-w-4xl">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Member brands
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <Building2 className="h-5 w-5 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Communities;

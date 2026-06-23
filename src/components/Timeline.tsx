
import { useState, useEffect, useRef } from "react";
import { Building, GraduationCap, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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

const Timeline = () => {
  const [timeline, setTimeline] = useState(TimelineData);
  const [filter, setFilter] = useState<"all" | "education" | "work">("all");
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleExpand = (id: string) => {
    setTimeline(timeline.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const filteredTimeline = timeline.filter(item => 
    filter === "all" || item.type === filter
  );

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
      className="bg-white/[0.015] py-24"
      ref={sectionRef}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="eyebrow mb-3">Career</span>
            <h2 className="mb-4 section-heading text-3xl font-bold md:text-4xl">
              Experience &amp; Education
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              My journey combining business expertise with technical skills — from CBS to Microsoft.
            </p>
            
            <div className="flex space-x-2 mt-8">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="rounded-full"
              >
                All
              </Button>
              <Button
                variant={filter === "work" ? "default" : "outline"}
                onClick={() => setFilter("work")}
                className="rounded-full"
              >
                <Building className="mr-2 h-4 w-4" />
                Work Experience
              </Button>
              <Button
                variant={filter === "education" ? "default" : "outline"}
                onClick={() => setFilter("education")}
                className="rounded-full"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Education
              </Button>
            </div>
          </div>
          
          <div className={`space-y-6 transition-all duration-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
            {filteredTimeline.map((item, index) => (
              <div 
                key={item.id}
                onMouseMove={handleSpotlight}
                className="glass-card card-hover spotlight rounded-2xl p-6"
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                  opacity: revealed ? 1 : 0
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-900 shadow-md ${
                        item.type === "education"
                          ? "bg-gradient-to-br from-white to-neutral-300"
                          : "bg-gradient-to-br from-neutral-200 to-neutral-400"
                      }`}
                    >
                      {item.type === "education" ? (
                        <GraduationCap className="h-5 w-5" />
                      ) : (
                        <Building className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                        {item.badge && (
                          <Badge className="border-0 bg-primary/10 text-primary hover:bg-primary/10">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{item.organization}</p>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(item.id)}
                    aria-label={item.expanded ? "Collapse" : "Expand"}
                    className="shrink-0"
                  >
                    {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                {item.expanded && (
                  <div className="mt-4 space-y-2 border-t pt-4 animate-fade-in">
                    {item.description.map((desc, i) => (
                      <p key={i} className="text-sm leading-relaxed text-foreground/80">
                        {desc}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

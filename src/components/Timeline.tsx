
import { useState, useEffect, useRef } from "react";
import { Building, GraduationCap, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  type: "education" | "work";
  description: string[];
  expanded?: boolean;
}

const TimelineData: TimelineItem[] = [
  {
    id: "1",
    title: "Bachelor of Science - HA(it)",
    organization: "Business Administration and Information Technology, CBS",
    period: "August 2023 - July 2026",
    type: "education",
    description: [
      "Relevant courses: Organizational Theory, Accounting, Finance, Micro- & Macroeconomics, Programming (SQL, JavaScript & HTML/CSS), IT Project Management.",
      "Key Projects:",
      "• Implemented SCRUM methodologies in business planning and website development.",
      "• Cloud Infrastructure: Deployed and managed cloud solutions with Azure and DigitalOcean.",
      "• Deployed and maintained a web application on a cloud platform (DigitalOcean) using Ubuntu servers."
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
    period: "October 2024 - Present",
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
    period: "August 2022 - Present",
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
    period: "August 2024 - April 2024",
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
      className="bg-secondary/50 py-24"
      ref={sectionRef}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
              Experience & Education
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              My professional journey combining business expertise with technical skills
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
                className="glass-card rounded-xl p-6 transition-all duration-500"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                  opacity: revealed ? 1 : 0
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-primary/10">
                      {item.type === "education" ? (
                        <GraduationCap className="h-5 w-5 text-primary" />
                      ) : (
                        <Building className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.organization}</p>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(item.id)}
                    aria-label={item.expanded ? "Collapse" : "Expand"}
                  >
                    {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                {item.expanded && (
                  <div className="mt-4 pt-4 border-t space-y-2 animate-fade-in">
                    {item.description.map((desc, i) => (
                      <p key={i} className="text-sm">
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

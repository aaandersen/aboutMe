
import { useState, useEffect, useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  github?: string;
}

// Placeholder data - would be replaced with actual projects
const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Algorithmic Forecasting",
    description: "SOP Project on Epidemic Development via the SIR Model, demonstrating data analysis and predictive modeling skills.",
    image: "https://images.unsplash.com/photo-1606765962248-7ff407b51667?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["Mathematics", "Algorithms", "Data Analysis"],
    link: "#",
    github: "#"
  },
  {
    id: "2",
    title: "Cloud Infrastructure Project",
    description: "Deployed and managed cloud solutions with Azure and DigitalOcean, showcasing infrastructure management capabilities.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["Azure", "DigitalOcean", "Ubuntu", "Cloud Management"],
    link: "#"
  },
  {
    id: "3",
    title: "Web Application Development",
    description: "Deployed and maintained a web application on a cloud platform using Ubuntu servers and modern web technologies.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["JavaScript", "HTML/CSS", "Cloud Hosting"],
    link: "#",
    github: "#"
  },
  {
    id: "4",
    title: "Digital Content Creation",
    description: "Developed digital content and SEO strategies for multiple brands, optimizing online presence and engagement.",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["Digital Marketing", "Content Creation", "SEO"],
    link: "#"
  }
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

  return (
    <section id="portfolio" className="bg-secondary/50 py-24" ref={sectionRef}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
            Project Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my projects, academic work, and professional achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {portfolioItems.map((item, index) => (
            <Card 
              key={item.id}
              className={`overflow-hidden transition-all duration-500 hover:shadow-lg border border-border hover:border-primary/20`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center space-x-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Project
                  </a>
                  
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Source Code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

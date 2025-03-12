
import { useState, useEffect, useRef } from "react";
import { Check, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Skill {
  name: string;
  level: number;
  category: "tech" | "analytical" | "languages" | "tools";
  icon?: string;
}

const skills: Skill[] = [
  { name: "Microsoft Power Point", level: 90, category: "tools" },
  { name: "Adobe Premiere Pro", level: 85, category: "tools" },
  { name: "Microsoft Excel", level: 90, category: "tools" },
  { name: "SCRUM Methodologies", level: 85, category: "tech" },
  { name: "Data Analysis", level: 80, category: "analytical" },
  { name: "Problem Solving", level: 85, category: "analytical" },
  { name: "Process Optimization", level: 75, category: "analytical" },
  { name: "Data Organization", level: 85, category: "analytical" },
  { name: "English", level: 95, category: "languages" },
  { name: "Danish", level: 100, category: "languages" },
  { name: "Cloud Infrastructure", level: 70, category: "tech" },
  { name: "SQL", level: 65, category: "tech" },
  { name: "JavaScript", level: 60, category: "tech" },
  { name: "HTML/CSS", level: 70, category: "tech" },
];

interface CategoryOption {
  value: "all" | "tech" | "analytical" | "languages" | "tools";
  label: string;
}

const categories: CategoryOption[] = [
  { value: "all", label: "All Skills" },
  { value: "tech", label: "Technical" },
  { value: "analytical", label: "Analytical" },
  { value: "languages", label: "Languages" },
  { value: "tools", label: "Tools" },
];

const SkillsMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption["value"]>("all");
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const filteredSkills = skills.filter(
    (skill) => selectedCategory === "all" || skill.category === selectedCategory
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

  const renderStars = (level: number) => {
    const fullStars = Math.floor(level / 20);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < fullStars ? 'fill-primary text-primary' : 'text-muted'}`}
        />
      );
    }
    
    return stars;
  };

  return (
    <section id="skills" className="py-24" ref={sectionRef}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
              Skills & Expertise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I bring a diverse set of skills combining business acumen and technical capabilities
            </p>
          </div>

          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-primary text-white"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.name}
                className="skill-card"
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{skill.name}</h3>
                  <div className="flex space-x-1">
                    {renderStars(skill.level)}
                  </div>
                </div>
                <Progress value={skill.level} className="h-2 mt-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Proficient</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;

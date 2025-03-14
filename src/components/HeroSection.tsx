
import { useState, useEffect } from "react";
import { Download, Linkedin, Github, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-32 md:pt-0" id="about">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${isLoaded ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
              Business Administration & IT
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Anders Adalberth <span className="text-primary">Andersen</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md">
              Ambitious student with strong interest in AI/LLM combining business administration with IT expertise.
            </p>
            
            <div className="flex items-center space-x-6 pt-2">
              <a 
                href="https://www.linkedin.com/in/anders-adalberth-andersen-58b537215" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/AAAndersen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:andersadalberth@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            
            <div className="pt-4">
              <a href="/anders-resume.pdf" download>
                <Button className="download-btn bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6 h-auto text-base font-medium">
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Button>
              </a>
              <a href="tel:+4529362992" className="ml-4 inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <span>+45 29362992</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div 
            className={`flex justify-center ${isLoaded ? 'animate-fade-in-right' : 'opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="photo-container max-w-md w-full shadow-xl">
              <img 
                src="/lovable-uploads/2eebffc6-42b4-4ba9-b753-d710ac8e209c.png" 
                alt="Anders Adalberth Andersen" 
                className="w-full h-auto object-cover"
                loading="eager"
              />
              <div className="hover-effect"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

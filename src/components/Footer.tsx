
import { Github, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Anders<span className="text-primary">.</span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-6 mb-8">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com" 
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
            <a 
              href="tel:+4529362992" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Phone"
            >
              <Phone size={20} />
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Copenhagen, Denmark</p>
            <p>&copy; {currentYear} Anders Adalberth Andersen. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

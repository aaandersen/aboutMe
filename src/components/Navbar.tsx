
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container flex items-center justify-between">
        <a 
          href="#" 
          className="text-2xl font-semibold text-foreground tracking-tight transition-opacity hover:opacity-80"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Anders<span className="text-primary">.</span>
        </a>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => scrollToSection("about")} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection("experience")} className="nav-link">
            Experience
          </button>
          <button onClick={() => scrollToSection("skills")} className="nav-link">
            Skills
          </button>
          <button onClick={() => scrollToSection("portfolio")} className="nav-link">
            Portfolio
          </button>
          <button onClick={() => scrollToSection("contact")} className="nav-link">
            Contact
          </button>
        </nav>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in">
          <nav className="container flex flex-col py-4 space-y-4">
            <button onClick={() => scrollToSection("about")} className="nav-link text-left py-3">
              About
            </button>
            <button onClick={() => scrollToSection("experience")} className="nav-link text-left py-3">
              Experience
            </button>
            <button onClick={() => scrollToSection("skills")} className="nav-link text-left py-3">
              Skills
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="nav-link text-left py-3">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("contact")} className="nav-link text-left py-3">
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

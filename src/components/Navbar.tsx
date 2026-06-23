
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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
          ? "border-b border-white/10 bg-background/70 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-6"
      )}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-white via-neutral-300 to-neutral-500 transition-transform duration-150"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />
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
        <nav className="hidden lg:flex items-center space-x-5">
          <button onClick={() => scrollToSection("about")} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection("agents")} className="nav-link">
            Agents
          </button>
          <button onClick={() => scrollToSection("experience")} className="nav-link">
            Experience
          </button>
          <button onClick={() => scrollToSection("communities")} className="nav-link">
            Communities
          </button>
          <button onClick={() => scrollToSection("certifications")} className="nav-link">
            Certifications
          </button>
          <button onClick={() => scrollToSection("portfolio")} className="nav-link">
            Portfolio
          </button>
          <button onClick={() => scrollToSection("contact")} className="nav-link">
            Contact
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="btn-gradient ml-2 rounded-full px-5 py-2 text-sm font-semibold text-background"
          >
            Let's talk
          </button>
        </nav>
        
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full border-b border-white/10 bg-background/95 shadow-lg backdrop-blur-xl animate-fade-in">
          <nav className="container flex flex-col py-4 space-y-4">
            <button onClick={() => scrollToSection("about")} className="nav-link text-left py-3">
              About
            </button>
            <button onClick={() => scrollToSection("agents")} className="nav-link text-left py-3">
              Agents
            </button>
            <button onClick={() => scrollToSection("experience")} className="nav-link text-left py-3">
              Experience
            </button>
            <button onClick={() => scrollToSection("communities")} className="nav-link text-left py-3">
              Communities
            </button>
            <button onClick={() => scrollToSection("certifications")} className="nav-link text-left py-3">
              Certifications
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="nav-link text-left py-3">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("contact")} className="nav-link text-left py-3">
              Contact
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-gradient mt-2 rounded-full px-5 py-3 text-sm font-semibold text-background"
            >
              Let's talk
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

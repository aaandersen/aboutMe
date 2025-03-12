
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Timeline from "@/components/Timeline";
import SkillsMatrix from "@/components/SkillsMatrix";
import Portfolio from "@/components/Portfolio";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll(".scroll-reveal");
      const revealLeftElements = document.querySelectorAll(".reveal-left");
      const revealRightElements = document.querySelectorAll(".reveal-right");
      
      const revealElements = (elements: NodeListOf<Element>) => {
        elements.forEach((element) => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add("revealed");
          }
        });
      };
      
      revealElements(scrollElements);
      revealElements(revealLeftElements);
      revealElements(revealRightElements);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <Timeline />
      <SkillsMatrix />
      <Portfolio />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;

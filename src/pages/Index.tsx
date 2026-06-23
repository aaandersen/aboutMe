
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HexBackground from "@/components/HexBackground";
import HeroSection from "@/components/HeroSection";
import TechMarquee from "@/components/TechMarquee";
import AgentExpertise from "@/components/AgentExpertise";
import CodeShowcase from "@/components/CodeShowcase";
import TechStack from "@/components/TechStack";
import Timeline from "@/components/Timeline";
import Communities from "@/components/Communities";
import Certifications from "@/components/Certifications";
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
    <div className="relative min-h-screen">
      <HexBackground />
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <TechMarquee />
        <AgentExpertise />
        <CodeShowcase />
        <TechStack />
        <Timeline />
        <Communities />
        <Certifications />
        <Portfolio />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

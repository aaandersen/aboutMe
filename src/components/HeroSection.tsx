
import { useState, useEffect } from "react";
import {
  Download,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  GraduationCap,
  Briefcase,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MagneticButton from "@/components/MagneticButton";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
};

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden pt-32 md:pt-24"
      id="about"
    >
      {/* Background layers */}
      <div className="aurora" aria-hidden="true" />
      <div className="surface-gradient absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="blob -z-10 left-[-6rem] top-[-4rem] h-80 w-80 bg-white/10"
        aria-hidden="true"
      />
      <div
        className="blob -z-10 right-[-5rem] top-24 h-72 w-72 bg-white/[0.07]"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div className={`space-y-6 ${isLoaded ? "animate-fade-in-left" : "opacity-0"}`}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Anders Adalberth{" "}
              <span className="text-gradient-animate">Andersen</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Business Administration &amp; IT graduate from CBS and Technology
              Specialist at Microsoft — I develop and orchestrate AI agents,
              turning citizen development into real, lasting business value.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="chip">
                <GraduationCap className="h-4 w-4 text-primary" /> BSc · CBS 2026
              </span>
              <span className="chip">
                <Briefcase className="h-4 w-4 text-primary" /> Microsoft
              </span>
              <span className="chip">
                <MapPin className="h-4 w-4 text-primary" /> Copenhagen
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <MagneticButton>
                <a href="/anders-resume.pdf" download>
                  <Button className="btn-gradient h-auto rounded-full px-7 py-6 text-base font-semibold">
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </Button>
                </a>
              </MagneticButton>
              <MagneticButton>
                <Button
                  variant="outline"
                  onClick={() => scrollToId("contact")}
                  className="group h-auto rounded-full border-2 border-white/15 bg-white/[0.03] px-7 py-6 text-base font-semibold backdrop-blur hover:border-primary/50 hover:bg-white/[0.06]"
                >
                  Get in touch
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </MagneticButton>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {[
                { href: "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215", label: "LinkedIn", Icon: Linkedin },
                { href: "https://github.com/aaandersen", label: "GitHub", Icon: Github },
                { href: "mailto:andersadalberth@gmail.com", label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — photo */}
          <div
            className={`flex justify-center ${isLoaded ? "animate-fade-in-right" : "opacity-0"}`}
          >
            <div className="relative mx-auto w-full max-w-md animate-float">
              <div
                className="absolute -inset-5 rounded-[2rem] bg-gradient-to-tr from-white/15 via-white/10 to-white/15 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-neutral-400 to-neutral-700 p-[2px] shadow-2xl">
                <div className="overflow-hidden rounded-[1.65rem] bg-card">
                  <img
                    src="/uploads/2eebffc6-42b4-4ba9-b753-d710ac8e209c.png"
                    alt="Anders Adalberth Andersen"
                    className="h-auto w-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollToId("experience")}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-current p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-current" />
        </span>
      </button>
    </section>
  );
};

export default HeroSection;

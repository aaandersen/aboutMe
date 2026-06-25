import { useState, useEffect, useRef } from "react";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import CarouselDots from "@/components/CarouselDots";
import { handleSpotlight } from "@/lib/interactions";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  level: "Fundamentals" | "Professional";
  earned: string;
  credentialId: string;
  certificationNumber: string;
  skills: string[];
  icon: LucideIcon;
  image?: string;
  gradient: string;
  verifyUrl: string;
}

// Public Microsoft Learn profile where every credential is independently verifiable.
const LEARN_PROFILE =
  "https://learn.microsoft.com/en-us/users/andersandersen-0583/credentials/";

const certifications: Certification[] = [
  {
    id: "ai-business-professional",
    title: "Microsoft Certified: AI Business Professional",
    issuer: "Microsoft",
    level: "Professional",
    earned: "April 5, 2026",
    credentialId: "DC73384FAB1FF62F",
    certificationNumber: "5AQAA6-5D3CA2",
    skills: [
      "Understand generative AI fundamentals",
      "Manage prompts and conversations by using AI",
      "Draft and analyze business content by using AI",
    ],
    icon: Sparkles,
    image: "/uploads/ai-business-professional.png",
    gradient: "from-rose-700 to-neutral-950",
    verifyUrl:
      "https://learn.microsoft.com/en-us/users/andersandersen-0583/credentials/certification/ai-business-professional",
  },
  {
    id: "copilot-agent-admin",
    title: "Microsoft 365 Certified: Copilot and Agent Administration Fundamentals",
    issuer: "Microsoft",
    level: "Fundamentals",
    earned: "March 10, 2026",
    credentialId: "D01A960920925D8B",
    certificationNumber: "4A3A56-5BFE57",
    skills: [
      "Identify the core features and objects of Microsoft 365 services",
      "Understand data protection and governance tasks for Microsoft 365 and Copilot",
    ],
    icon: ShieldCheck,
    image: "/uploads/copilot-agent-admin-fundamentals.png",
    gradient: "from-sky-700 to-neutral-950",
    verifyUrl: LEARN_PROFILE,
  },
  {
    id: "power-platform-fundamentals",
    title: "Microsoft Certified: Power Platform Fundamentals",
    issuer: "Microsoft",
    level: "Fundamentals",
    earned: "November 1, 2025",
    credentialId: "23F5CBEAF82A9682",
    certificationNumber: "FB70BA-B4244T",
    skills: [
      "Describe the business value of Microsoft Power Platform",
      "Identify the core components of Power Platform",
      "Describe the capabilities of Power Apps, Power Automate & Power BI",
    ],
    icon: Award,
    image: "/uploads/power-platform-fundamentals.png",
    gradient: "from-violet-700 to-neutral-950",
    verifyUrl:
      "https://learn.microsoft.com/en-us/users/andersandersen-0583/credentials/certification/power-platform-fundamentals",
  },
];

const Certifications = () => {
  const [revealed, setRevealed] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
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

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = api.rootNode();
    let timer = window.setInterval(() => api.scrollNext(), 4500);
    const pause = () => window.clearInterval(timer);
    const resume = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => api.scrollNext(), 4500);
    };

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);

    return () => {
      window.clearInterval(timer);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
    };
  }, [api]);

  return (
    <section id="certifications" className="py-16 sm:py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Credentials</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            Certifications
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Microsoft certifications backing my focus on AI, Copilot, and citizen
            development — each one independently verifiable on Microsoft Learn.
          </p>
        </div>

        <div
          className="mx-auto max-w-5xl px-0 sm:px-12"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transition: "opacity .6s ease, transform .6s ease",
          }}
        >
          <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
            <CarouselContent>
              {certifications.map((cert) => {
                const Icon = cert.icon;
                return (
                  <CarouselItem key={cert.id} className="basis-full md:basis-1/2">
                    <Card
                      onMouseMove={handleSpotlight}
                      className="card-hover spotlight flex h-full flex-col overflow-hidden border-border"
                    >
                      <div
                        className={`relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br ${cert.gradient}`}
                      >
                        {cert.image ? (
                          <img
                            src={cert.image}
                            alt={`${cert.title} badge`}
                            loading="lazy"
                            className="relative z-10 h-24 w-24 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
                          />
                        ) : (
                          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                          </div>
                        )}
                        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          {cert.level}
                        </span>
                        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -left-10 -bottom-12 h-32 w-32 rounded-full bg-white/10" />
                      </div>

                      <CardContent className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {cert.issuer}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold leading-tight">
                          {cert.title}
                        </h3>

                        <div className="mt-3 flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="mr-1.5 h-4 w-4" />
                          <span>Earned {cert.earned}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {cert.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs font-normal">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <dl className="mt-5 space-y-1 border-t pt-4 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between gap-3">
                            <dt>Credential ID</dt>
                            <dd className="font-mono text-foreground/70">{cert.credentialId}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <dt>Certification no.</dt>
                            <dd className="font-mono text-foreground/70">
                              {cert.certificationNumber}
                            </dd>
                          </div>
                        </dl>

                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-5 inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Verify on Microsoft Learn
                          <ExternalLink className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden border-white/15 bg-white/[0.03] sm:flex" />
            <CarouselNext className="hidden border-white/15 bg-white/[0.03] sm:flex" />
          </Carousel>
          <CarouselDots api={api} />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={LEARN_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-sm sm:w-auto sm:max-w-none"
          >
            <Button
              variant="outline"
              className="group h-auto w-full whitespace-normal rounded-full border-2 border-white/15 bg-white/[0.03] px-5 py-4 text-center text-sm font-semibold leading-snug backdrop-blur hover:border-primary/50 hover:bg-white/[0.06] sm:w-auto sm:whitespace-nowrap sm:px-6 sm:py-5 sm:text-base"
            >
              View all credentials on Microsoft Learn
              <ExternalLink className="ml-2 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certifications;

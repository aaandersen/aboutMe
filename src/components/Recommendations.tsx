import { useEffect, useRef, useState } from "react";
import { Quote, Linkedin } from "lucide-react";
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

const LINKEDIN_RECS =
  "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215/details/recommendations/";

interface Rec {
  name: string;
  title: string;
  relation: string;
  initials: string;
  image?: string;
  text: string;
}

const RECS: Rec[] = [
  {
    name: "Dan Aakesen",
    title:
      "Executive technology advisor — digital transformation, strategic leadership & modern cloud architecture",
    relation: "Worked together on the same team · April 2026",
    initials: "DA",
    image: "/recommendations/dan-aakesen.jpg",
    text: "Anders is a rare mix of ambitious and curious. He sets the bar high for himself, but he's just as interested in learning and asking good questions as he is in hitting his goals — which, in my experience, is what makes people truly great to work with. I can recommend him wholeheartedly.",
  },
  {
    name: "Anders Fjordhøj",
    title: "Sr Program Manager @ Microsoft Copilot Acceleration Team (CAT) — Advisory",
    relation: "Senior colleague · March 2026",
    initials: "AF",
    image: "/recommendations/anders-fjordhoj.jpg",
    text: "Anders is one of the most capable and engaged people I have worked with. He is super skilled and has a curious mindset which enables him to solve any task he is given. Anders has helped me on multiple occasions and he has performed excellent in all tasks. Anders has my biggest recommendations.",
  },
];

const Avatar = ({
  image,
  initials,
  name,
}: {
  image?: string;
  initials: string;
  name: string;
}) => {
  const [error, setError] = useState(false);
  if (image && !error) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        onError={() => setError(true)}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/15"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white to-neutral-300 text-sm font-bold text-neutral-900">
      {initials}
    </span>
  );
};

const Recommendations = () => {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = api.rootNode();
    let timer = window.setInterval(() => api.scrollNext(), 6000);
    const pause = () => window.clearInterval(timer);
    const resume = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => api.scrollNext(), 6000);
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
    <section id="recommendations" className="py-16 sm:py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Recommendations</span>
          <h2 className="section-heading text-3xl font-bold md:text-4xl">What colleagues say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A few words from people I've worked with — verified on LinkedIn.
          </p>
        </div>

        <div
          className="mx-auto max-w-3xl px-0 sm:px-12"
          style={{
            transition: "opacity .6s ease, transform .6s ease",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
            <CarouselContent>
              {RECS.map((rec) => (
                <CarouselItem key={rec.name} className="basis-full">
                  <article
                    onMouseMove={handleSpotlight}
                    className="glass-card spotlight flex h-full flex-col rounded-2xl p-6 sm:p-8"
                  >
                    <Quote className="h-7 w-7 shrink-0 text-muted-foreground" />
                    <p className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">
                      {rec.text}
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                      <Avatar image={rec.image} initials={rec.initials} name={rec.name} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm font-semibold">
                          {rec.name}
                          <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                        </p>
                        <p className="text-xs leading-snug text-muted-foreground">{rec.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/80">{rec.relation}</p>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden border-white/15 bg-white/[0.03] sm:flex" />
            <CarouselNext className="hidden border-white/15 bg-white/[0.03] sm:flex" />
          </Carousel>
          <CarouselDots api={api} />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={LINKEDIN_RECS}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            See all recommendations on LinkedIn
            <Linkedin className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;

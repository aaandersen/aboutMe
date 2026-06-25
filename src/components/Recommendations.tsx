import { useEffect, useRef, useState } from "react";
import { Quote, Linkedin } from "lucide-react";
import { handleSpotlight } from "@/lib/interactions";

const LINKEDIN_RECS =
  "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215/details/recommendations/";

interface Rec {
  name: string;
  title: string;
  relation: string;
  initials: string;
  text: string;
}

const RECS: Rec[] = [
  {
    name: "Dan Aakesen",
    title:
      "Executive technology advisor — digital transformation, strategic leadership & modern cloud architecture",
    relation: "Worked together on the same team · April 2026",
    initials: "DA",
    text: "Anders is a rare mix of ambitious and curious. He sets the bar high for himself, but he's just as interested in learning and asking good questions as he is in hitting his goals — which, in my experience, is what makes people truly great to work with. I can recommend him wholeheartedly.",
  },
  {
    name: "Anders Fjordhøj",
    title: "Sr Program Manager @ Microsoft Copilot Acceleration Team (CAT) — Advisory",
    relation: "Senior colleague · March 2026",
    initials: "AF",
    text: "Anders is one of the most capable and engaged people I have worked with. He is super skilled and has a curious mindset which enables him to solve any task he is given. Anders has helped me on multiple occasions and he has performed excellent in all tasks. Anders has my biggest recommendations.",
  },
];

const Recommendations = () => {
  const [revealed, setRevealed] = useState(false);
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

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {RECS.map((rec, i) => (
            <article
              key={rec.name}
              onMouseMove={handleSpotlight}
              className="glass-card spotlight flex flex-col rounded-2xl p-6 sm:p-7"
              style={{
                transition: "opacity .6s ease, transform .6s ease",
                transitionDelay: `${i * 100}ms`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <Quote className="h-7 w-7 shrink-0 text-muted-foreground" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 sm:text-base">
                {rec.text}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white to-neutral-300 text-sm font-bold text-neutral-900">
                  {rec.initials}
                </span>
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
          ))}
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

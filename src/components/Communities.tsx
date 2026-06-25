import { useState, useEffect, useRef } from "react";
import { Building2, Users, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { handleSpotlight } from "@/lib/interactions";
import { extractEdgeColor } from "@/lib/logoColor";

interface Brand {
  name: string;
  domain: string;
}

interface Group {
  name: string;
  org: string;
  description: string;
  tags: string[];
  companies: Brand[];
  icon: LucideIcon;
  iconImg?: string;
  gradient: string;
  link?: string;
}

const groups: Group[] = [
  {
    name: "ERP — A.P. Møller group",
    org: "Microsoft community",
    description:
      "A Microsoft community I run for ERP leaders across major brands — facilitating knowledge sharing and aligning stakeholders around enterprise change.",
    tags: ["ERP", "Knowledge sharing", "Stakeholder management"],
    companies: [
      { name: "C2X", domain: "c2x.com" },
      { name: "Maersk Tankers", domain: "maersktankers.com" },
      { name: "APM Terminals", domain: "apmterminals.com" },
      { name: "Maersk Container Industry", domain: "mcicontainers.com" },
      { name: "Svitzer", domain: "svitzer.com" },
      { name: "KK Wind Solutions", domain: "kkwindsolutions.com" },
      { name: "Faerch", domain: "faerch.com" },
      { name: "Maersk Marketing Excellence", domain: "maersk.com" },
      { name: "Innargi", domain: "innargi.com" },
    ],
    icon: Building2,
    iconImg: "/uploads/maersk-star.svg",
    gradient: "linear-gradient(135deg, #0091DA, #00243D)",
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_apmaeoller-knowledgesharing-activity-7417511067469127681-Rz8u",
  },
  {
    name: "CRM — Enterprise group",
    org: "Microsoft community",
    description:
      "A Microsoft enterprise community on CRM and digital transformation — convening big brands to explore how AI agents reshape customer engagement.",
    tags: ["CRM", "Digital transformation", "Agents"],
    companies: [
      { name: "Audika", domain: "audika.com" },
      { name: "Demant", domain: "demant.com" },
      { name: "DFDS", domain: "dfds.com" },
      { name: "DSV", domain: "dsv.com" },
      { name: "Falck", domain: "falck.com" },
      { name: "FLSmidth", domain: "flsmidth.com" },
      { name: "GN Group", domain: "gn.com" },
      { name: "Jabra", domain: "jabra.com" },
      { name: "Hempel", domain: "hempel.com" },
      { name: "ISS", domain: "issworld.com" },
      { name: "Jyske Finans", domain: "jyskefinans.dk" },
      { name: "Kemp & Lauritzen", domain: "kemp-lauritzen.dk" },
      { name: "LINAK", domain: "linak.com" },
      { name: "Microsoft", domain: "microsoft.com" },
      { name: "Norican Group", domain: "noricangroup.com" },
      { name: "Radiometer", domain: "radiometer.com" },
      { name: "Ramboll", domain: "ramboll.com" },
      { name: "ROCKWOOL", domain: "rockwool.com" },
      { name: "WS Audiology", domain: "wsa.com" },
    ],
    icon: Users,
    iconImg: "/uploads/dynamics-logo.svg",
    gradient: "linear-gradient(125deg, #F25022, #FFB900 38%, #7FBA00 64%, #00A4EF)",
    link: "https://www.linkedin.com/posts/anders-adalberth-andersen-58b537215_digitaltransformation-erfa-agents-activity-7425631509304410112-7Ltf",
  },
];

const LogoTile = ({ brand }: { brand: Brand }) => {
  const [failed, setFailed] = useState(false);
  const [bg, setBg] = useState("#ffffff");

  // Local logo filename mirrors the script's slug: domain minus TLD, dashed.
  const slug = brand.domain
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <a
      href={`https://${brand.domain}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`Visit ${brand.name}`}
      style={{ backgroundColor: bg }}
      className="flex h-20 items-center justify-center rounded-xl border border-white/10 px-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {failed ? (
        <span className="text-center text-sm font-semibold text-neutral-700">
          {brand.name}
        </span>
      ) : (
        <img
          src={`/uploads/brands/${slug}.png`}
          alt={brand.name}
          title={brand.name}
          loading="lazy"
          onLoad={(e) => {
            const c = extractEdgeColor(e.currentTarget);
            if (c) setBg(c);
          }}
          onError={() => setFailed(true)}
          className="max-h-9 w-auto max-w-full object-contain"
        />
      )}
    </a>
  );
};

const BrandCarousel = ({ brands }: { brands: Brand[] }) => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = api.rootNode();
    let timer = window.setInterval(() => api.scrollNext(), 2600);
    const pause = () => window.clearInterval(timer);
    const resume = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => api.scrollNext(), 2600);
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
    <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
      <CarouselContent>
        {brands.map((brand) => (
          <CarouselItem
            key={brand.name}
            className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
          >
            <LogoTile brand={brand} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const Communities = () => {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "stacked" | "spread">("hidden");
  const [isWide, setIsWide] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  // Deal the cards in: they fade in stacked on top of each other, then spring
  // apart into the grid as you scroll down.
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("spread");
      return;
    }
    setPhase("stacked");
    const t = window.setTimeout(() => setPhase("spread"), 520);
    return () => window.clearTimeout(t);
  }, [revealed]);

  return (
    <section id="communities" className="py-16 sm:py-24" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="eyebrow mb-3">Facilitation</span>
          <h2 className="section-heading mb-4 text-3xl font-bold md:text-4xl">
            Communities I run
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            I run two Microsoft communities that bring leaders from major brands
            together — driving knowledge sharing, digital transformation, and the
            stakeholder management that turns conversation into change.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {groups.map((group, index) => {
            const Icon = group.icon;
            const stacked = isWide
              ? index === 0
                ? "translateX(52%) translateY(6px) rotate(-6deg) scale(.92)"
                : "translateX(-52%) translateY(16px) rotate(6deg) scale(.92)"
              : index === 0
                ? "translateY(12px) rotate(-2deg) scale(.95)"
                : "translateY(12px) rotate(2deg) scale(.95)";
            return (
              <div
                key={group.name}
                onMouseMove={handleSpotlight}
                className="glass-card card-hover spotlight flex flex-col overflow-hidden rounded-2xl"
                style={{
                  opacity: phase === "hidden" ? 0 : 1,
                  transform: phase === "spread" ? undefined : stacked,
                  transition:
                    "opacity .45s ease, transform .7s cubic-bezier(.22,1,.36,1)",
                  zIndex: phase === "spread" ? undefined : groups.length - index,
                }}
              >
                <div
                  className="relative flex h-20 items-center overflow-hidden px-6"
                  style={{ background: group.gradient }}
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white shadow-md backdrop-blur">
                    {group.iconImg ? (
                      <img src={group.iconImg} alt="" className="h-7 w-7 object-contain" />
                    ) : (
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="pointer-events-none absolute -right-6 -top-10 h-24 w-24 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -right-3 bottom-2 h-12 w-12 rounded-full bg-white/10" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold leading-tight">
                    {group.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{group.org}</p>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {group.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {group.link && (
                    <a
                      href={group.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-auto inline-flex items-center pt-5 text-sm font-medium text-foreground hover:underline"
                    >
                      View on LinkedIn
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Member organisations — auto-rotating logo carousels per group */}
        <div className="mx-auto mt-16 max-w-5xl space-y-10">
          {groups.map((group) => (
            <div key={group.name}>
              <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.name} · {group.companies.length} member organisations
              </p>
              <BrandCarousel brands={group.companies} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Communities;

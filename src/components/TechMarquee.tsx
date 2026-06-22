const items = [
  "Microsoft Copilot",
  "AI Agents",
  "Citizen Development",
  "Power Platform",
  "Azure",
  "Change Management",
  "Prompt Engineering",
  "Business Value",
];

const TechMarquee = () => (
  <div className="relative border-y border-white/10 bg-white/[0.02] py-5">
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 || undefined}
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-8 px-8 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                <span className="transition-colors duration-300 hover:text-foreground">
                  {item}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-cyan-400"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  </div>
);

export default TechMarquee;

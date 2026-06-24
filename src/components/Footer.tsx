
import { Github, Linkedin, Mail, Phone, ArrowUpRight } from "lucide-react";
import SecretCode from "@/components/SecretCode";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "Agents", href: "#agents" },
      { label: "Experience", href: "#experience" },
      { label: "Communities", href: "#communities" },
      { label: "Certifications", href: "#certifications" },
      { label: "Portfolio", href: "#portfolio" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "AI Usage Tracker", href: "https://aiusagetracker.org", external: true },
      { label: "The AI Cockpit", href: "https://aicockpit.org", external: true },
      { label: "Download résumé", href: "/anders-resume.pdf", download: true },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "andersadalberth@gmail.com", href: "mailto:andersadalberth@gmail.com" },
      { label: "+45 29 36 29 92", href: "tel:+4529362992" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215", external: true },
      { label: "GitHub", href: "https://github.com/aaandersen", external: true },
    ],
  },
];

const socials = [
  { href: "https://www.linkedin.com/in/anders-adalberth-andersen-58b537215", label: "LinkedIn", Icon: Linkedin },
  { href: "https://github.com/aaandersen", label: "GitHub", Icon: Github },
  { href: "mailto:andersadalberth@gmail.com", label: "Email", Icon: Mail },
  { href: "tel:+4529362992", label: "Phone", Icon: Phone },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-background/60 py-16 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/80 via-white/30 to-transparent" />
      <div className="container">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-6">
            <h2 className="font-display text-2xl font-bold">
              Anders<span className="text-muted-foreground">.</span>
            </h2>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Business Administration &amp; IT — developing and orchestrating AI
              agents into real, lasting business value.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-white/30 hover:text-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      download={link.download || undefined}
                      className="group inline-flex items-center text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {(link.external || link.download) && (
                        <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-8">
          <p className="text-xs text-muted-foreground">
            Psst — there are hidden pages. Know the magic word?
          </p>
          <SecretCode />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {currentYear} Anders Adalberth Andersen · Copenhagen, Denmark
          </p>
          <p className="text-xs">Built with React, Vite &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

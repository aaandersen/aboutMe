
import { Github, Linkedin, Mail, Phone } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Agents", href: "#agents" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
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
    <footer className="relative border-t border-white/10 bg-background/60 py-14 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-sky-400" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Anders<span className="text-primary">.</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Business Administration &amp; IT · AI &amp; Citizen Development
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="transition-colors hover:text-primary">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Copenhagen, Denmark</p>
            <p>&copy; {currentYear} Anders Adalberth Andersen. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

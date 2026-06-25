import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useEggs } from "./EasterEggProvider";

interface Line {
  kind: "in" | "out" | "sys";
  text: string;
}

const PROMPT = "anders@portfolio:~$";

const BANNER = [
  "    _    _    _",
  "   / \\  | |  | |    Anders Adalberth Andersen",
  "  / _ \\ | |  | |    Business Administration & IT · Microsoft AI",
  " / ___ \\| |__| |    Developing & orchestrating AI agents",
  "/_/   \\_\\____/_|    type 'help' to get started",
];

const HELP = [
  "Available commands:",
  "  about        who I am",
  "  whoami       the short version",
  "  projects     things I've built",
  "  skills       my toolkit",
  "  experience   work history",
  "  education    CBS & courses",
  "  certs        certifications",
  "  contact      how to reach me",
  "  social       links",
  "  cv           download my résumé",
  "  neofetch     system info :)",
  "  secrets      a hint about hidden eggs",
  "  clear        clear the screen",
  "  exit         close the terminal",
];

const ABOUT = [
  "Anders Adalberth Andersen — 24, Copenhagen.",
  "BSc in Business Administration & Information Systems (CBS, 2026),",
  "now on the MSc (IT Management & Business Economics).",
  "Technology Specialist (Intern) at Microsoft AI.",
  "I build and orchestrate AI agents and help non-technical people",
  "turn citizen development into real, lasting business value.",
];

const PROJECTS = [
  "AI Usage Tracker   analytics for AI/Copilot usage      aiusagetracker.org",
  "The AI Cockpit     vote & prioritise AI use-cases       aicockpit.org",
  "FamTime            AI family-time scheduler (Firebase)  private",
  "JoeTunes           song-voting web app for cafés        private",
  "Svaneeng           calendar/booking system              private",
  "Bachelor thesis    Citizen Development of AI Agents @ Carlsberg (× Microsoft)",
];

const SKILLS = [
  "Agents      Copilot Studio · M365 Agents SDK · MCP · multi-agent orchestration",
  "Code        TypeScript · React · Node · Azure Functions · Python",
  "Cloud       Azure Static Web Apps · Entra ID · Blob/Table Storage",
  "Data/AI     prompt design · grounding · usage analytics · governance",
];

const EXPERIENCE = [
  "2025– Technology Specialist (Intern) · Microsoft AI",
  "      Customer adoption of AI & Copilot — agents & citizen development.",
  "      + content creation, teaching, operations earlier on.",
];

const EDUCATION = [
  "BSc Business Administration & Information Systems · CBS · 2026 (180 ECTS)",
  "MSc IT Management & Business Economics · CBS · in progress",
  "Tip: run 'open courses' or type 'kurser' in the footer to see every course.",
];

const CERTS = [
  "Microsoft Certified: AI Business Professional",
  "Microsoft 365 Certified: Copilot & Agent Administration Fundamentals",
  "Microsoft Certified: Power Platform Fundamentals",
  "Verify: learn.microsoft.com/users/andersandersen-0583",
];

const CONTACT = [
  "email     andersadalberth@gmail.com",
  "phone     +45 29 36 29 92",
  "location  Copenhagen, Denmark",
];

const SOCIAL = [
  "linkedin  linkedin.com/in/anders-adalberth-andersen-58b537215",
  "github    github.com/aaandersen",
];

const NEOFETCH = [
  "anders@portfolio",
  "-----------------",
  "OS:       AI Agents (orchestrated)",
  "Host:     Microsoft AI",
  "Kernel:   Copilot Studio + M365 Agents SDK",
  "Shell:    citizen-development",
  "Uptime:   since 2001",
  "Editor:   VS Code + Copilot",
  "Stack:    React · TypeScript · Azure",
  "Coffee:   ████████████░░  92%",
];

const SECRETS = [
  "There are hidden pages & effects all over this site.",
  "Try the magic-word field in the footer, or press ⌘/Ctrl + K.",
  "Words worth trying: matrix · confetti · neon · zen · agent · arcade · carlsberg",
];

/** A retro fake terminal with real info about me. */
const Terminal = ({ onClose }: { onClose: () => void }) => {
  const { runWord } = useEggs();
  const [lines, setLines] = useState<Line[]>(() => [
    ...BANNER.map((text) => ({ kind: "sys" as const, text })),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const exec = (raw: string): Line[] | "CLEAR" | "CLOSE" => {
    const trimmed = raw.trim();
    const [cmd, ...rest] = trimmed.split(/\s+/);
    const c = (cmd || "").toLowerCase();
    const arg = rest.join(" ").toLowerCase();
    const out = (arr: string[]): Line[] => arr.map((text) => ({ kind: "out", text }));

    switch (c) {
      case "":
        return [];
      case "help":
      case "?":
        return out(HELP);
      case "about":
        return out(ABOUT);
      case "whoami":
        return out(["anders — builder of AI agents @ Microsoft AI."]);
      case "projects":
        return out(PROJECTS);
      case "skills":
        return out(SKILLS);
      case "experience":
      case "work":
        return out(EXPERIENCE);
      case "education":
      case "edu":
        return out(EDUCATION);
      case "certs":
      case "certifications":
        return out(CERTS);
      case "contact":
        return out(CONTACT);
      case "social":
      case "links":
        return out(SOCIAL);
      case "neofetch":
        return out(NEOFETCH);
      case "secrets":
        return out(SECRETS);
      case "cv":
      case "resume":
        runWord("cv");
        return out(["▶ downloading résumé…"]);
      case "ls":
        return out(["about  projects  skills  experience  education  certs  secrets  cv"]);
      case "sudo":
        return out(["Nice try — you already have root on this site 😉"]);
      case "open":
        if (arg.includes("linkedin")) { open("https://www.linkedin.com/in/anders-adalberth-andersen-58b537215"); return out(["opening LinkedIn…"]); }
        if (arg.includes("github")) { open("https://github.com/aaandersen"); return out(["opening GitHub…"]); }
        if (arg.includes("course") || arg.includes("kurser")) { runWord("kurser"); return "CLOSE"; }
        if (arg.includes("cockpit")) { open("https://aicockpit.org"); return out(["opening The AI Cockpit…"]); }
        if (arg.includes("tracker")) { open("https://aiusagetracker.org"); return out(["opening AI Usage Tracker…"]); }
        return out([`open: don't know how to open '${arg || "that"}'.`]);
      case "echo":
        return out([rest.join(" ")]);
      case "date":
        return out([new Date().toString()]);
      case "clear":
      case "cls":
        return "CLEAR";
      case "exit":
      case "quit":
      case "close":
        return "CLOSE";
      default: {
        const res = runWord(trimmed);
        if (res.result === "hit") return out([`▶ running '${trimmed}'…`]);
        if (res.result === "near" && res.suggestion)
          return out([`command not found: ${c} — did you mean '${res.suggestion}'?`]);
        return out([`command not found: ${c}. type 'help'.`]);
      }
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input;
    const echoed: Line = { kind: "in", text: `${PROMPT} ${raw}` };
    const result = exec(raw);
    if (raw.trim()) setHistory((h) => [...h, raw]);
    setHistIdx(-1);
    setInput("");
    if (result === "CLOSE") {
      onClose();
      return;
    }
    if (result === "CLEAR") {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, echoed, ...result]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">anders@portfolio — zsh</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.kind === "in"
                  ? "text-foreground"
                  : line.kind === "sys"
                  ? "whitespace-pre text-foreground/90"
                  : "whitespace-pre-wrap text-foreground/75"
              }
            >
              {line.text || "\u00a0"}
            </div>
          ))}
          <form onSubmit={submit} className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-foreground/60">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="flex-1 bg-transparent text-foreground caret-foreground outline-none"
            />
          </form>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

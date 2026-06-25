import {
  Rocket,
  GraduationCap,
  FileDown,
  PartyPopper,
  Palette,
  Wind,
  Hexagon,
  CloudRain,
  Command as CommandIcon,
  TerminalSquare,
  Bot,
  Gamepad2,
  Beer,
  type LucideIcon,
} from "lucide-react";

export type ModeName = "matrix" | "neon" | "zen";
export type PulseName = "confetti" | "hexstorm";
export type OverlayName = "terminal" | "agent" | "palette";

/** Helpers an egg command can use when it runs. */
export interface EggActions {
  navigate: (to: string) => void;
  toggleMode: (mode: ModeName) => void;
  pulse: (pulse: PulseName) => void;
  openOverlay: (overlay: OverlayName) => void;
  download: (href: string) => void;
}

export interface EggCommand {
  id: string;
  label: string;
  /** Short description shown in the palette / achievements tray. */
  blurb: string;
  /** Playful clue shown while the egg is still locked. */
  hint: string;
  /** Trigger words (lowercase) accepted by the magic-word field & palette. */
  words: string[];
  icon: LucideIcon;
  run: (a: EggActions) => void;
  /** When false the egg is not yet wired up and stays hidden. Defaults to true. */
  ready?: boolean;
}

/**
 * The full registry of easter eggs. Each one can be triggered from the footer
 * magic-word field, the Cmd/Ctrl+K command palette, or the achievements tray.
 */
export const EGGS: EggCommand[] = [
  {
    id: "agent",
    label: "Ask my agent",
    blurb: "Chat with an AI agent version of me.",
    hint: "talk to the machine…",
    words: ["agent", "copilot", "chat", "ai"],
    icon: Bot,
    run: (a) => a.openOverlay("agent"),
    ready: false,
  },
  {
    id: "terminal",
    label: "Terminal",
    blurb: "A retro shell — type `help` to explore.",
    hint: "developers love a good shell…",
    words: ["terminal", "cli", "shell", "sudo", "bash"],
    icon: TerminalSquare,
    run: (a) => a.openOverlay("terminal"),
    ready: false,
  },
  {
    id: "arcade",
    label: "Arcade",
    blurb: "Snake, 2048 & Pong — insert coin.",
    hint: "insert coin…",
    words: ["arcade", "games", "snake", "2048", "pong", "play"],
    icon: Gamepad2,
    run: (a) => a.navigate("/arcade"),
    ready: false,
  },
  {
    id: "astro",
    label: "Asteroids",
    blurb: "A vector Asteroids minigame.",
    hint: "shoot for the stars…",
    words: ["astro", "asteroids", "space"],
    icon: Rocket,
    run: (a) => a.navigate("/astro"),
  },
  {
    id: "carlsberg",
    label: "Carlsberg thesis",
    blurb: "Deep-dive into my Microsoft × Carlsberg thesis.",
    hint: "probably the best thesis in the world…",
    words: ["carlsberg", "thesis", "speciale", "beer"],
    icon: Beer,
    run: (a) => a.navigate("/carlsberg"),
    ready: false,
  },
  {
    id: "kurser",
    label: "Courses",
    blurb: "Every university course I've taken.",
    hint: "back to school…",
    words: ["kurser", "kruser", "courses", "uddannelse"],
    icon: GraduationCap,
    run: (a) => a.navigate("/kurser"),
  },
  {
    id: "matrix",
    label: "Matrix rain",
    blurb: "Digital rain takes over the screen.",
    hint: "follow the white rabbit…",
    words: ["matrix", "neo", "rain"],
    icon: CloudRain,
    run: (a) => a.toggleMode("matrix"),
  },
  {
    id: "neon",
    label: "Neon mode",
    blurb: "Break the monochrome with a neon skin.",
    hint: "break the monochrome…",
    words: ["neon", "aurora", "color", "colour", "rgb"],
    icon: Palette,
    run: (a) => a.toggleMode("neon"),
  },
  {
    id: "zen",
    label: "Zen mode",
    blurb: "A calm, breathing full-screen moment.",
    hint: "just breathe…",
    words: ["zen", "calm", "breathe", "relax"],
    icon: Wind,
    run: (a) => a.toggleMode("zen"),
  },
  {
    id: "confetti",
    label: "Confetti",
    blurb: "A celebratory burst of confetti.",
    hint: "celebrate something…",
    words: ["confetti", "party", "celebrate", "tillykke"],
    icon: PartyPopper,
    run: (a) => a.pulse("confetti"),
  },
  {
    id: "hexstorm",
    label: "Hex storm",
    blurb: "Shake the carbon grid with a shockwave.",
    hint: "stir the grid…",
    words: ["hexstorm", "boom", "storm", "shake"],
    icon: Hexagon,
    run: (a) => a.pulse("hexstorm"),
  },
  {
    id: "cv",
    label: "Download résumé",
    blurb: "Grab my résumé as a PDF.",
    hint: "the paperwork…",
    words: ["cv", "resume", "resumé", "résumé"],
    icon: FileDown,
    run: (a) => a.download("/anders-resume.pdf"),
  },
  {
    id: "palette",
    label: "Command palette",
    blurb: "Open the command palette (or press ⌘/Ctrl K).",
    hint: "every good app has one… ⌘K",
    words: ["help", "menu", "commands", "palette", "?"],
    icon: CommandIcon,
    run: (a) => a.openOverlay("palette"),
  },
];

export const READY_EGGS: EggCommand[] = EGGS.filter((e) => e.ready !== false);

export const WORD_TO_EGG: Record<string, EggCommand> = (() => {
  const map: Record<string, EggCommand> = {};
  for (const egg of READY_EGGS) {
    for (const word of egg.words) map[word] = egg;
  }
  return map;
})();

export const getEggById = (id: string) => EGGS.find((e) => e.id === id);

/** Levenshtein distance — used for "did you mean…" near-miss hints. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const row = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = temp;
    }
  }
  return row[n];
}

/** Returns the closest trigger word within edit distance 2 (for hints). */
export function nearestWord(input: string): string | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  let best: string | null = null;
  let bestDist = Infinity;
  for (const word of Object.keys(WORD_TO_EGG)) {
    if (word === value) return null; // exact match handled elsewhere
    const d = levenshtein(value, word);
    if (d < bestDist) {
      bestDist = d;
      best = word;
    }
  }
  return bestDist > 0 && bestDist <= 2 ? best : null;
}

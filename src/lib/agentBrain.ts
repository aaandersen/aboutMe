// Shared scripted "agent" brain — used by both the hero chat and the
// command-palette AgentChat easter egg so the answers stay in sync.

export interface Intent {
  keywords: string[];
  answer: string;
}

export const INTENTS: Intent[] = [
  {
    keywords: ["hello", "hey", "hej", "goddag", "hi ", "hi!", "hey!"],
    answer:
      "Hi! 👋 I'm a little scripted agent standing in for Anders. Ask me about his work, projects, studies, or how to reach him.",
  },
  {
    keywords: ["who", "about", "yourself", "tell me about anders", "background"],
    answer:
      "Anders Adalberth Andersen — 24, based in Copenhagen. BSc in Business Administration & IT from CBS, now on the MSc. He's a Technology Specialist (Intern) at Microsoft AI, focused on building and orchestrating AI agents.",
  },
  {
    keywords: ["microsoft", "work", "job", "role", "do you do", "doing", "currently"],
    answer:
      "He works at Microsoft AI as a Technology Specialist (Intern) — helping customers adopt AI & Copilot, with a focus on agents and citizen development: turning AI enthusiasm into real, lasting business value.",
  },
  {
    keywords: ["agent", "copilot", "orchestrat", "mcp", "automation"],
    answer:
      "Agents are his thing 🤖 — designing them in Copilot Studio & the M365 Agents SDK, then orchestrating them into governed, multi-agent workflows over MCP. Grounded, measurable, and built to last.",
  },
  {
    keywords: ["project", "built", "portfolio", "made", "showcase"],
    answer:
      "A few highlights: the AI Usage Tracker (aiusagetracker.org), The AI Cockpit (aicockpit.org), FamTime (an AI family-time scheduler), JoeTunes (café song-voting), Svaneeng (a calendar system), and his Microsoft × Carlsberg bachelor thesis. Type 'arcade' or open the command palette for more secrets!",
  },
  {
    keywords: ["famtime", "family"],
    answer:
      "FamTime is an AI-driven planner that finds free slots across the family's calendars and suggests when to spend time together. Built with React, TypeScript & Firebase.",
  },
  {
    keywords: ["joetunes", "joe", "juice", "music", "song"],
    answer:
      "JoeTunes lets guests at Joe & The Juice vote on the in-café soundtrack — turning the playlist into a shared, interactive experience.",
  },
  {
    keywords: ["svane", "calendar", "booking"],
    answer: "Svaneeng is a calendar & scheduling system that brings bookings and events into one shared overview.",
  },
  {
    keywords: ["tracker", "usage"],
    answer:
      "The AI Usage Tracker is a full-stack analytics dashboard for AI & Copilot usage across an organization — leaderboards, insights and a built-in chat agent, on Azure SWA + Functions. → aiusagetracker.org",
  },
  {
    keywords: ["cockpit"],
    answer:
      "The AI Cockpit helps teams surface, vote on and prioritize AI use-cases and agent ideas — turning enthusiasm into an actionable pipeline. → aicockpit.org",
  },
  {
    keywords: ["thesis", "carlsberg", "speciale", "bachelor", "research"],
    answer:
      "His bachelor thesis (with Microsoft) studied how non-technical employees at Carlsberg create real, lasting business value through citizen development of AI agents in Copilot — a qualitative single-case study with 15 informants & 17 interviews. Type 'carlsberg' to dive deeper.",
  },
  {
    keywords: ["study", "studie", "education", "cbs", "university", "degree", "course", "kurser", "school"],
    answer:
      "He studied BSc Business Administration & Information Systems at CBS (graduated 2026, 180 ECTS) and is now doing the MSc in IT Management & Business Economics. Type 'kurser' in the footer to see every course.",
  },
  {
    keywords: ["skill", "tech", "stack", "language", "tools", "framework"],
    answer:
      "Toolkit: TypeScript, React, Node, Azure Functions & Python; Copilot Studio, the M365 Agents SDK and MCP for agents; Azure SWA, Entra ID and storage for the cloud side.",
  },
  {
    keywords: ["cert", "certified", "certification"],
    answer:
      "He holds Microsoft Certified: AI Business Professional, M365 Copilot & Agent Administration Fundamentals, and Power Platform Fundamentals.",
  },
  {
    keywords: ["contact", "email", "reach", "mail", "phone", "call"],
    answer:
      "📫 andersadalberth@gmail.com · ☎ +45 29 36 29 92 · LinkedIn: /in/anders-adalberth-andersen-58b537215 · GitHub: @aaandersen.",
  },
  {
    keywords: ["hire", "available", "opportunity", "freelance", "looking", "recruit"],
    answer:
      "He's always open to interesting AI/agent work and conversations. Best way in is email (andersadalberth@gmail.com) or LinkedIn — he usually replies within a day.",
  },
  {
    keywords: ["where", "location", "live", "copenhagen", "denmark", "based"],
    answer: "Copenhagen, Denmark 🇩🇰.",
  },
  {
    keywords: ["secret", "egg", "hidden", "magic", "konami"],
    answer:
      "Oh, there are plenty 😏 — try the magic-word field in the footer or press ⌘/Ctrl+K. Words to try: matrix, confetti, neon, zen, terminal, arcade, carlsberg. There's even a Konami code.",
  },
  {
    keywords: ["fun", "fact", "hobby", "interesting"],
    answer:
      "Fun fact: Anders wrote a bachelor thesis with Microsoft on citizen development of AI agents at Carlsberg — and built this whole site (plus a hidden Asteroids game) himself.",
  },
  {
    keywords: ["joke"],
    answer: "Why did the AI agent cross the road? Because the orchestration graph told it to. 🤖",
  },
  {
    keywords: ["thank", "thanks", "cheers", "tak"],
    answer: "Anytime! 🙌 Anything else you'd like to know?",
  },
];

export const SUGGESTIONS = [
  "What do you do?",
  "Show me your projects",
  "What did you study?",
  "How can I reach you?",
];

export function respond(input: string): string {
  const q = input.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => q.includes(k))) return intent.answer;
  }
  return "I'm a scripted demo agent, so I might not have that exact answer. Try asking about my projects, my work at Microsoft AI, my studies, or how to get in touch. (For the real deal, Anders builds production agents in Copilot Studio + the M365 Agents SDK.)";
}

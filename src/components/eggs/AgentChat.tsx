import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

interface Msg {
  from: "agent" | "user";
  text: string;
}

interface Intent {
  keywords: string[];
  answer: string;
}

const INTENTS: Intent[] = [
  {
    keywords: ["hi", "hello", "hey", "yo", "hej", "goddag"],
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

const SUGGESTIONS = [
  "What do you do?",
  "Show me your projects",
  "What did you study?",
  "How can I reach you?",
];

function respond(input: string): string {
  const q = input.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => q.includes(k))) return intent.answer;
  }
  return "I'm a scripted demo agent, so I might not have that exact answer. Try asking about my projects, my work at Microsoft AI, my studies, or how to get in touch. (For the real deal, Anders builds production agents in Copilot Studio + the M365 Agents SDK.)";
}

/** A scripted "ask my agent" chat — the signature easter egg for an agent builder. */
const AgentChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "agent",
      text: "Hi! I'm Anders' agent — a scripted stand-in. Ask me anything about his work, projects or studies. 👇",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    const answer = respond(q);
    const delay = 450 + Math.min(900, answer.length * 6);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "agent", text: answer }]);
      setTyping(false);
    }, delay);
  };

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[78vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c0c0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white to-neutral-400 text-neutral-900">
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Anders' agent</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3" /> scripted demo · always on
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close chat">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.from === "user"
                    ? "rounded-br-md bg-white text-neutral-900"
                    : "rounded-bl-md border border-white/10 bg-white/[0.05] text-foreground/90"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-white/25 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something…"
            aria-label="Message"
            className="h-10 flex-1 rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-white/30"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentChat;

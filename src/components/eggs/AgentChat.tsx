import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { SUGGESTIONS, respond } from "@/lib/agentBrain";

interface Msg {
  from: "agent" | "user";
  text: string;
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

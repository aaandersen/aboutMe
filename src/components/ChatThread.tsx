import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { SUGGESTIONS } from "@/lib/agentBrain";
import { useChat } from "@/components/ChatProvider";

/** The shared message list + suggestions + input, used by both chat surfaces. */
const ChatThread = () => {
  const { messages, typing, send } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const submit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setInput("");
    send(q);
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
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
      </div>

      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-white/25 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t border-white/10 p-3"
      >
        <input
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
    </>
  );
};

export default ChatThread;

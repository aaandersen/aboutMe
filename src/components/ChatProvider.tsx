import { createContext, useContext, useState, type ReactNode } from "react";
import { respond } from "@/lib/agentBrain";

export interface ChatMsg {
  from: "agent" | "user";
  text: string;
}

export const CHAT_GREETING =
  "Hej! 👋 I'm Anders' virtual stand-in. Ask me anything about his work at Microsoft AI, his projects and studies — or how to get in touch.";

interface ChatContextValue {
  messages: ChatMsg[];
  typing: boolean;
  send: (text: string) => void;
  /** Whether the inline hero chat is currently on-screen (drives the floating bubble). */
  heroInView: boolean;
  setHeroInView: (v: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};

/**
 * Holds the single, shared "Chat with Anders" conversation so the inline hero
 * chat and the floating Messenger-style bubble talk to the same thread.
 */
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([{ from: "agent", text: CHAT_GREETING }]);
  const [typing, setTyping] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    const history: ChatMsg[] = [...messages, { from: "user", text: q }];
    setMessages(history);
    setTyping(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { reply?: string };
      const reply = data.reply?.trim();
      if (!reply) throw new Error("empty");
      setMessages((m) => [...m, { from: "agent", text: reply }]);
    } catch {
      // LLM not configured or unreachable — use the built-in scripted answers.
      setMessages((m) => [...m, { from: "agent", text: respond(q) }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, typing, send, heroInView, setHeroInView }}>
      {children}
    </ChatContext.Provider>
  );
};

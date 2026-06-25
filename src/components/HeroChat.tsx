import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useChat } from "@/components/ChatProvider";
import ChatThread from "@/components/ChatThread";

/** A large, inline "chat with Anders" window that replaces the hero portrait. */
const HeroChat = () => {
  const { setHeroInView } = useChat();
  const rootRef = useRef<HTMLDivElement>(null);

  // Tell the floating bubble whether this inline chat is on-screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      setHeroInView(false);
    };
  }, [setHeroInView]);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-md">
      <div
        className="absolute -inset-5 rounded-[2rem] bg-gradient-to-tr from-white/15 via-white/10 to-white/15 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-neutral-400 to-neutral-700 p-[2px] shadow-2xl">
        <div className="flex h-[30rem] flex-col overflow-hidden rounded-[1.65rem] bg-[#0c0c0c] sm:h-[32rem]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="relative shrink-0">
              <img
                src="/uploads/anders-portrait.png"
                alt="Anders Adalberth Andersen"
                loading="eager"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
                style={{ objectPosition: "50% 15%" }}
              />
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#0c0c0c] bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-tight">Chat with Anders</p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> virtual stand-in · always on
              </p>
            </div>
          </div>

          <ChatThread />
        </div>
      </div>
    </div>
  );
};

export default HeroChat;

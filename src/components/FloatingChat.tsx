import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useChat } from "@/components/ChatProvider";
import ChatThread from "@/components/ChatThread";

const PORTRAIT = "/uploads/anders-portrait.png";

/**
 * A Messenger-style floating chat. Once the inline hero chat scrolls out of
 * view, a circular profile-photo bubble appears in the bottom-right corner;
 * tapping it opens a panel that continues the same conversation.
 */
const FloatingChat = () => {
  const { heroInView } = useChat();
  const [open, setOpen] = useState(false);

  // The bubble lives in the corner only once the inline hero chat is gone.
  const show = !heroInView;

  // Tuck the panel away again if we scroll back up to the inline chat.
  useEffect(() => {
    if (heroInView) setOpen(false);
  }, [heroInView]);

  return (
    <>
      {/* Chat panel — pops out of (and folds back behind) the bubble. */}
      <div
        className={`fixed bottom-24 right-4 z-[115] w-[22rem] max-w-[calc(100vw-2rem)] origin-bottom-right transition-all duration-300 sm:right-5 ${
          open && show
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
        aria-hidden={!(open && show)}
      >
        <div className="flex h-[28rem] max-h-[68vh] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c0c0c] shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="relative shrink-0">
              <img
                src={PORTRAIT}
                alt="Anders Adalberth Andersen"
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover"
                style={{ objectPosition: "50% 15%" }}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0c0c0c] bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">Chat with Anders</p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> virtual stand-in
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Minimize chat"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ChatThread />
        </div>
      </div>

      {/* Profile-photo bubble. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Minimize chat" : "Chat with Anders"}
        className={`fixed bottom-5 right-4 z-[115] h-16 w-16 rounded-full bg-gradient-to-br from-white via-neutral-400 to-neutral-700 p-[2px] shadow-2xl transition-all duration-300 hover:scale-105 sm:right-5 ${
          show ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"
        }`}
      >
        <img
          src={PORTRAIT}
          alt="Chat with Anders"
          className="h-full w-full rounded-full object-cover"
          style={{ objectPosition: "50% 15%" }}
        />
        {open ? (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-neutral-900 text-white">
            <X className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-400" />
        )}
      </button>
    </>
  );
};

export default FloatingChat;

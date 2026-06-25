import { useEffect } from "react";

/** A calm full-screen breathing overlay. Click or press Esc to leave. */
const ZenMode = ({ onExit }: { onExit: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <div
      className="fixed inset-0 z-[120] flex cursor-pointer flex-col items-center justify-center bg-background/90 backdrop-blur-xl"
      onClick={onExit}
      role="button"
      aria-label="Exit zen mode"
    >
      <div className="egg-breathe flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
        <div className="h-24 w-24 rounded-full bg-white/[0.07]" />
      </div>
      <p className="egg-breathe mt-10 text-sm uppercase tracking-[0.35em] text-muted-foreground">
        breathe
      </p>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/70">
        click or press Esc to leave
      </span>
    </div>
  );
};

export default ZenMode;

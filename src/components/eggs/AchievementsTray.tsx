import { useState } from "react";
import { Lock, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { READY_EGGS, type EggCommand } from "@/lib/eggs";

interface Props {
  discovered: string[];
  onRun: (egg: EggCommand) => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

/** Bottom-left collectible tray that gamifies finding the hidden eggs. */
const AchievementsTray = ({ discovered, onRun, soundOn, onToggleSound }: Props) => {
  const [open, setOpen] = useState(false);
  const total = READY_EGGS.length;
  const found = discovered.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 left-4 z-[110] flex items-center gap-2 rounded-full border border-white/12 bg-background/80 px-3.5 py-2 text-xs font-medium text-foreground/80 shadow-lg backdrop-blur transition-colors hover:border-white/25 hover:text-foreground"
        aria-label="Hidden secrets found"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {found}/{total} secrets
      </button>

      {open && (
        <div className="fixed bottom-16 left-4 z-[140] w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/12 bg-[#0d0d0d] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold">Hidden secrets</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleSound}
                aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
                className="text-muted-foreground hover:text-foreground"
              >
                {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
          <ul className="max-h-[55vh] overflow-y-auto p-2">
            {READY_EGGS.map((egg) => {
              const Icon = egg.icon;
              const got = discovered.includes(egg.id);
              return (
                <li key={egg.id}>
                  <button
                    type="button"
                    disabled={!got}
                    onClick={() => got && onRun(egg)}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left ${
                      got ? "hover:bg-white/[0.05]" : "cursor-default opacity-70"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                      {got ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {got ? egg.label : "???"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {got ? egg.blurb : egg.hint}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/10 px-4 py-2 text-[11px] text-muted-foreground">
            Type a magic word in the footer, or press ⌘/Ctrl K.
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementsTray;

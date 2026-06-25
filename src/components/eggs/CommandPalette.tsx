import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import { READY_EGGS, type EggCommand } from "@/lib/eggs";

interface Props {
  onClose: () => void;
  onRun: (egg: EggCommand) => void;
  discovered: string[];
}

/** Raycast-style command palette listing every (ready) easter egg. */
const CommandPalette = ({ onClose, onRun, discovered }: Props) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return READY_EGGS;
    return READY_EGGS.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.blurb.toLowerCase().includes(q) ||
        e.words.some((w) => w.includes(q))
    );
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const egg = results[active];
        if (egg) onRun(egg);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, active, onClose, onRun]);

  return (
    <div
      className="fixed inset-0 z-[140] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-[#0d0d0d] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands & secrets…"
            className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</li>
          )}
          {results.map((egg, i) => {
            const Icon = egg.icon;
            const found = discovered.includes(egg.id);
            return (
              <li key={egg.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => onRun(egg)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === active ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {egg.label}
                      {found && <Check className="h-3.5 w-3.5 text-muted-foreground" />}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{egg.blurb}</span>
                  </span>
                  <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                    {egg.words[0]}
                  </kbd>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-white/10 px-4 py-2 text-[11px] text-muted-foreground">
          ↑↓ navigate · ↵ run · {discovered.length}/{READY_EGGS.length} secrets found
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

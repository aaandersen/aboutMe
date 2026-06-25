import { useState } from "react";
import { KeyRound, Lock } from "lucide-react";
import { useEggs } from "@/components/eggs/EasterEggProvider";

const SecretCode = () => {
  const { runWord } = useEggs();
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = value.trim();
    if (!word) return;
    const { result, suggestion } = runWord(word);
    if (result === "hit") {
      setValue("");
      setFeedback(null);
      return;
    }
    setValue("");
    setFeedback(
      result === "near" && suggestion
        ? `close \u2014 did you mean “${suggestion}”?`
        : "not quite \u2014 press ⌘/Ctrl K for hints"
    );
    window.setTimeout(() => setFeedback(null), 2800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs items-stretch gap-2 sm:max-w-sm"
    >
      <div className="relative flex-1">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="password"
          inputMode="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Secret password"
          placeholder={feedback ?? "enter the magic word"}
          autoComplete="new-password"
          spellCheck={false}
          className={`h-11 w-full rounded-full border bg-white/[0.04] pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:bg-white/[0.06] ${
            feedback
              ? "border-white/50 placeholder:text-foreground/60"
              : "border-white/15 focus:border-white/35"
          }`}
        />
      </div>
      <button
        type="submit"
        aria-label="Unlock"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-foreground transition-all hover:border-white/35 hover:bg-white/[0.08] active:scale-95"
      >
        <KeyRound className="h-4 w-4" />
      </button>
    </form>
  );
};

export default SecretCode;

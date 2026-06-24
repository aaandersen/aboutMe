import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Lock } from "lucide-react";

/** Code words that unlock hidden pages. Add more as the fun pages grow. */
const SECRET_CODES: Record<string, string> = {
  astro: "/astro",
  kurser: "/kurser",
  kruser: "/kurser",
  courses: "/kurser",
};

const SecretCode = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [miss, setMiss] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = value.trim().toLowerCase();
    if (!code) return;
    const path = SECRET_CODES[code];
    if (path) {
      navigate(path);
      return;
    }
    setMiss(true);
    setValue("");
    window.setTimeout(() => setMiss(false), 1400);
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
          placeholder={miss ? "wrong word — try again" : "enter the magic word"}
          autoComplete="new-password"
          spellCheck={false}
          className={`h-11 w-full rounded-full border bg-white/[0.04] pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:bg-white/[0.06] ${
            miss
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

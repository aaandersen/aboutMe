import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

/** Code words that unlock hidden pages. Add more as the fun pages grow. */
const SECRET_CODES: Record<string, string> = {
  astro: "/astro",
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
    window.setTimeout(() => setMiss(false), 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Secret code word"
          placeholder={miss ? "not quite…" : "secret word…"}
          autoComplete="off"
          spellCheck={false}
          className={`w-40 rounded-full border bg-white/[0.03] py-1.5 pl-8 pr-3 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:w-48 focus:bg-white/[0.05] ${
            miss ? "border-white/40" : "border-white/10 focus:border-white/25"
          }`}
        />
      </div>
    </form>
  );
};

export default SecretCode;

import { useEffect, useState } from "react";

const PHRASES = [
  "build AI agents",
  "orchestrate Copilot",
  "turn enthusiasm into value",
  "ship citizen development",
];

const REDUCE =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A typewriter line that cycles through what I do. */
const RoleRotator = () => {
  const [text, setText] = useState(REDUCE ? PHRASES[0] : "");
  const [phrase, setPhrase] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (REDUCE) return;
    const current = PHRASES[phrase];
    let delay = deleting ? 45 : 70;
    if (!deleting && text === current) delay = 1600;
    else if (deleting && text === "") delay = 350;

    const t = window.setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setPhrase((p) => (p + 1) % PHRASES.length);
      } else {
        setText(
          deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)
        );
      }
    }, delay);
    return () => window.clearTimeout(t);
  }, [text, deleting, phrase]);

  return (
    <p className="font-mono text-base text-foreground/80 sm:text-lg">
      <span className="text-muted-foreground">I </span>
      <span className="text-foreground">{text}</span>
      <span
        className="ml-0.5 inline-block w-[2px] animate-pulse bg-foreground align-middle"
        style={{ height: "1.05em" }}
        aria-hidden="true"
      />
    </p>
  );
};

export default RoleRotator;

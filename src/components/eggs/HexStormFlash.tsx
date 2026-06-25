import { useEffect, useState } from "react";

/** A one-shot shockwave: a brief expanding ring + a screen shake. */
const HexStormFlash = ({ trigger }: { trigger: number }) => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setOn(true);
    document.body.classList.add("egg-shake");
    const t1 = window.setTimeout(() => document.body.classList.remove("egg-shake"), 550);
    const t2 = window.setTimeout(() => setOn(false), 950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.classList.remove("egg-shake");
    };
  }, [trigger]);

  if (!on) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[125] flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="egg-ring block h-24 w-24 rounded-full border-2 border-white/70" />
    </div>
  );
};

export default HexStormFlash;

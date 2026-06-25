import { useEffect } from "react";

/** Toggles a neon accent skin by adding `.egg-neon` to the document root. */
const NeonTheme = ({ active }: { active: boolean }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("egg-neon", active);
    return () => root.classList.remove("egg-neon");
  }, [active]);
  return null;
};

export default NeonTheme;

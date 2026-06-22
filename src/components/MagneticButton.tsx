import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Strength of the pull toward the cursor (0–1). */
  strength?: number;
}

/**
 * Wraps content in a magnetic container that subtly drifts toward the cursor —
 * a common Awwwards-style micro-interaction. Falls back gracefully (no motion)
 * when the pointer leaves.
 */
const MagneticButton = ({ children, className, strength = 0.3 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "inline-block transition-transform duration-300 ease-out [will-change:transform]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MagneticButton;

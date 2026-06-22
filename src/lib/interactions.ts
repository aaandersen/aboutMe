import type { MouseEvent } from "react";

/**
 * Cursor-follow spotlight. Attach to a `.spotlight` element's `onMouseMove`.
 * Sets CSS custom properties consumed by the `.spotlight::after` glow.
 */
export const handleSpotlight = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
};

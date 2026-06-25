import { useEffect, useRef, useState } from "react";

/** A soft trailing ring that augments the native cursor on fine-pointer devices. */
const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    if (!ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let sc = 1;
    const hot = { v: false };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      hot.v = !!(t && t.closest && t.closest('a,button,input,textarea,select,[role="button"]'));
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      sc += ((hot.v ? 1.8 : 1) - sc) * 0.2;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${sc})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed left-0 top-0 z-[200] h-8 w-8 rounded-full border border-white/50 mix-blend-difference"
      aria-hidden="true"
    />
  );
};

export default CustomCursor;

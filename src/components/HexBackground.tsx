import { useEffect, useRef } from "react";

/**
 * Full-screen interactive hexagon network rendered to a canvas.
 * - A faint hex grid is pre-rendered once to an offscreen canvas (cheap base layer).
 * - Each frame only the hexagons near the cursor are re-stroked/filled (a glowing
 *   "spotlight through the net"), so the cost stays low regardless of screen size.
 * - Falls back to a single static frame when the user prefers reduced motion, and
 *   gently auto-drifts the highlight when the pointer is idle (nice on touch).
 */

const HEX_SIZE = 36;
const HIGHLIGHT_RADIUS = 200;

const HexBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const base = document.createElement("canvas");
    const baseCtx = base.getContext("2d");
    if (!baseCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let hexes: { x: number; y: number }[] = [];
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let lastMove = -100000;
    let highlight = 0;
    let running = false;
    let rafId = 0;

    const tracePath = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number
    ) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      base.width = canvas.width;
      base.height = canvas.height;
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const hStep = Math.sqrt(3) * HEX_SIZE;
      const vStep = 1.5 * HEX_SIZE;
      hexes = [];
      for (let row = -1; row * vStep <= height + HEX_SIZE; row++) {
        for (let col = -1; col * hStep <= width + hStep; col++) {
          const x = col * hStep + (row % 2 ? hStep / 2 : 0);
          const y = row * vStep;
          hexes.push({ x, y });
        }
      }

      // Pre-render the faint base grid once.
      baseCtx.clearRect(0, 0, width, height);
      baseCtx.lineWidth = 1;
      baseCtx.strokeStyle = "hsla(216, 14%, 55%, 0.05)";
      for (const h of hexes) {
        tracePath(baseCtx, h.x, h.y, HEX_SIZE - 1.5);
        baseCtx.stroke();
      }
    };

    const render = (time: number) => {
      // The reflection glints in while the pointer moves and fades back to the
      // bare carbon grid when it rests.
      const movedRecently = time - lastMove < 600;
      const targetIntensity = movedRecently ? 1 : 0;
      const fadeRate = targetIntensity > highlight ? 0.16 : 0.05;
      highlight += (targetIntensity - highlight) * fadeRate;

      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (highlight > 0.012) {
        for (const h of hexes) {
          const dx = h.x - pos.x;
          const dy = h.y - pos.y;
          const dist = Math.hypot(dx, dy);
          if (dist > HIGHLIGHT_RADIUS) continue;

          const linear = 1 - dist / HIGHLIGHT_RADIUS;
          const ease = linear * linear * (3 - 2 * linear) * highlight;

          // Neutral, low-intensity sheen — light catching carbon, not a glow.
          tracePath(ctx, h.x, h.y, HEX_SIZE - 1.5);
          ctx.fillStyle = `hsla(210, 12%, 80%, ${ease * 0.05})`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `hsla(208, 16%, 86%, ${ease * 0.3})`;
          ctx.stroke();
        }
        rafId = requestAnimationFrame(render);
      } else {
        // Settled and faded out — leave just the resting carbon grid.
        running = false;
      }
    };

    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      rafId = requestAnimationFrame(render);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const paintBase = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
      start();
    };

    const handleResize = () => {
      build();
      pos.x = target.x = width / 2;
      pos.y = target.y = height / 2;
      paintBase();
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else paintBase();
    };

    build();
    pos.x = target.x = width / 2;
    pos.y = target.y = height / 2;

    // Paint the resting carbon grid once; the reflection loop only runs while
    // the pointer is actually moving, then stops again.
    paintBase();

    window.addEventListener("resize", handleResize);
    if (!prefersReduced) {
      window.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};

export default HexBackground;

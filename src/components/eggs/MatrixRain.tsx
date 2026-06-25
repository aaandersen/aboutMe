import { useEffect, useRef } from "react";

/** Full-screen monochrome "digital rain". Click or press Esc to exit. */
const MatrixRain = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 16;
    const chars =
      "アァカサタナハマヤラワabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*".split("");
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () =>
        Math.floor((Math.random() * -canvas.height) / fontSize)
      );
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(10,10,10,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y);
        ctx.fillStyle = "rgba(150,150,150,0.45)";
        ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y - fontSize);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [onExit]);

  return (
    <div
      className="fixed inset-0 z-[120] cursor-pointer bg-background/50"
      onClick={onExit}
      role="button"
      aria-label="Exit matrix mode"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
        click or press Esc to exit
      </span>
    </div>
  );
};

export default MatrixRain;

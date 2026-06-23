import { useEffect, useRef } from "react";

/**
 * A section-scoped neural-network background: drifting "neurons" connected by
 * faint synapses, with signal pulses that travel along the connections.
 * Sizes itself to its positioned parent, pauses when off-screen, and renders a
 * single static frame when the user prefers reduced motion. Monochrome to match
 * the black & white theme.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Signal {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const CONNECT_DISTANCE = 150;

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let built = false;
    let running = false;
    let rafId = 0;
    let lastSpawn = 0;

    const buildNodes = () => {
      const count = Math.min(54, Math.max(16, Math.round((width * height) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
      signals = [];
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!built) {
        buildNodes();
        built = true;
      }
    };

    const drawEdgesAndNodes = () => {
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const alpha = (1 - Math.sqrt(distSq) / CONNECT_DISTANCE) * 0.12;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const spawnSignal = () => {
      if (nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      const options: number[] = [];
      for (let b = 0; b < nodes.length; b++) {
        if (b === a) continue;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < CONNECT_DISTANCE * CONNECT_DISTANCE) options.push(b);
      }
      if (options.length) {
        const b = options[Math.floor(Math.random() * options.length)];
        signals.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.02 });
      }
    };

    const frame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      drawEdgesAndNodes();

      if (time - lastSpawn > 360) {
        lastSpawn = time;
        if (signals.length < 14) spawnSignal();
      }

      for (let k = signals.length - 1; k >= 0; k--) {
        const s = signals[k];
        s.t += s.speed;
        const a = nodes[s.a];
        const b = nodes[s.b];
        if (s.t >= 1 || !a || !b) {
          signals.splice(k, 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 6);
        glow.addColorStop(0, "rgba(255,255,255,0.85)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    resize();

    if (prefersReduced) {
      ctx.clearRect(0, 0, width, height);
      drawEdgesAndNodes();
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
};

export default NeuralBackground;

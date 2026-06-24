import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FUN_FACTS = [
  "Wrote a bachelor thesis with Microsoft on citizen development of AI agents at Carlsberg.",
  "Holds 3 Microsoft certifications — AI Business Professional, Copilot & Agent Admin, and Power Platform.",
  "Builds AI agents in Copilot Studio and orchestrates them over the Model Context Protocol.",
  "Runs two Microsoft communities for ERP and CRM leaders across major Danish brands.",
  "Shipped two live AI products: aiusagetracker.org and aicockpit.org.",
  "Modelled epidemic spread with the SIR model back in high school (HTX).",
  "BSc in Business Administration & IT from CBS — class of 2026.",
  "Based in Copenhagen, Denmark.",
  "Turns AI enthusiasm into real, lasting business value.",
  "Has deployed apps on Azure and DigitalOcean (Ubuntu).",
];

type Status = "ready" | "playing" | "over";

interface Ship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  invuln: number;
}
interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  spin: number;
  offs: number[];
}
interface GameState {
  ship: Ship | null;
  bullets: Bullet[];
  asteroids: Asteroid[];
  cooldown: number;
  factIndex: number;
  score: number;
  lives: number;
  w: number;
  h: number;
}

const TAU = Math.PI * 2;
const SHIP_R = 14;
const THRUST = 0.16;
const FRICTION = 0.99;
const ROT = 0.07;
const BULLET_SPEED = 6.5;
const BULLET_LIFE = 55;
const FIRE_COOLDOWN = 11;

const Astro = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fact, setFact] = useState(FUN_FACTS[0]);

  const statusRef = useRef<Status>("ready");
  const keys = useRef<Set<string>>(new Set());
  const startRef = useRef<() => void>(() => {});
  const game = useRef<GameState>({
    ship: null,
    bullets: [],
    asteroids: [],
    cooldown: 0,
    factIndex: 0,
    score: 0,
    lives: 3,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      game.current.w = w;
      game.current.h = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const wrap = (v: number, max: number) => (v < 0 ? v + max : v >= max ? v - max : v);

    const makeAsteroid = (r: number, x?: number, y?: number): Asteroid => {
      const dir = Math.random() * TAU;
      const speed = 0.5 + Math.random() * 1.3;
      const count = 9 + Math.floor(Math.random() * 4);
      return {
        x: x ?? Math.random() * game.current.w,
        y: y ?? Math.random() * game.current.h,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        r,
        angle: Math.random() * TAU,
        spin: (Math.random() - 0.5) * 0.05,
        offs: Array.from({ length: count }, () => 0.68 + Math.random() * 0.5),
      };
    };

    const spawnWave = (n: number) => {
      const g = game.current;
      const arr: Asteroid[] = [];
      for (let i = 0; i < n; i++) {
        let x = Math.random() * g.w;
        const y = Math.random() * g.h;
        if (Math.hypot(x - g.w / 2, y - g.h / 2) < 170) x = (x + g.w / 2) % g.w;
        arr.push(makeAsteroid(46, x, y));
      }
      g.asteroids = arr;
    };

    const begin = () => {
      const g = game.current;
      g.ship = { x: g.w / 2, y: g.h / 2, vx: 0, vy: 0, angle: -Math.PI / 2, invuln: 90 };
      g.bullets = [];
      g.cooldown = 0;
      g.factIndex = 0;
      g.score = 0;
      g.lives = 3;
      spawnWave(4);
      setScore(0);
      setLives(3);
      setFact(FUN_FACTS[0]);
      setStatus("playing");
    };
    startRef.current = begin;

    const fire = () => {
      const g = game.current;
      if (!g.ship || g.cooldown > 0) return;
      const s = g.ship;
      g.bullets.push({
        x: s.x + Math.cos(s.angle) * SHIP_R,
        y: s.y + Math.sin(s.angle) * SHIP_R,
        vx: Math.cos(s.angle) * BULLET_SPEED + s.vx,
        vy: Math.sin(s.angle) * BULLET_SPEED + s.vy,
        life: BULLET_LIFE,
      });
      g.cooldown = FIRE_COOLDOWN;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ([" ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
      if (statusRef.current !== "playing" && (e.key === " " || e.key === "Enter")) {
        begin();
        return;
      }
      keys.current.add(e.key === " " ? "Space" : e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key === " " ? "Space" : e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const has = (...k: string[]) => k.some((x) => keys.current.has(x));

    let raf = 0;
    const loop = () => {
      const g = game.current;
      const { w, h } = g;
      ctx.clearRect(0, 0, w, h);

      if (statusRef.current === "playing" && g.ship) {
        const ship = g.ship;
        if (has("ArrowLeft", "a", "A")) ship.angle -= ROT;
        if (has("ArrowRight", "d", "D")) ship.angle += ROT;
        if (has("ArrowUp", "w", "W")) {
          ship.vx += Math.cos(ship.angle) * THRUST;
          ship.vy += Math.sin(ship.angle) * THRUST;
        }
        if (has("Space")) fire();
        if (g.cooldown > 0) g.cooldown--;

        ship.vx *= FRICTION;
        ship.vy *= FRICTION;
        ship.x = wrap(ship.x + ship.vx, w);
        ship.y = wrap(ship.y + ship.vy, h);
        if (ship.invuln > 0) ship.invuln--;

        for (let i = g.bullets.length - 1; i >= 0; i--) {
          const b = g.bullets[i];
          b.x = wrap(b.x + b.vx, w);
          b.y = wrap(b.y + b.vy, h);
          if (--b.life <= 0) g.bullets.splice(i, 1);
        }

        for (const a of g.asteroids) {
          a.x = wrap(a.x + a.vx, w);
          a.y = wrap(a.y + a.vy, h);
          a.angle += a.spin;
        }

        for (let i = g.asteroids.length - 1; i >= 0; i--) {
          const a = g.asteroids[i];
          for (let j = g.bullets.length - 1; j >= 0; j--) {
            const b = g.bullets[j];
            if (Math.hypot(a.x - b.x, a.y - b.y) < a.r) {
              g.bullets.splice(j, 1);
              g.asteroids.splice(i, 1);
              if (a.r > 26) {
                const nr = a.r * 0.55;
                g.asteroids.push(makeAsteroid(nr, a.x, a.y));
                g.asteroids.push(makeAsteroid(nr, a.x, a.y));
              }
              g.score += Math.round(60 - a.r);
              setScore(g.score);
              g.factIndex = (g.factIndex + 1) % FUN_FACTS.length;
              setFact(FUN_FACTS[g.factIndex]);
              break;
            }
          }
        }

        if (ship.invuln <= 0) {
          for (const a of g.asteroids) {
            if (Math.hypot(a.x - ship.x, a.y - ship.y) < a.r + SHIP_R) {
              g.lives--;
              setLives(g.lives);
              ship.x = w / 2;
              ship.y = h / 2;
              ship.vx = 0;
              ship.vy = 0;
              ship.invuln = 120;
              if (g.lives <= 0) setStatus("over");
              break;
            }
          }
        }

        if (g.asteroids.length === 0) {
          spawnWave(4 + Math.min(6, Math.floor(g.score / 500)));
        }
      }

      // Draw asteroids
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(255,255,255,0.82)";
      for (const a of g.asteroids) {
        ctx.beginPath();
        for (let v = 0; v < a.offs.length; v++) {
          const ang = a.angle + (v / a.offs.length) * TAU;
          const rr = a.r * a.offs[v];
          const px = a.x + Math.cos(ang) * rr;
          const py = a.y + Math.sin(ang) * rr;
          if (v === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Bullets
      ctx.fillStyle = "#fff";
      for (const b of g.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, TAU);
        ctx.fill();
      }

      // Ship
      if (g.ship && statusRef.current === "playing") {
        const s = g.ship;
        const blink = s.invuln > 0 && Math.floor(s.invuln / 6) % 2 === 0;
        if (!blink) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(s.x + Math.cos(s.angle) * SHIP_R, s.y + Math.sin(s.angle) * SHIP_R);
          ctx.lineTo(
            s.x + Math.cos(s.angle + 2.5) * SHIP_R,
            s.y + Math.sin(s.angle + 2.5) * SHIP_R
          );
          ctx.lineTo(
            s.x + Math.cos(s.angle - 2.5) * SHIP_R,
            s.y + Math.sin(s.angle - 2.5) * SHIP_R
          );
          ctx.closePath();
          ctx.stroke();
          if (has("ArrowUp", "w", "W")) {
            ctx.beginPath();
            ctx.moveTo(
              s.x + Math.cos(s.angle + 2.9) * SHIP_R * 0.65,
              s.y + Math.sin(s.angle + 2.9) * SHIP_R * 0.65
            );
            ctx.lineTo(s.x - Math.cos(s.angle) * SHIP_R * 1.4, s.y - Math.sin(s.angle) * SHIP_R * 1.4);
            ctx.lineTo(
              s.x + Math.cos(s.angle - 2.9) * SHIP_R * 0.65,
              s.y + Math.sin(s.angle - 2.9) * SHIP_R * 0.65
            );
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    spawnWave(5);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const hold = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      keys.current.add(key);
    },
    onPointerUp: () => keys.current.delete(key),
    onPointerLeave: () => keys.current.delete(key),
    onPointerCancel: () => keys.current.delete(key),
  });

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-white/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        {status === "playing" && (
          <div className="text-right font-mono text-sm">
            <div>SCORE {score}</div>
            <div className="text-white/70">SHIPS {"▲ ".repeat(Math.max(0, lives)).trim() || "—"}</div>
          </div>
        )}
      </div>

      {/* Fun-fact banner while playing */}
      {status === "playing" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex justify-center px-4 sm:bottom-8">
          <p className="max-w-xl rounded-full border border-white/10 bg-black/60 px-5 py-2 text-center text-xs text-white/80 backdrop-blur sm:text-sm">
            <span className="font-semibold text-white">Fun fact: </span>
            {fact}
          </p>
        </div>
      )}

      {/* Ready / Game-over overlay */}
      {status !== "playing" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-5xl font-bold tracking-[0.2em] sm:text-7xl">ASTRO</h1>
          {status === "ready" ? (
            <p className="mt-4 max-w-md text-sm text-white/70 sm:text-base">
              Shoot the asteroids — every hit reveals a fun fact about Anders.
            </p>
          ) : (
            <p className="mt-4 text-lg text-white/80">
              Game over — final score <span className="font-bold text-white">{score}</span>
            </p>
          )}

          <button
            type="button"
            onClick={() => startRef.current()}
            className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            {status === "ready" ? "Start" : "Play again"}
          </button>

          <p className="mt-8 px-4 font-mono text-[11px] leading-relaxed text-white/50 sm:hidden">
            Tap the on-screen pads to rotate, thrust &amp; fire
          </p>
          <p className="mt-8 hidden px-4 font-mono text-xs text-white/50 sm:block">
            ← → / A D rotate &nbsp;·&nbsp; ↑ / W thrust &nbsp;·&nbsp; Space shoot
          </p>
        </div>
      )}

      {/* Touch controls (mobile) */}
      {status === "playing" && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 md:hidden">
          <div className="flex gap-3">
            <button {...hold("ArrowLeft")} aria-label="Rotate left" className="flex h-16 w-16 select-none items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-2xl backdrop-blur">↺</button>
            <button {...hold("ArrowRight")} aria-label="Rotate right" className="flex h-16 w-16 select-none items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-2xl backdrop-blur">↻</button>
          </div>
          <div className="flex gap-3">
            <button {...hold("ArrowUp")} aria-label="Thrust" className="flex h-16 w-16 select-none items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-2xl backdrop-blur">▲</button>
            <button {...hold("Space")} aria-label="Shoot" className="flex h-16 w-16 select-none items-center justify-center rounded-full border border-white/40 bg-white/15 text-xl font-bold backdrop-blur">FIRE</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Astro;

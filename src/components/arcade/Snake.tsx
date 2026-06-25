import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 20;
const SIZE = 420;
const HS_KEY = "arcade-snake-hs";

type Pt = { x: number; y: number };
type Status = "ready" | "playing" | "over";

const Snake = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem(HS_KEY) || 0));
  const [status, setStatus] = useState<Status>("ready");

  const snake = useRef<Pt[]>([{ x: 10, y: 10 }]);
  const dir = useRef<Pt>({ x: 1, y: 0 });
  const nextDir = useRef<Pt>({ x: 1, y: 0 });
  const food = useRef<Pt>({ x: 5, y: 5 });
  const statusRef = useRef(status);
  statusRef.current = status;
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const placeFood = () => {
    for (;;) {
      const f = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
      if (!snake.current.some((s) => s.x === f.x && s.y === f.y)) {
        food.current = f;
        return;
      }
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cell = SIZE / GRID;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(food.current.x * cell + cell / 2, food.current.y * cell + cell / 2, cell * 0.32, 0, Math.PI * 2);
    ctx.fill();
    snake.current.forEach((s, i) => {
      const t = 1 - i / (snake.current.length + 4);
      ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * t})`;
      ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
    });
  }, []);

  const reset = useCallback(() => {
    snake.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setStatus("playing");
  }, []);

  useEffect(() => {
    draw();
  }, [draw, status]);

  useEffect(() => {
    if (status !== "playing") return;
    const tick = () => {
      const d = nextDir.current;
      dir.current = d;
      const head = snake.current[0];
      const nh = { x: head.x + d.x, y: head.y + d.y };
      if (
        nh.x < 0 ||
        nh.y < 0 ||
        nh.x >= GRID ||
        nh.y >= GRID ||
        snake.current.some((s) => s.x === nh.x && s.y === nh.y)
      ) {
        setStatus("over");
        setHighScore((hs) => {
          const v = Math.max(hs, scoreRef.current);
          try {
            localStorage.setItem(HS_KEY, String(v));
          } catch {
            /* ignore */
          }
          return v;
        });
        return;
      }
      snake.current.unshift(nh);
      if (nh.x === food.current.x && nh.y === food.current.y) {
        setScore((s) => s + 1);
        placeFood();
      } else {
        snake.current.pop();
      }
      draw();
    };
    const id = window.setInterval(tick, 110);
    return () => window.clearInterval(id);
  }, [status, draw]);

  const setDir = (x: number, y: number) => {
    if (statusRef.current !== "playing") return;
    if (x === -dir.current.x && y === -dir.current.y) return;
    nextDir.current = { x, y };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if (k === "arrowup" || k === "w") setDir(0, -1);
      else if (k === "arrowdown" || k === "s") setDir(0, 1);
      else if (k === "arrowleft" || k === "a") setDir(-1, 0);
      else if (k === "arrowright" || k === "d") setDir(1, 0);
      else if ((k === " " || k === "enter") && statusRef.current !== "playing") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  const padBtn =
    "flex h-14 w-14 select-none items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-xl active:bg-white/15";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-[420px] items-center justify-between text-sm">
        <span className="font-mono text-foreground/80">SCORE {score}</span>
        <span className="font-mono text-muted-foreground">BEST {highScore}</span>
      </div>

      <div className="relative" style={{ width: "min(86vw, 420px)" }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="w-full rounded-2xl border border-white/10 bg-[#0b0b0b]"
        />
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/70 text-center backdrop-blur-sm">
            <p className="font-display text-3xl font-bold tracking-wider">SNAKE</p>
            {status === "over" && (
              <p className="mt-2 text-sm text-white/80">
                Game over — score <span className="font-bold text-white">{score}</span>
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {status === "ready" ? "Start" : "Play again"}
            </button>
            <p className="mt-4 hidden font-mono text-xs text-white/50 sm:block">arrows / WASD to move</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <span />
        <button type="button" aria-label="Up" className={padBtn} onClick={() => setDir(0, -1)}>↑</button>
        <span />
        <button type="button" aria-label="Left" className={padBtn} onClick={() => setDir(-1, 0)}>←</button>
        <button type="button" aria-label="Down" className={padBtn} onClick={() => setDir(0, 1)}>↓</button>
        <button type="button" aria-label="Right" className={padBtn} onClick={() => setDir(1, 0)}>→</button>
      </div>
    </div>
  );
};

export default Snake;

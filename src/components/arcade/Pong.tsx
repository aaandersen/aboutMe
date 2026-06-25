import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 320;
const PW = 10;
const PH = 64;
const BR = 7;
const WIN = 7;

type Status = "ready" | "playing" | "over";

const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState({ p: 0, ai: 0 });
  const statusRef = useRef(status);
  statusRef.current = status;

  const state = useRef({
    ball: { x: W / 2, y: H / 2, vx: 5, vy: 2.5 },
    playerY: H / 2 - PH / 2,
    aiY: H / 2 - PH / 2,
    p: 0,
    ai: 0,
  });

  const resetBall = (dir: number) => {
    const s = state.current;
    s.ball.x = W / 2;
    s.ball.y = H / 2;
    const ang = (Math.random() - 0.5) * 0.6;
    s.ball.vx = Math.cos(ang) * 5 * dir;
    s.ball.vy = Math.sin(ang) * 5;
  };

  const start = useCallback(() => {
    const s = state.current;
    s.p = 0;
    s.ai = 0;
    s.playerY = H / 2 - PH / 2;
    s.aiY = H / 2 - PH / 2;
    setScore({ p: 0, ai: 0 });
    resetBall(Math.random() < 0.5 ? -1 : 1);
    setStatus("playing");
  }, []);

  const movePaddleTo = (clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = ((clientY - rect.top) / rect.height) * H;
    state.current.playerY = Math.max(0, Math.min(H - PH, y - PH / 2));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") {
        e.preventDefault();
        state.current.playerY = Math.max(0, state.current.playerY - 26);
      } else if (k === "arrowdown" || k === "s") {
        e.preventDefault();
        state.current.playerY = Math.min(H - PH, state.current.playerY + 26);
      } else if ((k === " " || k === "enter") && statusRef.current !== "playing") {
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const loop = () => {
      const s = state.current;
      if (statusRef.current === "playing") {
        const target = s.ball.y - PH / 2;
        s.aiY += Math.max(-4.5, Math.min(4.5, target - s.aiY));
        s.aiY = Math.max(0, Math.min(H - PH, s.aiY));

        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        if (s.ball.y < BR || s.ball.y > H - BR) s.ball.vy *= -1;

        if (
          s.ball.x - BR < 20 + PW &&
          s.ball.x > 20 &&
          s.ball.y > s.playerY &&
          s.ball.y < s.playerY + PH &&
          s.ball.vx < 0
        ) {
          s.ball.vx *= -1.06;
          s.ball.vy += (s.ball.y - (s.playerY + PH / 2)) * 0.08;
          s.ball.x = 20 + PW + BR;
        }
        const ax = W - 20 - PW;
        if (
          s.ball.x + BR > ax &&
          s.ball.x < ax + PW &&
          s.ball.y > s.aiY &&
          s.ball.y < s.aiY + PH &&
          s.ball.vx > 0
        ) {
          s.ball.vx *= -1.06;
          s.ball.vy += (s.ball.y - (s.aiY + PH / 2)) * 0.08;
          s.ball.x = ax - BR;
        }
        s.ball.vx = Math.max(-9.5, Math.min(9.5, s.ball.vx));

        if (s.ball.x < 0) {
          s.ai++;
          setScore({ p: s.p, ai: s.ai });
          if (s.ai >= WIN) setStatus("over");
          else resetBall(1);
        } else if (s.ball.x > W) {
          s.p++;
          setScore({ p: s.p, ai: s.ai });
          if (s.p >= WIN) setStatus("over");
          else resetBall(-1);
        }
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([6, 10]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(20, s.playerY, PW, PH);
      ctx.fillRect(W - 20 - PW, s.aiY, PW, PH);
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, BR, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-[480px] items-center justify-center gap-6 font-mono">
        <span className="text-2xl font-bold">{score.p}</span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">you · ai</span>
        <span className="text-2xl font-bold">{score.ai}</span>
      </div>

      <div className="relative" style={{ width: "min(92vw, 480px)" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerMove={(e) => movePaddleTo(e.clientY)}
          onTouchMove={(e) => movePaddleTo(e.touches[0].clientY)}
          className="w-full touch-none rounded-2xl border border-white/10 bg-[#0b0b0b]"
        />
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/70 text-center backdrop-blur-sm">
            <p className="font-display text-3xl font-bold tracking-wider">PONG</p>
            {status === "over" && (
              <p className="mt-2 text-sm text-white/80">
                You {score.p > score.ai ? "win" : "lose"} {score.p}–{score.ai}
              </p>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-5 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {status === "ready" ? "Start" : "Play again"}
            </button>
            <p className="mt-4 font-mono text-xs text-white/50">move your mouse / drag · ↑↓ keys</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pong;

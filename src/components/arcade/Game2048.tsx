import { useCallback, useEffect, useRef, useState } from "react";

const HS_KEY = "arcade-2048-hs";
type Board = number[][];
type Dir = "L" | "R" | "U" | "D";

const emptyBoard = (): Board => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const clone = (b: Board): Board => b.map((r) => [...r]);
const transpose = (b: Board): Board => b[0].map((_, j) => b.map((r) => r[j]));
const reverseRows = (b: Board): Board => b.map((r) => [...r].reverse());

function spawn(b: Board) {
  const cells: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (b[i][j] === 0) cells.push([i, j]);
  if (!cells.length) return;
  const [i, j] = cells[(Math.random() * cells.length) | 0];
  b[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function slideLeftRow(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((n) => n);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i < nums.length - 1 && nums[i] === nums[i + 1]) {
      out.push(nums[i] * 2);
      gained += nums[i] * 2;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

function move(b: Board, dir: Dir): { board: Board; gained: number; moved: boolean } {
  let work = clone(b);
  if (dir === "R") work = reverseRows(work);
  else if (dir === "U") work = transpose(work);
  else if (dir === "D") work = reverseRows(transpose(work));

  let gained = 0;
  work = work.map((r) => {
    const { row, gained: g } = slideLeftRow(r);
    gained += g;
    return row;
  });

  if (dir === "R") work = reverseRows(work);
  else if (dir === "U") work = transpose(work);
  else if (dir === "D") work = transpose(reverseRows(work));

  const moved = JSON.stringify(work) !== JSON.stringify(b);
  return { board: work, gained, moved };
}

const canMove = (b: Board): boolean =>
  (["L", "R", "U", "D"] as Dir[]).some((d) => move(b, d).moved);

const tileStyle = (v: number): React.CSSProperties => {
  if (!v) return { background: "rgba(255,255,255,0.04)" };
  const lvl = Math.log2(v);
  const light = Math.min(95, 12 + lvl * 8);
  return { background: `hsl(0 0% ${light}%)`, color: light > 55 ? "#0a0a0a" : "#fff" };
};

const Game2048 = () => {
  const init = () => {
    const b = emptyBoard();
    spawn(b);
    spawn(b);
    return b;
  };
  const [board, setBoard] = useState<Board>(init);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem(HS_KEY) || 0));
  const [status, setStatus] = useState<"playing" | "won" | "over">("playing");
  const touch = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    setBoard(init());
    setScore(0);
    setStatus("playing");
  }, []);

  const doMove = useCallback(
    (dir: Dir) => {
      setBoard((prev) => {
        if (status === "over") return prev;
        const { board: nb, gained, moved } = move(prev, dir);
        if (!moved) return prev;
        spawn(nb);
        if (gained) {
          setScore((s) => {
            const ns = s + gained;
            setBest((b2) => {
              const v = Math.max(b2, ns);
              try {
                localStorage.setItem(HS_KEY, String(v));
              } catch {
                /* ignore */
              }
              return v;
            });
            return ns;
          });
        }
        if (status === "playing" && nb.some((r) => r.some((v) => v >= 2048))) setStatus("won");
        else if (!canMove(nb)) setStatus("over");
        return nb;
      });
    },
    [status]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, Dir> = {
        arrowleft: "L",
        a: "L",
        arrowright: "R",
        d: "R",
        arrowup: "U",
        w: "U",
        arrowdown: "D",
        s: "D",
      };
      if (map[k]) {
        e.preventDefault();
        doMove(map[k]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "R" : "L");
    else doMove(dy > 0 ? "D" : "U");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-[360px] items-center justify-between text-sm">
        <span className="font-mono text-foreground/80">SCORE {score}</span>
        <span className="font-mono text-muted-foreground">BEST {best}</span>
      </div>

      <div className="relative" style={{ width: "min(86vw, 360px)" }}>
        <div
          className="grid touch-none grid-cols-4 gap-2.5 rounded-2xl border border-white/10 bg-[#0b0b0b] p-2.5"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {board.flat().map((v, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-lg font-bold tabular-nums"
              style={{
                ...tileStyle(v),
                fontSize: v >= 1024 ? "1.05rem" : v >= 128 ? "1.3rem" : "1.6rem",
              }}
            >
              {v || ""}
            </div>
          ))}
        </div>

        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/75 text-center backdrop-blur-sm">
            <p className="font-display text-3xl font-bold">{status === "won" ? "You win! 🎉" : "Game over"}</p>
            <p className="mt-1 text-sm text-white/80">
              score <span className="font-bold text-white">{score}</span>
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Play again
            </button>
          </div>
        )}
      </div>

      <p className="hidden font-mono text-xs text-muted-foreground sm:block">
        arrows / WASD · swipe on mobile
      </p>
    </div>
  );
};

export default Game2048;

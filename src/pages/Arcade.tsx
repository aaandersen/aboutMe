import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Snake from "@/components/arcade/Snake";
import Game2048 from "@/components/arcade/Game2048";
import Pong from "@/components/arcade/Pong";

type Game = "snake" | "2048" | "pong";

const GAMES: { id: Game; label: string }[] = [
  { id: "snake", label: "Snake" },
  { id: "2048", label: "2048" },
  { id: "pong", label: "Pong" },
];

const Arcade = () => {
  const [game, setGame] = useState<Game>("snake");

  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "Arcade · Anders Adalberth Andersen";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back home
          </Link>
          <span className="font-display text-lg font-bold tracking-[0.28em]">ARCADE</span>
          <span className="w-20" />
        </header>

        <div className="mb-8 mt-2 flex justify-center px-4">
          <div className="inline-flex rounded-full border border-white/12 bg-white/[0.03] p-1">
            {GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGame(g.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  game === g.id ? "bg-white text-black" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex flex-1 items-start justify-center px-4 pb-16">
          {game === "snake" && <Snake />}
          {game === "2048" && <Game2048 />}
          {game === "pong" && <Pong />}
        </main>
      </div>
    </div>
  );
};

export default Arcade;

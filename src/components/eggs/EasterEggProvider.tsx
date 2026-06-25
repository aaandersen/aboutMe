import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  EGGS,
  WORD_TO_EGG,
  nearestWord,
  type EggActions,
  type EggCommand,
  type ModeName,
  type OverlayName,
  type PulseName,
} from "@/lib/eggs";
import { useKonami } from "@/hooks/useKonami";
import { playUnlock } from "@/lib/sound";
import MatrixRain from "./MatrixRain";
import Confetti from "./Confetti";
import NeonTheme from "./NeonTheme";
import ZenMode from "./ZenMode";
import HexStormFlash from "./HexStormFlash";
import CommandPalette from "./CommandPalette";
import Terminal from "./Terminal";
import AgentChat from "./AgentChat";

export type RunResult = "hit" | "near" | "miss";

interface EggApi {
  runWord: (word: string) => { result: RunResult; suggestion?: string };
  runEgg: (egg: EggCommand) => void;
  openOverlay: (o: OverlayName) => void;
  modes: Record<ModeName, boolean>;
  toggleMode: (m: ModeName) => void;
  discovered: string[];
  soundOn: boolean;
  toggleSound: () => void;
}

const Ctx = createContext<EggApi | null>(null);

export const useEggs = (): EggApi => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEggs must be used within EasterEggProvider");
  return ctx;
};

const STORAGE_KEY = "egg-discovered-v1";

const EasterEggProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [overlay, setOverlay] = useState<OverlayName | null>(null);
  const [modes, setModes] = useState<Record<ModeName, boolean>>({
    matrix: false,
    neon: false,
    zen: false,
  });
  const [pulses, setPulses] = useState<Record<PulseName, number>>({
    confetti: 0,
    hexstorm: 0,
  });
  const [discovered, setDiscovered] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discovered));
    } catch {
      /* ignore */
    }
  }, [discovered]);

  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("egg-sound") === "1";
    } catch {
      return false;
    }
  });
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;
  useEffect(() => {
    try {
      localStorage.setItem("egg-sound", soundOn ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [soundOn]);

  const markDiscovered = useCallback((id: string) => {
    setDiscovered((prev) => {
      if (prev.includes(id)) return prev;
      const egg = EGGS.find((e) => e.id === id);
      if (egg) toast(`🔓 Unlocked: ${egg.label}`, { description: egg.blurb });
      return [...prev, id];
    });
  }, []);

  const toggleMode = useCallback(
    (m: ModeName) => setModes((s) => ({ ...s, [m]: !s[m] })),
    []
  );

  const toggleSound = useCallback(() => setSoundOn((s) => !s), []);

  const actions: EggActions = useMemo(
    () => ({
      navigate: (to) => {
        setOverlay(null);
        navigate(to);
      },
      toggleMode,
      pulse: (p) => setPulses((s) => ({ ...s, [p]: s[p] + 1 })),
      openOverlay: (o) => setOverlay(o),
      download: (href) => {
        const a = document.createElement("a");
        a.href = href;
        a.setAttribute("download", "");
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
    }),
    [navigate, toggleMode]
  );

  const runEgg = useCallback(
    (egg: EggCommand) => {
      markDiscovered(egg.id);
      if (soundRef.current) playUnlock();
      egg.run(actions);
    },
    [actions, markDiscovered]
  );

  const runWord = useCallback(
    (word: string): { result: RunResult; suggestion?: string } => {
      const w = word.trim().toLowerCase();
      if (!w) return { result: "miss" };
      const egg = WORD_TO_EGG[w];
      if (egg) {
        runEgg(egg);
        return { result: "hit" };
      }
      const near = nearestWord(w);
      return { result: near ? "near" : "miss", suggestion: near || undefined };
    },
    [runEgg]
  );

  // Konami code → a celebratory combo.
  useKonami(
    useCallback(() => {
      toast("🐰 Konami code!", { description: "You really know your classics." });
      actions.pulse("confetti");
      toggleMode("matrix");
      markDiscovered("matrix");
    }, [actions, toggleMode, markDiscovered])
  );

  // Cmd/Ctrl+K → command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOverlay((o) => (o === "palette" ? null : "palette"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const api: EggApi = useMemo(
    () => ({
      runWord,
      runEgg,
      openOverlay: setOverlay,
      modes,
      toggleMode,
      discovered,
      soundOn,
      toggleSound,
    }),
    [runWord, runEgg, modes, toggleMode, discovered, soundOn, toggleSound]
  );

  return (
    <Ctx.Provider value={api}>
      {children}

      {/* Effects */}
      {modes.matrix && <MatrixRain onExit={() => toggleMode("matrix")} />}
      <NeonTheme active={modes.neon} />
      {modes.zen && <ZenMode onExit={() => toggleMode("zen")} />}
      <Confetti trigger={pulses.confetti} />
      <HexStormFlash trigger={pulses.hexstorm} />

      {/* Overlays */}
      {overlay === "palette" && (
        <CommandPalette
          onClose={() => setOverlay(null)}
          onRun={(egg) => {
            setOverlay(null);
            runEgg(egg);
          }}
          discovered={discovered}
        />
      )}

      {overlay === "terminal" && <Terminal onClose={() => setOverlay(null)} />}
      {overlay === "agent" && <AgentChat onClose={() => setOverlay(null)} />}
    </Ctx.Provider>
  );
};

export default EasterEggProvider;

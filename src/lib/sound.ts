let ctx: AudioContext | null = null;

/** Plays a short, soft blip via Web Audio. Lazily creates the AudioContext. */
export function playBlip(freq = 660, dur = 0.09, type: OscillatorType = "sine") {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    /* audio not available */
  }
}

/** A pleasant two-note "unlock" chime. */
export function playUnlock() {
  playBlip(660, 0.09);
  window.setTimeout(() => playBlip(990, 0.12), 90);
}

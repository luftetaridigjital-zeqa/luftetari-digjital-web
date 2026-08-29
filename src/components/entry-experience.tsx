"use client";

import { FormEvent, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  advanceEntry,
  createEntryState,
  normalizeAccessCode,
  type EntryPhase,
} from "../lib/entry-machine";

const unlockDurations: Partial<Record<EntryPhase, number>> = {
  recognition: 850,
  "key-activation": 1400,
  unlock: 950,
  "chest-reaction": 1250,
  opening: 1800,
  light: 1700,
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useAmbientSound() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioScheduledSourceNode[]>([]);

  const stop = () => {
    for (const source of sourcesRef.current) {
      try {
        source.stop();
      } catch {
        // Source may already be stopped.
      }
    }
    sourcesRef.current = [];
    void contextRef.current?.close();
    contextRef.current = null;
    masterRef.current = null;
  };

  const start = () => {
    if (contextRef.current) return;
    const AudioCtor = window.AudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    const master = context.createGain();
    master.gain.value = 0.075;
    master.connect(context.destination);

    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = "sine";
    drone.frequency.value = 54;
    droneGain.gain.value = 0.13;
    drone.connect(droneGain).connect(master);
    drone.start();

    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();
    overtone.type = "sine";
    overtone.frequency.value = 108.4;
    overtoneGain.gain.value = 0.035;
    overtone.connect(overtoneGain).connect(master);
    overtone.start();

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * 0.18;
    }
    const wind = context.createBufferSource();
    const windFilter = context.createBiquadFilter();
    const windGain = context.createGain();
    wind.buffer = noiseBuffer;
    wind.loop = true;
    windFilter.type = "lowpass";
    windFilter.frequency.value = 480;
    windGain.gain.value = 0.08;
    wind.connect(windFilter).connect(windGain).connect(master);
    wind.start();

    contextRef.current = context;
    masterRef.current = master;
    sourcesRef.current = [drone, overtone, wind];
  };

  const setEnabled = (enabled: boolean) => {
    if (enabled) {
      start();
      void contextRef.current?.resume();
      masterRef.current?.gain.setTargetAtTime(0.075, contextRef.current?.currentTime ?? 0, 0.4);
    } else if (contextRef.current && masterRef.current) {
      masterRef.current.gain.setTargetAtTime(0, contextRef.current.currentTime, 0.2);
    }
  };

  useEffect(() => stop, []);

  return { start, setEnabled };
}

function KeyArtifact({ phase }: { phase: EntryPhase }) {
  return (
    <div className={`key-flight key-flight--${phase}`} aria-hidden="true">
      <div className="key-artifact">
        <span className="key-aura" />
        <span className="key-ring"><i /></span>
        <span className="key-neck" />
        <span className="key-shaft">
          <i className="key-tooth key-tooth--one" />
          <i className="key-tooth key-tooth--two" />
        </span>
        <span className="key-glint" />
      </div>
    </div>
  );
}

function Treasure({ phase, wrong }: { phase: EntryPhase; wrong: boolean }) {
  return (
    <div className={`treasure-stage treasure-stage--${phase} ${wrong ? "is-wrong" : ""}`} aria-hidden="true">
      <div className="treasure-light" />
      <div className="treasure">
        <div className="treasure-lid">
          <span className="lid-inlay" />
          <span className="lid-ridge lid-ridge--left" />
          <span className="lid-ridge lid-ridge--right" />
        </div>
        <div className="treasure-body">
          <span className="body-inlay" />
          <span className="body-line body-line--left" />
          <span className="body-line body-line--right" />
          <span className="treasure-lock"><i /></span>
        </div>
        <span className="treasure-shadow" />
      </div>
    </div>
  );
}

export default function EntryExperience() {
  const [state, dispatch] = useReducer(advanceEntry, undefined, createEntryState);
  const [code, setCode] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const ambient = useAmbientSound();

  const isThreshold = state.phase === "threshold";
  const isChallenge = state.phase === "challenge";
  const isWelcome = state.phase === "welcome";
  const isUnlocking = [
    "recognition",
    "key-activation",
    "unlock",
    "chest-reaction",
    "opening",
    "light",
  ].includes(state.phase);

  const phaseLabel = useMemo(() => {
    const labels: Partial<Record<EntryPhase, string>> = {
      artifact: "ARTIFAKTI U ZBULUA",
      challenge: "PRAGU I PARË",
      recognition: "KODI U NJOH",
      "key-activation": "ÇELËSI U AKTIVIZUA",
      unlock: "BRAVA PO HAPET",
      "chest-reaction": "ENERGJIA PO ZGJOHET",
      opening: "THESARI PO HAPET",
      light: "KALIMI U HAP",
    };
    return labels[state.phase] ?? "";
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "artifact") return;
    const timer = window.setTimeout(
      () => dispatch({ type: "KEY_SETTLED" }),
      reducedMotion ? 700 : 5000,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase, reducedMotion]);

  useEffect(() => {
    if (!isUnlocking) return;
    const base = unlockDurations[state.phase] ?? 800;
    const timer = window.setTimeout(
      () => dispatch({ type: "ADVANCE" }),
      reducedMotion ? Math.min(base, 350) : base,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase, isUnlocking, reducedMotion]);

  useEffect(() => {
    if (isChallenge) codeInputRef.current?.focus();
  }, [isChallenge]);

  const enter = (withSound: boolean) => {
    setSoundEnabled(withSound);
    if (withSound) ambient.start();
    dispatch({ type: "ENTER", soundEnabled: withSound });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    ambient.setEnabled(next);
  };

  const submitCode = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) return;
    const isCorrect = code === "LD2026";
    dispatch({ type: "SUBMIT_CODE", code });
    if (!isCorrect) {
      setWrongFlash(true);
      window.setTimeout(() => {
        setWrongFlash(false);
        setCode("");
        codeInputRef.current?.focus();
      }, reducedMotion ? 150 : 650);
    }
  };

  const restart = () => {
    ambient.setEnabled(false);
    setSoundEnabled(false);
    setCode("");
    dispatch({ type: "RESET" });
  };

  return (
    <main className={`entry-world phase-${state.phase}`} data-phase={state.phase}>
      <div className="world-sky" aria-hidden="true">
        <span className="sun-core" />
        <span className="light-column" />
      </div>
      <div className="mountain-layer mountain-layer--far" aria-hidden="true" />
      <div className="mountain-layer mountain-layer--mid" aria-hidden="true" />
      <div className="mountain-layer mountain-layer--near" aria-hidden="true" />
      <div className="valley-path" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {!isThreshold && !isWelcome && (
        <header className="experience-hud">
          <div className="brand-mark" aria-label="Luftetari Digjital">
            <span>LD</span>
            <i />
            <small>LUFTETARI DIGJITAL</small>
          </div>
          <button className="sound-control" type="button" onClick={toggleSound} aria-pressed={soundEnabled}>
            <span className={`sound-orb ${soundEnabled ? "is-on" : ""}`} />
            SOUND {soundEnabled ? "ON" : "OFF"}
          </button>
        </header>
      )}

      {isThreshold && (
        <section className="threshold" aria-labelledby="entry-title">
          <div className="threshold-symbol" aria-hidden="true"><span>LD</span></div>
          <p className="eyebrow">PRAGU I PARË</p>
          <h1 id="entry-title">Hyrja kërkon<br />prani.</h1>
          <p className="threshold-copy">Jo çdo udhëtim fillon me një hap.<br />Disa fillojnë me një zgjedhje.</p>
          <div className="entry-actions" aria-label="Zgjidh eksperiencën e zërit">
            <button className="entry-button entry-button--primary" type="button" onClick={() => enter(true)}>
              <span>ENTER WITH SOUND</span><i aria-hidden="true">↗</i>
            </button>
            <button className="entry-button entry-button--quiet" type="button" onClick={() => enter(false)}>
              ENTER SILENTLY
            </button>
          </div>
          <p className="sound-note">Audio është i qetë dhe mund të çaktivizohet në çdo moment.</p>
        </section>
      )}

      {!isThreshold && !isWelcome && (
        <section className="artifact-scene" aria-label="Sekuenca e hyrjes">
          <div className="scene-status" aria-live="polite">
            <span>SEKUENCA 01</span>
            <i />
            <strong>{phaseLabel}</strong>
          </div>

          <KeyArtifact phase={state.phase} />
          <Treasure phase={state.phase} wrong={wrongFlash} />

          {isChallenge && (
            <div className="challenge-panel">
              <p className="eyebrow">NJË ARTEFAKT. NJË KOD. NJË HYRJE.</p>
              <h2>Hape thesarin.</h2>
              <p className="challenge-question">A e ke kodin?</p>
              <form onSubmit={submitCode} className="code-form">
                <label htmlFor="access-code" className="sr-only">Kodi i hyrjes</label>
                <input
                  ref={codeInputRef}
                  id="access-code"
                  className="code-input-native"
                  value={code}
                  onChange={(event) => setCode(normalizeAccessCode(event.target.value))}
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  aria-describedby="code-hint code-feedback"
                />
                <div className="code-cells" onClick={() => codeInputRef.current?.focus()} aria-hidden="true">
                  {Array.from({ length: 6 }, (_, index) => (
                    <span key={index} className={code[index] ? "is-filled" : index === code.length ? "is-active" : ""}>
                      {code[index] ?? ""}
                    </span>
                  ))}
                </div>
                <button className="unlock-button" type="submit" disabled={code.length !== 6}>
                  <span>PROVO KODIN</span><i aria-hidden="true">→</i>
                </button>
              </form>
              <p id="code-hint" className="code-hint">Vetëm ata që e dinë kodin mund të vazhdojnë.</p>
              <p id="code-feedback" className="code-feedback" role="status">{state.feedback}</p>
            </div>
          )}

          {isUnlocking && (
            <div className="unlock-copy" aria-live="polite">
              <p>{phaseLabel}</p>
              <span><i /></span>
            </div>
          )}
        </section>
      )}

      <div className="light-transition" aria-hidden="true" />

      {isWelcome && (
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-sigil" aria-hidden="true"><span>LD</span></div>
          <p className="eyebrow">HYRJA U HAP</p>
          <h2 id="welcome-title">Mirë se erdhe,<br /><em>Luftetar.</em></h2>
          <p>Ky është vetëm pragu. Udhëtimi yt fillon përtej dritës.</p>
          <div className="pillar-line" aria-label="Katër shtyllat">
            <span>MENDJA</span><i /><span>TRUPI</span><i /><span>SHPIRTI</span><i /><span>MISIONI</span>
          </div>
          <button type="button" className="restart-button" onClick={restart}>Rihap hyrjen</button>
        </section>
      )}

      <p className="motion-note">EXPERIENCE 01 · THE THRESHOLD</p>
    </main>
  );
}

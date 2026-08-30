"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  advanceChallenge,
  createChallengeState,
  createMemberId,
  normalizeRedeemCode,
  type ChallengeAction,
  type ChallengeState,
} from "../lib/challenge-machine";
import styles from "./challenge-experience.module.css";

const STORAGE_KEY = "ld-21-day-initiation-v1";
const unlockPhases = new Set([
  "recognition",
  "key-activation",
  "unlock",
  "chest-reaction",
  "opening",
  "light",
]);

const mentorChapters = [
  ["CHAPTER 01", "THE BEGINNING"],
  ["CHAPTER 02", "THE STRUGGLE"],
  ["CHAPTER 03", "THE REALIZATION"],
  ["CHAPTER 04", "THE DISCIPLINE"],
  ["CHAPTER 05", "THE MISSION"],
  ["CHAPTER 06", "LUFTETARI DIGJITAL"],
] as const;

const readinessQuestions = [
  "Are you ready to be tested?",
  "Are you ready to continue even when you don't feel like it?",
  "Are you ready to take responsibility for the next 21 days?",
  "Are you ready to give these 21 days everything you have?",
];

const commitmentLines = [
  "I understand that these 21 days will challenge my discipline, my energy, my focus and the standards I hold for myself.",
  "I will not quit simply because something becomes difficult.",
  "I will not allow temporary emotions to decide what I do.",
  "When I don't feel like continuing, I will remember why I started.",
  "When I face resistance, I will move forward.",
  "When I fail, I will take responsibility, learn and continue.",
  "I will respect my body.",
  "I will strengthen my mind.",
  "I will protect my spirit.",
  "I will work toward my mission.",
  "I understand that nobody can transform my life for me. The responsibility is mine.",
  "For the next 21 days, I commit to showing myself what I am capable of.",
  "I am not signing this promise for Luftetari Digjital. I am signing it for myself.",
];

function reducer(state: ChallengeState, action: ChallengeAction) {
  return advanceChallenge(state, action);
}

function useAmbientSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stop = useCallback(() => {
    if (gainRef.current) gainRef.current.gain.setTargetAtTime(0, 0, 0.18);
  }, []);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }
    if (typeof window === "undefined" || !("AudioContext" in window)) return;

    if (!contextRef.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      const low = context.createOscillator();
      const high = context.createOscillator();
      low.type = "sine";
      high.type = "sine";
      low.frequency.value = 54;
      high.frequency.value = 108;
      gain.gain.value = 0;
      low.connect(gain);
      high.connect(gain);
      gain.connect(context.destination);
      low.start();
      high.start();
      contextRef.current = context;
      gainRef.current = gain;
    }

    void contextRef.current.resume();
    gainRef.current?.gain.setTargetAtTime(0.018, 0, 1.4);
    return stop;
  }, [enabled, stop]);
}

function SceneFrame({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.scene} ${className}`}>
      <div className={styles.sceneContent}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {title && <h1 className={styles.title}>{title}</h1>}
        {children}
      </div>
    </section>
  );
}

export function ChallengeExperience() {
  const [state, dispatch] = useReducer(reducer, undefined, createChallengeState);
  const [code, setCode] = useState("");
  const [mentorChapter, setMentorChapter] = useState(0);
  const [readProgress, setReadProgress] = useState(0);
  const [signaturePath, setSignaturePath] = useState("");
  const [drawing, setDrawing] = useState(false);
  const signatureRef = useRef<SVGSVGElement>(null);
  const storageReadyRef = useRef(false);

  useAmbientSound(state.soundEnabled);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? (JSON.parse(saved) as ChallengeState) : null;
        if (parsed?.phase && parsed.member) {
          dispatch({ type: "RESTORE", state: parsed });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        storageReadyRef.current = true;
      }
    });
  }, []);

  useEffect(() => {
    if (!storageReadyRef.current || process.env.NODE_ENV === "test") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!unlockPhases.has(state.phase)) return;
    const timeout = window.setTimeout(() => dispatch({ type: "ADVANCE" }), 1400);
    return () => window.clearTimeout(timeout);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "seal") return;
    if (!state.member.memberId) {
      const random = new Uint32Array(1);
      crypto.getRandomValues(random);
      dispatch({
        type: "ASSIGN_MEMBER_ID",
        memberId: createMemberId(2026, (random[0] % 9999) + 1),
      });
      return;
    }
    const timeout = window.setTimeout(() => dispatch({ type: "ADVANCE" }), 2200);
    return () => window.clearTimeout(timeout);
  }, [state.member.memberId, state.phase]);

  const submitIdentity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch({
      type: "SET_IDENTITY",
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
    });
  };

  const submitCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "SUBMIT_CODE", code });
    if (normalizeRedeemCode(code) !== "LD2026") setCode("");
  };

  const pointFromEvent = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = signatureRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(600, ((event.clientX - rect.left) / rect.width) * 600)),
      y: Math.max(0, Math.min(220, ((event.clientY - rect.top) / rect.height) * 220)),
    };
  };

  const startSignature = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    if (!point) return;
    setDrawing(true);
    setSignaturePath((path) => `${path} M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`);
  };

  const drawSignature = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawing) return;
    const point = pointFromEvent(event);
    if (!point) return;
    setSignaturePath((path) => `${path} L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`);
  };

  const finishSignature = () => {
    setDrawing(false);
    if (signaturePath.includes(" L ")) dispatch({ type: "CREATE_SIGNATURE" });
  };

  const phaseLabel = state.phase.replaceAll("-", " ");

  return (
    <main
      className={`${styles.experience} ${styles[`phase_${state.phase}`] ?? ""}`}
      data-phase={state.phase}
      data-testid="challenge-experience"
    >
      <div className={styles.sky} aria-hidden="true" />
      <div className={`${styles.mountain} ${styles.mountainBack}`} aria-hidden="true" />
      <div className={`${styles.mountain} ${styles.mountainMid}`} aria-hidden="true" />
      <div className={`${styles.mountain} ${styles.mountainFront}`} aria-hidden="true" />
      <div className={styles.fog} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {state.phase !== "arrival" && state.phase !== "sound" && (
        <div className={styles.hud}>
          <span>LD · 21</span>
          <span>{phaseLabel}</span>
          <button
            className={styles.soundToggle}
            onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
            type="button"
          >
            Sound {state.soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      )}

      {state.phase === "arrival" && (
        <SceneFrame eyebrow="LUFTETARI DIGJITAL · 21-DAY CHALLENGE">
          <p className={styles.kicker}>THE INITIATION</p>
          <h1 className={styles.displayTitle}>You are not here to consume.</h1>
          <p className={styles.lead}>For the next 21 days, you are here to be tested.</p>
          <p className={styles.prompt}>Are you ready to become a Luftetar Digjital?</p>
          <button className={styles.primary} onClick={() => dispatch({ type: "BEGIN" })}>
            BEGIN INITIATION
          </button>
        </SceneFrame>
      )}

      {state.phase === "sound" && (
        <SceneFrame eyebrow="ENTRY PROTOCOL" title="How do you want to enter?">
          <p className={styles.lead}>Sound supports the atmosphere. Silence remains a complete path.</p>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              onClick={() => dispatch({ type: "CHOOSE_SOUND", enabled: true })}
            >
              ENTER WITH SOUND
            </button>
            <button
              className={styles.secondary}
              onClick={() => dispatch({ type: "CHOOSE_SOUND", enabled: false })}
            >
              ENTER SILENTLY
            </button>
          </div>
        </SceneFrame>
      )}

      {state.phase === "identity" && (
        <SceneFrame eyebrow="IDENTITY · 01" title="Before we begin...">
          <p className={styles.lead}>Tell us who is entering.</p>
          <form className={styles.form} onSubmit={submitIdentity}>
            <label>
              FIRST NAME
              <input name="firstName" required autoComplete="given-name" />
            </label>
            <label>
              LAST NAME
              <input name="lastName" required autoComplete="family-name" />
            </label>
            <button className={styles.primary} type="submit">CONTINUE</button>
          </form>
        </SceneFrame>
      )}

      {state.phase === "redeem" && (
        <SceneFrame eyebrow="ACCESS · 02" title="The gate is locked.">
          <p className={styles.personal}>{state.member.firstName}, your initiation begins now.</p>
          <div className={styles.artifactStage} aria-hidden="true">
            <div className={styles.key}><i /><b /></div>
            <div className={styles.vault}><span /></div>
          </div>
          <p className={styles.lead}>Enter the code you received to unlock your journey.</p>
          <form className={styles.codeForm} onSubmit={submitCode}>
            <label className={styles.srOnly} htmlFor="redeem-code">Redeem code</label>
            <input
              id="redeem-code"
              className={styles.codeInput}
              value={code}
              onChange={(event) => setCode(normalizeRedeemCode(event.target.value).slice(0, 6))}
              maxLength={6}
              inputMode="text"
              autoComplete="one-time-code"
              placeholder="______"
            />
            <button className={styles.primary} disabled={code.length !== 6} type="submit">UNLOCK</button>
          </form>
          {state.feedback && <p className={styles.feedback} role="status">{state.feedback}</p>}
        </SceneFrame>
      )}

      {unlockPhases.has(state.phase) && (
        <SceneFrame eyebrow="ACCESS RECOGNIZED" className={styles.unlockScene}>
          <div className={styles.unlockArtifact} aria-hidden="true">
            <div className={styles.key}><i /><b /></div>
            <div className={styles.vault}><span /></div>
            <div className={styles.unlockLight} />
          </div>
          <p className={styles.sequenceLabel}>{phaseLabel}</p>
          <p className={styles.codeGlow}>LD2026</p>
        </SceneFrame>
      )}

      {state.phase === "mentor" && (
        <SceneFrame eyebrow={mentorChapters[mentorChapter][0]} title={mentorChapters[mentorChapter][1]}>
          <p className={styles.kicker}>EVERY WARRIOR STARTS SOMEWHERE.</p>
          <div className={styles.contentRequired}>
            <span>MENTOR&apos;S JOURNEY</span>
            <strong>[CONTENT REQUIRED]</strong>
            <p>The actual mentor story, imagery and video will be inserted here. No story has been invented.</p>
          </div>
          <div className={styles.chapterRail} aria-label="Mentor journey progress">
            {mentorChapters.map((chapter, index) => (
              <span key={chapter[1]} data-active={index <= mentorChapter} />
            ))}
          </div>
          <button
            className={styles.primary}
            onClick={() => {
              if (mentorChapter < mentorChapters.length - 1) setMentorChapter((value) => value + 1);
              else dispatch({ type: "COMPLETE_MENTOR" });
            }}
          >
            {mentorChapter < mentorChapters.length - 1 ? "CONTINUE THE JOURNEY" : "UNDERSTAND THE RULE"}
          </button>
        </SceneFrame>
      )}

      {state.phase === "rule" && (
        <SceneFrame eyebrow="THE LD RULE" title={'At LD, “no” does not exist.'}>
          <p className={styles.ruleCopy}>When the mission becomes difficult, you do not immediately escape it. You look for a way forward.</p>
          <p className={styles.ruleStatement}>FOR 21 DAYS, YOU CHOOSE DISCIPLINE OVER EXCUSES.</p>
          <p className={styles.safety}>Safety, health and personal boundaries remain valid. This principle removes unnecessary excuses—not reasonable boundaries.</p>
          <button className={styles.primary} onClick={() => dispatch({ type: "ACCEPT_RULE" })}>I UNDERSTAND</button>
        </SceneFrame>
      )}

      {state.phase === "readiness" && (
        <SceneFrame eyebrow={`QUESTION 0${state.readinessStep + 1} · 04`} title={`${state.member.firstName.toUpperCase()}, ARE YOU READY?`}>
          <p className={styles.readinessQuestion}>{readinessQuestions[state.readinessStep]}</p>
          <button className={styles.decision} onClick={() => dispatch({ type: "CONFIRM_READINESS" })}>I AM</button>
        </SceneFrame>
      )}

      {state.phase === "final-readiness" && (
        <SceneFrame eyebrow="THE DECISION" title="Are you ready to become a Luftetar Digjital?">
          <button className={styles.decision} onClick={() => dispatch({ type: "ACCEPT_FINAL_READINESS" })}>I&apos;M READY</button>
        </SceneFrame>
      )}

      {state.phase === "commitment" && (
        <SceneFrame eyebrow="YOUR WORD · 21 DAYS" title="The 21-Day Commitment">
          <div className={styles.documentShell}>
            <div
              className={styles.document}
              onScroll={(event) => {
                const element = event.currentTarget;
                const max = element.scrollHeight - element.clientHeight;
                const progress = max <= 0 ? 100 : Math.round((element.scrollTop / max) * 100);
                setReadProgress(Math.min(100, progress));
              }}
            >
              <h2>THE 21-DAY COMMITMENT</h2>
              <p>I, <strong>{state.member.fullName}</strong>, choose to enter the next 21 days willingly.</p>
              {commitmentLines.map((line) => <p key={line}>{line}</p>)}
              <div className={styles.documentEnd}>END OF COMMITMENT</div>
            </div>
            <div className={styles.readingProgress}>
              <span>READING COMMITMENT</span>
              <div><i style={{ width: `${readProgress}%` }} /></div>
              <strong>{readProgress}%</strong>
            </div>
          </div>
          <button
            className={styles.primary}
            disabled={readProgress < 98}
            onClick={() => dispatch({ type: "MARK_COMMITMENT_READ" })}
          >
            {readProgress >= 98 ? "COMMITMENT READ" : "READ TO THE END"}
          </button>
        </SceneFrame>
      )}

      {state.phase === "signature" && (
        <SceneFrame eyebrow="COMMITMENT READ" title="Your word means something.">
          <p className={styles.lead}>Sign below only if you are ready to honor the commitment you just made.</p>
          <div className={styles.signatureShell}>
            <svg
              ref={signatureRef}
              className={styles.signaturePad}
              viewBox="0 0 600 220"
              role="img"
              aria-label="Draw your signature"
              onPointerDown={startSignature}
              onPointerMove={drawSignature}
              onPointerUp={finishSignature}
              onPointerCancel={finishSignature}
            >
              <path d={signaturePath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {!signaturePath && <text x="300" y="112" textAnchor="middle">Draw your signature</text>}
            </svg>
            <span>Signature of {state.member.fullName}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => { setSignaturePath(""); setDrawing(false); }}>CLEAR</button>
            <button
              className={styles.primary}
              disabled={!state.signatureCreated}
              onClick={() => dispatch({ type: "SEAL_COMMITMENT" })}
            >
              SEAL MY COMMITMENT
            </button>
          </div>
        </SceneFrame>
      )}

      {state.phase === "seal" && (
        <SceneFrame eyebrow="COMMITMENT ACCEPTED" title={state.member.fullName}>
          <div className={styles.seal} aria-label="Luftetari Digjital 21-Day Challenge committed seal">
            <span>LUFTETARI DIGJITAL</span><strong>LD</strong><span>21-DAY · COMMITTED</span>
          </div>
          <p className={styles.lead}>Your signature is sealed. Your word now has a beginning.</p>
        </SceneFrame>
      )}

      {state.phase === "member" && (
        <SceneFrame eyebrow="INITIATION RECOGNIZED" title="You entered something.">
          <div className={styles.memberCard}>
            <span>LUFTETARI DIGJITAL</span>
            <small>21-DAY CHALLENGE</small>
            <strong>{state.member.fullName}</strong>
            <code>{state.member.memberId}</code>
            <b>DAY 0 / 21</b>
          </div>
          <button className={styles.primary} onClick={() => dispatch({ type: "ADVANCE" })}>RECEIVE YOUR JOURNEY</button>
        </SceneFrame>
      )}

      {state.phase === "day-zero" && (
        <SceneFrame eyebrow="DAY 0 · INITIATION COMPLETE" title="Your old routine ends here.">
          <div className={styles.journeyTrack} aria-label="Day 0 of 21 complete">
            <span className={styles.activeDay}>00</span>
            {Array.from({ length: 21 }, (_, index) => <i key={index} />)}
            <span>21</span>
          </div>
          <p className={styles.dayOne}>DAY 1 BEGINS NOW.</p>
          <button className={styles.decision} onClick={() => dispatch({ type: "ENTER_DAY_ONE" })}>ENTER DAY 1 →</button>
        </SceneFrame>
      )}

      {state.phase === "day-one" && (
        <SceneFrame eyebrow="DAY 1 · THE BEGINNING" title={`Welcome, ${state.member.firstName}.`}>
          <div className={styles.contentRequired}>
            <span>DAY 1 EXPERIENCE</span>
            <strong>[CONTENT REQUIRED]</strong>
            <p>The first mission will connect here when Day 1 content and backend delivery are approved.</p>
          </div>
        </SceneFrame>
      )}
    </main>
  );
}

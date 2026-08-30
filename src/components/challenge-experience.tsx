"use client";

import Image from "next/image";
import {
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
  type ChallengePhase,
  type ChallengeState,
} from "../lib/challenge-machine";
import styles from "./challenge-experience.module.css";

const STORAGE_KEY = "ld-21-day-initiation-v2";
const MUSIC_VIDEO_ID = "kjlu9RRHcbE";
const unlockPhases = new Set<ChallengePhase>([
  "recognition",
  "key-activation",
  "unlock",
  "chest-reaction",
  "opening",
  "light",
]);

const mentorChapters = [
  ["KAPITULLI 01", "FILLIMI"],
  ["KAPITULLI 02", "PËRBALLJA"],
  ["KAPITULLI 03", "KUPTIMI"],
  ["KAPITULLI 04", "DISIPLINA"],
  ["KAPITULLI 05", "MISIONI"],
  ["KAPITULLI 06", "LUFTETARI DIGJITAL"],
] as const;

const readinessQuestions = [
  "A je gati të testohesh?",
  "A je gati të vazhdosh edhe kur nuk ke vullnet?",
  "A je gati të marrësh përgjegjësi për 21 ditët e ardhshme?",
  "A je gati t'u japësh këtyre 21 ditëve gjithçka që ke?",
];

const commitmentLines = [
  "E kuptoj se këto 21 ditë do ta sfidojnë disiplinën, energjinë, fokusin dhe standardin që kërkoj nga vetja.",
  "Nuk do të dorëzohem vetëm sepse diçka bëhet e vështirë.",
  "Nuk do t'i lejoj emocionet e përkohshme të vendosin se çfarë bëj.",
  "Kur të mos kem vullnet të vazhdoj, do të kujtoj pse e nisa.",
  "Kur të përballem me rezistencë, do të lëviz përpara.",
  "Kur të dështoj, do të marr përgjegjësi, do të mësoj dhe do të vazhdoj.",
  "Do ta respektoj trupin tim.",
  "Do ta forcoj mendjen time.",
  "Do ta mbroj shpirtin tim.",
  "Do të punoj drejt misionit tim.",
  "E kuptoj se askush nuk mund ta transformojë jetën time për mua. Përgjegjësia është e imja.",
  "Për 21 ditët e ardhshme angazhohem t'ia dëshmoj vetes se për çfarë jam i aftë.",
  "Këtë zotim nuk po e nënshkruaj për Luftetari Digjital. Po e nënshkruaj për veten.",
];

const phaseCopy: Partial<Record<ChallengePhase, string>> = {
  identity: "IDENTITETI",
  redeem: "AKSESI",
  recognition: "KODI U NJOH",
  "key-activation": "ÇELËSI U AKTIVIZUA",
  unlock: "PORTA PO HAPET",
  "chest-reaction": "SISTEMI PO PËRGJIGJET",
  opening: "AKSESI U ZHBLLOKUA",
  light: "KALIMI U KONFIRMUA",
  mentor: "RRUGËTIMI I MENTORIT",
  rule: "RREGULLI I LD-SË",
  readiness: "TESTI I GATISHMËRISË",
  "final-readiness": "VENDIMI",
  commitment: "ZOTIMI 21-DITOR",
  signature: "NËNSHKRIMI",
  seal: "VULA DIGJITALE",
  member: "IDENTITETI I ANËTARIT",
  "day-zero": "DITA 0 / 21",
  "day-one": "DITA 1",
};

function reducer(state: ChallengeState, action: ChallengeAction) {
  return advanceChallenge(state, action);
}

function BackgroundMusic({ enabled }: { enabled: boolean }) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const command = (func: string, args: number[] = []) => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube.com",
    );
  };

  useEffect(() => {
    if (!enabled) return;
    const first = window.setTimeout(() => {
      command("setVolume", [100]);
      command("playVideo");
    }, 350);
    const second = window.setTimeout(() => {
      command("setVolume", [100]);
      command("playVideo");
    }, 1400);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <iframe
      ref={playerRef}
      className={styles.musicPlayer}
      title="Muzika e inicimit"
      src={`https://www.youtube.com/embed/${MUSIC_VIDEO_ID}?autoplay=1&loop=1&playlist=${MUSIC_VIDEO_ID}&controls=0&disablekb=1&enablejsapi=1&playsinline=1&rel=0`}
      allow="autoplay; encrypted-media"
      onLoad={() => {
        command("setVolume", [100]);
        command("playVideo");
      }}
      tabIndex={-1}
    />
  );
}

function BrandHeader({ phase }: { phase: ChallengePhase }) {
  return (
    <header className={styles.brandHeader}>
      <div className={styles.brandLockup}>
        <Image src="/ld-logo.png" alt="Logoja Luftetari Digjital" width={54} height={54} priority />
        <div><strong>LUFTETARI</strong><span>DIGJITAL</span></div>
      </div>
      <div className={styles.headerMeta}>
        <span>SFIDA 21-DITORE</span>
        <b>{phaseCopy[phase] ?? "INICIMI"}</b>
      </div>
    </header>
  );
}

function PillarRail() {
  return (
    <div className={styles.pillarRail} aria-label="Katër shtyllat e Luftetari Digjital">
      <span data-pillar="mendja">MENDJA</span>
      <span data-pillar="trupi">TRUPI</span>
      <span data-pillar="shpirti">SHPIRTI</span>
      <span data-pillar="misioni">MISIONI</span>
    </div>
  );
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

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? (JSON.parse(saved) as ChallengeState) : null;
        if (parsed?.phase && parsed.member) {
          dispatch({
            type: "RESTORE",
            state: {
              ...parsed,
              soundEnabled: Boolean(parsed.redeemCodeValidated),
            },
          });
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

  return (
    <main
      className={`${styles.experience} ${styles[`phase_${state.phase}`] ?? ""}`}
      data-phase={state.phase}
      data-testid="challenge-experience"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <BackgroundMusic enabled={state.soundEnabled} />
      <BrandHeader phase={state.phase} />

      {state.phase === "arrival" && (
        <SceneFrame eyebrow="PROGRAMI I TRANSFORMIMIT · 21 DITË" className={styles.arrivalScene}>
          <div className={styles.heroLogo}>
            <Image src="/ld-logo.png" alt="Luftetari Digjital" width={150} height={150} priority />
          </div>
          <p className={styles.kicker}>INICIMI</p>
          <h1 className={styles.displayTitle}>21 ditët e ardhshme nuk janë për konsum.</h1>
          <p className={styles.lead}>Janë për disiplinë, veprim dhe standard më të lartë.</p>
          <div className={styles.statusPanel}>
            <span>STATUSI I HYRJES</span><strong>GATI PËR INICIM</strong><i />
          </div>
          <button className={styles.primary} onClick={() => dispatch({ type: "BEGIN" })}>
            NIS INICIMIN <span>→</span>
          </button>
        </SceneFrame>
      )}

      {state.phase === "identity" && (
        <SceneFrame eyebrow="HAPI 01 · IDENTITETI" title="Para se të fillojmë...">
          <p className={styles.lead}>Na trego kush po hyn në sfidë.</p>
          <form className={styles.form} onSubmit={submitIdentity}>
            <label>EMRI<input name="firstName" required autoComplete="given-name" placeholder="Shkruaj emrin" /></label>
            <label>MBIEMRI<input name="lastName" required autoComplete="family-name" placeholder="Shkruaj mbiemrin" /></label>
            <button className={styles.primary} type="submit">VAZHDO <span>→</span></button>
          </form>
        </SceneFrame>
      )}

      {state.phase === "redeem" && (
        <SceneFrame eyebrow="HAPI 02 · AKSESI" title="Aksesi yt është i kufizuar.">
          <p className={styles.personal}>{state.member.firstName}, inicimi yt fillon tani.</p>
          <div className={styles.lockCore} aria-hidden="true"><span>⌑</span><i /><b /></div>
          <p className={styles.lead}>Vendos kodin unik që ke pranuar për ta hapur portën.</p>
          <form className={styles.codeForm} onSubmit={submitCode}>
            <label className={styles.srOnly} htmlFor="redeem-code">Kodi i aksesit</label>
            <input
              id="redeem-code"
              className={styles.codeInput}
              value={code}
              onChange={(event) => setCode(normalizeRedeemCode(event.target.value).slice(0, 6))}
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="VENDOS KODIN"
            />
            <button className={styles.primary} disabled={code.length !== 6} type="submit">HAP PORTËN <span>→</span></button>
          </form>
          {state.feedback && <p className={styles.feedback} role="status">{state.feedback}</p>}
        </SceneFrame>
      )}

      {unlockPhases.has(state.phase) && (
        <SceneFrame eyebrow="AKSESI U VERIFIKUA" className={styles.unlockScene}>
          <div className={styles.accessCore} aria-hidden="true">
            <Image src="/ld-logo.png" alt="" width={132} height={132} />
            <div className={styles.coreRing} /><div className={styles.coreSweep} />
          </div>
          <p className={styles.sequenceLabel}>{phaseCopy[state.phase]}</p>
          <p className={styles.codeGlow}>LD2026</p>
          <div className={styles.unlockProgress}><i /></div>
        </SceneFrame>
      )}

      {state.phase === "mentor" && (
        <SceneFrame eyebrow={mentorChapters[mentorChapter][0]} title={mentorChapters[mentorChapter][1]}>
          <p className={styles.kicker}>ÇDO LUFTETAR NIS DIKU.</p>
          <div className={styles.contentRequired}>
            <span>RRUGËTIMI I MENTORIT</span><strong>[PËRMBAJTJA KËRKOHET]</strong>
            <p>Këtu do të vendoset historia, fotografia ose videoja reale e mentorit. Asnjë histori nuk është improvizuar.</p>
          </div>
          <div className={styles.chapterRail} aria-label="Progresi i rrugëtimit të mentorit">
            {mentorChapters.map((chapter, index) => <span key={chapter[1]} data-active={index <= mentorChapter} />)}
          </div>
          <button className={styles.primary} onClick={() => {
            if (mentorChapter < mentorChapters.length - 1) setMentorChapter((value) => value + 1);
            else dispatch({ type: "COMPLETE_MENTOR" });
          }}>
            {mentorChapter < mentorChapters.length - 1 ? "VAZHDO RRUGËTIMIN" : "KUPTO RREGULLIN"} <span>→</span>
          </button>
        </SceneFrame>
      )}

      {state.phase === "rule" && (
        <SceneFrame eyebrow="RREGULLI I LD-SË" title={'Në LD, “nuk mundem” nuk është fundi.'}>
          <p className={styles.ruleCopy}>Kur misioni bëhet i vështirë, nuk ikën menjëherë. Ndal, vlerëso dhe kërko rrugën përpara.</p>
          <p className={styles.ruleStatement}>PËR 21 DITË, ZGJEDH DISIPLINËN PARA ARSYETIMEVE.</p>
          <p className={styles.safety}>Siguria, shëndeti dhe kufijtë personalë mbeten të vlefshëm. Ky standard largon arsyetimet e panevojshme, jo kufijtë e arsyeshëm.</p>
          <button className={styles.primary} onClick={() => dispatch({ type: "ACCEPT_RULE" })}>E KUPTOJ <span>→</span></button>
        </SceneFrame>
      )}

      {state.phase === "readiness" && (
        <SceneFrame eyebrow={`PYETJA 0${state.readinessStep + 1} · 04`} title={`${state.member.firstName.toUpperCase()}, A JE GATI?`}>
          <p className={styles.readinessQuestion}>{readinessQuestions[state.readinessStep]}</p>
          <button className={styles.decision} onClick={() => dispatch({ type: "CONFIRM_READINESS" })}>PO, JAM <span>→</span></button>
        </SceneFrame>
      )}

      {state.phase === "final-readiness" && (
        <SceneFrame eyebrow="VENDIMI" title="A je gati të bëhesh Luftetar Digjital?">
          <button className={styles.decision} onClick={() => dispatch({ type: "ACCEPT_FINAL_READINESS" })}>JAM GATI <span>→</span></button>
        </SceneFrame>
      )}

      {state.phase === "commitment" && (
        <SceneFrame eyebrow="FJALA JOTE · 21 DITË" title="Zotimi 21-Ditor">
          <div className={styles.documentShell}>
            <div className={styles.document} onScroll={(event) => {
              const element = event.currentTarget;
              const max = element.scrollHeight - element.clientHeight;
              const progress = max <= 0 ? 100 : Math.round((element.scrollTop / max) * 100);
              setReadProgress(Math.min(100, progress));
            }}>
              <h2>ZOTIMI 21-DITOR</h2>
              <p>Unë, <strong>{state.member.fullName}</strong>, zgjedh të hyj vullnetarisht në 21 ditët e ardhshme.</p>
              {commitmentLines.map((line) => <p key={line}>{line}</p>)}
              <div className={styles.documentEnd}>FUNDI I ZOTIMIT</div>
            </div>
            <div className={styles.readingProgress}><span>LEXIMI I ZOTIMIT</span><div><i style={{ width: `${readProgress}%` }} /></div><strong>{readProgress}%</strong></div>
          </div>
          <button className={styles.primary} disabled={readProgress < 98} onClick={() => dispatch({ type: "MARK_COMMITMENT_READ" })}>
            {readProgress >= 98 ? "E LEXOVA ZOTIMIN" : "LEXO DERI NË FUND"}
          </button>
        </SceneFrame>
      )}

      {state.phase === "signature" && (
        <SceneFrame eyebrow="ZOTIMI U LEXUA" title="Fjala jote ka peshë.">
          <p className={styles.lead}>Nënshkruaj vetëm nëse je gati ta respektosh zotimin që sapo bëre.</p>
          <div className={styles.signatureShell}>
            <svg
              ref={signatureRef}
              className={styles.signaturePad}
              viewBox="0 0 600 220"
              role="img"
              aria-label="Vizato nënshkrimin tënd"
              onPointerDown={startSignature}
              onPointerMove={drawSignature}
              onPointerUp={finishSignature}
              onPointerCancel={finishSignature}
            >
              <path d={signaturePath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {!signaturePath && <text x="300" y="112" textAnchor="middle">Vizato nënshkrimin këtu</text>}
            </svg>
            <span>Nënshkrimi i {state.member.fullName}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => { setSignaturePath(""); setDrawing(false); }}>PASTRO</button>
            <button className={styles.primary} disabled={!state.signatureCreated} onClick={() => dispatch({ type: "SEAL_COMMITMENT" })}>VULO ZOTIMIN TIM</button>
          </div>
        </SceneFrame>
      )}

      {state.phase === "seal" && (
        <SceneFrame eyebrow="ZOTIMI U PRANUA" title={state.member.fullName}>
          <div className={styles.seal} aria-label="Vula e zotimit Luftetari Digjital"><span>LUFTETARI DIGJITAL</span><strong>LD</strong><span>21 DITË · I ZOTUAR</span></div>
          <p className={styles.lead}>Nënshkrimi yt u vulos. Fjala jote tani ka një fillim.</p>
        </SceneFrame>
      )}

      {state.phase === "member" && (
        <SceneFrame eyebrow="INICIMI U KONFIRMUA" title="Tani je pjesë e rrugëtimit.">
          <div className={styles.memberCard}>
            <Image src="/ld-logo.png" alt="" width={72} height={72} />
            <span>LUFTETARI DIGJITAL</span><small>SFIDA 21-DITORE</small><strong>{state.member.fullName}</strong><code>{state.member.memberId}</code><b>DITA 0 / 21</b>
          </div>
          <button className={styles.primary} onClick={() => dispatch({ type: "ADVANCE" })}>SHIKO RRUGËTIMIN <span>→</span></button>
        </SceneFrame>
      )}

      {state.phase === "day-zero" && (
        <SceneFrame eyebrow="DITA 0 · INICIMI U PËRFUNDUA" title="Rutina jote e vjetër përfundon këtu.">
          <div className={styles.journeyTrack} aria-label="Dita 0 nga 21"><span className={styles.activeDay}>00</span>{Array.from({ length: 21 }, (_, index) => <i key={index} />)}<span>21</span></div>
          <p className={styles.dayOne}>DITA 1 FILLON TANI.</p>
          <button className={styles.decision} onClick={() => dispatch({ type: "ENTER_DAY_ONE" })}>HYR NË DITËN 1 <span>→</span></button>
        </SceneFrame>
      )}

      {state.phase === "day-one" && (
        <SceneFrame eyebrow="DITA 1 · FILLIMI" title={`Mirë se erdhe, ${state.member.firstName}.`}>
          <div className={styles.contentRequired}><span>EKSPERIENCA E DITËS 1</span><strong>[PËRMBAJTJA KËRKOHET]</strong><p>Misioni i parë lidhet këtu pasi të aprovohen përmbajtja e Ditës 1 dhe sistemi teknik.</p></div>
        </SceneFrame>
      )}

      <PillarRail />
    </main>
  );
}

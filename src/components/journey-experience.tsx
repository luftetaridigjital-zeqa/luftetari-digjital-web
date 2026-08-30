"use client";

import Image from "next/image";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { journeyScreens, type JourneyScreen } from "../lib/journey-content";
import {
  advanceJourney,
  createJourneyState,
  JOURNEY_SCREEN_COUNT,
  type JourneyAction,
  type JourneyState,
} from "../lib/journey-machine";
import styles from "./journey-experience.module.css";

const STORAGE_KEY = "ld-rrugetimi-v1";
const MUSIC_VIDEO_ID = "kjlu9RRHcbE";

function reducer(state: JourneyState, action: JourneyAction) {
  return advanceJourney(state, action);
}

function Music({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const send = (func: string, args: number[] = []) => {
      ref.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "https://www.youtube.com",
      );
    };
    const timer = window.setTimeout(() => {
      send("setVolume", [100]);
      send("playVideo");
    }, 500);
    return () => window.clearTimeout(timer);
  }, [enabled]);
  if (!enabled) return null;
  return (
    <iframe
      ref={ref}
      title="Muzika e rrugëtimit"
      src={`https://www.youtube.com/embed/${MUSIC_VIDEO_ID}?autoplay=1&loop=1&playlist=${MUSIC_VIDEO_ID}&controls=0&enablejsapi=1&playsinline=1&rel=0`}
      allow="autoplay; encrypted-media"
      style={{ position: "fixed", width: 1, height: 1, left: -10, border: 0, opacity: 0.001 }}
      tabIndex={-1}
    />
  );
}

function ScreenAsset({ screen }: { screen: JourneyScreen }) {
  if (!screen.asset) return null;
  return (
    <Image
      className={`${styles.asset} ${screen.assetSmall ? styles.assetSmall : ""}`}
      src={screen.asset}
      alt={screen.assetAlt ?? ""}
      width={320}
      height={320}
      priority={screen.id < 4}
    />
  );
}

function TextContent({ screen }: { screen: JourneyScreen }) {
  if (screen.kind === "breathing") return null;
  return (
    <>
      {screen.eyebrow && <p className={styles.eyebrow}>{screen.eyebrow}</p>}
      {screen.title && (
        <h1 className={`${styles.title} ${screen.accent === "gold" ? styles.titleGold : ""}`}>
          {screen.title}
        </h1>
      )}
      {screen.copy.map((line, index) => {
        if (line.style === "quote") return <blockquote className={styles.quote} key={`${line.text}-${index}`}>{line.text}</blockquote>;
        if (line.style === "divider") return <div className={styles.divider} key={`divider-${index}`} aria-hidden="true" />;
        return <p className={line.style === "lead" ? styles.lead : styles.body} key={`${line.text}-${index}`}>{line.text}</p>;
      })}
    </>
  );
}

function SelectionOptions({
  screen,
  selected,
  onSelect,
}: {
  screen: JourneyScreen;
  selected: string[];
  onSelect: (option: string) => void;
}) {
  if (!screen.options.length || !["scale", "choice", "choice-cards"].includes(screen.kind)) return null;
  if (screen.kind === "scale") {
    return (
      <div className={styles.scale}>
        {screen.options.map((option) => (
          <button
            className={styles.scaleButton}
            data-selected={selected.includes(option)}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >{option}</button>
        ))}
      </div>
    );
  }
  const cards = screen.kind === "choice-cards";
  return (
    <div className={`${styles.choiceGrid} ${cards ? styles.choiceCards : ""}`}>
      {screen.options.map((option) => {
        const [title, description = ""] = option.split("||");
        return (
          <button
            aria-pressed={selected.includes(option)}
            className={styles.choice}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {cards ? <><strong>{title}</strong><span>{description}</span></> : title}
          </button>
        );
      })}
    </div>
  );
}

function FormContent({ screen }: { screen: JourneyScreen }) {
  if (screen.kind !== "form" && screen.kind !== "manifest") return null;
  return (
    <div className={styles.panel}>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        {screen.kind === "form" && (
          <>
            <label className={styles.label}>EMRI<input className={styles.input} name="name" placeholder="Emri yt..." /></label>
            <label className={styles.label}>EMAIL<input className={styles.input} name="email" type="email" placeholder="email@shembull.com" /></label>
          </>
        )}
        <div className={styles.checkList}>
          {screen.options.map((option) => (
            <label className={styles.check} key={option}>
              <input type="checkbox" />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {screen.kind === "form" && <textarea className={styles.textarea} aria-label="Përgjigjja jote" placeholder="Përgjigju nga vendi më i sinqertë që ke brenda..." />}
      </form>
    </div>
  );
}

function PillarContent({ screen }: { screen: JourneyScreen }) {
  if (screen.kind !== "pillar") return null;
  return (
    <div className={styles.pillarList} style={{ "--pillar": screen.pillarColor ?? "#d9b42c" } as React.CSSProperties}>
      {screen.options.map((option) => <div className={styles.pillarItem} key={option}><i>☆</i><span>{option}</span></div>)}
    </div>
  );
}

function BreathingContent({ screen }: { screen: JourneyScreen }) {
  if (screen.kind !== "breathing") return null;
  const active = Math.max(0, Math.min(2, screen.breathCycle ?? 0));
  return (
    <div className={styles.breathing}>
      <div className={styles.breathDots} aria-label={`Cikli ${active + 1} nga 3`}>
        {[0,1,2].map((index) => <i data-active={index === active} key={index} />)}
      </div>
      <p className={styles.hint}>Cikli {active + 1} nga 3</p>
      <div className={styles.breathCircle}>{screen.breathCount ?? 4}</div>
      {screen.breathLabel && <p className={styles.lead}>{screen.breathLabel}</p>}
      {screen.breathHint && <p className={styles.hint}>{screen.breathHint}</p>}
    </div>
  );
}

export function JourneyExperience({ initialIndex }: { initialIndex?: number }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialIndex,
    (index) => ({
      ...createJourneyState(),
      currentIndex: typeof index === "number" ? Math.min(52, Math.max(0, index)) : 0,
    }),
  );
  const [code, setCode] = useState("");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const readyRef = useRef(false);
  const screen = journeyScreens[state.currentIndex];
  const selected = state.selections[state.currentIndex] ?? [];

  useEffect(() => {
    if (typeof initialIndex === "number" || process.env.NODE_ENV === "test") return;
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) dispatch({ type: "RESTORE", state: JSON.parse(saved) as JourneyState });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        readyRef.current = true;
      }
    });
  }, [initialIndex]);

  useEffect(() => {
    if (!readyRef.current || typeof initialIndex === "number" || process.env.NODE_ENV === "test") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [initialIndex, state]);

  useEffect(() => {
    if (!screen.autoAdvanceMs) return;
    const timer = window.setTimeout(() => dispatch({ type: "NEXT" }), screen.autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [screen.autoAdvanceMs, screen.id]);

  const progress = `${((state.currentIndex + 1) / JOURNEY_SCREEN_COUNT) * 100}%`;
  const canContinue = !screen.requiredSelections || selected.length >= screen.requiredSelections;

  const next = () => {
    if (screen.kind === "code") {
      if (code.trim().length < 6) return;
      setMusicEnabled(true);
    }
    dispatch({ type: "NEXT" });
  };

  const contentClass = useMemo(() => {
    if (screen.kind === "story" || screen.kind === "email") return `${styles.content} ${styles.contentStory}`;
    if (["choice-cards","form","manifest"].includes(screen.kind)) return `${styles.content} ${styles.contentWide}`;
    return styles.content;
  }, [screen.kind]);

  return (
    <main
      className={styles.journey}
      data-screen-index={state.currentIndex + 1}
      data-testid="journey-experience"
      style={{ "--progress": progress } as React.CSSProperties}
    >
      <div className={styles.stars} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <Music enabled={musicEnabled} />
      <button
        aria-label={musicEnabled ? "Audio aktive" : "Audio joaktive"}
        className={styles.audio}
        onClick={() => setMusicEnabled((value) => !value)}
        type="button"
      >{musicEnabled ? "◖))" : "◖)"}</button>

      <section className={styles.screen}>
        <div className={contentClass}>
          <ScreenAsset screen={screen} />
          <TextContent screen={screen} />
          {screen.kind === "code" && (
            <>
              <input
                aria-label="Kodi i portës"
                className={styles.codeInput}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => { if (event.key === "Enter") next(); }}
                value={code}
              />
              <p className={styles.hint}>Shtyp Enter për të hapur portën</p>
            </>
          )}
          <FormContent screen={screen} />
          <PillarContent screen={screen} />
          <SelectionOptions
            screen={screen}
            selected={selected}
            onSelect={(option) => dispatch({ type: "SELECT", option, maxSelections: screen.maxSelections ?? 1 })}
          />
          <BreathingContent screen={screen} />
          {!screen.autoAdvanceMs && !["code"].includes(screen.kind) && (
            <button className={`${styles.button} ${screen.ctaVariant === "ghost" ? styles.buttonGhost : ""}`} disabled={!canContinue} onClick={next} type="button">
              {screen.cta || (state.currentIndex === 52 ? "Jam gati" : "Vazhdo")} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

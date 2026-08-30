import fs from "node:fs";
import path from "node:path";

const analysisDir = "/opt/workspace/ld-journey-analysis";
const batches = ["01-10", "11-20", "21-30", "31-40", "41-50", "51-53"];
const output = path.resolve("src/lib/journey-content.ts");

const sanitize = (value) => String(value ?? "")
  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "email@shembull.com")
  .replace(/Cara Zeqir|Zeqir Cara/gi, "{{emri}}")
  .replace(/Luftëtar/g, "Luftetar")
  .replace(/LUFTËTAR/g, "LUFTETAR")
  .replace(/Luftëtarit|Luftëtari|LUFTËTARIT|LUFTËTARI/g, (match) => {
    const upper = match === match.toUpperCase();
    if (upper) return match.endsWith("IT") ? "LUFTETARIT" : "LUFTETARI";
    return match.endsWith("it") ? "Luftetarit" : "Luftetari";
  });

const entries = batches.flatMap((batch) => {
  const file = path.join(analysisDir, `batch-${batch}.json`);
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return parsed.entries;
}).sort((a, b) => a.index - b.index);

if (entries.length !== 53) throw new Error(`Expected 53 entries, found ${entries.length}`);
const indexes = entries.map((entry) => entry.index);
const expected = Array.from({ length: 53 }, (_, index) => index + 1);
if (JSON.stringify(indexes) !== JSON.stringify(expected)) {
  throw new Error(`Indexes mismatch: ${JSON.stringify(indexes)}`);
}

const assetMap = {
  1: "/journey-assets/sword.png",
  41: "/journey-assets/gift.png",
  42: "/journey-assets/mission.png",
  43: "/journey-assets/spirit.png",
  44: "/journey-assets/body.png",
  45: "/journey-assets/mind.png",
  46: "/journey-assets/mirror.png",
  47: "/journey-assets/fire.png",
  48: "/journey-assets/battles.png",
  49: "/journey-assets/self.png",
  53: "/journey-assets/sword.png",
};

const normalizeKind = (entry) => {
  const kind = String(entry.kind ?? "").toLowerCase();
  if (entry.index === 2) return "code";
  if (entry.index === 48) return "choice";
  if (entry.index === 49) return "choice-cards";
  if (entry.index >= 50 && entry.index <= 52) return "breathing";
  if (entry.index >= 42 && entry.index <= 45) return "pillar";
  if ([6, 12, 13, 14, 15].includes(entry.index)) return "form";
  if (entry.index === 7) return "scale";
  if (entry.index === 8) return "manifest";
  if ([5, 10].includes(entry.index)) return "email";
  if (kind.includes("quote")) return "quote";
  if (kind.includes("cta") || kind.includes("confirmation")) return "cta";
  if (kind.includes("intro")) return "intro";
  if (kind.includes("form")) return "form";
  if (kind.includes("manifest")) return "manifest";
  if (kind.includes("pillar")) return "pillar";
  if (entry.index >= 16 && entry.index <= 37) return "story";
  return "story";
};

const cleanList = (value) => Array.isArray(value) ? value.map(sanitize).filter(Boolean) : [];

const screens = entries.map((entry) => {
  const kind = normalizeKind(entry);
  let title = sanitize(entry.title);
  let eyebrow = sanitize(entry.eyebrow);
  let body = cleanList(entry.body_lines?.length ? entry.body_lines : entry.visible_text);
  let options = cleanList(entry.options);
  let cta = sanitize(entry.cta);

  if (entry.index === 48) {
    title = "CILAT JANË BETEJAT E TUA TË BRENDSHME?";
    eyebrow = "Zgjidh deri në 3";
    body = [];
    options = ["⏰ Disiplina", "☁️ Mendimet negative", "😰 Ankthi", "🔋 Energjia", "🎯 Qëllimi", "🧘 Vetmia", "😨 Frika", "🎯 Fokusi", "⌛ Shtyrja", "💪 Vetëbesimi"];
  }
  if (entry.index === 49) {
    title = "KUR JE VETËM ME VETEN...";
    eyebrow = "si ndihesh realisht?";
    body = [];
    options = [
      "◻️ I humbur||Nuk di ku po shkoj",
      "😔 I lodhur||Energjia më ka lënë",
      "🌀 I shpërndarë||Mendja nuk qetësohet",
      "⚡ I fortë por i paqëndrueshëm||Kam momente, por nuk zgjasin",
      "◯ Bosh||Diçka mungon brenda",
      "🔥 Gati për më shumë||E di që mundem",
    ];
  }

  const screen = {
    id: entry.index,
    kind,
    eyebrow,
    title,
    copy: body.filter((line) => line !== title && line !== eyebrow).map((text) => ({
      text,
      style: /^['“\"]|['”\"]$/.test(text) ? "quote" : "body",
    })),
    options,
    cta,
    asset: assetMap[entry.index] ?? "",
    assetAlt: sanitize(entry.asset_description),
  };

  if (entry.index === 1) Object.assign(screen, { autoAdvanceMs: 3600 });
  if (entry.index === 48) Object.assign(screen, { maxSelections: 3, requiredSelections: 1 });
  if (entry.index === 49) Object.assign(screen, { maxSelections: 1, requiredSelections: 1 });
  if (entry.index === 50) Object.assign(screen, { breathCycle: 1, breathCount: 4, breathLabel: "Merr frymë ngadalë", breathHint: "Ndiej ajrin duke mbushur mushkëritë", autoAdvanceMs: 4200 });
  if (entry.index === 51) Object.assign(screen, { breathCycle: 0, breathCount: 1, breathLabel: "Mbaje", breathHint: "Qetësi e plotë. Prani.", autoAdvanceMs: 3200 });
  if (entry.index === 52) Object.assign(screen, { breathCycle: 0, breathCount: 3, breathLabel: "Merr frymë ngadalë", breathHint: "Ndiej ajrin duke mbushur mushkëritë", autoAdvanceMs: 4200 });
  if (entry.index === 53) Object.assign(screen, {
    kind: "cta",
    title: "Ti je këtu sepse diçka brenda teje të thërret...",
    copy: [{ text: "Kjo rrugë kërkon vëmendje të plotë.", style: "lead" }],
    cta: "Jam gati",
    asset: "/journey-assets/sword.png",
    assetAlt: "Shpatë vertikale e ndriçuar me dritë të artë",
  });
  if (entry.index >= 42 && entry.index <= 45) {
    const colors = { 42: "#eeae2d", 43: "#9d63f5", 44: "#31cf86", 45: "#57a2ff" };
    Object.assign(screen, { pillarColor: colors[entry.index] });
  }
  if ([3,4,5,6,7,8,9,10,11,12,13,14,15].includes(entry.index)) Object.assign(screen, { cta: cta || "Vazhdo" });
  return screen;
});

const source = `export type JourneyCopyLine = {\n  text: string;\n  style: "body" | "lead" | "quote" | "divider";\n};\n\nexport type JourneyScreenKind = "intro" | "code" | "instructions" | "email" | "form" | "scale" | "manifest" | "confirmation" | "story" | "quote" | "cta" | "pillar" | "choice" | "choice-cards" | "breathing";\n\nexport type JourneyScreen = {\n  id: number;\n  kind: JourneyScreenKind;\n  eyebrow: string;\n  title: string;\n  copy: JourneyCopyLine[];\n  options: string[];\n  cta: string;\n  ctaVariant?: "solid" | "ghost";\n  accent?: "gold";\n  asset?: string;\n  assetAlt?: string;\n  assetSmall?: boolean;\n  maxSelections?: number;\n  requiredSelections?: number;\n  autoAdvanceMs?: number;\n  pillarColor?: string;\n  breathCycle?: number;\n  breathCount?: number;\n  breathLabel?: string;\n  breathHint?: string;\n};\n\nexport const journeyScreens: JourneyScreen[] = ${JSON.stringify(screens, null, 2)};\n`;

fs.writeFileSync(output, source);
console.log(JSON.stringify({ count: screens.length, indexes, output }));

import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_TWO_BEATS, chapterTwoStoryModel } from "../game/chapterTwoStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterTwoStoryText } from "./chapterTwoStoryText.js";

export function ChapterTwoStoryScreen({ language, save, onAdvance, onEnterStation, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterTwoStoryText(language);
  const model = chapterTwoStoryModel(save);
  const media = chapterMedia(2);
  const entry = model.candidate;
  const step = model.step;
  const original = t.beats[step];
  const facts = value => value.replaceAll("{player}", save.callsign).replaceAll("{peer}", entry?.callsign ?? "SIM3RA");
  const beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const completedUtc = entry ? entry.completedAt.slice(0, 16).replace("T", " ") : null;
  const canPlay = model.playable && !(model.status === "ready" && !entry);
  const hasNotes = step === 2 || (entry && step === 4) || !canPlay;
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back
    : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterStation();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_TWO_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(2).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved}
    backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
    primaryLabel={primaryLabel} primaryAction="chapter-two-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={completedUtc ? `${completedUtc} UTC · ${entry.callsign}` : step === 2 ? `${save.callsign} → SIM3RA` : beat.eyebrow}
    className="chapter-two-story-screen" data-story-chapter="2" data-story-beat={beat.id}
    data-story-status={model.status} data-story-qso-id={entry?.id ?? ""}>
    {hasNotes && <>
    {step === 2 && <p><Radio size={20} /> {t.hint}</p>}
    {entry && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-two-real-log">
      <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 02</span></header>
      <dl>{[["UTC", completedUtc], ["CALL", entry.callsign], ["RST", `${entry.sent} / ${entry.received}`], ["MHz", entry.frequencyMhz.toFixed(3)], ["REPEAT", "AGN K"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>{t.recorded}</p><p>{t.reward}</p>
    </section>}
    {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
    {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

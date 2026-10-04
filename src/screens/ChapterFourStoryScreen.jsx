import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_FOUR_BEATS, chapterFourStoryModel, chapterFourRecovery } from "../game/chapterFourStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterFourStoryText } from "./chapterFourStoryText.js";

export function ChapterFourStoryScreen({ language, save, onAdvance, onEnterStation, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterFourStoryText(language);
  const model = chapterFourStoryModel(save);
  const media = chapterMedia(4);
  const entry = model.candidate;
  const step = model.step;
  const recovery = chapterFourRecovery(entry);
  const original = t.beats[step];
  const facts = value => value.replaceAll("{player}", save.callsign).replaceAll("{peer}", entry?.callsign ?? "SIM2DX");
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
    onAdvance(CHAPTER_FOUR_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(4).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved}
    backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
    primaryLabel={primaryLabel} primaryAction="chapter-four-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={completedUtc ? `${completedUtc} UTC · ${entry.callsign}` : step === 2 ? `${save.callsign} → SIM2DX` : beat.eyebrow}
    className="chapter-four-story-screen" data-story-chapter="4" data-story-beat={beat.id}
    data-story-status={model.status} data-story-qso-id={entry?.id ?? ""}>
    {hasNotes && <>
    {step === 2 && <p><Radio size={20} /> {t.hint}</p>}
    {entry && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-four-real-log">
      <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 04</span></header>
      <dl>{[["UTC", completedUtc], ["CALL", entry.callsign], ["RST", `${entry.sent} / ${entry.received}`], ["MHz", entry.frequencyMhz.toFixed(3)], [t.signal, "P" + entry.finalPropagationLevel], [t.exchange, t.answered], [t.recovery, recovery.commands.join(" / ") || t.remoteQuery]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>{t.recorded}</p><p>{t.privacy}</p><p>{t.reward}</p>
    </section>}
    {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
    {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

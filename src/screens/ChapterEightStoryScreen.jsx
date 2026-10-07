import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_EIGHT_BEATS, chapterEightStoryModel } from "../game/chapterEightStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterEightStoryText } from "./chapterEightStoryText.js";

export function ChapterEightStoryScreen({ language, save, onAdvance, onEnterActivity, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterEightStoryText(language), model = chapterEightStoryModel(save), media = chapterMedia(8);
  const { step, candidate: entry, receipts } = model;
  const messages = receipts.map(item => "#" + item.messageId + " / PRI " + item.priority).join(" → ");
  const facts = value => value.replaceAll("{player}",save.callsign).replaceAll("{messages}",messages);
  const original = t.beats[step], beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const canPlay = model.playable && !(model.status === "ready" && !entry);
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterActivity();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_EIGHT_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(8).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={t.simulationWarning} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-eight-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={entry ? entry.callsign + " · " + receipts.length + "/3" : beat.eyebrow} className="chapter-eight-story-screen"
    data-story-chapter="8" data-story-beat={beat.id} data-story-status={model.status}
    data-story-qso-id={entry?.id ?? ""} data-story-run-id={entry?.eventRunId ?? ""}>
    {(step === 2 || step === 4 || !canPlay) && <>
      {step === 2 && <><p><Radio size={20} /> {t.hint}</p><p>{t.resumeHint}</p></>}
      {entry && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-eight-real-log">
        <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 08</span></header>
        <dl>{[["UTC",entry.completedAt.slice(0,16).replace("T"," ")],["CALL",entry.callsign]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <h3>{t.receipt}</h3><ol>{receipts.map(item => <li key={item.id} data-receipt-id={item.id}>#{item.messageId} · PRI {item.priority} · {item.item} × {item.quantity} · PEOPLE {item.people}</li>)}</ol>
        <p>{t.recorded}</p><p>{t.reward}</p>
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

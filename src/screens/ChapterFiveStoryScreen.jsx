import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_FIVE_BEATS, chapterFiveStoryModel } from "../game/chapterFiveStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterFiveStoryText } from "./chapterFiveStoryText.js";

export function ChapterFiveStoryScreen({ language, save, onAdvance, onEnterActivity, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterFiveStoryText(language), model = chapterFiveStoryModel(save), media = chapterMedia(5);
  const { step, candidate } = model, contacts = candidate?.contacts ?? [];
  const facts = value => value.replaceAll("{player}", save.callsign).replaceAll("{count}", String(contacts.length))
    .replaceAll("{regions}", String(candidate?.regions.length ?? 0)).replaceAll("{grade}", t.grades[candidate?.grade] ?? "");
  const original = t.beats[step], beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const canPlay = model.playable && !(model.status === "ready" && !candidate);
  const hasNotes = step === 2 || step === 4 || !canPlay;
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterActivity();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_FIVE_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(5).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-five-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={candidate ? facts(t.summary) : beat.eyebrow} className="chapter-five-story-screen"
    data-story-chapter="5" data-story-beat={beat.id} data-story-status={model.status}
    data-story-run-id={candidate?.runId ?? ""} data-story-contact-count={contacts.length}>
    {hasNotes && <>
      {step === 2 && <><p><Radio size={20} /> {t.hint}</p><p>{t.resumeHint}</p></>}
      {candidate && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-five-real-logs">
        <header><BookOpenText size={18} /><span>{facts(t.summary)}</span></header>
        <p>{t.grade}: {t.grades[candidate.grade]} · {t.score}: {candidate.score}</p>
        {contacts.map(entry => <article key={entry.id} data-qso-id={entry.id}>
          <dl>{[["UTC", entry.completedAt.slice(0, 16).replace("T", " ")], ["CALL", entry.callsign],
            ["RST", entry.sent + " / " + entry.received], [t.region, entry.eventRegionCode],
            ["MHz", entry.frequencyMhz.toFixed(3)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </article>)}
        <p>{t.recorded}</p><p>{t.reward}</p>
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

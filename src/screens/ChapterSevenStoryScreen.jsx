import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_SEVEN_BEATS, chapterSevenStoryModel } from "../game/chapterSevenStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterSevenStoryText } from "./chapterSevenStoryText.js";

export function ChapterSevenStoryScreen({ language, save, onAdvance, onEnterActivity, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterSevenStoryText(language), model = chapterSevenStoryModel(save), media = chapterMedia(7);
  const { step, candidate: entry, qslCase, source } = model;
  const initial = t.choices[qslCase?.initialChoice ?? source?.choice] ?? "", final = t.choices[qslCase?.finalChoice] ?? "";
  const outcome = (t.outcomes[qslCase?.finalChoice] ?? "").replaceAll("{final}",final);
  const facts = value => value.replaceAll("{player}",save.callsign).replaceAll("{peer}",entry?.callsign ?? "")
    .replaceAll("{initial}",initial).replaceAll("{final}",final).replaceAll("{outcome}",outcome);
  const original = t.beats[step], beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const canPlay = model.playable && !(model.status === "ready" && !entry);
  const hasNotes = step === 2 || step === 4 || !canPlay;
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterActivity();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_SEVEN_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(7).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-seven-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={entry ? entry.callsign + " · " + final : beat.eyebrow} className="chapter-seven-story-screen"
    data-story-chapter="7" data-story-beat={beat.id} data-story-status={model.status}
    data-story-qso-id={entry?.id ?? ""} data-story-run-id={entry?.eventRunId ?? ""} data-story-choice={qslCase?.finalChoice ?? ""}>
    {hasNotes && <>
      {step === 2 && <><p><Radio size={20} /> {t.hint}</p><p>{t.resumeHint}</p></>}
      {entry && qslCase && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-seven-real-log">
        <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 07</span></header>
        <dl>{[["UTC",entry.completedAt.slice(0,16).replace("T"," ")],["CALL",entry.callsign],
          [t.source,qslCase.sourceQslId],[t.initial,initial],[t.final,final]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>{t.recorded}</p><p>{t.reward}</p>
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_THREE_BEATS, chapterThreeStoryModel } from "../game/chapterThreeStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterThreeStoryText } from "./chapterThreeStoryText.js";

export function ChapterThreeStoryScreen({ language, save, onAdvance, onEnterStation, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterThreeStoryText(language);
  const model = chapterThreeStoryModel(save);
  const media = chapterMedia(3);
  const { step, contacts } = model;
  const original = t.beats[step];
  const facts = value => value.replaceAll("{player}", save.callsign).replaceAll("{callsigns}", contacts.map(log => log.callsign).join(" / "));
  const beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const progress = t.progress.replace("{count}", String(contacts.length));
  const canPlay = model.playable && !(model.status === "ready" && !model.candidate);
  const hasNotes = step === 2 || step === 4 || !canPlay;
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterStation();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_THREE_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]} background={media[beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(3).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-three-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={step >= 2 ? progress : beat.eyebrow} className="chapter-three-story-screen"
    data-story-chapter="3" data-story-beat={beat.id} data-story-status={model.status}
    data-story-qso-id={model.candidate?.id ?? ""} data-story-contact-count={contacts.length}>
    {hasNotes && <>
      {step === 2 && <p><Radio size={20} /> {t.hint}</p>}
      {contacts.length > 0 && <section className="chapter-one-logbook is-written" data-testid="chapter-three-real-logs">
        <header><BookOpenText size={18} /><span>{progress}</span></header>
        {contacts.map(entry => <article key={entry.id} data-qso-id={entry.id} data-operator-style={entry.operatorProfileId}>
          <dl>{[["UTC", entry.completedAt.slice(0, 16).replace("T", " ")], ["CALL", entry.callsign], [t.style, t.styles[entry.operatorProfileId]], ["RST", entry.sent + " / " + entry.received], ["MHz", entry.frequencyMhz.toFixed(3)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </article>)}
        <p>{t.recorded}</p>{step === 4 && <p>{t.reward}</p>}
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

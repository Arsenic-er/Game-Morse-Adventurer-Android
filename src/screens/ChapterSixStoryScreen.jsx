import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_SIX_BEATS, chapterSixStoryModel } from "../game/chapterSixStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterSixStoryText } from "./chapterSixStoryText.js";

export function ChapterSixStoryScreen({ language, save, onAdvance, onEnterActivity, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterSixStoryText(language), model = chapterSixStoryModel(save), media = chapterMedia(6);
  const { step, candidate: entry, site } = model;
  const siteLabel = site ? t.sites[site.nameKey] ?? site.qthCode : "";
  const facts = value => value.replaceAll("{player}", save.callsign).replaceAll("{peer}", entry?.callsign ?? "").replaceAll("{site}", siteLabel);
  const original = t.beats[step], beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const completedUtc = entry ? entry.completedAt.slice(0, 16).replace("T", " ") : null;
  const canPlay = model.playable && !(model.status === "ready" && !entry);
  const hasNotes = step === 2 || step === 4 || !canPlay;
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterActivity();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_SIX_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(6).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={model.status === "claimed" ? t.complete : t.saved} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-six-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={entry ? siteLabel + " · " + entry.callsign : beat.eyebrow} className="chapter-six-story-screen"
    data-story-chapter="6" data-story-beat={beat.id} data-story-status={model.status}
    data-story-qso-id={entry?.id ?? ""} data-story-run-id={entry?.expeditionRunId ?? ""}>
    {hasNotes && <>
      {step === 2 && <><p><Radio size={20} /> {t.hint}</p><p>{t.resumeHint}</p></>}
      {entry && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-six-real-log">
        <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 06</span></header>
        <dl>{[["UTC", completedUtc], ["CALL", entry.callsign], ["RST", entry.sent + " / " + entry.received],
          [t.site, siteLabel + " · " + t.fictional], ["QTH", site.qthCode], ["MHz", entry.frequencyMhz.toFixed(3)],
          [t.signal, "P" + entry.finalPropagationLevel]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>{t.recorded}</p><p>{t.reward}</p><p>{t.qsl}</p>
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

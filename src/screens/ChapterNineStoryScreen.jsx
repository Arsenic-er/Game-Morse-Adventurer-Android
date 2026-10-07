import { BookOpenText, Check, Radio } from "@phosphor-icons/react";
import { VisualNovelStage } from "../components/VisualNovelStage.jsx";
import { CHAPTER_NINE_BEATS, chapterNineStoryModel } from "../game/chapterNineStory.js";
import { chapterMedia } from "../media/chapterMediaCatalog.js";
import { chapterSceneEffects } from "../media/chapterSceneEffects.js";
import { chapterNineStoryText } from "./chapterNineStoryText.js";

export function ChapterNineStoryScreen({ language, save, onAdvance, onEnterActivity, onClaim, onBack, onSettings, inputBlocked = false }) {
  const t = chapterNineStoryText(language), model = chapterNineStoryModel(save), media = chapterMedia(9);
  const { step, candidate: entry, source, packet: record } = model;
  const packet = record?.packet;
  const facts = value => value.replaceAll("{player}",save.callsign).replaceAll("{source}",source?.callsign ?? "")
    .replaceAll("{peer}",entry?.callsign ?? "").replaceAll("{grid}",packet?.grid ?? "")
    .replaceAll("{packetId}",packet?.packetId ?? "").replaceAll("{check}",packet ? String(packet.check).padStart(2,"0") : "");
  const original = t.beats[step], beat = { ...original, title: facts(original.title), paragraphs: original.paragraphs.map(facts) };
  const canPlay = model.playable && !(model.status === "ready" && !entry);
  const primaryLabel = model.status === "claimed" || !canPlay ? t.back : step === 2 ? t.enter : step === 4 ? t.finish : t.next;
  function primaryAction() {
    if (inputBlocked) return;
    if (model.status === "claimed" || !canPlay) return onBack();
    if (step === 2) return onEnterActivity();
    if (step === 4) return onClaim();
    onAdvance(CHAPTER_NINE_BEATS[step + 1]);
  }
  return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
    background={media[beat.asset === "portrait" ? "scene" : beat.asset]}
    sceneLayers={beat.asset === "illustration" ? [] : chapterSceneEffects(9).layers}
    artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode}
    safety={t.simulationWarning} backLabel={t.back} settingsLabel={t.settings}
    artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings} primaryLabel={primaryLabel}
    primaryAction="chapter-nine-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
    context={entry ? source.callsign + " → " + entry.callsign : beat.eyebrow} className="chapter-nine-story-screen"
    data-story-chapter="9" data-story-beat={beat.id} data-story-status={model.status}
    data-story-qso-id={entry?.id ?? ""} data-story-run-id={entry?.eventRunId ?? ""}>
    {(step === 2 || step === 4 || !canPlay) && <>
      {step === 2 && <><p><Radio size={20} /> {t.hint}</p><p>{t.resumeHint}</p></>}
      {entry && record && step === 4 && <section className="chapter-one-logbook is-written" data-testid="chapter-nine-real-log">
        <header><BookOpenText size={18} /><span>LOGBOOK / CHAPTER 09</span></header>
        <dl>{[["UTC",entry.completedAt.slice(0,16).replace("T"," ")],["CALL",source.callsign + " → " + entry.callsign],["MSG",packet.packetId],["GRID",packet.grid],["TIME",packet.utc],["PEOPLE",packet.people],["CHECK",String(packet.check).padStart(2,"0")]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <h3>{t.packetLabel}</h3><p data-packet-record-id={record.id}>{record.id}</p>
        <p>{t.recorded}</p><p>{t.reward}</p>
      </section>}
      {model.status === "claimed" && <p role="status"><Check size={20} /> {t.complete}</p>}
      {!canPlay && model.status !== "claimed" && <p role="status">{t.unavailable}</p>}
    </>}
  </VisualNovelStage>;
}

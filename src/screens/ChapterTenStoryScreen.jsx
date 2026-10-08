import {BookOpenText,Check,Radio} from "@phosphor-icons/react";
import {VisualNovelStage} from "../components/VisualNovelStage.jsx";
import {CHAPTER_TEN_BEATS,chapterTenStoryModel} from "../game/chapterTenStory.js";
import {chapterMedia} from "../media/chapterMediaCatalog.js";
import {chapterSceneEffects} from "../media/chapterSceneEffects.js";
import {chapterTenStoryText} from "./chapterTenStoryText.js";
import {CONTEST_TEXT} from "./contestText.js";
export function ChapterTenStoryScreen({language,save,onAdvance,onEnterActivity,onClaim,onBack,onSettings,inputBlocked=false}){
 const t=chapterTenStoryText(language),a=CONTEST_TEXT[language]??CONTEST_TEXT.en,model=chapterTenStoryModel(save),media=chapterMedia(10);
 const {step,record}=model;
 const facts=value=>value.replaceAll("{player}",save.callsign).replaceAll("{contacts}",String(record?.validContacts??""))
  .replaceAll("{regions}",String(record?.uniqueRegions??"")).replaceAll("{runCount}",String(record?.runContacts??""))
  .replaceAll("{spCount}",String(record?.spContacts??"")).replaceAll("{score}",String(record?.score??""));
 const original=t.beats[step],beat={...original,title:facts(original.title),paragraphs:original.paragraphs.map(facts)};
 const canPlay=model.playable&&!(model.status==="ready"&&!record);
 const primaryLabel=model.status==="claimed"||!canPlay?t.back:step===2?t.enter:step===4?t.finish:t.next;
 function primaryAction(){
  if(inputBlocked)return;if(model.status==="claimed"||!canPlay)return onBack();
  if(step===2)return onEnterActivity();if(step===4)return onClaim();onAdvance(CHAPTER_TEN_BEATS[step+1]);
 }
 return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
  background={media[beat.asset==="portrait"?"scene":beat.asset]} sceneLayers={beat.asset==="illustration"?[]:chapterSceneEffects(10).layers}
  artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode} safety={t.simulationWarning}
  backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
  primaryLabel={primaryLabel} primaryAction="chapter-ten-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
  context={record?record.runId:beat.eyebrow} className="chapter-ten-story-screen" data-story-chapter="10"
  data-story-beat={beat.id} data-story-status={model.status} data-story-qso-id={model.candidate?.id??""} data-story-run-id={record?.runId??""}>
  {(step===2||step===4||!canPlay)&&<>
   {step===2&&<><p><Radio size={20}/>{t.hint}</p><p>{t.resumeHint}</p></>}
   {record&&step===4&&<section className="chapter-one-logbook is-written" data-testid="chapter-ten-real-log">
    <header><BookOpenText size={18}/><span>LOGBOOK / CHAPTER 10</span></header>
    <dl>{[["UTC",record.completedAt.slice(0,16).replace("T"," ")],[a.score,record.score],[a.validContacts,record.validContacts],
      [a.regions,record.uniqueRegions],["RUN",record.runContacts],["S&P",record.spContacts],
      [a.repeats,record.repeatRequests],[a.busted,record.bustedCalls],[a.interruptions,record.interruptions]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <h3>{t.recordLabel}</h3><p data-contest-record-id={record.id}>{record.id} · {record.grade.toUpperCase()}</p>
    <ol>{record.contacts.map(contact=><li key={contact.qsoId}>{String(contact.serialNumber).padStart(3,"0")} · {contact.callsign} · {contact.mode==="SP"?"S&P":contact.mode} · {contact.regionCode} · {contact.powerWatts}W</li>)}</ol>
    <p>{t.recorded}</p><p>{t.reward}</p>
   </section>}
   {model.status==="claimed"&&<p role="status"><Check size={20}/>{t.complete}</p>}
   {!canPlay&&model.status!=="claimed"&&<p role="status">{t.unavailable}</p>}
  </>}
 </VisualNovelStage>;
}

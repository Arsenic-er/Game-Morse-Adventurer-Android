import {BookOpenText,Check,Radio} from "@phosphor-icons/react";
import {VisualNovelStage} from "../components/VisualNovelStage.jsx";
import {CHAPTER_THIRTEEN_BEATS,chapterThirteenStoryModel} from "../game/chapterThirteenStory.js";
import {chapterMedia} from "../media/chapterMediaCatalog.js";
import {chapterSceneEffects} from "../media/chapterSceneEffects.js";
import {chapterThirteenStoryText} from "./chapterThirteenStoryText.js";
export function ChapterThirteenStoryScreen({language,save,onAdvance,onEnterActivity,onClaim,onBack,onSettings,inputBlocked=false}){
 const t=chapterThirteenStoryText(language),model=chapterThirteenStoryModel(save),media=chapterMedia(13);
 const {step,record}=model;
 const facts=value=>value.replaceAll("{player}",save.callsign).replaceAll("{contacts}",record?.contacts.map(contact=>contact.callsign+" / "+contact.band).join(" · ")??"");
 const original=t.beats[step],beat={...original,title:facts(original.title),paragraphs:original.paragraphs.map(facts)};
 const canPlay=model.playable&&!(model.status==="ready"&&!record);
 const primaryLabel=model.status==="claimed"||!canPlay?t.back:step===2?t.enter:step===4?t.finish:t.next;
 function primaryAction(){
  if(inputBlocked)return;if(model.status==="claimed"||!canPlay)return onBack();
  if(step===2)return onEnterActivity();if(step===4)return onClaim();onAdvance(CHAPTER_THIRTEEN_BEATS[step+1]);
 }
 return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
  background={media[beat.asset==="portrait"?"scene":beat.asset]} sceneLayers={beat.asset==="illustration"?[]:chapterSceneEffects(13).layers}
  artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode} safety={t.simulationWarning}
  backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
  primaryLabel={primaryLabel} primaryAction="chapter-thirteen-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
  context={record?record.runId:beat.eyebrow} className="chapter-thirteen-story-screen" data-story-chapter="13"
  data-story-beat={beat.id} data-story-status={model.status} data-story-record-id={record?.id??""} data-story-run-id={record?.runId??""}>
  {(step===2||step===4||!canPlay)&&<>
   {step===2&&<><p><Radio size={20}/>{t.hint}</p><p>{t.resumeHint}</p></>}
   {record&&step===4&&<section className="chapter-one-logbook is-written" data-testid="chapter-thirteen-real-log">
    <header><BookOpenText size={18}/><span>NIGHT WATCH / CHAPTER 13</span></header>
    <dl>{record.contacts.map(contact=><div key={contact.qsoId}><dt>{contact.callsign}</dt><dd>{contact.band} · {contact.completedAt.slice(0,19).replace("T"," ")} UTC</dd></div>)}</dl>
    <h3>{t.recordLabel}</h3><p data-night-record-id={record.id}>{record.id}</p>
    <p>{t.recorded}</p><p>{t.reward}</p>
   </section>}
   {model.status==="claimed"&&<p role="status"><Check size={20}/>{t.complete}</p>}
   {!canPlay&&model.status!=="claimed"&&<p role="status">{t.unavailable}</p>}
  </>}
 </VisualNovelStage>;
}

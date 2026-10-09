import {BookOpenText,Check,Radio} from "@phosphor-icons/react";
import {VisualNovelStage} from "../components/VisualNovelStage.jsx";
import {CHAPTER_ELEVEN_BEATS,chapterElevenStoryModel} from "../game/chapterElevenStory.js";
import {chapterMedia} from "../media/chapterMediaCatalog.js";
import {chapterSceneEffects} from "../media/chapterSceneEffects.js";
import {chapterElevenStoryText} from "./chapterElevenStoryText.js";
import {LISTENING_TEXT} from "./listeningText.js";
export function ChapterElevenStoryScreen({language,save,onAdvance,onEnterActivity,onClaim,onBack,onSettings,inputBlocked=false}){
 const t=chapterElevenStoryText(language),a=LISTENING_TEXT[language]??LISTENING_TEXT.en,model=chapterElevenStoryModel(save),media=chapterMedia(11);
 const {step,record}=model;
 const facts=value=>value.replaceAll("{player}",save.callsign).replaceAll("{calls}",String(record?.callCount??""))
  .replaceAll("{seconds}",String(record?Math.ceil(record.activeMilliseconds/1000):""));
 const original=t.beats[step],beat={...original,title:facts(original.title),paragraphs:original.paragraphs.map(facts)};
 const canPlay=model.playable&&!(model.status==="ready"&&!record);
 const primaryLabel=model.status==="claimed"||!canPlay?t.back:step===2?t.enter:step===4?t.finish:t.next;
 function primaryAction(){
  if(inputBlocked)return;if(model.status==="claimed"||!canPlay)return onBack();
  if(step===2)return onEnterActivity();if(step===4)return onClaim();onAdvance(CHAPTER_ELEVEN_BEATS[step+1]);
 }
 return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
  background={media[beat.asset==="portrait"?"scene":beat.asset]} sceneLayers={beat.asset==="illustration"?[]:chapterSceneEffects(11).layers}
  artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode} safety={t.simulationWarning}
  backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
  primaryLabel={primaryLabel} primaryAction="chapter-eleven-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
  context={record?record.runId:beat.eyebrow} className="chapter-eleven-story-screen" data-story-chapter="11"
  data-story-beat={beat.id} data-story-status={model.status} data-story-record-id={record?.id??""} data-story-run-id={record?.runId??""}>
  {(step===2||step===4||!canPlay)&&<>
   {step===2&&<><p><Radio size={20}/>{t.hint}</p><p>{t.resumeHint}</p></>}
   {record&&step===4&&<section className="chapter-one-logbook is-written" data-testid="chapter-eleven-real-log">
    <header><BookOpenText size={18}/><span>MONITORING / CHAPTER 11</span></header>
    <dl>{[["UTC",record.completedAt.slice(0,16).replace("T"," ")],[a.target,record.targetCallsign],[t.callsLabel,record.callCount],
      [t.windowsLabel,record.observationIds.length],[t.timeLabel,Math.ceil(record.activeMilliseconds/1000)+"s"]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <h3>{t.recordLabel}</h3><p data-listening-record-id={record.id}>{record.id}</p><p>{t.conclusion}</p>
    <p>{t.recorded}</p><p>{t.reward}</p>
   </section>}
   {model.status==="claimed"&&<p role="status"><Check size={20}/>{t.complete}</p>}
   {!canPlay&&model.status!=="claimed"&&<p role="status">{t.unavailable}</p>}
  </>}
 </VisualNovelStage>;
}

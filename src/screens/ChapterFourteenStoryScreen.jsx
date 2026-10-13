import {BookOpenText,Check,Radio} from "@phosphor-icons/react";
import {VisualNovelStage} from "../components/VisualNovelStage.jsx";
import {CHAPTER_FOURTEEN_BEATS,chapterFourteenStoryModel} from "../game/chapterFourteenStory.js";
import {finalPromiseRecordedMessage} from "../game/finalPromiseTraffic.js";
import {chapterMedia} from "../media/chapterMediaCatalog.js";
import {chapterSceneEffects} from "../media/chapterSceneEffects.js";
import {chapterFourteenStoryText} from "./chapterFourteenStoryText.js";
import {FINAL_PROMISE_TEXT} from "./finalPromiseText.js";
export function ChapterFourteenStoryScreen({language,save,onAdvance,onEnterActivity,onClaim,onBack,onSettings,inputBlocked=false}){
 const t=chapterFourteenStoryText(language),model=chapterFourteenStoryModel(save),media=chapterMedia(14);
 const activity=FINAL_PROMISE_TEXT[language]??FINAL_PROMISE_TEXT.en,{step,record}=model;
 const facts=value=>value.replaceAll("{player}",save.callsign).replaceAll("{ending}",t.endings[record?.tone]??"").replaceAll("{message}",finalPromiseRecordedMessage(record));
 const original=t.beats[step],beat={...original,title:facts(original.title),paragraphs:original.paragraphs.map(facts)};
 const canPlay=model.playable&&!(model.status==="ready"&&!record);
 const primaryLabel=model.status==="claimed"||!canPlay?t.back:step===2?t.enter:step===4?t.finish:t.next;
 function primaryAction(){
  if(inputBlocked)return;if(model.status==="claimed"||!canPlay)return onBack();
  if(step===2)return onEnterActivity();if(step===4)return onClaim();onAdvance(CHAPTER_FOURTEEN_BEATS[step+1]);
 }
 return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]}
  background={media[beat.asset==="portrait"?"scene":beat.asset]} sceneLayers={beat.asset==="illustration"?[]:chapterSceneEffects(14).layers}
  artLabel={t.artLabels[beat.asset]} chapter={t.chapter} title={t.title} mode={t.mode} safety={t.simulationWarning}
  backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt} onBack={onBack} onSettings={onSettings}
  primaryLabel={primaryLabel} primaryAction="chapter-fourteen-primary" onPrimary={primaryAction} inputBlocked={inputBlocked}
  context={record?record.runId:beat.eyebrow} className="chapter-fourteen-story-screen" data-story-chapter="14"
  data-story-beat={beat.id} data-story-status={model.status} data-story-record-id={record?.id??""} data-story-run-id={record?.runId??""} data-story-tone={record?.tone??""}>
  {(step===2||step===4||!canPlay)&&<>
   {step===2&&<><p><Radio size={20}/>{t.hint}</p><p>{t.resumeHint}</p></>}
   {record&&step===4&&<section className="chapter-one-logbook is-written" data-testid="chapter-fourteen-real-log">
    <header><BookOpenText size={18}/><span>FINAL PAGE / CHAPTER 14</span></header>
    <dl><div><dt>{activity.recipient}</dt><dd>{record.targetCallsign}</dd></div><div><dt>UTC</dt><dd>{record.completedAt.slice(0,19).replace("T"," ")}</dd></div>
    <div><dt>{t.messageLabel}</dt><dd>{finalPromiseRecordedMessage(record)}</dd></div>
    <div><dt>{t.accountLabel}</dt><dd>{activity[record.accountKey]}</dd></div></dl>
    <h3>{t.recordLabel}</h3><p data-final-page-record-id={record.id}>{record.id}</p>
    <p>{t.recorded}</p><p>{t.reward}</p>
   </section>}
   {model.status==="claimed"&&<p role="status"><Check size={20}/>{t.complete}</p>}
   {!canPlay&&model.status!=="claimed"&&<p role="status">{t.unavailable}</p>}
  </>}
 </VisualNovelStage>;
}

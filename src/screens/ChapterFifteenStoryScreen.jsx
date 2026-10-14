import {useRef,useState} from "react";
import {BookOpenText,Check,Radio} from "@phosphor-icons/react";
import {VisualNovelStage} from "../components/VisualNovelStage.jsx";
import {CHAPTER_FIFTEEN_BEATS,chapterFifteenStoryModel} from "../game/chapterFifteenStory.js";
import {OPEN_STATION_GOALS} from "../game/openStationState.js";
import {chapterMedia} from "../media/chapterMediaCatalog.js";
import {chapterSceneEffects} from "../media/chapterSceneEffects.js";
import {chapterFifteenStoryText} from "./chapterFifteenStoryText.js";
import {FIRST_PAGE_TEXT} from "./firstPageText.js";
export function ChapterFifteenStoryScreen({language,save,onAdvance,onChooseGoal,onSeal,onEnterActivity,onClaim,onBack,onSettings,inputBlocked=false}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(false),lock=useRef(false);
 const t=chapterFifteenStoryText(language),model=chapterFifteenStoryModel(save),media=chapterMedia(15);
 const labels=FIRST_PAGE_TEXT[language]??FIRST_PAGE_TEXT.en,{step,record,candidate,entry,goal}=model;
 const facts=value=>value.replaceAll("{player}",save.callsign).replaceAll("{peer}",entry?.callsign??"")
  .replaceAll("{rst}",entry?entry.sent+" / "+entry.received:"").replaceAll("{ending}",record?t.endings[record.goal]:"");
 const original=t.beats[step],beat={...original,title:facts(original.title),paragraphs:original.paragraphs.map(facts)};
 const canPlay=model.playable&&!(model.status==="ready"&&!record),blocked=inputBlocked||busy;
 const primaryLabel=model.status==="claimed"||!canPlay?t.back:step===2?t.enter:step===3?(goal?t.seal:t.choosePrompt):step===4?t.finish:t.next;
 async function primaryAction(){
  if(inputBlocked||lock.current)return;
  if(model.status==="claimed"||!canPlay)return onBack();
  if(step===2)return onEnterActivity();
  if(step===4)return onClaim();
  if(step===3){
   if(!goal)return;
   lock.current=true;setBusy(true);setError(false);
   try{const result=await onSeal();if(!result?.settled)setError(true);}
   catch{setError(true);}finally{lock.current=false;setBusy(false);}
   return;
  }
  onAdvance(CHAPTER_FIFTEEN_BEATS[step+1]);
 }
 const choices=step===3&&candidate?<section className="chapter-fifteen-choices" aria-label={t.choosePrompt}>
  <h2>{t.choosePrompt}</h2>
  <div className="chapter-fifteen-choice-list">{OPEN_STATION_GOALS.map(id=><button key={id} data-action="choose-first-page-goal" data-goal={id}
   aria-pressed={goal===id} disabled={blocked} onClick={()=>{if(!inputBlocked&&!lock.current){setError(false);onChooseGoal(id);}}}>
   <span aria-hidden="true">{goal===id?"◆":"◇"}</span>{labels[id]}</button>)}</div>
  <p>{error?t.sealFailed:t.pinned}</p>
 </section>:null;
 return <VisualNovelStage language={language} beat={beat} artwork={media[beat.asset]} background={media[beat.asset]}
  sceneLayers={beat.asset==="illustration"?[]:chapterSceneEffects(15).layers} artLabel={t.artLabels[beat.asset]}
  chapter={t.chapter} title={t.title} mode={t.mode} safety={t.simulationWarning}
  backLabel={t.back} settingsLabel={t.settings} artViewLabel={t.viewArt}
  onBack={()=>{if(!lock.current)onBack();}} onSettings={()=>{if(!lock.current)onSettings();}}
  primaryLabel={primaryLabel} primaryAction="chapter-fifteen-primary" onPrimary={primaryAction}
  primaryDisabled={step===3&&!goal} inputBlocked={inputBlocked} busy={busy} overlay={choices}
  context={record?.runId??candidate?.qsoId??beat.eyebrow} className="chapter-fifteen-story-screen"
  data-story-chapter="15" data-story-beat={beat.id} data-story-status={model.status}
  data-story-qso-id={entry?.id??""} data-story-goal={goal??""}>
  {step===2&&<p><Radio size={20}/>{t.hint}</p>}
  {entry&&(step===3||step===4)&&<section className="chapter-one-logbook is-written" data-testid="chapter-fifteen-real-log">
   <header><BookOpenText size={18}/><span>{labels.contact}</span></header>
   <dl><div><dt>{labels.callsign}</dt><dd>{entry.callsign}</dd></div><div><dt>{labels.region}</dt><dd>{entry.location}</dd></div>
    <div><dt>RST</dt><dd>{entry.sent} / {entry.received}</dd></div><div><dt>MHz</dt><dd>{entry.frequencyMhz}</dd></div>
    <div><dt>UTC</dt><dd>{entry.completedAt.slice(0,19).replace("T"," ")}</dd></div>
    <div><dt>{labels.reward}</dt><dd>{entry.credits}</dd></div>
    {goal&&<div><dt>{labels.choose}</dt><dd>{labels[goal]}</dd></div>}</dl>
   <p>{record?.runId??entry.id}</p><p>{t.pinned}</p><p>{t.reward}</p>
  </section>}
  {model.status==="claimed"&&<p role="status"><Check size={20}/>{t.complete}</p>}
  {!canPlay&&model.status!=="claimed"&&<p role="status">{t.unavailable}</p>}
 </VisualNovelStage>;
}

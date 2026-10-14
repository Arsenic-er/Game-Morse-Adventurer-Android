// Focused Chapter 15 regression. Chapters 1–14 are seeded prerequisites, not played here.
// Chapter 15 itself must use real key events, normal QSO settlement, choices and claim.
import {unlocked} from "../test/helpers/chapterFifteenFixtures.js";
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { SAVE_STORAGE_KEY, ACTIVE_SAVE_KEY } from '../src/game/saveStore.js';
import { MORSE_CODE } from '../src/cw/morse.js';
import { ACHIEVEMENT_CATALOG } from '../src/game/achievements.js';

const output = path.resolve(process.env.CWGAME_QA_OUTPUT || 'qa-artifacts-chapter-fifteen-live');
const baseUrl = process.env.CWGAME_QA_URL || 'http://127.0.0.1:4176/';
const chromePath = process.env.CWGAME_QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const fixtureWpm = Number(process.env.CWGAME_QA_WPM || 18);
assert(Number.isInteger(fixtureWpm) && fixtureWpm >= 5 && fixtureWpm <= 40, 'QA WPM must be an integer from 5 to 40');
const qaClockEpoch = process.env.CWGAME_QA_UTC ? Date.parse(process.env.CWGAME_QA_UTC) : null;
assert(qaClockEpoch === null || Number.isFinite(qaClockEpoch), 'QA UTC must be a valid date');
const qaClockWallStart = Date.now();
const profile = path.join(os.tmpdir(), `cw-chapter-fifteen-live-${Date.now()}`);
await mkdir(output, { recursive: true });
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-timer-throttling', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let launchError;
let browserStderr = '';
chrome.on('error', error => { launchError = error; });
chrome.stderr.on('data', chunk => { browserStderr = (browserStderr + chunk).slice(-8000); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let i=0;i<80;i++) {
    if (launchError) throw launchError;
    if (chrome.exitCode !== null) throw new Error(`Chrome exited (${chrome.exitCode}): ${browserStderr}`);
    try { port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break; } catch { await pause(250); }
  }
  assert(port, `Chrome did not expose DevTools: ${browserStderr}`);
  const tabs=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>socket.addEventListener('open',r,{once:true}));
  let serial=0;
  const pending=new Map();
  const exceptions=[];
  socket.addEventListener('message',({data})=>{
    const r=JSON.parse(data);
    if(r.method==='Page.javascriptDialogOpening'&&r.params.type==='beforeunload')void call('Page.handleJavaScriptDialog',{accept:true});
    if(r.method==='Runtime.exceptionThrown')exceptions.push(r.params);
    if(r.id&&pending.has(r.id)){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(new Error(JSON.stringify(r.error))):p.resolve(r.result);}
  });
  socket.addEventListener('close',()=>{for(const action of pending.values())action.reject(new Error('QA browser connection closed'));pending.clear();});
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++serial;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('QA protocol timeout: '+method));},120000);
    pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});
    socket.send(JSON.stringify({id,method,params}));
  });
  const navigate=async(method,params={})=>{
    let handler,timer;
    const loaded=new Promise((resolve,reject)=>{
      handler=({data})=>{if(JSON.parse(data).method==="Page.loadEventFired")resolve();};
      socket.addEventListener("message",handler);
      timer=setTimeout(()=>reject(Error("QA navigation load timeout: "+method)),30000);
    });
    try{await Promise.all([call(method,params),loaded]);}
    finally{clearTimeout(timer);socket.removeEventListener("message",handler);}
  };
  const evaluate=async expression=>{
    const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;
  };
  const until=async(expression,timeout=20000)=>{
    const end=Date.now()+timeout;
    while(Date.now()<end){
      try { if(await evaluate(`Boolean(${expression})`))return; }
      catch(error){if(!/Inspected target navigated or closed|Execution context was destroyed|Cannot find context/.test(String(error)))throw error;}
      await pause(100);
    }
    throw new Error(`Timeout: ${expression}; UI: ${await evaluate('document.body.innerText.slice(-1800)')}`);
  };
  const click=async selector=>{
    await until(`!!document.querySelector(${JSON.stringify(selector)})`);
    const p=await evaluate(`(async()=>{const b=document.querySelector(${JSON.stringify(selector)});b.scrollIntoView({block:'center'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    for(const type of ['mousePressed','mouseReleased'])await call('Input.dispatchMouseEvent',{type,...p,button:'left',clickCount:1});
  };
  const screenshot=async name=>{
    await until(`Array.from(document.querySelectorAll('.vn-art > img')).every(img=>img.complete&&img.naturalWidth>0)`,30000);
    const images=await evaluate(`Array.from(document.querySelectorAll('.vn-art > img')).map(img=>({src:img.currentSrc,width:img.naturalWidth,height:img.naturalHeight,rect:img.getBoundingClientRect().toJSON(),opacity:getComputedStyle(img).opacity,visibility:getComputedStyle(img).visibility,display:getComputedStyle(img).display}))`);
    console.log('ART',name,JSON.stringify(images));
    await pause(600);const r=await call('Page.captureScreenshot',{format:'png'});await writeFile(path.join(output,`${name}.png`),Buffer.from(r.data,'base64'));
  };
  const saved=()=>evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(SAVE_STORAGE_KEY)}))[0]`);
  const finishScene=async(action='chapter-one-primary')=>{
    for(let n=0;n<6;n++){
      if(await evaluate(`document.querySelector('.vn-dialogue')?.dataset.vnReady==='true'`))break;
      await click('.vn-line');await pause(80);
    }
    assert.equal(await evaluate(`document.querySelector('.vn-dialogue').dataset.vnReady`),'true');
    await click('[data-action="'+action+'"]');
  };
  const phase=()=>evaluate(`document.querySelector('.station-screen')?.dataset.qsoPhase`);
  const sendText=async (text,{surface='.station-screen',submit='[data-action="submit-reply"]'}={})=>{
    console.log(`KEYING ${text}`);
    const words=text.trim().toUpperCase().split(/\s+/);
    const wpm=await evaluate(`Number(document.querySelector(${JSON.stringify(surface)})?.dataset.keyerWpm)`);
    assert(Number.isFinite(wpm) && wpm >= 5 && wpm <= 40, 'live station keyer speed is available');
    const steps=words.flatMap((word,wi)=>[...word].map((char,ci)=>({pattern:MORSE_CODE[char],separator:ci<word.length-1?'character':wi<words.length-1?'word':null})));
    assert(steps.every(step=>step.pattern), 'QA message contains only supported Morse characters');
    await evaluate(`(async()=>{
      const pause=ms=>new Promise(r=>setTimeout(r,ms));
      const dotMs=1200/${JSON.stringify(wpm)};
      for(const {pattern,separator} of ${JSON.stringify(steps)}){
          const symbols=pattern;
          const station=()=>document.querySelector(${JSON.stringify(surface)});
          const before=Number(station().dataset.pulseCount);
          const waitUntil=predicate=>new Promise((resolve,reject)=>{
            const started=performance.now();const timer=setInterval(()=>{
              if(predicate()){clearInterval(timer);resolve()}
              else if(performance.now()-started>5000){clearInterval(timer);reject(new Error('keyer not idle'))}
            },10);
          });
          for(const symbol of symbols){
            const key=symbol==='.'?'z':'x';const code='Key'+key.toUpperCase();
            window.dispatchEvent(new KeyboardEvent('keydown',{key,code,bubbles:true,cancelable:true}));
            const start=performance.now();while(performance.now()-start<dotMs*0.12){}
            window.dispatchEvent(new KeyboardEvent('keyup',{key,code,bubbles:true,cancelable:true}));
          }
          await waitUntil(()=>Number(station().dataset.pulseCount)>=before+symbols.length);
          await waitUntil(()=>Boolean(document.querySelector(${JSON.stringify(submit+':not([disabled])')})));
          if(separator==='character'){
            // Match the packaged QA helper: timer overshoot must not create a word boundary.
            const started=performance.now();
            while(performance.now()-started<dotMs*2){}
          }
          if(separator==='word')await pause(dotMs*6);
      }
    })()`);
    const decoded=await evaluate(`document.querySelector(${JSON.stringify(surface)}).dataset.decoded.trim().replace(/\s+/g,' ')`);
    assert.equal(decoded,words.join(' '),'physical key events decoded correctly');
    await click(submit);
  };
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const fixture={...await unlocked(),keyType:'automatic',automaticKeyWpm:fixtureWpm,qsoGuidance:'full',qsoBriefSeen:true};
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`if(${JSON.stringify(qaClockEpoch)}!==null){const NativeDate=Date;const now=()=>${JSON.stringify(qaClockEpoch)}+NativeDate.now()-${JSON.stringify(qaClockWallStart)};function QaDate(...args){if(!new.target)return new NativeDate(now()).toString();return new NativeDate(...(args.length?args:[now()]));}Object.setPrototypeOf(QaDate,NativeDate);QaDate.prototype=NativeDate.prototype;QaDate.now=now;window.Date=QaDate;}window.cwgameSystem={qaCapture:true};if(!localStorage.getItem(${JSON.stringify(SAVE_STORAGE_KEY)})){localStorage.setItem(${JSON.stringify(SAVE_STORAGE_KEY)},${JSON.stringify(JSON.stringify([fixture]))});localStorage.setItem(${JSON.stringify(ACTIVE_SAVE_KEY)},${JSON.stringify(fixture.id)});localStorage.setItem('game-morse-adventurer.language.v1','zh-CN');}`});
  await navigate('Page.navigate',{url:baseUrl});
  await call('Page.bringToFront');
  await click('.menu-primary');await click('.save-primary-action');
  let chapterFifteenEvidence=null;
  {
    console.log('CHAPTER_FIFTEEN_START');
    const storyBeat=beat=>'document.querySelector(".chapter-fifteen-story-screen")?.dataset.storyBeat==='+JSON.stringify(beat);
    const reopen=async()=>{await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-fifteen-home"]');};
    await click('[data-action="enter-chapter-fifteen-home"]');await until(storyBeat('morning'));
    const baseline=await saved();assert(baseline.missionState.activeMissions.some(m=>m.id==='story-15'));
    await screenshot('140-chapter-fifteen-morning');await finishScene('chapter-fifteen-primary');
    await until(storyBeat('blank'));await reopen();await until(storyBeat('blank'));
    await finishScene('chapter-fifteen-primary');await until(storyBeat('call'));await screenshot('141-chapter-fifteen-call');
    await finishScene('chapter-fifteen-primary');await until('!!document.querySelector(".station-screen")');
    if(await evaluate('!!document.querySelector("[data-action=start-guided-watch]")'))await click('[data-action="start-guided-watch"]');
    let finished=false;
    for(let turn=0;turn<12;turn++){
      const current=await phase();console.log('CHAPTER_FIFTEEN_QSO',current);
      if(current==='QSO_COMPLETE'){finished=true;break;}
      if(current==='QSO_FAILED'){await screenshot('142-chapter-fifteen-retry-'+turn);await click('.qso-result-modal.failed .qso-result-primary');continue;}
      if(['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER'].includes(current)){
        if(await evaluate('!!document.querySelector("[data-action=clear-and-retry]")'))await click('[data-action="clear-and-retry"]');
        const template=await evaluate('document.querySelector("[data-testid=qso-duty-template]")?.textContent');
        const remote=await evaluate('document.querySelector(".station-screen").dataset.qaNpcCallsign');
        const text=current==='PLAYER_OPTIONAL_ANSWER'?'SKIP K':template?.replace('REMOTE',remote);
        assert(text);await sendText(text);await pause(900);
      }
      await until('["PLAYER_CQ","PLAYER_RST_AND_73","PLAYER_OPTIONAL_ANSWER","QSO_COMPLETE","QSO_FAILED"].includes(document.querySelector(".station-screen")?.dataset.qsoPhase)',65000);
    }
    assert(finished);assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector("[data-action=continue-chapter-fifteen]")'),false);
    await screenshot('143-chapter-fifteen-unsaved');await click('.qso-result-modal.success .qso-result-primary');
    await until('!!document.querySelector("[data-action=continue-chapter-fifteen]")');
    const logged=await saved(),contact=logged.qsoLogs.find(q=>!baseline.qsoLogs.some(old=>old.id===q.id));
    assert(contact&&contact.credits>0&&contact.playerCallsign===fixture.callsign&&contact.eventId===null);
    await click('[data-action="continue-chapter-fifteen"]');await until(storyBeat('choose'));
    assert.equal(await evaluate('document.querySelectorAll("[data-action=choose-first-page-goal]").length'),5);
    assert.equal(await evaluate('document.querySelectorAll("[data-action=choose-first-page-goal][aria-pressed=true]").length'),0);
    for(let n=0;n<4;n++)await click('.vn-line');
    assert.equal(await evaluate('document.querySelector("[data-action=chapter-fifteen-primary]").disabled'),true);
    await click('[data-action="choose-first-page-goal"][data-goal="people-network"]');
    await screenshot('144-chapter-fifteen-choice');
    const choice=(await saved()).chapterFifteenPresentation;assert.equal(choice.qsoId,contact.id);assert.equal(choice.goal,'people-network');
    // Seeded prerequisites can queue several earned achievements over the header.
    for(let n=0;n<ACHIEVEMENT_CATALOG.length&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('.chapter-one-review-settings');await until('!!document.querySelector(".settings-modal") && document.querySelector(".chapter-fifteen-story-screen").inert');
    assert.equal(await evaluate('document.querySelector(".chapter-fifteen-story-screen").inert'),true);
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter'});
    assert.deepEqual((await saved()).chapterFifteenPresentation,choice);await click('.settings-modal header .icon-button');
    await reopen();await until(storyBeat('choose'));assert.deepEqual((await saved()).chapterFifteenPresentation,choice);
    assert.equal(await evaluate('document.querySelector("[data-action=choose-first-page-goal][aria-pressed=true]").dataset.goal'),'people-network');
    await click('[data-action="vn-notes"]');const facts=await evaluate('document.querySelector("[data-testid=chapter-fifteen-real-log]").innerText');
    for(const fact of [contact.callsign,contact.sent+' / '+contact.received,String(contact.frequencyMhz),String(contact.credits)])assert(facts.includes(fact));
    await screenshot('145-chapter-fifteen-real-contact');await click('.vn-modal header button');
    const beforeSeal=await saved();await finishScene('chapter-fifteen-primary');await until(storyBeat('log'));
    const sealed=await saved(),record=sealed.storyContinuationState.chapter15.archive.find(r=>r.qsoId===contact.id);
    assert(record&&record.goal==='people-network');assert.equal(sealed.money,beforeSeal.money);assert.equal(sealed.technologyPoints,beforeSeal.technologyPoints);
    assert.equal(await evaluate('!!document.querySelector("[data-action=choose-first-page-goal]")'),false);
    await screenshot('146-chapter-fifteen-ending');await reopen();await until(storyBeat('log'));
    assert.equal((await saved()).storyContinuationState.chapter15.archive.length,1);
    const beforeClaim=await saved();await finishScene('chapter-fifteen-primary');
    await until('document.querySelector(".chapter-fifteen-story-screen")?.dataset.storyStatus==="claimed"');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+2000+achievementMoney);assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+8+achievementPoints);
    assert.equal(claimed.missionState.claimedMissionIds.filter(id=>/^story-/.test(id)).length,15);
    assert.equal(claimed.storyContinuationState.openStation.firstGoal,'people-network');
    await screenshot('147-chapter-fifteen-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-fifteen-primary"]');await until('!!document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector("[data-action=enter-chapter-fifteen-home]")'),false);
    await click('[data-action="open-open-station"]');await until('!!document.querySelector("[data-testid=open-station-modal]")');
    await screenshot('148-open-station-first-goal');
    await click('[data-action="update-open-station-goal"][data-goal="world-log"]');
    await until('document.querySelector("[data-testid=open-station-modal]").dataset.openStationActiveGoal==="world-log"');
    const postgame=await saved();assert.equal(postgame.storyContinuationState.openStation.firstGoal,'people-network');
    assert.equal(postgame.storyContinuationState.openStation.activeGoal,'world-log');
    assert.deepEqual(postgame.storyContinuationState.chapter15,claimed.storyContinuationState.chapter15);assert.equal(postgame.money,claimed.money);
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="open-open-station"]');
    await until('document.querySelector("[data-testid=open-station-modal]")?.dataset.openStationActiveGoal==="world-log"');
    assert.equal((await saved()).money,claimed.money);
    await screenshot('149-open-station-reloaded');await click('.open-station-modal header .pixel-icon-button');
    chapterFifteenEvidence={passed:true,record,contact:{id:contact.id,callsign:contact.callsign,credits:contact.credits,sent:contact.sent,received:contact.received},keyEventInput:true,keyerWpm:30,ordinaryQso:true,unsavedContactRejected:true,explicitChoice:true,choiceReload:true,openingReload:true,endingReload:true,settingsBlocksChoice:true,firstGoalImmutable:true,postgameGoalUpdate:true,postgameReload:true,settlementMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,allFifteenClaimed:true,duplicateReward:false};
    console.log('CHAPTER_FIFTEEN_PASSED',JSON.stringify(chapterFifteenEvidence));
  }

  const finalMoney=(await saved()).money;

  await navigate('Page.navigate',{url:new URL('?review=chapter-1',baseUrl).href});
  await until(`document.querySelector('[data-review-beat="silence"]')`);
  assert.equal((await saved()).money,finalMoney);
  await screenshot('10-review-preserved');
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  await writeFile(path.join(output,'evidence.json'),JSON.stringify({passed:true,profile,baseUrl,fixtureWpm,recordedAt:new Date().toISOString(),seededPredecessors:true,playedChapter:15,keyEventInput:true,qaCapture:true,audioPlaybackSkipped:true,chapterFifteen:chapterFifteenEvidence,reviewPreserved:true,exceptions},null,2));
  console.log(JSON.stringify({passed:true,profile,output}));
}
catch(error){
  await writeFile(path.join(output,'evidence.json'),JSON.stringify({passed:false,baseUrl,error:String(error),recordedAt:new Date().toISOString()},null,2));
  console.error(error); process.exitCode=1;
}
finally {
  socket?.close();
  chrome.kill();
  await pause(1000);
  const tempRoot = path.resolve(os.tmpdir());
  const resolvedProfile = path.resolve(profile);
  // Delete only the isolated profile created above, never a real browser profile.
  if (path.dirname(resolvedProfile) !== tempRoot || !path.basename(resolvedProfile).startsWith('cw-chapter-fifteen-live-')) {
    throw new Error('Refusing to remove a profile outside the QA temp directory');
  }
  await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 })
    .catch(error => console.warn('QA profile cleanup failed:', error.message));
}

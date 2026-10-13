// CWGAME_QA_CHAPTER_TWELVE=1 includes Chapters One–Eleven plus keyed conflict verification, relay and replay.
// CWGAME_QA_CHAPTER_ELEVEN=1 includes Chapters One–Ten and keyed listening calls, pause/reload, no-reply settlement and replay.
// Listening observations are UI facts, not an audio-hearing acceptance test.
// CWGAME_QA_CHAPTER_TEN=1 includes Chapters One–Nine, then a real-keyed contest at 30 WPM set through settings.
// CWGAME_QA_CHAPTER_NINE=1 includes Chapters One–Eight and real-keyed coordinate readback/relay.
// Its receive/confirmation actions remain text buttons, not audio-listening verification.
// CWGAME_QA_CHAPTER_EIGHT=1 includes Chapters One–Seven and real-keyed service-net check-in/ACKs.
// Chapter Eight receive buttons show text; QRS checks replyWpm, not audible playback speed.
// Browser smoke test. Run on the development server; start preview on port 4176.
// Set CWGAME_QA_CHAPTER_TWO=1 to continue through Chapter Two.
// CWGAME_QA_CHAPTER_THREE=1 includes both prerequisites and continues through Chapter Three.
// CWGAME_QA_CHAPTER_FOUR=1 includes Chapters One–Three; CWGAME_QA_UTC controls only the test clock.
// CWGAME_QA_CHAPTER_FIVE=1 includes Chapters One–Four and the full lights event.
// CWGAME_QA_CHAPTER_SIX=1 includes Chapters One–Five and the resumable field expedition.
// CWGAME_QA_CHAPTER_SEVEN=1 includes Chapters One–Six, actual QSL keying and two separate choices.
// Chapter Six uses its existing structured input/buttons, not the ordinary Morse keyer.
// Chapter Seven keys clarification/recovery traffic; its reply is the existing text/button flow,
// not an audio listening test. QRS verifies the stored replyWpm field, not playback speed.
// The normal propagation engine still determines signal levels; no QSO/mission result is injected.
// Uses the existing qaCapture switch to expose the selected blind-listening callsign
// and skip audio playback; CW still passes through key events, AutomaticKeyer,
// decoding, protocol validation and the normal save/mission settlement paths.
// Never use a personal browser profile or pre-populate completed QSO/mission state.
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createSave, SAVE_STORAGE_KEY, ACTIVE_SAVE_KEY } from '../src/game/saveStore.js';
import { MORSE_CODE } from '../src/cw/morse.js';
import { ACHIEVEMENT_CATALOG } from '../src/game/achievements.js';
import { runSettlementLedgerId } from '../src/game/lightsSettlement.js';

const output = path.resolve(process.env.CWGAME_QA_OUTPUT || 'qa-artifacts-chapter-one-live');
const baseUrl = process.env.CWGAME_QA_URL || 'http://127.0.0.1:4176/';
const chromePath = process.env.CWGAME_QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const fixtureWpm = Number(process.env.CWGAME_QA_WPM || 18);
assert(Number.isInteger(fixtureWpm) && fixtureWpm >= 5 && fixtureWpm <= 40, 'QA WPM must be an integer from 5 to 40');
const qaClockEpoch = process.env.CWGAME_QA_UTC ? Date.parse(process.env.CWGAME_QA_UTC) : null;
assert(qaClockEpoch === null || Number.isFinite(qaClockEpoch), 'QA UTC must be a valid date');
const qaClockWallStart = Date.now();
const profile = path.join(os.tmpdir(), `cw-chapter-one-live-${Date.now()}`);
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
    const p=await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(selector)});b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
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
  const fixture=createSave({callsign:'BH1QA',keyType:'automatic',automaticKeyWpm:fixtureWpm});
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`if(${JSON.stringify(qaClockEpoch)}!==null){const NativeDate=Date;const now=()=>${JSON.stringify(qaClockEpoch)}+NativeDate.now()-${JSON.stringify(qaClockWallStart)};function QaDate(...args){if(!new.target)return new NativeDate(now()).toString();return new NativeDate(...(args.length?args:[now()]));}Object.setPrototypeOf(QaDate,NativeDate);QaDate.prototype=NativeDate.prototype;QaDate.now=now;window.Date=QaDate;}window.cwgameSystem={qaCapture:true};if(!localStorage.getItem(${JSON.stringify(SAVE_STORAGE_KEY)})){localStorage.setItem(${JSON.stringify(SAVE_STORAGE_KEY)},${JSON.stringify(JSON.stringify([fixture]))});localStorage.setItem(${JSON.stringify(ACTIVE_SAVE_KEY)},${JSON.stringify(fixture.id)});localStorage.setItem('game-morse-adventurer.language.v1','zh-CN');}`});
  await navigate('Page.navigate',{url:baseUrl});
  await call('Page.bringToFront');
  await click('.menu-primary');await click('.save-primary-action');
  await click('[data-action="enter-chapter-one-home"]');
  await until(`document.querySelector('[data-story-beat="silence"]')`);
  assert.equal((await saved()).missionState.activeMissions[0].id,'story-01');
  assert.equal((await saved()).qsoLogs.length,0);
  await screenshot('01-opening');
  await finishScene();
  await until(`document.querySelector('[data-story-beat="operator"]')`);
  await screenshot('02-operator');
  await navigate('Page.reload');
  await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-one-home"]');
  await until(`document.querySelector('[data-story-beat="operator"]')`);
  await finishScene();
  await until(`document.querySelector('[data-story-beat="call"]')`);
  assert((await evaluate('document.body.innerText')).includes('BH1QA'));
  assert(!(await evaluate('document.body.innerText')).includes('SIM1OP'));
  await screenshot('03-real-key-brief');
  await click('.chapter-one-art-open');
  await until(`document.querySelector('.chapter-one-art-lightbox')`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
  await until(`!document.querySelector('.chapter-one-art-lightbox')&&document.activeElement===document.querySelector('.chapter-one-art-open')`);
  await click('.chapter-one-review-settings');
  await until(`document.querySelector('.settings-modal')`);
  assert.equal(await evaluate(`document.querySelector('.chapter-one-story-screen').inert`),true);
  assert.equal(await evaluate(`Array.from(document.querySelectorAll('audio')).every(audio=>audio.paused)`),true);
  await click('.settings-modal header .icon-button');
  await until(`!document.querySelector('.chapter-one-story-screen').inert`);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await evaluate('window.scrollTo(0,0)');
  await screenshot('03a-mobile-opening');
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'no horizontal page overflow');
  await evaluate(`document.querySelector('[data-action="chapter-one-primary"]').scrollIntoView({block:'center'})`);
  await screenshot('03b-mobile-action');
  assert(await evaluate(`(()=>{const r=document.querySelector('[data-action="chapter-one-primary"]').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()`),'mobile primary action can be reached');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await evaluate('window.scrollTo(0,0)');
  await finishScene();
  await click('[data-action="start-guided-watch"]');
  await until(`document.querySelector('.station-screen')?.dataset.qsoPhase==='PLAYER_CQ'`);
  assert.equal(await evaluate(`!!document.querySelector('img[src*="portrait"]')`),false);
  await screenshot('04-station');
  await sendText('SOS');
  await until(`document.body.innerText.includes('发报质量过低')`);
  assert.equal(await phase(),'PLAYER_CQ');
  assert.equal((await saved()).qsoLogs.length,0);
  await screenshot('04a-invalid-input');
  await click('[data-action="clear-input"]');
  let finished=false;
  for(let turn=0;turn<12;turn++){
    const current=await phase();console.log(`PHASE ${current}`);
    if(current==='QSO_COMPLETE'){finished=true;break;}
    if(current==='QSO_FAILED'){
      await screenshot(`retry-${turn}`);await click('.qso-result-modal.failed .qso-result-primary');continue;
    }
    if(['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER'].includes(current)){
      if(await evaluate(`!!document.querySelector('[data-action="clear-and-retry"]')`))await click('[data-action="clear-and-retry"]');
      const template=await evaluate(`document.querySelector('[data-testid="qso-duty-template"]')?.textContent`);
      const remote=await evaluate(`document.querySelector('.station-screen').dataset.qaNpcCallsign`);
      const text=current==='PLAYER_OPTIONAL_ANSWER'?'SKIP K':template?.replace('REMOTE',remote);
      assert(text,`visible guidance for ${current}`);
      await sendText(text);
      await pause(900);
    }
    await until(`['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER','QSO_COMPLETE','QSO_FAILED'].includes(document.querySelector('.station-screen')?.dataset.qsoPhase)`,65000);
  }
  assert(finished,'real QSO reached completion');
  assert.equal((await saved()).qsoLogs.length,0,'unsaved success is not a story ending');
  assert.equal(await evaluate(`!!document.querySelector('[data-action="continue-chapter-one"]')`),false);
  await screenshot('05-unsaved-qso');
  await click('.qso-result-modal.success .qso-result-primary');
  await until(`!!document.querySelector('[data-action="continue-chapter-one"]')`);
  const qsoSaved=await saved();assert.equal(qsoSaved.qsoLogs.length,1);
  const actual=qsoSaved.qsoLogs[0];
  await screenshot('06-saved-qso');
  await click('[data-action="continue-chapter-one"]');
  await until(`document.querySelector('[data-story-beat="answer"]')`);
  assert((await evaluate('document.body.innerText')).includes(actual.callsign));
  await screenshot('07-actual-answer');
  await finishScene();
  await until(`document.querySelector('[data-story-beat="log"]')`);
  await click('[data-action="vn-notes"]');
  assert((await evaluate(`document.querySelector('[data-testid="chapter-one-real-log"]').innerText`)).includes(`${actual.sent} / ${actual.received}`));
  await screenshot('08-real-log');
  await click('.vn-modal header button');
  await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-one-home"]');
  await until(`document.querySelector('[data-story-beat="log"]')`);
  assert.equal((await saved()).money,qsoSaved.money);
  await finishScene();
  await until(`document.querySelector('[data-story-status="claimed"]')`);
  const claimed=await saved();assert.equal(claimed.money,qsoSaved.money+150);assert.equal(claimed.qsoLogs.length,1);
  assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-01').length,1);
  await screenshot('09-claimed');
  await click('[data-action="chapter-one-primary"]');
  await until(`document.querySelector('.home-screen')`);
  assert.equal(await evaluate(`!!document.querySelector('[data-action="enter-chapter-one-home"]')`),false);
  await click('[data-action="open-missions"]');
  await until(`document.querySelector('[data-mission-id="story-02"][data-mission-status="available"]')`);
  await screenshot('09a-chapter-two-unlocked');
  await click('.mission-center-modal header .icon-button');
  await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
  assert.equal((await saved()).money,claimed.money);

  let chapterTwoEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_TWO === '1' || process.env.CWGAME_QA_CHAPTER_THREE === '1' || (process.env.CWGAME_QA_CHAPTER_FOUR === '1' || (process.env.CWGAME_QA_CHAPTER_FIVE === '1' || (process.env.CWGAME_QA_CHAPTER_SIX === '1' || process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1')))) {
    await click('[data-action="enter-chapter-two-home"]');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-beat="paper"]\')');
    assert.equal((await saved()).missionState.activeMissions.find(m => m.id === 'story-02')?.id,'story-02');
    await screenshot('11-chapter-two-paper');
    await finishScene('chapter-two-primary');
    await until('document.querySelector(\'[data-story-beat="margin"]\')');
    await screenshot('12-chapter-two-margin');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-two-home"]');
    await until('document.querySelector(\'[data-story-beat="margin"]\')');
    await finishScene('chapter-two-primary');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-beat="call"]\')');
    await click('[data-action="vn-notes"]');
    assert((await evaluate('document.querySelector(".vn-modal-content").innerText')).includes('AGN K'));
    await screenshot('13-chapter-two-brief');
    await click('.vn-modal header button');
    await click('.chapter-one-review-settings');
    await until('document.querySelector(".settings-modal")');
    assert.equal(await evaluate('document.querySelector(".chapter-two-story-screen").inert'),true);
    await click('.settings-modal header .icon-button');
    await until('!document.querySelector(".chapter-two-story-screen").inert');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await screenshot('13a-chapter-two-mobile');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
    await evaluate('document.querySelector(\'[data-action="chapter-two-primary"]\').scrollIntoView({block:"center"})');
    assert(await evaluate('(()=>{const r=document.querySelector(\'[data-action="chapter-two-primary"]\').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await finishScene('chapter-two-primary');
    await until('document.querySelector(".station-screen")');
    // The first contact already persisted qsoBriefSeen; do not require a second onboarding dialog.
    if(await evaluate('!!document.querySelector(\'[data-action="start-guided-watch"]\')'))await click('[data-action="start-guided-watch"]');
    await until('document.querySelector(".station-screen")?.dataset.qsoPhase==="PLAYER_CQ"');
    let repeated = false;
    let secondFinished = false;
    for(let turn=0;turn<16;turn++) {
      const current = await phase();console.log('CHAPTER TWO PHASE',current);
      if(current==='QSO_COMPLETE'){secondFinished=true;break;}
      if(current==='QSO_FAILED'){
        await screenshot('chapter-two-retry-'+turn);
        await click('.qso-result-modal.failed .qso-result-primary');
        repeated=false;continue;
      }
      if(['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER'].includes(current)){
        if(await evaluate('!!document.querySelector(\'[data-action="clear-and-retry"]\')'))await click('[data-action="clear-and-retry"]');
        const remote=await evaluate('document.querySelector(".station-screen").dataset.qaNpcCallsign');
        if(current!=='PLAYER_CQ')assert.equal(remote,'SIM3RA','active chapter target takes priority over the generic QA roster');
        const template=await evaluate('document.querySelector(\'[data-testid="qso-duty-template"]\')?.textContent');
        if(current==='PLAYER_RST_AND_73'&&!repeated){
          await sendText('AGN K');repeated=true;
          await screenshot('14-chapter-two-agn');
        } else {
          const text=current==='PLAYER_OPTIONAL_ANSWER'?'SKIP K':template?.replace('REMOTE',remote);
          assert(text);await sendText(text);
        }
        await pause(900);
      }
      await until('["PLAYER_CQ","PLAYER_RST_AND_73","PLAYER_OPTIONAL_ANSWER","QSO_COMPLETE","QSO_FAILED"].includes(document.querySelector(".station-screen")?.dataset.qsoPhase)',65000);
    }
    assert(secondFinished&&repeated,'chapter two reached completion through a real repeat request');
    assert.equal((await saved()).qsoLogs.length,1);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-two"]\')'),false);
    await screenshot('15-chapter-two-unsaved');
    await click('.qso-result-modal.success .qso-result-primary');
    await until('document.querySelector(\'[data-action="continue-chapter-two"]\')');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-one"]\')'),false);
    const beforeClaim=await saved();
    const actualTwo=beforeClaim.qsoLogs.find(q => q.id !== actual.id);
    assert.equal(actualTwo.callsign,'SIM3RA');
    assert(actualTwo.attemptHistory.some(attempt=>attempt.message==='AGN K'&&attempt.result==='repeat'));
    assert(beforeClaim.qsoRecords.settledQsoIds.includes(actualTwo.id));
    assert(beforeClaim.missionState.events.some(event=>event.qsoId===actualTwo.id&&event.missionIds.includes('story-02')&&event.outcome==='progress'));
    await click('[data-action="continue-chapter-two"]');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-beat="answer"]\')');
    await screenshot('16-chapter-two-answer');
    await finishScene('chapter-two-primary');
    await until('document.querySelector(\'[data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const logText=await evaluate('document.querySelector(\'[data-testid="chapter-two-real-log"]\').innerText');
    assert(logText.includes(actualTwo.sent+' / '+actualTwo.received));
    assert(logText.includes('AGN K'));
    await screenshot('17-chapter-two-log');
    await click('.vn-modal header button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-two-home"]');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-two-primary');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-status="claimed"]\')');
    const afterClaim=await saved();
    const chapterReward=afterClaim.missionState.history.find(item=>item.id==='story-02');
    assert.equal(chapterReward.moneyReward,220);
    assert.equal(chapterReward.technologyPointsReward,1);
    const newAchievements=afterClaim.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    assert.deepEqual(newAchievements,['first-name']);
    assert.equal(afterClaim.money,beforeClaim.money+220+100,'chapter reward and first-name achievement settle separately');
    assert.equal(afterClaim.technologyPoints,beforeClaim.technologyPoints+1);
    assert.equal(afterClaim.missionState.claimedMissionIds.filter(id=>id==='story-02').length,1);
    assert(afterClaim.knownOperatorNames.includes('MORSE'));
    await screenshot('18-chapter-two-claimed');
    await until('document.querySelector(\'[data-testid="achievement-notification"][data-achievement-id="first-name"]\')');
    // Acknowledge the existing persistent achievement toast before using the top-right home toolbar.
    await click('.achievement-notification > button');
    await until('!document.querySelector(\'[data-testid="achievement-notification"]\')');
    assert.equal((await saved()).money,afterClaim.money);
    await click('[data-action="chapter-two-primary"]');
    await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-two-home"]\')'),false);
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-03"][data-mission-status="available"]\')');
    await screenshot('19-chapter-three-unlocked');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterTwoEvidence={passed:true,actual:{id:actualTwo.id,callsign:actualTwo.callsign,sent:actualTwo.sent,received:actualTwo.received},successfulAgn:true,missionMoneyReward:220,achievementMoneyReward:100,newAchievements,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,openingReload:true,endingReload:true,settingsPause:true,mobileLayout:true,chapterThreeUnlocked:true,duplicateReward:false};
  }

  let chapterThreeEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_THREE === '1' || (process.env.CWGAME_QA_CHAPTER_FOUR === '1' || (process.env.CWGAME_QA_CHAPTER_FIVE === '1' || (process.env.CWGAME_QA_CHAPTER_SIX === '1' || process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1')))) {
    await click('[data-action="enter-chapter-three-home"]');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-beat="listen"]\')');
    const baseline = await saved();
    assert.equal(baseline.missionState.activeMissions.find(m=>m.id==='story-03')?.id,'story-03');
    await screenshot('20-chapter-three-listen');
    await finishScene('chapter-three-primary');
    await until('document.querySelector(\'[data-story-beat="notes"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
    await until('document.querySelector(\'[data-story-beat="notes"]\')');
    await finishScene('chapter-three-primary');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-beat="call"]\')');
    await screenshot('21-chapter-three-call');
    assert.equal(await evaluate('document.querySelector(".chapter-three-story-screen").dataset.storyContactCount'),'0');
    await click('.chapter-one-review-settings');
    await until('document.querySelector(".settings-modal")');
    assert.equal(await evaluate('document.querySelector(".chapter-three-story-screen").inert'),true);
    await click('.settings-modal header .icon-button');
    await until('!document.querySelector(".chapter-three-story-screen").inert');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await screenshot('21a-chapter-three-mobile');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
    await evaluate('document.querySelector(\'[data-action="chapter-three-primary"]\').scrollIntoView({block:"center"})');
    assert(await evaluate('(()=>{const r=document.querySelector(\'[data-action="chapter-three-primary"]\').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    const actualContacts = [];
    const byStyle = new Map();
    for(let attempt=0; attempt<15 && byStyle.size<3; attempt++){
      await finishScene('chapter-three-primary');
      await until('document.querySelector(".station-screen")?.dataset.qsoPhase==="PLAYER_CQ"');
      let finished = false;
      for(let turn=0;turn<24;turn++){
        const current = await phase();console.log('CHAPTER THREE',attempt,'PHASE',current);
        if(current==='QSO_COMPLETE'){finished=true;break;}
        if(current==='QSO_FAILED'){
          await screenshot('chapter-three-retry-'+attempt+'-'+turn);
          await click('.qso-result-modal.failed .qso-result-primary');continue;
        }
        if(['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER'].includes(current)){
          if(await evaluate('!!document.querySelector(\'[data-action="clear-and-retry"]\')'))await click('[data-action="clear-and-retry"]');
          const remote=await evaluate('document.querySelector(".station-screen").dataset.qaNpcCallsign');
          const template=await evaluate('document.querySelector(\'[data-testid="qso-duty-template"]\')?.textContent');
          const text=current==='PLAYER_OPTIONAL_ANSWER'?'SKIP K':template?.replace('REMOTE',remote);
          assert(text);await sendText(text);await pause(900);
        }
        await until('["PLAYER_CQ","PLAYER_RST_AND_73","PLAYER_OPTIONAL_ANSWER","QSO_COMPLETE","QSO_FAILED"].includes(document.querySelector(".station-screen")?.dataset.qsoPhase)',65000);
      }
      assert(finished,'third chapter contact completed through keyboard events');
      assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length+actualContacts.length);
      assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-three"]\')'),false);
      await click('.qso-result-modal.success .qso-result-primary');
      await until('document.querySelector(\'[data-action="continue-chapter-three"]\')');
      const after = await saved();
      const entry = after.qsoLogs.find(log=>!baseline.qsoLogs.some(old=>old.id===log.id)&&!actualContacts.some(old=>old.id===log.id));
      assert(entry);
      assert(after.qsoRecords.settledQsoIds.includes(entry.id));
      assert(after.missionState.events.some(event=>event.qsoId===entry.id&&event.outcome==='progress'&&event.missionIds.includes('story-03')));
      actualContacts.push(entry);
      if(!byStyle.has(entry.operatorProfileId))byStyle.set(entry.operatorProfileId,entry);
      console.log('CHAPTER THREE CONTACT',JSON.stringify({id:entry.id,callsign:entry.callsign,style:entry.operatorProfileId,unique:byStyle.size}));
      assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-two"]\')'),false);
      await click('[data-action="continue-chapter-three"]');
      await until('document.querySelector(\'[data-story-chapter="3"][data-story-contact-count="'+byStyle.size+'"]\')');
      const beat=await evaluate('document.querySelector(".chapter-three-story-screen").dataset.storyBeat');
      assert.equal(beat,byStyle.size===3?'compare':'call');
      if(byStyle.size<3){
        await click('[data-action="vn-notes"]');
        assert.equal(await evaluate('document.querySelectorAll(\'[data-testid="chapter-three-real-logs"] [data-qso-id]\').length'),byStyle.size);
        await screenshot('22-chapter-three-partial-'+actualContacts.length);
        await click('.vn-modal header button');
        await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
        await until('document.querySelector(\'[data-story-chapter="3"][data-story-contact-count="'+byStyle.size+'"][data-story-beat="call"]\')');
        assert.equal((await saved()).money,after.money);
      }
    }
    assert.equal(byStyle.size,3,'three actual styles found without injecting a responder or success state');
    await screenshot('23-chapter-three-compare');
    await finishScene('chapter-three-primary');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    assert.equal(await evaluate('document.querySelectorAll(\'[data-testid="chapter-three-real-logs"] [data-qso-id]\').length'),3);
    const recordText=await evaluate('document.querySelector(\'[data-testid="chapter-three-real-logs"]\').innerText');
    for(const entry of byStyle.values()){
      assert(recordText.includes(entry.callsign));
      assert(recordText.includes(entry.sent+' / '+entry.received));
    }
    await screenshot('24-chapter-three-logs');
    await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-three-primary');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-status="claimed"]\')');
    const afterClaim=await saved();
    assert.equal(afterClaim.money,beforeClaim.money+300);
    assert.equal(afterClaim.technologyPoints,beforeClaim.technologyPoints+1);
    assert.equal(afterClaim.missionState.claimedMissionIds.filter(id=>id==='story-03').length,1);
    assert.deepEqual(afterClaim.claimedAchievementRewards,beforeClaim.claimedAchievementRewards);
    await screenshot('25-chapter-three-claimed');
    await click('[data-action="chapter-three-primary"]');
    await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-three-home"]\')'),false);
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-04"][data-mission-status="available"]\')');
    await screenshot('26-chapter-four-unlocked');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterThreeEvidence={passed:true,actualContacts:actualContacts.map(({id,callsign,operatorProfileId,sent,received})=>({id,callsign,operatorProfileId,sent,received})),uniqueStyles:[...byStyle.keys()],duplicateStylesObserved:actualContacts.length>byStyle.size,openingReload:true,partialReload:true,endingReload:true,settingsPause:true,mobileLayout:true,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,chapterFourUnlocked:true,duplicateReward:false};
  }


  let chapterFourEvidence = null;
  if ((process.env.CWGAME_QA_CHAPTER_FOUR === '1' || (process.env.CWGAME_QA_CHAPTER_FIVE === '1' || (process.env.CWGAME_QA_CHAPTER_SIX === '1' || process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1')))) {
    await click('[data-action="enter-chapter-four-home"]');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="rain"]\')');
    const baseline = await saved();
    assert.equal(baseline.missionState.activeMissions.find(m=>m.id==='story-04')?.id,'story-04');
    assert(!baseline.knownOperatorNames.includes('NOVA'));
    // Observe the actual shared flash timer and audio play event, without triggering either.
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await evaluate('(()=>{const samples={flashes:[],thunder:[]};window.__qaWeatherEvents=samples;const watch=()=>{const node=document.querySelector(".vn-atmosphere .chapter-scene-lightning");const pulse=Number(node?.dataset.sceneEventPulse);if(pulse>0&&!samples.flashes.some(item=>item.pulse===pulse))samples.flashes.push({pulse,at:performance.now(),animation:getComputedStyle(node).animationName,display:getComputedStyle(node).display});};new MutationObserver(watch).observe(document.querySelector(".vn-atmosphere"),{childList:true,subtree:true});document.querySelector(\'audio[src$="thunder.wav"]\').addEventListener("play",()=>samples.thunder.push(performance.now()));})()');
    await until('window.__qaWeatherEvents.flashes.length>0&&window.__qaWeatherEvents.thunder.length>0',20000);
    const lightningEvents=await evaluate('window.__qaWeatherEvents');
    const flash=lightningEvents.flashes[0];
    const thunder=lightningEvents.thunder.find(at=>at>=flash.at);
    assert.equal(flash.animation,'chapter-lightning-flash');
    assert.notEqual(flash.display,'none');
    assert(thunder-flash.at>=500&&thunder-flash.at<3000,'thunder follows the same visible flash event');
    const lightningEvidence={foregroundPulse:flash.pulse,thunderDelayMs:Math.round(thunder-flash.at)};
    await screenshot('27a-chapter-four-lightning-timer');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".vn-atmosphere .chapter-scene-lightning")).display'),'none');

    await screenshot('27-chapter-four-rain');
    await finishScene('chapter-four-primary');
    await until('document.querySelector(\'[data-story-beat="gap"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-four-home"]');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="gap"]\')');
    await finishScene('chapter-four-primary');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="call"]\')');
    await click('[data-action="vn-notes"]');
    assert((await evaluate('document.querySelector(".vn-modal").innerText')).includes('P3–P4'));
    await screenshot('28-chapter-four-instructions');
    await click('.vn-modal header button');
    await click('.chapter-one-review-settings');
    await until('document.querySelector(".settings-modal")');
    assert.equal(await evaluate('document.querySelector(".chapter-four-story-screen").inert'),true);
    await click('.settings-modal header .icon-button');
    await until('!document.querySelector(".chapter-four-story-screen").inert');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await screenshot('29-chapter-four-mobile');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
    await evaluate('document.querySelector(\'[data-action="chapter-four-primary"]\').scrollIntoView({block:"center"})');
    assert(await evaluate('(()=>{const r=document.querySelector(\'[data-action="chapter-four-primary"]\').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await finishScene('chapter-four-primary');
    await until('document.querySelector(".station-screen")?.dataset.qsoPhase==="PLAYER_CQ"');
    assert.equal(await evaluate('document.querySelector(".station-screen").dataset.missionTargetCallsign'),'SIM2DX');
    const recoveryCommand = process.env.CWGAME_QA_RECOVERY || 'QRS K';
    assert(['AGN K','QRS K'].includes(recoveryCommand));
    let recovered=false, finished=false, replyWpmBefore=null, replyWpmAfter=null;
    for(let turn=0;turn<30;turn++){
      const current=await phase();console.log('CHAPTER FOUR PHASE',current);
      if(current==='QSO_COMPLETE'){finished=true;break;}
      if(current==='QSO_FAILED'){
        await screenshot('chapter-four-retry-'+turn);
        await click('.qso-result-modal.failed .qso-result-primary');recovered=false;continue;
      }
      if(['PLAYER_CQ','PLAYER_RST_AND_73','PLAYER_OPTIONAL_ANSWER'].includes(current)){
        if(await evaluate('!!document.querySelector(\'[data-action="clear-and-retry"]\')'))await click('[data-action="clear-and-retry"]');
        const remote=await evaluate('document.querySelector(".station-screen").dataset.qaNpcCallsign');
        const template=await evaluate('document.querySelector(\'[data-testid="qso-duty-template"]\')?.textContent');
        if(current==='PLAYER_OPTIONAL_ANSWER'){
          assert.equal(remote,'SIM2DX');
          assert.equal(await evaluate('document.querySelector(".station-screen").dataset.optionalExchangeQuestion'),'weather');
          if(!recovered){
            replyWpmBefore=await evaluate('Number(document.querySelector(".station-screen").dataset.replyWpm)');
            await sendText(recoveryCommand);await pause(900);
            await until('document.querySelector(".station-screen")?.dataset.qsoPhase==="PLAYER_OPTIONAL_ANSWER"',65000);
            replyWpmAfter=await evaluate('Number(document.querySelector(".station-screen").dataset.replyWpm)');
            if(recoveryCommand==='QRS K')assert(replyWpmAfter<replyWpmBefore || replyWpmAfter===5);
            else assert.equal(replyWpmAfter,replyWpmBefore);
            recovered=true;await screenshot('30-chapter-four-recovery');continue;
          }
          // Only the isolated QA persona sends this fixture. The engine must redact it.
          await sendText('WX RAIN K');
        } else {
          assert(template);await sendText(template.replace('REMOTE',remote));
        }
        await pause(900);
      }
      await until('["PLAYER_CQ","PLAYER_RST_AND_73","PLAYER_OPTIONAL_ANSWER","QSO_COMPLETE","QSO_FAILED"].includes(document.querySelector(".station-screen")?.dataset.qsoPhase)',65000);
    }
    assert(finished&&recovered,'weather QSO completed through physical key events and a recovery request');
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-four"]\')'),false);
    await click('.qso-result-modal.success .qso-result-primary');
    await until('document.querySelector(\'[data-action="continue-chapter-four"]\')');
    const afterContact=await saved();
    const actualFour=afterContact.qsoLogs.find(log=>!baseline.qsoLogs.some(old=>old.id===log.id));
    assert(actualFour);
    assert.equal(actualFour.callsign,'SIM2DX');
    assert(actualFour.finalPropagationLevel>=0&&actualFour.finalPropagationLevel<=2);
    assert.equal(actualFour.optionalExchangeQuestion,'weather');
    assert.equal(actualFour.optionalExchangeOutcome,'answered');
    assert(actualFour.attemptHistory.some(a=>a.message===recoveryCommand&&a.result==='repeat'));
    assert(actualFour.attemptHistory.some(a=>a.stage==='PLAYER_OPTIONAL_ANSWER'&&a.message==='OPTIONAL RESPONSE REDACTED'&&a.result==='accepted'));
    assert(!JSON.stringify(afterContact).includes('WX RAIN K'),'private optional answer is absent from saved state');
    assert(afterContact.qsoRecords.settledQsoIds.includes(actualFour.id));
    assert(afterContact.missionState.events.some(e=>e.qsoId===actualFour.id&&e.outcome==='progress'&&e.missionIds.includes('story-04')));
    assert(!afterContact.knownOperatorNames.includes('NOVA'));
    await click('[data-action="continue-chapter-four"]');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="answer"]\')');
    assert.equal(await evaluate('document.querySelector(".chapter-four-story-screen").dataset.storyQsoId'),actualFour.id);
    await screenshot('31-chapter-four-answer');
    await finishScene('chapter-four-primary');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const recordText=await evaluate('document.querySelector(\'[data-testid="chapter-four-real-log"]\').innerText');
    assert(recordText.includes(actualFour.callsign));
    assert(recordText.includes(actualFour.sent+' / '+actualFour.received));
    assert(recordText.includes('P'+actualFour.finalPropagationLevel));
    assert(recordText.includes(recoveryCommand));
    assert(!recordText.includes('WX RAIN K')&&!recordText.includes('NOVA'));
    await screenshot('32-chapter-four-log');
    await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-four-home"]');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-four-primary');
    await until('document.querySelector(\'[data-story-chapter="4"][data-story-status="claimed"]\')');
    const afterClaim=await saved();
    assert.equal(afterClaim.money,beforeClaim.money+420);
    assert.equal(afterClaim.technologyPoints,beforeClaim.technologyPoints+2);
    assert.equal(afterClaim.missionState.claimedMissionIds.filter(id=>id==='story-04').length,1);
    assert(afterClaim.knownOperatorNames.includes('NOVA'));
    assert.deepEqual(afterClaim.claimedAchievementRewards,beforeClaim.claimedAchievementRewards);
    await screenshot('33-chapter-four-claimed');
    await click('[data-action="chapter-four-primary"]');
    await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-four-home"]\')'),false);
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-05"][data-mission-status="available"]\')');
    await screenshot('34-chapter-five-unlocked');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterFourEvidence={passed:true,actual:{id:actualFour.id,callsign:actualFour.callsign,sent:actualFour.sent,received:actualFour.received,finalPropagationLevel:actualFour.finalPropagationLevel,optionalExchangeQuestion:actualFour.optionalExchangeQuestion,optionalExchangeOutcome:actualFour.optionalExchangeOutcome},recoveryCommand,replyWpmBefore,replyWpmAfter,lightningEvidence,optionalAnswerRedacted:true,openingReload:true,endingReload:true,settingsPause:true,mobileLayout:true,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,chapterFiveUnlocked:true,nameRevealedOnlyAfterClaim:true,duplicateReward:false};
  }


  let chapterFiveEvidence = null;
  if ((process.env.CWGAME_QA_CHAPTER_FIVE === '1' || (process.env.CWGAME_QA_CHAPTER_SIX === '1' || process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1'))) {
    const baseline = await saved();
    await click('[data-action="enter-chapter-five-home"]');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="notice"]\')');
    await screenshot('35-chapter-five-notice');
    await finishScene('chapter-five-primary');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="desk"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-five-home"]');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="desk"]\')');
    await finishScene('chapter-five-primary');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="call"]\')');
    await click('[data-action="vn-notes"]');
    const instructions = await evaluate('document.querySelector(".vn-modal").innerText');
    assert(instructions.includes('八分钟') && instructions.includes('3') && instructions.includes('2'));
    assert(instructions.includes('未结算'));
    await screenshot('36-chapter-five-instructions');
    await click('.vn-modal header button');
    await click('.chapter-one-review-settings');
    await until('document.querySelector(".settings-modal")');
    assert.equal(await evaluate('document.querySelector(".chapter-five-story-screen").inert'),true);
    await click('.settings-modal header .icon-button');
    await until('!document.querySelector(".chapter-five-story-screen").inert');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await screenshot('37-chapter-five-mobile');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
    await evaluate('document.querySelector(\'[data-action="chapter-five-primary"]\').scrollIntoView({block:"center"})');
    assert(await evaluate('(()=>{const r=document.querySelector(\'[data-action="chapter-five-primary"]\').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await finishScene('chapter-five-primary');
    await until('document.querySelector(".lights-event-screen")?.dataset.eventPhase==="CHASE_PLAYER_CALL"');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-five"]\')'),false);
    const lightsPhase = () => evaluate('document.querySelector(".lights-event-screen")?.dataset.eventPhase');
    const sendLights = text => sendText(text,{surface:'.lights-event-screen',submit:'[data-action="lights-transmit"]'});
    let qrs=false, agn=false, settingsPausedTimer=false, finished=false;
    for(let turn=0;turn<45;turn++){
      const current=await lightsPhase();
      console.log('CHAPTER FIVE PHASE',current);
      if(current==='RUN_COMPLETE'){finished=true;break;}
      if(current==='CONTROL_CQ'&&!settingsPausedTimer){
        await click('[data-action="lights-settings"]');
        await until('document.querySelector(".settings-modal")');
        const remaining = await evaluate('document.querySelector(".lights-event-meter > div:first-child strong").textContent');
        await pause(1400);
        assert.equal(await evaluate('document.querySelector(".lights-event-meter > div:first-child strong").textContent'),remaining);
        await click('.settings-modal header .icon-button');
        await until('!document.querySelector(".settings-modal")');
        settingsPausedTimer=true;
      }
      if(current==='CHASE_PLAYER_CALL'&&!qrs){
        await sendLights('QRS K');qrs=true;
      }else if(current==='CONTROL_SELECTION'&&!agn){
        await sendLights('AGN K');agn=true;
      }else if(['CHASE_PLAYER_CALL','CHASE_PLAYER_REPORT','CONTROL_CQ','CONTROL_SELECTION','CONTROL_PLAYER_REPORT'].includes(current)){
        const expected=await evaluate('document.querySelector(".lights-event-screen").dataset.qaExpected');
        assert(expected,'current protocol target is exposed only in the isolated QA session');
        await sendLights(expected);
      }
      await pause(500);
      await until('["CHASE_PLAYER_CALL","CHASE_PLAYER_REPORT","CONTROL_CQ","CONTROL_SELECTION","CONTROL_PLAYER_REPORT","RUN_COMPLETE"].includes(document.querySelector(".lights-event-screen")?.dataset.eventPhase)',65000);
    }
    assert(finished&&qrs&&agn&&settingsPausedTimer);
    const live=await evaluate('({...document.querySelector(".lights-event-screen").dataset})');
    assert(Number(live.validQsoCount)>=3 && Number(live.distinctRegionCount)>=2 && Number(live.resolvedPileupCount)>=1);
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-five"]\')'),false);
    await screenshot('38-chapter-five-run-complete');
    const beforeSettlement=await saved();
    await click('[data-action="lights-settle"]');
    await until('document.querySelector(\'[data-action="continue-chapter-five"]\')');
    const afterEvent=await saved();
    const latest=afterEvent.lightsEventState.storyLatest;
    const contacts=afterEvent.qsoLogs.filter(log=>log.eventRunId===latest.runId);
    assert.equal(contacts.length,Number(live.validQsoCount));
    assert.deepEqual([...latest.contactIds].sort(),contacts.map(log=>log.id).sort());
    assert(contacts.every(log=>log.credits===0 && log.eventMode==='story' && log.onAirCallsign==='SIM5LT' && afterEvent.qsoRecords.settledQsoIds.includes(log.id)));
    assert(afterEvent.lightsEventState.settledRunIds.includes(latest.runId));
    assert(afterEvent.qsoRecords.settledQsoIds.includes(runSettlementLedgerId(latest.runId)));
    assert(['base','silver','gold'].includes(latest.grade));
    const eventMoney=await evaluate('Number(document.querySelector(".lights-settlement-banner").dataset.lightsMoneyAwarded)');
    const achievementIds=afterEvent.claimedAchievementRewards.filter(id=>!beforeSettlement.claimedAchievementRewards.includes(id));
    const rewards=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=rewards.reduce((total,item)=>total+item.moneyReward,0);
    const achievementPoints=rewards.reduce((total,item)=>total+item.technologyPointsReward,0);
    assert.equal(afterEvent.money,beforeSettlement.money+eventMoney+achievementMoney);
    assert.equal(afterEvent.technologyPoints,beforeSettlement.technologyPoints+achievementPoints);
    assert.equal(await evaluate('document.querySelector(\'[data-action="lights-settle"]\').disabled'),true);
    await screenshot('39-chapter-five-settled');
    await click('[data-action="continue-chapter-five"]');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="answer"]\')');
    assert.equal(await evaluate('document.querySelector(".chapter-five-story-screen").dataset.storyRunId'),latest.runId);
    await screenshot('40-chapter-five-answer');
    await finishScene('chapter-five-primary');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const recorded=await evaluate('Array.from(document.querySelectorAll(\'[data-testid="chapter-five-real-logs"] article\')).map(node=>({id:node.dataset.qsoId,text:node.innerText}))');
    assert.equal(recorded.length,contacts.length);
    for(const log of contacts){
      const row=recorded.find(item=>item.id===log.id);
      assert(row && row.text.includes(log.callsign) && row.text.includes(log.sent+' / '+log.received) && row.text.includes(log.eventRegionCode));
    }
    await screenshot('41-chapter-five-log');
    await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-five-home"]');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    assert.equal(await evaluate('document.querySelector(".chapter-five-story-screen").dataset.storyRunId'),latest.runId);
    await finishScene('chapter-five-primary');
    await until('document.querySelector(\'[data-story-chapter="5"][data-story-status="claimed"]\')');
    const afterClaim=await saved();
    assert.equal(afterClaim.money,beforeClaim.money+500);
    assert.equal(afterClaim.technologyPoints,beforeClaim.technologyPoints+2);
    assert.equal(afterClaim.missionState.claimedMissionIds.filter(id=>id==='story-05').length,1);
    assert(afterClaim.knownOperatorNames.includes('SORA') && !beforeClaim.knownOperatorNames.includes('SORA'));
    assert.deepEqual(afterClaim.claimedAchievementRewards,beforeClaim.claimedAchievementRewards);
    await screenshot('42-chapter-five-claimed');
    await click('[data-action="chapter-five-primary"]');
    await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-five-home"]\')'),false);
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-06"][data-mission-status="available"]\')');
    await screenshot('43-chapter-six-unlocked');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterFiveEvidence={passed:true,runId:latest.runId,grade:latest.grade,score:latest.score,contacts:contacts.map(log=>({id:log.id,callsign:log.callsign,region:log.eventRegionCode,sent:log.sent,received:log.received})),qrs,agn,settingsPausedTimer,openingReload:true,endingReload:true,mobileLayout:true,eventMoney,achievementIds,achievementMoney,achievementPoints,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,chapterSixUnlocked:true,nameRevealedOnlyAfterClaim:true,duplicateReward:false};
  }


  let chapterSixEvidence = null;
  if ((process.env.CWGAME_QA_CHAPTER_SIX === '1' || process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1')) {
    const baseline = await saved();
    await click('[data-action="enter-chapter-six-home"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="pack"]\')');
    await screenshot('44-chapter-six-pack');
    await finishScene('chapter-six-primary');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="wire"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-six-home"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="wire"]\')');
    await finishScene('chapter-six-primary');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="call"]\')');
    await click('[data-action="vn-notes"]');
    const instructions=await evaluate('document.querySelector(".vn-modal").innerText');
    assert(instructions.includes('QTH')&&instructions.includes('PWR')&&instructions.includes('ANT')&&instructions.includes('进度都会保存'));
    await screenshot('45-chapter-six-instructions');await click('.vn-modal header button');
    await click('.chapter-one-review-settings');
    await until('document.querySelector(".settings-modal")');
    assert.equal(await evaluate('document.querySelector(".chapter-six-story-screen").inert'),true);
    await click('.settings-modal header .icon-button');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await screenshot('46-chapter-six-mobile');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
    await evaluate('document.querySelector(\'[data-action="chapter-six-primary"]\').scrollIntoView({block:"center"})');
    assert(await evaluate('(()=>{const r=document.querySelector(\'[data-action="chapter-six-primary"]\').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo(0,0)');
    await finishScene('chapter-six-primary');
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="site-selection"');
    await click('[data-action="expedition-select-site"][data-site-id="cedar-breeze-hill"]');
    await click('[data-action="expedition-setup-wrong"]');
    assert.equal(await evaluate('Number(document.querySelector(".expedition-screen").dataset.expeditionSetupMistakes)'),1);
    await click('[data-action="expedition-setup-antenna"]');
    await click('[data-action="expedition-setup-power"]');
    await click('[data-action="expedition-call-cq"]');
    await click('[data-action="expedition-receive-reply"]');
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="exchange"');
    const sendExchange=async message=>{
      console.log('CHAPTER SIX STRUCTURED EXCHANGE',message);
      await click('.expedition-exchange input');
      await evaluate('document.querySelector(".expedition-exchange input").select()');
      await call('Input.insertText',{text:message});
      await click('[data-action="expedition-send-exchange"]');
    };
    await sendExchange('QTH WRONG PWR 5W ANT WIRE K');
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="recovering"');
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-six"]\')'),false);
    await screenshot('47-chapter-six-recovery');
    await click('[data-action="expedition-back"]');
    await until('document.querySelector(".expedition-leave-dialog")');
    await click('[data-action="expedition-confirm-leave"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="call"]\')');
    const persistedRun=(await saved()).expeditionState.activeRun;
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-six-home"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="call"]\')');
    await finishScene('chapter-six-primary');
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="recovering"');
    await click('[data-action="expedition-settings"]');
    await until('document.querySelector(".settings-modal")');
    const frozen=(await saved()).expeditionState.activeRun;
    assert.equal(frozen.runId,persistedRun.runId);
    assert.equal(frozen.fieldSite.id,'cedar-breeze-hill');
    assert.equal(frozen.setupMistakes,1);
    assert(frozen.elapsedMilliseconds>=persistedRun.elapsedMilliseconds);
    assert(frozen.power.remainingWh<=persistedRun.power.remainingWh);
    await pause(1400);
    assert.deepEqual((await saved()).expeditionState.activeRun,frozen,'settings freeze time and battery');
    await click('.settings-modal header .icon-button');
    await click('[data-action="expedition-qrs"]');
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="exchange"');
    const template=await evaluate('document.querySelector(".expedition-exchange code").textContent');
    assert(template.includes('CEDAR')&&template.includes('5W')&&template.includes('WIRE'));
    await sendExchange(template);
    await until('document.querySelector(".expedition-screen")?.dataset.expeditionPhase==="completed"');
    const completedRun=(await saved()).expeditionState.activeRun;
    assert.equal(completedRun.result.outcome,'success');
    assert(completedRun.recoveryActions.includes('QRS'));
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('48-chapter-six-completed');
    const beforeSettlement=await saved();
    await click('[data-action="expedition-settle"]');
    await until('document.querySelector(\'[data-action="continue-chapter-six"]\')');
    const settled=await saved(), actual=settled.qsoLogs.find(log=>log.expeditionRunId===completedRun.runId);
    assert(actual && actual.expeditionSiteId==='cedar-breeze-hill' && actual.callsign==='SIM6JP');
    assert(settled.expeditionState.settledRunIds.includes(completedRun.runId));
    assert(settled.qsoRecords.settledQsoIds.includes(actual.id));
    assert(settled.expeditionState.settledQsoProofs.some(proof=>proof.qsoId===actual.id&&proof.runId===completedRun.runId));
    assert.equal(settled.expeditionState.activeRun,null);
    assert.equal(settled.money,beforeSettlement.money+actual.credits+250);
    assert(settled.technologyPoints>=beforeSettlement.technologyPoints+1);
    for(const key of ['locationId','equipmentId','antennaId','accessoryId','ownedEquipment','ownedAntennas','accessories'])assert.deepEqual(settled[key],baseline[key]);
    const card=settled.qslRecords.find(record=>record.qsoId===actual.id);
    assert(card && card.choice===null);
    assert.equal(await evaluate('document.querySelector(\'[data-action="expedition-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-six"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="answer"]\')');
    assert.equal(await evaluate('document.querySelector(".chapter-six-story-screen").dataset.storyQsoId'),actual.id);
    await screenshot('49-chapter-six-answer');
    await finishScene('chapter-six-primary');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const record=await evaluate('document.querySelector(\'[data-testid="chapter-six-real-log"]\').innerText');
    assert(record.includes('CEDAR')&&record.includes('杉风丘')&&record.includes(actual.sent+' / '+actual.received));
    assert(record.includes('QSL')&&!record.includes('SUNWARD'));
    await screenshot('50-chapter-six-log');await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-six-home"]');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-six-primary');
    await until('document.querySelector(\'[data-story-chapter="6"][data-story-status="claimed"]\')');
    const claimedSix=await saved();
    const achievementIds=claimedSix.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievementRewards=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievementRewards.reduce((sum,item)=>sum+item.moneyReward,0);
    const achievementPoints=achievementRewards.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimedSix.money,beforeClaim.money+650+achievementMoney);
    assert.equal(claimedSix.technologyPoints,beforeClaim.technologyPoints+3+achievementPoints);
    assert(claimedSix.expeditionState.expeditionTreeUnlocked);
    assert.deepEqual(claimedSix.qslRecords,beforeClaim.qslRecords);
    assert.equal(claimedSix.missionState.claimedMissionIds.filter(id=>id==='story-06').length,1);
    await screenshot('51-chapter-six-claimed');
    for(let n=0;n<10 && await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-six-primary"]');
    await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-six-home"]\')'),false);
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-07"][data-mission-status="locked"]\')');
    assert(await evaluate('!!document.querySelector(\'[data-action="launch-expedition-replay"]\')'));
    await screenshot('52-chapter-seven-awaits-qsl-choice');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimedSix.money);
    assert.equal((await saved()).technologyPoints,claimedSix.technologyPoints);
    chapterSixEvidence={passed:true,actual:{id:actual.id,runId:actual.expeditionRunId,siteId:actual.expeditionSiteId,callsign:actual.callsign,sent:actual.sent,received:actual.received,finalPropagationLevel:actual.finalPropagationLevel},structuredExchange:true,morseKeying:false,openingReload:true,activeRunResume:true,settingsFreeze:true,mobileLayout:true,endingReload:true,setupMistakes:1,recovery:'QRS',qsoMoney:actual.credits,fieldMoney:250,achievementIds,achievementMoney,achievementPoints,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimedSix.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimedSix.technologyPoints,permanentEquipmentPreserved:true,expeditionTreeUnlocked:true,qslChoiceUnchanged:true,chapterSevenLockedUntilQslChoice:true,duplicateReward:false};
  }


  let chapterSevenEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_SEVEN === '1' || process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1') {
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-seven-home"]\')'),false);
    await click('[data-action="open-people-qsl"]');
    await until('document.querySelector(\'[data-testid="people-qsl-modal"]\')');
    await click('[data-qsl-choice="request-review"]');
    const source=(await saved()).qslRecords.find(card=>card.choice==='request-review');
    assert(source);
    await screenshot('53-chapter-seven-source-choice');
    await click('.people-qsl-modal header .icon-button');
    await click('[data-action="enter-chapter-seven-home"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="card"]\')');
    const baseline=await saved();
    assert(baseline.missionState.activeMissions.some(mission=>mission.id==='story-07'));
    await screenshot('54-chapter-seven-card');
    await finishScene('chapter-seven-primary');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="compare"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-seven-home"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="compare"]\')');
    await finishScene('chapter-seven-primary');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="call"]\')');
    await click('[data-action="vn-notes"]');
    const instructions=await evaluate('document.querySelector(".vn-modal").innerText');
    assert(instructions.includes('进度都会保存')&&instructions.includes('最初判断')&&instructions.includes('最终判断'));
    await screenshot('55-chapter-seven-instructions');await click('.vn-modal header button');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await screenshot('56-chapter-seven-mobile');
    assert(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'));
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await finishScene('chapter-seven-primary');
    const qslPhase=expected=>'document.querySelector(".qsl-story-screen")?.dataset.qslStoryPhase==='+JSON.stringify(expected);
    await until(qslPhase('CASE_OPEN'));
    assert((await evaluate('document.querySelector("[data-player-account]").innerText')).includes('完整的通联交换'));
    await click('[data-action="qsl-story-review"]');
    await until(qslPhase('PLAYER_CLARIFICATION_CALL'));
    const options={surface:'.qsl-story-screen',submit:'[data-action="qsl-story-submit"]'};
    await sendText('QSL WRONG DE BH1QA PSE K',options);
    await until('document.querySelector(".qsl-story-error")?.innerText.includes("案件编号")');
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-seven"]\')'),false);
    const interrupted=(await saved()).storyContinuationState.chapter07.activeRun;
    await screenshot('57-chapter-seven-invalid-case');
    await click('.qsl-story-topbar > button:last-child');
    await until('document.querySelector(".qsl-story-leave-dialog")');
    const pulses=await evaluate('Number(document.querySelector(".qsl-story-screen").dataset.pulseCount)');
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});
    await pause(180);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(300);
    assert.equal(await evaluate('Number(document.querySelector(".qsl-story-screen").dataset.pulseCount)'),pulses);
    await click('[data-action="qsl-story-confirm-leave"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="call"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-seven-home"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="call"]\')');await finishScene('chapter-seven-primary');
    await until(qslPhase('PLAYER_CLARIFICATION_CALL'));
    assert.deepEqual((await saved()).storyContinuationState.chapter07.activeRun,interrupted);
    await click('[data-action="qsl-story-settings"]');await until('document.querySelector(".settings-modal")');
    const paused=await saved();
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(300);
    assert.equal(await evaluate('Number(document.querySelector(".qsl-story-screen").dataset.pulseCount)'),0);
    assert.deepEqual((await saved()).storyContinuationState.chapter07,paused.storyContinuationState.chapter07);
    await click('.settings-modal header .icon-button');
    const clarification=await evaluate('document.querySelector(".qsl-story-message > code").textContent');
    await sendText(clarification,options);
    await until(qslPhase('SORA_CLARIFICATION_REPLY'));
    await click('[data-action="qsl-story-receive"]');await until(qslPhase('PLAYER_FINAL_CHOICE'));
    await click('[data-action="qsl-story-recovery-qrs"]');
    await sendText('QRS K',options);
    await until(qslPhase('SORA_CLARIFICATION_REPLY'));
    assert.equal((await saved()).storyContinuationState.chapter07.activeRun.replyWpm,13);
    await click('[data-action="qsl-story-receive"]');await until(qslPhase('PLAYER_FINAL_CHOICE'));
    await screenshot('58-chapter-seven-final-choice');
    await click('[data-qsl-choice="defer"]');await until(qslPhase('COMPLETED'));
    const finished=(await saved()).storyContinuationState.chapter07.activeRun;
    assert.equal(finished.initialChoice,'request-review');assert.equal(finished.finalChoice,'defer');
    assert.deepEqual(finished.recoveryActions,['QRS']);
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-seven-home"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="call"]\')');await finishScene('chapter-seven-primary');
    await until(qslPhase('COMPLETED'));
    assert.deepEqual((await saved()).storyContinuationState.chapter07.activeRun,finished);
    await click('[data-action="qsl-story-settle"]');
    await until('document.querySelector(".qsl-story-screen")?.dataset.settled==="true"');
    const settled=await saved(),chapter=settled.storyContinuationState.chapter07;
    const qslCase=chapter.cases.find(item=>item.runId===finished.runId);
    assert(qslCase);
    const contact=settled.qsoLogs.find(item=>item.id===qslCase.qsoId);
    assert(contact&&contact.eventKind==='qsl-story');
    assert.equal(settled.money,baseline.money);
    assert.equal(settled.technologyPoints,baseline.technologyPoints);
    assert.equal(settled.qsoLogs.length,baseline.qsoLogs.length+1);
    assert.deepEqual(settled.qslRecords,baseline.qslRecords);
    assert.equal(await evaluate('document.querySelector(\'[data-action="qsl-story-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-seven"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="answer"][data-story-choice="defer"]\')');
    await screenshot('59-chapter-seven-answer');
    await finishScene('chapter-seven-primary');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const record=await evaluate('document.querySelector(\'[data-testid="chapter-seven-real-log"]\').innerText');
    assert(record.includes(source.id)&&record.includes('请求进一步复核')&&record.includes('暂不判断'));
    await screenshot('60-chapter-seven-log');await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-seven-home"]');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-seven-primary');
    await until('document.querySelector(\'[data-story-chapter="7"][data-story-status="claimed"]\')');
    const claimed=await saved();
    const achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0);
    const achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+750+achievementMoney);
    assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+3+achievementPoints);
    assert(claimed.storyContinuationState.chapter07.peopleTaskTreeUnlocked);
    assert.deepEqual(claimed.qslRecords,baseline.qslRecords);
    assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-07').length,1);
    await screenshot('61-chapter-seven-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-seven-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-seven-home"]\')'),false);
    assert(await evaluate('!!document.querySelector(\'[data-action="enter-qsl-story-home"]\')'));
    await click('[data-action="open-missions"]');
    await until('document.querySelector(\'[data-mission-id="story-08"][data-mission-status="available"]\')');
    await screenshot('62-chapter-eight-unlocked');
    await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);
    assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    chapterSevenEvidence={passed:true,sourceQslId:source.id,runId:finished.runId,qsoId:contact.id,initialChoice:'request-review',finalChoice:'defer',choicePreserved:true,keyEventInput:true,localRulesFallback:true,invalidCaseRetry:true,openingReload:true,activeRunResume:true,completedUnsettledReload:true,endingReload:true,settingsBlock:true,leaveDialogBlock:true,mobileLayout:true,recovery:'QRS',replyWpm:finished.replyWpm,investigationMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,peopleTaskTreeUnlocked:true,chapterEightUnlocked:true,duplicateReward:false};
  }


  let chapterEightEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_EIGHT === '1' || process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1') {
    console.log('CHAPTER_EIGHT_START');
    await click('[data-action="enter-chapter-eight-home"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="briefing"]\')');
    const baseline=await saved();
    assert(baseline.missionState.activeMissions.some(mission=>mission.id==='story-08'));
    await screenshot('63-chapter-eight-briefing');
    await finishScene('chapter-eight-primary');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="queue"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-eight-home"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="queue"]\')');
    await finishScene('chapter-eight-primary');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="checkin"]\')');
    await click('[data-action="vn-notes"]');
    const notes=await evaluate('document.querySelector(".vn-modal").innerText');
    assert(notes.includes('数字越小')&&notes.includes('离开确认框'));
    await screenshot('64-chapter-eight-instructions');await click('.vn-modal header button');
    await finishScene('chapter-eight-primary');
    const netPhase=phase=>'document.querySelector(".service-net-screen")?.dataset.serviceNetPhase==='+JSON.stringify(phase);
    await until(netPhase('BRIEFING'));await call('Page.bringToFront');
    await click('[data-action="service-net-begin"]');await until(netPhase('CHECK_IN'));
    const options={surface:'.service-net-screen',submit:'[data-action="service-net-submit"]'};
    await sendText('BH1QA CHECK IN K',options);await until(netPhase('RECEIVE_MESSAGE'));
    const schedule=(await saved()).storyContinuationState.chapter08.activeRun;
    await click('[data-action="service-net-receive"]');await until(netPhase('PLAYER_ACK'));
    let current=schedule.messages[schedule.priorityOrder[0]];
    await sendText('ACK '+current.messageId+' PRI '+(current.priority%3+1)+' K',options);
    await until('document.querySelector(".service-net-error")?.innerText.includes("优先级不匹配")');
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-eight"]\')'),false);
    await screenshot('65-chapter-eight-invalid-priority');
    await click('[data-action="service-net-settings"]');await until('document.querySelector(".settings-modal")');
    await pause(150);
    const settingsRun=(await saved()).storyContinuationState.chapter08.activeRun;
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
    assert.equal(await evaluate('Number(document.querySelector(".service-net-screen").dataset.pulseCount)'),0);
    assert.deepEqual((await saved()).storyContinuationState.chapter08.activeRun,settingsRun);
    await click('.settings-modal header .icon-button');
    await click('.service-net-topbar > button:last-child');await until('document.querySelector(".service-net-leave-dialog")');
    await pause(150);
    const interrupted=(await saved()).storyContinuationState.chapter08.activeRun;
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
    assert.equal(await evaluate('Number(document.querySelector(".service-net-screen").dataset.pulseCount)'),0);
    assert.deepEqual((await saved()).storyContinuationState.chapter08.activeRun,interrupted);
    await click('[data-action="service-net-confirm-leave"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="checkin"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-eight-home"]');
    assert.deepEqual((await saved()).storyContinuationState.chapter08.activeRun,interrupted);
    await finishScene('chapter-eight-primary');await until(netPhase('PLAYER_ACK'));await call('Page.bringToFront');
    const resumed=(await saved()).storyContinuationState.chapter08.activeRun;
    assert.equal(resumed.runId,schedule.runId);assert.deepEqual(resumed.messages,schedule.messages);
    assert.equal(resumed.currentMessageErrors,1);assert(resumed.elapsedMilliseconds>=interrupted.elapsedMilliseconds);
    await sendText('QRS K',options);await until(netPhase('RECEIVE_MESSAGE'));
    assert.equal((await saved()).storyContinuationState.chapter08.activeRun.replyWpm,13);
    for(let index=0;index<3;index++){
      await click('[data-action="service-net-receive"]');await until(netPhase('PLAYER_ACK'));
      const run=(await saved()).storyContinuationState.chapter08.activeRun;
      const message=run.messages[run.priorityOrder[run.currentPosition]];
      assert.equal(run.currentPosition,index);
      await sendText('ACK '+message.messageId+' PRI '+message.priority+' K',options);
      await until(netPhase(index===2?'COMPLETED':'RECEIVE_MESSAGE'));
    }
    const finished=(await saved()).storyContinuationState.chapter08.activeRun;
    assert.equal(finished.receipts.length,3);assert.equal(finished.errors.length,1);
    assert.deepEqual(finished.recoveryActions,['QRS']);assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('66-chapter-eight-unsettled');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-eight-home"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="checkin"]\')');
    await finishScene('chapter-eight-primary');await until(netPhase('COMPLETED'));
    assert.deepEqual((await saved()).storyContinuationState.chapter08.activeRun,finished);
    await click('[data-action="service-net-settle"]');
    await until('document.querySelector(".service-net-screen")?.dataset.settled==="true"');
    const settled=await saved(),chapter=settled.storyContinuationState.chapter08;
    const receipts=chapter.receipts.filter(item=>item.runId===finished.runId);
    assert.equal(receipts.length,3);
    const contact=settled.qsoLogs.find(item=>item.id===receipts[0].qsoId);
    assert(contact&&contact.eventKind==='service-net');
    assert.equal(settled.money,baseline.money);assert.equal(settled.technologyPoints,baseline.technologyPoints);
    assert.equal(settled.qsoLogs.length,baseline.qsoLogs.length+1);
    assert.equal(await evaluate('document.querySelector(\'[data-action="service-net-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-eight"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="receipts"]\')');
    await screenshot('67-chapter-eight-receipts');await finishScene('chapter-eight-primary');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const record=await evaluate('document.querySelector(\'[data-testid="chapter-eight-real-log"]\').innerText');
    assert(record.includes('SIM8PS')&&record.includes('不代表物资已送达'));
    for(const receipt of receipts)assert(record.includes('#'+receipt.messageId)&&record.includes('PRI '+receipt.priority));
    await screenshot('68-chapter-eight-log');await click('.vn-modal header button');
    const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-eight-home"]');
    await until('document.querySelector(\'[data-story-chapter="8"][data-story-beat="log"]\')');
    assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-eight-primary');await until('document.querySelector(\'[data-story-chapter="8"][data-story-status="claimed"]\')');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+850+achievementMoney);
    assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+4+achievementPoints);
    assert(claimed.storyContinuationState.chapter08.taskTreeUnlocked);
    assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-08').length,1);
    await screenshot('69-chapter-eight-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-eight-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-eight-home"]\')'),false);
    assert(await evaluate('!!document.querySelector(\'[data-action="enter-service-net-home"]\')'));
    await click('[data-action="open-missions"]');await until('document.querySelector(\'[data-mission-id="story-09"][data-mission-status="available"]\')');
    await screenshot('70-chapter-nine-unlocked');await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    chapterEightEvidence={passed:true,runId:finished.runId,qsoId:contact.id,receipts,keyEventInput:true,localRulesFallback:true,invalidPriorityRetry:true,openingReload:true,activeRunResume:true,completedUnsettledReload:true,endingReload:true,settingsFreeze:true,leaveDialogFreeze:true,recovery:'QRS',replyWpm:finished.replyWpm,exerciseMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,taskTreeUnlocked:true,chapterNineUnlocked:true,duplicateReward:false};
    console.log('CHAPTER_EIGHT_PASSED',JSON.stringify(chapterEightEvidence));
  }


  let chapterNineEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_NINE === '1' || process.env.CWGAME_QA_CHAPTER_TEN === '1' || process.env.CWGAME_QA_CHAPTER_ELEVEN === '1' || process.env.CWGAME_QA_CHAPTER_TWELVE === '1') {
    console.log('CHAPTER_NINE_START');
    await click('[data-action="enter-chapter-nine-home"]');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="sheet"]\')');
    const baseline=await saved();assert(baseline.missionState.activeMissions.some(mission=>mission.id==='story-09'));
    await screenshot('71-chapter-nine-sheet');await finishScene('chapter-nine-primary');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="fields"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-nine-home"]');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="fields"]\')');await finishScene('chapter-nine-primary');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="readback"]\')');
    await click('[data-action="vn-notes"]');
    assert((await evaluate('document.querySelector(".vn-modal").innerText')).includes('重新核对'));
    await screenshot('72-chapter-nine-instructions');await click('.vn-modal header button');await finishScene('chapter-nine-primary');
    const relayPhase=phase=>'document.querySelector(".coordinate-relay-screen")?.dataset.coordinatePhase==='+JSON.stringify(phase);
    await until(relayPhase('BRIEFING'));await call('Page.bringToFront');
    await click('[data-action="coordinate-begin"]');await until(relayPhase('RECEIVE_PACKET'));
    await click('[data-action="coordinate-receive"]');await until(relayPhase('PLAYER_READBACK'));
    const options={surface:'.coordinate-relay-screen',submit:'[data-action="coordinate-submit"]'};
    const original=(await saved()).storyContinuationState.chapter09.activeRun;
    const packetText=await evaluate('document.querySelector(".coordinate-relay-packet > code").textContent');
    const wrong=packetText.replace(/CHECK \d{2}/,'CHECK '+String((original.packet.check+1)%97).padStart(2,'0'));
    await sendText(wrong,options);await until(relayPhase('FIELD_CORRECTION'));
    assert.equal((await saved()).storyContinuationState.chapter09.activeRun.lastError,'CHECK_MISMATCH');
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-nine"]\')'),false);
    await screenshot('73-chapter-nine-invalid-check');
    await click('[data-action="coordinate-receive"]');await until(relayPhase('PLAYER_READBACK'));
    await sendText(packetText,options);await until(relayPhase('RELAY_PACKET'));
    assert((await saved()).storyContinuationState.chapter09.activeRun.readbackCompletedAt);
    await click('[data-action="coordinate-settings"]');await until('document.querySelector(".settings-modal")');await pause(150);
    const settingsRun=(await saved()).storyContinuationState.chapter09.activeRun;
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
    assert.equal(await evaluate('Number(document.querySelector(".coordinate-relay-screen").dataset.pulseCount)'),0);
    assert.deepEqual((await saved()).storyContinuationState.chapter09.activeRun,settingsRun);
    await click('.settings-modal header .icon-button');
    await click('.coordinate-relay-topbar > button:last-child');await until('document.querySelector(".coordinate-relay-leave-dialog")');await pause(150);
    const interrupted=(await saved()).storyContinuationState.chapter09.activeRun;
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
    assert.equal(await evaluate('Number(document.querySelector(".coordinate-relay-screen").dataset.pulseCount)'),0);
    assert.deepEqual((await saved()).storyContinuationState.chapter09.activeRun,interrupted);
    await click('[data-action="coordinate-confirm-leave"]');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="readback"]\')');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-nine-home"]');
    assert.deepEqual((await saved()).storyContinuationState.chapter09.activeRun,interrupted);
    await finishScene('chapter-nine-primary');await until(relayPhase('RELAY_PACKET'));await call('Page.bringToFront');
    await sendText('QRS K',options);await until(relayPhase('RECEIVE_PACKET'));
    const recovered=(await saved()).storyContinuationState.chapter09.activeRun;
    assert.equal(recovered.runId,original.runId);assert.deepEqual(recovered.packet,original.packet);
    assert.equal(recovered.replyWpm,13);assert.equal(recovered.readbackCompletedAt,null);assert.equal(recovered.relaySentAt,null);
    await screenshot('74-chapter-nine-relay-recovery');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-nine-home"]');await finishScene('chapter-nine-primary');
    await until(relayPhase('RECEIVE_PACKET'));await call('Page.bringToFront');
    assert.deepEqual((await saved()).storyContinuationState.chapter09.activeRun.packet,original.packet);
    assert.equal((await saved()).storyContinuationState.chapter09.activeRun.retryCount,0);
    await click('[data-action="coordinate-receive"]');await until(relayPhase('PLAYER_READBACK'));
    await sendText(packetText,options);await until(relayPhase('RELAY_PACKET'));
    await sendText(packetText,options);await until(relayPhase('RELAY_CONFIRMATION'));
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await click('[data-action="coordinate-confirm"]');await until(relayPhase('COMPLETED'));
    const finished=(await saved()).storyContinuationState.chapter09.activeRun;
    assert(finished.elapsedMilliseconds>0);assert.equal(finished.attempts.length,1);assert.deepEqual(finished.recoveryActions,['QRS']);
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-nine-home"]');await finishScene('chapter-nine-primary');
    await until(relayPhase('COMPLETED'));
    assert.deepEqual((await saved()).storyContinuationState.chapter09.activeRun,finished);
    await click('[data-action="coordinate-settle"]');await until('document.querySelector(".coordinate-relay-screen")?.dataset.settled==="true"');
    const settled=await saved(),record=settled.storyContinuationState.chapter09.packets.find(item=>item.runId===finished.runId);
    assert(record);assert.deepEqual(record.packet,original.packet);
    const source=settled.qsoLogs.find(log=>log.id===record.sourceQsoId),relay=settled.qsoLogs.find(log=>log.id===record.relayQsoId);
    assert(source&&source.callsign==='SIM9CR'&&relay&&relay.callsign==='SIM9RL');
    assert.equal(settled.qsoLogs.length,baseline.qsoLogs.length+2);assert.equal(settled.money,baseline.money);
    assert.equal(settled.technologyPoints,baseline.technologyPoints);
    assert.equal(await evaluate('document.querySelector(\'[data-action="coordinate-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-nine"]');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="confirmed"]\')');
    await screenshot('75-chapter-nine-confirmed');await finishScene('chapter-nine-primary');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="log"]\')');await click('[data-action="vn-notes"]');
    const logText=await evaluate('document.querySelector(\'[data-testid="chapter-nine-real-log"]\').innerText');
    for(const fact of [source.callsign,relay.callsign,record.packet.grid,record.packet.utc,record.packet.packetId,record.id])assert(logText.includes(fact));
    await screenshot('76-chapter-nine-log');await click('.vn-modal header button');const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-nine-home"]');
    await until('document.querySelector(\'[data-story-chapter="9"][data-story-beat="log"]\')');assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-nine-primary');await until('document.querySelector(\'[data-story-chapter="9"][data-story-status="claimed"]\')');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+950+achievementMoney);assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+4+achievementPoints);
    assert(claimed.storyContinuationState.chapter09.toolUnlocked);
    assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-09').length,1);
    await screenshot('77-chapter-nine-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-nine-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-nine-home"]\')'),false);
    assert(await evaluate('!!document.querySelector(\'[data-action="enter-coordinate-relay-home"]\')'));
    await click('[data-action="open-structured-messages"]');await until('document.querySelector(\'[data-testid="structured-message-log"]\')');
    const toolText=await evaluate('document.querySelector(".structured-message-modal").innerText');
    assert(toolText.includes(record.packet.grid)&&toolText.includes(record.packet.packetId));
    await screenshot('78-chapter-nine-unlocked-tool');await click('.structured-message-modal header .icon-button');
    await click('[data-action="open-missions"]');await until('document.querySelector(\'[data-mission-id="story-10"][data-mission-status="available"]\')');
    await screenshot('79-chapter-ten-unlocked');await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    chapterNineEvidence={passed:true,runId:finished.runId,sourceQsoId:source.id,relayQsoId:relay.id,packetRecord:record,keyEventInput:true,localRulesFallback:true,invalidCheckRetry:true,openingReload:true,relayStageResume:true,relayRecoveryReload:true,completedUnsettledReload:true,endingReload:true,settingsFreeze:true,leaveDialogFreeze:true,activeElapsedMilliseconds:finished.elapsedMilliseconds,recovery:'QRS',replyWpm:finished.replyWpm,relayMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,toolUnlocked:true,chapterTenUnlocked:true,duplicateReward:false};
    console.log('CHAPTER_NINE_PASSED',JSON.stringify(chapterNineEvidence));
  }


  let chapterTenEvidence=null;
  if(process.env.CWGAME_QA_CHAPTER_TEN==='1'||process.env.CWGAME_QA_CHAPTER_ELEVEN==='1'||process.env.CWGAME_QA_CHAPTER_TWELVE==='1'){
    console.log('CHAPTER_TEN_START');
    await click('[data-action="enter-chapter-ten-home"]');
    await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="clock"]\')');
    const baseline=await saved();assert(baseline.missionState.activeMissions.some(m=>m.id==='story-10'));
    await screenshot('80-chapter-ten-clock');await finishScene('chapter-ten-primary');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-ten-home"]');
    await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="modes"]\')');await finishScene('chapter-ten-primary');
    await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="exchange"]\')');
    await click('[data-action="vn-notes"]');await screenshot('81-chapter-ten-instructions');await click('.vn-modal header button');
    // Use the normal settings controls, not a saved-state edit, for this timed keying test.
    await click('.chapter-one-review-settings');await until('document.querySelector(".settings-modal")');
    for(let speed=(await saved()).automaticKeyWpm;speed<30;speed++)await click('[aria-label="Increase WPM"]');
    for(let speed=(await saved()).automaticKeyWpm;speed>30;speed--)await click('[aria-label="Decrease WPM"]');
    await click('.settings-modal footer .primary-button');await until('!document.querySelector(".settings-modal")');
    assert.equal((await saved()).automaticKeyWpm,30);
    await finishScene('chapter-ten-primary');
    const contestPhase=phase=>'document.querySelector(".contest-screen")?.dataset.contestPhase==='+JSON.stringify(phase);
    await until(contestPhase('BRIEFING'));await call('Page.bringToFront');
    const options={surface:'.contest-screen',submit:'[data-action="contest-submit"]'};
    const initial=(await saved()).storyContinuationState.chapter10.activeRun;
    let firstCall;
    for(let index=0;index<6;index++){
      const mode=index<2?'run':'sp';
      await click('[data-action="contest-mode-'+mode+'"]');
      if(mode==='run'){
        await until(contestPhase('RUN_CQ'));
        await sendText(await evaluate('document.querySelector(".contest-run-cq > code").textContent'),options);
        await until(contestPhase('RUN_PILEUP'));
      }else await until(contestPhase('SP_POOL'));
      if(index===1){
        await sendText(firstCall,options);
        assert.equal((await saved()).storyContinuationState.chapter10.activeRun.duplicateAttempts,1);
        assert.equal((await saved()).storyContinuationState.chapter10.activeRun.contacts.length,1);
        await screenshot('82-chapter-ten-duplicate-rejected');
      }
      const callsign=await evaluate('document.querySelector("[data-contest-candidate]").dataset.contestCandidate');
      if(index===0)firstCall=callsign;
      await sendText(callsign,options);await until(contestPhase('EXCHANGE'));
      const exchange=await evaluate('document.querySelector(".contest-exchange > code").textContent');
      if(index===0){
        await sendText(exchange.replace('NR 001','NR 002'),options);
        let active=(await saved()).storyContinuationState.chapter10.activeRun;
        assert.equal(active.errors.at(-1),'SERIAL_MISMATCH');assert.equal(active.nextSerial,1);assert.equal(active.contacts.length,0);
        await sendText('QRS K',options);
        active=(await saved()).storyContinuationState.chapter10.activeRun;
        assert.equal(active.replyWpm,19);assert.equal(active.selectedStation.callsign,callsign);assert.equal(active.nextSerial,1);
        await click('[data-action="contest-settings"]');await until('document.querySelector(".settings-modal")');await pause(150);
        const settingsRun=(await saved()).storyContinuationState.chapter10.activeRun;
        await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
        await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
        assert.equal(await evaluate('Number(document.querySelector(".contest-screen").dataset.pulseCount)'),0);
        assert.deepEqual((await saved()).storyContinuationState.chapter10.activeRun,settingsRun);
        await click('.settings-modal header .icon-button');
        await click('.contest-topbar > button:last-child');await until('document.querySelector(".contest-leave-dialog")');await pause(150);
        const interrupted=(await saved()).storyContinuationState.chapter10.activeRun;
        await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
        await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1300);
        assert.equal(await evaluate('Number(document.querySelector(".contest-screen").dataset.pulseCount)'),0);
        assert.deepEqual((await saved()).storyContinuationState.chapter10.activeRun,interrupted);
        await click('[data-action="contest-confirm-leave"]');
        await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-ten-home"]');
        assert.deepEqual((await saved()).storyContinuationState.chapter10.activeRun,interrupted);
        await finishScene('chapter-ten-primary');await until(contestPhase('EXCHANGE'));await call('Page.bringToFront');
        assert.equal(await evaluate('document.querySelector(".contest-exchange > code").textContent'),exchange);
        await screenshot('83-chapter-ten-resumed-exchange');
      }
      await sendText(exchange,options);await until(contestPhase('MODE_SELECT'));
      const current=(await saved()).storyContinuationState.chapter10.activeRun;
      assert.equal(current.contacts.length,index+1);assert.equal(current.nextSerial,index+2);
      assert.equal(current.runId,initial.runId);assert.deepEqual(current.stationPool,initial.stationPool);
      assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
      console.log('CHAPTER_TEN_CONTACT',index+1,current.elapsedMilliseconds,current.contacts.at(-1).regionCode);
    }
    await click('[data-action="contest-finish"]');await until(contestPhase('COMPLETED'));
    const finished=(await saved()).storyContinuationState.chapter10.activeRun;
    assert(finished.elapsedMilliseconds>0&&finished.elapsedMilliseconds<300000);
    assert.equal(finished.repeatRequests,1);assert.equal(finished.duplicateAttempts,1);assert.equal(finished.exchangeErrors,1);
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-ten-home"]');await finishScene('chapter-ten-primary');
    await until(contestPhase('COMPLETED'));assert.deepEqual((await saved()).storyContinuationState.chapter10.activeRun,finished);
    await screenshot('84-chapter-ten-completed-unsettled');
    await click('[data-action="contest-settle"]');await until('document.querySelector(".contest-screen")?.dataset.settled==="true"');
    const settled=await saved(),record=settled.storyContinuationState.chapter10.records.find(r=>r.runId===finished.runId);
    assert(record);assert.equal(record.validContacts,6);assert.equal(record.runContacts,2);assert.equal(record.spContacts,4);assert(record.uniqueRegions>=3);
    assert.equal(settled.qsoLogs.length,baseline.qsoLogs.length+6);assert.equal(settled.money,baseline.money);assert.equal(settled.technologyPoints,baseline.technologyPoints);
    assert(record.contactQsoIds.every(id=>settled.qsoLogs.some(log=>log.id===id&&log.eventRunId===record.runId)&&settled.qsoRecords.settledQsoIds.includes(id)));
    assert.equal(await evaluate('document.querySelector(\'[data-action="contest-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-ten"]');await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="result"]\')');
    assert((await evaluate('document.querySelector(".vn-line").getAttribute("aria-label")')).includes(String(record.score)));
    await screenshot('85-chapter-ten-result');await finishScene('chapter-ten-primary');
    await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="log"]\')');
    await click('[data-action="vn-notes"]');
    const logText=await evaluate('document.querySelector(\'[data-testid="chapter-ten-real-log"]\').innerText');
    for(const value of [record.id,String(record.score),...record.contacts.map(c=>c.callsign)])assert(logText.includes(value));
    await screenshot('86-chapter-ten-log');await click('.vn-modal header button');const beforeClaim=await saved();
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-ten-home"]');
    await until('document.querySelector(\'[data-story-chapter="10"][data-story-beat="log"]\')');assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-ten-primary');await until('document.querySelector(\'[data-story-chapter="10"][data-story-status="claimed"]\')');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+1100+achievementMoney);assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+5+achievementPoints);
    assert(claimed.storyContinuationState.chapter10.taskTreeUnlocked);assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-10').length,1);
    await screenshot('87-chapter-ten-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-ten-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-ten-home"]\')'),false);
    assert(await evaluate('!!document.querySelector(\'[data-action="enter-contest-home"]\')'));
    await click('[data-action="open-missions"]');await until('document.querySelector(\'[data-mission-id="story-11"][data-mission-status="available"]\')');
    await screenshot('88-chapter-eleven-unlocked');await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    chapterTenEvidence={passed:true,record,keyEventInput:true,keyerWpm:30,localRulesFallback:true,invalidSerialRetry:true,duplicateRejected:true,openingReload:true,exchangeResume:true,completedUnsettledReload:true,endingReload:true,settingsFreeze:true,leaveDialogFreeze:true,elapsedMilliseconds:finished.elapsedMilliseconds,recovery:'QRS',replyWpm:finished.replyWpm,contestMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,replayUnlocked:true,chapterElevenUnlocked:true,duplicateReward:false};
    console.log('CHAPTER_TEN_PASSED',JSON.stringify(chapterTenEvidence));
  }


  let chapterElevenEvidence=null;
  if(process.env.CWGAME_QA_CHAPTER_ELEVEN==='1'||process.env.CWGAME_QA_CHAPTER_TWELVE==='1'){
    console.log('CHAPTER_ELEVEN_START');
    const storyBeat=beat=>'document.querySelector(\'[data-story-chapter="11"][data-story-beat="'+beat+'"]\')';
    const listeningPhase=phase=>'document.querySelector(".listening-screen")?.dataset.listeningPhase==='+JSON.stringify(phase);
    const reopen=async()=>{await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-eleven-home"]');};
    const activeRun=async()=>(await saved()).storyContinuationState.chapter11.activeRun;
    const options={surface:'.listening-screen',submit:'[data-action="listening-submit"]'};
    const blockedKey=async()=>{
      await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
      await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(4300);
      assert.equal(await evaluate('Number(document.querySelector(".listening-screen").dataset.pulseCount)'),0);
    };
    await click('[data-action="enter-chapter-eleven-home"]');await until(storyBeat('quiet'));
    const baseline=await saved();assert(baseline.missionState.activeMissions.some(m=>m.id==='story-11'));
    await screenshot('89-chapter-eleven-quiet');await finishScene('chapter-eleven-primary');
    await reopen();await until(storyBeat('windows'));await finishScene('chapter-eleven-primary');await until(storyBeat('call'));
    await click('[data-action="vn-notes"]');await screenshot('90-chapter-eleven-instructions');await click('.vn-modal header button');
    await finishScene('chapter-eleven-primary');await until(listeningPhase('BRIEFING'));await call('Page.bringToFront');
    await click('[data-action="listening-observe"]');await click('[data-action="listening-observe"]');
    const partial=await activeRun();assert.equal(partial.observedWindowIds.length,2);
    await reopen();await finishScene('chapter-eleven-primary');await until(listeningPhase('LISTENING'));await call('Page.bringToFront');
    assert.equal((await activeRun()).runId,partial.runId);assert.deepEqual((await activeRun()).observedWindowIds,partial.observedWindowIds);
    await click('[data-action="listening-observe"]');await until(listeningPhase('CALL_READY'));
    const message=await evaluate('document.querySelector(".listening-keyer code").textContent');
    await sendText(message.replace('SIM11LS','SIM12SR'),options);await until(listeningPhase('CALL_READY'));
    assert.equal((await activeRun()).callCount,0);assert((await activeRun()).errors.length>0);
    assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('91-chapter-eleven-invalid-target');
    await sendText(message,options);await until(listeningPhase('WAITING'));
    await click('[data-action="listening-settings"]');await until('document.querySelector(".settings-modal")');await pause(150);
    const settingsRun=await activeRun();assert.equal(settingsRun.callCount,1);assert.equal(settingsRun.phase,'WAITING');
    await blockedKey();assert.deepEqual(await activeRun(),settingsRun);
    assert.equal(await evaluate('document.querySelector(".listening-screen").dataset.listeningPaused'),'true');
    await screenshot('92-chapter-eleven-settings-paused');
    await click('.settings-modal header .icon-button');await until(listeningPhase('WAITING'));await until(listeningPhase('DECISION'));
    await click('[data-action="listening-call-again"]');await sendText(message,options);await until(listeningPhase('WAITING'));
    assert.equal((await activeRun()).callCount,2);assert.equal((await activeRun()).lastWaitCompletedAt,null);
    await click('[data-action="listening-back"]');await until('document.querySelector(".listening-leave-dialog")');await pause(150);
    const interrupted=await activeRun();await blockedKey();assert.deepEqual(await activeRun(),interrupted);
    await screenshot('93-chapter-eleven-leave-paused');await click('[data-action="listening-confirm-leave"]');await until(storyBeat('call'));
    await reopen();assert.deepEqual(await activeRun(),interrupted);await finishScene('chapter-eleven-primary');
    await until(listeningPhase('WAITING'));await call('Page.bringToFront');await until(listeningPhase('DECISION'));
    assert.equal((await activeRun()).callCount,2);assert.equal(await evaluate('!!document.querySelector(\'[data-action="listening-call-again"]\')'),false);
    await screenshot('94-chapter-eleven-final-decision');await click('[data-action="listening-record-silence"]');await until(listeningPhase('COMPLETED'));
    const finished=await activeRun();assert(finished.activeMilliseconds>0);assert.equal(finished.summary.callCount,2);
    await reopen();await finishScene('chapter-eleven-primary');await until(listeningPhase('COMPLETED'));
    assert.deepEqual(await activeRun(),finished);assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('95-chapter-eleven-completed-unsettled');await click('[data-action="listening-settle"]');
    await until('document.querySelector(".listening-screen")?.dataset.settled==="true"');
    const settled=await saved(),chapter=settled.storyContinuationState.chapter11,record=chapter.archive.find(r=>r.runId===finished.runId);
    assert(record);assert.equal(record.callCount,2);assert.equal(record.observationIds.length,3);
    assert(chapter.settledRunIds.includes(record.runId));assert(chapter.completedRuns.some(r=>r.runId===record.runId));
    assert(chapter.settlementProofs.some(p=>p.runId===record.runId&&p.recordId===record.id));
    for(const key of ['money','technologyPoints','qsoLogs','qsoRecords','operatorRelationships'])assert.deepEqual(settled[key],baseline[key]);
    assert.equal(await evaluate('document.querySelector(\'[data-action="listening-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-eleven"]');await until(storyBeat('silence'));
    const line=await evaluate('document.querySelector(".vn-line").getAttribute("aria-label")');assert(line.includes('2'));assert(line.includes(String(Math.ceil(record.activeMilliseconds/1000))));
    await screenshot('96-chapter-eleven-silence');await finishScene('chapter-eleven-primary');await until(storyBeat('log'));
    await click('[data-action="vn-notes"]');const logText=await evaluate('document.querySelector(\'[data-testid="chapter-eleven-real-log"]\').innerText');
    for(const value of [record.id,'SIM11LS','本次未收到回应'])assert(logText.includes(value));
    assert(!logText.includes('RST'));await screenshot('97-chapter-eleven-log');await click('.vn-modal header button');
    const beforeClaim=await saved();await reopen();await until(storyBeat('log'));assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-eleven-primary');await until('document.querySelector(\'[data-story-chapter="11"][data-story-status="claimed"]\')');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+1200+achievementMoney);assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+5+achievementPoints);
    assert(claimed.storyContinuationState.chapter11.taskTreeUnlocked);assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-11').length,1);
    await screenshot('98-chapter-eleven-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-eleven-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-eleven-home"]\')'),false);
    await click('[data-action="open-missions"]');await until('document.querySelector(\'[data-mission-id="story-12"][data-mission-status="available"]\')');
    await screenshot('99-chapter-twelve-unlocked');await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    await click('[data-action="enter-listening-home"]');await until(listeningPhase('BRIEFING'));await call('Page.bringToFront');
    for(let n=0;n<3;n++)await click('[data-action="listening-observe"]');
    await until(listeningPhase('CALL_READY'));await sendText(message,options);await until(listeningPhase('DECISION'));
    await click('[data-action="listening-record-silence"]');await until(listeningPhase('COMPLETED'));await click('[data-action="listening-settle"]');
    await until('document.querySelector(".listening-screen")?.dataset.settled==="true"');
    const replay=await saved(),replayRecord=replay.storyContinuationState.chapter11.archive.at(-1);
    assert.notEqual(replayRecord.id,record.id);assert.equal(replayRecord.callCount,1);assert.equal(replay.storyContinuationState.chapter11.archive.length,chapter.archive.length+1);
    for(const key of ['money','technologyPoints','qsoLogs','qsoRecords','operatorRelationships'])assert.deepEqual(replay[key],claimed[key]);
    assert.equal(replay.chapterElevenPresentation.recordId,record.id);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-eleven"]\')'),false);
    await screenshot('100-chapter-eleven-replay-saved');await click('[data-action="listening-back"]');await until('document.querySelector(".home-screen")');
    chapterElevenEvidence={passed:true,record,replayRecord,keyEventInput:true,keyerWpm:30,localRulesFallback:true,invalidTargetRetry:true,openingReload:true,observationReload:true,secondCallWaitingReload:true,completedUnsettledReload:true,endingReload:true,settingsFreeze:true,leaveDialogFreeze:true,waitRestartsOnResume:true,replyGenerated:false,newQsoCount:0,newRelationshipCount:0,monitoringMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,replaySettled:true,originalRecordPinned:true,chapterTwelveUnlocked:true,duplicateReward:false};
    console.log('CHAPTER_ELEVEN_PASSED',JSON.stringify(chapterElevenEvidence));
  }


  let chapterTwelveEvidence=null;
  if(process.env.CWGAME_QA_CHAPTER_TWELVE==='1'){
    console.log('CHAPTER_TWELVE_START');
    const storyBeat=beat=>'document.querySelector(\'[data-story-chapter="12"][data-story-beat="'+beat+'"]\')';
    const stormPhase=phase=>'document.querySelector(".storm-relay-screen")?.dataset.stormPhase==='+JSON.stringify(phase);
    const reopen=async()=>{await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-twelve-home"]');};
    const activeRun=async()=>(await saved()).storyContinuationState.chapter12.activeRun;
    const options={surface:'.storm-relay-screen',submit:'[data-action="storm-submit"]'};
    const target=()=>evaluate('document.querySelector(".storm-relay-keyer code").textContent');
    const blockedKey=async()=>{
      await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ'});await pause(180);
      await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ'});await pause(1600);
      assert.equal(await evaluate('Number(document.querySelector(".storm-relay-screen").dataset.pulseCount)'),0);
    };
    await click('[data-action="enter-chapter-twelve-home"]');await until(storyBeat('rain'));
    const baseline=await saved();assert(baseline.missionState.activeMissions.some(m=>m.id==='story-12'));
    await screenshot('101-chapter-twelve-rain');await finishScene('chapter-twelve-primary');
    await reopen();await until(storyBeat('copies'));await finishScene('chapter-twelve-primary');await until(storyBeat('verify'));
    await click('[data-action="vn-notes"]');await screenshot('102-chapter-twelve-instructions');await click('.vn-modal header button');
    await finishScene('chapter-twelve-primary');await until(stormPhase('CHECK_IN'));await call('Page.bringToFront');
    assert.equal(await evaluate('document.querySelectorAll("[data-packet-id]").length'),0);
    await sendText(await target(),options);await until(stormPhase('RECEIVING'));
    assert.equal(await evaluate('document.querySelectorAll("[data-packet-id]").length'),0);
    await click('[data-action="storm-receive-conflict"]');await until(stormPhase('CONFLICT'));
    assert.equal(await evaluate('document.querySelectorAll("[data-packet-id]").length'),2);
    assert.equal(await evaluate('!!document.querySelector(\'[data-packet-id="storm-214-r2"]\')'),false);
    const partial=await activeRun();await screenshot('103-chapter-twelve-conflicting-copies');
    await reopen();await finishScene('chapter-twelve-primary');await until(stormPhase('CONFLICT'));await call('Page.bringToFront');
    assert.equal((await activeRun()).runId,partial.runId);
    await sendText('QRS MSG 214 K',options);assert.deepEqual((await activeRun()).recoveryActions,['QRS']);
    await sendText('AGN MSG 215 REV K',options);assert.equal((await activeRun()).phase,'CONFLICT');
    assert.equal((await activeRun()).errors.at(-1),'MESSAGE_ID_MISMATCH');
    await click('[data-action="storm-settings"]');await until('document.querySelector(".settings-modal")');await pause(150);
    const settingsRun=await activeRun();await blockedKey();assert.deepEqual(await activeRun(),settingsRun);
    assert.equal(await evaluate('document.querySelector(".storm-relay-screen").dataset.stormPaused'),'true');
    await screenshot('104-chapter-twelve-settings-paused');await click('.settings-modal header .icon-button');
    await sendText(await target(),options);await until(stormPhase('RELAY'));
    assert.equal(await evaluate('document.querySelectorAll("[data-packet-id]").length'),3);
    assert.equal(await evaluate('document.querySelector(\'[data-packet-id="storm-214-r2"]\').dataset.authoritative'),'true');
    const packet=await target();
    await click('[data-action="storm-back"]');await until('document.querySelector(".storm-relay-leave-dialog")');await pause(150);
    const interrupted=await activeRun();await blockedKey();assert.deepEqual(await activeRun(),interrupted);
    await screenshot('105-chapter-twelve-leave-paused');await click('[data-action="storm-confirm-leave"]');await until(storyBeat('verify'));
    await reopen();assert.deepEqual(await activeRun(),interrupted);await finishScene('chapter-twelve-primary');
    await until(stormPhase('RELAY'));await call('Page.bringToFront');assert.equal(await target(),packet);
    await sendText(packet.replace('QTY 6','QTY 4'),options);assert.equal((await activeRun()).badRelayCount,1);
    assert.equal((await activeRun()).errors.at(-1),'QUANTITY_MISMATCH');assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('106-chapter-twelve-rejected-quantity');await sendText(packet,options);await until(stormPhase('COMPLETED'));
    const finished=await activeRun();assert(finished.activeMilliseconds>0);
    await reopen();await finishScene('chapter-twelve-primary');await until(stormPhase('COMPLETED'));
    assert.deepEqual(await activeRun(),finished);assert.equal((await saved()).qsoLogs.length,baseline.qsoLogs.length);
    await screenshot('107-chapter-twelve-completed-unsettled');await click('[data-action="storm-settle"]');
    await until('document.querySelector(".storm-relay-screen")?.dataset.settled==="true"');
    const settled=await saved(),chapter=settled.storyContinuationState.chapter12,record=chapter.archive.find(r=>r.runId===finished.runId);
    assert(record);assert.equal(record.revision,2);assert.equal(record.people,8);assert.equal(record.quantity,6);assert.equal(record.check,'13');
    assert(chapter.settledRunIds.includes(record.runId));assert(chapter.completedRuns.some(r=>r.runId===record.runId));
    assert(chapter.settlementProofs.some(p=>p.runId===record.runId&&p.recordId===record.id));
    const contacts=record.qsoIds.map(id=>settled.qsoLogs.find(q=>q.id===id));assert(contacts.every(q=>q.eventKind==='storm-relay'&&q.eventRunId===record.runId&&q.credits===0&&q.isFictional));
    assert.equal(settled.qsoRecords.total,baseline.qsoRecords.total+2);assert.equal(settled.money,baseline.money);assert.equal(settled.technologyPoints,baseline.technologyPoints);
    assert.equal(await evaluate('document.querySelector(\'[data-action="storm-settle"]\').disabled'),true);
    await click('[data-action="continue-chapter-twelve"]');await until(storyBeat('relayed'));
    const line=await evaluate('document.querySelector(".vn-line").getAttribute("aria-label")');for(const value of ['214','PX-31','WATER','13'])assert(line.includes(value));
    await screenshot('108-chapter-twelve-relayed');await finishScene('chapter-twelve-primary');await until(storyBeat('log'));
    await click('[data-action="vn-notes"]');const logText=await evaluate('document.querySelector(\'[data-testid="chapter-twelve-real-log"]\').innerText');
    for(const value of [record.id,'SIM12CS','SIM12RL','不代表物资已经送达'])assert(logText.includes(value));
    await screenshot('109-chapter-twelve-log');await click('.vn-modal header button');
    const beforeClaim=await saved();await reopen();await until(storyBeat('log'));assert.equal((await saved()).money,beforeClaim.money);
    await finishScene('chapter-twelve-primary');await until('document.querySelector(\'[data-story-chapter="12"][data-story-status="claimed"]\')');
    const claimed=await saved(),achievementIds=claimed.claimedAchievementRewards.filter(id=>!beforeClaim.claimedAchievementRewards.includes(id));
    const achievements=ACHIEVEMENT_CATALOG.filter(item=>achievementIds.includes(item.id));
    const achievementMoney=achievements.reduce((sum,item)=>sum+item.moneyReward,0),achievementPoints=achievements.reduce((sum,item)=>sum+item.technologyPointsReward,0);
    assert.equal(claimed.money,beforeClaim.money+1350+achievementMoney);assert.equal(claimed.technologyPoints,beforeClaim.technologyPoints+6+achievementPoints);
    assert(claimed.storyContinuationState.chapter12.taskTreeUnlocked);assert.equal(claimed.missionState.claimedMissionIds.filter(id=>id==='story-12').length,1);
    await screenshot('110-chapter-twelve-claimed');
    for(let n=0;n<10&&await evaluate('!!document.querySelector(".achievement-notification > button")');n++){await click('.achievement-notification > button');await pause(120);}
    await click('[data-action="chapter-twelve-primary"]');await until('document.querySelector(".home-screen")');
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="enter-chapter-twelve-home"]\')'),false);
    await click('[data-action="open-missions"]');await until('document.querySelector(\'[data-mission-id="story-13"][data-mission-status="available"]\')');
    await screenshot('111-chapter-thirteen-unlocked');await click('.mission-center-modal header .icon-button');
    await navigate('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,claimed.money);assert.equal((await saved()).technologyPoints,claimed.technologyPoints);
    await click('[data-action="enter-storm-relay-home"]');await until(stormPhase('CHECK_IN'));await call('Page.bringToFront');
    await sendText(await target(),options);await until(stormPhase('RECEIVING'));await click('[data-action="storm-receive-conflict"]');await until(stormPhase('CONFLICT'));
    await sendText(await target(),options);await until(stormPhase('RELAY'));await sendText(await target(),options);await until(stormPhase('COMPLETED'));
    await click('[data-action="storm-settle"]');await until('document.querySelector(".storm-relay-screen")?.dataset.settled==="true"');
    const replay=await saved(),replayRecord=replay.storyContinuationState.chapter12.archive.at(-1);
    assert.notEqual(replayRecord.id,record.id);assert.equal(replay.storyContinuationState.chapter12.archive.length,chapter.archive.length+1);
    assert.equal(replay.money,claimed.money);assert.equal(replay.technologyPoints,claimed.technologyPoints);assert.equal(replay.qsoRecords.total,claimed.qsoRecords.total+2);
    assert.equal(replay.chapterTwelvePresentation.recordId,record.id);
    assert.equal(await evaluate('!!document.querySelector(\'[data-action="continue-chapter-twelve"]\')'),false);
    await screenshot('112-chapter-twelve-replay-saved');await click('[data-action="storm-back"]');await until('document.querySelector(".home-screen")');
    chapterTwelveEvidence={passed:true,record,replayRecord,keyEventInput:true,keyerWpm:30,localRulesFallback:true,packetRevealByPhase:true,invalidRevisionRequestRetry:true,invalidQuantityRetry:true,recoveryAction:'QRS',openingReload:true,conflictReload:true,verifiedPacketReload:true,completedUnsettledReload:true,endingReload:true,settingsFreeze:true,leaveDialogFreeze:true,newQsoCount:2,settlementMoney:0,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:claimed.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:claimed.technologyPoints,achievementIds,achievementMoney,achievementPoints,replaySettled:true,originalRecordPinned:true,chapterThirteenUnlocked:true,duplicateReward:false};
    console.log('CHAPTER_TWELVE_PASSED',JSON.stringify(chapterTwelveEvidence));
  }

  const finalMoney=(await saved()).money;

  await navigate('Page.navigate',{url:new URL('?review=chapter-1',baseUrl).href});
  await until(`document.querySelector('[data-review-beat="silence"]')`);
  assert.equal((await saved()).money,finalMoney);
  await screenshot('10-review-preserved');
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  await writeFile(path.join(output,'evidence.json'),JSON.stringify({passed:true,profile,baseUrl,fixtureWpm,recordedAt:new Date().toISOString(),actual:{id:actual.id,callsign:actual.callsign,sent:actual.sent,received:actual.received},moneyBeforeClaim:qsoSaved.money,moneyAfterClaim:claimed.money,keyEventInput:true,qaCapture:true,audioPlaybackSkipped:true,invalidInputRetry:true,settingsPause:true,artDialogFocus:true,mobileLayout:true,chapterTwoUnlocked:true,chapterTwo:chapterTwoEvidence,chapterThree:chapterThreeEvidence,chapterFour:chapterFourEvidence,chapterFive:chapterFiveEvidence,chapterSix:chapterSixEvidence,chapterSeven:chapterSevenEvidence,chapterEight:chapterEightEvidence,chapterNine:chapterNineEvidence,chapterTen:chapterTenEvidence,chapterEleven:chapterElevenEvidence,chapterTwelve:chapterTwelveEvidence,qaClockUtc:qaClockEpoch===null?null:new Date(qaClockEpoch).toISOString(),bookmarkReload:true,endingReload:true,duplicateReward:false,reviewPreserved:true,exceptions},null,2));
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
  if (path.dirname(resolvedProfile) !== tempRoot || !path.basename(resolvedProfile).startsWith('cw-chapter-one-live-')) {
    throw new Error('Refusing to remove a profile outside the QA temp directory');
  }
  await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 })
    .catch(error => console.warn('QA profile cleanup failed:', error.message));
}

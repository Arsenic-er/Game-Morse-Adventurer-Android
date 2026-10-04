// Browser smoke test. Run on the development server; start preview on port 4176.
// Set CWGAME_QA_CHAPTER_TWO=1 to continue through Chapter Two.
// CWGAME_QA_CHAPTER_THREE=1 includes both prerequisites and continues through Chapter Three.
// CWGAME_QA_CHAPTER_FOUR=1 includes Chapters One–Three; CWGAME_QA_UTC controls only the test clock.
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
    if(r.method==='Runtime.exceptionThrown')exceptions.push(r.params);
    if(r.id&&pending.has(r.id)){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(new Error(JSON.stringify(r.error))):p.resolve(r.result);}
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async expression=>{
    const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;
  };
  const until=async(expression,timeout=20000)=>{
    const end=Date.now()+timeout;
    while(Date.now()<end){if(await evaluate(`Boolean(${expression})`))return;await pause(100);}
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
  const sendText=async text=>{
    console.log(`KEYING ${text}`);
    const words=text.trim().toUpperCase().split(/\s+/);
    const wpm=await evaluate(`Number(document.querySelector('.station-screen')?.dataset.keyerWpm)`);
    assert(Number.isFinite(wpm) && wpm >= 5 && wpm <= 40, 'live station keyer speed is available');
    const steps=words.flatMap((word,wi)=>[...word].map((char,ci)=>({pattern:MORSE_CODE[char],separator:ci<word.length-1?'character':wi<words.length-1?'word':null})));
    assert(steps.every(step=>step.pattern), 'QA message contains only supported Morse characters');
    await evaluate(`(async()=>{
      const pause=ms=>new Promise(r=>setTimeout(r,ms));
      const dotMs=1200/${JSON.stringify(wpm)};
      for(const {pattern,separator} of ${JSON.stringify(steps)}){
          const symbols=pattern;
          const station=()=>document.querySelector('.station-screen');
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
          await waitUntil(()=>Boolean(document.querySelector('[data-action="submit-reply"]:not([disabled])')));
          if(separator==='character'){
            // Match the packaged QA helper: timer overshoot must not create a word boundary.
            const started=performance.now();
            while(performance.now()-started<dotMs*2){}
          }
          if(separator==='word')await pause(dotMs*6);
      }
    })()`);
    const decoded=await evaluate(`document.querySelector('.station-screen').dataset.decoded.trim().replace(/\s+/g,' ')`);
    assert.equal(decoded,words.join(' '),'physical key events decoded correctly');
    await click('[data-action="submit-reply"]');
  };
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const fixture=createSave({callsign:'BH1QA',keyType:'automatic',automaticKeyWpm:fixtureWpm});
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`if(${JSON.stringify(qaClockEpoch)}!==null){const NativeDate=Date;const now=()=>${JSON.stringify(qaClockEpoch)}+NativeDate.now()-${JSON.stringify(qaClockWallStart)};function QaDate(...args){if(!new.target)return new NativeDate(now()).toString();return new NativeDate(...(args.length?args:[now()]));}Object.setPrototypeOf(QaDate,NativeDate);QaDate.prototype=NativeDate.prototype;QaDate.now=now;window.Date=QaDate;}window.cwgameSystem={qaCapture:true};if(!localStorage.getItem(${JSON.stringify(SAVE_STORAGE_KEY)})){localStorage.setItem(${JSON.stringify(SAVE_STORAGE_KEY)},${JSON.stringify(JSON.stringify([fixture]))});localStorage.setItem(${JSON.stringify(ACTIVE_SAVE_KEY)},${JSON.stringify(fixture.id)});localStorage.setItem('game-morse-adventurer.language.v1','zh-CN');}`});
  await call('Page.navigate',{url:baseUrl});
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
  await call('Page.reload');
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
  await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-one-home"]');
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
  await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');
  assert.equal((await saved()).money,claimed.money);

  let chapterTwoEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_TWO === '1' || process.env.CWGAME_QA_CHAPTER_THREE === '1' || process.env.CWGAME_QA_CHAPTER_FOUR === '1') {
    await click('[data-action="enter-chapter-two-home"]');
    await until('document.querySelector(\'[data-story-chapter="2"][data-story-beat="paper"]\')');
    assert.equal((await saved()).missionState.activeMissions.find(m => m.id === 'story-02')?.id,'story-02');
    await screenshot('11-chapter-two-paper');
    await finishScene('chapter-two-primary');
    await until('document.querySelector(\'[data-story-beat="margin"]\')');
    await screenshot('12-chapter-two-margin');
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-two-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-two-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterTwoEvidence={passed:true,actual:{id:actualTwo.id,callsign:actualTwo.callsign,sent:actualTwo.sent,received:actualTwo.received},successfulAgn:true,missionMoneyReward:220,achievementMoneyReward:100,newAchievements,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,openingReload:true,endingReload:true,settingsPause:true,mobileLayout:true,chapterThreeUnlocked:true,duplicateReward:false};
  }

  let chapterThreeEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_THREE === '1' || process.env.CWGAME_QA_CHAPTER_FOUR === '1') {
    await click('[data-action="enter-chapter-three-home"]');
    await until('document.querySelector(\'[data-story-chapter="3"][data-story-beat="listen"]\')');
    const baseline = await saved();
    assert.equal(baseline.missionState.activeMissions.find(m=>m.id==='story-03')?.id,'story-03');
    await screenshot('20-chapter-three-listen');
    await finishScene('chapter-three-primary');
    await until('document.querySelector(\'[data-story-beat="notes"]\')');
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
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
        await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-three-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterThreeEvidence={passed:true,actualContacts:actualContacts.map(({id,callsign,operatorProfileId,sent,received})=>({id,callsign,operatorProfileId,sent,received})),uniqueStyles:[...byStyle.keys()],duplicateStylesObserved:actualContacts.length>byStyle.size,openingReload:true,partialReload:true,endingReload:true,settingsPause:true,mobileLayout:true,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,chapterFourUnlocked:true,duplicateReward:false};
  }


  let chapterFourEvidence = null;
  if (process.env.CWGAME_QA_CHAPTER_FOUR === '1') {
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-four-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');await click('[data-action="enter-chapter-four-home"]');
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
    await call('Page.reload');await click('.menu-primary');await click('.save-primary-action');
    assert.equal((await saved()).money,afterClaim.money);
    assert.equal((await saved()).technologyPoints,afterClaim.technologyPoints);
    chapterFourEvidence={passed:true,actual:{id:actualFour.id,callsign:actualFour.callsign,sent:actualFour.sent,received:actualFour.received,finalPropagationLevel:actualFour.finalPropagationLevel,optionalExchangeQuestion:actualFour.optionalExchangeQuestion,optionalExchangeOutcome:actualFour.optionalExchangeOutcome},recoveryCommand,replyWpmBefore,replyWpmAfter,lightningEvidence,optionalAnswerRedacted:true,openingReload:true,endingReload:true,settingsPause:true,mobileLayout:true,moneyBeforeClaim:beforeClaim.money,moneyAfterClaim:afterClaim.money,technologyPointsBeforeClaim:beforeClaim.technologyPoints,technologyPointsAfterClaim:afterClaim.technologyPoints,chapterFiveUnlocked:true,nameRevealedOnlyAfterClaim:true,duplicateReward:false};
  }

  const finalMoney=(await saved()).money;

  await call('Page.navigate',{url:new URL('?review=chapter-1',baseUrl).href});
  await until(`document.querySelector('[data-review-beat="silence"]')`);
  assert.equal((await saved()).money,finalMoney);
  await screenshot('10-review-preserved');
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  await writeFile(path.join(output,'evidence.json'),JSON.stringify({passed:true,profile,baseUrl,fixtureWpm,recordedAt:new Date().toISOString(),actual:{id:actual.id,callsign:actual.callsign,sent:actual.sent,received:actual.received},moneyBeforeClaim:qsoSaved.money,moneyAfterClaim:claimed.money,keyEventInput:true,qaCapture:true,audioPlaybackSkipped:true,invalidInputRetry:true,settingsPause:true,artDialogFocus:true,mobileLayout:true,chapterTwoUnlocked:true,chapterTwo:chapterTwoEvidence,chapterThree:chapterThreeEvidence,chapterFour:chapterFourEvidence,qaClockUtc:qaClockEpoch===null?null:new Date(qaClockEpoch).toISOString(),bookmarkReload:true,endingReload:true,duplicateReward:false,reviewPreserved:true,exceptions},null,2));
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

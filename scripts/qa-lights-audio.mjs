// Server-only focused renderer test: fresh empty save, direct practice console, real CW audio.
// No mission completion, contact, result, reward or qaCapture bypass is injected.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { MORSE_CODE } from '../src/cw/morse.js';

const output=path.resolve(process.env.CWGAME_QA_OUTPUT || 'qa-artifacts-lights-audio');
const chromePath=process.env.CWGAME_QA_CHROME;
assert(chromePath,'Set CWGAME_QA_CHROME to the existing server browser');
const profile=path.join(os.tmpdir(),'cw-lights-audio-'+Date.now());
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const harness=[
  'import React from "react";',
  'import { createRoot } from "react-dom/client";',
  'import { LightsEventScreen } from "/src/screens/LightsEventScreen.jsx";',
  'import { createSave } from "/src/game/saveStore.js";',
  'import "/src/styles.css";',
  'window.cwgameSystem={qaCapture:false};',
  'window.__lightsAudioStarts=[];',
  'const start=OscillatorNode.prototype.start;',
  'OscillatorNode.prototype.start=function(...args){window.__lightsAudioStarts.push(performance.now());return start.apply(this,args)};',
  'const save=createSave({callsign:"BH1QA",keyType:"automatic",automaticKeyWpm:22});',
  'function Harness(){const [blocked,setBlocked]=React.useState(false);return React.createElement(React.Fragment,null,',
  'React.createElement(LightsEventScreen,{language:"zh-CN",mode:"practice",save,inputBlocked:blocked,onSettings:()=>setBlocked(true),onBack:()=>{},onSettle:()=>{throw new Error("Audio probe must not settle")}}),',
  'blocked?React.createElement("div",{style:{position:"fixed",inset:0,zIndex:999,background:"#111e"}},React.createElement("button",{"data-action":"resume-probe",onClick:()=>setBlocked(false)},"Resume")):null)}',
  'createRoot(document.getElementById("root")).render(React.createElement(Harness));',
].join('\n');
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:4177,strictPort:true},plugins:[react(),{
  name:'isolated-lights-audio-probe',
  resolveId(id){if(id==='/__qa/lights-audio.js')return '\0lights-audio-probe';},
  load(id){if(id==='\0lights-audio-probe')return harness;},
  configureServer(vite){vite.middlewares.use(async (req,res,next)=>{
    if(req.url!=='/__qa/lights-audio.html')return next();
    res.setHeader('Content-Type','text/html');
    try { res.end(await vite.transformIndexHtml(req.url,'<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="/__qa/lights-audio.js"></script></body></html>')); } catch(error) { next(error); }
  });},
}]});
let chrome, socket;
const exceptions=[];
await mkdir(output,{recursive:true});
try{
  await server.listen();
  chrome=spawn(chromePath,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  let launchError, stderr='';
  chrome.on('error',error=>{launchError=error});
  chrome.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-4000)});
  let port;
  for(let n=0;n<80;n++){
    if(launchError)throw launchError;
    if(chrome.exitCode!==null)throw new Error(stderr);
    try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break}catch{await pause(250)}
  }
  assert(port);
  const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  socket=new WebSocket(tabs.find(tab=>tab.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
  let serial=0;const pending=new Map();
  socket.addEventListener('message',({data})=>{const result=JSON.parse(data);
    if(result.method==='Runtime.exceptionThrown')exceptions.push(result.params);
    if(result.id&&pending.has(result.id)){const item=pending.get(result.id);pending.delete(result.id);result.error?item.reject(new Error(JSON.stringify(result.error))):item.resolve(result.result);}
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value};
  const until=async(expression,timeout=65000)=>{const end=Date.now()+timeout;while(Date.now()<end){if(await evaluate('Boolean('+expression+')'))return;await pause(80)}throw new Error('Timeout: '+expression+'; '+await evaluate('document.body.innerText.slice(-1000)'))};
  const click=async selector=>{
    await until('document.querySelector('+JSON.stringify(selector)+')');
    const point=await evaluate('(()=>{const node=document.querySelector('+JSON.stringify(selector)+');node.scrollIntoView({block:"center"});const r=node.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
    for(const type of ['mousePressed','mouseReleased'])await call('Input.dispatchMouseEvent',{type,...point,button:'left',clickCount:1});
  };
  const phase=()=>evaluate('document.querySelector(".lights-event-screen")?.dataset.eventPhase');
  const send=async text=>{
    const words=text.split(' ');
    const steps=words.flatMap((word,wi)=>[...word].map((char,ci)=>({pattern:MORSE_CODE[char],separator:ci<word.length-1?'character':wi<words.length-1?'word':null})));
    await evaluate('(async()=>{const pause=ms=>new Promise(r=>setTimeout(r,ms)),dotMs=1200/22;const surface=()=>document.querySelector(".lights-event-screen");const wait=predicate=>new Promise((resolve,reject)=>{const start=performance.now();const timer=setInterval(()=>{if(predicate()){clearInterval(timer);resolve()}else if(performance.now()-start>5000){clearInterval(timer);reject(new Error("keyer not idle"))}},10)});for(const step of '+JSON.stringify(steps)+'){const before=Number(surface().dataset.pulseCount);for(const symbol of step.pattern){const key=symbol==="."?"z":"x",code="Key"+key.toUpperCase();window.dispatchEvent(new KeyboardEvent("keydown",{key,code,bubbles:true,cancelable:true}));const start=performance.now();while(performance.now()-start<dotMs*.12){}window.dispatchEvent(new KeyboardEvent("keyup",{key,code,bubbles:true,cancelable:true}))}await wait(()=>Number(surface().dataset.pulseCount)>=before+step.pattern.length);await wait(()=>!!document.querySelector(\'[data-action="lights-transmit"]:not([disabled])\'));if(step.separator==="character"){const start=performance.now();while(performance.now()-start<dotMs*2){}}if(step.separator==="word")await pause(dotMs*6)}})()');
    assert.equal(await evaluate('document.querySelector(".lights-event-screen").dataset.decoded.trim().replace(/\\s+/g," ")'),text);
    await click('[data-action="lights-transmit"]');
  };
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:'http://127.0.0.1:4177/__qa/lights-audio.html'});
  await call('Page.bringToFront');
  await until('document.querySelector(".lights-event-screen")?.dataset.eventPhase==="CONTROL_CQ"');
  assert.equal(await evaluate('window.cwgameSystem.qaCapture'),false);
  await send('CQ LGT CQ LGT DE SIM5LT K');
  await until('document.querySelector(".lights-event-receiver.playing")',10000);
  await pause(500);
  assert.equal(await phase(),'CONTROL_PILEUP');
  await click('[data-action="lights-settings"]');
  await until('document.querySelector(\'[data-action="resume-probe"]\')&&!document.querySelector(".lights-event-receiver.playing")');
  const remaining=await evaluate('document.querySelector(".lights-event-meter > div:first-child strong").textContent');
  const startsBeforeResume=await evaluate('window.__lightsAudioStarts.length');
  await pause(1300);
  assert.equal(await evaluate('document.querySelector(".lights-event-meter > div:first-child strong").textContent'),remaining);
  assert.equal(await phase(),'CONTROL_PILEUP');
  const resumedAt=Date.now();
  await click('[data-action="resume-probe"]');
  await until('document.querySelector(".lights-event-receiver.playing")',10000);
  await until('document.querySelector(".lights-event-screen")?.dataset.eventPhase==="CONTROL_SELECTION"');
  const receiveMs=Date.now()-resumedAt;
  assert(receiveMs>1000,'real receive spans multiple 250 ms timer updates');
  assert(await evaluate('window.__lightsAudioStarts.length')>startsBeforeResume);
  await send('AGN K');
  await until('document.querySelector(".lights-event-receiver.playing")',10000);
  await until('document.querySelector(".lights-event-screen")?.dataset.eventPhase==="CONTROL_SELECTION"');
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  const capture=await call('Page.captureScreenshot',{format:'png'});
  await writeFile(path.join(output,'real-pileup-received.png'),Buffer.from(capture.data,'base64'));
  const evidence={passed:true,recordedAt:new Date().toISOString(),freshEmptySave:true,directPracticeHarness:true,qaCapture:false,realAudioEngine:true,receiveMs,settingsPausedTimer:true,resumedReceive:true,agnReplayed:true,noSettlement:true,humanListening:false,exceptions};
  await writeFile(path.join(output,'evidence.json'),JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence));
}catch(error){
  await writeFile(path.join(output,'evidence.json'),JSON.stringify({passed:false,error:String(error),exceptions},null,2));console.error(error);process.exitCode=1;
}finally{
  socket?.close();chrome?.kill();await server.close();await pause(1000);
  if(path.dirname(path.resolve(profile))!==path.resolve(os.tmpdir())||!path.basename(profile).startsWith('cw-lights-audio-'))throw new Error('Unsafe QA profile path');
  await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:500});
}

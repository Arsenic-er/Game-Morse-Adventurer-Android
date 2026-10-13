import {reviewFinalPromise,receiveFinalPromiseAccount,chooseFinalPromiseTone,finalPromiseCallText} from "../src/game/finalPromiseRun.js";
import {claimMission} from "../src/game/missionSystem.js";
// Layout-only seeded fixture. Not evidence of playing or completing Chapter Fourteen.
// Run against the same server preview as qa-chapter-one-story.mjs.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { accepted, completed, newRun, submit, withRun } from "../test/helpers/chapterFourteenFixtures.js";
import { advanceChapterFourteenPresentation } from "../src/game/chapterFourteenStory.js";
import { SAVE_STORAGE_KEY, ACTIVE_SAVE_KEY } from "../src/game/saveStore.js";
const root=path.resolve(process.env.CWGAME_QA_OUTPUT||"qa-final-promise-layout");
const profile=path.join(os.tmpdir(),"cw-final-promise-layout-"+Date.now());
const baseUrl=process.env.CWGAME_QA_URL||"http://127.0.0.1:4176/";
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
await mkdir(root,{recursive:true});
const chrome=spawn(process.env.CWGAME_QA_CHROME,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=0","--user-data-dir="+profile,"about:blank"],{stdio:["ignore","ignore","pipe"]});
let socket,stderr="",launchError;
chrome.stderr.on("data",data=>{stderr=(stderr+data).slice(-4000);});
chrome.on("error",error=>{launchError=error;});
const evidence={passed:false,chapter:14,recordedAt:new Date().toISOString(),layoutOnly:true,seededFixture:true,baseUrl,viewports:[],exceptions:[]};
try{
  let port;
  for(let i=0;i<80;i++){
    if(launchError)throw launchError;
    try{port=(await readFile(path.join(profile,"DevToolsActivePort"),"utf8")).split("\n")[0];break;}catch{await pause(250);}
  }
  assert(port,stderr);
  const tabs=await(await fetch("http://127.0.0.1:"+port+"/json/list")).json();
  socket=new WebSocket(tabs.find(tab=>tab.type==="page").webSocketDebuggerUrl);
  await new Promise(resolve=>socket.addEventListener("open",resolve,{once:true}));
  let serial=0;const pending=new Map();
  socket.addEventListener("message",({data})=>{
    const result=JSON.parse(data);
    if(result.method==="Page.javascriptDialogOpening"&&result.params.type==="beforeunload")void call("Page.handleJavaScriptDialog",{accept:true});
    if(result.method==="Runtime.exceptionThrown")evidence.exceptions.push(result.params);
    if(result.id&&pending.has(result.id)){
      const action=pending.get(result.id);pending.delete(result.id);
      result.error?action.reject(Error(JSON.stringify(result.error))):action.resolve(result.result);
    }
  });
  socket.addEventListener("close",()=>{for(const action of pending.values())action.reject(Error("QA browser connection closed"));pending.clear();});
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++serial;const timer=setTimeout(()=>{pending.delete(id);reject(Error("QA protocol timeout: "+method));},20000);
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
    const result=await call("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const until=async expression=>{
    for(let n=0;n<160;n++){
      try{if(await evaluate(expression))return;}catch(error){if(!/Inspected target navigated or closed|Execution context was destroyed|Cannot find context/.test(String(error)))throw error;}
      await pause(100);
    }
    throw Error("Timeout "+expression+"; UI: "+await evaluate("document.body.innerText.slice(-1800)"));
  };
  const click=async selector=>{
    await until("!!document.querySelector("+JSON.stringify(selector)+")");
    const point=await evaluate("(()=>{const node=document.querySelector("+JSON.stringify(selector)+");node.scrollIntoView({block:'center'});const r=node.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()");
    for(const type of ["mousePressed","mouseReleased"])await call("Input.dispatchMouseEvent",{type,...point,button:"left",clickCount:1});
  };
  await call("Page.enable");await call("Runtime.enable");
  let fixture=advanceChapterFourteenPresentation(advanceChapterFourteenPresentation(await accepted(),"review").save,"call").save;
  let run=reviewFinalPromise(newRun(fixture));run=await submit(run,finalPromiseCallText(run));run=chooseFinalPromiseTone(receiveFinalPromiseAccount(run,"2026-10-04T22:02:00.000Z"),"warm");
  fixture={...withRun(fixture,run),automaticKeyWpm:30,keyType:"automatic"};
  await call("Page.addScriptToEvaluateOnNewDocument",{source:"window.cwgameSystem={qaCapture:true};if(!localStorage.getItem("+JSON.stringify(SAVE_STORAGE_KEY)+")){localStorage.setItem("+JSON.stringify(SAVE_STORAGE_KEY)+","+JSON.stringify(JSON.stringify([fixture]))+");localStorage.setItem("+JSON.stringify(ACTIVE_SAVE_KEY)+","+JSON.stringify(fixture.id)+");localStorage.setItem('game-morse-adventurer.language.v1','zh-CN');}"});
  await navigate("Page.navigate",{url:baseUrl});
  await until("!!document.querySelector('.menu-primary')");
  for (const language of ["zh-CN","zh-TW","en","ja","es","de","ru"]) {
  console.log("LAYOUT_LANGUAGE",language);
  await evaluate("localStorage.setItem("+JSON.stringify(SAVE_STORAGE_KEY)+","+JSON.stringify(JSON.stringify([fixture]))+")");
  await evaluate("localStorage.setItem('game-morse-adventurer.language.v1',"+JSON.stringify(language)+")");
  await navigate("Page.reload");
  await call("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await click(".menu-primary");await click(".save-primary-action");await click('[data-action="enter-chapter-fourteen-home"]');
  await until("!!document.querySelector('.chapter-fourteen-story-screen')");
  const finish=async()=>{
    for(let n=0;n<8;n++){if(await evaluate("document.querySelector('.vn-dialogue').dataset.vnReady==='true'"))break;await click(".vn-line");await pause(80);}
    await click('[data-action="chapter-fourteen-primary"]');
  };
  for(const [width,height] of [[1440,900],[390,844]]){
    await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<500});
    await pause(500);
    const result=await evaluate("({screen:'vn',width:innerWidth,scrollWidth:document.documentElement.scrollWidth})");
    result.language=language;
    evidence.viewports.push(result);assert(result.scrollWidth<=width+1,JSON.stringify(result));
  }
  await finish();await until("!!document.querySelector('.final-promise-screen')");
  await until('document.querySelector(".final-promise-screen")?.dataset.finalPromisePhase==="FINAL_MESSAGE"');
  for(const [width,height] of [[1440,900],[390,844]]){
    await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<500});
    await pause(500);
    const result=await evaluate("({screen:'activity',width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:Array.from(document.querySelectorAll('.final-promise-screen *')).filter(el=>el.getBoundingClientRect().right>innerWidth+1).map(el=>({tag:el.tagName,className:el.className,right:el.getBoundingClientRect().right})).slice(0,10)})");
    result.language=language;
    evidence.viewports.push(result);
    const capture=await call("Page.captureScreenshot",{format:"png"});
    await writeFile(path.join(root,"final-promise-activity-"+language+"-"+width+".png"),Buffer.from(capture.data,"base64"));
    assert(result.scrollWidth<=width+1,JSON.stringify(result));
    assert.equal(result.overflow.length,0,JSON.stringify(result));
  }
  }
  // Seeded, layout-only replay hit testing: verify a real mouse click reaches final-promise, not adjacent replay entries.
  const claimedFixture=claimMission(await completed(),"story-14","2026-10-04T23:00:00.000Z").save;
  for(const language of ["zh-CN","zh-TW","en","ja","es","de","ru"]){
    await evaluate("localStorage.setItem("+JSON.stringify(SAVE_STORAGE_KEY)+","+JSON.stringify(JSON.stringify([claimedFixture]))+");localStorage.setItem("+JSON.stringify(ACTIVE_SAVE_KEY)+","+JSON.stringify(claimedFixture.id)+");localStorage.setItem('game-morse-adventurer.language.v1',"+JSON.stringify(language)+")");
    await call("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await navigate("Page.reload");await click(".menu-primary");await click(".save-primary-action");
    for(const [width,height] of [[1440,900],[390,844]]){
      await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<500});await pause(300);
      await until("!!document.querySelector('[data-action=enter-final-promise-home]') && !!document.querySelector('[data-action=enter-night-operations-home]')");
      const result=await evaluate("(()=>{const node=document.querySelector('[data-action=enter-final-promise-home]'),other=document.querySelector('[data-action=enter-night-operations-home]'),r=node.getBoundingClientRect(),o=other.getBoundingClientRect();return {screen:'home-replay',width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overlap:Math.max(r.left,o.left)<Math.min(r.right,o.right)&&Math.max(r.top,o.top)<Math.min(r.bottom,o.bottom),hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')?.dataset.action};})()");
      result.language=language;evidence.viewports.push(result);
      assert(result.scrollWidth<=width+1,JSON.stringify(result));assert.equal(result.overlap,false,JSON.stringify(result));assert.equal(result.hit,"enter-final-promise-home",JSON.stringify(result));
      const capture=await call("Page.captureScreenshot",{format:"png"});
      await writeFile(path.join(root,"final-promise-home-"+language+"-"+width+".png"),Buffer.from(capture.data,"base64"));
      await click('[data-action="enter-final-promise-home"]');await until('document.querySelector(".final-promise-screen")?.dataset.finalPromisePhase==="REVIEW"');
      await click('[data-action="final-promise-back"]');await click('[data-action="final-promise-confirm-leave"]');await until('!!document.querySelector(".home-screen")');
    }
  }
  assert.equal(evidence.exceptions.length,0);
  evidence.passed=true;
}catch(error){evidence.error=String(error);process.exitCode=1;}
finally{
  await writeFile(path.join(root,"evidence.json"),JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence));
  socket?.close();chrome.kill();await pause(1000);
  const resolved=path.resolve(profile);
  if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith("cw-final-promise-layout-"))throw Error("Unsafe QA profile path");
  await rm(resolved,{recursive:true,force:true,maxRetries:5,retryDelay:500});
}

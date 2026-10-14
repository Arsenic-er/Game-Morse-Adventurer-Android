import {settleFirstPage} from "../src/game/firstPageSettlement.js";
import {claimMission} from "../src/game/missionSystem.js";
// Layout-only seeded fixture. Not evidence of playing or completing Chapter Fifteen.
// Run against the same server preview as qa-chapter-one-story.mjs.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {accepted,completed,withQso} from "../test/helpers/chapterFifteenFixtures.js";
import {OPEN_STATION_GOALS} from "../src/game/openStationState.js";
import { SAVE_STORAGE_KEY, ACTIVE_SAVE_KEY } from "../src/game/saveStore.js";
const root=path.resolve(process.env.CWGAME_QA_OUTPUT||"qa-first-page-layout");
const profile=path.join(os.tmpdir(),"cw-first-page-layout-"+Date.now());
const baseUrl=process.env.CWGAME_QA_URL||"http://127.0.0.1:4176/";
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
await mkdir(root,{recursive:true});
const chrome=spawn(process.env.CWGAME_QA_CHROME,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=0","--user-data-dir="+profile,"about:blank"],{stdio:["ignore","ignore","pipe"]});
let socket,stderr="",launchError;
chrome.stderr.on("data",data=>{stderr=(stderr+data).slice(-4000);});
chrome.on("error",error=>{launchError=error;});
const evidence={passed:false,chapter:15,recordedAt:new Date().toISOString(),layoutOnly:true,seededFixture:true,baseUrl,viewports:[],exceptions:[]};
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
  await call("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  const base=await accepted(),choice=withQso(base),ending=await completed(choice),claimed=claimMission(ending,"story-15","2026-10-04T23:06:00.000Z").save;
  await call("Page.addScriptToEvaluateOnNewDocument",{source:"window.cwgameSystem={qaCapture:true};"});
  await navigate("Page.navigate",{url:baseUrl});
  const loadFixture=async(fixture,language,width,height)=>{
    await call("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate("localStorage.setItem("+JSON.stringify(SAVE_STORAGE_KEY)+","+JSON.stringify(JSON.stringify([fixture]))+");localStorage.setItem("+JSON.stringify(ACTIVE_SAVE_KEY)+","+JSON.stringify(fixture.id)+");localStorage.setItem('game-morse-adventurer.language.v1',"+JSON.stringify(language)+")");
    await navigate("Page.reload");await click(".menu-primary");await click(".save-primary-action");await until('!!document.querySelector(".home-screen")');
    await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:false});await pause(300);
  };
  const measure=async(screen,language,width,height)=>{
    const result=await evaluate("({screen:"+JSON.stringify(screen)+",width:innerWidth,scrollWidth:document.documentElement.scrollWidth})");
    result.language=language;result.height=height;evidence.viewports.push(result);assert(result.scrollWidth<=width+1,JSON.stringify(result));
    const capture=await call("Page.captureScreenshot",{format:"png"});
    await writeFile(path.join(root,screen+"-"+language+"-"+width+"x"+height+".png"),Buffer.from(capture.data,"base64"));
  };
  for(const language of ["zh-CN","zh-TW","en","ja","es","de","ru"]){
    console.log("LAYOUT_LANGUAGE",language);
    for(const [width,height] of [[1440,900],[390,844]]){
      await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:false});
      for(const [name,fixture] of [["opening",base],["choice",choice],["ending",ending]]){
        await loadFixture(fixture,language,width,height);await click('[data-action="enter-chapter-fifteen-home"]');
        await until('!!document.querySelector(".chapter-fifteen-story-screen")');
        await until('Array.from(document.querySelectorAll(".vn-art img")).every(img=>img.complete&&img.naturalWidth>0)');
        if(name==="choice"){
          for(const goal of OPEN_STATION_GOALS){
            const selector='[data-action="choose-first-page-goal"][data-goal="'+goal+'"]';
            await evaluate("document.querySelector("+JSON.stringify(selector)+").scrollIntoView({block:'center'})");
            const hit=await evaluate("(()=>{const b=document.querySelector("+JSON.stringify(selector)+"),r=b.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')?.dataset.goal;})()");
            assert.equal(hit,goal,language+" "+width+" choice hit");
            await click(selector);await until('document.querySelector(".chapter-fifteen-story-screen").dataset.storyGoal==='+JSON.stringify(goal));
          }
          await click(".vn-line");
          await evaluate('document.querySelector("[data-action=chapter-fifteen-primary]").scrollIntoView({block:"center"})');
          const hit=await evaluate('(()=>{const b=document.querySelector("[data-action=chapter-fifteen-primary]"),r=b.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")?.dataset.action;})()');
          assert.equal(hit,"chapter-fifteen-primary");
        }
        await measure(name,language,width,height);
      }
      await loadFixture(claimed,language,width,height);
      const hit=await evaluate('(()=>{const b=document.querySelector("[data-action=open-open-station]"),r=b.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")?.dataset.action;})()');
      assert.equal(hit,"open-open-station",language+" "+width+" dashboard hit");
      await measure("home",language,width,height);await click('[data-action="open-open-station"]');
      await until('!!document.querySelector("[data-testid=open-station-modal]")');await measure("dashboard",language,width,height);
    }
  }
  // Compatibility-only UI regression: this page was sealed without a story bookmark.
  const legacy=settleFirstPage(choice,{qsoId:"fifteenth-ordinary-qso",goal:"contest-craft",completedAt:"2026-10-04T23:05:00.000Z"}).save;
  assert.equal(legacy.chapterFifteenPresentation.acceptedAt,null);
  await loadFixture(legacy,"zh-CN",1440,900);await click('[data-action="enter-chapter-fifteen-home"]');
  await until('document.querySelector(".chapter-fifteen-story-screen")?.dataset.storyBeat==="log"');
  for(let n=0;n<8;n++){
    if(await evaluate('document.querySelector(".vn-dialogue").dataset.vnReady==="true"'))break;
    await click(".vn-line");await pause(100);
  }
  await click('[data-action="chapter-fifteen-primary"]');
  await until('document.querySelector(".chapter-fifteen-story-screen")?.dataset.storyStatus==="claimed"');
  assert.equal(await evaluate('document.querySelector(".chapter-fifteen-story-screen").dataset.storyBeat'),"log");
  assert.equal(await evaluate('document.querySelector(".chapter-fifteen-story-screen").dataset.storyGoal'),"contest-craft");
  const legacySaved=await evaluate("JSON.parse(localStorage.getItem("+JSON.stringify(SAVE_STORAGE_KEY)+"))[0]");
  assert.equal(legacySaved.chapterFifteenPresentation.qsoId,"fifteenth-ordinary-qso");
  assert.equal(legacySaved.chapterFifteenPresentation.goal,"contest-craft");
  assert.equal(legacySaved.storyContinuationState.openStation.firstGoal,"contest-craft");
  evidence.legacyClaim={passed:true,bookmarkPinned:true,endingRetained:true,firstGoal:"contest-craft"};
  await measure("legacy-claimed","zh-CN",1440,900);
  assert.equal(evidence.exceptions.length,0);
  evidence.passed=true;
}catch(error){evidence.error=String(error);process.exitCode=1;}
finally{
  await writeFile(path.join(root,"evidence.json"),JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence));
  socket?.close();chrome.kill();await pause(1000);
  const resolved=path.resolve(profile);
  if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith("cw-first-page-layout-"))throw Error("Unsafe QA profile path");
  await rm(resolved,{recursive:true,force:true,maxRetries:5,retryDelay:500});
}

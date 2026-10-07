import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { preview } from "vite";

const chromePath = process.env.CWGAME_QA_CHROME;
assert(chromePath, "Set CWGAME_QA_CHROME to the existing server browser");
const root = process.cwd();
const androidChunk = (await readdir(path.join(root, "dist", "assets")))
  .find((name) => /^androidSystem-.*\.js$/.test(name));
assert(androidChunk, "Build output is missing the Android runtime chunk");
const profile = path.join(os.tmpdir(), `cwgame-android-semantic-${Date.now()}`);
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const server = await preview({ root, preview: { host: "127.0.0.1", port: 4179, strictPort: true } });
let chrome;
let socket;
const exceptions = [];

try {
  chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
  ], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
  let launchError;
  let stderr = "";
  chrome.on("error", (error) => { launchError = error; });
  chrome.stderr.on("data", (chunk) => { stderr = (stderr + chunk).slice(-4000); });
  let port;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (launchError) throw launchError;
    if (chrome.exitCode !== null) throw new Error(stderr);
    try {
      port = (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0];
      break;
    } catch {
      await pause(250);
    }
  }
  assert(port, "Chrome did not expose a DevTools port");

  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find((tab) => tab.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  let serial = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data);
    if (result.method === "Runtime.exceptionThrown") exceptions.push(result.params);
    if (!result.id || !pending.has(result.id)) return;
    const item = pending.get(result.id);
    pending.delete(result.id);
    if (result.error) item.reject(new Error(JSON.stringify(result.error)));
    else item.resolve(result.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };

  await call("Page.enable");
  await call("Runtime.enable");
  await call("Page.navigate", { url: "http://127.0.0.1:4179/" });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await evaluate("document.readyState === 'complete'")) break;
    await pause(100);
  }

  const probe = await evaluate(`(async () => {
    const module = await import("/assets/${androidChunk}");
    const bridge = module.createAndroidSystemBridge();
    const status = await bridge.getSemanticStatus();
    const response = await bridge.interpretCwTraffic({
      message: "CQ CQ DE BH1QA K", phase: "PLAYER_CQ", pendingQuestion: "NONE",
      selfCallsign: "BH1QA", peerCallsign: "", knownSlots: [], catalogs: {},
    });
    return { status, response };
  })()`);
  assert.equal(probe.status.available, true, JSON.stringify(probe));
  assert.equal(probe.status.provider, "onnxruntime-web");
  assert.equal(probe.status.contractVersion, "qso-semantic-runtime-4");
  assert.equal(probe.response.ok, true, JSON.stringify(probe));
  assert.equal(probe.response.result.provider, "onnxruntime-web");
  assert(Number.isFinite(probe.response.result.confidence));
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  console.log(JSON.stringify({
    passed: true,
    provider: probe.status.provider,
    contractVersion: probe.status.contractVersion,
    modelVersion: probe.status.modelVersion,
    safeToCommit: probe.response.result.safeToCommit,
  }));
} finally {
  socket?.close();
  chrome?.kill();
  await server.httpServer.close();
  await pause(500);
  assert.equal(path.dirname(path.resolve(profile)), path.resolve(os.tmpdir()));
  assert(path.basename(profile).startsWith("cwgame-android-semantic-"));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

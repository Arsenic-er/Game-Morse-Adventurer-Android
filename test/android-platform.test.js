import test from "node:test";
import assert from "node:assert/strict";
import { androidExitCopy, createAndroidSystemBridge } from "../src/platform/androidSystem.js";

test("Android bridge runs the offline semantic model and reports failures without mutating game state", async () => {
  const calls = [];
  const bridge = createAndroidSystemBridge({ runtime: {
    status: async () => ({ available: true, provider: "onnxruntime-web" }),
    interpret: async (payload) => { calls.push(payload); return { provider: "onnxruntime-web", safeToCommit: true }; },
  }, navigatorRef: { onLine: false } });
  assert.deepEqual(await bridge.getNetworkStatus(), { available: true, state: "offline", signalPercent: null, source: "android-webview" });
  assert.deepEqual(await bridge.getSemanticStatus(), { available: true, provider: "onnxruntime-web" });
  assert.deepEqual(await bridge.interpretCwTraffic({ message: "CQ" }), { ok: true, result: { provider: "onnxruntime-web", safeToCommit: true } });
  assert.deepEqual(calls, [{ message: "CQ" }]);
  const failed = createAndroidSystemBridge({ runtime: { status: async () => ({}), interpret: async () => { throw new Error("model unavailable"); } } });
  assert.deepEqual(await failed.interpretCwTraffic({}), { ok: false, error: "model unavailable" });
});

test("Android back guard keeps only supported risk and locale values", () => {
  const bridge = createAndroidSystemBridge({ runtime: { status: async () => ({}), interpret: async () => ({}) } });
  bridge.setActivityUnloadGuard("unsaved", "zh-CN");
  assert.deepEqual(bridge.getActivityUnloadGuard(), { risk: "unsaved", language: "zh-CN" });
  assert.match(androidExitCopy("unsaved", "zh-CN").message, /尚未保存/);
  bridge.setActivityUnloadGuard("unknown", "unknown");
  assert.deepEqual(bridge.getActivityUnloadGuard(), { risk: "none", language: "en" });
});

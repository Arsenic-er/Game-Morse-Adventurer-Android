import { App as NativeApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { createSemanticRuntime } from "./mobileSemanticRuntime.js";

const EXIT_COPY = Object.freeze({
  "zh-CN": { title: "放弃当前通联？", active: "本次通联仍在进行。返回桌面前请先完成或退出当前活动。", unsaved: "本次通联已完成但尚未保存。返回桌面会丢失日志和本次奖励。", stay: "继续通联", leave: "返回桌面" },
  "zh-TW": { title: "放棄目前的通聯？", active: "本次通聯仍在進行。返回桌面前請先完成或退出目前活動。", unsaved: "本次通聯已完成但尚未儲存。返回桌面會遺失日誌與本次獎勵。", stay: "繼續通聯", leave: "返回桌面" },
  ja: { title: "現在の交信を中断しますか？", active: "交信は進行中です。ホームに戻る前に交信を完了するか終了してください。", unsaved: "交信は完了していますが未保存です。ホームに戻るとログと報酬が失われます。", stay: "交信を続ける", leave: "ホームへ戻る" },
  en: { title: "Leave the current QSO?", active: "This contact is still in progress. Finish or leave the activity before returning to Android.", unsaved: "This QSO is complete but unsaved. Returning to Android will discard its log and rewards.", stay: "Continue QSO", leave: "Return to Android" },
  es: { title: "¿Salir del QSO actual?", active: "Este contacto sigue en curso. Termínalo o abandónalo antes de volver a Android.", unsaved: "El QSO terminó pero no se guardó. Volver a Android descartará el registro y las recompensas.", stay: "Continuar QSO", leave: "Volver a Android" },
  de: { title: "Aktuelles QSO verlassen?", active: "Dieser Funkkontakt läuft noch. Schließe oder verlasse ihn, bevor du zu Android zurückkehrst.", unsaved: "Das QSO ist abgeschlossen, aber nicht gespeichert. Beim Zurückkehren gehen Log und Belohnungen verloren.", stay: "QSO fortsetzen", leave: "Zu Android zurück" },
  ru: { title: "Выйти из текущего QSO?", active: "Связь ещё продолжается. Завершите или прервите её перед возвратом в Android.", unsaved: "QSO завершено, но не сохранено. При возврате журнал и награды будут потеряны.", stay: "Продолжить QSO", leave: "Вернуться в Android" },
});

export function androidExitCopy(risk, language) {
  const text = EXIT_COPY[language] ?? EXIT_COPY.en;
  return { title: text.title, message: risk === "unsaved" ? text.unsaved : text.active, okButtonTitle: text.leave, cancelButtonTitle: text.stay };
}

export function createAndroidSystemBridge({ runtime = createSemanticRuntime(), navigatorRef = globalThis.navigator } = {}) {
  let guard = { risk: "none", language: "en" };
  return Object.freeze({
    chapterOneLocalReview: false,
    qaCapture: false,
    getNetworkStatus: async () => ({ available: true, state: navigatorRef?.onLine === false ? "offline" : "good", signalPercent: null, source: "android-webview" }),
    getSemanticStatus: () => runtime.status(),
    interpretCwTraffic: async (payload) => {
      try { return { ok: true, result: await runtime.interpret(payload) }; }
      catch (error) { return { ok: false, error: String(error?.message ?? error).slice(0, 240) }; }
    },
    setActivityUnloadGuard: (risk, language) => {
      guard = { risk: ["active", "unsaved"].includes(risk) ? risk : "none", language: Object.hasOwn(EXIT_COPY, language) ? language : "en" };
    },
    getActivityUnloadGuard: () => ({ ...guard }),
    consumeQaIncomingFailure: () => false,
    getQaIncomingFailureCount: () => 0,
  });
}

let bootstrapped = false;
export async function bootstrapAndroidPlatform(target = globalThis.window) {
  if (!target || Capacitor.getPlatform() !== "android" || bootstrapped) return false;
  bootstrapped = true;
  const bridge = createAndroidSystemBridge();
  target.cwgameSystem = Object.freeze({ ...(target.cwgameSystem ?? {}), ...bridge });
  let dialogOpen = false;
  await NativeApp.addListener("backButton", async ({ canGoBack }) => {
    if (canGoBack) { target.history.back(); return; }
    const guard = bridge.getActivityUnloadGuard();
    if (guard.risk !== "none") {
      if (dialogOpen) return;
      dialogOpen = true;
      try {
        const result = await Dialog.confirm(androidExitCopy(guard.risk, guard.language));
        if (!result.value) return;
      } finally { dialogOpen = false; }
    }
    await NativeApp.minimizeApp();
  });
  await Promise.allSettled([
    StatusBar.setOverlaysWebView({ overlay: false }),
    StatusBar.setStyle({ style: Style.Light }),
    StatusBar.setBackgroundColor({ color: "#02080D" }),
  ]);
  const hideSplash = () => SplashScreen.hide().catch(() => {});
  if (target.document?.readyState === "complete") void hideSplash();
  else target.addEventListener("load", hideSplash, { once: true });
  return true;
}

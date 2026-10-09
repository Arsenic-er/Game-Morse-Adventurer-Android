import {chapterElevenStoryText} from "./chapterElevenStoryText.js";
import {chapterElevenStoryModel,canContinueChapterEleven} from "../game/chapterElevenStory.js";
import {interpretListeningTraffic,submitListeningResponse} from "../game/listeningTraffic.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, BookOpenText, CheckCircle, Clock, Ear, GearSix, Radio, Warning,
} from "@phosphor-icons/react";
import { CLEAR_INPUT_GESTURE_LENGTH } from "../cw/inputAnalyzer.js";
import { useCwCore } from "../cw/useCwCore.js";
import {
  LISTENING_PHASES, createListeningRun, finishListeningWait, normalizeListeningState,
  observeListeningWindow, recordListeningSilence, retryListeningRun,
  tickListeningRun,
} from "../game/listeningRun.js";
import {
  createExpeditionActiveClock, expeditionPageIsActive, registerExpeditionPageVisibility,
} from "../game/expeditionLifecycle.js";
import {
  LISTENING_SETTLED_TEXT, LISTENING_TEXT, listeningLeaveRisk,
} from "./listeningText.js";

function nowIso() { return new Date().toISOString(); }

function initialRun(save) {
  const chapter = normalizeListeningState(save.storyContinuationState?.chapter11);
  return chapter.activeRun ?? createListeningRun({
    playerCallsign: save.callsign,
    seed: `${save.id}:listening:${chapter.settledRunIds.length}`,
    startedAt: nowIso(),
  });
}

function callText(run) {
  return `${run.targetCallsign} DE ${run.playerCallsign} K`;
}

export function ListeningScreen({
  language, save, inputBlocked = false, onActivityRisk, onRunChange, onSettle, onBack, onContinueStory, onSettings,
}) {
  const storyText = chapterElevenStoryText(language);
  const t = LISTENING_TEXT[language] ?? LISTENING_TEXT.en;
  const settledText = LISTENING_SETTLED_TEXT[language] ?? LISTENING_SETTLED_TEXT.en;
  const [run, setRun] = useState(() => initialRun(save));
  const [settled, setSettled] = useState(false);
  const [settlementAttempts, setSettlementAttempts] = useState(0);
  const [settlementReason, setSettlementReason] = useState("");
  const [semanticBusy, setSemanticBusy] = useState(false);
  const [callAgainArmed, setCallAgainArmed] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [windowActive, setWindowActive] = useState(() => expeditionPageIsActive(globalThis.document));
  const onRunChangeRef = useRef(onRunChange); onRunChangeRef.current = onRunChange;
  const inputRef = useRef(null);
  const runRef = useRef(run), busyRef = useRef(false), gateRef = useRef(false), mountedRef = useRef(true);
  gateRef.current = inputBlocked || leaveOpen || !windowActive;
  const controlsBlocked = inputBlocked || leaveOpen || !windowActive || semanticBusy;
  const clockRef = useRef(null);
  const cw = useCwCore({
    targetText: callText(run),
    automaticWpm: save.automaticKeyWpm,
    clearGestureLength: CLEAR_INPUT_GESTURE_LENGTH,
  });
  const terminal = [LISTENING_PHASES.COMPLETED, LISTENING_PHASES.FAILED, LISTENING_PHASES.ABANDONED].includes(run.phase);
  const canTransmit = run.phase === LISTENING_PHASES.CALL_READY
    || (run.phase === LISTENING_PHASES.DECISION && callAgainArmed && run.callCount < 2);

  if (!clockRef.current) clockRef.current = createExpeditionActiveClock({
    onElapsed(milliseconds) {
      const current = runRef.current, next = tickListeningRun(current, { seconds: milliseconds / 1000 }, nowIso());
      if (next !== current) { runRef.current = next; setRun(next); onRunChangeRef.current(next); }
    },
  });

  const update = useCallback((next) => {
    if (!next || next === runRef.current) return;
    runRef.current = next; setRun(next); onRunChangeRef.current(next);
  }, []);

  useEffect(() => { onRunChange(run); }, []);
  useEffect(() => registerExpeditionPageVisibility({
    windowTarget: globalThis.window,
    documentTarget: globalThis.document,
    onActiveChange: setWindowActive,
  }), []);
  useEffect(() => {
    clockRef.current.setActive(!inputBlocked && !leaveOpen && windowActive && !terminal);
    return () => clockRef.current.setActive(false);
  }, [inputBlocked, leaveOpen, terminal, windowActive]);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; clockRef.current.dispose(); }; }, []);
  useEffect(() => {
    onActivityRisk(listeningLeaveRisk(run, settled));
    return () => onActivityRisk("none");
  }, [onActivityRisk, run, settled]);
  useEffect(() => {
    if (!inputBlocked && !leaveOpen && windowActive) return;
    cw.stopAll();
  }, [cw.stopAll, inputBlocked, leaveOpen, windowActive]);
  useEffect(() => {
    if (run.phase !== LISTENING_PHASES.WAITING || inputBlocked || leaveOpen || !windowActive) return undefined;
    const requested = { runId: run.runId, callCount: run.callCount };
    // A paused or reloaded wait starts a fresh four seconds; active-clock renders do not restart it.
    const timer = globalThis.setTimeout(() => {
      const current = runRef.current;
      if (!mountedRef.current || gateRef.current || current.runId !== requested.runId
        || current.callCount !== requested.callCount || current.phase !== LISTENING_PHASES.WAITING) return;
      update(finishListeningWait(current, nowIso()));
    }, 4_000);
    return () => globalThis.clearTimeout(timer);
  }, [inputBlocked, leaveOpen, run.runId, run.callCount, run.phase, windowActive, update]);

  const transmit = useCallback(async (message = cw.analysis.decoded) => {
    if (!canTransmit || busyRef.current || gateRef.current || cw.isKeying || cw.isPlaying || !String(message).trim()) return;
    const requested = runRef.current; busyRef.current = true; setSemanticBusy(true);
    try {
      const semantic = await interpretListeningTraffic(requested, message, window.cwgameSystem?.interpretCwTraffic);
      if (!mountedRef.current || gateRef.current) return;
      update(submitListeningResponse(runRef.current, requested, message, semantic, nowIso()));
      cw.clearInput(); setCallAgainArmed(false);
    } finally { busyRef.current = false; if (mountedRef.current) setSemanticBusy(false); }
  }, [canTransmit, cw.analysis.decoded, cw.clearInput, cw.isKeying, cw.isPlaying, update]);

  inputRef.current = { canTransmit, inputBlocked: controlsBlocked || cw.isPlaying, keyType: save.keyType, transmit };
  useEffect(() => {
    function onDown(event) {
      const state = inputRef.current;
      if (!state || state.inputBlocked) return;
      if (["Space", "KeyZ", "KeyX", "F2"].includes(event.code)) event.preventDefault();
      if (event.repeat) return;
      if (event.code === "F2") { state.transmit(); return; }
      if (!state.canTransmit) return;
      if (state.keyType === "manual" && event.code === "Space") cw.beginManual();
      if (state.keyType === "automatic" && event.code === "KeyZ") cw.beginAutomatic(".");
      if (state.keyType === "automatic" && event.code === "KeyX") cw.beginAutomatic("-");
    }
    function onUp(event) {
      if (save.keyType === "manual" && event.code === "Space") cw.endManual();
      if (save.keyType === "automatic" && event.code === "KeyZ") cw.endAutomatic(".");
      if (save.keyType === "automatic" && event.code === "KeyX") cw.endAutomatic("-");
    }
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); cw.stopAll();
    };
  }, [cw.beginAutomatic, cw.beginManual, cw.endAutomatic, cw.endManual, cw.stopAll, save.keyType]);

  function observeNext() { if (!controlsBlocked) update(observeListeningWindow(runRef.current, nowIso())); }
  function armSecondCall() { if (controlsBlocked) return; cw.clearInput(); setCallAgainArmed(true); }
  function recordSilence() { if (!controlsBlocked) update(recordListeningSilence(runRef.current, nowIso())); }
  function retry() { if (controlsBlocked) return; cw.clearInput(); setSettled(false); setCallAgainArmed(false); update(retryListeningRun(runRef.current, nowIso())); }
  function requestLeave() { listeningLeaveRisk(run, settled) === "none" ? onBack() : setLeaveOpen(true); }
  async function settle() {
    if (controlsBlocked || busyRef.current || settled) return;
    busyRef.current = true; setSemanticBusy(true);
    try {
      const result = await onSettle(runRef.current); if (!mountedRef.current) return;
      setSettlementAttempts((count) => count + 1);
      setSettlementReason(result?.reason ?? (result?.settled ? "SETTLED" : "REJECTED"));
      if (result?.settled || result?.reason === "ALREADY_SETTLED") setSettled(true);
    } finally { busyRef.current = false; if (mountedRef.current) setSemanticBusy(false); }
  }

  const lastError = run.errors.at(-1) ?? run.failureReason;
  return <main className="screen listening-screen" data-testid="listening-screen"
    data-simulation="fictional-listening-story" data-listening-phase={run.phase}
    data-listening-paused={inputBlocked || leaveOpen || !windowActive} data-pulse-count={cw.analysis.pulseCount}
    data-decoded={cw.analysis.decoded} data-keying={cw.isKeying} data-keyer-wpm={save.automaticKeyWpm} data-portrait-visible="false" data-settled={settled}
    data-settlement-attempts={settlementAttempts} data-settlement-reason={settlementReason}>
    <header className="listening-topbar"><div><Ear size={30} weight="fill" /><span>{t.kicker}</span><h1>{t.title}</h1></div><b>{save.callsign}</b>{onSettings && <button data-action="listening-settings" disabled={semanticBusy || leaveOpen} onClick={onSettings}><GearSix />{storyText.settings}</button>}<button data-action="listening-back" disabled={semanticBusy} onClick={requestLeave}><ArrowLeft />{chapterElevenStoryModel(save).playable ? storyText.returnToStory : t.leave}</button></header>
    <p className="listening-simulation"><Warning weight="fill" />{t.simulationWarning}</p>
    {(inputBlocked || leaveOpen || !windowActive) && <div className="listening-paused" role="status">{t.paused}</div>}
    <section className="listening-layout" aria-busy={inputBlocked || semanticBusy}>
      <aside className="listening-target"><Radio size={28} /><span>{t.target}</span><strong>{run.targetCallsign}</strong><small>{run.stationId}</small><div><Clock />{Math.ceil(run.activeMilliseconds / 1_000)}s</div></aside>
      <article className="listening-console">
        <section className="listening-windows"><h2>{t.observeTitle}</h2><div>{run.windows.map((windowFact) => {
          const done = run.observedWindowIds.includes(windowFact.id);
          return <article key={windowFact.id} data-listening-window={windowFact.id} data-observed={done}><strong>{windowFact.id}</strong><span>{t.propagation}: {windowFact.propagationLevel}</span><small>{t.noise}: {t[windowFact.noiseLevel]}</small>{done && <b>{t.observed}</b>}</article>;
        })}</div>{[LISTENING_PHASES.BRIEFING, LISTENING_PHASES.LISTENING].includes(run.phase) && <button data-action="listening-observe" disabled={controlsBlocked} onClick={observeNext}>{t.observe}</button>}</section>
        {canTransmit && <section className="listening-keyer"><h2>{t.callPrompt}</h2><code>{callText(run)}</code><small>{save.keyType === "automatic" ? t.keyAuto : t.keyManual}</small><strong>{cw.analysis.decoded || "_"}</strong><div><button data-action="listening-clear" disabled={controlsBlocked} onClick={cw.clearInput}>{t.clear}</button><button data-action="listening-submit" disabled={!cw.analysis.pulseCount || cw.isKeying || cw.isPlaying || controlsBlocked} onClick={() => transmit()}>{t.transmit}</button></div></section>}
        {run.phase === LISTENING_PHASES.WAITING && <section className="listening-wait" role="status"><Ear size={42} /><p>{t.waiting}</p></section>}
        {run.phase === LISTENING_PHASES.DECISION && !callAgainArmed && <section className="listening-decision"><p>{t.decision}</p><div>{run.callCount < 2 && <button data-action="listening-call-again" disabled={controlsBlocked} onClick={armSecondCall}>{t.callAgain}</button>}<button data-action="listening-record-silence" disabled={controlsBlocked} onClick={recordSilence}>{t.recordSilence}</button></div></section>}
        {lastError && <p className="listening-error"><Warning />{t[lastError] ?? lastError}</p>}
        {run.phase === LISTENING_PHASES.COMPLETED && <section className="listening-result"><CheckCircle size={48} /><h2>{t.completed}</h2><strong>{storyText.conclusion}</strong>{settled && <p className="listening-settlement-banner" role="status">{settledText}</p>}<button data-action="listening-settle" disabled={controlsBlocked || settled} onClick={settle}>{t.settle}</button>{settled && canContinueChapterEleven(save, run.runId) && onContinueStory && <button data-action="continue-chapter-eleven" disabled={controlsBlocked} onClick={onContinueStory}><BookOpenText />{storyText.continueStory}</button>}</section>}
        {run.phase === LISTENING_PHASES.FAILED && <section className="listening-result failed"><Warning size={48} /><h2>{t.failed}</h2><p>{t[run.failureReason] ?? run.failureReason}</p><button data-action="listening-retry" disabled={controlsBlocked} onClick={retry}>{t.retry}</button></section>}
      </article>
      <aside className="listening-ledger"><h2>{t.observed}</h2><strong>{run.observedWindowIds.length}/3</strong><span>{run.callCount}/2</span><p>{run.summary ? storyText.conclusion : "—"}</p></aside>
    </section>
    {leaveOpen && <div className="modal-backdrop"><section className="listening-leave-dialog" role="dialog" aria-modal="true"><Warning size={38} /><p>{t.leaveConfirm}</p><button onClick={() => setLeaveOpen(false)}>{t.cancel}</button><button data-action="listening-confirm-leave" onClick={onBack}>{t.confirmLeave}</button></section></div>}
  </main>;
}

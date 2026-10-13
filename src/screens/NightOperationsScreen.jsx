import {chapterThirteenStoryText} from "./chapterThirteenStoryText.js";
import {chapterThirteenStoryModel,canContinueChapterThirteen} from "../game/chapterThirteenStory.js";
import {interpretNightOperationsTraffic,submitNightOperationsResponse} from "../game/nightOperationsTraffic.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpenText, Broadcast, CheckCircle, Clock, GearSix, Moon, Radio, Warning } from "@phosphor-icons/react";
import { CLEAR_INPUT_GESTURE_LENGTH } from "../cw/inputAnalyzer.js";
import { useCwCore } from "../cw/useCwCore.js";
import {
  NIGHT_OPERATIONS_PHASES, chooseNightWindow, createNightOperationsRun, normalizeNightOperationsState,
  retryNightOperationsRun,
  tickNightOperationsRun,
} from "../game/nightOperationsRun.js";
import { createExpeditionActiveClock, expeditionPageIsActive, registerExpeditionPageVisibility } from "../game/expeditionLifecycle.js";
import { NIGHT_OPERATIONS_TEXT, nightOperationsLeaveRisk } from "./nightOperationsText.js";

function nowIso() { return new Date().toISOString(); }
function initialRun(save) {
  const chapter = normalizeNightOperationsState(save.storyContinuationState?.chapter13);
  return chapter.activeRun ?? createNightOperationsRun({ save, seed: `${save.id}:night:${chapter.settledRunIds.length}`, startedAt: nowIso() });
}
function selectedWindow(run) { return run.windows.find(({ id }) => id === run.currentWindowId) ?? null; }
function expectedText(run) {
  const window = selectedWindow(run); if (!window) return "";
  if (run.phase === NIGHT_OPERATIONS_PHASES.CALL) return `${window.callsign} DE ${run.playerCallsign} K`;
  if (run.phase === NIGHT_OPERATIONS_PHASES.EXCHANGE) return `${window.callsign} DE ${run.playerCallsign} 599 ${window.band} K`;
  return "";
}
function windowStatus(run, window) {
  if (run.contacts.some(({ windowId }) => windowId === window.id)) return "complete";
  if (run.missedWindowIds.includes(window.id) || run.activeMilliseconds >= window.closesAtMilliseconds) return "closed";
  if (run.activeMilliseconds >= window.opensAtMilliseconds) return "available";
  return "opens";
}

export function NightOperationsScreen({ language, save, inputBlocked = false, onActivityRisk, onRunChange, onSettle, onBack, onContinueStory, onSettings }) {
  const storyText = chapterThirteenStoryText(language);
  const t = NIGHT_OPERATIONS_TEXT[language] ?? NIGHT_OPERATIONS_TEXT.en;
  const [run, setRun] = useState(() => initialRun(save)); const [settled, setSettled] = useState(false);
  const [settlementAttempts,setSettlementAttempts] = useState(0);
  const [semanticBusy, setSemanticBusy] = useState(false); const [leaveOpen, setLeaveOpen] = useState(false);
  const [settlementReason, setSettlementReason] = useState(""); const [windowActive, setWindowActive] = useState(() => expeditionPageIsActive(globalThis.document));
  const onRunChangeRef = useRef(onRunChange); onRunChangeRef.current = onRunChange; const inputRef = useRef(null); const clockRef = useRef(null);
  const runRef = useRef(run), busyRef = useRef(false), gateRef = useRef(false), mountedRef = useRef(true);
  gateRef.current = inputBlocked || leaveOpen || !windowActive;
  const controlsBlocked = inputBlocked || leaveOpen || !windowActive || semanticBusy;
  const cw = useCwCore({ targetText: expectedText(run), automaticWpm: save.automaticKeyWpm, clearGestureLength: CLEAR_INPUT_GESTURE_LENGTH });
  const terminal = [NIGHT_OPERATIONS_PHASES.COMPLETED, NIGHT_OPERATIONS_PHASES.FAILED, NIGHT_OPERATIONS_PHASES.ABANDONED].includes(run.phase);
  const canTransmit = [NIGHT_OPERATIONS_PHASES.CALL, NIGHT_OPERATIONS_PHASES.EXCHANGE].includes(run.phase);
  if (!clockRef.current) clockRef.current = createExpeditionActiveClock({ onElapsed(milliseconds) {
    const current = runRef.current, next = tickNightOperationsRun(current, { milliseconds }, nowIso());
    if (next !== current) { runRef.current = next; setRun(next); onRunChangeRef.current(next); }
  } });
  const update = useCallback((next) => { if (!next || next === runRef.current) return; runRef.current = next; setRun(next); onRunChangeRef.current(next); }, []);
  useEffect(() => { onRunChange(run); }, []);
  useEffect(() => registerExpeditionPageVisibility({ windowTarget: globalThis.window, documentTarget: globalThis.document, onActiveChange: setWindowActive }), []);
  useEffect(() => { clockRef.current.setActive(!inputBlocked && !leaveOpen && windowActive && !terminal); return () => clockRef.current.setActive(false); }, [inputBlocked, leaveOpen, terminal, windowActive]);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; clockRef.current.dispose(); }; }, []);
  useEffect(() => { onActivityRisk(nightOperationsLeaveRisk(run, settled)); return () => onActivityRisk("none"); }, [onActivityRisk, run, settled]);
  useEffect(() => { if (!inputBlocked && !leaveOpen && windowActive) return; cw.stopAll(); }, [cw.stopAll, inputBlocked, leaveOpen, windowActive]);

  useEffect(() => { cw.clearInput(); }, [run.currentWindowId, cw.clearInput]);
  const transmit = useCallback(async (message = cw.analysis.decoded) => {
    if (!canTransmit || busyRef.current || gateRef.current || cw.isKeying || cw.isPlaying || !String(message).trim()) return;
    const requested = runRef.current; busyRef.current = true; setSemanticBusy(true);
    try {
      const semantic = await interpretNightOperationsTraffic(requested, message, window.cwgameSystem?.interpretCwTraffic);
      if (!mountedRef.current || gateRef.current) return;
      update(submitNightOperationsResponse(runRef.current, requested, message, semantic, nowIso()));
      cw.clearInput();
    } finally { busyRef.current = false; if (mountedRef.current) setSemanticBusy(false); }
  }, [canTransmit, cw.analysis.decoded, cw.clearInput, cw.isKeying, cw.isPlaying, update]);
  inputRef.current = { canTransmit, inputBlocked: controlsBlocked || cw.isPlaying, keyType: save.keyType, transmit };
  useEffect(() => {
    function down(event) { const state = inputRef.current; if (!state || state.inputBlocked) return;
      if (["Space", "KeyZ", "KeyX", "F2"].includes(event.code)) event.preventDefault(); if (event.repeat) return;
      if (event.code === "F2") { state.transmit(); return; } if (!state.canTransmit) return;
      if (state.keyType === "manual" && event.code === "Space") cw.beginManual();
      if (state.keyType === "automatic" && event.code === "KeyZ") cw.beginAutomatic(".");
      if (state.keyType === "automatic" && event.code === "KeyX") cw.beginAutomatic("-");
    }
    function up(event) { if (save.keyType === "manual" && event.code === "Space") cw.endManual();
      if (save.keyType === "automatic" && event.code === "KeyZ") cw.endAutomatic(".");
      if (save.keyType === "automatic" && event.code === "KeyX") cw.endAutomatic("-"); }
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); cw.stopAll(); };
  }, [cw.beginAutomatic, cw.beginManual, cw.endAutomatic, cw.endManual, cw.stopAll, save.keyType]);

  function select(id) { if (controlsBlocked) return; cw.clearInput(); update(chooseNightWindow(runRef.current, id)); }
  function retry() { if (controlsBlocked) return; cw.clearInput(); setSettled(false); update(retryNightOperationsRun(runRef.current, nowIso())); }
  function requestLeave() { nightOperationsLeaveRisk(run, settled) === "none" ? onBack() : setLeaveOpen(true); }
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

  return <main className="screen night-operations-screen" data-testid="night-operations-screen" data-night-phase={run.phase}
    data-night-paused={inputBlocked || leaveOpen || !windowActive} data-pulse-count={cw.analysis.pulseCount} data-decoded={cw.analysis.decoded} data-keying={cw.isKeying} data-keyer-wpm={save.automaticKeyWpm}
    data-portrait-visible="false" data-settled={settled} data-settlement-attempts={settlementAttempts} data-settlement-reason={settlementReason}>
    <header className="night-operations-topbar"><div><Moon size={30} weight="fill" /><span>{t.kicker}</span><h1>{t.title}</h1></div><b>{save.callsign}</b>{onSettings && <button data-action="night-settings" disabled={semanticBusy || leaveOpen} onClick={onSettings}><GearSix />{storyText.settings}</button>}<button data-action="night-back" disabled={semanticBusy} onClick={requestLeave}><ArrowLeft />{chapterThirteenStoryModel(save).playable ? storyText.returnToStory : t.leave}</button></header>
    <p className="night-operations-warning"><Warning weight="fill" />{t.simulationWarning}</p>
    {(inputBlocked || leaveOpen || !windowActive) && <p className="night-operations-paused" role="status">{t.paused}</p>}
    <section className="night-operations-layout" aria-busy={semanticBusy || inputBlocked}>
      <section className="night-operations-board"><h2><Broadcast />{t.board}</h2><div className="night-window-grid">
        {run.windows.map((window) => { const status = windowStatus(run, window); return <article key={window.id} data-night-window-id={window.id} data-window-status={status}>
          <header><strong>{window.order}. {window.callsign}</strong><span>{t[status]}</span></header><dl><dt>{t.band}</dt><dd>{window.band}</dd><dt>{t.propagation}</dt><dd>{window.propagationGrade}</dd><dt>{t.opens}</dt><dd>{Math.round(window.opensAtMilliseconds / 1000)}s</dd><dt>{t.closes}</dt><dd>{Math.round(window.closesAtMilliseconds / 1000)}s</dd></dl>
          {status === "available" && !run.currentWindowId && <button data-action="night-select-window" data-window-id={window.id} disabled={controlsBlocked || terminal} onClick={() => select(window.id)}>{t.select}</button>}
        </article>; })}
      </div></section>
      <aside className="night-operations-status"><Clock /><strong>{Math.ceil(run.activeMilliseconds / 1000)}s</strong><span>{t[run.phase]}</span><span>{t.contacts}: {run.contacts.length}/3</span><span>{t.missed}: {run.missedWindowIds.length}/2</span></aside>
      {canTransmit && <section className="night-operations-keyer"><Radio size={32} /><h2>{run.phase === NIGHT_OPERATIONS_PHASES.CALL ? t.call : t.exchange}</h2><code>{expectedText(run)}</code><small>{save.keyType === "automatic" ? t.keyAuto : t.keyManual}</small><strong>{cw.analysis.decoded || "_"}</strong><div><button data-action="night-clear" disabled={controlsBlocked} onClick={cw.clearInput}>{t.clear}</button><button data-action="night-submit" disabled={!cw.analysis.pulseCount || cw.isKeying || cw.isPlaying || controlsBlocked} onClick={() => transmit()}>{t.transmit}</button></div></section>}
      {run.phase === NIGHT_OPERATIONS_PHASES.COMPLETED && <section className="night-operations-result"><CheckCircle size={48} /><h2>{t.completed}</h2>{settled && <p role="status">{t.settled}</p>}<button data-action="night-settle" disabled={controlsBlocked || settled} onClick={settle}>{t.settle}</button>{settled && canContinueChapterThirteen(save,run.runId) && onContinueStory && <button data-action="continue-chapter-thirteen" disabled={controlsBlocked} onClick={onContinueStory}><BookOpenText />{storyText.continueStory}</button>}</section>}
      {run.phase === NIGHT_OPERATIONS_PHASES.FAILED && <section className="night-operations-result failed"><Warning size={48} /><h2>{t.failed}</h2><p>{t[run.failureReason] ?? run.failureReason}</p><button data-action="night-retry" disabled={controlsBlocked} onClick={retry}>{t.retry}</button></section>}
    </section>
    {leaveOpen && <div className="modal-backdrop"><section className="night-operations-leave-dialog" role="dialog" aria-modal="true"><Warning size={38} /><p>{t.leaveConfirm}</p><button onClick={() => setLeaveOpen(false)}>{t.cancel}</button><button data-action="night-confirm-leave" onClick={onBack}>{t.confirmLeave}</button></section></div>}
  </main>;
}

import { canContinueChapterEight, chapterEightStoryModel } from "../game/chapterEightStory.js";
import { interpretServiceNetTraffic, submitServiceNetResponse } from "../game/serviceNetTraffic.js";
import { chapterEightStoryText } from "./chapterEightStoryText.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Broadcast, CheckCircle, Clock, ListNumbers, Radio, Warning, GearSix, BookOpenText } from "@phosphor-icons/react";
import { useStructuredCwInput } from "../cw/useStructuredCwInput.js";
import {
  SERVICE_NET_PHASES, beginServiceNetRun, createServiceNetRun, normalizeServiceNetState,
  receiveServiceNetMessage, retryServiceNetRun, serviceNetMessageText,
  tickServiceNetRun,
} from "../game/serviceNetRun.js";
import {
  createExpeditionActiveClock, expeditionPageIsActive, registerExpeditionPageVisibility,
} from "../game/expeditionLifecycle.js";
import { SERVICE_NET_SETTLED_TEXT, SERVICE_NET_TEXT, serviceNetLeaveRisk } from "./serviceNetText.js";

function nowIso() { return new Date().toISOString(); }

function initialRun(save) {
  const chapter = normalizeServiceNetState(save.storyContinuationState?.chapter08);
  if (chapter.activeRun) return chapter.activeRun;
  return createServiceNetRun({
    playerCallsign: save.callsign,
    seed: `${save.id}:service-net:${chapter.settledRunIds.length}`,
    startedAt: nowIso(),
  });
}

export function ServiceNetScreen({ language, save, inputBlocked = false, onActivityRisk, onRunChange, onSettle, onBack, onContinueStory, onSettings }) {
  const storyText = chapterEightStoryText(language);
  const t = SERVICE_NET_TEXT[language] ?? SERVICE_NET_TEXT.en;
  const settledText = SERVICE_NET_SETTLED_TEXT[language] ?? SERVICE_NET_SETTLED_TEXT.en;
  const [run, setRun] = useState(() => initialRun(save));
  const [semanticBusy, setSemanticBusy] = useState(false);
  const [settled, setSettled] = useState(false);
  const [settlementAttempts, setSettlementAttempts] = useState(0);
  const [settlementReason, setSettlementReason] = useState("");
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [windowActive, setWindowActive] = useState(() => expeditionPageIsActive(globalThis.document));
  const runRef = useRef(run);
  const busyRef = useRef(false);
  const gateRef = useRef(false);
  gateRef.current = inputBlocked || leaveOpen || !windowActive;
  const mountedRef = useRef(true);
  const onRunChangeRef = useRef(onRunChange);
  onRunChangeRef.current = onRunChange;
  const activeClockRef = useRef(null);
  if (!activeClockRef.current) {
    activeClockRef.current = createExpeditionActiveClock({
      onElapsed(milliseconds) {
        const next = tickServiceNetRun(runRef.current, { seconds: milliseconds / 1000, paused: false }, nowIso());
        runRef.current = next;
        setRun(next);
        onRunChangeRef.current(next);
      },
    });
  }
  const activeClock = activeClockRef.current;
  const current = run.currentPosition < run.priorityOrder.length
    ? run.messages[run.priorityOrder[run.currentPosition]] : null;
  const orderedMessages = useMemo(() => run.priorityOrder.map((index) => run.messages[index]), [run]);
  const terminal = [SERVICE_NET_PHASES.COMPLETED, SERVICE_NET_PHASES.FAILED, SERVICE_NET_PHASES.ABANDONED].includes(run.phase);
  const inputPhase = [SERVICE_NET_PHASES.CHECK_IN, SERVICE_NET_PHASES.PLAYER_ACK].includes(run.phase);
  const inputHint = run.phase === SERVICE_NET_PHASES.CHECK_IN
    ? t.checkInHint.replace("{CALL}", run.playerCallsign)
    : current ? t.ackHint.replace("{MSG}", current.messageId).replace("{PRI}", current.priority) : "";
  const cw = useStructuredCwInput({
    targetText: inputHint, automaticWpm: save.automaticKeyWpm, keyType: save.keyType,
    inputBlocked: inputBlocked || semanticBusy || leaveOpen || !windowActive, enabled: inputPhase,
  });

  function update(next) {
    if (!next || next === runRef.current) return;
    runRef.current = next;
    setRun(next);
    onRunChange(next);
  }

  useEffect(() => { onRunChange(run); }, []);
  useEffect(() => registerExpeditionPageVisibility({
    windowTarget: globalThis.window, documentTarget: globalThis.document, onActiveChange: setWindowActive,
  }), []);
  useEffect(() => {
    activeClock.setActive(!inputBlocked && !leaveOpen && windowActive && !terminal && run.phase !== SERVICE_NET_PHASES.BRIEFING);
    return () => activeClock.setActive(false);
  }, [activeClock, inputBlocked, leaveOpen, run.phase, terminal, windowActive]);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; activeClock.dispose(); };
  }, [activeClock]);
  useEffect(() => {
    onActivityRisk(serviceNetLeaveRisk(run, settled));
    return () => onActivityRisk("none");
  }, [onActivityRisk, run, settled]);

  async function sendText(value = cw.analysis.decoded) {
    if (busyRef.current || gateRef.current || cw.isKeying || !String(value).trim()) return;
    const requested = runRef.current;
    busyRef.current = true;
    setSemanticBusy(true);
    try {
      const semantic = await interpretServiceNetTraffic(requested, value, window.cwgameSystem?.interpretCwTraffic);
      if (!mountedRef.current || gateRef.current) return;
      update(submitServiceNetResponse(runRef.current, requested, value, semantic, nowIso()));
      cw.clearInput();
    } finally {
      busyRef.current = false;
      if (mountedRef.current) setSemanticBusy(false);
    }
  }

  function requestLeave() {
    if (serviceNetLeaveRisk(run, settled) === "none") onBack();
    else setLeaveOpen(true);
  }

  function settle() {
    if (inputBlocked || leaveOpen || settled) return;
    const result = onSettle(run);
    setSettlementAttempts((count) => count + 1);
    setSettlementReason(result?.reason ?? (result?.settled ? "SETTLED" : "REJECTED"));
    if (result?.settled || result?.reason === "ALREADY_SETTLED") setSettled(true);
  }

  return <main className="screen service-net-screen" data-testid="service-net-screen"
    data-service-net-phase={run.phase} data-service-message-id={current?.messageId ?? ""}
    data-service-priority={current?.priority ?? ""} data-service-receipt-count={run.receipts.length}
    data-service-paused={inputBlocked || leaveOpen || !windowActive} data-simulation="fictional-public-service" data-pulse-count={cw.analysis.pulseCount} data-decoded={cw.analysis.decoded} data-keying={cw.isKeying} data-keyer-wpm={save.automaticKeyWpm}
    data-portrait-visible="false" data-settled={settled} data-settlement-attempts={settlementAttempts} data-settlement-reason={settlementReason}>
    <header className="service-net-topbar"><div><Broadcast size={28} weight="fill" /><span>{t.kicker}</span><h1>{t.title}</h1></div><b>{save.callsign}</b>{onSettings && <button data-action="service-net-settings" disabled={semanticBusy || leaveOpen} onClick={onSettings}><GearSix />{storyText.settings}</button>}<button disabled={semanticBusy} onClick={requestLeave}><ArrowLeft />{chapterEightStoryModel(save).playable ? storyText.returnToStory : t.leave}</button></header>
    <p className="service-net-simulation"><Warning weight="fill" />{t.simulationWarning}</p>
    {(inputBlocked || leaveOpen || !windowActive) && <div className="service-net-paused" role="status">{t.paused}</div>}
    <section className="service-net-layout" aria-busy={inputBlocked || semanticBusy}>
      <aside className="service-net-queue"><h2><ListNumbers />{t.queue}</h2>{orderedMessages.map((entry, index) => <article key={entry.messageId} data-queue-current={index === run.currentPosition}><strong>#{entry.messageId}</strong><span>{t.priority} {entry.priority}</span><small>{t[entry.item]} × {entry.quantity} · {t.people} {entry.people}</small></article>)}</aside>
      <article className="service-net-console">
        <div className="service-net-meter"><Clock /><span>{Math.floor(run.elapsedMilliseconds / 1000)}s</span><b>{t.receipts} {run.receipts.length}/3</b></div>
        {run.phase === SERVICE_NET_PHASES.BRIEFING && <section><p>{t.briefing}</p><button data-action="service-net-begin" disabled={inputBlocked} onClick={() => update(beginServiceNetRun(run))}>{t.begin}</button></section>}
        {run.phase === SERVICE_NET_PHASES.RECEIVE_MESSAGE && current && <section className="service-net-current"><h2>{t.currentMessage}</h2><code>{serviceNetMessageText(current)}</code><dl><dt>{t.priority}</dt><dd>{current.priority}</dd><dt>{t.people}</dt><dd>{current.people}</dd><dt>{t.item}</dt><dd>{t[current.item]}</dd><dt>{t.quantity}</dt><dd>{current.quantity}</dd></dl><button data-action="service-net-receive" disabled={inputBlocked} onClick={() => update(receiveServiceNetMessage(run, nowIso()))}><Radio />{t.receive}</button></section>}
        {inputPhase && <section className="service-net-message"><h2>{run.phase === SERVICE_NET_PHASES.CHECK_IN ? t.checkIn : t.currentMessage}</h2><code>{inputHint}</code><strong className="structured-cw-decoded">{cw.analysis.decoded || "_"}</strong><small>{save.keyType === "automatic" ? "Z · / X —" : "SPACE"}{run.phase === SERVICE_NET_PHASES.PLAYER_ACK && " · AGN / QRS"} · {cw.analysis.wpm} WPM</small><div><button data-action="service-net-clear" disabled={inputBlocked || leaveOpen || semanticBusy || !windowActive} aria-label={t.cancel} onClick={cw.clearInput}>×</button><button data-action="service-net-submit" disabled={inputBlocked || leaveOpen || !windowActive || semanticBusy || cw.isKeying || !cw.analysis.pulseCount} onClick={() => sendText()}>{t.send}</button></div></section>}
        {run.phase !== SERVICE_NET_PHASES.COMPLETED && run.errors.length > 0 && <p className="service-net-error"><Warning />{t[run.errors.at(-1)]} · {t.errors} {run.currentMessageErrors}/3</p>}
        {run.phase === SERVICE_NET_PHASES.COMPLETED && <section className="service-net-result"><CheckCircle size={44} /><h2>{t.completed}</h2>{settled && <p className="service-net-settlement-banner" role="status">{settledText}</p>}<button data-action="service-net-settle" disabled={inputBlocked || settled || leaveOpen} onClick={settle}>{t.settle}</button>{settled && canContinueChapterEight(save,run.runId) && onContinueStory && <button data-action="continue-chapter-eight" disabled={inputBlocked} onClick={onContinueStory}><BookOpenText />{storyText.continueStory}</button>}</section>}
        {run.phase === SERVICE_NET_PHASES.FAILED && <section className="service-net-result failed"><Warning size={44} /><h2>{t.failed}</h2><p>{t[run.failureReason]}</p><button data-action="service-net-retry" disabled={inputBlocked} onClick={() => update(retryServiceNetRun(run, nowIso()))}>{run.checkedInAt ? t.retry : t.checkIn}</button></section>}
      </article>
    </section>
    {leaveOpen && <div className="modal-backdrop"><section className="service-net-leave-dialog" role="dialog" aria-modal="true"><Warning size={38} /><p>{t.leaveConfirm}</p><button onClick={() => setLeaveOpen(false)}>{t.cancel}</button><button data-action="service-net-confirm-leave" onClick={onBack}>{t.confirmLeave}</button></section></div>}
  </main>;
}

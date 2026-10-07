import { useEffect } from "react";
import { ArrowLeft, CheckCircle, IdentificationCard, Radio, Users, X } from "@phosphor-icons/react";
import { QSL_CHOICES } from "../game/qslRecords.js";
import { FINAL_PROMISE_TEXT } from "./finalPromiseText.js";

import { QSL_TEXT } from "./peopleAndQslText.js";
export { QSL_TEXT } from "./peopleAndQslText.js";

const choiceKey = { believe: "believe", "request-review": "requestReview", defer: "defer" };

export function PeopleAndQslModal({ language, save, onConfirmChoice, onClose }) {
  const t = QSL_TEXT[language] ?? QSL_TEXT.en;
  const records = save.qslRecords ?? [];
  const relationships = save.operatorRelationships ?? [];
  const chapter14 = save.storyContinuationState?.chapter14 ?? {};
  const finalPages = chapter14.archive ?? [];
  const finalText = FINAL_PROMISE_TEXT[language] ?? FINAL_PROMISE_TEXT.en;
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key !== "Escape" || event.repeat) return;
      event.preventDefault();
      onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop people-qsl-backdrop"><section className="people-qsl-modal" data-testid="people-qsl-modal" role="dialog" aria-modal="true">
    <header><Users size={32} weight="fill" /><h2>{t.title}</h2><button className="icon-button" onClick={onClose} aria-label={t.close}><X size={22} /></button></header>
    <div className="people-qsl-columns">
      <section><h3><IdentificationCard />{t.people}</h3><div className="people-list">{relationships.map((relationship) => <article key={relationship.personId}><Radio /><strong>{relationship.lastCallsign ?? relationship.callsign ?? relationship.personId}</strong><small>{t.qsos}: {relationship.completedQsos ?? 0}</small><code>{relationship.personId}</code></article>)}</div></section>
      <section><h3><Radio />{t.cards}</h3>{records.length === 0 ? <p>{t.empty}</p> : <div className="qsl-card-list">{records.map((record) => <article key={record.id} data-qsl-id={record.id}><header><strong>{record.callsign}</strong><code>{record.personId}</code></header><p data-narrative-key={record.playerNarrativeKey}>{t[record.playerNarrativeKey]}</p><p data-narrative-key={record.operatorNarrativeKey}>{t[record.operatorNarrativeKey]}</p><small>{new Date(record.createdAt).toLocaleString(language)}</small>{record.choice ? <><b><CheckCircle />{t.confirmed}: {t[choiceKey[record.choice]]}</b>{window.cwgameSystem?.qaCapture && <button hidden data-action="qa-confirm-qsl-duplicate" onClick={() => onConfirmChoice(record.id, record.choice)}>QA duplicate confirmation</button>}</> : <div>{QSL_CHOICES.map((choice) => <button key={choice} data-qsl-choice={choice} onClick={() => onConfirmChoice(record.id, choice)}>{t[choiceKey[choice]]}</button>)}</div>}</article>)}</div>}</section>
      <section className="final-page-archive"><h3><CheckCircle />{finalText.completed}</h3>{finalPages.length === 0 ? <p>{t.empty}</p> : <div>{finalPages.map((page) => <article key={page.id} data-final-page-run-id={page.runId}><header><strong>{page.targetCallsign}</strong><code>{page.personId}</code></header><p data-final-message-key={page.messageKey}>{finalText[page.messageKey]}</p><small>{new Date(page.completedAt).toLocaleString(language)} · {finalText[page.tone]}</small></article>)}</div>}</section>
    </div>
    <footer><button onClick={onClose}><ArrowLeft />{t.close}</button></footer>
  </section></div>;
}

import { chapterTwoStoryText } from "./chapterTwoStoryText.js";
import { SERVICE_NET_TEXT } from "./serviceNetText.js";
const COPY = {
  "zh-CN": {
    "chapter": "第八章",
    "entry": "第八章 · 城市停电",
    "enter": "开机 · 加入演练台网",
    "finish": "完成第八章 · 领取任务奖励",
    "continueStory": "继续第八章",
    "returnToStory": "返回第八章剧情",
    "complete": "第八章已完成。公共服务任务树已解锁，可以接第九章。",
    "unavailable": "请先完成第七章，再接受本章。旧任务若已达标但演出记录不完整，仍可在任务中心领取。",
    "hint": "先用电键签到，再按队列依次抄收三份报文，发送对应编号和优先级的 ACK 回执。PRI 数字越小，越先处理；同级按原顺序。",
    "resumeHint": "剧情书签、固定报文和回执进度都会保存。设置、离开确认框或窗口失焦会暂停计时；重新进入会接着本轮演练。",
    "recorded": "这里列的是本轮已保存的三份回执，不代表物资已送达。所有台站、城市、机构和物资均为游戏虚构。",
    "reward": "保存演练结果不发资金；本章奖励为 850 资金与 4 科技点，只领取一次。独立成就奖励另计。",
    "receipt": "演练回执",
    "artLabels": {
      "scene": "第八章城市停电场景",
      "portrait": "第八章台网操作员立绘",
      "illustration": "第八章台网演练插画"
    },
    "beats": [
      [
        "先把桌面腾出来",
        "你把上一张 QSL 收进日志，空出一块地方放报文纸。纸张有点滑，压在电键底座下面才不乱跑。",
        "SIM8PS：“今天做停电情境演练。我这边有三份报文，你先签到，咱们一份一份来。”"
      ],
      [
        "别急着抢下一份",
        "你看了一遍队列，在 PRI 那一栏下画了条线。编号用来认报文，不是用来排先后。",
        "SIM8PS：“数字小的先处理；优先级一样，就照原顺序。没抄清楚可以叫我重发，别猜。”"
      ],
      [
        "轮到你签到",
        "你在纸的最上面写下 {player}。耳机线挪到手腕外侧，免得发报时碰到。",
        "签到后，先抄当前报文，再发编号和优先级的回执。这里确认的是收到信息，还不是完成配送。"
      ],
      [
        "三份都对上了",
        "你从第一行往下核对：{messages}。三份回执都已保存，没有把下一份抢到前面。",
        "SIM8PS：“收到了。先别把纸扔了，留着跟日志对一遍。”"
      ],
      [
        "把回执夹好",
        "你将三份回执按刚才的顺序叠好，夹进演练记录。纸角露出一点，下次翻开就能找到。",
        "这轮演练到这里结束。你摘下一边耳机，又看了一眼编号，才把笔盖扣上。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第八章",
    "entry": "第八章 · 城市停電",
    "enter": "開機 · 加入演練臺網",
    "finish": "完成第八章 · 領取任務獎勵",
    "continueStory": "繼續第八章",
    "returnToStory": "返回第八章劇情",
    "complete": "第八章已完成。公共服務任務樹已解鎖，可以接第九章。",
    "unavailable": "請先完成第七章，再接受本章。舊任務若已達標但演出記錄不完整，仍可在任務中心領取。",
    "hint": "先用電鍵簽到，再按佇列依次抄收三份報文，發送對應編號和優先級的 ACK 回執。PRI 數字越小越先處理；同級按原順序。",
    "resumeHint": "劇情書籤、固定報文和回執進度都會儲存。設定、離開確認框或視窗失焦會暫停計時；重新進入會接著本輪演練。",
    "recorded": "這裡列的是本輪已儲存的三份回執，不代表物資已送達。所有臺站、城市、機構和物資均為遊戲虛構。",
    "reward": "儲存演練結果不發資金；本章獎勵為 850 資金與 4 科技點，只領取一次。獨立成就獎勵另計。",
    "receipt": "演練回執",
    "artLabels": {
      "scene": "第八章城市停電場景",
      "portrait": "第八章臺網操作員立繪",
      "illustration": "第八章臺網演練插畫"
    },
    "beats": [
      [
        "先把桌面騰出來",
        "你把上一張 QSL 收進日誌，空出一塊地方放報文紙。紙張有點滑，壓在電鍵底座下面才不亂跑。",
        "SIM8PS：「今天做停電情境演練。我這邊有三份報文，你先簽到，咱們一份一份來。」"
      ],
      [
        "別急著搶下一份",
        "你看了一遍佇列，在 PRI 那一欄下畫了條線。編號用來認報文，不是用來排先後。",
        "SIM8PS：「數字小的先處理；優先級一樣，就照原順序。沒抄清楚可以叫我重發，別猜。」"
      ],
      [
        "輪到你簽到",
        "你在紙的最上面寫下 {player}。耳機線挪到手腕外側，免得發報時碰到。",
        "簽到後，先抄目前報文，再發編號和優先級的回執。這裡確認的是收到資訊，還不是完成配送。"
      ],
      [
        "三份都對上了",
        "你從第一行往下核對：{messages}。三份回執都已儲存，沒有把下一份搶到前面。",
        "SIM8PS：「收到了。先別把紙丟了，留著跟日誌對一遍。」"
      ],
      [
        "把回執夾好",
        "你將三份回執按剛才的順序疊好，夾進演練記錄。紙角露出一點，下次翻開就能找到。",
        "這輪演練到這裡結束。你摘下一邊耳機，又看了一眼編號，才把筆蓋扣上。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Eight",
    "entry": "Chapter Eight · City Blackout",
    "enter": "Switch on · Join the exercise",
    "finish": "Finish Chapter Eight · Claim reward",
    "continueStory": "Continue Chapter Eight",
    "returnToStory": "Back to Chapter Eight",
    "complete": "Chapter Eight is complete. The public-service task tree is unlocked; Chapter Nine is next.",
    "unavailable": "Finish Chapter Seven and accept this chapter first. Older ready missions without the full presentation ledger can still be claimed in the Mission Center.",
    "hint": "Key your check-in, copy each of the three queued messages, then ACK its ID and priority. Lower PRI numbers go first; equal priorities keep their original order.",
    "resumeHint": "The story bookmark, fixed messages and receipts are saved. Settings, the leave dialog and loss of window focus pause the timer. Return to resume the same exercise.",
    "recorded": "These are the three saved receipts from this run, not proof of supply delivery. Every station, city, agency and supply item is fictional.",
    "reward": "Saving the exercise pays no funds. Claim 850 funds and 4 technology points once for this chapter. Separate achievement rewards may also apply.",
    "receipt": "Exercise receipts",
    "artLabels": {
      "scene": "Chapter Eight city blackout scene",
      "portrait": "Chapter Eight net operator portrait",
      "illustration": "Chapter Eight net exercise illustration"
    },
    "beats": [
      [
        "Make room on the desk",
        "You tuck the last QSL into the log and clear a space for message sheets. They keep sliding, so you slip a corner under the key's base.",
        "SIM8PS: “Today's a blackout exercise. I've got three messages here. Check in first, then we'll take them one at a time.”"
      ],
      [
        "One message at a time",
        "You look down the queue and underline PRI. The ID tells you which message it is, not which comes first.",
        "SIM8PS: “Lower number first. If they're equal, keep the original order. Ask me to repeat anything you missed. Don't guess.”"
      ],
      [
        "Your turn to check in",
        "You write {player} at the top of the sheet and move the headphone cable away from your wrist.",
        "After checking in, copy the current message and acknowledge its ID and priority. You're confirming receipt of information, not delivery of supplies."
      ],
      [
        "All three match",
        "You check the lines from the top: {messages}. All three receipts are saved, with no message taken out of order.",
        "SIM8PS: “Got them. Hang on to those sheets a moment. Check them against your log.”"
      ],
      [
        "Keep the receipts",
        "You stack the three receipts in order and tuck them into the exercise record. A corner sticks out so you can find them again.",
        "That's this exercise finished. You lift one earcup, glance at the IDs once more, and cap your pen."
      ]
    ]
  },
  "ja": {
    "chapter": "第八章",
    "entry": "第八章 · 都市停電",
    "enter": "電源を入れる · 訓練ネットへ",
    "finish": "第八章を完了 · 報酬を受け取る",
    "continueStory": "第八章を続ける",
    "returnToStory": "第八章の物語へ戻る",
    "complete": "第八章を完了しました。公共サービスのタスクツリーと第九章が開放されました。",
    "unavailable": "第七章を終えて、この章を受注してください。演出記録が足りない旧データでも、達成済みの任務はミッションセンターで精算できます。",
    "hint": "電鍵でチェックインし、3通を順に受信して番号と優先度を ACK で返します。PRI は小さい数字から。同じ優先度なら元の順番です。",
    "resumeHint": "物語のしおり、固定電文、確認の進捗は保存されます。設定、退出確認、フォーカス喪失中は計時を止め、戻ると同じ訓練を再開します。",
    "recorded": "これは今回保存した3通の受領確認です。物資の配達完了ではありません。局、都市、組織、物資はすべて架空です。",
    "reward": "訓練結果の保存だけでは資金は増えません。章報酬の 850 資金と 4 技術ポイントは一度だけ受け取れます。実績報酬は別です。",
    "receipt": "訓練の受領確認",
    "artLabels": {
      "scene": "第八章の都市停電の背景",
      "portrait": "第八章のネット担当者",
      "illustration": "第八章のネット訓練の挿絵"
    },
    "beats": [
      [
        "机に場所を作る",
        "前の QSL をログにしまい、電文用紙を置く場所を空ける。紙が滑るので、端を電鍵の台に挟んだ。",
        "SIM8PS：「今日は停電を想定した訓練です。こちらに3通あります。まずチェックインして、1通ずついきましょう。」"
      ],
      [
        "次の電文を急がない",
        "一覧を見て、PRI の欄に線を引く。番号は電文を見分けるためのもの。処理の順番ではない。",
        "SIM8PS：「小さい数字から。同じなら元の順番で。聞き取れなければ再送を頼んでください。推測で埋めなくていいです。」"
      ],
      [
        "チェックインの番",
        "紙の上に {player} と書き、手首に当たらないようヘッドホンのコードをよける。",
        "チェックインしたら、現在の電文を受信して番号と優先度を返す。確認するのは情報の受領で、物資の配達ではない。"
      ],
      [
        "3通がそろった",
        "上から照合する。{messages}。3通の受領確認はすべて保存され、順番も合っている。",
        "SIM8PS：「受け取りました。用紙はまだ捨てずに、ログと照らし合わせておいてください。」"
      ],
      [
        "確認用紙を挟む",
        "3枚を今の順番で重ね、訓練記録に挟む。次に見つけやすいよう、角を少し出しておく。",
        "今回の訓練はここまで。ヘッドホンを片耳だけ外し、番号をもう一度見てからペンにキャップをした。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo ocho",
    "entry": "Capítulo ocho · Apagón urbano",
    "enter": "Encender · Entrar al ejercicio",
    "finish": "Terminar el capítulo ocho · Cobrar",
    "continueStory": "Continuar el capítulo ocho",
    "returnToStory": "Volver a la historia del capítulo ocho",
    "complete": "Capítulo ocho completado. Se desbloquearon las tareas de servicio público y el capítulo nueve.",
    "unavailable": "Termina el capítulo siete y acepta este capítulo. Las misiones antiguas ya cumplidas sin todo el registro de presentación aún pueden cobrarse en el Centro de misiones.",
    "hint": "Regístrate con el manipulador, copia los tres mensajes por orden y confirma cada ID y prioridad con ACK. El PRI más bajo va primero; los empates conservan el orden original.",
    "resumeHint": "Se guardan el punto de lectura, los mensajes fijos y los acuses. Los ajustes, el diálogo de salida y la pérdida de foco pausan el reloj. Al volver retomas el mismo ejercicio.",
    "recorded": "Estos son los tres acuses guardados de esta ronda, no una confirmación de entrega de suministros. Todas las estaciones, ciudades, entidades y provisiones son ficticias.",
    "reward": "Guardar el ejercicio no da fondos. La recompensa del capítulo es de 850 fondos y 4 puntos tecnológicos, una sola vez. Los logros se pagan aparte.",
    "receipt": "Acuses del ejercicio",
    "artLabels": {
      "scene": "Escena del apagón del capítulo ocho",
      "portrait": "Operador de la red del capítulo ocho",
      "illustration": "Ilustración del ejercicio de red del capítulo ocho"
    },
    "beats": [
      [
        "Hacer sitio en la mesa",
        "Guardas la última QSL en el registro y apartas unas cosas para poner las hojas. Se resbalan; metes una esquina bajo la base del manipulador.",
        "SIM8PS: «Hoy simulamos un apagón. Tengo tres mensajes. Regístrate primero y los vamos viendo uno a uno.»"
      ],
      [
        "Sin saltarse ninguno",
        "Repasas la cola y subrayas PRI. El número de mensaje sirve para identificarlo, no para decidir cuál va antes.",
        "SIM8PS: «Primero el número de prioridad más bajo. Si coinciden, conserva el orden. Pide que repita lo que no hayas copiado. No lo adivines.»"
      ],
      [
        "Te toca registrarte",
        "Escribes {player} arriba de la hoja y apartas el cable de los auriculares de la muñeca.",
        "Tras registrarte, copia el mensaje actual y confirma su ID y prioridad. Confirmas que recibiste la información, no que llegaron los suministros."
      ],
      [
        "Los tres coinciden",
        "Compruebas las líneas desde arriba: {messages}. Los tres acuses están guardados y ninguno se adelantó.",
        "SIM8PS: «Recibidos. No tires aún esas hojas; compáralas con tu registro.»"
      ],
      [
        "Guardar los acuses",
        "Apilas los tres acuses en orden y los metes entre las páginas del ejercicio. Dejas una esquina fuera para encontrarlos luego.",
        "El ejercicio termina aquí. Levantas un auricular, miras otra vez los números y tapas el bolígrafo."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel Acht",
    "entry": "Kapitel Acht · Stromausfall",
    "enter": "Einschalten · An der Übung teilnehmen",
    "finish": "Kapitel Acht abschließen · Belohnung",
    "continueStory": "Kapitel Acht fortsetzen",
    "returnToStory": "Zurück zur Geschichte von Kapitel Acht",
    "complete": "Kapitel Acht ist abgeschlossen. Öffentliche Dienstaufgaben und Kapitel Neun sind freigeschaltet.",
    "unavailable": "Schließe Kapitel Sieben ab und nimm dieses Kapitel an. Ältere erfüllte Aufgaben ohne vollständige Szenenbelege lassen sich weiterhin in der Missionszentrale abrechnen.",
    "hint": "Melde dich mit der Taste an, nimm die drei Meldungen der Reihe nach auf und bestätige jeweils ID und Priorität mit ACK. Niedrige PRI zuerst; bei Gleichstand gilt die ursprüngliche Reihenfolge.",
    "resumeHint": "Leseposition, feste Meldungen und Bestätigungen werden gespeichert. Einstellungen, Verlassen-Dialog und Fokusverlust pausieren die Uhr. Danach setzt du dieselbe Übung fort.",
    "recorded": "Dies sind die drei gespeicherten Empfangsbestätigungen dieser Runde, keine Lieferbelege. Alle Stationen, Städte, Stellen und Güter sind fiktiv.",
    "reward": "Das Speichern der Übung bringt kein Geld. Einmalige Kapitelbelohnung: 850 Geld und 4 Technikpunkte. Erfolge werden getrennt belohnt.",
    "receipt": "Übungsbestätigungen",
    "artLabels": {
      "scene": "Stromausfallszene in Kapitel Acht",
      "portrait": "Netzleitstelle in Kapitel Acht",
      "illustration": "Netzübung in Kapitel Acht"
    },
    "beats": [
      [
        "Platz auf dem Tisch",
        "Du steckst die letzte QSL ins Logbuch und schaffst Platz für die Meldeblätter. Sie rutschen weg. Eine Ecke unter dem Tastenfuß hält sie fest.",
        "SIM8PS: „Heute üben wir einen Stromausfall. Hier liegen drei Meldungen. Melde dich erst an, dann gehen wir sie einzeln durch.“"
      ],
      [
        "Keine Meldung vorziehen",
        "Du schaust auf die Liste und unterstreichst PRI. Die Meldungsnummer sagt dir, welche Meldung es ist, nicht, wann sie drankommt.",
        "SIM8PS: „Niedrige Prioritätszahl zuerst. Bei Gleichstand bleibt die Reihenfolge. Wenn etwas fehlt, lass es wiederholen. Nicht raten.“"
      ],
      [
        "Du bist mit der Anmeldung dran",
        "Du schreibst {player} oben auf das Blatt und legst das Kopfhörerkabel neben dein Handgelenk.",
        "Nach der Anmeldung nimmst du die aktuelle Meldung auf und bestätigst ID und Priorität. Du bestätigst den Empfang der Information, keine Lieferung."
      ],
      [
        "Alle drei stimmen",
        "Du prüfst die Zeilen von oben: {messages}. Alle drei Bestätigungen sind gespeichert, in der richtigen Reihenfolge.",
        "SIM8PS: „Angekommen. Heb die Blätter noch auf und gleiche sie mit deinem Logbuch ab.“"
      ],
      [
        "Die Belege ablegen",
        "Du stapelst die drei Bestätigungen der Reihe nach und legst sie in die Übungsaufzeichnung. Eine Ecke lässt du herausschauen.",
        "Damit ist die Übung beendet. Du nimmst eine Kopfhörermuschel ab, prüfst noch einmal die Nummern und setzt die Kappe auf den Stift."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава восемь",
    "entry": "Глава восемь · Отключение города",
    "enter": "Включить станцию · Начать учения",
    "finish": "Завершить главу восемь · Награда",
    "continueStory": "Продолжить главу восемь",
    "returnToStory": "Вернуться к истории главы восемь",
    "complete": "Глава восемь завершена. Открыты задания общественной службы и глава девять.",
    "unavailable": "Сначала завершите главу семь и примите это задание. Старые выполненные задания без всех записей для сцен можно сдать в Центре заданий.",
    "hint": "Зарегистрируйтесь ключом, примите три сообщения по очереди и подтвердите номер и приоритет каждого через ACK. Сначала меньший PRI; при равенстве сохраняется исходный порядок.",
    "resumeHint": "Место в истории, фиксированные сообщения и квитанции сохраняются. Настройки, окно выхода и потеря фокуса останавливают таймер. Вернувшись, вы продолжите те же учения.",
    "recorded": "Здесь три сохранённые квитанции этой попытки, а не подтверждения доставки. Все станции, города, организации и запасы вымышлены.",
    "reward": "Сохранение учений не приносит денег. Награда главы: 850 денег и 4 очка технологий, один раз. Награды за достижения учитываются отдельно.",
    "receipt": "Учебные квитанции",
    "artLabels": {
      "scene": "Сцена отключения города в главе восемь",
      "portrait": "Оператор учебной сети главы восемь",
      "illustration": "Иллюстрация учений главы восемь"
    },
    "beats": [
      [
        "Освободить место",
        "Ты убираешь последнюю QSL в журнал и освобождаешь место для бланков. Бумага скользит; прижимаешь угол основанием ключа.",
        "SIM8PS: «Сегодня учения на случай отключения. У меня три сообщения. Сначала зарегистрируйся, потом разберём их по одному.»"
      ],
      [
        "Не перескакивать дальше",
        "Ты просматриваешь очередь и подчёркиваешь PRI. Номер помогает узнать сообщение, но не определяет его очередь.",
        "SIM8PS: «Сначала меньший приоритет. Если одинаковый, оставляй исходный порядок. Не разобрал — попроси повторить. Не угадывай.»"
      ],
      [
        "Твоя очередь регистрироваться",
        "Ты пишешь {player} вверху листа и убираешь провод наушников от запястья.",
        "После регистрации прими текущее сообщение и подтверди его номер и приоритет. Это подтверждение получения информации, а не доставки запасов."
      ],
      [
        "Все три сошлись",
        "Ты проверяешь строки сверху вниз: {messages}. Три квитанции сохранены, порядок не нарушен.",
        "SIM8PS: «Получил. Листы пока не выбрасывай, сверь их с журналом.»"
      ],
      [
        "Подшить квитанции",
        "Ты складываешь три квитанции по порядку и вкладываешь в запись об учениях. Уголок оставляешь снаружи, чтобы потом найти.",
        "На этом учения закончены. Ты снимаешь один наушник, ещё раз смотришь на номера и закрываешь ручку."
      ]
    ]
  }
};
const IDS = ["briefing","queue","checkin","receipts","log"], ASSETS = ["scene","scene","illustration","portrait","scene"];
export const CHAPTER_EIGHT_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterEightStoryText(language) {
  const t = COPY[language] ?? COPY.en, activity = SERVICE_NET_TEXT[language] ?? SERVICE_NET_TEXT.en;
  return { ...chapterTwoStoryText(language), ...t, title: activity.title, simulationWarning: activity.simulationWarning,
    beats: t.beats.map(([title,...paragraphs],index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })) };
}

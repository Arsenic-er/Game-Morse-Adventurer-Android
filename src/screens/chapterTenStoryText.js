import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {CONTEST_TEXT} from "./contestText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十章",
    "entry": "第十章 · 五分钟竞赛",
    "enter": "开机 · 进入竞赛",
    "finish": "完成第十章 · 领取任务奖励",
    "continueStory": "继续第十章",
    "returnToStory": "返回第十章剧情",
    "complete": "第十章已完成。竞赛重玩已开放，可以接第十一章。",
    "unavailable": "请先完成第九章，再接受本章。旧任务若已达标但演出记录不完整，仍可在任务中心领取。",
    "hint": "五分钟内完成至少 6 个不同台站，RUN 和 S&P 各至少 2 个，覆盖至少 3 个地区。用电键发送呼号、RST、流水号、地区和功率。满足条件后可以提前结束。",
    "resumeHint": "流水号、台站池和有效计时会保存。设置、离开确认或窗口失焦时暂停；回来后继续同一局。AGN / QRS 也需要发报。",
    "recorded": "下面是本轮已结算成绩和通联，不是个人最好成绩或实时排名。",
    "reward": "保存竞赛成绩不发资金；本章奖励为 1100 资金与 5 科技点，只领取一次。独立成就奖励另计。",
    "recordLabel": "本轮竞赛记录",
    "artLabels": {
      "scene": "第十章竞赛台站",
      "portrait": "第十章竞赛操作员",
      "illustration": "第十章核对流水号的插画"
    },
    "beats": [
      [
        "先把钟摆好",
        "你把计时器挪到电台旁边。它挡住了一角日志，推开一点，又够得着了。",
        "SIM0CT：“选好模式再开始。五分钟，抄清楚一台就记一台。”"
      ],
      [
        "守着叫，还是去找",
        "RUN 是留在这里呼叫，S&P 是去找正在呼叫的台站。你在纸上各画了一栏。",
        "SIM0CT：“两种都试试。已经联过的别再算，换模式时看一眼日志。”"
      ],
      [
        "从 001 开始",
        "你在页眉写下 {player}，把流水号第一格留出来。手指停在电键上，另一只手扶着纸。",
        "先选模式，再按提示发报。数字错了可以重发；还没核对完，别急着把流水号往下挪。"
      ],
      [
        "把手放开",
        "这一局保存了 {contacts} 个通联，覆盖 {regions} 个地区。RUN {runCount} 个，S&P {spCount} 个，得分 {score}。",
        "SIM0CT：“先歇一下。要看哪里耽搁了，就翻刚才那一页，不用凭感觉猜。”"
      ],
      [
        "留下这一局",
        "你沿着流水号往下看，把最后一行的呼号又读了一遍。这一局已经单独存好。",
        "计时器还在桌角。你没有立刻重开，把纸压平，先让手腕松一会儿。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十章",
    "entry": "第十章 · 五分鐘競賽",
    "enter": "開機 · 進入競賽",
    "finish": "完成第十章 · 領取任務獎勵",
    "continueStory": "繼續第十章",
    "returnToStory": "返回第十章劇情",
    "complete": "第十章已完成。競賽重玩已開放，可以接第十一章。",
    "unavailable": "請先完成第九章，再接受本章。舊任務若已達標但演出記錄不完整，仍可在任務中心領取。",
    "hint": "五分鐘內完成至少 6 個不同台站，RUN 和 S&P 各至少 2 個，涵蓋至少 3 個地區。用電鍵發送呼號、RST、流水號、地區和功率。達標後可提早結束。",
    "resumeHint": "流水號、台站池和有效計時會儲存。設定、離開確認或視窗失焦時暫停；回來繼續同一局。AGN / QRS 也要發報。",
    "recorded": "以下是本局已結算成績和通聯，不是個人最佳成績或即時排名。",
    "reward": "儲存競賽成績不發資金；本章獎勵為 1100 資金與 5 科技點，只領一次。獨立成就獎勵另計。",
    "recordLabel": "本局競賽記錄",
    "artLabels": {
      "scene": "第十章競賽台站",
      "portrait": "第十章競賽操作員",
      "illustration": "第十章核對流水號的插畫"
    },
    "beats": [
      [
        "先把鐘擺好",
        "你把計時器挪到電台旁。它擋住一角日誌，推開一點，又夠得著了。",
        "SIM0CT：「選好模式再開始。五分鐘，抄清楚一台就記一台。」"
      ],
      [
        "守著叫，還是去找",
        "RUN 是留在這裡呼叫，S&P 是去找正在呼叫的台站。你在紙上各畫一欄。",
        "SIM0CT：「兩種都試試。已聯過的別再算，換模式時看一眼日誌。」"
      ],
      [
        "從 001 開始",
        "你在頁首寫下 {player}，把流水號第一格留出來。手指停在電鍵上，另一手扶著紙。",
        "先選模式，再按提示發報。數字錯了可以重發；還沒核對完，別急著往下挪流水號。"
      ],
      [
        "把手放開",
        "這局儲存了 {contacts} 個通聯，涵蓋 {regions} 個地區。RUN {runCount} 個，S&P {spCount} 個，得分 {score}。",
        "SIM0CT：「先歇一下。想看哪裡耽擱了，就翻剛才那頁，不用憑感覺猜。」"
      ],
      [
        "留下這一局",
        "你沿著流水號往下看，把最後一行呼號又讀了一遍。這一局已經單獨存好。",
        "計時器還在桌角。你沒立刻重開，把紙壓平，先讓手腕鬆一會兒。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Ten",
    "entry": "Chapter Ten · Five-minute contest",
    "enter": "Power on · Enter contest",
    "finish": "Finish Chapter Ten · Claim reward",
    "continueStory": "Continue Chapter Ten",
    "returnToStory": "Return to Chapter Ten",
    "complete": "Chapter Ten is complete. Contest replay and Chapter Eleven are available.",
    "unavailable": "Complete Chapter Nine and accept this chapter first. Eligible older tasks can still be claimed in the mission center if story records are missing.",
    "hint": "In five minutes, work 6 different stations, including at least 2 RUN and 2 S&P contacts across 3 regions. Key the callsign, RST, serial, region and power. You may finish early once eligible.",
    "resumeHint": "The serial, station pool and active timer are saved. Settings, the leave dialog and loss of focus pause the round. AGN / QRS must also be keyed.",
    "recorded": "This is the settled record for this round, not your personal best or a live ranking.",
    "reward": "Saving the result pays no credits. The chapter awards 1100 credits and 5 technology points once; separate achievement rewards may apply.",
    "recordLabel": "This contest round",
    "artLabels": {
      "scene": "Chapter Ten contest station",
      "portrait": "Chapter Ten contest operator",
      "illustration": "Chapter Ten serial-number check"
    },
    "beats": [
      [
        "Put the clock within reach",
        "You move the timer beside the radio. It covers a corner of the log. A small nudge makes room for both.",
        "SIM0CT: “Choose a mode when you're ready. Five minutes. Log each station once you've copied it.”"
      ],
      [
        "Call here, or go looking",
        "RUN means staying to call; S&P means finding stations already calling. You draw a column for each.",
        "SIM0CT: “Try both. Don't count a station twice. Check the log when you switch.”"
      ],
      [
        "Start at 001",
        "You write {player} at the top and leave the first serial box open. One hand rests at the key; the other holds the paper.",
        "Choose a mode and key the exchange shown. You can correct a number. Keep the serial where it is until the exchange checks out."
      ],
      [
        "Hands off the key",
        "This round saved {contacts} contacts across {regions} regions: {runCount} RUN and {spCount} S&P. The score is {score}.",
        "SIM0CT: “Take a breather. If you want to see where you slowed down, check that page. No need to guess.”"
      ],
      [
        "Keep this round",
        "You follow the serial numbers down the page and read the last callsign again. This round has its own saved record.",
        "The timer is still on the corner of the desk. You flatten the paper and let your wrist rest before starting again."
      ]
    ]
  },
  "ja": {
    "chapter": "第十章",
    "entry": "第十章 · 5分間コンテスト",
    "enter": "電源を入れる · コンテストへ",
    "finish": "第十章を完了 · 報酬を受け取る",
    "continueStory": "第十章の続きを見る",
    "returnToStory": "第十章の物語へ戻る",
    "complete": "第十章完了。コンテストの再挑戦と第十一章が開放されました。",
    "unavailable": "第九章を終えて、この章を受注してください。演出記録がない旧タスクでも、条件を満たせばタスク画面で受領できます。",
    "hint": "5分以内に異なる6局と交信。RUNとS&Pを各2局以上、3地域以上が必要です。呼出符号、RST、連番、地域、出力を電鍵で送信します。条件達成後は早めに終了できます。",
    "resumeHint": "連番、局の一覧、有効時間は保存されます。設定、退出確認、フォーカス喪失中は停止。AGN / QRSも電鍵で送信します。",
    "recorded": "今回の確定記録です。自己ベストやリアルタイム順位ではありません。",
    "reward": "成績保存による資金はありません。章報酬は1100資金と5技術点で、一度のみ。実績報酬は別です。",
    "recordLabel": "今回のコンテスト記録",
    "artLabels": {
      "scene": "第十章のコンテスト局",
      "portrait": "第十章のオペレーター",
      "illustration": "第十章の連番確認"
    },
    "beats": [
      [
        "時計の置き場所",
        "タイマーを無線機の隣へ動かす。ログの端が隠れたので、少しだけずらした。",
        "SIM0CT：「モードを選んだら始めよう。5分間。聞き取れた局から記録してね。」"
      ],
      [
        "呼ぶか、探すか",
        "RUNはここで呼び続ける。S&Pは呼んでいる局を探す。紙にそれぞれの欄を作った。",
        "SIM0CT：「両方やってみて。同じ局は二度数えない。切り替える前にログを見てね。」"
      ],
      [
        "001から",
        "ページの上に{player}と書き、最初の連番欄を空ける。片手を電鍵へ、もう片方を紙に添えた。",
        "モードを選び、表示された交換文を送る。数字を間違えたら送り直せる。確認が済むまで連番は進めない。"
      ],
      [
        "手を離して",
        "今回の記録は{contacts}交信、{regions}地域。RUNが{runCount}、S&Pが{spCount}、得点は{score}。",
        "SIM0CT：「ひと息つこう。どこで時間がかかったかは、今のページで確かめればいいよ。」"
      ],
      [
        "この一局分を残す",
        "連番を上からたどり、最後の呼出符号をもう一度読む。今回の記録は独立して保存されている。",
        "タイマーは机の隅にある。すぐには再開せず、紙を伸ばして手首を休めた。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo diez",
    "entry": "Capítulo diez · Concurso de cinco minutos",
    "enter": "Encender · Entrar al concurso",
    "finish": "Terminar el capítulo diez · Cobrar",
    "continueStory": "Continuar el capítulo diez",
    "returnToStory": "Volver al capítulo diez",
    "complete": "Capítulo diez completado. Puedes repetir el concurso y aceptar el capítulo once.",
    "unavailable": "Completa el capítulo nueve y acepta este. Las tareas antiguas elegibles se pueden cobrar en el centro de misiones aunque falten registros narrativos.",
    "hint": "En cinco minutos, contacta con 6 estaciones distintas: al menos 2 en RUN y 2 en S&P, de 3 regiones. Transmite indicativo, RST, número, región y potencia. Puedes terminar al cumplir los requisitos.",
    "resumeHint": "Se guardan el número, las estaciones y el tiempo activo. Ajustes, confirmación de salida y pérdida de foco pausan la ronda. AGN / QRS también se transmiten con el manipulador.",
    "recorded": "Es el resultado guardado de esta ronda, no tu récord ni una clasificación en directo.",
    "reward": "Guardar el resultado no da créditos. El capítulo otorga 1100 créditos y 5 puntos tecnológicos una sola vez; los logros se premian aparte.",
    "recordLabel": "Registro de esta ronda",
    "artLabels": {
      "scene": "Estación de concurso del capítulo diez",
      "portrait": "Operador del capítulo diez",
      "illustration": "Comprobación del número de serie"
    },
    "beats": [
      [
        "El reloj, a mano",
        "Pones el temporizador junto a la radio. Tapa una esquina del registro; lo apartas un poco.",
        "SIM0CT: «Elige un modo cuando estés listo. Cinco minutos. Apunta cada estación cuando la hayas copiado.»"
      ],
      [
        "Llamar o buscar",
        "En RUN te quedas llamando. En S&P buscas estaciones que ya llaman. Dibujas una columna para cada modo.",
        "SIM0CT: «Prueba los dos. No cuentes una estación dos veces. Mira el registro al cambiar.»"
      ],
      [
        "Empieza por 001",
        "Escribes {player} arriba y dejas libre la primera casilla. Una mano espera en el manipulador; la otra sujeta el papel.",
        "Elige modo y transmite el intercambio indicado. Si te equivocas en un número, repítelo. No avances la serie antes de comprobarlo."
      ],
      [
        "Suelta el manipulador",
        "Esta ronda guarda {contacts} contactos en {regions} regiones: {runCount} RUN y {spCount} S&P. Puntuación: {score}.",
        "SIM0CT: «Descansa un poco. Si quieres ver dónde tardaste, mira esa página. No hace falta adivinar.»"
      ],
      [
        "Conserva esta ronda",
        "Sigues los números hasta abajo y lees otra vez el último indicativo. Esta ronda tiene su propio registro.",
        "El temporizador sigue en la esquina. Alisas el papel y descansas la muñeca antes de volver a empezar."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel zehn",
    "entry": "Kapitel zehn · Fünf-Minuten-Contest",
    "enter": "Einschalten · Contest starten",
    "finish": "Kapitel zehn abschließen · Belohnung",
    "continueStory": "Kapitel zehn fortsetzen",
    "returnToStory": "Zurück zu Kapitel zehn",
    "complete": "Kapitel zehn ist abgeschlossen. Contest-Wiederholung und Kapitel elf sind verfügbar.",
    "unavailable": "Schließe Kapitel neun ab und nimm diesen Auftrag an. Erfüllte ältere Aufträge bleiben bei fehlenden Story-Belegen in der Missionszentrale einlösbar.",
    "hint": "Arbeite in fünf Minuten 6 verschiedene Stationen: mindestens je 2 in RUN und S&P aus 3 Regionen. Taste Rufzeichen, RST, Nummer, Region und Leistung. Danach ist ein früher Abschluss möglich.",
    "resumeHint": "Nummer, Stationspool und aktive Zeit werden gespeichert. Einstellungen, Verlassen-Dialog und Fokusverlust pausieren die Runde. Auch AGN / QRS werden getastet.",
    "recorded": "Dies ist die gespeicherte Runde, nicht deine Bestleistung oder eine Live-Rangliste.",
    "reward": "Das Speichern zahlt nichts aus. Das Kapitel vergibt einmalig 1100 Credits und 5 Technologiepunkte. Erfolge werden gesondert belohnt.",
    "recordLabel": "Diese Contest-Runde",
    "artLabels": {
      "scene": "Contest-Station in Kapitel zehn",
      "portrait": "Operator in Kapitel zehn",
      "illustration": "Prüfung der laufenden Nummer"
    },
    "beats": [
      [
        "Die Uhr griffbereit",
        "Du stellst den Timer neben das Funkgerät. Er verdeckt eine Ecke des Logs. Ein kleiner Schubs schafft Platz.",
        "SIM0CT: „Wähle einen Modus, wenn du bereit bist. Fünf Minuten. Schreib jede Station auf, sobald du sie aufgenommen hast.“"
      ],
      [
        "Rufen oder suchen",
        "Im RUN bleibst du und rufst. Im S&P suchst du rufende Stationen. Du zeichnest für beide eine Spalte.",
        "SIM0CT: „Probier beides. Zähl keine Station doppelt. Schau beim Wechsel ins Log.“"
      ],
      [
        "Beginn bei 001",
        "Du schreibst {player} an den oberen Rand und lässt das erste Nummernfeld frei. Eine Hand liegt an der Taste, die andere hält das Blatt.",
        "Wähle den Modus und taste den angezeigten Austausch. Falsche Zahlen kannst du wiederholen. Die Nummer bleibt, bis der Austausch stimmt."
      ],
      [
        "Hand von der Taste",
        "Gespeichert sind {contacts} Kontakte aus {regions} Regionen: {runCount} RUN und {spCount} S&P. Punktzahl: {score}.",
        "SIM0CT: „Mach kurz Pause. Wenn du wissen willst, wo du Zeit gebraucht hast, schau auf die Seite. Du musst nicht raten.“"
      ],
      [
        "Diese Runde behalten",
        "Du gehst die Nummern durch und liest das letzte Rufzeichen noch einmal. Die Runde ist einzeln gespeichert.",
        "Der Timer steht noch an der Ecke. Du streichst das Papier glatt und lässt dein Handgelenk ruhen, bevor es weitergeht."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава десятая",
    "entry": "Глава десятая · Пятиминутный контест",
    "enter": "Включить · Начать контест",
    "finish": "Завершить главу десять · Награда",
    "continueStory": "Продолжить главу десять",
    "returnToStory": "Вернуться к главе десять",
    "complete": "Глава десятая завершена. Открыты повтор контеста и глава одиннадцать.",
    "unavailable": "Завершите главу девять и примите эту. Старые выполненные задания можно получить в центре миссий, даже если записи сцен отсутствуют.",
    "hint": "За пять минут проведите 6 связей с разными станциями: минимум по 2 RUN и S&P, охватив 3 региона. Передайте позывной, RST, номер, регион и мощность. После выполнения условий можно закончить раньше.",
    "resumeHint": "Номер, набор станций и активное время сохраняются. Настройки, подтверждение выхода и потеря фокуса ставят раунд на паузу. AGN / QRS тоже передаются ключом.",
    "recorded": "Это сохранённый результат данного раунда, а не личный рекорд или текущий рейтинг.",
    "reward": "Сохранение результата не приносит средств. Награда главы — 1100 средств и 5 очков технологий один раз. Награды достижений считаются отдельно.",
    "recordLabel": "Запись этого раунда",
    "artLabels": {
      "scene": "Контест-станция десятой главы",
      "portrait": "Оператор десятой главы",
      "illustration": "Проверка порядкового номера"
    },
    "beats": [
      [
        "Часы под рукой",
        "Ты ставишь таймер рядом с радио. Он закрывает угол журнала. Чуть сдвигаешь — теперь места хватает.",
        "SIM0CT: «Выбирай режим, когда будешь готов. Пять минут. Принял станцию — запиши.»"
      ],
      [
        "Вызывать или искать",
        "В RUN ты остаёшься и вызываешь. В S&P ищешь уже вызывающие станции. На бумаге появляются две колонки.",
        "SIM0CT: «Попробуй оба. Одну станцию дважды не считай. При смене режима заглядывай в журнал.»"
      ],
      [
        "Начни с 001",
        "Ты пишешь {player} сверху и оставляешь первую ячейку номера пустой. Одна рука у ключа, другая держит лист.",
        "Выбери режим и передай указанный обмен. Ошибочную цифру можно повторить. Не меняй номер до проверки."
      ],
      [
        "Отпусти ключ",
        "В раунде сохранено {contacts} связей из {regions} регионов: RUN — {runCount}, S&P — {spCount}. Счёт: {score}.",
        "SIM0CT: «Передохни. Хочешь понять, где задержался, — посмотри эту страницу. Гадать не надо.»"
      ],
      [
        "Оставь этот раунд",
        "Ты идёшь по номерам вниз и ещё раз читаешь последний позывной. У этого раунда отдельная запись.",
        "Таймер стоит на краю стола. Ты расправляешь лист и даёшь запястью отдохнуть, не начиная сразу заново."
      ]
    ]
  }
};
const IDS=["clock","modes","exchange","result","log"],ASSETS=["scene","scene","illustration","portrait","scene"];
export const CHAPTER_TEN_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterTenStoryText(language){
 const t=COPY[language]??COPY.en,activity=CONTEST_TEXT[language]??CONTEST_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,simulationWarning:activity.simulationWarning,
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

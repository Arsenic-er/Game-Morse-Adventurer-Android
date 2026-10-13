import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {STORM_RELAY_TEXT} from "./stormRelayText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十二章",
    "entry": "第十二章 · 风暴中继",
    "enter": "开机 · 接入中继",
    "finish": "完成第十二章 · 领取任务奖励",
    "continueStory": "继续第十二章",
    "returnToStory": "返回第十二章剧情",
    "complete": "第十二章已完成。风暴中继重玩与第十三章已开放。",
    "unavailable": "请先完成第十一章并接受本章。符合条件的旧任务仍可在任务中心领取。",
    "hint": "用电键向 SIM12CS 报到，接收两份冲突报文。向源台请求修订核实后，再把已核实的整份报文转给 SIM12RL。AGN / QRS 可请求重复。",
    "resumeHint": "阶段、报文和有效计时会保存。设置、离开确认与窗口失焦时暂停，返回后接着本轮操作。",
    "recorded": "这里确认的是报文已核实并转报，不代表物资已经送达。两条事件联络均为零收益。",
    "reward": "本章任务奖励为 1350 资金与 6 科技点，只领取一次；独立成就奖励另计。",
    "recordLabel": "本次风暴记录",
    "artLabels": {
      "scene": "第十二章风暴中的台站",
      "portrait": "第十二章中继人员立绘",
      "illustration": "第十二章冲突报文插画"
    },
    "beats": [
      [
        "先把纸压住",
        "雨敲着窗沿。你把卷起的纸角压在日志本下，腾出一块能写字的地方。",
        "上一轮没有收到回复。这次，接入单上列着两个呼号：SIM12CS 和 SIM12RL。先向主控台报到。"
      ],
      [
        "同一个编号",
        "待收清单上，214 号出现了两次。你在旁边留了两行，没有急着把它们并成一份。",
        "两份旧报文的人数对不上。得问清楚用哪一版，不能挑一个看着顺眼的数字继续发。"
      ],
      [
        "回头问源台",
        "你在发送栏写下 {player}，又把“核实修订”圈了一下。窗外亮过一瞬，笔还停在纸上。",
        "先接收，再问源台。得到新版后，从编号到校验值逐项转报；需要再核对，就请求重复。"
      ],
      [
        "把旧版放在一旁",
        "本次保存的报文是 MSG {msgId}，REV {revision}：{grid}，{people} 人，{item}，数量 {quantity}，CHECK {check}。",
        "你在旧版旁标上“不再转发”。新的一行已经核实并转出，不用再凭记忆补哪一个数字。"
      ],
      [
        "这一页写到转报为止",
        "你核对了 SIM12CS 和 SIM12RL 的两条事件联络，把本次记录编号记在页边。",
        "笔尖停在“送达”那一栏前。你只知道报文转出去了；物资到了没有，不能替对方填。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十二章",
    "entry": "第十二章 · 風暴中繼",
    "enter": "開機 · 接入中繼",
    "finish": "完成第十二章 · 領取任務獎勵",
    "continueStory": "繼續第十二章",
    "returnToStory": "返回第十二章劇情",
    "complete": "第十二章已完成。風暴中繼重玩與第十三章已開放。",
    "unavailable": "請先完成第十一章並接受本章。符合條件的舊任務仍可在任務中心領取。",
    "hint": "用電鍵向 SIM12CS 報到，接收兩份衝突報文。向源臺請求修訂核實後，把已核實的整份報文轉給 SIM12RL。AGN / QRS 可請求重複。",
    "resumeHint": "階段、報文與有效計時會儲存。設定、離開確認及視窗失焦時暫停，返回後繼續本輪。",
    "recorded": "這裡確認報文已核實並轉報，不代表物資已送達。兩筆事件聯絡皆為零收益。",
    "reward": "本章任務獎勵為 1350 資金與 6 科技點，只領一次；獨立成就獎勵另計。",
    "recordLabel": "本次風暴記錄",
    "artLabels": {
      "scene": "第十二章風暴中的臺站",
      "portrait": "第十二章中繼人員立繪",
      "illustration": "第十二章衝突報文插畫"
    },
    "beats": [
      [
        "先把紙壓住",
        "雨敲著窗沿。你把捲起的紙角壓在日誌本下，騰出能寫字的地方。",
        "上一輪沒收到回覆。這次的接入單列了兩個呼號：SIM12CS 和 SIM12RL。先向主控臺報到。"
      ],
      [
        "同一個編號",
        "待收清單上，214 號出現兩次。你在旁邊留了兩行，沒急著併成一份。",
        "兩份舊報文的人數對不上。得問清楚用哪一版，不能挑個順眼的數字繼續發。"
      ],
      [
        "回頭問源臺",
        "你在發送欄寫下 {player}，又把「核實修訂」圈起來。窗外亮了一瞬，筆還停在紙上。",
        "先接收，再問源臺。拿到新版後，從編號到校驗值逐項轉報；需要再核對就請求重複。"
      ],
      [
        "把舊版放一旁",
        "本次儲存的報文是 MSG {msgId}，REV {revision}：{grid}，{people} 人，{item}，數量 {quantity}，CHECK {check}。",
        "你在舊版旁標上「不再轉發」。新的一行已核實並轉出，不用再憑記憶補數字。"
      ],
      [
        "這頁寫到轉報為止",
        "你核對 SIM12CS 與 SIM12RL 的兩筆事件聯絡，把本次記錄編號寫在頁邊。",
        "筆尖停在「送達」欄前。你只知道報文轉出去了；物資到了沒有，不能替對方填。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Twelve",
    "entry": "Chapter Twelve · The Storm Relay",
    "enter": "Power on · Join the relay",
    "finish": "Finish Chapter Twelve · Claim reward",
    "continueStory": "Continue Chapter Twelve",
    "returnToStory": "Return to Chapter Twelve",
    "complete": "Chapter Twelve is complete. Storm replay and Chapter Thirteen are available.",
    "unavailable": "Complete Chapter Eleven and accept this chapter first. Eligible older tasks can still be claimed in the mission center.",
    "hint": "Key a check-in to SIM12CS and receive the conflicting copies. Ask the source to verify the revision, then relay the whole verified packet to SIM12RL. AGN / QRS requests a repeat.",
    "resumeHint": "Phase, packet and active time are saved. Settings, the leave dialog and loss of focus pause the attempt; return to resume it.",
    "recorded": "This confirms a verified relay, not delivery of supplies. Both event contacts award zero credits.",
    "reward": "The chapter awards 1350 credits and 6 technology points once. Separate achievement rewards may apply.",
    "recordLabel": "This storm record",
    "artLabels": {
      "scene": "Chapter Twelve storm station",
      "portrait": "Chapter Twelve relay operator",
      "illustration": "Chapter Twelve conflicting copies"
    },
    "beats": [
      [
        "Hold the paper down",
        "Rain taps the window ledge. You tuck the curling corner beneath the logbook and clear a space to write.",
        "The last attempt brought no reply. This check-in sheet lists two callsigns: SIM12CS and SIM12RL. Control comes first."
      ],
      [
        "The same message number",
        "Message 214 appears twice in the queue. You leave two lines beside it instead of merging the copies.",
        "The old copies disagree on the number of people. You need to ask which revision to use, not pick a number that looks right."
      ],
      [
        "Ask the source",
        "You write {player} in the sender field and circle “verify revision.” A flash lights the window; your pen stays on the sheet.",
        "Receive the copies, then ask the source. Once the new revision arrives, relay every field, through the check value. Ask for a repeat if needed."
      ],
      [
        "Set the old copies aside",
        "This attempt saved MSG {msgId}, REV {revision}: {grid}, {people} people, {item}, quantity {quantity}, CHECK {check}.",
        "You mark the old copies “do not forward.” The new line has been verified and relayed. No numbers need filling in from memory."
      ],
      [
        "End the entry at the relay",
        "You check both event contacts, SIM12CS and SIM12RL, and write this record ID in the margin.",
        "Your pen stops before “delivered.” You know the message went out. You cannot fill in whether the supplies arrived."
      ]
    ]
  },
  "ja": {
    "chapter": "第十二章",
    "entry": "第十二章 · 嵐のリレー",
    "enter": "電源を入れる · 中継へ",
    "finish": "第十二章を完了 · 報酬を受け取る",
    "continueStory": "第十二章の続きを見る",
    "returnToStory": "第十二章の物語へ戻る",
    "complete": "第十二章完了。中継の再挑戦と第十三章が開放されました。",
    "unavailable": "第十一章を終えて、この章を受注してください。条件を満たす旧タスクはタスク画面でも受領できます。",
    "hint": "電鍵でSIM12CSにチェックインし、食い違う2通を受信。送信元に改訂を確認してから、確認済みの全項目をSIM12RLへ中継します。AGN / QRSで再送を依頼できます。",
    "resumeHint": "段階、電文、有効時間を保存。設定、退出確認、フォーカス喪失中は停止し、戻れば同じ試行を再開します。",
    "recorded": "確認できるのは電文の照合と中継までです。物資到着の記録ではありません。イベント交信2件の報酬はゼロです。",
    "reward": "章報酬は1350資金と6技術点で一度のみ。実績報酬は別です。",
    "recordLabel": "今回の中継記録",
    "artLabels": {
      "scene": "第十二章の嵐の局",
      "portrait": "第十二章の中継担当者",
      "illustration": "第十二章の食い違う電文"
    },
    "beats": [
      [
        "紙を押さえる",
        "雨が窓枠を叩く。丸まった紙の端をログ帳の下に挟み、書く場所を空けた。",
        "前の呼出しには返信がなかった。今度の用紙にはSIM12CSとSIM12RL。まず管制局へチェックインする。"
      ],
      [
        "同じ番号が二つ",
        "受信待ち一覧に214番が二度ある。ひとまとめにせず、横に二行分を空けた。",
        "古い二通では人数が違う。どの版を使うのか聞こう。もっともらしい数字を選ぶわけにはいかない。"
      ],
      [
        "送信元に聞き直す",
        "送信者欄に{player}と書き、「改訂確認」を丸で囲む。窓が一瞬光る。ペンは紙の上に置いたままだ。",
        "受信してから送信元へ確認する。新版が届いたら、番号からチェック値まで順に中継する。必要なら再送を頼む。"
      ],
      [
        "旧版を脇に置く",
        "今回の保存内容はMSG {msgId}、REV {revision}：{grid}、{people}人、{item}、数量{quantity}、CHECK {check}。",
        "旧版の横に「転送しない」と書いた。新しい行は確認して中継済み。記憶で数字を埋める必要はない。"
      ],
      [
        "中継までを記す",
        "SIM12CSとSIM12RLのイベント交信2件を確かめ、今回の記録番号を余白に書く。",
        "「到着」の欄でペンが止まる。電文を送ったことは分かる。物資が届いたかどうかは、代わりに書けない。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo doce",
    "entry": "Capítulo doce · El relevo de la tormenta",
    "enter": "Encender · Entrar al relevo",
    "finish": "Terminar capítulo doce · Cobrar recompensa",
    "continueStory": "Continuar capítulo doce",
    "returnToStory": "Volver al capítulo doce",
    "complete": "Capítulo doce terminado. Se abren la repetición y el capítulo trece.",
    "unavailable": "Termina el capítulo once y acepta este. Las tareas antiguas válidas pueden cobrarse en el centro de misiones.",
    "hint": "Regístrate con SIM12CS usando la llave y recibe las dos copias. Pide a la fuente que confirme la revisión y retransmite todos los campos a SIM12RL. AGN / QRS pide repetición.",
    "resumeHint": "Se guardan fase, mensaje y tiempo activo. Ajustes, confirmación de salida y pérdida de foco pausan el intento; al volver, continúa.",
    "recorded": "Esto confirma la verificación y retransmisión, no la entrega de suministros. Los dos contactos de evento dan cero créditos.",
    "reward": "La misión otorga 1350 créditos y 6 puntos tecnológicos una sola vez. Los logros se recompensan por separado.",
    "recordLabel": "Registro de este intento",
    "artLabels": {
      "scene": "Estación durante la tormenta",
      "portrait": "Operador de relevo",
      "illustration": "Copias contradictorias"
    },
    "beats": [
      [
        "Sujeta el papel",
        "La lluvia golpea el alféizar. Metes la esquina doblada bajo el cuaderno y despejas un sitio para escribir.",
        "El último intento quedó sin respuesta. Esta hoja trae dos indicativos: SIM12CS y SIM12RL. Primero, control."
      ],
      [
        "El mismo número",
        "El mensaje 214 aparece dos veces en la cola. Dejas dos líneas a su lado, sin unir las copias.",
        "Las versiones antiguas no coinciden en el número de personas. Hay que preguntar cuál usar, no elegir una cifra porque parezca razonable."
      ],
      [
        "Pregunta a la fuente",
        "Escribes {player} y rodeas «verificar revisión». Un destello ilumina la ventana; el bolígrafo sigue sobre el papel.",
        "Recibe las copias y consulta a la fuente. Con la nueva revisión, retransmite cada campo hasta el valor de control. Pide repetición si hace falta."
      ],
      [
        "Aparta las copias antiguas",
        "Este intento guardó MSG {msgId}, REV {revision}: {grid}, {people} personas, {item}, cantidad {quantity}, CHECK {check}.",
        "Marcas las copias antiguas «no reenviar». La nueva línea ya está verificada y retransmitida. No hay que completar cifras de memoria."
      ],
      [
        "Anota hasta la retransmisión",
        "Compruebas los dos contactos, SIM12CS y SIM12RL, y apuntas el identificador del registro al margen.",
        "El bolígrafo se detiene ante «entregado». Sabes que salió el mensaje. No puedes afirmar que llegaron los suministros."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel zwölf",
    "entry": "Kapitel zwölf · Das Sturmrelais",
    "enter": "Einschalten · Relais starten",
    "finish": "Kapitel zwölf abschließen · Belohnung",
    "continueStory": "Kapitel zwölf fortsetzen",
    "returnToStory": "Zurück zu Kapitel zwölf",
    "complete": "Kapitel zwölf abgeschlossen. Wiederholung und Kapitel dreizehn sind verfügbar.",
    "unavailable": "Schließe Kapitel elf ab und nimm dieses an. Gültige ältere Aufgaben bleiben im Missionszentrum einlösbar.",
    "hint": "Melde dich mit der Taste bei SIM12CS und empfange beide Fassungen. Frage die Quelle nach der verbindlichen Revision und übermittle alle geprüften Felder an SIM12RL. AGN / QRS fordert Wiederholung an.",
    "resumeHint": "Phase, Meldung und aktive Zeit werden gespeichert. Einstellungen, Rückfrage beim Verlassen und Fokusverlust pausieren den Versuch. Danach geht derselbe Versuch weiter.",
    "recorded": "Bestätigt sind Prüfung und Weitergabe, nicht die Lieferung. Beide Event-Kontakte bringen null Credits.",
    "reward": "Die Mission vergibt einmalig 1350 Credits und 6 Technikpunkte. Erfolge werden getrennt vergütet.",
    "recordLabel": "Protokoll dieses Versuchs",
    "artLabels": {
      "scene": "Funkstation im Sturm",
      "portrait": "Relaisperson",
      "illustration": "Widersprüchliche Fassungen"
    },
    "beats": [
      [
        "Das Blatt festhalten",
        "Regen klopft an die Fensterbank. Du klemmst die aufgerollte Ecke unter das Logbuch und schaffst Platz zum Schreiben.",
        "Beim letzten Versuch kam keine Antwort. Hier stehen zwei Rufzeichen: SIM12CS und SIM12RL. Zuerst die Leitstelle."
      ],
      [
        "Dieselbe Nummer",
        "Meldung 214 steht zweimal in der Warteliste. Du lässt zwei Zeilen frei, statt die Fassungen zusammenzuführen.",
        "Die alten Fassungen nennen verschiedene Personenzahlen. Du musst nach der gültigen Revision fragen, nicht eine plausibel wirkende Zahl wählen."
      ],
      [
        "Bei der Quelle nachfragen",
        "Du schreibst {player} ins Sendefeld und kreist „Revision prüfen“ ein. Das Fenster leuchtet kurz auf; dein Stift bleibt auf dem Blatt.",
        "Erst empfangen, dann die Quelle fragen. Die neue Fassung wird Feld für Feld bis zum Prüfwert weitergegeben. Bei Bedarf fragst du erneut."
      ],
      [
        "Die alten Fassungen beiseite",
        "Gespeichert wurde MSG {msgId}, REV {revision}: {grid}, {people} Personen, {item}, Menge {quantity}, CHECK {check}.",
        "Neben die alten Fassungen schreibst du „nicht weitergeben“. Die neue Zeile ist geprüft und gesendet. Keine Zahl muss aus dem Gedächtnis ergänzt werden."
      ],
      [
        "Bis zur Weitergabe protokollieren",
        "Du prüfst die Kontakte SIM12CS und SIM12RL und notierst die Kennung dieses Protokolls am Rand.",
        "Vor „geliefert“ hält der Stift an. Du weißt, dass die Meldung gesendet wurde. Ob die Vorräte angekommen sind, kannst du nicht eintragen."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава двенадцать",
    "entry": "Глава двенадцать · Штормовая ретрансляция",
    "enter": "Включить · Начать ретрансляцию",
    "finish": "Завершить главу двенадцать · Награда",
    "continueStory": "Продолжить главу двенадцать",
    "returnToStory": "Вернуться к главе двенадцать",
    "complete": "Глава двенадцать завершена. Доступны повтор и глава тринадцать.",
    "unavailable": "Завершите главу одиннадцать и примите эту. Подходящие старые задания доступны в центре миссий.",
    "hint": "Ключом зарегистрируйтесь у SIM12CS и примите две противоречивые копии. Уточните редакцию у источника, затем передайте все проверенные поля SIM12RL. AGN / QRS запрашивает повтор.",
    "resumeHint": "Этап, сообщение и активное время сохраняются. Настройки, подтверждение выхода и потеря фокуса ставят попытку на паузу. Вернувшись, продолжите её.",
    "recorded": "Подтверждены проверка и передача сообщения, а не доставка припасов. Оба событийных контакта дают ноль кредитов.",
    "reward": "Награда задания — 1350 кредитов и 6 очков технологий, один раз. Награды за достижения считаются отдельно.",
    "recordLabel": "Запись этой попытки",
    "artLabels": {
      "scene": "Станция во время шторма",
      "portrait": "Оператор ретрансляции",
      "illustration": "Противоречивые копии"
    },
    "beats": [
      [
        "Прижать бумагу",
        "Дождь стучит по подоконнику. Ты прижимаешь загнувшийся угол журналом и освобождаешь место для записи.",
        "Прошлый вызов остался без ответа. В новом листе два позывных: SIM12CS и SIM12RL. Сначала — управление."
      ],
      [
        "Один номер дважды",
        "Сообщение 214 встречается в очереди два раза. Ты оставляешь рядом две строки, не объединяя копии.",
        "В старых копиях разное число людей. Нужно спросить, какая редакция верна, а не выбирать правдоподобную цифру."
      ],
      [
        "Спросить источник",
        "Ты пишешь {player} в поле отправителя и обводишь «проверить редакцию». За окном вспыхивает свет; ручка остаётся на листе.",
        "Сначала прими копии, затем уточни у источника. Новую редакцию передавай по полям, до контрольного значения. Если нужно, попроси повтор."
      ],
      [
        "Отложить старые копии",
        "Сохранено MSG {msgId}, REV {revision}: {grid}, {people} человек, {item}, количество {quantity}, CHECK {check}.",
        "Рядом со старыми копиями ты пишешь «не передавать». Новая строка проверена и передана. Дописывать цифры по памяти не нужно."
      ],
      [
        "Записать только передачу",
        "Ты проверяешь два контакта, SIM12CS и SIM12RL, и записываешь номер этой записи на полях.",
        "Ручка останавливается перед «доставлено». Ты знаешь, что сообщение ушло. Дошли ли припасы, за другую сторону не запишешь."
      ]
    ]
  }
};
const IDS=["rain","copies","verify","relayed","log"],ASSETS=["scene","scene","illustration","portrait","scene"];
export const CHAPTER_TWELVE_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterTwelveStoryText(language){
 const t=COPY[language]??COPY.en,activity=STORM_RELAY_TEXT[language]??STORM_RELAY_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,simulationWarning:activity.simulationWarning,
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

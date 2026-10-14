import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {FINAL_PROMISE_TEXT} from "./finalPromiseText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十四章",
    "entry": "第十四章 · 未完成的约定",
    "enter": "开机 · 联系收件人",
    "finish": "完成第十四章 · 领取任务奖励",
    "continueStory": "继续第十四章",
    "returnToStory": "返回第十四章剧情",
    "complete": "第十四章已完成。重玩与第十五章已开放。",
    "unavailable": "请先完成第十三章并接受本章。符合条件的旧任务仍可在任务中心领取。",
    "hint": "回看记录后呼叫 SIM14FP，读完对方的说明，再选择简短、坚定或温暖的答复并发出对应报文。AGN K / QRS K 可请求重读说明。",
    "resumeHint": "有效计时上限为 10 分钟。设置、离开确认和窗口失焦时暂停；重新载入会保留进度。",
    "recorded": "这页记录的是你本次实际发送的答复。重玩可以另作选择，不会改写本次结局。",
    "reward": "任务奖励为 1700 资金与 7 科技点，仅领取一次；独立成就奖励另计。",
    "recordLabel": "已封存的最后一页",
    "messageLabel": "实际发送",
    "accountLabel": "对方的说明",
    "endings": {
      "brief": "你只发了感谢和 73。够了，有些话短一点也说得清。",
      "steady": "“我会继续。”发出去之后，你把这几个字又看了一遍。下一页得自己来写。",
      "warm": "“你的日志还会写下去。”你选了这句，把它和自己的呼号一起留在记录里。"
    },
    "beats": [
      [
        "翻到折角那页",
        "日志摊开时，夹在里面的纸片滑了出来。你按住它，找到那一页没写完的记录。",
        "空白还在。你没有急着填，先把台灯往近处挪了一点。"
      ],
      [
        "看看已经写下的",
        "前几次联络都能在日志里找到。你顺着日期往下看，有些地方写得很密，有些只留了一行。",
        "想不起来的就先翻记录。查不到的，也不必替过去补一句话。"
      ],
      [
        "这次用你的呼号",
        "发送栏里是 {player}，收件人是 SIM14FP。你把旧日志放在电键旁边，留出手腕的位置。",
        "先听对方怎么说。最后那句话，等听完了再选。"
      ],
      [
        "话已经发出去了",
        "{ending}",
        "你核对刚刚保存的报文：{message}。日志里留下的就是这一句。"
      ],
      [
        "夹好这张纸",
        "你把刚才滑出来的纸片夹回去，压平翘起的一角。最后一页已经保存，可以合上这本日志了。",
        "电台还开着。你伸了个懒腰，抽过手边的新本子。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十四章",
    "entry": "第十四章 · 未完成的約定",
    "enter": "開機 · 聯絡收件人",
    "finish": "完成第十四章 · 領取任務獎勵",
    "continueStory": "繼續第十四章",
    "returnToStory": "返回第十四章劇情",
    "complete": "第十四章已完成。重玩與第十五章已開放。",
    "unavailable": "請先完成第十三章並接受本章。符合條件的舊任務仍可在任務中心領取。",
    "hint": "回看記錄後呼叫 SIM14FP，讀完對方的說明，再選擇簡短、堅定或溫暖的答覆並發送對應電文。AGN K / QRS K 可請求重讀說明。",
    "resumeHint": "有效計時上限為 10 分鐘。設定、離開確認與視窗失焦時暫停；重新載入會保留進度。",
    "recorded": "這頁記錄的是你本次實際發送的答覆。重玩可以另作選擇，不會改寫本次結局。",
    "reward": "任務獎勵為 1700 資金與 7 科技點，僅領一次；獨立成就獎勵另計。",
    "recordLabel": "已封存的最後一頁",
    "messageLabel": "實際發送",
    "accountLabel": "對方的說明",
    "endings": {
      "brief": "你只發了感謝與 73。夠了，有些話短一點也說得清。",
      "steady": "「我會繼續。」發出去之後，你又看了一遍。下一頁得自己來寫。",
      "warm": "「你的日誌還會寫下去。」你選了這句，連同自己的呼號一起留在記錄裡。"
    },
    "beats": [
      [
        "翻到摺角那頁",
        "日誌攤開時，夾在裡面的紙片滑了出來。你按住它，找到那頁沒寫完的記錄。",
        "空白還在。你沒有急著填，先把檯燈挪近一點。"
      ],
      [
        "看看已經寫下的",
        "前幾次聯絡都能在日誌裡找到。你順著日期往下看，有些地方寫得很密，有些只留了一行。",
        "想不起來的就翻記錄。查不到的，也不必替過去補一句話。"
      ],
      [
        "這次用你的呼號",
        "發送欄裡是 {player}，收件人是 SIM14FP。你把舊日誌放在電鍵旁，留出手腕的位置。",
        "先聽對方怎麼說。最後那句話，等聽完了再選。"
      ],
      [
        "話已經發出去了",
        "{ending}",
        "你核對剛儲存的電文：{message}。日誌裡留下的就是這一句。"
      ],
      [
        "夾好這張紙",
        "你把紙片夾回去，壓平翹起的一角。最後一頁已經儲存，可以合上這本日誌了。",
        "電臺還開著。你伸了個懶腰，抽過手邊的新本子。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter fourteen",
    "entry": "Chapter fourteen · The unfinished promise",
    "enter": "Switch on · Contact the recipient",
    "finish": "Finish chapter fourteen · Claim reward",
    "continueStory": "Continue chapter fourteen",
    "returnToStory": "Return to chapter fourteen",
    "complete": "Chapter fourteen complete. Replay and chapter fifteen are open.",
    "unavailable": "Finish chapter thirteen and accept this chapter. Eligible legacy tasks can still be claimed in the mission center.",
    "hint": "Review the log, call SIM14FP and read the recipient's account. Choose a brief, steady or warm reply, then key its message. AGN K / QRS K lets you receive the account again.",
    "resumeHint": "The limit is 10 active minutes. Settings, the leave dialog and loss of focus pause the clock. Reloading preserves progress.",
    "recorded": "This page records the reply you actually sent. You can choose differently on replay without rewriting this ending.",
    "reward": "The task pays 1700 credits and 7 technology points once. Separate achievement rewards may also apply.",
    "recordLabel": "The sealed final page",
    "messageLabel": "Actually sent",
    "accountLabel": "The recipient's account",
    "endings": {
      "brief": "You sent thanks and 73. That was enough; a short reply can still say what you mean.",
      "steady": "\"I will continue.\" You read it once more after sending. The next page is yours to write.",
      "warm": "\"Your log continues.\" You chose that line and left it beside your own callsign."
    },
    "beats": [
      [
        "The folded corner",
        "A slip of paper slides out as you open the log. You catch it and find the unfinished entry.",
        "The space is still blank. Before writing anything, you pull the lamp a little closer."
      ],
      [
        "What is already written",
        "The earlier contacts are here. You follow the dates down the page: dense notes in places, a single line in others.",
        "When memory fails, you check the record. If it isn't there, you needn't fill it in for the past."
      ],
      [
        "Your callsign this time",
        "The sending field reads {player}; the recipient is SIM14FP. You put the old log beside the key, leaving room for your wrist.",
        "Hear what they have to say first. You can choose your last line afterwards."
      ],
      [
        "The words have gone",
        "{ending}",
        "You check the message just saved: {message}. That is the line this log will keep."
      ],
      [
        "Tuck the paper back",
        "You tuck the loose paper back in and flatten its curled corner. The last page is saved. You can close this log now.",
        "The radio is still on. You stretch and reach for the fresh notebook beside you."
      ]
    ]
  },
  "ja": {
    "chapter": "第十四章",
    "entry": "第十四章 · 未完の約束",
    "enter": "電源を入れる · 受取人へ",
    "finish": "第十四章を完了 · 報酬を受け取る",
    "continueStory": "第十四章を続ける",
    "returnToStory": "第十四章の物語へ戻る",
    "complete": "第十四章完了。再プレイと第十五章が開放されました。",
    "unavailable": "第十三章を終えて本章を受注してください。条件を満たす旧タスクは任務センターでも受け取れます。",
    "hint": "ログを確認し、SIM14FPを呼んで相手の話を読みます。簡潔・確か・温かい返事から選び、対応する電文を打ってください。AGN K / QRS Kで話を再受信できます。",
    "resumeHint": "制限は有効時間10分。設定、退出確認、フォーカス喪失中は一時停止。再読み込みでも進行を保持します。",
    "recorded": "今回は実際に送った返事を記録します。再プレイで別の返事を選んでも、この結末は変わりません。",
    "reward": "任務報酬は資金1700と技術ポイント7、一度だけ受け取れます。実績報酬は別途です。",
    "recordLabel": "保存された最後のページ",
    "messageLabel": "実際の送信内容",
    "accountLabel": "相手の話",
    "endings": {
      "brief": "感謝と73だけを送った。それで十分だった。短くても、伝えたいことは言える。",
      "steady": "「続けます。」送ったあとでもう一度読む。次のページは自分で書く。",
      "warm": "「あなたのログは続きます。」その言葉を選び、自分の呼出符号と一緒に残した。"
    },
    "beats": [
      [
        "折り目のあるページ",
        "ログを開くと、挟んだ紙片が滑り落ちる。手で押さえ、書きかけのページを探す。",
        "空欄はそのままだ。すぐには埋めず、机の明かりを少し近づける。"
      ],
      [
        "すでに書かれたこと",
        "これまでの交信が並んでいる。日付を追うと、細かいメモも一行だけの記録もある。",
        "思い出せなければ記録を見る。見つからないことまで書き足す必要はない。"
      ],
      [
        "今度は自分の呼出符号で",
        "送信欄は {player}、相手はSIM14FP。手首を置く場所を空け、古いログを電鍵の隣に置く。",
        "まずは相手の話を聞こう。最後の一言は、そのあとで選べばいい。"
      ],
      [
        "送った言葉",
        "{ending}",
        "保存した電文を確かめる。{message}。このログに残るのは、この一文だ。"
      ],
      [
        "紙片を戻す",
        "紙片を挟み直し、反った角を押さえる。最後のページは保存できた。もうこのログを閉じていい。",
        "無線機はまだついている。背伸びをして、手元の新しいノートを引き寄せる。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo catorce",
    "entry": "Capítulo catorce · La promesa inacabada",
    "enter": "Encender · Contactar al destinatario",
    "finish": "Terminar el capítulo catorce · Cobrar",
    "continueStory": "Continuar el capítulo catorce",
    "returnToStory": "Volver al capítulo catorce",
    "complete": "Capítulo catorce completado. Repetición y capítulo quince disponibles.",
    "unavailable": "Termina el capítulo trece y acepta este. Las misiones antiguas válidas se pueden cobrar en el centro de misiones.",
    "hint": "Revisa el registro, llama a SIM14FP y lee su relato. Elige una respuesta breve, serena o cálida y transmite su mensaje. AGN K / QRS K permite recibir de nuevo el relato.",
    "resumeHint": "El límite es de 10 minutos activos. Ajustes, confirmación de salida y pérdida de foco pausan el reloj. Recargar conserva el progreso.",
    "recorded": "Esta página guarda la respuesta que enviaste. Elegir otra al repetir no cambia este final.",
    "reward": "La misión paga 1700 créditos y 7 puntos tecnológicos una vez. Los logros se premian aparte.",
    "recordLabel": "La última página guardada",
    "messageLabel": "Mensaje enviado",
    "accountLabel": "Relato del destinatario",
    "endings": {
      "brief": "Enviaste agradecimiento y 73. Bastaba; una respuesta corta también puede decir lo que querías.",
      "steady": "«Continuaré». Lo lees otra vez después de enviarlo. La próxima página te toca escribirla a ti.",
      "warm": "«Tu registro continúa». Elegiste esa frase y la dejaste junto a tu propio indicativo."
    },
    "beats": [
      [
        "La esquina doblada",
        "Al abrir el registro se desliza un papel. Lo sujetas y buscas la anotación inacabada.",
        "El hueco sigue en blanco. Antes de escribir nada, acercas un poco la lámpara."
      ],
      [
        "Lo que ya está escrito",
        "Los contactos anteriores están aquí. Sigues las fechas: notas apretadas en unos sitios, una sola línea en otros.",
        "Si no lo recuerdas, consultas el registro. Si no está, no hace falta inventar una frase para el pasado."
      ],
      [
        "Esta vez, tu indicativo",
        "El campo de envío dice {player}; el destinatario es SIM14FP. Pones el registro junto al manipulador y dejas sitio para la muñeca.",
        "Primero escucha lo que tiene que decir. Después elegirás tu última frase."
      ],
      [
        "Las palabras ya salieron",
        "{ending}",
        "Compruebas el mensaje guardado: {message}. Esa es la frase que conservará este registro."
      ],
      [
        "Volver a guardar el papel",
        "Metes el papel entre las páginas y alisas la esquina levantada. La última página está guardada. Ya puedes cerrar el registro.",
        "La radio sigue encendida. Te estiras y acercas el cuaderno nuevo."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel vierzehn",
    "entry": "Kapitel vierzehn · Das unerfüllte Versprechen",
    "enter": "Einschalten · Empfänger rufen",
    "finish": "Kapitel vierzehn abschließen · Belohnung",
    "continueStory": "Kapitel vierzehn fortsetzen",
    "returnToStory": "Zur Geschichte von Kapitel vierzehn",
    "complete": "Kapitel vierzehn abgeschlossen. Wiederholung und Kapitel fünfzehn sind frei.",
    "unavailable": "Schließe Kapitel dreizehn ab und nimm dieses an. Gültige ältere Aufgaben bleiben im Missionszentrum verfügbar.",
    "hint": "Lies das Log, rufe SIM14FP und lies den Bericht. Wähle eine kurze, beständige oder warme Antwort und taste ihre Nachricht. AGN K / QRS K ruft den Bericht erneut ab.",
    "resumeHint": "Das Limit beträgt 10 aktive Minuten. Einstellungen, Rückfrage beim Verlassen und Fokusverlust pausieren die Uhr. Neuladen erhält den Fortschritt.",
    "recorded": "Diese Seite hält deine gesendete Antwort fest. Eine andere Wahl bei Wiederholung verändert dieses Ende nicht.",
    "reward": "Die Aufgabe zahlt einmalig 1700 Credits und 7 Technologiepunkte. Erfolgsbelohnungen werden separat berechnet.",
    "recordLabel": "Die gespeicherte letzte Seite",
    "messageLabel": "Tatsächlich gesendet",
    "accountLabel": "Bericht des Empfängers",
    "endings": {
      "brief": "Du hast Dank und 73 gesendet. Das reichte; auch eine kurze Antwort kann sagen, was du meinst.",
      "steady": "„Ich mache weiter.“ Nach dem Senden liest du es noch einmal. Die nächste Seite schreibst du selbst.",
      "warm": "„Dein Log geht weiter.“ Diesen Satz hast du gewählt und neben deinem eigenen Rufzeichen festgehalten."
    },
    "beats": [
      [
        "Die umgeknickte Ecke",
        "Beim Öffnen rutscht ein Zettel aus dem Logbuch. Du hältst ihn fest und suchst den unvollendeten Eintrag.",
        "Die Lücke ist noch leer. Bevor du etwas schreibst, ziehst du die Lampe näher."
      ],
      [
        "Was schon geschrieben steht",
        "Die früheren Kontakte stehen hier. Du folgst den Daten: manchmal dichte Notizen, manchmal nur eine Zeile.",
        "Was du nicht mehr weißt, schlägst du nach. Was nicht da ist, musst du nicht nachträglich erfinden."
      ],
      [
        "Diesmal dein Rufzeichen",
        "Im Sendefeld steht {player}, der Empfänger ist SIM14FP. Du legst das alte Log neben die Taste und lässt Platz fürs Handgelenk.",
        "Hör erst zu, was die andere Seite sagt. Deinen letzten Satz kannst du danach wählen."
      ],
      [
        "Die Worte sind gesendet",
        "{ending}",
        "Du prüfst die gespeicherte Nachricht: {message}. Diesen Satz behält das Logbuch."
      ],
      [
        "Den Zettel zurückstecken",
        "Du steckst den Zettel zurück und glättest die hochstehende Ecke. Die letzte Seite ist gespeichert. Jetzt kannst du das Logbuch schließen.",
        "Das Funkgerät ist noch an. Du streckst dich und greifst nach dem neuen Heft."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава четырнадцатая",
    "entry": "Глава четырнадцать · Незавершённое обещание",
    "enter": "Включить станцию · Вызвать получателя",
    "finish": "Завершить главу четырнадцать · Награда",
    "continueStory": "Продолжить главу четырнадцать",
    "returnToStory": "Вернуться к главе четырнадцать",
    "complete": "Глава четырнадцать завершена. Открыты повтор и глава пятнадцать.",
    "unavailable": "Заверши главу тринадцать и прими эту. Подходящие старые задания можно закрыть в центре миссий.",
    "hint": "Прочитай журнал, вызови SIM14FP и прочитай рассказ. Выбери краткий, твёрдый или тёплый ответ и передай его. AGN K / QRS K позволяет принять рассказ ещё раз.",
    "resumeHint": "Лимит — 10 активных минут. Настройки, подтверждение выхода и потеря фокуса останавливают таймер. Перезагрузка сохраняет прогресс.",
    "recorded": "Здесь записан ответ, который ты передал. Другой выбор при повторе не изменит этот финал.",
    "reward": "Задание даёт 1700 кредитов и 7 очков технологий один раз. Награды за достижения считаются отдельно.",
    "recordLabel": "Сохранённая последняя страница",
    "messageLabel": "Переданное сообщение",
    "accountLabel": "Рассказ получателя",
    "endings": {
      "brief": "Ты передал благодарность и 73. Этого хватило: короткий ответ тоже может сказать всё нужное.",
      "steady": "«Я продолжу». После передачи ты читаешь это ещё раз. Следующую страницу писать тебе.",
      "warm": "«Твой журнал продолжается». Ты выбрал эту фразу и оставил её рядом со своим позывным."
    },
    "beats": [
      [
        "Страница с загнутым уголком",
        "Когда ты открываешь журнал, из него выскальзывает бумажка. Ты прижимаешь её рукой и находишь незавершённую запись.",
        "Пустое место осталось. Прежде чем писать, ты придвигаешь лампу."
      ],
      [
        "Уже записанное",
        "Прежние связи здесь. Ты идёшь по датам: где-то тесные заметки, где-то всего одна строка.",
        "Если не помнишь, смотришь запись. А если записи нет, не нужно дописывать прошлое."
      ],
      [
        "Теперь с твоим позывным",
        "В поле отправителя — {player}, получатель — SIM14FP. Ты кладёшь старый журнал рядом с ключом, оставив место для запястья.",
        "Сначала прочитай, что скажет собеседник. Последнюю фразу выберешь потом."
      ],
      [
        "Слова уже переданы",
        "{ending}",
        "Ты сверяешь сохранённое сообщение: {message}. Именно эта строка останется в журнале."
      ],
      [
        "Убрать бумажку",
        "Ты вкладываешь бумажку обратно и разглаживаешь уголок. Последняя страница сохранена. Журнал можно закрыть.",
        "Станция ещё включена. Ты потягиваешься и берёшь новую тетрадь."
      ]
    ]
  }
};
const IDS=["page","review","call","reply","log"],ASSETS=["scene","illustration","scene","illustration","scene"];
export const CHAPTER_FOURTEEN_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterFourteenStoryText(language){
 const t=COPY[language]??COPY.en,activity=FINAL_PROMISE_TEXT[language]??FINAL_PROMISE_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,simulationWarning:activity.simulationWarning,
  artLabels:{scene:t.title,portrait:t.title,illustration:t.recordLabel},
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

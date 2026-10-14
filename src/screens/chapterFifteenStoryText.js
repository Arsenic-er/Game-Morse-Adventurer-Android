import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {FIRST_PAGE_TEXT} from "./firstPageText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十五章",
    "entry": "第十五章 · 新日志的第一页",
    "enter": "开机 · 做一次普通通联",
    "finish": "完成主线 · 领取任务奖励",
    "continueStory": "继续第十五章",
    "complete": "十五章主线已完成。回到电台，可在开放电台面板选择接下来的目标。",
    "hint": "用现有电台完成普通通联，并保存日志、结算正数资金。活动通联、接任务前的记录和未保存的通联不计入。",
    "reward": "任务奖励为 2000 资金与 8 科技点，仅领取一次；独立成就奖励另计。",
    "seal": "封存这一页",
    "choosePrompt": "先选一个接下来的方向",
    "unavailable": "请先完成第十四章并接受本章。符合条件的旧任务仍可在任务中心领取。",
    "sealFailed": "这一页还未保存。请检查通联记录，稍后重试。",
    "pinned": "封存后，这一页和最初选择不再改变。通关后可以另选当前目标。",
    "simulationWarning": "虚构台站 · 游戏模拟",
    "endings": {
      "world-log": "你在页角写下“去听听更远的地方”。下一次开机，先看看哪个频段有回应。",
      "people-network": "你把“记住来过的人”写在页角。下次听到熟悉的呼号，就先打个招呼。",
      "field-operations": "你写下“找天带电台出去”。背包还没收拾，先把要带的东西列出来。",
      "public-service": "你写下“再练一次公共服务网”。这是游戏里的模拟值守，下一次想把交接做得更清楚。",
      "contest-craft": "你写下“把竞赛手法练熟”。先练准，再试着快一点。"
    },
    "beats": [
      [
        "早上，照常开机",
        "新本子放在旧日志旁边，封面还有一点硬。你来回翻了两页，才把它摊平。",
        "今天没有指定收件人。你把耳机拿过来，决定先做一次普通通联。"
      ],
      [
        "留一行给今天",
        "第一页上，你先写下自己的呼号：{player}。日期和对方呼号的位置还空着。",
        "等真的联络上了再填。笔就搁在这里。"
      ],
      [
        "听听谁在",
        "你把音量调到合适的位置，手搭在电键旁。下一次回应来自谁，现在还不知道。",
        "完成联络后，记得保存日志。第一页要用那条实际留下来的记录。"
      ],
      [
        "这一行已经有了",
        "{peer}，双方报告 {rst}。你对着刚保存的日志，把这一行核对了一遍。",
        "往后想多做些什么？先选一件放在页角，封存之前还可以改。"
      ],
      [
        "本子不用合上",
        "{ending}",
        "你把笔放回桌上。{peer} 的记录留在第一页，电台也还在这里。下次想开机的时候再来。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十五章",
    "entry": "第十五章 · 新日誌的第一頁",
    "enter": "開機 · 做一次普通通聯",
    "finish": "完成主線 · 領取任務獎勵",
    "continueStory": "繼續第十五章",
    "complete": "十五章主線已完成。回到電台，可在開放電台面板選擇接下來的目標。",
    "hint": "用現有電台完成普通通聯，儲存日誌並結算正數資金。活動通聯、接任務前的記錄與未儲存的通聯不計入。",
    "reward": "任務獎勵為 2000 資金與 8 科技點，僅領一次；獨立成就獎勵另計。",
    "seal": "封存這一頁",
    "choosePrompt": "先選一個接下來的方向",
    "unavailable": "請先完成第十四章並接受本章。符合條件的舊任務仍可在任務中心領取。",
    "sealFailed": "這一頁尚未儲存。請檢查通聯記錄，稍後重試。",
    "pinned": "封存後，這一頁與最初選擇不再改變。通關後可以另選目前目標。",
    "simulationWarning": "虛構臺站 · 遊戲模擬",
    "endings": {
      "world-log": "你在頁角寫下「去聽聽更遠的地方」。下次開機，先看看哪個頻段有回應。",
      "people-network": "你把「記住來過的人」寫在頁角。下次聽到熟悉的呼號，就先打個招呼。",
      "field-operations": "你寫下「找天帶電台出去」。背包還沒整理，先把要帶的東西列出來。",
      "public-service": "你寫下「再練一次公共服務網」。這是遊戲裡的模擬值守，下次想把交接做得更清楚。",
      "contest-craft": "你寫下「把競賽手法練熟」。先練準，再試著快一點。"
    },
    "beats": [
      [
        "早上，照常開機",
        "新本子放在舊日誌旁，封面還有點硬。你來回翻了兩頁，才把它攤平。",
        "今天沒有指定收件人。你拿過耳機，決定先做一次普通通聯。"
      ],
      [
        "留一行給今天",
        "第一頁上，你先寫下自己的呼號：{player}。日期與對方呼號的位置還空著。",
        "等真的聯絡上再填。筆就擱在這裡。"
      ],
      [
        "聽聽誰在",
        "你把音量調到合適的位置，手搭在電鍵旁。下一次回應來自誰，現在還不知道。",
        "完成聯絡後，記得儲存日誌。第一頁要用那條實際留下來的記錄。"
      ],
      [
        "這一行已經有了",
        "{peer}，雙方報告 {rst}。你對著剛儲存的日誌，把這一行核對了一遍。",
        "往後想多做些什麼？先選一件放在頁角，封存前還可以改。"
      ],
      [
        "本子不用合上",
        "{ending}",
        "你把筆放回桌上。{peer} 的記錄留在第一頁，電台也還在這裡。下次想開機時再來。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Fifteen",
    "entry": "Chapter Fifteen · A New Logbook",
    "enter": "Switch on · Make an ordinary contact",
    "finish": "Finish the story · Claim reward",
    "continueStory": "Continue Chapter Fifteen",
    "complete": "All fifteen story chapters are complete. Return home to choose your next goal in the Open Station panel.",
    "hint": "Complete an ordinary QSO on your station, save it, and earn positive credits. Event contacts, earlier records, and unsaved contacts do not count.",
    "reward": "Claim 2000 credits and 8 technology points once. Separate achievement rewards may also apply.",
    "seal": "Seal this page",
    "choosePrompt": "Choose what you want to do next",
    "unavailable": "Complete Chapter Fourteen and accept this chapter first. Eligible older missions can still be claimed in Mission Center.",
    "sealFailed": "The page was not saved. Check the contact record and try again.",
    "pinned": "Sealing preserves this page and your first choice. You can change your active goal after finishing the story.",
    "simulationWarning": "Fictional stations · Game simulation",
    "endings": {
      "world-log": "You write, “Listen farther afield.” Next time, you will see which band has someone answering.",
      "people-network": "You write, “Remember the people.” When a familiar callsign comes through, you can say hello.",
      "field-operations": "You write, “Take the radio outside one day.” The bag is not packed. A checklist will do for now.",
      "public-service": "You write, “Practise the service net again.” It is a simulated shift in the game. Next time, you want a clearer handover.",
      "contest-craft": "You write, “Practise contest operating.” Get it right first; try a little faster after that."
    },
    "beats": [
      [
        "An ordinary morning",
        "The new notebook sits beside the old log. Its cover is still stiff. You turn a few pages until it stays open.",
        "There is no assigned recipient today. You pick up the headphones and decide to make an ordinary contact."
      ],
      [
        "A line for today",
        "On the first page you write your callsign: {player}. You leave the date and the other callsign blank.",
        "Fill those in after the contact. The pen can stay here."
      ],
      [
        "See who is listening",
        "You adjust the volume and rest your hand beside the key. You do not know who will answer next.",
        "Once the contact is complete, save the log. This page needs the record you actually kept."
      ],
      [
        "The line is filled",
        "{peer}, reports {rst}. You check the line against the contact you just saved.",
        "What would you like to do more of? Pick something for the corner of the page. You can change it before sealing."
      ],
      [
        "Leave the notebook open",
        "{ending}",
        "You put the pen down. The contact with {peer} stays on page one, and the radio is still here. Come back when you feel like switching it on."
      ]
    ]
  },
  "ja": {
    "chapter": "第十五章",
    "entry": "第十五章 · 新しいログの一ページ",
    "enter": "電源を入れる · 通常交信へ",
    "finish": "物語を終える · 報酬を受け取る",
    "continueStory": "第十五章を続ける",
    "complete": "全十五章が完了しました。ホームのオープンステーションで次の目標を選べます。",
    "hint": "通常交信を完了してログを保存し、正の資金報酬を得てください。イベント交信、受注前の記録、未保存の交信は対象外です。",
    "reward": "任務報酬は 2000 資金と 8 技術ポイント。受け取りは一度だけです。実績報酬は別に加算されます。",
    "seal": "このページを確定する",
    "choosePrompt": "次にやりたいことを選ぶ",
    "unavailable": "第十四章を終えて、この章を受注してください。条件を満たした旧任務は任務センターでも受け取れます。",
    "sealFailed": "ページを保存できませんでした。交信記録を確認し、もう一度お試しください。",
    "pinned": "確定したページと最初の選択は変わりません。物語の完了後、現在の目標は変更できます。",
    "simulationWarning": "架空の局 · ゲーム内シミュレーション",
    "endings": {
      "world-log": "ページの隅に「もっと遠くを聴く」と書く。次は、どのバンドから返事が来るだろう。",
      "people-network": "「出会った人を覚えておく」と書く。聞き覚えのあるコールサインが届いたら、まず挨拶しよう。",
      "field-operations": "「今度、無線機を外へ持ち出す」と書く。荷造りはまだだ。まず持ち物を並べてみよう。",
      "public-service": "「サービスネットをもう一度練習」と書く。ゲーム内の模擬当番だ。次は引き継ぎをもう少しわかりやすくしたい。",
      "contest-craft": "「コンテストの操作を練習」と書く。まず正確に。それから少し速く。"
    },
    "beats": [
      [
        "いつもの朝",
        "新しいノートを古いログの隣に置く。表紙はまだ硬い。何枚かめくると、ようやく開いたままになった。",
        "今日は指定の相手がいない。ヘッドホンを手に取り、普通の交信を一つすることにした。"
      ],
      [
        "今日の一行",
        "最初のページに自分のコールサイン、{player} を書く。日付と相手局の欄は空けておく。",
        "交信できてから埋めよう。ペンはここに置いておく。"
      ],
      [
        "誰かいるかな",
        "音量を調整し、電鍵の横に手を置く。次に誰が応えるかは、まだわからない。",
        "交信が終わったらログを保存しよう。このページには、実際に残した記録を使う。"
      ],
      [
        "一行、埋まった",
        "{peer}、双方のレポートは {rst}。保存したばかりのログと見比べて確認する。",
        "これから何を増やしていこう。ページの隅に一つ選んで書く。確定するまでは変えられる。"
      ],
      [
        "ノートは開いたままで",
        "{ending}",
        "ペンを机に戻す。{peer} との記録は一ページ目に残り、無線機もここにある。また電源を入れたくなったら来よう。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo quince",
    "entry": "Capítulo quince · Un cuaderno nuevo",
    "enter": "Encender · Hacer un contacto normal",
    "finish": "Terminar la historia · Cobrar recompensa",
    "continueStory": "Continuar el capítulo quince",
    "complete": "Has completado los quince capítulos. Vuelve al inicio y elige tu próximo objetivo en Estación abierta.",
    "hint": "Completa un QSO normal, guárdalo y recibe créditos positivos. No cuentan los eventos, los contactos anteriores a la misión ni los que no hayas guardado.",
    "reward": "Recompensa única: 2000 créditos y 8 puntos de tecnología. Los logros se recompensan por separado.",
    "seal": "Cerrar esta página",
    "choosePrompt": "Elige qué quieres hacer después",
    "unavailable": "Completa el capítulo catorce y acepta este capítulo. Las misiones antiguas válidas también se pueden cobrar en el centro de misiones.",
    "sealFailed": "No se guardó la página. Revisa el contacto e inténtalo de nuevo.",
    "pinned": "Al cerrar la página se conserva tu primera elección. Podrás cambiar el objetivo activo tras terminar la historia.",
    "simulationWarning": "Estaciones ficticias · Simulación de juego",
    "endings": {
      "world-log": "Escribes: «Escuchar más lejos». La próxima vez comprobarás en qué banda responde alguien.",
      "people-network": "Escribes: «Recordar a la gente». Cuando oigas un indicativo conocido, podrás saludar.",
      "field-operations": "Escribes: «Sacar la radio algún día». La mochila sigue vacía. Por ahora basta con preparar una lista.",
      "public-service": "Escribes: «Practicar otra vez la red de servicio». Es un turno simulado del juego. Quieres hacer un relevo más claro.",
      "contest-craft": "Escribes: «Practicar concursos». Primero hacerlo bien; después, un poco más rápido."
    },
    "beats": [
      [
        "Una mañana normal",
        "El cuaderno nuevo está junto al registro viejo. La tapa sigue rígida. Pasas varias páginas hasta que se queda abierto.",
        "Hoy no hay destinatario asignado. Tomas los auriculares y decides hacer un contacto normal."
      ],
      [
        "Una línea para hoy",
        "En la primera página escribes tu indicativo: {player}. Dejas en blanco la fecha y el indicativo del otro operador.",
        "Los rellenarás después del contacto. El bolígrafo puede quedarse aquí."
      ],
      [
        "A ver quién escucha",
        "Ajustas el volumen y apoyas la mano junto al manipulador. Todavía no sabes quién responderá.",
        "Cuando termines, guarda el contacto. Esta página necesita el registro que hayas conservado de verdad."
      ],
      [
        "Ya hay una línea",
        "{peer}, informes {rst}. Comparas la línea con el contacto que acabas de guardar.",
        "¿Qué te gustaría hacer más? Elige algo para la esquina de la página. Puedes cambiarlo antes de cerrarla."
      ],
      [
        "Deja abierto el cuaderno",
        "{ending}",
        "Dejas el bolígrafo en la mesa. El contacto con {peer} queda en la primera página y la radio sigue aquí. Vuelve cuando te apetezca encenderla."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel fünfzehn",
    "entry": "Kapitel fünfzehn · Ein neues Logbuch",
    "enter": "Einschalten · Normales QSO beginnen",
    "finish": "Geschichte beenden · Belohnung abholen",
    "continueStory": "Kapitel fünfzehn fortsetzen",
    "complete": "Alle fünfzehn Kapitel sind abgeschlossen. Wähle zu Hause im Bereich Offene Station dein nächstes Ziel.",
    "hint": "Schließe ein normales QSO ab, speichere es und erhalte positive Credits. Eventkontakte, ältere Einträge und ungespeicherte Kontakte zählen nicht.",
    "reward": "Einmalige Missionsbelohnung: 2000 Credits und 8 Technikpunkte. Erfolge werden separat belohnt.",
    "seal": "Diese Seite abschließen",
    "choosePrompt": "Wähle dein nächstes Vorhaben",
    "unavailable": "Schließe Kapitel vierzehn ab und nimm dieses Kapitel an. Gültige ältere Missionen können auch im Missionszentrum abgeholt werden.",
    "sealFailed": "Die Seite wurde nicht gespeichert. Prüfe den Kontakteintrag und versuche es erneut.",
    "pinned": "Die abgeschlossene Seite und deine erste Wahl bleiben erhalten. Nach der Geschichte kannst du dein aktuelles Ziel ändern.",
    "simulationWarning": "Fiktive Stationen · Spielsimulation",
    "endings": {
      "world-log": "Du schreibst: „Weiter in die Ferne hören.“ Beim nächsten Mal schaust du, auf welchem Band jemand antwortet.",
      "people-network": "Du schreibst: „Die Menschen wiedererkennen.“ Bei einem vertrauten Rufzeichen kannst du gleich Hallo sagen.",
      "field-operations": "Du schreibst: „Das Funkgerät mal mitnehmen.“ Der Rucksack ist noch leer. Erst einmal machst du eine Packliste.",
      "public-service": "Du schreibst: „Das Servicenetz noch einmal üben.“ Es ist eine simulierte Schicht im Spiel. Die nächste Übergabe soll klarer werden.",
      "contest-craft": "Du schreibst: „Contestbetrieb üben.“ Erst richtig, dann ein wenig schneller."
    },
    "beats": [
      [
        "Ein gewöhnlicher Morgen",
        "Das neue Heft liegt neben dem alten Logbuch. Der Einband ist noch steif. Du blätterst ein paarmal, bis es offen liegen bleibt.",
        "Heute gibt es keinen festen Empfänger. Du nimmst die Kopfhörer und beschließt, ein normales QSO zu machen."
      ],
      [
        "Eine Zeile für heute",
        "Auf die erste Seite schreibst du dein Rufzeichen: {player}. Datum und Gegenstation lässt du noch frei.",
        "Die trägst du nach dem Kontakt ein. Der Stift bleibt hier liegen."
      ],
      [
        "Mal hören, wer da ist",
        "Du stellst die Lautstärke ein und legst die Hand neben die Taste. Wer als Nächstes antwortet, weißt du noch nicht.",
        "Speichere nach dem Kontakt das Log. Auf diese Seite gehört der Eintrag, den du tatsächlich behalten hast."
      ],
      [
        "Die Zeile ist ausgefüllt",
        "{peer}, Rapporte {rst}. Du vergleichst die Zeile mit dem gerade gespeicherten Kontakt.",
        "Was möchtest du öfter machen? Wähle etwas für die Seitenecke. Vor dem Abschluss kannst du es noch ändern."
      ],
      [
        "Das Heft bleibt offen",
        "{ending}",
        "Du legst den Stift ab. Der Kontakt mit {peer} bleibt auf Seite eins, und das Funkgerät steht noch hier. Komm wieder, wenn du es einschalten möchtest."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава пятнадцатая",
    "entry": "Глава пятнадцатая · Новый журнал",
    "enter": "Включить станцию · Обычная связь",
    "finish": "Завершить сюжет · Получить награду",
    "continueStory": "Продолжить пятнадцатую главу",
    "complete": "Все пятнадцать глав завершены. Вернись домой и выбери следующую цель на панели открытой станции.",
    "hint": "Проведи обычное QSO, сохрани его и получи положительную награду. События, записи до принятия задания и несохранённые связи не подходят.",
    "reward": "Награда за задание: 2000 кредитов и 8 очков технологий, один раз. Награды за достижения начисляются отдельно.",
    "seal": "Закрепить эту страницу",
    "choosePrompt": "Выбери, чем заняться дальше",
    "unavailable": "Заверши четырнадцатую главу и прими эту. Подходящие старые задания можно получить в центре заданий.",
    "sealFailed": "Страница не сохранена. Проверь запись связи и попробуй ещё раз.",
    "pinned": "Страница и первый выбор останутся прежними. После сюжета текущую цель можно менять.",
    "simulationWarning": "Вымышленные станции · Игровая симуляция",
    "endings": {
      "world-log": "Ты пишешь: «Послушать дальние края». В следующий раз проверишь, на каком диапазоне кто-нибудь отвечает.",
      "people-network": "Ты пишешь: «Запоминать людей». Услышав знакомый позывной, можно сразу поздороваться.",
      "field-operations": "Ты пишешь: «Как-нибудь взять радио с собой». Рюкзак ещё пуст. Пока хватит списка вещей.",
      "public-service": "Ты пишешь: «Ещё раз потренировать служебную сеть». Это игровая смена. В следующий раз хочется яснее передать дежурство.",
      "contest-craft": "Ты пишешь: «Потренироваться в соревнованиях». Сначала точно, потом чуть быстрее."
    },
    "beats": [
      [
        "Обычное утро",
        "Новая тетрадь лежит рядом со старым журналом. Обложка ещё жёсткая. Ты перелистываешь несколько страниц, пока тетрадь не остаётся открытой.",
        "Сегодня нет назначенного адресата. Ты берёшь наушники и решаешь провести обычную связь."
      ],
      [
        "Строка на сегодня",
        "На первой странице ты пишешь свой позывной: {player}. Дату и позывной собеседника пока оставляешь пустыми.",
        "Заполнишь после связи. Ручка пусть лежит здесь."
      ],
      [
        "Кто на связи?",
        "Ты настраиваешь громкость и кладёшь руку рядом с ключом. Пока неизвестно, кто ответит следующим.",
        "После связи сохрани журнал. На этой странице нужна запись, которую ты действительно оставил."
      ],
      [
        "Строка заполнена",
        "{peer}, рапорты {rst}. Ты сверяешь строку с только что сохранённой связью.",
        "Чем хочется заниматься чаще? Выбери что-нибудь для уголка страницы. До закрепления выбор можно изменить."
      ],
      [
        "Оставить тетрадь открытой",
        "{ending}",
        "Ты кладёшь ручку на стол. Связь с {peer} остаётся на первой странице, а радио — здесь. Возвращайся, когда захочется его включить."
      ]
    ]
  }
};
const IDS=["morning","blank","call","choose","log"],ASSETS=["scene","illustration","scene","illustration","scene"];
export const CHAPTER_FIFTEEN_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterFifteenStoryText(language){
 const t=COPY[language]??COPY.en,activity=FIRST_PAGE_TEXT[language]??FIRST_PAGE_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,
  artLabels:{scene:activity.title,illustration:activity.title},
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

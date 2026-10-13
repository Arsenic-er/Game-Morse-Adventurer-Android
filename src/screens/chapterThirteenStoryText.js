import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {NIGHT_OPERATIONS_TEXT} from "./nightOperationsText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十三章",
    "entry": "第十三章 · 深夜值守",
    "enter": "开机 · 开始值守",
    "finish": "完成第十三章 · 领取任务奖励",
    "continueStory": "继续第十三章",
    "returnToStory": "返回第十三章剧情",
    "complete": "第十三章已完成。夜间值守重玩与第十四章已开放。",
    "unavailable": "请先完成第十二章并接受本章。符合条件的旧任务仍可在任务中心领取。",
    "hint": "四个窗口按表开放，完成其中三个不同台站的呼叫和 599 / 波段交换。第一个窗口在有效计时 30 秒时开放，每个持续 60 秒。AGN / QRS 可请求重复；错过两个窗口，本轮结束。",
    "resumeHint": "设置、离开确认和窗口失焦时暂停。退出或重新载入后，继续保存的排班与有效计时。",
    "recorded": "以下三条通联已保存，均为虚构事件联络，不产生单条通联收益。未完成的窗口不会写成已联络。",
    "reward": "本章任务奖励为 1500 资金与 6 科技点，只领取一次；独立成就奖励另计。",
    "recordLabel": "本次夜间记录",
    "artLabels": {
      "scene": "第十三章夜间台站",
      "portrait": "第十三章值守人员立绘",
      "illustration": "第十三章值守排班插画"
    },
    "beats": [
      [
        "灯留一盏",
        "你伸手去拿杯子，才发现里面已经凉了。桌灯还亮着，排班表压在杯底旁边。",
        "今晚列了四个联络窗口。你把日志翻到空白页，先不写谁会回应。"
      ],
      [
        "照表等一会儿",
        "几个呼号看着眼熟。你翻了翻旧日志，又把手边这张排班表摆正；这一轮的时间和波段都在上面。",
        "窗口还没开，催也没用。你松开电键，把耳机线从本子底下抽出来。"
      ],
      [
        "轮到你守着",
        "发送栏里是 {player}。你试着握了握电键，指尖有点凉。",
        "窗口开放后先呼叫，再核对 599 和波段。没赶上这一站就看下一格，别在关掉的窗口里继续发。"
      ],
      [
        "三行都在",
        "你逐行核对刚保存的记录：{contacts}。三条都有各自的时间，没有一条靠回忆补写。",
        "手从电键上挪开时，才觉得肩膀有些酸。你靠回椅背，又看了一眼屏幕上的记录编号。"
      ],
      [
        "先把这一页收好",
        "这轮值守的三条通联已经入册。你把排班表夹回日志，没完成的格子仍留着。",
        "杯子还是凉的。你端起来喝了一口，皱了下眉，准备给下一页留出位置。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十三章",
    "entry": "第十三章 · 深夜值守",
    "enter": "開機 · 開始值守",
    "finish": "完成第十三章 · 領取任務獎勵",
    "continueStory": "繼續第十三章",
    "returnToStory": "返回第十三章劇情",
    "complete": "第十三章已完成。夜間值守重玩與第十四章已開放。",
    "unavailable": "請先完成第十二章並接受本章。符合條件的舊任務仍可在任務中心領取。",
    "hint": "四個窗口按表開放，完成其中三個不同臺站的呼叫及 599 / 波段交換。第一個窗口於有效計時 30 秒開放，每個持續 60 秒。AGN / QRS 可請求重複；錯過兩個窗口，本輪結束。",
    "resumeHint": "設定、離開確認與視窗失焦時暫停。退出或重新載入後，繼續儲存的排班與有效計時。",
    "recorded": "以下三筆通聯已儲存，皆為虛構事件聯絡，沒有單筆通聯收益。未完成的窗口不會記為已聯絡。",
    "reward": "本章任務獎勵為 1500 資金與 6 科技點，只領一次；獨立成就獎勵另計。",
    "recordLabel": "本次夜間記錄",
    "artLabels": {
      "scene": "第十三章夜間臺站",
      "portrait": "第十三章值守人員立繪",
      "illustration": "第十三章值守排班插畫"
    },
    "beats": [
      [
        "留一盞燈",
        "你伸手拿杯子，才發現裡面已經涼了。桌燈還亮著，排班表壓在杯底旁邊。",
        "今晚列了四個聯絡窗口。你把日誌翻到空白頁，先不寫誰會回應。"
      ],
      [
        "照表等一會兒",
        "幾個呼號看著眼熟。你翻了翻舊日誌，又擺正手邊的排班表；這一輪的時間和波段都在上面。",
        "窗口還沒開，催也沒用。你鬆開電鍵，把耳機線從本子底下抽出來。"
      ],
      [
        "輪到你守著",
        "發送欄裡是 {player}。你試著握了握電鍵，指尖有點涼。",
        "窗口開放後先呼叫，再核對 599 和波段。沒趕上這一站就看下一格，別在關掉的窗口裡繼續發。"
      ],
      [
        "三行都在",
        "你逐行核對剛儲存的記錄：{contacts}。三筆都有各自的時間，沒有一筆靠回憶補寫。",
        "手離開電鍵時，才覺得肩膀有些痠。你靠回椅背，又看了一眼螢幕上的記錄編號。"
      ],
      [
        "收好這一頁",
        "這輪值守的三筆通聯已經入冊。你把排班表夾回日誌，沒完成的格子仍留著。",
        "杯子還是涼的。你端起來喝了一口，皺了下眉，準備給下一頁留出位置。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter thirteen",
    "entry": "Chapter thirteen · Night watch",
    "enter": "Switch on · Begin watch",
    "finish": "Finish chapter thirteen · Claim reward",
    "continueStory": "Continue chapter thirteen",
    "returnToStory": "Return to chapter thirteen",
    "complete": "Chapter thirteen complete. Night-watch replay and chapter fourteen are open.",
    "unavailable": "Finish chapter twelve and accept this chapter first. Eligible legacy tasks can still be claimed in the mission center.",
    "hint": "Use the four scheduled windows to call and exchange 599 / band with three distinct stations. The first opens at 30 active seconds; each lasts 60 seconds. AGN / QRS requests a repeat. Miss two windows and the attempt ends.",
    "resumeHint": "Settings, the leave dialog and loss of focus pause the clock. Leaving or reloading preserves the schedule and active time.",
    "recorded": "These three saved contacts are fictional event contacts with no per-contact payout. Unfinished windows are not logged as contacts.",
    "reward": "The chapter pays 1500 credits and 6 technology points once. Separate achievement rewards may also apply.",
    "recordLabel": "This night's record",
    "artLabels": {
      "scene": "Chapter thirteen night station",
      "portrait": "Chapter thirteen watch operator",
      "illustration": "Chapter thirteen watch schedule"
    },
    "beats": [
      [
        "Leave one lamp on",
        "You reach for the cup. Cold already. The desk lamp is still on, with the schedule tucked beside the cup.",
        "Four contact windows tonight. You turn to a blank log page without filling in who will answer."
      ],
      [
        "Wait for the time on the sheet",
        "Some callsigns look familiar. You check the old log, then straighten tonight's sheet; this run's times and bands are written there.",
        "The window isn't open yet. You let go of the key and pull the headphone cable out from under the notebook."
      ],
      [
        "Your turn at the desk",
        "{player} is in the sending field. You settle your hand on the key. Your fingertips are a little cold.",
        "Call when the window opens, then check 599 and the band. If you miss a station, look to the next slot; don't keep calling into a closed window."
      ],
      [
        "All three rows",
        "You check the saved entries one by one: {contacts}. Each has its own timestamp. Nothing needs filling in from memory.",
        "When you lift your hand from the key, you notice the ache in your shoulder. You lean back and check the record number once more."
      ],
      [
        "Put this page away",
        "The three contacts from this watch are in the log. You tuck the schedule between its pages, leaving unfinished boxes as they are.",
        "The drink is still cold. You take a sip, make a face, and clear a little space for the next page."
      ]
    ]
  },
  "ja": {
    "chapter": "第十三章",
    "entry": "第十三章 · 深夜の当番",
    "enter": "電源を入れる · 当番開始",
    "finish": "第十三章を完了 · 報酬を受け取る",
    "continueStory": "第十三章を続ける",
    "returnToStory": "第十三章の物語へ戻る",
    "complete": "第十三章完了。夜間当番の再プレイと第十四章が開放されました。",
    "unavailable": "第十二章を終えて本章を受注してください。条件を満たす旧タスクは任務センターでも報酬を受け取れます。",
    "hint": "4つの時間枠で異なる3局を呼び、599 / バンドを交換します。最初の枠は有効時間30秒で開き、各枠は60秒間です。AGN / QRS で再送を依頼。2枠を逃すと終了します。",
    "resumeHint": "設定、退出確認、フォーカス喪失中は一時停止。退出や再読み込み後も予定表と有効時間を引き継ぎます。",
    "recorded": "保存済みの3件は架空イベントの交信で、個別報酬はありません。未完了の枠は交信済みとして記録されません。",
    "reward": "本章の報酬は資金1500と技術ポイント6、受け取りは一度だけ。実績報酬は別途です。",
    "recordLabel": "今夜の記録",
    "artLabels": {
      "scene": "第十三章の夜の局",
      "portrait": "第十三章の当番担当者",
      "illustration": "第十三章の当番表"
    },
    "beats": [
      [
        "明かりをひとつ残す",
        "カップに手を伸ばす。もう冷たい。机の明かりはついたままで、カップの横に予定表がある。",
        "今夜の交信枠は4つ。ログの空白ページを開く。誰が応答するかは、まだ書かない。"
      ],
      [
        "表の時刻を待つ",
        "見覚えのある呼出符号がいくつか並ぶ。古いログをめくってから、今夜の表を置き直す。今回の時刻とバンドはここにある。",
        "まだ時間ではない。電鍵から手を離し、ノートの下に挟まったヘッドホンの線を引き出す。"
      ],
      [
        "当番の時間",
        "送信欄には {player}。電鍵に手を添えると、指先が少し冷えているのが分かる。",
        "枠が開いたら呼び出し、599とバンドを確かめる。逃したら次の枠へ。閉じた枠で呼び続ける必要はない。"
      ],
      [
        "3行とも残っている",
        "保存した記録を一行ずつ確かめる。{contacts}。それぞれに時刻があり、記憶で埋める欄はない。",
        "手を電鍵から離して、肩のこりに気づく。背もたれに体を預け、もう一度記録番号を見る。"
      ],
      [
        "このページをしまう",
        "今回の3件はログに入った。未完了の枠はそのままにして、予定表をページの間に挟む。",
        "飲み物はやっぱり冷たい。一口飲んで顔をしかめ、次のページを置く場所を空ける。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo trece",
    "entry": "Capítulo trece · Guardia nocturna",
    "enter": "Encender · Empezar la guardia",
    "finish": "Terminar el capítulo trece · Cobrar recompensa",
    "continueStory": "Continuar el capítulo trece",
    "returnToStory": "Volver al capítulo trece",
    "complete": "Capítulo trece completado. Ya puedes repetir la guardia y entrar al capítulo catorce.",
    "unavailable": "Termina el capítulo doce y acepta este capítulo. Las misiones antiguas válidas siguen disponibles para cobrar en el centro de misiones.",
    "hint": "En las cuatro ventanas programadas, llama a tres estaciones distintas e intercambia 599 / banda. La primera abre a los 30 segundos activos; cada una dura 60 segundos. AGN / QRS pide repetición. Perder dos ventanas termina el intento.",
    "resumeHint": "Los ajustes, el diálogo de salida y la pérdida de foco pausan el reloj. Salir o recargar conserva el horario y el tiempo activo.",
    "recorded": "Estos tres contactos guardados son eventos ficticios sin pago individual. Las ventanas sin completar no se registran como contactos.",
    "reward": "El capítulo paga 1500 créditos y 6 puntos tecnológicos una sola vez. Los premios por logros se calculan aparte.",
    "recordLabel": "Registro de esta noche",
    "artLabels": {
      "scene": "Estación nocturna del capítulo trece",
      "portrait": "Operador de guardia del capítulo trece",
      "illustration": "Horario de guardia del capítulo trece"
    },
    "beats": [
      [
        "Dejar una lámpara encendida",
        "Alargas la mano hacia la taza. Ya está fría. La lámpara sigue encendida; al lado de la taza está el horario.",
        "Esta noche hay cuatro ventanas de contacto. Abres una página en blanco sin apuntar todavía quién responderá."
      ],
      [
        "Esperar la hora indicada",
        "Reconoces algunos indicativos. Revisas el registro antiguo y enderezas la hoja de esta noche, con sus horas y bandas.",
        "La ventana aún no ha abierto. Sueltas el manipulador y sacas el cable de los auriculares de debajo del cuaderno."
      ],
      [
        "Tu turno en la mesa",
        "En el campo de envío figura {player}. Apoyas la mano en el manipulador; tienes las puntas de los dedos frías.",
        "Llama cuando abra la ventana y comprueba 599 y la banda. Si pierdes una estación, pasa al siguiente turno. No sigas llamando en una ventana cerrada."
      ],
      [
        "Las tres líneas",
        "Repasas las entradas guardadas: {contacts}. Cada una tiene su hora. No hay que rellenar nada de memoria.",
        "Al apartar la mano notas el hombro cargado. Te recuestas en la silla y miras de nuevo el número de registro."
      ],
      [
        "Guardar esta página",
        "Los tres contactos de esta guardia están en el registro. Guardas el horario entre las páginas, sin rellenar las casillas pendientes.",
        "La bebida sigue fría. Tomas un sorbo, haces una mueca y despejas un hueco para la siguiente página."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel dreizehn",
    "entry": "Kapitel dreizehn · Nachtwache",
    "enter": "Einschalten · Wache beginnen",
    "finish": "Kapitel dreizehn abschließen · Belohnung abholen",
    "continueStory": "Kapitel dreizehn fortsetzen",
    "returnToStory": "Zur Geschichte von Kapitel dreizehn",
    "complete": "Kapitel dreizehn abgeschlossen. Nachtwachen-Wiederholung und Kapitel vierzehn sind frei.",
    "unavailable": "Schließe Kapitel zwölf ab und nimm dieses Kapitel an. Gültige ältere Aufgaben können weiterhin im Missionszentrum abgeholt werden.",
    "hint": "Rufe in vier Zeitfenstern drei verschiedene Stationen und tausche 599 / Band aus. Das erste Fenster öffnet nach 30 aktiven Sekunden; jedes dauert 60 Sekunden. AGN / QRS fordert Wiederholung an. Zwei verpasste Fenster beenden den Versuch.",
    "resumeHint": "Einstellungen, Rückfrage beim Verlassen und Fokusverlust pausieren die Uhr. Verlassen oder Neuladen erhält Zeitplan und aktive Zeit.",
    "recorded": "Die drei gespeicherten Kontakte sind fiktive Ereigniskontakte ohne Einzelvergütung. Unfertige Fenster zählen nicht als Kontakte.",
    "reward": "Das Kapitel vergibt einmalig 1500 Credits und 6 Technologiepunkte. Erfolgsbelohnungen werden separat berechnet.",
    "recordLabel": "Aufzeichnung dieser Nacht",
    "artLabels": {
      "scene": "Nachtstation in Kapitel dreizehn",
      "portrait": "Wachpersonal in Kapitel dreizehn",
      "illustration": "Wachplan in Kapitel dreizehn"
    },
    "beats": [
      [
        "Eine Lampe bleibt an",
        "Du greifst nach der Tasse. Schon kalt. Die Tischlampe brennt noch, daneben liegt der Zeitplan.",
        "Vier Kontaktfenster heute Nacht. Du schlägst eine leere Logbuchseite auf, ohne schon einzutragen, wer antworten wird."
      ],
      [
        "Auf die Zeit im Plan warten",
        "Einige Rufzeichen kennst du. Du blätterst im alten Logbuch und rückst den heutigen Plan gerade. Hier stehen die Zeiten und Bänder dieser Runde.",
        "Das Fenster ist noch nicht offen. Du lässt die Taste los und ziehst das Kopfhörerkabel unter dem Heft hervor."
      ],
      [
        "Jetzt sitzt du am Funkgerät",
        "Im Sendefeld steht {player}. Du legst die Hand an die Taste. Deine Fingerspitzen sind etwas kalt.",
        "Rufe, sobald das Fenster offen ist, und prüfe dann 599 und das Band. Verpasst du eine Station, sieh nach dem nächsten Termin. Rufe nicht im geschlossenen Fenster weiter."
      ],
      [
        "Alle drei Zeilen",
        "Du prüfst die gespeicherten Einträge: {contacts}. Jeder hat seine eigene Zeitangabe. Nichts muss aus dem Gedächtnis ergänzt werden.",
        "Als du die Hand von der Taste nimmst, merkst du das Ziehen in der Schulter. Du lehnst dich zurück und prüfst noch einmal die Aufzeichnungsnummer."
      ],
      [
        "Diese Seite weglegen",
        "Die drei Kontakte der Wache stehen im Logbuch. Du legst den Plan zwischen die Seiten. Unfertige Felder bleiben unverändert.",
        "Das Getränk ist immer noch kalt. Du nimmst einen Schluck, verziehst das Gesicht und machst Platz für die nächste Seite."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава тринадцатая",
    "entry": "Глава тринадцатая · Ночная вахта",
    "enter": "Включить станцию · Начать вахту",
    "finish": "Завершить главу тринадцать · Получить награду",
    "continueStory": "Продолжить главу тринадцать",
    "returnToStory": "Вернуться к главе тринадцать",
    "complete": "Глава тринадцать завершена. Открыты повтор ночной вахты и глава четырнадцать.",
    "unavailable": "Сначала заверши главу двенадцать и прими эту. Подходящие старые задания по-прежнему можно закрыть в центре миссий.",
    "hint": "В четырёх окнах свяжись с тремя разными станциями и обменяйся 599 / диапазоном. Первое окно открывается на 30-й активной секунде; каждое длится 60 секунд. AGN / QRS запрашивает повтор. Два пропущенных окна завершают попытку.",
    "resumeHint": "Настройки, подтверждение выхода и потеря фокуса ставят часы на паузу. Выход и перезагрузка сохраняют расписание и активное время.",
    "recorded": "Эти три сохранённых контакта — вымышленные событийные связи без отдельной оплаты. Незавершённые окна не записываются как контакты.",
    "reward": "Награда главы — 1500 кредитов и 6 очков технологий, только один раз. Награды за достижения начисляются отдельно.",
    "recordLabel": "Запись этой ночи",
    "artLabels": {
      "scene": "Ночная станция главы тринадцать",
      "portrait": "Дежурный главы тринадцать",
      "illustration": "Расписание вахты главы тринадцать"
    },
    "beats": [
      [
        "Оставить одну лампу",
        "Ты тянешься к чашке. Уже холодная. Настольная лампа ещё горит, рядом с чашкой лежит расписание.",
        "На ночь назначены четыре окна связи. Ты открываешь чистую страницу журнала, пока не вписывая, кто ответит."
      ],
      [
        "Подождать по расписанию",
        "Некоторые позывные знакомы. Ты листаешь старый журнал и поправляешь сегодняшний лист: на нём время и диапазоны этой попытки.",
        "Окно ещё не открылось. Ты отпускаешь ключ и вытягиваешь провод наушников из-под тетради."
      ],
      [
        "Твоя очередь у стола",
        "В поле отправителя стоит {player}. Ты кладёшь руку на ключ. Кончики пальцев немного замёрзли.",
        "Когда окно откроется, вызови станцию, затем сверь 599 и диапазон. Не успеешь — смотри следующий слот. В закрытом окне продолжать вызов не нужно."
      ],
      [
        "Все три строки",
        "Ты сверяешь сохранённые записи: {contacts}. У каждой своё время. Ничего не приходится дописывать по памяти.",
        "Убрав руку с ключа, ты замечаешь, как ноет плечо. Откидываешься на спинку стула и ещё раз смотришь на номер записи."
      ],
      [
        "Убрать эту страницу",
        "Три контакта этой вахты внесены в журнал. Ты вкладываешь расписание между страницами, оставляя незавершённые клетки как есть.",
        "Напиток всё ещё холодный. Ты делаешь глоток, морщишься и освобождаешь место для следующей страницы."
      ]
    ]
  }
};
const IDS=["late","schedule","watch","contacts","log"],ASSETS=["scene","illustration","scene","illustration","scene"];
export const CHAPTER_THIRTEEN_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterThirteenStoryText(language){
 const t=COPY[language]??COPY.en,activity=NIGHT_OPERATIONS_TEXT[language]??NIGHT_OPERATIONS_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,simulationWarning:activity.simulationWarning,
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

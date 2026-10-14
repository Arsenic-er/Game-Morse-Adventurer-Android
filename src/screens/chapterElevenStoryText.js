import {chapterTwoStoryText} from "./chapterTwoStoryText.js";
import {LISTENING_TEXT} from "./listeningText.js";
const COPY={
  "zh-CN": {
    "chapter": "第十一章",
    "entry": "第十一章 · 听不见的人",
    "enter": "开机 · 开始守听",
    "finish": "完成第十一章 · 领取任务奖励",
    "continueStory": "继续第十一章",
    "returnToStory": "返回第十一章剧情",
    "complete": "第十一章已完成。守听重玩已开放，可以接第十二章。",
    "unavailable": "请先完成第十章，再接受本章。符合条件的旧任务仍可在任务中心领取。",
    "hint": "查看三个监听窗口，再用电键呼叫 SIM11LS。等候结束后可以记录静默，也可以最后再呼叫一次。本章最多呼叫两次，不会生成对方回复。",
    "resumeHint": "窗口记录、呼叫次数和有效计时会保存。设置、离开确认和窗口失焦时暂停；恢复后，本次等候重新计满四秒。",
    "recorded": "这里只记录本次未收到回应。没有收到的内容不补写，也不计作成功通联。",
    "reward": "保存监听记录不发资金、不增加 QSO。本章奖励为 1200 资金与 5 科技点，只领取一次；独立成就奖励另计。",
    "recordLabel": "本次监听记录",
    "conclusion": "本次未收到回应",
    "callsLabel": "呼叫次数",
    "windowsLabel": "观察窗口",
    "timeLabel": "有效时间",
    "artLabels": {
      "scene": "第十一章守听台站",
      "portrait": "第十一章人物立绘（无回复）",
      "illustration": "第十一章监听笔记插画"
    },
    "beats": [
      [
        "把音量留在这里",
        "上一页的流水号写得很满。你翻过一张，把笔放在空白页边上。",
        "这次要呼叫的是 SIM11LS。你核对了一遍呼号，手还没有碰电键。"
      ],
      [
        "先看完三个窗口",
        "纸上分了三栏，分别记着传播和噪声的变化。你按顺序查看，没有跳到最后一栏。",
        "暂时没有可抄的回复。你把这几项观察留下，呼叫的那一行还空着。"
      ],
      [
        "叫完，留一点时间",
        "你写下 {player}，照着提示核对双方呼号。发完这一句，就松开电键。",
        "等候结束后再作决定。可以到此记录静默；如果再叫一次，这就是本轮最后一次。"
      ],
      [
        "这一轮到这里",
        "三个窗口都已查看。本次呼叫 {calls} 次，保存的有效时间为 {seconds} 秒，仍未收到回应。",
        "你想在日志后面多写一句，笔尖停了一下。对方为什么没有回答，这一页说明不了。"
      ],
      [
        "没有抄到的，就空着",
        "你在结论栏写下“本次未收到回应”，没有填信号报告，也没有记成通联成功。",
        "纸还留在电台旁边。你把电键放开，核对保存时间，结束这一轮。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第十一章",
    "entry": "第十一章 · 聽不見的人",
    "enter": "開機 · 開始守聽",
    "finish": "完成第十一章 · 領取任務獎勵",
    "continueStory": "繼續第十一章",
    "returnToStory": "返回第十一章劇情",
    "complete": "第十一章已完成。守聽重玩已開放，可以接第十二章。",
    "unavailable": "請先完成第十章，再接受本章。符合條件的舊任務仍可在任務中心領取。",
    "hint": "查看三個監聽視窗，再用電鍵呼叫 SIM11LS。等候結束後可記錄靜默，也可最後再呼叫一次。本章最多呼叫兩次，不會生成對方回覆。",
    "resumeHint": "視窗記錄、呼叫次數和有效計時會儲存。設定、離開確認和視窗失焦時暫停；恢復後，本次等候重新計滿四秒。",
    "recorded": "這裡只記錄本次未收到回應。沒收到的內容不補寫，也不計作成功通聯。",
    "reward": "儲存監聽記錄不發資金、不增加 QSO。本章獎勵為 1200 資金與 5 科技點，只領一次；獨立成就獎勵另計。",
    "recordLabel": "本次監聽記錄",
    "conclusion": "本次未收到回應",
    "callsLabel": "呼叫次數",
    "windowsLabel": "觀察視窗",
    "timeLabel": "有效時間",
    "artLabels": {
      "scene": "第十一章守聽台站",
      "portrait": "第十一章人物立繪（無回覆）",
      "illustration": "第十一章監聽筆記插畫"
    },
    "beats": [
      [
        "音量就留在這裡",
        "上一頁的流水號寫得很滿。你翻過一張，把筆放在空白頁邊。",
        "這次要呼叫的是 SIM11LS。你核對一遍呼號，手還沒碰電鍵。"
      ],
      [
        "先看完三個視窗",
        "紙上分了三欄，分別記著傳播和雜訊的變化。你按順序查看，沒有跳到最後一欄。",
        "暫時沒有可抄的回覆。你留下這幾項觀察，呼叫那一行還空著。"
      ],
      [
        "叫完，留一點時間",
        "你寫下 {player}，照提示核對雙方呼號。發完這一句，就鬆開電鍵。",
        "等候結束後再決定。可以記錄靜默；若再叫一次，這就是本輪最後一次。"
      ],
      [
        "這一輪到這裡",
        "三個視窗都已查看。本次呼叫 {calls} 次，儲存的有效時間為 {seconds} 秒，仍未收到回應。",
        "你想在日誌後面多寫一句，筆尖停了停。對方為什麼沒回答，這一頁說明不了。"
      ],
      [
        "沒抄到的，就空著",
        "你在結論欄寫下「本次未收到回應」，沒填信號報告，也沒記成通聯成功。",
        "紙還留在電台旁。你放開電鍵，核對儲存時間，結束這一輪。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Eleven",
    "entry": "Chapter Eleven · The One Who Cannot Hear",
    "enter": "Power on · Start listening",
    "finish": "Finish Chapter Eleven · Claim reward",
    "continueStory": "Continue Chapter Eleven",
    "returnToStory": "Return to Chapter Eleven",
    "complete": "Chapter Eleven is complete. Listening replay and Chapter Twelve are available.",
    "unavailable": "Complete Chapter Ten and accept this chapter first. Eligible older tasks can still be claimed in the mission center.",
    "hint": "Review all three listening windows, then key a call to SIM11LS. After waiting, record the silence or make one final call. Two calls maximum; no reply is generated.",
    "resumeHint": "Window observations, call count and active time are saved. Settings, the leave dialog and loss of focus pause the attempt. On resuming, the current four-second wait starts again.",
    "recorded": "This record says only that no reply was received in this attempt. It does not fill in a reply or count as a successful contact.",
    "reward": "Saving pays no credits and adds no QSO. The chapter awards 1200 credits and 5 technology points once; separate achievement rewards may apply.",
    "recordLabel": "This listening record",
    "conclusion": "No reply received in this attempt",
    "callsLabel": "Calls sent",
    "windowsLabel": "Windows observed",
    "timeLabel": "Active time",
    "artLabels": {
      "scene": "Chapter Eleven listening station",
      "portrait": "Chapter Eleven character art (no reply)",
      "illustration": "Chapter Eleven listening notes"
    },
    "beats": [
      [
        "Leave the volume here",
        "The previous page is full of serial numbers. You turn it and put your pen beside the blank sheet.",
        "The target this time is SIM11LS. You check the callsign before touching the key."
      ],
      [
        "All three windows first",
        "The sheet has three columns for changes in propagation and noise. You review them in order.",
        "There is no reply to copy. You keep the observations and leave the call line empty for now."
      ],
      [
        "Call, then leave some time",
        "You write {player} and check both callsigns against the prompt. After sending this line, let go of the key.",
        "Decide when the wait ends. You can record the silence, or call once more. That would be the last call of this attempt."
      ],
      [
        "End this attempt here",
        "All three windows were reviewed. This attempt saved {calls} calls and {seconds} active seconds, with no reply received.",
        "You almost add another sentence to the log. The pen stops. This page cannot tell you why the other station did not answer."
      ],
      [
        "Leave what you did not copy blank",
        "You write “No reply received in this attempt.” There is no signal report to enter and no successful contact to log.",
        "The sheet stays beside the radio. You release the key, check the saved time and close this attempt."
      ]
    ]
  },
  "ja": {
    "chapter": "第十一章",
    "entry": "第十一章 · 聞こえない人",
    "enter": "電源を入れる · 受信開始",
    "finish": "第十一章を完了 · 報酬を受け取る",
    "continueStory": "第十一章の続きを見る",
    "returnToStory": "第十一章の物語へ戻る",
    "complete": "第十一章完了。受信の再挑戦と第十二章が開放されました。",
    "unavailable": "第十章を終えて、この章を受注してください。条件を満たす旧タスクはタスク画面でも受領できます。",
    "hint": "3つの受信窓を確認し、電鍵でSIM11LSを呼びます。待機後は無応答を記録するか、最後にもう一度呼べます。最大2回。相手の返信は生成されません。",
    "resumeHint": "観測、呼出回数、有効時間は保存されます。設定、退出確認、フォーカス喪失中は停止。再開後の待機は4秒間の最初から始まります。",
    "recorded": "今回は返信を受信しなかった、という記録です。返信を補ったり、交信成功として数えたりはしません。",
    "reward": "記録保存による資金やQSOの追加はありません。章報酬は1200資金と5技術点で一度のみ。実績報酬は別です。",
    "recordLabel": "今回の受信記録",
    "conclusion": "今回は返信を受信せず",
    "callsLabel": "呼出回数",
    "windowsLabel": "観測した窓",
    "timeLabel": "有効時間",
    "artLabels": {
      "scene": "第十一章の受信局",
      "portrait": "第十一章の人物画（返信なし）",
      "illustration": "第十一章の受信メモ"
    },
    "beats": [
      [
        "音量はこのままで",
        "前のページには連番が並んでいる。一枚めくり、白い紙の脇にペンを置いた。",
        "今回の相手はSIM11LS。呼出符号を確かめる。まだ電鍵には触れない。"
      ],
      [
        "まず3つの窓を",
        "紙には伝搬と雑音の変化を記す欄が3つある。最後まで順番に確認した。",
        "書き取る返信はない。観測を残し、呼出の行はまだ空けておく。"
      ],
      [
        "呼んだら、待つ",
        "{player}と書き、表示と双方の呼出符号を照らし合わせる。この一文を送ったら電鍵を離す。",
        "待機が終わってから決めよう。無応答を記録しても、もう一度呼んでもよい。次が今回最後の呼出になる。"
      ],
      [
        "今回はここまで",
        "3つの窓を確認した。呼出は{calls}回、保存された有効時間は{seconds}秒。返信は受信していない。",
        "ログにもう一文足そうとして、ペンが止まった。相手が答えなかった理由は、このページからは分からない。"
      ],
      [
        "聞けなかった欄は空けて",
        "「今回は返信を受信せず」と結論に書く。信号報告は記入せず、交信成功にも数えない。",
        "紙は無線機の脇に置いたまま。電鍵を離し、保存時刻を確認して今回を終えた。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo once",
    "entry": "Capítulo once · Quien no puede oír",
    "enter": "Encender · Iniciar escucha",
    "finish": "Terminar el capítulo once · Cobrar",
    "continueStory": "Continuar el capítulo once",
    "returnToStory": "Volver al capítulo once",
    "complete": "Capítulo once completado. Puedes repetir la escucha y aceptar el capítulo doce.",
    "unavailable": "Completa el capítulo diez y acepta este. Las tareas antiguas que cumplan los requisitos se pueden cobrar en el centro de misiones.",
    "hint": "Revisa las tres ventanas y llama a SIM11LS con el manipulador. Tras la espera, registra el silencio o llama una última vez. Máximo dos llamadas; no se genera respuesta.",
    "resumeHint": "Se guardan observaciones, llamadas y tiempo activo. Ajustes, confirmación de salida y pérdida de foco pausan el intento. Al volver, la espera actual comienza de nuevo desde cuatro segundos.",
    "recorded": "Solo consta que no se recibió respuesta en este intento. No se inventa ninguna ni se cuenta como contacto logrado.",
    "reward": "Guardar no da créditos ni añade QSO. El capítulo otorga 1200 créditos y 5 puntos tecnológicos una vez; los logros se premian aparte.",
    "recordLabel": "Registro de esta escucha",
    "conclusion": "Sin respuesta en este intento",
    "callsLabel": "Llamadas enviadas",
    "windowsLabel": "Ventanas observadas",
    "timeLabel": "Tiempo activo",
    "artLabels": {
      "scene": "Estación de escucha del capítulo once",
      "portrait": "Personaje del capítulo once (sin respuesta)",
      "illustration": "Notas de escucha del capítulo once"
    },
    "beats": [
      [
        "Deja el volumen así",
        "La página anterior está llena de números de serie. Pasas la hoja y dejas el bolígrafo junto al papel en blanco.",
        "Esta vez llamarás a SIM11LS. Compruebas el indicativo antes de tocar el manipulador."
      ],
      [
        "Primero, las tres ventanas",
        "Hay tres columnas para anotar cambios de propagación y ruido. Las revisas en orden.",
        "No hay respuesta que copiar. Conservas las observaciones; la línea de la llamada aún está vacía."
      ],
      [
        "Llama y deja tiempo",
        "Escribes {player} y cotejas ambos indicativos con la indicación. Al acabar esta frase, suelta el manipulador.",
        "Decide al terminar la espera. Puedes registrar el silencio o llamar una vez más. Será la última de este intento."
      ],
      [
        "Hasta aquí este intento",
        "Has revisado las tres ventanas. Se guardaron {calls} llamadas y {seconds} segundos activos, sin recibir respuesta.",
        "Vas a añadir otra frase al registro, pero paras el bolígrafo. Esta página no explica por qué la otra estación no respondió."
      ],
      [
        "Lo que no copiaste queda vacío",
        "Escribes «Sin respuesta en este intento». No añades un informe de señal ni anotas un contacto logrado.",
        "El papel sigue junto a la radio. Sueltas el manipulador, compruebas la hora guardada y cierras el intento."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel elf",
    "entry": "Kapitel elf · Der Mensch, der nicht hören kann",
    "enter": "Einschalten · Zuhören",
    "finish": "Kapitel elf abschließen · Belohnung",
    "continueStory": "Kapitel elf fortsetzen",
    "returnToStory": "Zurück zu Kapitel elf",
    "complete": "Kapitel elf abgeschlossen. Hörwiederholung und Kapitel zwölf sind verfügbar.",
    "unavailable": "Schließe Kapitel zehn ab und nimm dieses an. Berechtigte ältere Aufgaben lassen sich im Missionszentrum abschließen.",
    "hint": "Prüfe alle drei Hörfenster und taste einen Anruf an SIM11LS. Nach der Wartezeit kannst du die Stille erfassen oder ein letztes Mal rufen. Höchstens zwei Anrufe; es wird keine Antwort erzeugt.",
    "resumeHint": "Beobachtungen, Anrufzahl und aktive Zeit werden gespeichert. Einstellungen, Rückfrage zum Verlassen und Fokusverlust pausieren. Danach beginnt die aktuelle Wartezeit von vier Sekunden erneut.",
    "recorded": "Hier steht nur, dass in diesem Versuch keine Antwort empfangen wurde. Es wird keine ergänzt und keine erfolgreiche Verbindung gezählt.",
    "reward": "Speichern gibt weder Geld noch ein QSO. Die Kapitelbelohnung beträgt einmalig 1200 Credits und 5 Technologiepunkte; Erfolge zählen separat.",
    "recordLabel": "Dieses Hörprotokoll",
    "conclusion": "In diesem Versuch keine Antwort",
    "callsLabel": "Gesendete Anrufe",
    "windowsLabel": "Beobachtete Fenster",
    "timeLabel": "Aktive Zeit",
    "artLabels": {
      "scene": "Hörstation aus Kapitel elf",
      "portrait": "Figur aus Kapitel elf (keine Antwort)",
      "illustration": "Hörnotizen aus Kapitel elf"
    },
    "beats": [
      [
        "Lass die Lautstärke so",
        "Die letzte Seite ist voller laufender Nummern. Du blätterst um und legst den Stift neben das leere Blatt.",
        "Diesmal ist SIM11LS das Ziel. Du prüfst das Rufzeichen, bevor du die Taste berührst."
      ],
      [
        "Erst alle drei Fenster",
        "Drei Spalten halten Änderungen von Ausbreitung und Rauschen fest. Du gehst sie der Reihe nach durch.",
        "Es gibt keine Antwort mitzuschreiben. Du behältst die Beobachtungen; die Zeile für den Anruf bleibt vorerst leer."
      ],
      [
        "Rufen, dann Zeit lassen",
        "Du schreibst {player} und vergleichst beide Rufzeichen mit der Anzeige. Nach dieser Zeile lässt du die Taste los.",
        "Entscheide nach der Wartezeit. Erfasse die Stille oder rufe noch einmal. Das ist dann der letzte Anruf dieses Versuchs."
      ],
      [
        "Für diesmal genug",
        "Alle drei Fenster wurden geprüft. Gespeichert sind {calls} Anrufe und {seconds} aktive Sekunden. Eine Antwort wurde nicht empfangen.",
        "Du willst noch einen Satz ergänzen und hältst den Stift an. Warum die andere Station nicht geantwortet hat, steht nicht auf diesem Blatt."
      ],
      [
        "Nicht Gehörtes bleibt leer",
        "Du schreibst: „In diesem Versuch keine Antwort.“ Du trägst keinen Signalbericht und keine erfolgreiche Verbindung ein.",
        "Das Blatt bleibt neben dem Funkgerät. Du lässt die Taste los, prüfst die gespeicherte Zeit und beendest den Versuch."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава одиннадцать",
    "entry": "Глава одиннадцать · Тот, кто не слышит",
    "enter": "Включить · Начать прослушивание",
    "finish": "Завершить главу одиннадцать · Награда",
    "continueStory": "Продолжить главу одиннадцать",
    "returnToStory": "Вернуться к главе одиннадцать",
    "complete": "Глава одиннадцать завершена. Доступны повтор прослушивания и глава двенадцать.",
    "unavailable": "Завершите главу десять и примите эту. Подходящие старые задания можно завершить в центре миссий.",
    "hint": "Проверьте три окна и передайте вызов SIM11LS ключом. После ожидания запишите тишину или вызовите ещё раз, в последний раз. Не более двух вызовов; ответ не создаётся.",
    "resumeHint": "Наблюдения, число вызовов и активное время сохраняются. Настройки, подтверждение выхода и потеря фокуса ставят попытку на паузу. После возврата текущее ожидание снова длится четыре секунды.",
    "recorded": "Здесь записано лишь отсутствие ответа в этой попытке. Ответ не дописывается, успешная связь не засчитывается.",
    "reward": "Сохранение не даёт денег и не добавляет QSO. Награда главы — 1200 кредитов и 5 очков технологий, один раз. Награды за достижения считаются отдельно.",
    "recordLabel": "Запись этой попытки",
    "conclusion": "В этой попытке ответ не получен",
    "callsLabel": "Передано вызовов",
    "windowsLabel": "Окна наблюдения",
    "timeLabel": "Активное время",
    "artLabels": {
      "scene": "Станция прослушивания главы одиннадцать",
      "portrait": "Персонаж главы одиннадцать (без ответа)",
      "illustration": "Заметки о прослушивании"
    },
    "beats": [
      [
        "Оставь громкость так",
        "Предыдущая страница заполнена порядковыми номерами. Ты переворачиваешь лист и кладёшь ручку рядом с чистой страницей.",
        "На этот раз цель — SIM11LS. Ты проверяешь позывной, ещё не касаясь ключа."
      ],
      [
        "Сначала все три окна",
        "На листе три столбца для изменений прохождения и шума. Ты просматриваешь их по порядку.",
        "Ответа для записи нет. Наблюдения остаются на странице; строка вызова пока пуста."
      ],
      [
        "Вызови и дай время",
        "Ты пишешь {player} и сверяешь оба позывных с подсказкой. Закончив эту строку, отпускаешь ключ.",
        "Решай после ожидания. Можно записать тишину или вызвать ещё раз. Это будет последний вызов в этой попытке."
      ],
      [
        "На этот раз всё",
        "Проверены все три окна. Сохранено {calls} вызовов и {seconds} активных секунд. Ответ не получен.",
        "Ты хочешь дописать ещё одну фразу, но останавливаешь ручку. Эта страница не объясняет, почему другая станция не ответила."
      ],
      [
        "Непринятое оставь пустым",
        "В выводе ты пишешь: «В этой попытке ответ не получен». Не добавляешь рапорт и не отмечаешь успешную связь.",
        "Лист остаётся у радиостанции. Ты отпускаешь ключ, проверяешь время сохранения и заканчиваешь попытку."
      ]
    ]
  }
};
const IDS=["quiet","windows","call","silence","log"],ASSETS=["scene","scene","illustration","portrait","scene"];
export const CHAPTER_ELEVEN_LANGUAGES=Object.freeze(Object.keys(COPY));
export function chapterElevenStoryText(language){
 const t=COPY[language]??COPY.en,activity=LISTENING_TEXT[language]??LISTENING_TEXT.en;
 return {...chapterTwoStoryText(language),...t,title:activity.title,simulationWarning:activity.simulationWarning,
  beats:t.beats.map(([title,...paragraphs],index)=>({id:IDS[index],asset:ASSETS[index],title,paragraphs,eyebrow:t.chapter}))};
}

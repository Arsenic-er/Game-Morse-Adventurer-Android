import { chapterTwoStoryText } from "./chapterTwoStoryText.js";
import { lightsText } from "./lightsEventText.js";

const COPY = {
  "zh-CN": {
    "chapter": "第五章",
    "title": "空中灯火",
    "entry": "第五章 · 空中灯火",
    "enter": "进入活动 · 先追呼 SIM5LT",
    "finish": "完成第五章 · 领取任务奖励",
    "continueStory": "继续第五章",
    "complete": "第五章已完成，第六章已开放。",
    "unavailable": "请从任务中心接受第五章。若旧任务已达标但核验记录不完整，仍可在任务中心领取奖励。",
    "hint": "先用自己的呼号追呼 SIM5LT，交换后接管活动台。八分钟内完成至少 3 次有效通联、覆盖 2 个地区，并处理至少 1 次多人同时呼叫，取得基础或更高评级。结束后先结算，再回到剧情。",
    "resumeHint": "剧情书签和已结算的记录会保存。未结算的活动局离开或刷新后需要重开；剧情场不受年度活动日期限制，练习和年度成绩不代替本章。",
    "summary": "已核实：{count} 次通联 · {regions} 个地区",
    "recorded": "这些条目来自同一局已结算的剧情活动。呼号、报告和地区均按保存的日志显示。",
    "reward": "活动评级奖励在结算时处理；这里仅领取一次第五章任务奖励，不重复结算通联。",
    "grade": "评级",
    "score": "分数",
    "region": "地区",
    "artLabels": {
      "scene": "第五章夜间活动台场景",
      "portrait": "活动台角色立绘，仅在通联结束后展示",
      "illustration": "空中灯火活动插画"
    },
    "beats": [
      [
        "桌上多了一张活动单",
        "NOVA 把一张活动单放在日志旁。SIM5LT 印在最上面，下面留着几行值班安排。",
        "你把纸拿近了一点。先去追呼这个活动台，交换完报告，再接下一班。"
      ],
      [
        "多留几行空白",
        "你翻到一张空白通联页，把椅子往电键前挪了挪。呼号、报告和地区，各有地方记。",
        "同时有人叫进来也不用一起回。先选一个听清的，做完这一条，再听下一次呼叫。"
      ],
      [
        "先用自己的呼号",
        "{player} 写在页头。接班之前，你还是用这个呼号呼叫 SIM5LT。",
        "等交换结束，活动台才交到你手里。那时发出的呼号就是 SIM5LT，别顺手把自己的呼号带进去。"
      ],
      [
        "松开电键",
        "这局活动已经结算：{count} 次通联，{regions} 个地区，评级是{grade}。",
        "你松开电键，活动了一下手腕。刚才顾着接呼叫，笔滚到了日志下面，现在才腾出手把它找出来。"
      ],
      [
        "把这一班记好",
        "你按时间核对这些呼号，把双方的报告和地区再看一遍。地图上亮起哪些位置，就以这些记录为准。",
        "日志合上时，纸角还露在外面。你把它理平，给下一班留好桌面。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第五章",
    "title": "空中燈火",
    "entry": "第五章 · 空中燈火",
    "enter": "進入活動 · 先追呼 SIM5LT",
    "finish": "完成第五章 · 領取任務獎勵",
    "continueStory": "繼續第五章",
    "complete": "第五章已完成，第六章已開放。",
    "unavailable": "請從任務中心接受第五章。若舊任務已達標但核驗紀錄不完整，仍可在任務中心領取獎勵。",
    "hint": "先用自己的呼號追呼 SIM5LT，交換後接管活動臺。八分鐘內完成至少 3 次有效通聯、涵蓋 2 個地區，並處理至少 1 次多人同時呼叫，取得基礎或更高評級。結束後先結算，再回到劇情。",
    "resumeHint": "劇情書籤和已結算的紀錄會保存。未結算的活動局離開或重新整理後需要重開；劇情場不受年度活動日期限制，練習和年度成績不代替本章。",
    "summary": "已核實：{count} 次通聯 · {regions} 個地區",
    "recorded": "這些條目來自同一局已結算的劇情活動。呼號、報告和地區均依保存的日誌顯示。",
    "reward": "活動評級獎勵在結算時處理；這裡僅領取一次第五章任務獎勵，不重複結算通聯。",
    "grade": "評級",
    "score": "分數",
    "region": "地區",
    "artLabels": {
      "scene": "第五章夜間活動臺場景",
      "portrait": "活動臺角色立繪，僅在通聯結束後展示",
      "illustration": "空中燈火活動插畫"
    },
    "beats": [
      [
        "桌上多了一張活動單",
        "NOVA 把一張活動單放在日誌旁。SIM5LT 印在最上面，下面留著幾行值班安排。",
        "你把紙拿近了一點。先去追呼這個活動臺，交換完報告，再接下一班。"
      ],
      [
        "多留幾行空白",
        "你翻到一張空白通聯頁，把椅子往電鍵前挪了挪。呼號、報告和地區，各有地方記。",
        "同時有人叫進來也不用一起回。先選一個聽清的，做完這一條，再聽下一次呼叫。"
      ],
      [
        "先用自己的呼號",
        "{player} 寫在頁首。接班之前，你還是用這個呼號呼叫 SIM5LT。",
        "等交換結束，活動臺才交到你手裡。那時發出的呼號就是 SIM5LT，別順手把自己的呼號帶進去。"
      ],
      [
        "鬆開電鍵",
        "這局活動已經結算：{count} 次通聯，{regions} 個地區，評級是{grade}。",
        "你鬆開電鍵，活動了一下手腕。剛才顧著接呼叫，筆滾到了日誌下面，現在才騰出手把它找出來。"
      ],
      [
        "把這一班記好",
        "你依時間核對這些呼號，把雙方的報告和地區再看一遍。地圖上亮起哪些位置，就以這些紀錄為準。",
        "日誌合上時，紙角還露在外面。你把它理平，給下一班留好桌面。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Five",
    "title": "Lights Across the Air",
    "entry": "Chapter Five · Lights Across the Air",
    "enter": "Enter the event · Call SIM5LT first",
    "finish": "Finish Chapter Five · Claim reward",
    "continueStory": "Continue Chapter Five",
    "complete": "Chapter Five is complete. Chapter Six is available.",
    "unavailable": "Accept Chapter Five at the mission center. Older completed tasks with incomplete verification records can still claim their reward there.",
    "hint": "Call SIM5LT with your own callsign, then take over the event station. In eight minutes, complete at least 3 valid contacts across 2 regions and resolve at least 1 pile-up for Base grade or higher. Settle the event before returning to the story.",
    "resumeHint": "Story bookmarks and settled records are saved. An unsettled event restarts after leaving or reloading. Story mode is available outside the annual event date; practice and annual results do not complete this chapter.",
    "summary": "Verified: {count} contacts · {regions} regions",
    "recorded": "These saved logs belong to one settled story event. Callsigns, reports and regions come from those records.",
    "reward": "Event grade rewards are handled at settlement. This page claims the Chapter Five mission reward once; it does not settle the contacts again.",
    "grade": "Grade",
    "score": "Score",
    "region": "Region",
    "artLabels": {
      "scene": "Chapter Five event station at night",
      "portrait": "Event station character portrait, shown only after the contact session",
      "illustration": "Lights Across the Air event illustration"
    },
    "beats": [
      [
        "An event sheet on the desk",
        "NOVA puts an event sheet beside the log. SIM5LT is printed at the top, with a few lines of duty assignments below.",
        "You bring the page closer. First call the event station and exchange reports. Then take the next shift."
      ],
      [
        "Leave a few lines blank",
        "You open a blank log page and pull the chair toward the key. There is room for callsigns, reports and regions.",
        "You do not have to answer everyone at once. Pick one caller you can identify, finish that contact, then listen for the next call."
      ],
      [
        "Your own callsign first",
        "{player} is at the top of the page. Until the handover, that is the callsign you use to call SIM5LT.",
        "Once the exchange is complete, you take the event station. You will be sending as SIM5LT then. Try not to slip back into your own callsign."
      ],
      [
        "Hands off the key",
        "The event is settled: {count} contacts, {regions} regions and a {grade} grade.",
        "You let go of the key and stretch your wrist. The pen rolled beneath the log while you were taking calls. Now you have a moment to find it."
      ],
      [
        "Record this shift",
        "You check the callsigns in time order, then read both reports and each region again. The saved entries determine which places light up on the map.",
        "A corner of paper sticks out as you close the log. You straighten it and leave the desk ready for the next shift."
      ]
    ]
  },
  "ja": {
    "chapter": "第5章",
    "title": "空をつなぐ灯",
    "entry": "第5章 · 空をつなぐ灯",
    "enter": "イベントへ · まず SIM5LT を呼ぶ",
    "finish": "第5章を完了 · 報酬を受け取る",
    "continueStory": "第5章を続ける",
    "complete": "第5章は完了しました。第6章に進めます。",
    "unavailable": "ミッションセンターで第5章を受注してください。確認記録が足りない旧セーブの達成済み任務も、そこで報酬を受け取れます。",
    "hint": "自分の呼出符号で SIM5LT を呼び、交換後に記念局を引き継ぎます。8分以内に有効な交信3件以上、地域2か所以上、パイルアップ処理1回以上で基礎評価に達します。精算してから物語に戻ってください。",
    "resumeHint": "物語のしおりと精算済みの記録は保存されます。未精算のイベントは退出・再読み込みでやり直しです。本編は年次開催日以外も参加でき、練習・年次の成績は本章に数えません。",
    "summary": "確認済み：交信 {count} 件 · {regions} 地域",
    "recorded": "同じ精算済み本編イベントのログです。呼出符号、レポート、地域は保存記録に基づきます。",
    "reward": "イベント評価の報酬は精算時に処理します。ここでは第5章の任務報酬を一度だけ受け取り、交信は再精算しません。",
    "grade": "評価",
    "score": "得点",
    "region": "地域",
    "artLabels": {
      "scene": "第5章の夜の記念局",
      "portrait": "交信終了後に表示する記念局の人物立ち絵",
      "illustration": "空をつなぐ灯のイベント挿絵"
    },
    "beats": [
      [
        "机に一枚の案内",
        "NOVA がログの横にイベントの案内を置く。一番上に SIM5LT、その下に当番の予定が並んでいる。",
        "紙を手元へ寄せる。まず記念局を呼び、レポートを交換してから次の当番を引き継ごう。"
      ],
      [
        "空白の行を用意する",
        "新しいログのページを開き、椅子を電鍵へ寄せる。呼出符号もレポートも地域も書く場所がある。",
        "一斉に呼ばれても、全員に同時に返さなくていい。聞き取れた一局を選び、終えてから次を聞こう。"
      ],
      [
        "最初は自分の呼出符号",
        "ページの上には {player}。引き継ぐまでは、この呼出符号で SIM5LT を呼ぶ。",
        "交換が終わったら記念局の当番だ。それから送る呼出符号は SIM5LT。つい自分のものを送らないように。"
      ],
      [
        "電鍵から手を離す",
        "イベントを精算した。交信 {count} 件、{regions} 地域、評価は{grade}。",
        "電鍵から手を離し、手首を伸ばす。呼び出しを受けている間にペンがログの下へ転がっていた。今なら探す余裕がある。"
      ],
      [
        "この当番を記録する",
        "時刻順に呼出符号を確かめ、双方のレポートと地域を読み直す。地図の灯りも、この保存記録に合わせる。",
        "ログを閉じると紙の角が少し出ている。端をそろえ、次の当番のために机を空けておく。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo cinco",
    "title": "Luces en el aire",
    "entry": "Capítulo cinco · Luces en el aire",
    "enter": "Entrar al evento · Llamar primero a SIM5LT",
    "finish": "Terminar el capítulo cinco · Cobrar recompensa",
    "continueStory": "Continuar el capítulo cinco",
    "complete": "El capítulo cinco está completo. El capítulo seis está disponible.",
    "unavailable": "Acepta el capítulo cinco en el centro de misiones. Las tareas antiguas completadas sin registros suficientes aún pueden cobrar allí.",
    "hint": "Llama a SIM5LT con tu indicativo y luego toma la estación. En ocho minutos, completa al menos 3 contactos válidos en 2 regiones y resuelve 1 pile-up para obtener el nivel Base. Liquida el evento antes de volver a la historia.",
    "resumeHint": "Se guardan los marcadores narrativos y registros liquidados. Una sesión sin liquidar se reinicia al salir o recargar. La historia no exige la fecha anual; los resultados anuales y de práctica no completan este capítulo.",
    "summary": "Verificados: {count} contactos · {regions} regiones",
    "recorded": "Estos registros pertenecen a un mismo evento narrativo liquidado. Los indicativos, informes y regiones proceden de los datos guardados.",
    "reward": "Los premios de nivel se procesan al liquidar el evento. Aquí solo se cobra una vez la recompensa de la misión cinco, sin volver a liquidar contactos.",
    "grade": "Nivel",
    "score": "Puntuación",
    "region": "Región",
    "artLabels": {
      "scene": "Estación nocturna del capítulo cinco",
      "portrait": "Retrato de la estación, solo después de terminar los contactos",
      "illustration": "Ilustración del evento Luces en el aire"
    },
    "beats": [
      [
        "Una hoja sobre la mesa",
        "NOVA deja una hoja del evento junto al registro. Arriba pone SIM5LT; debajo hay unas líneas con los turnos.",
        "Acercas el papel. Primero llamarás a la estación e intercambiarás informes. Después tomarás el siguiente turno."
      ],
      [
        "Deja unas líneas libres",
        "Abres una página nueva y acercas la silla a la llave. Hay espacio para indicativos, informes y regiones.",
        "No tienes que responder a todos a la vez. Elige una llamada que entiendas, termina ese contacto y escucha la siguiente."
      ],
      [
        "Primero, tu indicativo",
        "{player} encabeza la página. Hasta el relevo, llamarás a SIM5LT con ese indicativo.",
        "Al terminar el intercambio, te toca la estación del evento. Entonces transmitirás como SIM5LT. Procura no volver por costumbre a tu propio indicativo."
      ],
      [
        "Suelta la llave",
        "Evento liquidado: {count} contactos, {regions} regiones y nivel {grade}.",
        "Sueltas la llave y estiras la muñeca. El bolígrafo rodó bajo el registro mientras atendías llamadas. Ahora puedes buscarlo."
      ],
      [
        "Anota este turno",
        "Compruebas los indicativos por orden de hora y repasas ambos informes y cada región. Las entradas guardadas determinan las luces del mapa.",
        "Al cerrar el registro sobresale una esquina de papel. La colocas bien y dejas la mesa lista para el próximo turno."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel fünf",
    "title": "Lichter über Funk",
    "entry": "Kapitel fünf · Lichter über Funk",
    "enter": "Zum Event · Zuerst SIM5LT rufen",
    "finish": "Kapitel fünf abschließen · Belohnung abholen",
    "continueStory": "Kapitel fünf fortsetzen",
    "complete": "Kapitel fünf ist abgeschlossen. Kapitel sechs ist verfügbar.",
    "unavailable": "Nimm Kapitel fünf im Missionszentrum an. Alte erfüllte Aufgaben mit unvollständigen Nachweisen können ihre Belohnung weiterhin dort abholen.",
    "hint": "Rufe SIM5LT mit deinem Rufzeichen und übernimm danach die Station. Erreiche in acht Minuten mindestens 3 gültige Kontakte in 2 Regionen und löse 1 Pile-up für die Basisstufe. Rechne den Event ab, bevor du zur Geschichte zurückkehrst.",
    "resumeHint": "Lesezeichen und abgerechnete Einträge werden gespeichert. Eine nicht abgerechnete Runde beginnt nach Verlassen oder Neuladen von vorn. Die Story ist nicht an den Jahrestermin gebunden; Übungs- und Jahresergebnisse zählen hier nicht.",
    "summary": "Geprüft: {count} Kontakte · {regions} Regionen",
    "recorded": "Diese gespeicherten Einträge gehören zu einer abgerechneten Story-Runde. Rufzeichen, Rapporte und Regionen stammen aus dem Log.",
    "reward": "Stufenprämien werden bei der Event-Abrechnung verarbeitet. Hier holst du einmal die Missionsbelohnung für Kapitel fünf ab; Kontakte werden nicht erneut abgerechnet.",
    "grade": "Stufe",
    "score": "Punkte",
    "region": "Region",
    "artLabels": {
      "scene": "Nächtliche Sonderstation in Kapitel fünf",
      "portrait": "Porträt der Sonderstation, erst nach der Funkrunde sichtbar",
      "illustration": "Illustration zum Event Lichter über Funk"
    },
    "beats": [
      [
        "Ein Blatt auf dem Tisch",
        "NOVA legt ein Veranstaltungsblatt neben das Log. Oben steht SIM5LT, darunter ein paar Zeilen mit den Schichten.",
        "Du ziehst das Blatt näher. Erst die Sonderstation rufen und Rapporte austauschen, dann die nächste Schicht übernehmen."
      ],
      [
        "Ein paar Zeilen freilassen",
        "Du schlägst eine leere Logseite auf und rückst den Stuhl an die Taste. Rufzeichen, Rapporte und Regionen haben ihren Platz.",
        "Du musst nicht allen gleichzeitig antworten. Wähle einen verständlichen Anrufer, schließe den Kontakt ab und höre dann auf den nächsten Ruf."
      ],
      [
        "Zuerst dein eigenes Rufzeichen",
        "Oben steht {player}. Bis zur Übergabe rufst du SIM5LT mit diesem Rufzeichen.",
        "Nach dem Austausch übernimmst du die Sonderstation. Dann sendest du als SIM5LT. Nicht aus Gewohnheit wieder das eigene Rufzeichen nehmen."
      ],
      [
        "Die Taste loslassen",
        "Die Runde ist abgerechnet: {count} Kontakte, {regions} Regionen, Stufe {grade}.",
        "Du lässt die Taste los und streckst das Handgelenk. Während der Anrufe ist der Stift unter das Log gerollt. Jetzt kannst du ihn suchen."
      ],
      [
        "Die Schicht festhalten",
        "Du prüfst die Rufzeichen der Reihe nach und liest beide Rapporte und jede Region noch einmal. Die gespeicherten Einträge bestimmen die Lichter auf der Karte.",
        "Beim Schließen steht eine Papierecke hervor. Du richtest sie aus und lässt den Tisch für die nächste Schicht frei."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава пятая",
    "title": "Огни в эфире",
    "entry": "Глава пятая · Огни в эфире",
    "enter": "На событие · Сначала вызвать SIM5LT",
    "finish": "Завершить пятую главу · Получить награду",
    "continueStory": "Продолжить пятую главу",
    "complete": "Пятая глава завершена. Доступна шестая.",
    "unavailable": "Примите пятую главу в центре заданий. Старые выполненные задания с неполными подтверждающими записями по-прежнему можно сдать там.",
    "hint": "Вызовите SIM5LT своим позывным, затем примите станцию. За восемь минут проведите минимум 3 действительные связи с 2 регионами и разберите 1 pile-up для базовой оценки. Сначала сохраните итоги события, затем вернитесь к сюжету.",
    "resumeHint": "Закладки сюжета и рассчитанные записи сохраняются. Незавершённый расчётом сеанс после выхода или перезагрузки начинается заново. Сюжет доступен вне ежегодной даты; тренировки и ежегодные результаты не завершают эту главу.",
    "summary": "Подтверждено: {count} связей · {regions} регионов",
    "recorded": "Эти записи относятся к одному рассчитанному сюжетному событию. Позывные, рапорты и регионы взяты из сохранённого журнала.",
    "reward": "Награды за оценку обрабатываются при расчёте события. Здесь один раз выдаётся награда задания пятой главы, без повторного расчёта связей.",
    "grade": "Оценка",
    "score": "Счёт",
    "region": "Регион",
    "artLabels": {
      "scene": "Ночная спецстанция пятой главы",
      "portrait": "Портрет персонажа станции, только после окончания связей",
      "illustration": "Иллюстрация события Огни в эфире"
    },
    "beats": [
      [
        "Листок на столе",
        "NOVA кладёт рядом с журналом листок события. Сверху написано SIM5LT, ниже — несколько строк с дежурствами.",
        "Ты придвигаешь листок. Сначала вызвать спецстанцию и обменяться рапортами, потом принять смену."
      ],
      [
        "Оставить несколько пустых строк",
        "Ты открываешь чистую страницу журнала и придвигаешь стул к ключу. Для позывных, рапортов и регионов есть место.",
        "Не надо отвечать всем сразу. Выбери того, чей вызов разобрал, закончи связь и слушай следующую."
      ],
      [
        "Сначала свой позывной",
        "Вверху страницы стоит {player}. До передачи смены ты вызываешь SIM5LT этим позывным.",
        "После обмена станция переходит к тебе. Тогда в эфире будет SIM5LT. Постарайся по привычке не передать свой позывной."
      ],
      [
        "Отпустить ключ",
        "Итоги события сохранены: {count} связей, {regions} регионов, оценка — {grade}.",
        "Ты отпускаешь ключ и разминаешь запястье. Пока принимал вызовы, ручка закатилась под журнал. Теперь можно её достать."
      ],
      [
        "Записать эту смену",
        "Ты проверяешь позывные по времени, перечитываешь оба рапорта и каждый регион. Огни на карте определяются сохранёнными записями.",
        "Когда закрываешь журнал, наружу торчит уголок бумаги. Ты поправляешь его и освобождаешь стол для следующей смены."
      ]
    ]
  }
};
const IDS = ["notice", "desk", "call", "answer", "log"];
const ASSETS = ["scene", "scene", "illustration", "portrait", "scene"];
export const CHAPTER_FIVE_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterFiveStoryText(language) {
  const t = COPY[language] ?? COPY.en, event = lightsText(language);
  return { ...chapterTwoStoryText(language), ...t, grades: { base: event.gradeBase, silver: event.gradeSilver, gold: event.gradeGold },
    beats: t.beats.map(([title, ...paragraphs], index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })),
  };
}

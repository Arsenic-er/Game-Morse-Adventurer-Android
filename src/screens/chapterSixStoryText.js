import { chapterTwoStoryText } from "./chapterTwoStoryText.js";
import { EXPEDITION_TEXT } from "./expeditionText.js";
const COPY = {
  "zh-CN": {
    "chapter": "第六章",
    "entry": "第六章 · 山丘临时台",
    "enter": "出发 · 架设野外电台",
    "finish": "完成第六章 · 领取任务奖励",
    "continueStory": "继续第六章",
    "complete": "第六章已完成。回到“人物与 QSL”确认卡片选择后，再接第七章。",
    "unavailable": "请从任务中心接受第六章。旧任务若已达标但演出核验资料不完整，仍可在任务中心领取。",
    "hint": "选择一处虚构山丘，架好天线并接上电池。按现场提示发送 QTH、PWR、ANT；弱信号时用 AGN 或 QRS 恢复。完成后先收台结算，再回来读结尾。",
    "resumeHint": "剧情书签和野外活动进度都会保存。离开或刷新后可继续当前活动；设置菜单及窗口失焦时暂停耗时和耗电。当前流程使用借用套件。",
    "recorded": "这条日志已与本局远征摘要、结算凭据和通联结算记录核对。场地是虚构的。",
    "reward": "通联与远征奖励已在收台时结算；这里仅领取一次第六章的 650 资金与 3 科技点。",
    "qsl": "本章不会替你确认 QSL 分歧。第七章还需要你在“人物与 QSL”里做出选择。",
    "site": "场地",
    "fictional": "虚构场地",
    "artLabels": {
      "scene": "第六章山丘野外电台场景",
      "portrait": "完成通联后的角色立绘",
      "illustration": "山丘临时电台插画"
    },
    "beats": [
      [
        "先把包扣好",
        "SORA 把借用套件放在门边。你提了一下，电池比看上去沉，背带得再收紧一点。",
        "日志和铅笔塞进外袋，伸手就能拿到。今天把电台搬出去用。"
      ],
      [
        "别把线扯成死结",
        "天线线材在包里绕成了一团。你找出线头，一圈一圈松开，接头先放在旁边。",
        "到了场地再把天线架好，最后接电池。手上忙的时候，日志可以先压在包下面。"
      ],
      [
        "照着这次的配置发",
        "{player} 写在日志页头。先选场地，再检查架台和供电状态，不急着呼叫。",
        "对方需要 QTH、PWR 和 ANT。照当前活动给出的内容交换，接不上就请求重发；电池和时间都在界面上。"
      ],
      [
        "这条记在山丘那一页",
        "你在{site}完成的 {peer} 通联已经结算。呼号和双方报告都存进了日志。",
        "风把纸角掀起来，你用手掌压住，再看一遍刚才写下的那一行。现在可以收线了。"
      ],
      [
        "把接头收进袋里",
        "你把线绕回去，接头单独收好，免得下一次又从一团线里找。日志放在最外层。",
        "QSL 留着回去再核对。先把这一页收好，背包拉链别夹住纸角。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第六章",
    "entry": "第六章 · 山丘臨時臺",
    "enter": "出發 · 架設野外電臺",
    "finish": "完成第六章 · 領取任務獎勵",
    "continueStory": "繼續第六章",
    "complete": "第六章已完成。回到「人物與 QSL」確認卡片選擇後，再接第七章。",
    "unavailable": "請從任務中心接受第六章。舊任務若已達標但演出核驗資料不完整，仍可在任務中心領取。",
    "hint": "選擇一處虛構山丘，架好天線並接上電池。依現場提示發送 QTH、PWR、ANT；弱訊號時用 AGN 或 QRS 恢復。完成後先收臺結算，再回來讀結尾。",
    "resumeHint": "劇情書籤和野外活動進度都會保存。離開或重新整理後可繼續目前活動；設定選單及視窗失焦時暫停耗時和耗電。目前流程使用借用套件。",
    "recorded": "這條日誌已與本局遠征摘要、結算憑據及通聯結算記錄核對。場地是虛構的。",
    "reward": "通聯與遠征獎勵已在收臺時結算；這裡僅領取一次第六章的 650 資金與 3 科技點。",
    "qsl": "本章不會替你確認 QSL 分歧。第七章還需要你在「人物與 QSL」裡做出選擇。",
    "site": "場地",
    "fictional": "虛構場地",
    "artLabels": {
      "scene": "第六章山丘野外電臺場景",
      "portrait": "完成通聯後的角色立繪",
      "illustration": "山丘臨時電臺插畫"
    },
    "beats": [
      [
        "先把包扣好",
        "SORA 把借用套件放在門邊。你提了一下，電池比看上去沉，背帶得再收緊一點。",
        "日誌和鉛筆塞進外袋，伸手就能拿到。今天把電臺搬出去用。"
      ],
      [
        "別把線扯成死結",
        "天線線材在包裡繞成了一團。你找出線頭，一圈一圈鬆開，接頭先放在旁邊。",
        "到了場地再把天線架好，最後接電池。手上忙的時候，日誌可以先壓在包下面。"
      ],
      [
        "照著這次的配置發",
        "{player} 寫在日誌頁頭。先選場地，再檢查架臺和供電狀態，不急著呼叫。",
        "對方需要 QTH、PWR 和 ANT。照目前活動給出的內容交換，接不上就請求重發；電池和時間都在介面上。"
      ],
      [
        "這條記在山丘那一頁",
        "你在{site}完成的 {peer} 通聯已經結算。呼號和雙方報告都存進了日誌。",
        "風把紙角掀起來，你用手掌壓住，再看一遍剛才寫下的那一行。現在可以收線了。"
      ],
      [
        "把接頭收進袋裡",
        "你把線繞回去，接頭單獨收好，免得下一次又從一團線裡找。日誌放在最外層。",
        "QSL 留著回去再核對。先把這一頁收好，背包拉鍊別夾住紙角。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Six",
    "entry": "Chapter Six · Hilltop Field Station",
    "enter": "Set out · Build the field station",
    "finish": "Finish Chapter Six · Claim reward",
    "continueStory": "Continue Chapter Six",
    "complete": "Chapter Six is complete. Confirm your card choice in People & QSL before starting Chapter Seven.",
    "unavailable": "Accept Chapter Six in the Mission Center. Older ready missions with incomplete presentation evidence can still be claimed there.",
    "hint": "Choose a fictional hill, raise the antenna and connect the battery. Send the current QTH, PWR and ANT shown by the activity. Use AGN or QRS for a weak link. Close and settle the station before returning to the story.",
    "resumeHint": "Both the story bookmark and field run are saved. You can resume after leaving or reloading. Settings and an unfocused window pause time and battery use. This flow uses the loan kit.",
    "recorded": "This log matches the run summary, settlement proof and settled contact record. The field site is fictional.",
    "reward": "Contact and expedition rewards were settled when the station closed. This chapter pays 650 funds and 3 technology points once.",
    "qsl": "This chapter does not choose a side in the QSL discrepancy. Make your choice in People & QSL to unlock Chapter Seven.",
    "site": "Field site",
    "fictional": "Fictional site",
    "artLabels": {
      "scene": "Chapter Six hilltop field station",
      "portrait": "Character portrait after the contact",
      "illustration": "Portable hilltop station illustration"
    },
    "beats": [
      [
        "Fasten the bag first",
        "SORA leaves the loan kit by the door. You lift it once. The battery is heavier than it looks; the shoulder strap needs tightening.",
        "The log and pencil go in the outer pocket, within reach. Today the station is going outside."
      ],
      [
        "Keep the wire out of knots",
        "The antenna wire has tangled in the bag. You find one end and ease out each loop, setting the connector aside.",
        "Raise the antenna once you reach the site, then connect the battery. The log can stay under the bag while your hands are busy."
      ],
      [
        "Send this setup's details",
        "{player} is at the top of the page. Choose a site and check the antenna and power before calling.",
        "The exchange needs QTH, PWR and ANT. Use the details shown for this run and request a repeat if needed. Keep an eye on the battery and time."
      ],
      [
        "The hilltop page",
        "Your contact with {peer} at {site} has been settled. The callsign and both reports are in the log.",
        "Wind lifts a corner of the paper. You hold it down with your palm and check the line again. Now you can pack the wire."
      ],
      [
        "Put the connector in its pocket",
        "You coil the wire and store the connector separately, so it won't disappear into the next tangle. The log goes on top.",
        "The QSL can wait until you're back. Keep this page safe, and don't catch its corner in the zipper."
      ]
    ]
  },
  "ja": {
    "chapter": "第六章",
    "entry": "第六章 · 丘の移動運用",
    "enter": "出発 · 野外局を設営",
    "finish": "第六章を終える · 報酬を受け取る",
    "continueStory": "第六章の続きを読む",
    "complete": "第六章は完了です。「人物と QSL」でカードの選択を確定すると、第七章を受けられます。",
    "unavailable": "任務センターで第六章を受けてください。旧セーブで達成済みでも演出の確認資料が足りない場合は、任務センターで報酬を受け取れます。",
    "hint": "架空の丘を選び、アンテナを設営してバッテリーを接続します。画面にある QTH・PWR・ANT を交換し、弱い回線は AGN または QRS で回復してください。撤収・精算の後で物語に戻ります。",
    "resumeHint": "物語のしおりと運用の進行は保存されます。退出や再読み込み後も続行できます。設定中とウィンドウが非アクティブな間は時間と電池の消費が止まります。今回は貸出セットを使います。",
    "recorded": "このログは運用概要、精算証明、交信精算記録と照合済みです。運用地は架空です。",
    "reward": "交信と遠征の報酬は撤収時に精算済みです。ここでは第六章の資金 650 と技術ポイント 3 を一度だけ受け取ります。",
    "qsl": "QSL の食い違いについて勝手に選択はしません。第七章には「人物と QSL」での確認が必要です。",
    "site": "運用地",
    "fictional": "架空の運用地",
    "artLabels": {
      "scene": "第六章の丘の野外局",
      "portrait": "交信終了後の人物立ち絵",
      "illustration": "丘の移動局の挿絵"
    },
    "beats": [
      [
        "まずバッグを締める",
        "SORA が貸出セットを玄関に置いた。持ち上げてみると、電池は見た目より重い。肩ひもを少し詰める。",
        "ログと鉛筆は、すぐ手の届く外ポケットへ。今日は無線機を外へ持ち出す。"
      ],
      [
        "線を結ばないように",
        "バッグの中でアンテナ線が絡まっている。端を見つけ、一巻きずつほどいて、コネクターを脇へ置く。",
        "現地でアンテナを立ててから、電池をつなぐ。両手がふさがる間は、ログをバッグの下に挟んでおこう。"
      ],
      [
        "今回の構成を送る",
        "ページの上に {player} と書いた。まず場所を選び、アンテナと電源を確かめる。呼び出しはその後だ。",
        "交換するのは QTH、PWR、ANT。今回の画面にある内容を使い、つながらなければ再送を頼む。電池と時間も見ておこう。"
      ],
      [
        "丘のページに記す",
        "{site} での {peer} との交信は精算された。呼出符号も双方のレポートも、ログに残っている。",
        "風で紙の隅がめくれた。手のひらで押さえ、さっきの一行を読み返す。そろそろ線を片づけよう。"
      ],
      [
        "コネクターは別の袋へ",
        "線を巻き戻し、コネクターを別にしまう。次も線の塊から探すのは避けたい。ログは一番上に置く。",
        "QSL は帰ってから確認しよう。まずこのページをしまって、ファスナーに紙を挟まないようにする。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo seis",
    "entry": "Capítulo seis · Estación en la colina",
    "enter": "Salir · Montar la estación",
    "finish": "Terminar el capítulo seis · Cobrar",
    "continueStory": "Continuar el capítulo seis",
    "complete": "Capítulo seis completado. Confirma tu elección en Personas y QSL antes de aceptar el capítulo siete.",
    "unavailable": "Acepta el capítulo seis en el Centro de Misiones. Las misiones antiguas ya cumplidas con pruebas de escena incompletas se pueden cobrar allí.",
    "hint": "Elige una colina ficticia, monta la antena y conecta la batería. Envía los QTH, PWR y ANT indicados. Usa AGN o QRS si el enlace es débil. Cierra y liquida la estación antes de volver al relato.",
    "resumeHint": "Se guardan el marcador y la expedición activa. Puedes continuar tras salir o recargar. Los ajustes y una ventana sin foco pausan el tiempo y el consumo. Se usa el equipo prestado.",
    "recorded": "El registro coincide con el resumen de expedición, el comprobante y el contacto liquidado. El lugar es ficticio.",
    "reward": "El contacto y la expedición ya se liquidaron al cerrar. El capítulo concede 650 fondos y 3 puntos tecnológicos una sola vez.",
    "qsl": "Este capítulo no decide por ti la discrepancia QSL. Elige en Personas y QSL para desbloquear el capítulo siete.",
    "site": "Lugar",
    "fictional": "Lugar ficticio",
    "artLabels": {
      "scene": "Estación de campo del capítulo seis",
      "portrait": "Retrato tras el contacto",
      "illustration": "Ilustración de la estación portátil"
    },
    "beats": [
      [
        "Cierra primero la mochila",
        "SORA deja el equipo prestado junto a la puerta. Lo levantas: la batería pesa más de lo que parece. Aprietas la correa.",
        "El cuaderno y el lápiz van al bolsillo exterior, a mano. Hoy sacas la estación de casa."
      ],
      [
        "Sin nudos en el cable",
        "El cable de antena se ha enredado dentro. Encuentras un extremo y sueltas cada vuelta, dejando el conector aparte.",
        "Monta la antena al llegar y después conecta la batería. El cuaderno puede quedar bajo la mochila mientras tienes las manos ocupadas."
      ],
      [
        "Envía los datos de este montaje",
        "{player} encabeza la página. Elige el lugar y comprueba antena y alimentación antes de llamar.",
        "El intercambio necesita QTH, PWR y ANT. Usa lo indicado en esta expedición y pide repetición si hace falta. Vigila batería y tiempo."
      ],
      [
        "La página de la colina",
        "Tu contacto con {peer} desde {site} ya se ha liquidado. El indicativo y ambos informes están guardados.",
        "El viento levanta una esquina del papel. La sujetas con la palma y revisas la línea. Ya puedes recoger el cable."
      ],
      [
        "El conector, en su bolsillo",
        "Enrollas el cable y guardas el conector aparte para no buscarlo entre los nudos la próxima vez. El cuaderno queda encima.",
        "La QSL puede esperar a la vuelta. Guarda esta página sin atrapar una esquina con la cremallera."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel sechs",
    "entry": "Kapitel sechs · Feldstation auf dem Hügel",
    "enter": "Aufbrechen · Feldstation aufbauen",
    "finish": "Kapitel sechs abschließen · Belohnung",
    "continueStory": "Kapitel sechs fortsetzen",
    "complete": "Kapitel sechs ist abgeschlossen. Bestätige deine Kartenwahl unter Personen & QSL, bevor du Kapitel sieben annimmst.",
    "unavailable": "Nimm Kapitel sechs in der Missionszentrale an. Alte erfüllte Missionen mit unvollständigen Szenenbelegen können dort weiterhin abgeholt werden.",
    "hint": "Wähle einen fiktiven Hügel, baue die Antenne auf und schließe die Batterie an. Sende die angezeigten QTH-, PWR- und ANT-Angaben. Bei schwacher Verbindung helfen AGN oder QRS. Rechne die Station ab, bevor du zur Geschichte zurückkehrst.",
    "resumeHint": "Lesemarke und laufende Expedition werden gespeichert und lassen sich nach Verlassen oder Neuladen fortsetzen. Einstellungen und Fenster ohne Fokus pausieren Zeit und Verbrauch. Verwendet wird der Leihsatz.",
    "recorded": "Dieser Logeintrag stimmt mit Expeditionsübersicht, Abrechnungsbeleg und abgerechnetem Kontakt überein. Der Standort ist fiktiv.",
    "reward": "Kontakt und Expedition wurden beim Abbau abgerechnet. Das Kapitel vergibt einmalig 650 Geld und 3 Technologiepunkte.",
    "qsl": "Dieses Kapitel trifft keine QSL-Entscheidung für dich. Wähle unter Personen & QSL, um Kapitel sieben freizuschalten.",
    "site": "Standort",
    "fictional": "Fiktiver Standort",
    "artLabels": {
      "scene": "Feldstation in Kapitel sechs",
      "portrait": "Figur nach dem Kontakt",
      "illustration": "Illustration der tragbaren Station"
    },
    "beats": [
      [
        "Erst den Rucksack schließen",
        "SORA stellt den Leihsatz an die Tür. Du hebst ihn an. Die Batterie ist schwerer als gedacht; der Schulterriemen muss enger sitzen.",
        "Logbuch und Bleistift kommen griffbereit in die Außentasche. Heute geht die Station mit nach draußen."
      ],
      [
        "Keine festen Knoten",
        "Der Antennendraht hat sich im Rucksack verheddert. Du suchst ein Ende, löst die Schlaufen und legst den Stecker beiseite.",
        "Am Standort kommt zuerst die Antenne dran, dann die Batterie. Solange beide Hände beschäftigt sind, liegt das Logbuch unter dem Rucksack."
      ],
      [
        "Die Angaben dieses Aufbaus",
        "Oben auf der Seite steht {player}. Wähle den Standort und prüfe Antenne und Stromversorgung, bevor du rufst.",
        "Benötigt werden QTH, PWR und ANT. Nutze die Angaben dieser Expedition und bitte bei Bedarf um Wiederholung. Behalte Batterie und Zeit im Blick."
      ],
      [
        "Die Seite vom Hügel",
        "Dein Kontakt mit {peer} von {site} ist abgerechnet. Rufzeichen und beide Rapporte stehen im gespeicherten Log.",
        "Der Wind hebt eine Papierecke. Du drückst sie mit der Handfläche nieder und liest die Zeile noch einmal. Jetzt kannst du den Draht einholen."
      ],
      [
        "Der Stecker bekommt ein Fach",
        "Du wickelst den Draht auf und verstaust den Stecker getrennt, damit er beim nächsten Mal nicht im Knäuel verschwindet. Das Logbuch kommt nach oben.",
        "Die QSL kann bis zur Rückkehr warten. Pack diese Seite ein, ohne die Ecke im Reißverschluss einzuklemmen."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава шестая",
    "entry": "Глава шестая · Станция на холме",
    "enter": "В путь · Развернуть станцию",
    "finish": "Завершить главу шесть · Награда",
    "continueStory": "Продолжить главу шесть",
    "complete": "Глава шестая завершена. Подтверди выбор карточки в разделе «Люди и QSL», прежде чем принять главу семь.",
    "unavailable": "Прими главу шесть в центре заданий. Награду за старое выполненное задание с неполными данными для сцены можно получить там же.",
    "hint": "Выбери вымышленный холм, установи антенну и подключи батарею. Передай указанные QTH, PWR и ANT. Для слабой связи используй AGN или QRS. Заверши расчёт за выезд, затем вернись к истории.",
    "resumeHint": "Закладка и текущий выезд сохраняются. После выхода или перезагрузки можно продолжить. Настройки и неактивное окно приостанавливают время и расход батареи. Используется комплект напрокат.",
    "recorded": "Запись сверена с итогом выезда, подтверждением расчёта и записью оплаченного QSO. Площадка вымышленная.",
    "reward": "Награды за QSO и выезд уже начислены при закрытии станции. Глава даёт 650 средств и 3 очка технологий один раз.",
    "qsl": "Глава не выбирает за тебя сторону в расхождении QSL. Для главы семь сделай выбор в разделе «Люди и QSL».",
    "site": "Площадка",
    "fictional": "Вымышленная площадка",
    "artLabels": {
      "scene": "Полевая станция шестой главы",
      "portrait": "Персонаж после завершения связи",
      "illustration": "Иллюстрация переносной станции"
    },
    "beats": [
      [
        "Сначала застегни рюкзак",
        "SORA ставит комплект у двери. Ты приподнимаешь его: батарея тяжелее, чем кажется. Надо подтянуть лямку.",
        "Журнал и карандаш отправляются во внешний карман, поближе к руке. Сегодня станция выйдет из дома."
      ],
      [
        "Не затягивай узлы",
        "Антенный провод спутался в рюкзаке. Ты находишь конец, распускаешь петли одну за другой и откладываешь разъём.",
        "На площадке сначала поставишь антенну, потом подключишь батарею. Пока руки заняты, журнал можно прижать рюкзаком."
      ],
      [
        "Данные этой установки",
        "Вверху страницы — {player}. Выбери площадку и проверь антенну с питанием, прежде чем вызывать.",
        "Для обмена нужны QTH, PWR и ANT. Передавай данные текущего выезда, при необходимости проси повтор. Следи за батареей и временем."
      ],
      [
        "Страница с холма",
        "Твоя связь с {peer} с площадки {site} уже учтена. Позывной и оба рапорта сохранены в журнале.",
        "Ветер поднимает уголок бумаги. Ты прижимаешь его ладонью и ещё раз читаешь строку. Теперь можно убирать провод."
      ],
      [
        "Разъём — в отдельный карман",
        "Ты сматываешь провод и убираешь разъём отдельно, чтобы в следующий раз не искать его в клубке. Журнал кладёшь сверху.",
        "QSL проверишь после возвращения. Пока убери эту страницу и не защеми уголок молнией."
      ]
    ]
  }
};
const IDS = ["pack","wire","call","answer","log"], ASSETS = ["scene","scene","illustration","portrait","scene"];
export const CHAPTER_SIX_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterSixStoryText(language) {
  const t = COPY[language] ?? COPY.en, field = EXPEDITION_TEXT[language] ?? EXPEDITION_TEXT.en;
  return { ...chapterTwoStoryText(language), ...t, title: field.title, signal: field.propagation,
    sites: Object.fromEntries(["expeditionSiteSunward","expeditionSiteCedarBreeze","expeditionSiteLakeview"].map(key => [key, field[key]])),
    beats: t.beats.map(([title,...paragraphs], index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })) };
}

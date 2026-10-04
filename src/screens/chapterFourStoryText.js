import { chapterTwoStoryText } from "./chapterTwoStoryText.js";

const COPY = {
  "zh-CN": {
    "chapter": "第四章",
    "title": "雨幕另一边",
    "entry": "第四章 · 雨幕另一边",
    "enter": "进入电台 · 联系 SIM2DX",
    "finish": "完成第四章 · 领取任务奖励",
    "complete": "第四章已完成，第五章已开放。",
    "unavailable": "请从任务中心接受第四章。若旧任务已达标但核验记录不完整，仍可在任务中心领取奖励。",
    "hint": "与 SIM2DX 完成并保存一次 P0–P2 的天气交换。听不清可发 AGN K，太快可发 QRS K，再回答 WX 问题；SKIP K 不计完成。P3–P4 的通联仍会保存，但不计本章。",
    "recorded": "这条记录已保存、结算，并与本章任务事件核对。",
    "privacy": "天气回答正文按现有隐私规则不保存在日志中；这里只确认交换完成，不复述双方的天气。",
    "signal": "传播",
    "exchange": "天气交换",
    "answered": "已完成",
    "recovery": "恢复",
    "remoteQuery": "对方接收恢复",
    "artLabels": {
      "scene": "第四章雨夜电台场景",
      "portrait": "与 SIM2DX 关联的角色立绘，仅在结束通联后展示",
      "illustration": "雨幕中的通联章节插画"
    },
    "beats": [
      [
        "先把本子挪远一点",
        "窗缝里飘进几滴雨。你把日志往桌里挪了挪，用袖口擦掉纸边的水。",
        "SIM2DX 的呼号写在下一行。先戴好耳机，看看今晚能不能接上。"
      ],
      [
        "没听清的地方，先空着",
        "你把铅笔削过的那一面转向自己，旁边留出一小块空白。漏掉的内容就记在这里，别急着补。",
        "AGN 是再发一次，QRS 是慢一点。真要用上时，发完等对方回应就好，不必为此赶着往下走。"
      ],
      [
        "把天气问完",
        "{player} 已写在页头。你把椅子往前挪，让手腕放稳。",
        "这次找 SIM2DX，在 P0–P2 的条件下完成天气交换。用 AGN 或 QRS 把没接上的地方接回来，再把通联保存。"
      ],
      [
        "这一次，接上了",
        "{peer} 的通联已经存进日志。天气交换完成，过程中用来恢复通联的记录也在。",
        "你摘下一边耳机，才发现窗外的雨还没停。先别翻页，核对一下刚才的呼号和报告。"
      ],
      [
        "在这一行停一会儿",
        "你顺着这一行重新看了一遍：时间、呼号、双方的 RST，还有当时的传播等级。",
        "接不上的时候停下来重试，也能把一次通联做完。你合上笔帽，把这页留在最上面。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第四章",
    "title": "雨幕另一邊",
    "entry": "第四章 · 雨幕另一邊",
    "enter": "進入電臺 · 聯絡 SIM2DX",
    "finish": "完成第四章 · 領取任務獎勵",
    "complete": "第四章已完成，第五章已開放。",
    "unavailable": "請從任務中心接受第四章。若舊任務已達標但核驗紀錄不完整，仍可在任務中心領取獎勵。",
    "hint": "與 SIM2DX 完成並儲存一次 P0–P2 的天氣交換。聽不清可發 AGN K，太快可發 QRS K，再回答 WX 問題；SKIP K 不計完成。P3–P4 的通聯仍會儲存，但不計本章。",
    "recorded": "這條紀錄已儲存、結算，並與本章任務事件核對。",
    "privacy": "天氣回答正文依現有隱私規則不保存在日誌中；這裡只確認交換完成，不複述雙方的天氣。",
    "signal": "傳播",
    "exchange": "天氣交換",
    "answered": "已完成",
    "recovery": "恢復",
    "remoteQuery": "對方接收恢復",
    "artLabels": {
      "scene": "第四章雨夜電臺場景",
      "portrait": "與 SIM2DX 關聯的角色立繪，僅在通聯結束後展示",
      "illustration": "雨幕中的通聯章節插畫"
    },
    "beats": [
      [
        "先把本子挪遠一點",
        "窗縫裡飄進幾滴雨。你把日誌往桌裡挪了挪，用袖口擦掉紙邊的水。",
        "SIM2DX 的呼號寫在下一行。先戴好耳機，看看今晚能不能接上。"
      ],
      [
        "沒聽清的地方，先空著",
        "你把鉛筆削過的那一面轉向自己，旁邊留出一小塊空白。漏掉的內容就記在這裡，別急著補。",
        "AGN 是再發一次，QRS 是慢一點。真要用上時，發完等對方回應就好，不必為此趕著往下走。"
      ],
      [
        "把天氣問完",
        "{player} 已寫在頁首。你把椅子往前挪，讓手腕放穩。",
        "這次找 SIM2DX，在 P0–P2 的條件下完成天氣交換。用 AGN 或 QRS 把沒接上的地方接回來，再把通聯儲存。"
      ],
      [
        "這一次，接上了",
        "{peer} 的通聯已經存進日誌。天氣交換完成，過程中用來恢復通聯的紀錄也在。",
        "你摘下一邊耳機，才發現窗外的雨還沒停。先別翻頁，核對一下剛才的呼號和報告。"
      ],
      [
        "在這一行停一會兒",
        "你順著這一行重新看了一遍：時間、呼號、雙方的 RST，還有當時的傳播等級。",
        "接不上的時候停下來重試，也能把一次通聯做完。你合上筆帽，把這頁留在最上面。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Four",
    "title": "Beyond the Rain Curtain",
    "entry": "Chapter Four · Beyond the Rain Curtain",
    "enter": "Enter the station · Contact SIM2DX",
    "finish": "Finish Chapter Four · Claim reward",
    "complete": "Chapter Four is complete. Chapter Five is available.",
    "unavailable": "Accept Chapter Four at the mission center. Older completed tasks with incomplete verification records can still claim their reward there.",
    "hint": "Complete and save a weather exchange with SIM2DX at P0–P2. Send AGN K for a repeat or QRS K for a slower reply, then answer the WX question. SKIP K does not count. P3–P4 contacts are saved but do not complete this chapter.",
    "recorded": "This saved and settled contact matches a mission event for this chapter.",
    "privacy": "Weather answers are omitted from the log under the existing privacy rule. This page confirms the exchange, not either station's weather.",
    "signal": "Propagation",
    "exchange": "Weather exchange",
    "answered": "Completed",
    "recovery": "Recovery",
    "remoteQuery": "Remote reception recovery",
    "artLabels": {
      "scene": "Chapter Four rainy station scene",
      "portrait": "Character portrait associated with SIM2DX, shown only after the contact",
      "illustration": "Chapter illustration of a contact through the rain"
    },
    "beats": [
      [
        "Move the log away from the window",
        "A few drops come through the gap in the window. You pull the log farther onto the desk and wipe the edge of the paper with your sleeve.",
        "SIM2DX is written on the next line. Headphones first. Let's see whether you can make contact tonight."
      ],
      [
        "Leave a gap if you miss something",
        "You turn the sharpened side of the pencil toward you and leave a small blank space beside the entry. Missed details can go here. No need to guess.",
        "AGN asks for a repeat; QRS asks for slower sending. If you need one, send it and wait for the reply before moving on."
      ],
      [
        "Finish the weather exchange",
        "{player} is at the top of the page. You pull the chair closer and settle your wrist.",
        "Contact SIM2DX at P0–P2. Use AGN or QRS to recover a missed part, answer the weather question and save the contact."
      ],
      [
        "Back on track",
        "The contact with {peer} is in the log. The weather exchange is complete, and the record includes the recovery along the way.",
        "You lift one earcup. It is still raining outside. Before turning the page, check the callsign and reports."
      ],
      [
        "One more look at this line",
        "You read through the entry again: time, callsign, both RST reports and the propagation level at the time.",
        "Stopping to try again did not stop you finishing the contact. You cap the pen and leave this page on top."
      ]
    ]
  },
  "ja": {
    "chapter": "第4章",
    "title": "雨幕の向こう",
    "entry": "第4章 · 雨幕の向こう",
    "enter": "無線局へ · SIM2DX と交信",
    "finish": "第4章を完了 · 報酬を受け取る",
    "complete": "第4章は完了しました。第5章に進めます。",
    "unavailable": "ミッションセンターで第4章を受注してください。確認記録が足りない旧セーブの達成済み任務も、そこで報酬を受け取れます。",
    "hint": "P0–P2 で SIM2DX と天気のやり取りを終えて保存します。聞き直すには AGN K、遅くしてほしい時は QRS K。その後 WX の質問に答えます。SKIP K は達成になりません。P3–P4 の交信は保存されますが本章には数えません。",
    "recorded": "保存・精算された交信と、この章の任務イベントを照合しています。",
    "privacy": "既存のプライバシー規則により、天気の回答本文はログに保存しません。ここではやり取りの完了だけを示します。",
    "signal": "伝搬",
    "exchange": "天気の交換",
    "answered": "完了",
    "recovery": "復旧",
    "remoteQuery": "相手側の受信回復",
    "artLabels": {
      "scene": "第4章の雨の無線室",
      "portrait": "交信終了後に表示する SIM2DX 関連の立ち絵",
      "illustration": "雨の中の交信を描いた章の挿絵"
    },
    "beats": [
      [
        "ログを窓から離す",
        "窓の隙間から雨粒が入ってくる。ログを机の奥へ寄せ、紙の端を袖で拭く。",
        "次の行には SIM2DX と書いてある。まずはヘッドホンを。今夜はつながるだろうか。"
      ],
      [
        "聞き取れない所は空けておく",
        "鉛筆の削った面を手前に向け、記録の横に小さな余白を残す。聞き逃した所はここに書けばいい。推測で埋めなくてもいい。",
        "AGN はもう一度、QRS はゆっくり。必要なら送って、返事を待ってから先へ進もう。"
      ],
      [
        "天気のやり取りを終える",
        "ページの上には {player}。椅子を寄せ、手首を落ち着かせる。",
        "P0–P2 で SIM2DX と交信する。AGN か QRS で聞き直し、天気の質問に答えて保存しよう。"
      ],
      [
        "今度はつながった",
        "{peer} との交信がログに残った。天気のやり取りは完了し、途中の復旧も記録されている。",
        "片方のイヤーカップを外す。外はまだ雨だ。ページをめくる前に、呼出符号とレポートを確かめよう。"
      ],
      [
        "この行をもう一度",
        "時刻、呼出符号、双方の RST、その時の伝搬レベル。記録を順に読み直す。",
        "立ち止まってやり直しても、交信は最後までできた。ペンにキャップをして、このページを上に残す。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo cuatro",
    "title": "Al otro lado de la cortina de lluvia",
    "entry": "Capítulo cuatro · Al otro lado de la lluvia",
    "enter": "Ir a la estación · Contactar con SIM2DX",
    "finish": "Terminar el capítulo cuatro · Cobrar recompensa",
    "complete": "El capítulo cuatro está completo. El capítulo cinco está disponible.",
    "unavailable": "Acepta el capítulo cuatro en el centro de misiones. Las tareas antiguas completadas sin registros suficientes aún pueden cobrar allí.",
    "hint": "Completa y guarda un intercambio meteorológico con SIM2DX en P0–P2. Usa AGN K para repetir o QRS K para reducir la velocidad y responde a WX. SKIP K no cuenta. Los contactos P3–P4 se guardan, pero no completan este capítulo.",
    "recorded": "El contacto está guardado, liquidado y vinculado a un evento de esta misión.",
    "privacy": "Las respuestas meteorológicas se omiten del registro por privacidad. Aquí se confirma el intercambio, no el tiempo de ninguna estación.",
    "signal": "Propagación",
    "exchange": "Intercambio meteorológico",
    "answered": "Completado",
    "recovery": "Recuperación",
    "remoteQuery": "Recuperación de la recepción remota",
    "artLabels": {
      "scene": "Estación bajo la lluvia del capítulo cuatro",
      "portrait": "Retrato asociado con SIM2DX, solo después del contacto",
      "illustration": "Ilustración de un contacto entre la lluvia"
    },
    "beats": [
      [
        "Aleja el registro de la ventana",
        "Entran unas gotas por la rendija. Acercas el registro al centro de la mesa y secas el borde del papel con la manga.",
        "SIM2DX está escrito en la siguiente línea. Primero, los auriculares. A ver si esta noche consigues contactar."
      ],
      [
        "Deja un hueco si no lo entiendes",
        "Giras el lápiz y dejas un pequeño hueco junto a la entrada. Ahí podrás anotar lo que falte. No hace falta adivinar.",
        "AGN pide una repetición; QRS, una transmisión más lenta. Si lo necesitas, envíalo y espera la respuesta antes de seguir."
      ],
      [
        "Termina de hablar del tiempo",
        "{player} encabeza la página. Acercas la silla y apoyas bien la muñeca.",
        "Contacta con SIM2DX en P0–P2. Usa AGN o QRS para recuperar lo que falte, responde sobre el tiempo y guarda el contacto."
      ],
      [
        "Ya está retomado",
        "El contacto con {peer} está en el registro. El intercambio meteorológico se completó y la recuperación también quedó anotada.",
        "Levantas un auricular. Fuera sigue lloviendo. Antes de pasar página, comprueba el indicativo y los informes."
      ],
      [
        "Otra mirada a esta línea",
        "Repasas la entrada: hora, indicativo, ambos RST y nivel de propagación.",
        "Parar para repetir no impidió terminar el contacto. Tapas el bolígrafo y dejas esta página encima."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel vier",
    "title": "Hinter dem Regenvorhang",
    "entry": "Kapitel vier · Hinter dem Regenvorhang",
    "enter": "Zur Station · SIM2DX kontaktieren",
    "finish": "Kapitel vier abschließen · Belohnung abholen",
    "complete": "Kapitel vier ist abgeschlossen. Kapitel fünf ist verfügbar.",
    "unavailable": "Nimm Kapitel vier im Missionszentrum an. Alte erfüllte Aufgaben mit unvollständigen Nachweisen können ihre Belohnung weiterhin dort abholen.",
    "hint": "Schließe bei P0–P2 einen Wetteraustausch mit SIM2DX ab und speichere ihn. AGN K bittet um Wiederholung, QRS K um langsameres Senden. Beantworte dann WX; SKIP K zählt nicht. P3–P4-Kontakte bleiben im Log, zählen aber nicht für dieses Kapitel.",
    "recorded": "Der gespeicherte und abgerechnete Kontakt stimmt mit einem Ereignis dieser Mission überein.",
    "privacy": "Wetterantworten werden nach der bestehenden Datenschutzregel nicht im Log gespeichert. Hier wird nur der abgeschlossene Austausch bestätigt.",
    "signal": "Ausbreitung",
    "exchange": "Wetteraustausch",
    "answered": "Abgeschlossen",
    "recovery": "Wiederaufnahme",
    "remoteQuery": "Empfangserholung der Gegenstation",
    "artLabels": {
      "scene": "Verregnete Funkstation in Kapitel vier",
      "portrait": "SIM2DX zugeordnetes Porträt, erst nach dem Kontakt sichtbar",
      "illustration": "Kapitelillustration eines Kontakts im Regen"
    },
    "beats": [
      [
        "Das Log vom Fenster wegrücken",
        "Ein paar Tropfen kommen durch den Fensterspalt. Du ziehst das Log weiter auf den Tisch und wischst den Papierrand mit dem Ärmel trocken.",
        "In der nächsten Zeile steht SIM2DX. Erst die Kopfhörer aufsetzen. Mal sehen, ob es heute Abend klappt."
      ],
      [
        "Lass eine Lücke, wenn etwas fehlt",
        "Du drehst den Bleistift und lässt neben dem Eintrag etwas Platz. Hier kannst du Fehlendes nachtragen. Raten musst du nicht.",
        "AGN bittet um Wiederholung, QRS um langsameres Senden. Wenn nötig, sende es und warte auf die Antwort, bevor du fortfährst."
      ],
      [
        "Den Wetteraustausch beenden",
        "Oben auf der Seite steht {player}. Du rückst den Stuhl heran und legst das Handgelenk ruhig ab.",
        "Kontaktiere SIM2DX bei P0–P2. Nutze AGN oder QRS zum Nachfragen, beantworte die Wetterfrage und speichere den Kontakt."
      ],
      [
        "Wieder im Gespräch",
        "Der Kontakt mit {peer} steht im Log. Der Wetteraustausch ist abgeschlossen; auch die Wiederaufnahme ist festgehalten.",
        "Du hebst eine Hörmuschel an. Draußen regnet es noch. Prüfe Rufzeichen und Rapporte, bevor du umblätterst."
      ],
      [
        "Diese Zeile noch einmal lesen",
        "Du gehst den Eintrag durch: Zeit, Rufzeichen, beide RST-Werte und die damalige Ausbreitungsstufe.",
        "Du hast kurz angehalten und es erneut versucht. Der Kontakt ist trotzdem fertig geworden. Du setzt die Stiftkappe auf und lässt die Seite oben liegen."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава четвёртая",
    "title": "По ту сторону дождя",
    "entry": "Глава четвёртая · По ту сторону дождя",
    "enter": "На станцию · Связаться с SIM2DX",
    "finish": "Завершить четвёртую главу · Получить награду",
    "complete": "Четвёртая глава завершена. Доступна пятая.",
    "unavailable": "Примите четвёртую главу в центре заданий. Старые выполненные задания с неполными подтверждающими записями по-прежнему можно сдать там.",
    "hint": "Завершите и сохраните обмен погодой с SIM2DX при P0–P2. AGN K просит повторить, QRS K — передавать медленнее. Затем ответьте на WX; SKIP K не засчитывается. Связи при P3–P4 сохраняются, но не завершают главу.",
    "recorded": "Сохранённая и рассчитанная связь совпадает с событием задания этой главы.",
    "privacy": "По действующему правилу приватности текст ответов о погоде не сохраняется. Здесь подтверждается только завершение обмена.",
    "signal": "Прохождение",
    "exchange": "Обмен погодой",
    "answered": "Завершён",
    "recovery": "Восстановление",
    "remoteQuery": "Восстановление приёма у корреспондента",
    "artLabels": {
      "scene": "Дождливая станция четвёртой главы",
      "portrait": "Портрет персонажа SIM2DX, только после завершения связи",
      "illustration": "Иллюстрация связи сквозь дождь"
    },
    "beats": [
      [
        "Отодвинуть журнал от окна",
        "В щель окна попадают капли. Ты двигаешь журнал вглубь стола и вытираешь край бумаги рукавом.",
        "На следующей строке написано SIM2DX. Сначала наушники. Посмотрим, удастся ли связаться сегодня вечером."
      ],
      [
        "Оставь место, если не разобрал",
        "Ты поворачиваешь карандаш и оставляешь рядом с записью немного места. Пропущенное можно дописать сюда. Угадывать незачем.",
        "AGN просит повторить, QRS — передавать медленнее. Если понадобится, передай запрос и дождись ответа."
      ],
      [
        "Закончить обмен погодой",
        "Вверху страницы стоит {player}. Ты придвигаешь стул и удобно кладёшь запястье.",
        "Свяжись с SIM2DX при P0–P2. Используй AGN или QRS, чтобы восстановить обмен, ответь о погоде и сохрани связь."
      ],
      [
        "Связь восстановлена",
        "Связь с {peer} записана в журнал. Обмен погодой завершён, а восстановление связи тоже отражено в записи.",
        "Ты приподнимаешь один наушник. Снаружи всё ещё дождь. Прежде чем перевернуть страницу, проверь позывной и рапорты."
      ],
      [
        "Ещё раз прочитать строку",
        "Ты перечитываешь запись: время, позывной, оба RST и уровень прохождения.",
        "Остановка для повторной попытки не помешала закончить связь. Ты закрываешь ручку и оставляешь эту страницу сверху."
      ]
    ]
  }
};
const IDS = ["rain", "gap", "call", "answer", "log"];
const ASSETS = ["scene", "scene", "illustration", "portrait", "scene"];
export const CHAPTER_FOUR_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterFourStoryText(language) {
  const t = COPY[language] ?? COPY.en;
  return { ...chapterTwoStoryText(language), ...t,
    beats: t.beats.map(([title, ...paragraphs], index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })),
  };
}

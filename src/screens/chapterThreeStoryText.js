import { chapterTwoStoryText } from "./chapterTwoStoryText.js";

const COPY = {
  "zh-CN": {
    "chapter": "第三章",
    "title": "不同的节奏",
    "entry": "第三章 · 不同的节奏",
    "enter": "进入电台 · 继续通联",
    "finish": "完成第三章 · 领取任务奖励",
    "complete": "第三章已完成，第四章已开放。",
    "unavailable": "请从任务中心接受第三章。若旧任务已达标但核验记录不完整，仍可在任务中心领取奖励。",
    "hint": "接受任务后，完成并保存三种不同操作员风格的通联。同一风格只计一次；前两章的旧记录不计入。",
    "progress": "已核实的操作员风格：{count}/3",
    "recorded": "以下条目均来自本章已保存、已结算且匹配任务事件的通联。",
    "style": "风格",
    "artLabels": {
      "scene": "第三章电台值守场景",
      "illustration": "不同发报节奏的章节插画"
    },
    "styles": [
      "谨慎的新手",
      "耐心的老手",
      "竞赛快手",
      "青年社团",
      "传统手键",
      "弱信号守听者",
      "健谈的朋友"
    ],
    "beats": [
      [
        "别急着接上去",
        "你重新戴好耳机，把日志往手边拉近。上一行的末尾写得有点挤，这次多留些位置。",
        "手指刚搭上电键，又停了下来。先听完对方，再发也来得及。"
      ],
      [
        "在旁边留一栏",
        "你在呼号旁边添了一栏：节奏。空格不大，记几个字就够了。",
        "现在还没什么可写。等通联结束，再把确实遇到的风格记进去。"
      ],
      [
        "换个呼号试试",
        "{player} 已经写在页头。你调整了一下坐姿，准备再发一遍 CQ。",
        "这次要留下三种不同的操作员风格。遇到熟悉的风格也没关系，照常聊完、记好，下一次再找。"
      ],
      [
        "把三条记录摆在一起",
        "你把 {callsigns} 的记录翻出来，逐条核对呼号和报告。三种不同的风格都记下来了。",
        "刚才发报时顾不上对照，现在可以慢慢看。以后再遇到同一种风格，通联照样会留下记录，只是不占新的名额。"
      ],
      [
        "留着下次核对",
        "你在这三条记录旁边各画了一道短线。呼号、风格和双方的 RST 都在这里，下次不用凭印象认。",
        "你把笔往右挪了一点，给电键腾出位置。还有没听过的节奏，往后再记。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第三章",
    "title": "不同的節奏",
    "entry": "第三章 · 不同的節奏",
    "enter": "進入電臺 · 繼續通聯",
    "finish": "完成第三章 · 領取任務獎勵",
    "complete": "第三章已完成，第四章已開放。",
    "unavailable": "請從任務中心接受第三章。若舊任務已達標但核驗紀錄不完整，仍可在任務中心領取獎勵。",
    "hint": "接受任務後，完成並儲存三種不同操作員風格的通聯。同一風格只計一次；前兩章的舊紀錄不計入。",
    "progress": "已核實的操作員風格：{count}/3",
    "recorded": "以下條目均來自本章已儲存、已結算且符合任務事件的通聯。",
    "style": "風格",
    "artLabels": {
      "scene": "第三章電臺值守場景",
      "illustration": "不同發報節奏的章節插畫"
    },
    "styles": [
      "謹慎的新手",
      "耐心的老手",
      "競賽快手",
      "青年社團",
      "傳統手鍵",
      "弱訊號守聽者",
      "健談的朋友"
    ],
    "beats": [
      [
        "別急著接上去",
        "你重新戴好耳機，把日誌往手邊拉近。上一行的末尾寫得有點擠，這次多留些位置。",
        "手指剛搭上電鍵，又停了下來。先聽完對方，再發也來得及。"
      ],
      [
        "在旁邊留一欄",
        "你在呼號旁邊添了一欄：節奏。空格不大，記幾個字就夠了。",
        "現在還沒什麼可寫。等通聯結束，再把確實遇到的風格記進去。"
      ],
      [
        "換個呼號試試",
        "{player} 已經寫在頁首。你調整了一下坐姿，準備再發一遍 CQ。",
        "這次要留下三種不同的操作員風格。遇到熟悉的風格也沒關係，照常聊完、記好，下一次再找。"
      ],
      [
        "把三條紀錄擺在一起",
        "你把 {callsigns} 的紀錄翻出來，逐條核對呼號和報告。三種不同的風格都記下來了。",
        "剛才發報時顧不上對照，現在可以慢慢看。以後再遇到同一種風格，通聯照樣會留下紀錄，只是不佔新的名額。"
      ],
      [
        "留著下次核對",
        "你在這三條紀錄旁邊各畫了一道短線。呼號、風格和雙方的 RST 都在這裡，下次不用憑印象認。",
        "你把筆往右挪了一點，給電鍵騰出位置。還有沒聽過的節奏，往後再記。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Three",
    "title": "Different Rhythms",
    "entry": "Chapter Three · Different Rhythms",
    "enter": "Enter the station · Keep listening",
    "finish": "Finish Chapter Three · Claim reward",
    "complete": "Chapter Three is complete. Chapter Four is available.",
    "unavailable": "Accept Chapter Three at the mission center. Older completed tasks with incomplete verification records can still claim their reward there.",
    "hint": "After accepting, complete and save contacts with three different operator styles. Each style counts once; contacts from earlier chapters do not count.",
    "progress": "Verified operator styles: {count}/3",
    "recorded": "These contacts have saved logs, settled rewards and matching mission events for this chapter.",
    "style": "Style",
    "artLabels": {
      "scene": "Chapter Three station watch",
      "illustration": "Chapter illustration of different sending rhythms"
    },
    "styles": [
      "Careful beginner",
      "Patient veteran",
      "Contest sprinter",
      "Youth club",
      "Traditional fist",
      "Weak-signal listener",
      "Friendly ragchewer"
    ],
    "beats": [
      [
        "Let the other station finish",
        "You put your headphones back on and pull the log closer. The end of the last line is cramped. You leave more room this time.",
        "Your fingers reach the key, then stop. There is time to hear the other station out before replying."
      ],
      [
        "A space beside the callsign",
        "You add a small column beside the callsign: rhythm. There is room for a few words.",
        "Nothing to put there yet. Once the contact is over, you can note the style you actually encountered."
      ],
      [
        "Try another call",
        "{player} is already at the top of the page. You settle into your chair and get ready to send CQ again.",
        "You need records of three different operator styles. A familiar style is fine too. Finish the contact, log it, and try again."
      ],
      [
        "Compare the three entries",
        "You turn back to the records for {callsigns}, checking each callsign and report. Three different styles are accounted for.",
        "There was no time to compare them while sending. Now you can take a look. If you meet a style again, the contact still gets a log entry; it just does not fill another slot."
      ],
      [
        "Keep these for next time",
        "You draw a short mark beside each of the three entries. Callsigns, styles and both RST reports are there to check next time.",
        "You move the pen a little to the right, making room beside the key. There are more rhythms to hear, and space to note them later."
      ]
    ]
  },
  "ja": {
    "chapter": "第3章",
    "title": "それぞれのリズム",
    "entry": "第3章 · それぞれのリズム",
    "enter": "無線局へ · 交信を続ける",
    "finish": "第3章を完了 · 報酬を受け取る",
    "complete": "第3章は完了しました。第4章に進めます。",
    "unavailable": "ミッションセンターで第3章を受注してください。確認記録が足りない旧セーブの達成済み任務も、そこで報酬を受け取れます。",
    "hint": "受注後に、異なる3種類のオペレータースタイルと交信して保存します。同じスタイルは1種類として数え、以前の記録は含みません。",
    "progress": "確認できたスタイル：{count}/3",
    "recorded": "この章で保存・精算され、任務イベントと一致した交信記録です。",
    "style": "スタイル",
    "artLabels": {
      "scene": "第3章の無線局",
      "illustration": "異なる送信リズムを描いた章の挿絵"
    },
    "styles": [
      "慎重な初心者",
      "辛抱強いベテラン",
      "コンテスト速送派",
      "若者クラブ",
      "昔ながらの手打ち",
      "微弱信号の聞き手",
      "話好きの仲間"
    ],
    "beats": [
      [
        "相手が終わるまで",
        "ヘッドホンを掛け直し、ログを手元へ寄せる。前の行の終わりは少し窮屈だ。今度は余白を広めに取る。",
        "電鍵に置きかけた指を止める。相手の送信を最後まで聞いてからでも、返事は間に合う。"
      ],
      [
        "呼出符号の隣に",
        "呼出符号の隣に小さな欄を作り、「リズム」と書く。短いメモなら入りそうだ。",
        "まだ書くことはない。交信が終わったら、実際に出会ったスタイルを記そう。"
      ],
      [
        "次の呼びかけ",
        "ページの上には {player} と書いてある。座り直し、もう一度 CQ を送る準備をする。",
        "違うスタイルを3種類記録する。同じスタイルの相手でもかまわない。交信を終えて保存し、次を探そう。"
      ],
      [
        "三つの記録を比べる",
        "{callsigns} の記録を開き、呼出符号とレポートを順に確かめる。異なる3種類がそろった。",
        "送信中は比べる余裕がなかった。今ならゆっくり見られる。今後同じスタイルに出会っても交信はログに残るが、新しい種類には数えない。"
      ],
      [
        "次に確かめるために",
        "三つの記録に短い印を付ける。呼出符号、スタイル、双方の RST。次は記憶だけに頼らず確認できる。",
        "ペンを少し右へずらし、電鍵の脇を空ける。まだ聞いていないリズムは、また今度書き足そう。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo tres",
    "title": "Ritmos diferentes",
    "entry": "Capítulo tres · Ritmos diferentes",
    "enter": "Entrar en la estación · Seguir escuchando",
    "finish": "Terminar el capítulo tres · Cobrar recompensa",
    "complete": "El capítulo tres está completo. El capítulo cuatro está disponible.",
    "unavailable": "Acepta el capítulo tres en el centro de misiones. Las tareas antiguas completadas sin registros suficientes aún pueden cobrar allí.",
    "hint": "Tras aceptar, completa y guarda contactos con tres estilos distintos. Cada estilo cuenta una vez; los contactos anteriores no cuentan.",
    "progress": "Estilos de operador verificados: {count}/3",
    "recorded": "Estos contactos están guardados, liquidados y vinculados a eventos de esta misión.",
    "style": "Estilo",
    "artLabels": {
      "scene": "Guardia de radio del capítulo tres",
      "illustration": "Ilustración de distintos ritmos de transmisión"
    },
    "styles": [
      "Principiante prudente",
      "Veterano paciente",
      "Velocista de concurso",
      "Club juvenil",
      "Manipulador tradicional",
      "Oyente de señales débiles",
      "Amigo conversador"
    ],
    "beats": [
      [
        "Deja terminar a la otra estación",
        "Te colocas los auriculares y acercas el registro. El final de la última línea quedó apretado. Esta vez dejas más espacio.",
        "Los dedos llegan a la llave y se detienen. Hay tiempo para escuchar hasta el final antes de responder."
      ],
      [
        "Un hueco junto al indicativo",
        "Añades una columna pequeña junto al indicativo: ritmo. Caben unas pocas palabras.",
        "Aún no hay nada que escribir. Al terminar el contacto, anotarás el estilo que realmente hayas encontrado."
      ],
      [
        "Prueba otra llamada",
        "{player} ya está escrito arriba. Te acomodas en la silla y preparas otro CQ.",
        "Necesitas registrar tres estilos distintos. Si encuentras uno conocido, termina el contacto y guárdalo igualmente. Luego podrás seguir buscando."
      ],
      [
        "Compara las tres entradas",
        "Abres los registros de {callsigns} y compruebas cada indicativo e informe. Ya están registrados tres estilos diferentes.",
        "Durante la transmisión no había tiempo para compararlos. Ahora puedes mirar con calma. Si vuelves a encontrar un estilo, guardarás el contacto, pero no ocupará otra casilla."
      ],
      [
        "Para comprobarlo la próxima vez",
        "Haces una marca corta junto a cada entrada. Los indicativos, estilos y ambos RST quedan a mano para la próxima vez.",
        "Mueves el bolígrafo a la derecha, dejando sitio junto a la llave. Quedan ritmos por escuchar; podrás anotarlos después."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel drei",
    "title": "Verschiedene Rhythmen",
    "entry": "Kapitel drei · Verschiedene Rhythmen",
    "enter": "Zur Station · Weiter funken",
    "finish": "Kapitel drei abschließen · Belohnung abholen",
    "complete": "Kapitel drei ist abgeschlossen. Kapitel vier ist verfügbar.",
    "unavailable": "Nimm Kapitel drei im Missionszentrum an. Alte erfüllte Aufgaben mit unvollständigen Nachweisen können ihre Belohnung weiterhin dort abholen.",
    "hint": "Schließe nach der Annahme Kontakte mit drei verschiedenen Operatorstilen ab und speichere sie. Jeder Stil zählt einmal; frühere Kontakte zählen nicht.",
    "progress": "Geprüfte Operatorstile: {count}/3",
    "recorded": "Diese Kontakte wurden gespeichert, abgerechnet und passenden Missionsereignissen dieses Kapitels zugeordnet.",
    "style": "Stil",
    "artLabels": {
      "scene": "Funkwache in Kapitel drei",
      "illustration": "Kapitelillustration verschiedener Senderhythmen"
    },
    "styles": [
      "Vorsichtiger Anfänger",
      "Geduldiger Veteran",
      "Contest-Sprinter",
      "Jugendclub",
      "Traditionelle Handtaste",
      "Schwachsignal-Hörer",
      "Gesprächiger Funkfreund"
    ],
    "beats": [
      [
        "Erst den anderen ausreden lassen",
        "Du setzt die Kopfhörer auf und ziehst das Log näher. Am Ende der letzten Zeile wurde es eng. Diesmal lässt du mehr Platz.",
        "Deine Finger erreichen die Taste und halten kurz inne. Du kannst die andere Station erst zu Ende hören."
      ],
      [
        "Platz neben dem Rufzeichen",
        "Neben dem Rufzeichen ziehst du eine kleine Spalte: Rhythmus. Für ein paar Worte reicht sie.",
        "Noch gibt es nichts einzutragen. Nach dem Kontakt kannst du den Stil notieren, dem du tatsächlich begegnet bist."
      ],
      [
        "Noch ein Ruf",
        "Oben auf der Seite steht schon {player}. Du rückst auf dem Stuhl zurecht und bereitest den nächsten CQ-Ruf vor.",
        "Drei verschiedene Stile sollen ins Log. Ein bekannter Stil ist auch in Ordnung. Beende den Kontakt, speichere ihn und suche weiter."
      ],
      [
        "Drei Einträge vergleichen",
        "Du schlägst die Einträge von {callsigns} auf und prüfst Rufzeichen und Rapporte. Drei unterschiedliche Stile sind nun belegt.",
        "Beim Senden war keine Zeit zum Vergleichen. Jetzt kannst du genauer hinsehen. Triffst du einen Stil erneut, bleibt der Kontakt im Log, belegt aber keinen weiteren Platz."
      ],
      [
        "Für das nächste Mal",
        "Du setzt einen kurzen Strich neben jeden der drei Einträge. Rufzeichen, Stile und beide RST-Werte stehen zum Nachsehen bereit.",
        "Du schiebst den Stift nach rechts und machst Platz neben der Taste. Weitere Rhythmen kannst du später noch notieren."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава третья",
    "title": "Разные ритмы",
    "entry": "Глава третья · Разные ритмы",
    "enter": "На станцию · Продолжить связи",
    "finish": "Завершить третью главу · Получить награду",
    "complete": "Третья глава завершена. Доступна четвёртая.",
    "unavailable": "Примите третью главу в центре заданий. Старые выполненные задания с неполными подтверждающими записями по-прежнему можно сдать там.",
    "hint": "После принятия задания завершите и сохраните связи с тремя разными стилями. Каждый стиль считается один раз; прежние связи не учитываются.",
    "progress": "Подтверждено стилей операторов: {count}/3",
    "recorded": "Эти связи сохранены, рассчитаны и подтверждены событиями задания этой главы.",
    "style": "Стиль",
    "artLabels": {
      "scene": "Дежурство на станции в третьей главе",
      "illustration": "Иллюстрация разных ритмов передачи"
    },
    "styles": [
      "Осторожный новичок",
      "Терпеливый ветеран",
      "Спринтер соревнований",
      "Молодёжный клуб",
      "Классический ручной ключ",
      "Слушатель слабых сигналов",
      "Общительный собеседник"
    ],
    "beats": [
      [
        "Дай другой станции закончить",
        "Ты надеваешь наушники и придвигаешь журнал. Конец прошлой строки получился тесным. В этот раз оставляешь больше места.",
        "Пальцы касаются ключа и замирают. Можно дослушать другую станцию и только потом отвечать."
      ],
      [
        "Место рядом с позывным",
        "Рядом с позывным появляется небольшая графа: ритм. Для пары слов места хватит.",
        "Пока записывать нечего. После связи можно будет отметить стиль, который ты действительно встретил."
      ],
      [
        "Ещё один вызов",
        "Вверху страницы уже написано {player}. Ты устраиваешься поудобнее и готовишься снова передать CQ.",
        "Нужны записи о трёх разных стилях. Знакомый стиль тоже не помеха: закончи связь, сохрани её и ищи дальше."
      ],
      [
        "Сравнить три записи",
        "Ты открываешь записи {callsigns}, проверяешь позывные и рапорты. Три разных стиля подтверждены.",
        "Во время передачи сравнивать было некогда. Теперь можно посмотреть спокойно. Если стиль встретится снова, связь останется в журнале, но не займёт новое место."
      ],
      [
        "Оставить для следующей встречи",
        "Рядом с каждой из трёх записей ты ставишь короткую черту. Позывные, стили и оба RST теперь можно проверить, не полагаясь на память.",
        "Ты сдвигаешь ручку вправо, освобождая место у ключа. Другие ритмы ещё встретятся; запишешь их позже."
      ]
    ]
  }
};
const IDS = ["listen", "notes", "call", "compare", "log"];
const ASSETS = ["scene", "scene", "illustration", "illustration", "scene"];
const STYLES = ["careful-beginner", "patient-veteran", "contest-sprinter", "youth-club", "traditional-fist", "weak-signal-listener", "friendly-ragchewer"];
export const CHAPTER_THREE_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterThreeStoryText(language) {
  const t = COPY[language] ?? COPY.en;
  return { ...chapterTwoStoryText(language), ...t,
    styles: Object.fromEntries(STYLES.map((id, index) => [id, t.styles[index]])),
    beats: t.beats.map(([title, ...paragraphs], index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })),
  };
}

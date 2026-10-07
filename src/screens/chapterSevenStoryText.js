import { chapterTwoStoryText } from "./chapterTwoStoryText.js";
import { QSL_STORY_TEXT, QSL_STORY_CHOICE_KEYS } from "./qslStoryText.js";
const COPY = {
  "zh-CN": {
    "chapter": "第七章",
    "entry": "第七章 · QSL 疑云",
    "enter": "开机 · 核对这张 QSL",
    "finish": "完成第七章 · 领取任务奖励",
    "continueStory": "继续第七章",
    "complete": "第七章已完成。人物任务树已解锁，可以接第八章。",
    "unavailable": "请先在“人物与 QSL”确认山丘卡片，再接受第七章。旧任务若已达标但演出记录不完整，仍可在任务中心领取。",
    "hint": "先比对记录，再用电键发送界面给出的 QSL 案件编号和本台呼号。收到回应后，由你选择相信、请求复核或暂不判断，最后保存结案记录。",
    "resumeHint": "剧情书签和调查进度都会保存。原卡片的最初判断不会被结尾改写；最终判断单独留在这次案件记录里。",
    "recorded": "案件、来源卡片、已结算通联与人物关系记录已核对。这里展示你的选择，不宣判哪段回忆一定正确。",
    "reward": "调查结算不发资金；这里领取一次第七章的 750 资金与 3 科技点。独立成就奖励另计。",
    "source": "来源 QSL",
    "initial": "最初判断",
    "final": "最终判断",
    "artLabels": {
      "scene": "第七章桌边核对 QSL 的场景",
      "portrait": "SORA 回应后的立绘",
      "illustration": "QSL 与电台插画"
    },
    "outcomes": {
      "believe": "你把笔尖停在“{final}”旁边，随后落了笔。这是你听过回应后作出的决定。",
      "request-review": "你在“{final}”旁边做了记号。听过这次回应，你还是想再核对一遍。",
      "defer": "你选了“{final}”。笔放回桌上，有些地方还没想清楚，就先留在这里。"
    },
    "beats": [
      [
        "把卡片摊开",
        "那张山丘 QSL 压在日志下面，抽出来时，纸角带着一点弯。你用手背慢慢抹平。",
        "卡片上已有你的最初判断：{initial}。先留着，等核对完再决定下一步。"
      ],
      [
        "再问清楚一点",
        "你把卡片和山丘那一页并排放好。呼号在这里，日期也在，不必只凭记忆找。",
        "SORA：“把这张卡的编号发来吧。我再核对一次，你不用现在改主意。”"
      ],
      [
        "照编号问",
        "你在草稿纸上写下 {player}，又把卡片编号抄了一遍，免得发到一半看错。",
        "先发送澄清请求，收到回应再作最终判断。你可以保留原来的想法，也可以改。"
      ],
      [
        "这一笔由你来落",
        "{outcome}",
        "{peer} 的这次澄清已经保存。最初判断是“{initial}”，最终判断是“{final}”，两条都留在记录里。"
      ],
      [
        "夹回原来那一页",
        "你把 QSL 夹回山丘那一页，没有擦掉最初的记号。现在旁边多了一条这次核对的记录。",
        "铅笔还在桌边。你拿它夹住这一页，免得下次又从头翻找。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第七章",
    "entry": "第七章 · QSL 疑雲",
    "enter": "開機 · 核對這張 QSL",
    "finish": "完成第七章 · 領取任務獎勵",
    "continueStory": "繼續第七章",
    "complete": "第七章已完成。人物任務樹已解鎖，可以接第八章。",
    "unavailable": "請先在「人物與 QSL」確認山丘卡片，再接受第七章。舊任務若已達標但演出記錄不完整，仍可在任務中心領取。",
    "hint": "先比對記錄，再用電鍵發送介面給出的 QSL 案件編號和本臺呼號。收到回應後，由你選擇相信、請求複核或暫不判斷，最後儲存結案記錄。",
    "resumeHint": "劇情書籤和調查進度都會儲存。原卡片的最初判斷不會被結尾改寫；最終判斷單獨留在這次案件記錄裡。",
    "recorded": "案件、來源卡片、已結算通聯與人物關係記錄已核對。這裡展示你的選擇，不判定哪段回憶一定正確。",
    "reward": "調查結算不發資金；這裡領取一次第七章的 750 資金與 3 科技點。獨立成就獎勵另計。",
    "source": "來源 QSL",
    "initial": "最初判斷",
    "final": "最終判斷",
    "artLabels": {
      "scene": "第七章桌邊核對 QSL 的場景",
      "portrait": "SORA 回應後的立繪",
      "illustration": "QSL 與電臺插畫"
    },
    "outcomes": {
      "believe": "你把筆尖停在「{final}」旁邊，隨後落了筆。這是你聽過回應後作出的決定。",
      "request-review": "你在「{final}」旁邊做了記號。聽過這次回應，你還是想再核對一遍。",
      "defer": "你選了「{final}」。筆放回桌上，有些地方還沒想清楚，就先留在這裡。"
    },
    "beats": [
      [
        "把卡片攤開",
        "那張山丘 QSL 壓在日誌下面，抽出來時，紙角有一點彎。你用手背慢慢抹平。",
        "卡片上已有你的最初判斷：{initial}。先留著，等核對完再決定下一步。"
      ],
      [
        "再問清楚一點",
        "你把卡片和山丘那一頁並排放好。呼號在這裡，日期也在，不必只憑記憶找。",
        "SORA：「把這張卡的編號發來吧。我再核對一次，你不用現在改主意。」"
      ],
      [
        "照編號問",
        "你在草稿紙上寫下 {player}，又把卡片編號抄了一遍，免得發到一半看錯。",
        "先發送澄清請求，收到回應再作最終判斷。你可以保留原來的想法，也可以改。"
      ],
      [
        "這一筆由你來落",
        "{outcome}",
        "{peer} 的這次澄清已經儲存。最初判斷是「{initial}」，最終判斷是「{final}」，兩條都留在記錄裡。"
      ],
      [
        "夾回原來那一頁",
        "你把 QSL 夾回山丘那一頁，沒有擦掉最初的記號。現在旁邊多了一條這次核對的記錄。",
        "鉛筆還在桌邊。你拿它夾住這一頁，免得下次又從頭翻找。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Seven",
    "entry": "Chapter Seven · The QSL Question",
    "enter": "Switch on · Check the QSL",
    "finish": "Finish Chapter Seven · Claim reward",
    "continueStory": "Continue Chapter Seven",
    "complete": "Chapter Seven is complete. The people task tree is unlocked; Chapter Eight is next.",
    "unavailable": "Confirm the hilltop card in People & QSL, then accept Chapter Seven. Older ready missions with incomplete presentation evidence can still be claimed in the Mission Center.",
    "hint": "Compare the records, then key the displayed QSL case number and your callsign. Read the reply and choose whether to believe, request review or defer. Save the case when you finish.",
    "resumeHint": "Your story bookmark and investigation are saved. The original card keeps your initial stance; the final choice is stored separately in this case.",
    "recorded": "The case, source card, settled contact and relationship record match. This is a record of your choice, not a ruling on whose memory is correct.",
    "reward": "The investigation itself pays no funds. Claim Chapter Seven's 750 funds and 3 technology points once here. Separate achievement rewards may also apply.",
    "source": "Source QSL",
    "initial": "Initial stance",
    "final": "Final judgment",
    "artLabels": {
      "scene": "Chapter Seven QSL checking desk",
      "portrait": "SORA after the clarification",
      "illustration": "QSL card and radio illustration"
    },
    "outcomes": {
      "believe": "Your pencil pauses beside “{final}”, then marks the box. This is the decision you made after hearing the reply.",
      "request-review": "You mark “{final}”. After this reply, you still want another check.",
      "defer": "You choose “{final}” and set the pencil down. A few things still need thought; they can stay open."
    },
    "beats": [
      [
        "Lay the card out",
        "The hilltop QSL is tucked under the log. One corner has curled; you ease it flat with the back of your hand.",
        "Your initial stance is already on the card: {initial}. Leave it there until you've checked again."
      ],
      [
        "Ask once more",
        "You place the card beside the hilltop page. The callsign and date are here; you don't need to rely on memory alone.",
        "SORA: “Send me the card number. I'll check again. You don't have to change your mind now.”"
      ],
      [
        "Use the case number",
        "You write {player} on a scrap of paper and copy the card number once more, where you can read it while keying.",
        "Send the clarification request first. After the reply, you can keep your earlier view or change it."
      ],
      [
        "Your pencil, your decision",
        "{outcome}",
        "The clarification with {peer} is saved. Your initial stance was “{initial}”; your final choice is “{final}”. Both remain in the records."
      ],
      [
        "Back to the same page",
        "You tuck the QSL back into the hilltop page without erasing the first mark. The new check has its own entry beside it.",
        "The pencil is still on the desk. You lay it across the log and fold the page over it, ready to find next time."
      ]
    ]
  },
  "ja": {
    "chapter": "第七章",
    "entry": "第七章 · QSL の疑問",
    "enter": "電源を入れる · QSL を照合",
    "finish": "第七章を完了 · 報酬を受け取る",
    "continueStory": "第七章を続ける",
    "complete": "第七章が完了しました。人物タスクツリーが解放され、第八章へ進めます。",
    "unavailable": "「人物とQSL」で丘のカードを確認し、第七章を受注してください。演出用の記録が不足する旧データでも、達成済みの報酬はミッションセンターで受け取れます。",
    "hint": "記録を照合し、画面のQSL案件番号と自局コールを電鍵で送ります。返答を読んで、信じる・追加確認・保留から選び、案件を保存してください。",
    "resumeHint": "物語のしおりと調査の進行は保存されます。元のカードの最初の判断は変わらず、最終判断は今回の案件に別に残ります。",
    "recorded": "案件、元のカード、精算済み交信、人物関係を照合しました。表示するのはあなたの選択であり、どちらの記憶が正しいかという判決ではありません。",
    "reward": "調査の精算では資金は入りません。ここで第七章の資金750と技術ポイント3を一度だけ受け取れます。実績報酬は別計算です。",
    "source": "元のQSL",
    "initial": "最初の判断",
    "final": "最終判断",
    "artLabels": {
      "scene": "第七章 QSLを照合する机",
      "portrait": "確認を終えたSORA",
      "illustration": "QSLカードと無線機の挿絵"
    },
    "outcomes": {
      "believe": "「{final}」の横で鉛筆が止まり、それから印を付けた。返答を聞いた上での、あなたの判断だ。",
      "request-review": "「{final}」に印を付ける。今回の返答を聞いても、もう一度確かめたい。",
      "defer": "「{final}」を選んで鉛筆を置く。まだ考えたいことがある。今はそのままにしておこう。"
    },
    "beats": [
      [
        "カードを広げる",
        "丘のQSLはログの下に挟まっていた。引き出すと角が少し丸まっている。手の甲でゆっくり伸ばした。",
        "カードには最初の判断がある。{initial}。照合が済むまで、そのまま残しておく。"
      ],
      [
        "もう一度聞く",
        "カードと丘のログを並べる。コールサインも日付もここにある。記憶だけで探す必要はない。",
        "SORA「カードの番号を送って。もう一度確認するよ。今すぐ考えを変えなくても大丈夫」"
      ],
      [
        "番号で尋ねる",
        "メモに {player} と書き、カードの番号も写し直す。送信の途中で読み違えないように。",
        "まず確認を依頼し、返答を読んでから最後の判断をする。前の考えを変えても、変えなくてもいい。"
      ],
      [
        "印を付けるのはあなた",
        "{outcome}",
        "{peer} との確認は保存された。最初の判断は「{initial}」、最終判断は「{final}」。両方とも記録に残る。"
      ],
      [
        "元のページへ",
        "最初の印を消さずにQSLを丘のページへ戻す。その横には、今回の確認を記した一行が増えた。",
        "机に残った鉛筆をログに横向きに置く。ページをかぶせておけば、次もすぐに見つかる。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo Siete",
    "entry": "Capítulo Siete · La duda QSL",
    "enter": "Encender · Revisar la QSL",
    "finish": "Terminar el capítulo siete · Cobrar",
    "continueStory": "Continuar el capítulo siete",
    "complete": "Capítulo siete completado. Se desbloqueó el árbol de tareas de personajes; sigue el capítulo ocho.",
    "unavailable": "Confirma la tarjeta de la colina en Personas y QSL y acepta el capítulo siete. Las misiones antiguas ya completadas sin pruebas de presentación suficientes aún pueden cobrarse en el Centro de Misiones.",
    "hint": "Compara los registros y transmite con el manipulador el número de caso QSL y tu indicativo que aparecen en pantalla. Lee la respuesta, elige creer, pedir revisión o aplazar, y guarda el caso.",
    "resumeHint": "Se guardan el punto de la historia y la investigación. La tarjeta conserva tu postura inicial; la decisión final queda por separado en este caso.",
    "recorded": "Coinciden el caso, la tarjeta de origen, el contacto liquidado y la relación. Se muestra tu decisión, no un veredicto sobre qué recuerdo es correcto.",
    "reward": "La investigación no paga fondos. Cobra aquí una sola vez los 750 fondos y 3 puntos tecnológicos del capítulo siete. Los logros se pagan aparte.",
    "source": "QSL de origen",
    "initial": "Postura inicial",
    "final": "Decisión final",
    "artLabels": {
      "scene": "Mesa de revisión QSL del capítulo siete",
      "portrait": "SORA tras la aclaración",
      "illustration": "Ilustración de tarjeta QSL y radio"
    },
    "outcomes": {
      "believe": "El lápiz se detiene junto a «{final}» y luego marca la casilla. Es tu decisión después de escuchar la respuesta.",
      "request-review": "Marcas «{final}». Después de esta respuesta, todavía quieres comprobarlo otra vez.",
      "defer": "Eliges «{final}» y dejas el lápiz. Quedan cosas por pensar; pueden esperar."
    },
    "beats": [
      [
        "Extiende la tarjeta",
        "La QSL de la colina estaba debajo del registro. Una esquina se ha doblado; la alisas despacio con el dorso de la mano.",
        "La tarjeta ya tiene tu postura inicial: {initial}. Déjala hasta terminar la comprobación."
      ],
      [
        "Pregunta de nuevo",
        "Pones la tarjeta junto a la página de la colina. Aquí están el indicativo y la fecha; no hace falta depender solo de la memoria.",
        "SORA: «Envíame el número de la tarjeta. Lo miraré otra vez. No tienes que cambiar de opinión ahora»."
      ],
      [
        "Usa el número de caso",
        "Escribes {player} en una hoja suelta y copias de nuevo el número de tarjeta para verlo bien mientras transmites.",
        "Primero pide la aclaración. Después de la respuesta podrás mantener tu opinión o cambiarla."
      ],
      [
        "La decisión es tuya",
        "{outcome}",
        "Se guardó la aclaración con {peer}. Tu postura inicial fue «{initial}» y la decisión final es «{final}». Las dos quedan registradas."
      ],
      [
        "Vuelve a la misma página",
        "Guardas la QSL en la página de la colina sin borrar la primera marca. La nueva comprobación tiene su propia entrada.",
        "El lápiz sigue en la mesa. Lo cruzas sobre el registro y doblas la página encima para encontrarlo la próxima vez."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel Sieben",
    "entry": "Kapitel Sieben · Die QSL-Frage",
    "enter": "Einschalten · QSL prüfen",
    "finish": "Kapitel Sieben abschließen · Belohnung",
    "continueStory": "Kapitel Sieben fortsetzen",
    "complete": "Kapitel Sieben ist abgeschlossen. Der Personen-Aufgabenbaum ist frei; als Nächstes folgt Kapitel Acht.",
    "unavailable": "Bestätige die Hügelkarte unter Personen & QSL und nimm Kapitel Sieben an. Bereits erfüllte ältere Missionen ohne vollständige Szenennachweise lassen sich weiterhin im Missionszentrum abschließen.",
    "hint": "Vergleiche die Aufzeichnungen und gib die angezeigte QSL-Fallnummer und dein Rufzeichen mit der Taste. Lies die Antwort, entscheide dich für Glauben, weitere Prüfung oder Aufschub und speichere den Fall.",
    "resumeHint": "Lesezeichen und Untersuchung werden gespeichert. Die ursprüngliche Karte behält dein erstes Urteil; die endgültige Entscheidung steht separat in diesem Fall.",
    "recorded": "Fall, Quellkarte, abgerechneter Kontakt und Personenbeziehung stimmen überein. Gezeigt wird deine Wahl, kein Urteil darüber, welche Erinnerung richtig ist.",
    "reward": "Die Untersuchung zahlt kein Geld. Hier erhältst du einmalig 750 Geld und 3 Technikpunkte für Kapitel Sieben. Erfolge werden gesondert vergütet.",
    "source": "Ursprüngliche QSL",
    "initial": "Erstes Urteil",
    "final": "Endgültiges Urteil",
    "artLabels": {
      "scene": "QSL-Prüftisch in Kapitel Sieben",
      "portrait": "SORA nach der Klärung",
      "illustration": "Illustration von QSL-Karte und Funkgerät"
    },
    "outcomes": {
      "believe": "Dein Stift hält neben „{final}“ inne, dann setzt du das Kreuz. Das ist deine Entscheidung nach der Antwort.",
      "request-review": "Du markierst „{final}“. Auch nach dieser Antwort möchtest du noch einmal nachprüfen.",
      "defer": "Du wählst „{final}“ und legst den Stift hin. Ein paar Dinge brauchen noch Zeit; sie dürfen offenbleiben."
    },
    "beats": [
      [
        "Die Karte ausbreiten",
        "Die Hügel-QSL steckt unter dem Logbuch. Eine Ecke ist eingerollt. Mit dem Handrücken streichst du sie langsam glatt.",
        "Dein erstes Urteil steht schon auf der Karte: {initial}. Es bleibt dort, bis du nachgeprüft hast."
      ],
      [
        "Noch einmal fragen",
        "Du legst die Karte neben die Hügelseite. Rufzeichen und Datum stehen hier; du musst dich nicht allein auf dein Gedächtnis verlassen.",
        "SORA: „Schick mir die Kartennummer. Ich prüfe noch einmal nach. Du musst deine Meinung jetzt nicht ändern.“"
      ],
      [
        "Mit der Fallnummer",
        "Du schreibst {player} auf einen Zettel und überträgst die Kartennummer noch einmal, gut lesbar neben der Taste.",
        "Sende zuerst die Rückfrage. Nach der Antwort kannst du bei deiner Meinung bleiben oder sie ändern."
      ],
      [
        "Du setzt das Kreuz",
        "{outcome}",
        "Die Klärung mit {peer} ist gespeichert. Dein erstes Urteil war „{initial}“, dein endgültiges lautet „{final}“. Beide bleiben erhalten."
      ],
      [
        "Zurück auf dieselbe Seite",
        "Du steckst die QSL wieder zur Hügelseite, ohne die erste Markierung zu löschen. Die neue Prüfung hat einen eigenen Eintrag.",
        "Der Stift liegt noch auf dem Tisch. Du legst ihn quer ins Logbuch und schlägst die Seite darüber, damit du ihn wiederfindest."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава Седьмая",
    "entry": "Глава Седьмая · Вопрос QSL",
    "enter": "Включить радио · Проверить QSL",
    "finish": "Завершить седьмую главу · Награда",
    "continueStory": "Продолжить седьмую главу",
    "complete": "Седьмая глава завершена. Открыто дерево заданий персонажей; дальше восьмая глава.",
    "unavailable": "Подтверди карточку с холма в разделе «Люди и QSL» и прими седьмую главу. Старые выполненные задания с неполными данными для сцен можно закрыть в центре заданий.",
    "hint": "Сравни записи, затем передай ключом указанные номер дела QSL и свой позывной. Прочитай ответ, реши, верить ли записи, запросить проверку или отложить решение, и сохрани дело.",
    "resumeHint": "Место в истории и ход проверки сохраняются. Первое решение на карточке не меняется; итоговое хранится отдельно в этом деле.",
    "recorded": "Дело, исходная карточка, учтённая связь и запись отношений совпадают. Здесь показан твой выбор, а не вердикт о том, чья память верна.",
    "reward": "Сама проверка не приносит денег. Здесь можно один раз получить 750 средств и 3 очка технологий за седьмую главу. Награды достижений учитываются отдельно.",
    "source": "Исходная QSL",
    "initial": "Первое решение",
    "final": "Итоговое решение",
    "artLabels": {
      "scene": "Стол для проверки QSL в седьмой главе",
      "portrait": "SORA после уточнения",
      "illustration": "Карточка QSL и радиостанция"
    },
    "outcomes": {
      "believe": "Карандаш замирает рядом с «{final}», затем ставит отметку. Это твоё решение после полученного ответа.",
      "request-review": "Ты отмечаешь «{final}». Даже после этого ответа хочется проверить ещё раз.",
      "defer": "Ты выбираешь «{final}» и кладёшь карандаш. Кое-что ещё нужно обдумать; пока можно оставить вопрос открытым."
    },
    "beats": [
      [
        "Разложить карточку",
        "QSL с холма лежала под журналом. Уголок загнулся; ты медленно разглаживаешь его тыльной стороной ладони.",
        "На карточке уже есть первое решение: {initial}. Пусть остаётся, пока не закончишь проверку."
      ],
      [
        "Спросить ещё раз",
        "Ты кладёшь карточку рядом со страницей о холме. Тут есть позывной и дата; не нужно полагаться только на память.",
        "SORA: «Пришли номер карточки. Я проверю ещё раз. Сейчас менять мнение не обязательно»."
      ],
      [
        "Указать номер дела",
        "Ты пишешь {player} на черновике и ещё раз переписываешь номер карточки, чтобы не ошибиться во время передачи.",
        "Сначала отправь запрос. После ответа можно оставить прежнее мнение или изменить его."
      ],
      [
        "Отметку ставишь ты",
        "{outcome}",
        "Уточнение с {peer} сохранено. Первое решение — «{initial}», итоговое — «{final}». Обе записи остаются."
      ],
      [
        "На прежнюю страницу",
        "Ты вкладываешь QSL обратно на страницу о холме, не стирая первую отметку. Рядом появилась отдельная запись новой проверки.",
        "Карандаш всё ещё на столе. Ты кладёшь его поперёк журнала и прикрываешь страницей, чтобы найти в следующий раз."
      ]
    ]
  }
};

const IDS = ["card","compare","call","answer","log"], ASSETS = ["scene","scene","illustration","portrait","scene"];
export const CHAPTER_SEVEN_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterSevenStoryText(language) {
  const t = COPY[language] ?? COPY.en, qsl = QSL_STORY_TEXT[language] ?? QSL_STORY_TEXT.en;
  return { ...chapterTwoStoryText(language), ...t, title: qsl.title,
    choices: Object.fromEntries(Object.entries(QSL_STORY_CHOICE_KEYS).map(([choice,key]) => [choice,qsl[key]])),
    beats: t.beats.map(([title,...paragraphs],index) => ({ id: IDS[index], asset: ASSETS[index], title, paragraphs, eyebrow: t.chapter })) };
}

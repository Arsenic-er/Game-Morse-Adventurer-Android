import { chapterTwoStoryText } from "./chapterTwoStoryText.js";
import { COORDINATE_RELAY_TEXT } from "./coordinateRelayText.js";
const COPY = {
  "zh-CN": {
    "chapter": "第九章",
    "entry": "第九章 · 坐标中继",
    "enter": "开机 · 复诵并转发",
    "finish": "完成第九章 · 领取任务奖励",
    "continueStory": "继续第九章",
    "returnToStory": "返回第九章剧情",
    "complete": "第九章已完成。结构化报文工具已解锁，可以接第十章。",
    "unavailable": "请先完成第八章，再接受本章。旧任务若已达标但演出记录不完整，仍可在任务中心领取。",
    "hint": "先抄收 SIM9CR 的固定报文，用电键完整复诵 MSG、GRID、TIME、PEOPLE、CHECK，再将同一报文发给 SIM9RL。收到中继确认后保存记录。",
    "resumeHint": "报文和剧情书签会保存。设置、离开确认或窗口失焦会暂停计时。转发时若请求重发或出现字段错误，会先回到源台重新核对，再转发。",
    "recorded": "两条已结算通联与同一份报文记录相符。PX 是游戏虚构网格，不代表现实地点。",
    "reward": "保存中继记录不发资金；本章奖励为 950 资金与 4 科技点，只领取一次。独立成就奖励另计。",
    "packetLabel": "本轮报文",
    "artLabels": {
      "scene": "第九章坐标中继场景",
      "portrait": "第九章中继操作员立绘",
      "illustration": "第九章核对网格报文的插画"
    },
    "beats": [
      [
        "在两边写上呼号",
        "你把纸横过来，左边写 SIM9CR，右边写 SIM9RL。中间留宽一些，免得一串数字挤在一起。",
        "SIM9CR：“这份先发给你。你读回给我听，核对好了，再交给另一边。”"
      ],
      [
        "这一栏别串过去",
        "网格、时间、人数，你照着标签分开记。刚写完一行，笔尖又回到开头，逐个指了一遍。",
        "SIM9CR：“哪一段没抄清楚就问。别怕多占几秒，改对了再往下走。”"
      ],
      [
        "先读给原台听",
        "你把 {player} 写在页角，手挪到电键旁。纸上两组网格数字之间留着空隙，零也一个没省。",
        "完整复诵这份报文，再原样转发。还没收到 SIM9RL 的确认前，这一页先别收起来。"
      ],
      [
        "另一边也收到了",
        "{source} 的复诵记录和 {peer} 的确认已经保存。你对着 {grid} 看了两遍，报文号是 {packetId}，校验数是 {check}。",
        "SIM9RL：“这份收妥了。编号和校验都对得上。”"
      ],
      [
        "同一份，留两条记录",
        "你在左右两个呼号下面各做了个记号，把这一页夹进中继记录。原台和转发台都找得到。",
        "刚才一直压着纸角的手松开了。纸没再滑动，你这才拿起桌边的杯子。"
      ]
    ]
  },
  "zh-TW": {
    "chapter": "第九章",
    "entry": "第九章 · 座標中繼",
    "enter": "開機 · 復誦並轉發",
    "finish": "完成第九章 · 領取任務獎勵",
    "continueStory": "繼續第九章",
    "returnToStory": "返回第九章劇情",
    "complete": "第九章已完成。結構化報文工具已解鎖，可以接第十章。",
    "unavailable": "請先完成第八章，再接受本章。舊任務若已達標但演出記錄不完整，仍可在任務中心領取。",
    "hint": "先抄收 SIM9CR 的固定報文，用電鍵完整復誦 MSG、GRID、TIME、PEOPLE、CHECK，再將同一報文發給 SIM9RL。收到中繼確認後儲存記錄。",
    "resumeHint": "報文和劇情書籤會儲存。設定、退出確認或視窗失焦會暫停計時。轉發時若請求重發或出現欄位錯誤，會先回到來源臺重新核對，再轉發。",
    "recorded": "兩條已結算通聯與同一份報文記錄相符。PX 是遊戲虛構網格，不代表現實地點。",
    "reward": "儲存中繼記錄不發資金；本章獎勵為 950 資金與 4 科技點，只領取一次。獨立成就獎勵另計。",
    "packetLabel": "本輪報文",
    "artLabels": {
      "scene": "第九章座標中繼場景",
      "portrait": "第九章中繼操作員立繪",
      "illustration": "第九章核對網格報文的插畫"
    },
    "beats": [
      [
        "在兩邊寫上呼號",
        "你把紙橫過來，左邊寫 SIM9CR，右邊寫 SIM9RL。中間留寬一些，免得一串數字擠在一起。",
        "SIM9CR：「這份先發給你。你讀回給我聽，核對好了，再交給另一邊。」"
      ],
      [
        "這一欄別串過去",
        "網格、時間、人數，你照著標籤分開記。剛寫完一行，筆尖又回到開頭，逐個指了一遍。",
        "SIM9CR：「哪一段沒抄清楚就問。別怕多占幾秒，改對了再往下走。」"
      ],
      [
        "先讀給原臺聽",
        "你把 {player} 寫在頁角，手挪到電鍵旁。紙上兩組網格數字之間留著空隙，零也一個沒省。",
        "完整復誦這份報文，再原樣轉發。還沒收到 SIM9RL 的確認前，這一頁先別收起來。"
      ],
      [
        "另一邊也收到了",
        "{source} 的復誦記錄和 {peer} 的確認已經儲存。你對著 {grid} 看了兩遍，報文號是 {packetId}，校驗數是 {check}。",
        "SIM9RL：「這份收妥了。編號和校驗都對得上。」"
      ],
      [
        "同一份，留兩條記錄",
        "你在左右兩個呼號下面各做了個記號，把這一頁夾進中繼記錄。原臺和轉發臺都找得到。",
        "剛才一直壓著紙角的手鬆開了。紙沒再滑動，你這才拿起桌邊的杯子。"
      ]
    ]
  },
  "en": {
    "chapter": "Chapter Nine",
    "entry": "Chapter Nine · Coordinate Relay",
    "enter": "Switch on · Read back and relay",
    "finish": "Finish Chapter Nine · Claim reward",
    "continueStory": "Continue Chapter Nine",
    "returnToStory": "Back to Chapter Nine",
    "complete": "Chapter Nine is complete. The structured-message tool is unlocked; Chapter Ten is next.",
    "unavailable": "Finish Chapter Eight and accept this chapter. Older ready missions without the full presentation ledger can still be claimed in the Mission Center.",
    "hint": "Copy SIM9CR's fixed packet. Key every MSG, GRID, TIME, PEOPLE and CHECK field back, then send the same packet to SIM9RL. Save after receiving its confirmation.",
    "resumeHint": "The packet and story bookmark are saved. Settings, leave confirmation and loss of focus pause the timer. A repeat request or field error during relay sends you back to check with the source before relaying again.",
    "recorded": "Both settled contacts match the same packet record. PX is a fictional game grid, not a real location.",
    "reward": "Saving the relay pays no funds. Claim 950 funds and 4 technology points once for this chapter. Separate achievement rewards may apply.",
    "packetLabel": "This run's packet",
    "artLabels": {
      "scene": "Chapter Nine coordinate relay scene",
      "portrait": "Chapter Nine relay operator portrait",
      "illustration": "Chapter Nine grid packet illustration"
    },
    "beats": [
      [
        "A callsign at each end",
        "You turn the sheet sideways and write SIM9CR on the left, SIM9RL on the right. You leave plenty of room between them for the numbers.",
        "SIM9CR: “I'll send this one to you first. Read it back to me. Once we've checked it, pass it on.”"
      ],
      [
        "Keep the fields apart",
        "Grid, time, people: you give each label its own space. At the end of the line, your pen goes back and points along it once more.",
        "SIM9CR: “Ask about anything you missed. A few extra seconds are fine. Get it right before moving on.”"
      ],
      [
        "Back to the source first",
        "You write {player} in the corner and move your hand to the key. There's a gap between the two grid groups. You haven't dropped any zeros.",
        "Read the whole packet back, then relay it unchanged. Keep the sheet out until SIM9RL confirms receipt."
      ],
      [
        "The other end has it",
        "The readback with {source} and the confirmation from {peer} are saved. You check {grid} twice: message {packetId}, check value {check}.",
        "SIM9RL: “Got this one. The message number and check match.”"
      ],
      [
        "One packet, two records",
        "You mark both callsigns and file the sheet with the relay records. There's an entry for each station.",
        "You let go of the corner you've been holding down. The paper stays put. At last, you reach for your cup."
      ]
    ]
  },
  "ja": {
    "chapter": "第九章",
    "entry": "第九章 · 座標リレー",
    "enter": "電源を入れる · 復唱して中継",
    "finish": "第九章を完了 · 報酬を受け取る",
    "continueStory": "第九章を続ける",
    "returnToStory": "第九章の物語へ戻る",
    "complete": "第九章を完了しました。構造化電文ツールと第十章が開放されました。",
    "unavailable": "第八章を終えて、この章を受注してください。演出記録の足りない旧データでも、達成済み任務はミッションセンターで精算できます。",
    "hint": "SIM9CR の固定電文を受信し、MSG・GRID・TIME・PEOPLE・CHECK を電鍵で全部復唱します。同じ電文を SIM9RL に送り、確認を受けてから保存してください。",
    "resumeHint": "電文と物語のしおりは保存されます。設定、退出確認、フォーカス喪失中は計時を停止。中継中の再送要求や項目の誤りでは、送信元との照合からやり直します。",
    "recorded": "確定した2件の交信は同じ電文記録に対応しています。PX はゲーム内の架空グリッドで、実在の場所ではありません。",
    "reward": "中継記録の保存だけでは資金は増えません。章報酬の 950 資金と 4 技術ポイントは一度だけ受け取れます。実績報酬は別です。",
    "packetLabel": "今回の電文",
    "artLabels": {
      "scene": "第九章の座標リレー背景",
      "portrait": "第九章の中継担当者",
      "illustration": "第九章のグリッド電文の挿絵"
    },
    "beats": [
      [
        "両端にコールを書く",
        "紙を横にして、左に SIM9CR、右に SIM9RL と書く。数字が詰まらないよう、間を広く空けた。",
        "SIM9CR：「まずこちらから送ります。復唱してもらって、確認できたら次の局へ渡してください。」"
      ],
      [
        "欄を混ぜないように",
        "グリッド、時刻、人数。ラベルごとに分けて書く。一行書き終えたところで、ペン先を最初に戻してたどった。",
        "SIM9CR：「取れなかったところは聞いてください。数秒長くても大丈夫。直してから進みましょう。」"
      ],
      [
        "まず送信元へ復唱",
        "紙の隅に {player} と書き、手を電鍵へ移す。2組のグリッド数字の間を空け、ゼロも省かずに書いてある。",
        "電文を全部復唱してから、そのまま中継する。SIM9RL の確認が来るまで、この紙は出しておこう。"
      ],
      [
        "向こうにも届いた",
        "{source} への復唱と {peer} の確認が保存された。{grid} を二度見直す。電文番号は {packetId}、チェック値は {check}。",
        "SIM9RL：「受け取りました。番号もチェックも合っています。」"
      ],
      [
        "一つの電文に二つの記録",
        "左右のコールの下に印をつけ、中継記録に紙を挟む。どちらの局との交信も探せるようになった。",
        "押さえていた紙の角から手を離す。紙は滑らない。それを見てから、机の端のカップを手に取った。"
      ]
    ]
  },
  "es": {
    "chapter": "Capítulo nueve",
    "entry": "Capítulo nueve · Relevo de coordenadas",
    "enter": "Encender · Repetir y retransmitir",
    "finish": "Terminar el capítulo nueve · Cobrar",
    "continueStory": "Continuar el capítulo nueve",
    "returnToStory": "Volver a la historia del capítulo nueve",
    "complete": "Capítulo nueve completado. Se desbloquearon la herramienta de mensajes estructurados y el capítulo diez.",
    "unavailable": "Termina el capítulo ocho y acepta este capítulo. Las misiones antiguas ya cumplidas sin todo el registro de presentación aún pueden cobrarse en el Centro de misiones.",
    "hint": "Copia el paquete fijo de SIM9CR. Repite con el manipulador todos los campos MSG, GRID, TIME, PEOPLE y CHECK, y envía el mismo paquete a SIM9RL. Guarda tras recibir su confirmación.",
    "resumeHint": "Se guardan el paquete y el punto de lectura. Los ajustes, la confirmación de salida y la pérdida de foco pausan el reloj. Una petición de repetición o un campo erróneo durante el relevo te devuelve al origen para comprobarlo.",
    "recorded": "Los dos contactos guardados corresponden al mismo paquete. PX es una cuadrícula ficticia del juego, no un lugar real.",
    "reward": "Guardar el relevo no da fondos. La recompensa del capítulo es de 950 fondos y 4 puntos tecnológicos, una sola vez. Los logros se pagan aparte.",
    "packetLabel": "Paquete de esta ronda",
    "artLabels": {
      "scene": "Escena del relevo del capítulo nueve",
      "portrait": "Operador del capítulo nueve",
      "illustration": "Ilustración del paquete del capítulo nueve"
    },
    "beats": [
      [
        "Un indicativo a cada lado",
        "Giras la hoja y escribes SIM9CR a la izquierda, SIM9RL a la derecha. Dejas espacio entre ambos para no amontonar los números.",
        "SIM9CR: «Te lo envío primero a ti. Repítemelo y, cuando lo hayamos comprobado, pásalo al otro lado.»"
      ],
      [
        "No mezclar los campos",
        "Cuadrícula, hora, personas: anotas cada dato junto a su etiqueta. Al terminar la línea, vuelves al principio y la recorres con el bolígrafo.",
        "SIM9CR: «Pregunta lo que no hayas copiado bien. No pasa nada por tardar unos segundos más. Corrígelo antes de seguir.»"
      ],
      [
        "Primero, repetir al origen",
        "Escribes {player} en una esquina y acercas la mano al manipulador. Separaste los dos grupos de la cuadrícula sin omitir ningún cero.",
        "Repite el paquete entero y retransmítelo sin cambios. Deja la hoja a mano hasta que SIM9RL confirme que lo recibió."
      ],
      [
        "También llegó al otro lado",
        "Se guardaron la repetición con {source} y la confirmación de {peer}. Repasas {grid} dos veces: mensaje {packetId}, control {check}.",
        "SIM9RL: «Recibido. El número y el control coinciden.»"
      ],
      [
        "Un paquete, dos registros",
        "Marcas ambos indicativos y archivas la hoja con los registros del relevo. Hay una entrada para cada estación.",
        "Sueltas la esquina que sujetabas. El papel ya no se mueve. Por fin coges la taza."
      ]
    ]
  },
  "de": {
    "chapter": "Kapitel Neun",
    "entry": "Kapitel Neun · Koordinatenrelais",
    "enter": "Einschalten · Zurücklesen und weiterleiten",
    "finish": "Kapitel Neun abschließen · Belohnung",
    "continueStory": "Kapitel Neun fortsetzen",
    "returnToStory": "Zurück zur Geschichte von Kapitel Neun",
    "complete": "Kapitel Neun ist abgeschlossen. Das Werkzeug für strukturierte Meldungen und Kapitel Zehn sind freigeschaltet.",
    "unavailable": "Schließe Kapitel Acht ab und nimm dieses Kapitel an. Ältere erfüllte Aufgaben ohne vollständige Szenenbelege lassen sich weiterhin in der Missionszentrale abrechnen.",
    "hint": "Nimm das feste Paket von SIM9CR auf. Gib MSG, GRID, TIME, PEOPLE und CHECK vollständig zurück und sende dasselbe Paket an SIM9RL. Speichere nach dessen Bestätigung.",
    "resumeHint": "Paket und Leseposition werden gespeichert. Einstellungen, Verlassen-Dialog und Fokusverlust pausieren die Uhr. Wiederholungswünsche oder Feldfehler beim Weiterleiten führen zur erneuten Prüfung mit der Quelle zurück.",
    "recorded": "Beide abgerechneten Kontakte gehören zu demselben Paket. PX ist ein fiktives Spielraster, kein realer Ort.",
    "reward": "Das Speichern des Relais bringt kein Geld. Einmalige Kapitelbelohnung: 950 Geld und 4 Technikpunkte. Erfolge werden getrennt belohnt.",
    "packetLabel": "Paket dieser Runde",
    "artLabels": {
      "scene": "Koordinatenrelaisszene in Kapitel Neun",
      "portrait": "Relaisoperator in Kapitel Neun",
      "illustration": "Rasterpaket in Kapitel Neun"
    },
    "beats": [
      [
        "An jedes Ende ein Rufzeichen",
        "Du drehst das Blatt quer. Links steht SIM9CR, rechts SIM9RL. Dazwischen lässt du genug Platz für die Zahlen.",
        "SIM9CR: „Ich sende es erst an dich. Lies es mir zurück. Wenn alles stimmt, gibst du es weiter.“"
      ],
      [
        "Die Felder auseinanderhalten",
        "Raster, Zeit, Personen: Du schreibst jedes Feld getrennt auf. Am Zeilenende gehst du mit der Stiftspitze noch einmal zum Anfang zurück.",
        "SIM9CR: „Frag nach, wenn etwas fehlt. Ein paar Sekunden mehr sind kein Problem. Erst berichtigen, dann weitermachen.“"
      ],
      [
        "Zuerst zur Quelle zurück",
        "Du schreibst {player} in die Ecke und legst die Hand an die Taste. Zwischen den Rastergruppen ist Platz. Keine Null fehlt.",
        "Lies das ganze Paket zurück und leite es unverändert weiter. Lass das Blatt liegen, bis SIM9RL den Empfang bestätigt."
      ],
      [
        "Auch drüben angekommen",
        "Die Rücklesung mit {source} und die Bestätigung von {peer} sind gespeichert. Du prüfst {grid} zweimal: Meldung {packetId}, Prüfwert {check}.",
        "SIM9RL: „Ist angekommen. Nummer und Prüfwert stimmen überein.“"
      ],
      [
        "Ein Paket, zwei Einträge",
        "Du setzt unter beide Rufzeichen einen Haken und legst das Blatt zu den Relaisaufzeichnungen. Beide Stationen haben ihren Eintrag.",
        "Du lässt die Ecke los, die du festgehalten hast. Das Blatt bleibt liegen. Jetzt greifst du nach deiner Tasse."
      ]
    ]
  },
  "ru": {
    "chapter": "Глава девять",
    "entry": "Глава девять · Ретрансляция координат",
    "enter": "Включить станцию · Повторить и передать",
    "finish": "Завершить главу девять · Награда",
    "continueStory": "Продолжить главу девять",
    "returnToStory": "Вернуться к истории главы девять",
    "complete": "Глава девять завершена. Открыты инструмент структурированных сообщений и глава десять.",
    "unavailable": "Завершите главу восемь и примите это задание. Старые выполненные задания без всех записей для сцен можно сдать в Центре заданий.",
    "hint": "Примите фиксированный пакет SIM9CR. Ключом повторите все поля MSG, GRID, TIME, PEOPLE и CHECK, затем передайте тот же пакет SIM9RL. Сохраните запись после подтверждения.",
    "resumeHint": "Пакет и место в истории сохраняются. Настройки, окно выхода и потеря фокуса останавливают таймер. Запрос повтора или ошибка поля при передаче возвращают к сверке с исходной станцией.",
    "recorded": "Оба сохранённых контакта относятся к одному пакету. PX — вымышленная игровая сетка, а не реальное место.",
    "reward": "Сохранение ретрансляции не приносит денег. Награда главы: 950 денег и 4 очка технологий, один раз. Награды за достижения учитываются отдельно.",
    "packetLabel": "Пакет этой попытки",
    "artLabels": {
      "scene": "Сцена ретрансляции главы девять",
      "portrait": "Оператор ретрансляции главы девять",
      "illustration": "Иллюстрация пакета главы девять"
    },
    "beats": [
      [
        "Позывные по краям",
        "Ты поворачиваешь лист поперёк и пишешь слева SIM9CR, справа SIM9RL. Между ними оставляешь место, чтобы цифрам не было тесно.",
        "SIM9CR: «Сначала передам тебе. Повтори мне, проверим, а потом отправишь дальше.»"
      ],
      [
        "Не перепутать поля",
        "Сетка, время, люди: ты записываешь каждое поле отдельно. Закончив строку, возвращаешь кончик ручки к началу и проходишь по ней ещё раз.",
        "SIM9CR: «Если что-то не разобрал, спроси. Лишние секунды не страшны. Сначала исправим, потом пойдём дальше.»"
      ],
      [
        "Сначала повторить источнику",
        "Ты пишешь {player} в углу и переносишь руку к ключу. Между двумя группами сетки есть пробел; ни один ноль не пропущен.",
        "Повтори весь пакет, затем передай его без изменений. Не убирай лист, пока SIM9RL не подтвердит приём."
      ],
      [
        "На другом конце тоже приняли",
        "Повтор с {source} и подтверждение от {peer} сохранены. Ты дважды проверяешь {grid}: сообщение {packetId}, контрольное число {check}.",
        "SIM9RL: «Принял. Номер и контроль совпадают.»"
      ],
      [
        "Один пакет, две записи",
        "Ты ставишь отметки под обоими позывными и подшиваешь лист к записям ретрансляции. Теперь можно найти оба контакта.",
        "Ты отпускаешь угол, который всё это время придерживал. Лист не сдвигается. Только тогда тянешься за чашкой."
      ]
    ]
  }
};
const IDS = ["sheet","fields","readback","confirmed","log"], ASSETS = ["scene","scene","illustration","portrait","scene"];
export const CHAPTER_NINE_LANGUAGES = Object.freeze(Object.keys(COPY));
export function chapterNineStoryText(language) {
 const t = COPY[language] ?? COPY.en, activity = COORDINATE_RELAY_TEXT[language] ?? COORDINATE_RELAY_TEXT.en;
 return { ...chapterTwoStoryText(language), ...t, title: activity.title, simulationWarning: activity.simulationWarning,
   beats: t.beats.map(([title,...paragraphs],index) => ({ id: IDS[index],asset: ASSETS[index],title,paragraphs,eyebrow:t.chapter })) };
}

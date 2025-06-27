const allSentences = [
  ["媽媽", "每天", "早上", "都會", "煮", "早餐", "給", "我們", "吃。"],
  ["弟弟", "常常", "和", "朋友", "一起", "在公園", "踢球。"],
  ["我", "放學後", "會", "寫功課", "再", "看電視。"],
  ["哥哥", "喜歡", "一邊", "跑步", "一邊", "聽音樂。"],
  ["姐姐", "正在", "房間裡", "寫作業。"],
  ["我們", "一起", "幫忙", "打掃", "教室。"],
  ["爸爸", "在", "陽台上", "曬衣服。"],
  ["狗", "看見", "陌生人", "就", "開始", "叫。"],
  ["爺爺", "每天", "下午", "都會", "去", "散步。"],
  ["我", "和", "媽媽", "一起", "去", "超市", "買東西。"],
  ["小狗", "看到", "骨頭", "就", "高興地", "搖尾巴。"],
  ["妹妹", "常常", "在", "房間裡", "唱歌", "跳舞。"],
  ["早上", "我", "起床後", "會", "先", "刷牙", "洗臉。"],
  ["今天", "我們", "學校", "舉行", "運動會。"],
  ["老師", "叫", "我們", "要", "遵守", "規則。"],
  ["姐姐", "每天", "都", "會", "寫日記。"],
  ["小鳥", "在", "天空", "快樂地", "飛來飛去。"],
  ["雨", "下得", "越來越大,", "大家", "都", "撐起", "雨傘。"],
  ["我", "最喜歡", "吃", "媽媽", "煮的", "番茄炒蛋。"],
  ["哥哥", "正在", "教", "弟弟", "寫功課。"],
  ["放學後", "我", "會", "去", "圖書館", "借書", "看。"],
  ["妹妹", "把", "她的玩具", "整齊地", "收好", "放進", "箱子裡。"],
  ["風", "把", "窗簾", "吹得", "飄啊飄。"],
  ["他", "一邊", "吃點心", "一邊", "看卡通。"],
  ["我們", "在", "花園裡", "種了", "很多", "花。"],
  ["小朋友", "一起", "幫忙", "搬椅子", "和", "桌子。"],
  ["姐姐", "的", "房間", "乾淨", "又", "整齊。"],
  ["我", "早上", "吃了", "一個", "雞蛋", "和", "一杯牛奶。"],
  ["弟弟", "不小心", "把", "水", "灑在", "地上。"],
  ["爸爸", "幫我", "修理", "壞掉的", "玩具車。"],
  ["我", "每天", "走路", "去", "學校。"],
  ["我們", "去", "海邊", "玩沙", "和", "撿貝殼。"],
  ["妹妹", "穿上", "漂亮的裙子", "開心地", "跳舞。"],
  ["我", "在", "客廳", "看見", "一隻", "小蜘蛛。"],
  ["外面", "的", "花", "都", "開了", "，很美。"],
  ["這本書", "很有趣", "，我", "已經", "看了", "兩遍。"],
  ["哥哥", "把", "玩具", "借給", "弟弟", "玩。"],
  ["今天", "下午", "我要", "去", "補習班。"],
  ["奶奶", "坐在", "搖椅上", "看電視。"],
  ["我們", "在", "學校", "一起", "跳繩", "比賽。"]
];

const totalQuestions = allSentences.length;
let correctCount = 0;
let correctAnswer = [];
let draggedElement = null;
let clone = null;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateProgress() {
  document.getElementById("progress").textContent = `目前進度：${correctCount} / ${totalQuestions}`;
}

function createBox(text, isWord) {
  const box = document.createElement("div");
  box.className = "box " + (isWord ? "word" : "drop-box");
  box.textContent = text || "";

  if (isWord) {
    box.addEventListener("pointerdown", (e) => {
      draggedElement = box;
      clone = box.cloneNode(true);
      clone.classList.add("dragging");
      document.body.appendChild(clone);
      moveClone(e);
      box.setPointerCapture(e.pointerId);
    });

    box.addEventListener("pointermove", (e) => {
      if (clone) moveClone(e);
    });

    box.addEventListener("pointerup", (e) => {
      const dropBoxes = document.querySelectorAll(".drop-box");
      let dropped = false;
      dropBoxes.forEach(dropBox => {
        const rect = dropBox.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          if (dropBox.firstChild) {
            document.getElementById("word-bank").appendChild(dropBox.firstChild);
            dropBox.classList.remove("filled");
          }
          dropBox.textContent = "";
          dropBox.appendChild(box);
          dropBox.classList.add("filled");
          dropped = true;
        }
      });

      if (!dropped) {
        document.getElementById("word-bank").appendChild(box);
      }

      if (clone) {
        clone.remove();
        clone = null;
      }

      draggedElement = null;
      checkAnswer();
    });
  }

  return box;
}

function moveClone(e) {
  if (clone) {
    clone.style.left = e.clientX - clone.offsetWidth / 2 + "px";
    clone.style.top = e.clientY - clone.offsetHeight / 2 + "px";
  }
}

function loadSentence(sentence) {
  document.getElementById("result").textContent = "";
  document.getElementById("word-bank").innerHTML = "";
  document.getElementById("drop-zone").innerHTML = "";

  correctAnswer = [...sentence];
  const shuffled = shuffle([...sentence]);

  shuffled.forEach(word => {
    const wordBox = createBox(word, true);
    document.getElementById("word-bank").appendChild(wordBox);
  });

  for (let i = 0; i < correctAnswer.length; i++) {
    const dropBox = createBox("", false);
    document.getElementById("drop-zone").appendChild(dropBox);
  }
}

function loadNextSentence() {
  console.log("Loading next sentence...");
  updateProgress();
  if (allSentences.length === 0) {
    document.getElementById("result").textContent = "🎉 恭喜你完成所有題目！";

    const nextBtn = document.getElementById("nextLevelBtn");
    if (nextBtn) nextBtn.style.display = "inline-block";

    return;
  }
  const index = Math.floor(Math.random() * allSentences.length);
  const sentence = allSentences.splice(index, 1)[0];
  loadSentence(sentence);
}

function moveRunner() {
  const runner = document.getElementById("runner");
  const trophy = document.getElementById("trophy");

  const containerWidth = document.getElementById("runner-container").offsetWidth;
  const trophyX = trophy.offsetLeft;

  const stepSize = (trophyX - 100) / totalQuestions;


  const newLeft = stepSize * correctCount;

  runner.style.left = `${newLeft}px`;
}


function checkAnswer() {
  const dropBoxes = document.querySelectorAll(".drop-box");
  const allFilled = Array.from(dropBoxes).every(box => box.children.length > 0);

  if (allFilled) {
    const answer = Array.from(dropBoxes).map(box => box.firstChild.textContent);
    if (JSON.stringify(answer) === JSON.stringify(correctAnswer)) {
      document.getElementById("result").textContent = "✅ 答對了！";
      document.getElementById("clap-sound").play();
      correctCount++;
      moveRunner();
      setTimeout(() => loadNextSentence(), 3000);
    } else {
      document.getElementById("result").textContent = "❌ 再試一次喔～";
      document.getElementById("error-sound").play();
      setTimeout(() => loadSentence(correctAnswer), 1000);
    }
  }
}

updateProgress();
loadNextSentence();
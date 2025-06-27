const allSentences = [
  ["雖然", "天空", "烏雲密佈,", "我們", "仍然", "出發", "去", "遠足。"],
  ["弟弟", "一邊", "唱歌,", "一邊", "整理", "書包。"],
  ["因為", "今天", "下大雨,", "所以", "我們", "取消了", "比賽。"],
  ["媽媽", "正在", "廚房裡", "專心地", "準備", "晚餐。"],
  ["哥哥", "不但", "會", "彈鋼琴,", "還", "會", "拉小提琴。"],
  ["早上起床後,", "我", "刷牙,", "洗臉,", "然後", "吃早餐。"],
  ["在操場上,", "孩子們", "開心地", "跑來跑去。"],
  ["風", "呼呼地", "吹著,", "把", "樹葉", "吹得到處飛。"],
  ["姐姐", "把", "摺好的衣服", "放進", "衣櫃裡。"],
  ["爺爺", "坐在", "院子裡", "慢慢地", "喝茶,", "看報紙。"],
  ["雲朵", "像", "棉花糖", "一樣", "飄在", "藍藍的", "天空中。"],
  ["妹妹", "穿上", "漂亮的洋裝,", "高興地", "參加", "生日派對。"],
  ["小鳥", "一邊", "唱歌,", "一邊", "在樹枝上", "跳躍。"],
  ["如果", "你", "努力練習,", "你", "一定", "會", "成功。"],
  ["雨停了,", "我們", "才", "出去", "玩耍。"],
  ["姐姐", "每週末", "都會", "到", "圖書館", "借書", "閱讀。"],
  ["爺爺", "喜歡", "坐在", "陽台上,", "看著", "花草", "發呆。"],
  ["經過", "一番努力,", "小明", "終於", "完成了", "他的", "拼圖。"],
  ["他", "不小心", "把", "果汁", "打翻在", "地板上了。"],
  ["我們", "把", "玩具", "收拾好,", "才能", "去", "吃飯。"],
  ["雖然", "考試", "很難,", "但", "我", "還是", "盡力了。"],
  ["放學後,", "弟弟", "會", "自己", "走路", "回家。"],
  ["外面", "刮著", "大風,", "街上的", "樹葉", "滿天飛舞。"],
  ["老師", "提醒我們", "要", "專心", "聽講", "並", "完成", "作業。"],
  ["星期日", "早上,", "媽媽", "帶我", "去", "圖書館", "看書。"],
  ["他", "一邊", "笑,", "一邊", "說出", "有趣的", "故事。"],
  ["妹妹", "把", "畫", "貼在", "牆上,", "讓大家", "欣賞。"],
  ["我們", "在", "學校的", "運動會上", "一起", "參加", "接力賽。"],
  ["小熊", "站在", "山丘上,", "望著", "遠方的", "夕陽。"],
  ["弟弟", "偷偷地", "把", "糖果", "藏在", "抽屜裡。"],
  ["下課後,", "我們", "一起", "去", "操場", "玩球。"],
  ["夏天", "的", "午後,", "雷聲", "轟隆隆", "地", "響起來。"],
  ["晚餐前,", "姐姐", "會", "幫忙", "擺好", "餐具。"],
  ["他", "一邊", "吃餅乾,", "一邊", "看卡通", "節目。"],
  ["走進", "森林裡,", "我們", "發現", "許多", "小昆蟲。"],
  ["冬天", "的", "早晨,", "街道上", "瀰漫著", "白茫茫的", "霧氣。"],
  ["小朋友們", "排隊", "準備", "搭", "校車", "回家。"],
  ["那隻貓", "靜靜地", "躺在", "窗邊", "曬太陽。"],
  ["爸爸", "一邊", "聽音樂,", "一邊", "洗車。"],
  ["風吹過", "稻田,", "掀起", "金色", "的", "波浪。"]
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
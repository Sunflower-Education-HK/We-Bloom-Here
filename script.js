const allSentences = [
  ["小美", "喜歡", "畫", "圖畫", "。"],
  ["弟弟", "不喜歡", "吃", "蘋果", "。"],
  ["朋友", "送了", "弟弟", "一份", "生日", "禮物", "。"],
  ["花貓", "喜歡", "捉", "老鼠", "。"],
  ["爸爸", "拿著", "花", "準備", "送給", "媽媽", "。"],
  ["小狗", "看見", "球", "就會", "立刻", "追過去", "。"],
  ["老師", "教", "學生", "讀書", "和", "寫字", "。"],
  ["小息時,", "弟弟", "在操場", "玩", "跳繩。"],
  ["爸爸", "在", "書房裡", "專心地", "工作。"],
  ["媽媽", "小心地", "抱起", "小寶寶。"],
  ["風兒", "輕輕地", "吹過", "我的", "頭髮。"],
  ["姐姐", "會在", "家中", "幫手", "做", "家務。"],
  ["弟弟", "在", "家中", "玩得", "滿頭大汗。"],
  ["爸爸", "累得", "睡在", "沙發", "上。"],
  ["蘋果", "是", "有益", "的。"],
  ["祖母", "最愛", "看", "電視。"],
  ["我", "最喜歡", "紅色", "的", "花朵。"],
  ["哥哥", "在", "球場", "打", "籃球。"],
  ["星期六", "我", "和", "朋友", "去", "海洋公園", "玩。"],
  ["小狗", "喜歡", "跑", "也", "喜歡", "睡覺。"],
  ["春天", "的", "時候,", "花朵", "開得", "很", "漂亮。"],
  ["夏天", "的", "時候,", "天氣", "十分", "炎熱。"],
  ["秋天", "的", "時候,", "微風", "吹起", "落葉。"],
  ["爸爸", "每天", "都會", "去", "運動場", "跑步", "。"],
  ["同學", "拾到", "一本書,", "拿起來", "交給", "老師。"],
  ["下雨天, ", "青蛙", "都會", "在", "河裡", "跳出來。"],
  ["姐姐", "喜歡", "跳舞, ", "也", "喜歡", "唱歌。"],
  ["妹妹", "要吃", "西瓜, ", "也", "要吃", "橙。"],
  ["過", "馬路,", "要", "小心。"],
  ["紅燈", "停,", "綠燈", "行。"],
  ["護士", "每天", "都會", "在", "醫院", "照顧", "病人。"],
  ["老師", "每天", "在", "學校", "教書。"],
  ["小熊", "和", "小豬", "都是", "好朋友。"],
  ["蜜蜂", "每天", "辛勞地", "採", "花蜜。"],
  ["蝴蝶", "在", "花間", "飛舞。"],
  ["樹木", "每天", "為", "我們", "呼出", "氧氣。"],
  ["晚上,", "爸爸", "帶", "我們", "到", "公園", "散步。"],
  ["放學後,", "媽媽", "帶", "我們", "到", "遊樂場", "玩。"],
  ["外祖母", "喜歡", "吃", "香蕉。"],
  ["我", "每天", "坐", "巴士", "上學去。"]
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
  updateProgress();
  if (allSentences.length === 0) {
    document.getElementById("result").textContent = "🎉 恭喜你完成所有題目！";
    return;
  }
  const index = Math.floor(Math.random() * allSentences.length);
  const sentence = allSentences.splice(index, 1)[0];
  loadSentence(sentence);
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
      setTimeout(() => loadNextSentence(), 3000);
    } else {
      document.getElementById("result").textContent = "❌ 錯了，再試一次～";
      document.getElementById("error-sound").play();
      setTimeout(() => loadSentence(correctAnswer), 1000);
    }
  }
}

// 初始化
updateProgress();
loadNextSentence();
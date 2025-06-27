const allSentences = [
  ["小美", "喜歡", "畫", "圖畫", "。"],

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

  const nextBtn = document.getElementById("nextLevelBtn");
  if (nextBtn) nextBtn.style.display = "inline-block";

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
      moveRunner(); //
      setTimeout(() => loadNextSentence(), 3000);
    } else {
      document.getElementById("result").textContent = "❌ 錯了，再試一次～";
      document.getElementById("error-sound").play();
      setTimeout(() => loadSentence(correctAnswer), 1000);
    }
  }
}


updateProgress();
loadNextSentence();
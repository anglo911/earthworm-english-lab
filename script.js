const words = [
  { w: "habit", p: "/ˈhæbɪt/", zh: "习惯", ex: "Reading daily is a good habit.", lv: "A1" },
  { w: "review", p: "/rɪˈvjuː/", zh: "复习", ex: "I review words every night.", lv: "A1" },
  { w: "improve", p: "/ɪmˈpruːv/", zh: "提高", ex: "Practice helps you improve.", lv: "A1" },
  { w: "sentence", p: "/ˈsentəns/", zh: "句子", ex: "Make a sentence with the word.", lv: "A1" },
  { w: "memory", p: "/ˈmeməri/", zh: "记忆", ex: "Pictures help my memory.", lv: "A2" },
  { w: "context", p: "/ˈkɒntekst/", zh: "语境", ex: "Learn words in context.", lv: "A2" },
  { w: "pronunciation", p: "/prəˌnʌnsiˈeɪʃən/", zh: "发音", ex: "Your pronunciation is clear.", lv: "A2" },
  { w: "fluency", p: "/ˈfluːənsi/", zh: "流利度", ex: "Fluency comes with practice.", lv: "A2" },
  { w: "accurate", p: "/ˈækjərət/", zh: "准确的", ex: "Try to be accurate first.", lv: "B1" },
  { w: "mistake", p: "/mɪˈsteɪk/", zh: "错误", ex: "Every mistake is a chance to learn.", lv: "A1" },
  { w: "confident", p: "/ˈkɒnfɪdənt/", zh: "自信的", ex: "She sounds confident in class.", lv: "A2" },
  { w: "progress", p: "/ˈprəʊɡres/", zh: "进步", ex: "Small steps make progress.", lv: "A1" },
  { w: "conjunction", p: "/kənˈdʒʌŋkʃən/", zh: "连词", ex: "Because is a conjunction.", lv: "B1" },
  { w: "similar", p: "/ˈsɪmələ(r)/", zh: "相似的", ex: "These two words are similar.", lv: "A2" },
  { w: "instead", p: "/ɪnˈsted/", zh: "代替；而不是", ex: "Use a noun instead.", lv: "A2" },
  { w: "repeat", p: "/rɪˈpiːt/", zh: "重复", ex: "Repeat after me.", lv: "A1" },
  { w: "focus", p: "/ˈfəʊkəs/", zh: "专注", ex: "Focus on high-frequency words.", lv: "A2" },
  { w: "challenge", p: "/ˈtʃælɪndʒ/", zh: "挑战", ex: "Take a 7-day word challenge.", lv: "B1" },
  { w: "essential", p: "/ɪˈsenʃl/", zh: "必需的", ex: "Sleep is essential for memory.", lv: "B1" },
  { w: "strategy", p: "/ˈstrætədʒi/", zh: "策略", ex: "Find your own study strategy.", lv: "B1" },
];

const state = {
  todayTries: 0,
  todayCorrect: 0,
  currentQuizWord: null,
  wrongBook: JSON.parse(localStorage.getItem("wrongBook") || "[]"),
};

function speak(text, rate = 1) {
  if (!window.speechSynthesis) {
    alert("当前浏览器不支持语音播放");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

function saveWrongBook() {
  localStorage.setItem("wrongBook", JSON.stringify(state.wrongBook));
}

function addWrong(wordObj) {
  if (!state.wrongBook.find(x => x.w === wordObj.w)) {
    state.wrongBook.push(wordObj);
    saveWrongBook();
  }
  renderWrongBook();
  renderStats();
}

function removeWrong(word) {
  state.wrongBook = state.wrongBook.filter(x => x.w !== word);
  saveWrongBook();
  renderWrongBook();
  renderStats();
}

function renderWords() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const lv = document.getElementById("levelFilter").value;
  const list = words.filter(x => {
    const hit = x.w.toLowerCase().includes(q) || x.zh.includes(q);
    const lvHit = lv === "all" || x.lv === lv;
    return hit && lvHit;
  });

  const box = document.getElementById("wordList");
  box.innerHTML = list.map(x => `
    <div class="word-item">
      <div class="word-top">
        <div><strong>${x.w}</strong> <span class="muted">${x.p}</span></div>
        <span class="tag">${x.lv}</span>
      </div>
      <div>${x.zh}</div>
      <div class="muted">例句：${x.ex}</div>
      <div class="word-actions">
        <button class="secondary" onclick="speak('${x.w}',1)">🔊 发音</button>
        <button class="secondary" onclick="speak('${x.w}',0.72)">🐢 慢速</button>
        <button class="secondary" onclick="addWrongByWord('${x.w}')">加入错词本</button>
      </div>
    </div>
  `).join("");
}

function addWrongByWord(word) {
  const found = words.find(x => x.w === word);
  if (found) addWrong(found);
}
window.speak = speak;
window.addWrongByWord = addWrongByWord;

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextQuiz() {
  const src = state.wrongBook.length >= 3 ? state.wrongBook : words;
  state.currentQuizWord = randomFrom(src);
  document.getElementById("spellInput").value = "";
  document.getElementById("quizPrompt").textContent = `释义：${state.currentQuizWord.zh} ｜ 例句：${state.currentQuizWord.ex}`;
  document.getElementById("quizResult").textContent = "Ready.";
}

function checkQuiz() {
  if (!state.currentQuizWord) {
    nextQuiz();
    return;
  }
  const input = document.getElementById("spellInput").value.trim().toLowerCase();
  const ans = state.currentQuizWord.w.toLowerCase();

  state.todayTries += 1;

  if (input === ans) {
    state.todayCorrect += 1;
    document.getElementById("quizResult").innerHTML = `<span class="ok">✅ 正确！</span> ${state.currentQuizWord.w}`;
    removeWrong(state.currentQuizWord.w);
  } else {
    document.getElementById("quizResult").innerHTML = `<span class="bad">❌ 错误</span> 正确答案：<b>${state.currentQuizWord.w}</b>`;
    addWrong(state.currentQuizWord);
  }
  renderStats();
}

function renderStats() {
  const acc = state.todayTries ? Math.round((state.todayCorrect / state.todayTries) * 100) : 0;
  document.getElementById("statsBox").innerHTML = `
    <div class="stat"><div class="muted">今日作答</div><div><b>${state.todayTries}</b></div></div>
    <div class="stat"><div class="muted">答对数</div><div class="ok"><b>${state.todayCorrect}</b></div></div>
    <div class="stat"><div class="muted">正确率</div><div><b>${acc}%</b></div></div>
    <div class="stat"><div class="muted">错词本</div><div class="warn"><b>${state.wrongBook.length}</b></div></div>
  `;
}

function renderWrongBook() {
  const box = document.getElementById("wrongList");
  if (!state.wrongBook.length) {
    box.innerHTML = `<div class="muted">暂无错词，继续保持 👏</div>`;
    return;
  }
  box.innerHTML = state.wrongBook.map(x => `
    <div class="wrong-item">
      <b>${x.w}</b> <span class="muted">${x.p}</span> · ${x.zh}
      <div class="actions" style="margin-top:6px">
        <button class="secondary" onclick="speak('${x.w}',1)">🔊</button>
        <button class="secondary" onclick="speak('${x.w}',0.72)">🐢</button>
        <button class="secondary" onclick="removeWrongByWord('${x.w}')">移除</button>
      </div>
    </div>
  `).join("");
}

function removeWrongByWord(word) {
  removeWrong(word);
}
window.removeWrongByWord = removeWrongByWord;

document.getElementById("searchInput").addEventListener("input", renderWords);
document.getElementById("levelFilter").addEventListener("change", renderWords);
document.getElementById("checkBtn").addEventListener("click", checkQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuiz);
document.getElementById("speakQuizBtn").addEventListener("click", () => state.currentQuizWord && speak(state.currentQuizWord.w, 1));
document.getElementById("speakQuizSlowBtn").addEventListener("click", () => state.currentQuizWord && speak(state.currentQuizWord.w, 0.72));

renderWords();
renderStats();
renderWrongBook();
nextQuiz();

const leftClauses = [
  "I want to improve my English",
  "She practices speaking every day",
  "We can learn faster",
  "He was tired",
  "They kept trying",
];

const conjunctions = ["because", "although", "so", "if", "when", "while"];

const rightClauses = [
  "she still joined the discussion",
  "we use short daily sessions",
  "he continued reading aloud",
  "you review new words at night",
  "they made clear progress",
  "it feels more natural",
];

const vocab = [
  { word: "conjunction", phonetic: "/kənˈdʒʌŋkʃən/", meaning: "连词" },
  { word: "practice", phonetic: "/ˈpræktɪs/", meaning: "练习" },
  { word: "pronunciation", phonetic: "/prəˌnʌnsiˈeɪʃən/", meaning: "发音" },
  { word: "fluency", phonetic: "/ˈfluːənsi/", meaning: "流利度" },
  { word: "sentence", phonetic: "/ˈsentəns/", meaning: "句子" },
  { word: "review", phonetic: "/rɪˈvjuː/", meaning: "复习" },
  { word: "confidence", phonetic: "/ˈkɒnfɪdəns/", meaning: "自信" },
  { word: "improve", phonetic: "/ɪmˈpruːv/", meaning: "提高" },
];

const quizBank = [
  { q: "Choose the best conjunction: I was tired, ___ I finished my homework.", options: ["but", "because", "if"], ans: "but" },
  { q: "Which word means '发音' ?", options: ["pronunciation", "fluency", "sentence"], ans: "pronunciation" },
  { q: "Fill in: If you practice daily, you ___ improve.", options: ["will", "were", "did"], ans: "will" },
  { q: "Choose the better sentence:", options: ["She practice every day.", "She practices every day.", "She practicing every day."], ans: "She practices every day." },
  { q: "Which word is closest to 'review'?", options: ["forget", "revisit", "avoid"], ans: "revisit" },
  { q: "Choose the best conjunction: ___ it rains, we will stay home.", options: ["If", "Because", "Although"], ans: "If" },
  { q: "'Fluency' means:", options: ["speed only", "smooth and accurate speaking", "loud speaking"], ans: "smooth and accurate speaking" },
];

function fillSelect(id, list) {
  const el = document.getElementById(id);
  el.innerHTML = list.map(v => `<option value="${v}">${v}</option>`).join("");
}

function speak(text, rate = 1) {
  if (!window.speechSynthesis) {
    alert("当前浏览器不支持语音播放（SpeechSynthesis）。");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

function buildSentence() {
  const left = document.getElementById("leftClause").value;
  const conj = document.getElementById("conjunction").value;
  const right = document.getElementById("rightClause").value;
  let sentence = `${left} ${conj} ${right}.`;
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  document.getElementById("sentenceResult").textContent = sentence;
}

function renderVocab() {
  const box = document.getElementById("vocabList");
  box.innerHTML = vocab.map(v => `
    <div class="vocab-item">
      <div class="vocab-main">
        <b>${v.word}</b> <small>${v.phonetic}</small><br/>
        <small>${v.meaning}</small>
      </div>
      <div class="vocab-actions">
        <button class="secondary" onclick="speak('${v.word}', 1)">🔊</button>
        <button class="secondary" onclick="speak('${v.word}', 0.7)">🐢</button>
      </div>
    </div>
  `).join("");
}

function pickRandom(arr, n) {
  const a = [...arr];
  const out = [];
  while (out.length < n && a.length) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

let currentQuiz = [];

function renderQuiz() {
  currentQuiz = pickRandom(quizBank, 5);
  const box = document.getElementById("quizBox");
  box.innerHTML = currentQuiz.map((item, i) => `
    <div class="quiz-q">
      <div><strong>Q${i + 1}.</strong> ${item.q}</div>
      ${item.options.map(op => `
        <label>
          <input type="radio" name="q${i}" value="${op}"> ${op}
        </label>
      `).join("")}
    </div>
  `).join("");
  document.getElementById("quizResult").textContent = "Ready.";
}

function gradeQuiz() {
  let score = 0;
  currentQuiz.forEach((q, i) => {
    const picked = document.querySelector(`input[name="q${i}"]:checked`)?.value;
    if (picked === q.ans) score += 1;
  });
  document.getElementById("quizResult").textContent = `Score: ${score}/5 ${score >= 4 ? "🎉 Great!" : "💪 Keep going!"}`;
}

fillSelect("leftClause", leftClauses);
fillSelect("conjunction", conjunctions);
fillSelect("rightClause", rightClauses);
buildSentence();
renderVocab();
renderQuiz();

document.getElementById("buildBtn").addEventListener("click", buildSentence);
document.getElementById("speakSentenceBtn").addEventListener("click", () => speak(document.getElementById("sentenceResult").textContent, 1));
document.getElementById("speakSentenceSlowBtn").addEventListener("click", () => speak(document.getElementById("sentenceResult").textContent, 0.75));
document.getElementById("submitQuizBtn").addEventListener("click", gradeQuiz);
document.getElementById("regenQuizBtn").addEventListener("click", renderQuiz);

window.speak = speak;

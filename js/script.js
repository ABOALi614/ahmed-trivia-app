/**
 * ====================================================================
 * MAIN APP LOGIC — "هل تعرف أحمد؟"
 * ====================================================================
 * Everything here is plain vanilla JS (no framework) so it's trivial
 * to wrap in Electron, Tauri, or any static-site host later.
 *
 * File map:
 *  - data.js      → questions, evaluation tiers, timing config
 *  - audio.js     → correct/wrong/tick/lifeline sounds
 *  - confetti.js  → win-screen confetti burst
 *  - script.js    → you are here: state + rendering + events
 * ====================================================================
 */

import { questions, evaluationTiers, SECONDS_PER_QUESTION } from "./data.js";
import { playCorrect, playWrong, playTick, playLifeline } from "./audio.js";
import { launchConfetti } from "./confetti.js";
import { getDeviceInfo } from "./device.js";
import { saveGameResult } from "./firebase.js";

// ---------------------------------------------------------------------------
// DOM REFERENCES
// ---------------------------------------------------------------------------
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  end: document.getElementById("screen-end"),
};

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const lifelineBtn = document.getElementById("lifeline-btn");

const nameInput = document.getElementById("player-name-input");
const nameError = document.getElementById("name-field-error");

const progressFill = document.getElementById("progress-fill");
const questionCounterEl = document.getElementById("question-counter");
const scoreCounterEl = document.getElementById("score-counter");

const questionCard = document.getElementById("question-card");
const questionTextEl = document.getElementById("question-text");
const optionsGrid = document.getElementById("options-grid");

const timerRing = document.getElementById("timer-ring");
const timerValueEl = document.getElementById("timer-value");

const resultEmojiEl = document.getElementById("result-emoji");
const resultScoreEl = document.getElementById("result-score");
const resultMessageEl = document.getElementById("result-message");

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
let state = {
  currentIndex: 0,
  score: 0,
  lifelineUsed: false,
  timeLeft: SECONDS_PER_QUESTION,
  timerId: null,
  isAnswered: false, // prevents double-clicks / clicks after timeout
  playerName: "",
};

function resetState() {
  state = {
    currentIndex: 0,
    score: 0,
    lifelineUsed: false,
    timeLeft: SECONDS_PER_QUESTION,
    timerId: null,
    isAnswered: false,
    playerName: state.playerName, // carry the name across a restart
  };
  lifelineBtn.disabled = false;
  lifelineBtn.classList.remove("lifeline-btn--used");
}

// ---------------------------------------------------------------------------
// SCREEN NAVIGATION
// ---------------------------------------------------------------------------
function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

// ---------------------------------------------------------------------------
// GAME FLOW
// ---------------------------------------------------------------------------
function startQuiz() {
  resetState();
  showScreen("quiz");
  loadQuestion(0);
}

/**
 * Validates the name field before allowing the game to start.
 * On empty input: shakes the field, reveals the inline error message,
 * and focuses the input — no blocking/disabling, just gentle feedback.
 */
function handleStartClick() {
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.classList.remove("name-field--error");
    nameError.classList.remove("name-field__error--visible");
    // restart the shake animation even if it just played
    void nameInput.offsetWidth;
    nameInput.classList.add("name-field--error");
    nameError.classList.add("name-field__error--visible");
    nameInput.focus();
    return;
  }

  state.playerName = name;
  startQuiz();
}

// Clear the error state as soon as the user starts typing again
nameInput.addEventListener("input", () => {
  nameInput.classList.remove("name-field--error");
  nameError.classList.remove("name-field__error--visible");
});

// Allow pressing Enter inside the name field to start the game
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleStartClick();
});

function loadQuestion(index) {
  state.currentIndex = index;
  state.isAnswered = false;
  state.timeLeft = SECONDS_PER_QUESTION;

  const q = questions[index];

  // --- header / progress ---
  questionCounterEl.textContent = `سؤال ${index + 1} من ${questions.length}`;
  scoreCounterEl.textContent = `النقاط: ${state.score}`;
  updateProgressBar();

  // --- question text (fade/slide-in handled via CSS animation class) ---
  questionTextEl.textContent = q.question;
  questionCard.classList.remove("slide-up");
  // restart animation on every question
  requestAnimationFrame(() => questionCard.classList.add("slide-up"));

  // --- render options ---
  optionsGrid.innerHTML = "";
  q.options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => selectAnswer(optionText, btn));
    optionsGrid.appendChild(btn);
  });

  startTimer();
}

// ---------------------------------------------------------------------------
// TIMER
// ---------------------------------------------------------------------------
function startTimer() {
  stopTimer();
  updateTimerRing();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerRing();

    if (state.timeLeft <= 3 && state.timeLeft > 0) {
      playTick();
    }

    if (state.timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerRing() {
  timerValueEl.textContent = state.timeLeft;

  // Conic-gradient fill amount, 0 -> 1
  const progress = state.timeLeft / SECONDS_PER_QUESTION;
  timerRing.style.setProperty("--progress", progress);

  // Color shifts from cyan -> purple -> red as time runs out
  timerRing.classList.remove("timer-ring--warning", "timer-ring--danger");
  if (state.timeLeft <= 3) {
    timerRing.classList.add("timer-ring--danger");
  } else if (state.timeLeft <= 6) {
    timerRing.classList.add("timer-ring--warning");
  }
}

function handleTimeout() {
  if (state.isAnswered) return;
  state.isAnswered = true;

  const q = questions[state.currentIndex];
  highlightOptions(null, q.answer); // no option was clicked
  playWrong();
  triggerShake();

  advanceAfterDelay();
}

// ---------------------------------------------------------------------------
// ANSWER HANDLING
// ---------------------------------------------------------------------------
function selectAnswer(selectedText, btnEl) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  stopTimer();

  const q = questions[state.currentIndex];
  const isCorrect = selectedText === q.answer;

  if (isCorrect) {
    state.score += 1;
    scoreCounterEl.textContent = `النقاط: ${state.score}`;
    btnEl.classList.add("option-btn--correct");
    playCorrect();
  } else {
    btnEl.classList.add("option-btn--wrong");
    playWrong();
    triggerShake();
  }

  highlightOptions(selectedText, q.answer);
  advanceAfterDelay();
}

/**
 * Adds correct/wrong styling to all options and disables further clicks,
 * regardless of whether the user answered or timed out.
 */
function highlightOptions(selectedText, correctText) {
  const buttons = Array.from(optionsGrid.children);
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correctText) {
      btn.classList.add("option-btn--correct");
    } else if (btn.textContent === selectedText) {
      btn.classList.add("option-btn--wrong");
    }
  });
}

function triggerShake() {
  questionCard.classList.remove("shake");
  // Re-trigger the CSS animation even if it's already applied
  void questionCard.offsetWidth;
  questionCard.classList.add("shake");
}

function advanceAfterDelay(delay = 1200) {
  setTimeout(() => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex < questions.length) {
      loadQuestion(nextIndex);
    } else {
      endGame();
    }
  }, delay);
}

// ---------------------------------------------------------------------------
// PROGRESS BAR
// ---------------------------------------------------------------------------
function updateProgressBar() {
  const percent = (state.currentIndex / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
}

// ---------------------------------------------------------------------------
// LIFELINE: 50/50
// ---------------------------------------------------------------------------
lifelineBtn.addEventListener("click", useLifeline);

function useLifeline() {
  if (state.lifelineUsed || state.isAnswered) return;

  const q = questions[state.currentIndex];
  const wrongOptions = Array.from(optionsGrid.children).filter(
    (btn) => btn.textContent !== q.answer
  );

  // Shuffle and hide 2 of the wrong options, leaving 1 wrong + 1 correct
  const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
  shuffled.slice(0, 2).forEach((btn) => {
    btn.classList.add("option-btn--hidden");
    btn.disabled = true;
  });

  state.lifelineUsed = true;
  lifelineBtn.disabled = true;
  lifelineBtn.classList.add("lifeline-btn--used");
  playLifeline();
}

// ---------------------------------------------------------------------------
// END SCREEN / EVALUATION
// ---------------------------------------------------------------------------
function endGame() {
  // Final progress bar fill (all questions done)
  progressFill.style.width = "100%";

  const tier = evaluationTiers.find(
    (t) => state.score >= t.min && state.score <= t.max
  );

  resultEmojiEl.textContent = tier.emoji;
  resultScoreEl.textContent = `${state.score} / ${questions.length}`;
  resultMessageEl.textContent = tier.message;

  showScreen("end");

  if (tier.confetti) {
    launchConfetti();
  }

  // Silently persist the result — failures never interrupt the end screen
  saveGameResult({
    playerName: state.playerName,
    finalScore: `${state.score} / ${questions.length}`,
    deviceInfo: getDeviceInfo().summary,
  });
}

// ---------------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------------
startBtn.addEventListener("click", handleStartClick);
restartBtn.addEventListener("click", startQuiz);

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
showScreen("start");

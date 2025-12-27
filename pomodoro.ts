const startEl = document.getElementById("start") as HTMLButtonElement;
const stopEl = document.getElementById("stop") as HTMLButtonElement;
const resetEl = document.getElementById("reset") as HTMLButtonElement;
const timerEl = document.getElementById("timer") as HTMLDivElement;
const statusEl = document.querySelector(".top-plus .round-label") as HTMLDivElement;

// audio
const clickSound = new Audio("select.mp3");
function playClickSound(): void {
  clickSound.currentTime = 0;
  void clickSound.play();
}

const nextRoundSound = new Audio("nextround.mp3");
function playNextRoundSoundWithFade(): void {
  nextRoundSound.volume = 1;
  nextRoundSound.currentTime = 0;
  void nextRoundSound.play();

  window.setTimeout(() => {
    const fadeDuration = 1000;
    const fadeSteps = 10;
    const stepTime = fadeDuration / fadeSteps;
    let step = 0;

    const fade = window.setInterval(() => {
      step += 1;
      nextRoundSound.volume = Math.max(0, 1 - step / fadeSteps);
      if (step >= fadeSteps) {
        window.clearInterval(fade);
        nextRoundSound.pause();
        nextRoundSound.currentTime = 0;
        nextRoundSound.volume = 1;
      }
    }, stepTime);
  }, 450);
}

// helpers
function two(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// constants
const WORK_TIME = 1500;   // 25 min
const SHORT_BREAK = 300; // 5 min
const LONG_BREAK = 900;  // 15 min

// state
let intervalId: number | null = null;
let round = 1;
let isWork = true;
let timeLeft = WORK_TIME;

// ui
function updateTimer(): void {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${two(minutes)} : ${two(seconds)}`;
}

function updateStatus(): void {
  if (isWork) {
    statusEl.textContent = `Round ${round}`;
    statusEl.classList.remove("break-label", "long-break-label");
    timerEl.classList.remove("break-mode", "long-break-mode");
    return;
  }

  if (round < 4) {
    statusEl.textContent = "Short break time";
    statusEl.classList.add("break-label");
    statusEl.classList.remove("long-break-label");
    timerEl.classList.add("break-mode");
    timerEl.classList.remove("long-break-mode");
    return;
  }

  statusEl.textContent = "Long break time";
  statusEl.classList.add("long-break-label");
  statusEl.classList.remove("break-label");
  timerEl.classList.add("long-break-mode");
  timerEl.classList.remove("break-mode");
}

// timer logic
function tick(): void {
  if (timeLeft > 0) {
    timeLeft -= 1;
    updateTimer();
    return;
  }

  stopTimer();
  playNextRoundSoundWithFade();

  if (isWork) {
    isWork = false;
    timeLeft = round < 4 ? SHORT_BREAK : LONG_BREAK;
  } else {
    round = round < 4 ? round + 1 : 1;
    isWork = true;
    timeLeft = WORK_TIME;
  }

  updateStatus();
  updateTimer();
  startTimer();
}

function startTimer(): void {
  if (intervalId !== null) return;
  intervalId = window.setInterval(tick, 1000);
}

function stopTimer(): void {
  if (intervalId === null) return;
  window.clearInterval(intervalId);
  intervalId = null;
}

function resetTimer(): void {
  stopTimer();
  round = 1;
  isWork = true;
  timeLeft = WORK_TIME;
  updateStatus();
  updateTimer();
}

// init
updateStatus();
updateTimer();

// controls
startEl.addEventListener("click", () => {
  playClickSound();
  startTimer();
});

stopEl.addEventListener("click", () => {
  playClickSound();
  stopTimer();
});

resetEl.addEventListener("click", () => {
  playClickSound();
  resetTimer();
});

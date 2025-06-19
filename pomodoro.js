const startEl = document.getElementById("start");
const stopEl = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const timerEl = document.getElementById("timer");
const statusEl = document.querySelector(".top-plus .round-label");

// Audio for button clicks
const clickSound = new Audio('select.mp3');
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// next round audio fade outs (THIS WAS AI)
const nextRoundSound = new Audio('nextround.mp3');
function playNextRoundSoundWithFade() {
    nextRoundSound.volume = 1;
    nextRoundSound.currentTime = 0;
    nextRoundSound.play();

    setTimeout(() => {
        const fadeDuration = 1000; 
        const fadeSteps = 10;
        const fadeStepTime = fadeDuration / fadeSteps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            nextRoundSound.volume = Math.max(0, 1 - currentStep / fadeSteps);
            if (currentStep >= fadeSteps) {
                clearInterval(fadeInterval);
                nextRoundSound.pause();
                nextRoundSound.currentTime = 0;
                nextRoundSound.volume = 1; 
            }
        }, fadeStepTime);
    }, 450); // fades after 450 ms
}

const WORK_TIME = 1500;      // 25 min
const SHORT_BREAK = 300;     // 5 min
const LONG_BREAK = 900;      // 15 min

let interval = null;
let round = 1;               // 4 rounds total
let isWork = true;           
let timeLeft = WORK_TIME;

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.innerHTML = `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
}

function updateStatus() {
    if (isWork) {
        statusEl.textContent = `Round ${round}`;
        statusEl.classList.remove('break-label', 'long-break-label');
        timerEl.classList.remove('break-mode', 'long-break-mode');
    } else if (round < 4) {
        statusEl.textContent = "Short break time";
        statusEl.classList.add('break-label');
        statusEl.classList.remove('long-break-label');
        timerEl.classList.add('break-mode');
        timerEl.classList.remove('long-break-mode');
    } else {
        statusEl.textContent = "Long break time";
        statusEl.classList.add('long-break-label');
        statusEl.classList.remove('break-label');
        timerEl.classList.add('long-break-mode');
        timerEl.classList.remove('break-mode');
    }
}

function startTimer() {
    if (interval) return; // prevent multiple intervals

    interval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(interval);
            interval = null;

            playNextRoundSoundWithFade();

            // transition between work and break
            if (isWork) {
                if (round < 4) {
                    isWork = false;
                    timeLeft = SHORT_BREAK;
                } else {
                    isWork = false;
                    timeLeft = LONG_BREAK;
                }
            } else {
                if (round < 4) {
                    round++;
                    isWork = true;
                    timeLeft = WORK_TIME;
                } else {
                    round = 1;
                    isWork = true;
                    timeLeft = WORK_TIME;
                }
            }
            updateStatus();
            updateTimer();
            startTimer(); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    round = 1;
    isWork = true;
    timeLeft = WORK_TIME;
    updateStatus();
    updateTimer();
}

updateStatus();
updateTimer();

// Play sound and run timer logic on button click
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

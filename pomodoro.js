var startEl = document.getElementById("start");
var stopEl = document.getElementById("stop");
var resetEl = document.getElementById("reset");
var timerEl = document.getElementById("timer");
var statusEl = document.querySelector(".top-plus .round-label");
// audio
var clickSound = new Audio("select.mp3");
function playClickSound() {
    clickSound.currentTime = 0;
    void clickSound.play();
}
var nextRoundSound = new Audio("nextround.mp3");
function playNextRoundSoundWithFade() {
    nextRoundSound.volume = 1;
    nextRoundSound.currentTime = 0;
    void nextRoundSound.play();
    window.setTimeout(function () {
        var fadeDurationMs = 1000;
        var fadeSteps = 10;
        var fadeStepTime = fadeDurationMs / fadeSteps;
        var currentStep = 0;
        var fadeInterval = window.setInterval(function () {
            currentStep += 1;
            nextRoundSound.volume = Math.max(0, 1 - currentStep / fadeSteps);
            if (currentStep >= fadeSteps) {
                window.clearInterval(fadeInterval);
                nextRoundSound.pause();
                nextRoundSound.currentTime = 0;
                nextRoundSound.volume = 1;
            }
        }, fadeStepTime);
    }, 450);
}
var WORK_TIME = 1500; // 25 min
var SHORT_BREAK = 300; // 5 min
var LONG_BREAK = 900; // 15 min
var intervalId = null;
var round = 1;
var isWork = true;
var timeLeft = WORK_TIME;
function updateTimer() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    timerEl.textContent = "".concat(minutes.toString().padStart(2, "0"), " : ").concat(seconds.toString().padStart(2, "0"));
}
function updateStatus() {
    if (isWork) {
        statusEl.textContent = "Round ".concat(round);
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
function tick() {
    if (timeLeft > 0) {
        timeLeft -= 1;
        updateTimer();
        return;
    }
    // phase ended
    stopTimer();
    playNextRoundSoundWithFade();
    // transition v
    if (isWork) {
        isWork = false;
        timeLeft = round < 4 ? SHORT_BREAK : LONG_BREAK;
    }
    else {
        if (round < 4) {
            round += 1;
        }
        else {
            round = 1;
        }
        isWork = true;
        timeLeft = WORK_TIME;
    }
    updateStatus();
    updateTimer();
    startTimer();
}
function startTimer() {
    if (intervalId !== null)
        return;
    intervalId = window.setInterval(tick, 1000);
}
function stopTimer() {
    if (intervalId === null)
        return;
    window.clearInterval(intervalId);
    intervalId = null;
}
function resetTimer() {
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
startEl.addEventListener("click", function () {
    playClickSound();
    startTimer();
});
stopEl.addEventListener("click", function () {
    playClickSound();
    stopTimer();
});
resetEl.addEventListener("click", function () {
    playClickSound();
    resetTimer();
});

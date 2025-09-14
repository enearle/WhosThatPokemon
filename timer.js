let timerInterval;
let startTime;
let elapsedTime = 0;
let timerRunning = false;

// Code necessary for the timer

function startTimer() {
    if (!timerRunning) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        timerRunning = true;
        const timeElement = document.getElementById("time");
        timeElement.textContent = "00:00";
    }
}

function stopTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        timerRunning = false;
    }
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timeElement = document.getElementById("time");

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

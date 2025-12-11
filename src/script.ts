// 2. Set State variables
let isRunning: boolean = false;
let intervalId: number | undefined = undefined;
let totalSeconds: number = 0;

// 3. Grab DOM elements
const hoursInput = document.getElementById("hoursInput") as HTMLInputElement;
const minutesInput = document.getElementById("minutesInput") as HTMLInputElement;
const secondsInput = document.getElementById("secondsInput") as HTMLInputElement;
const controlButton = document.getElementById("controlButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const display = document.getElementById("display") as HTMLSpanElement;

// CRITICAL NULL CHECK: If any DOM element is missing, stop the script
if (!hoursInput || !minutesInput || !secondsInput || !controlButton || !resetButton || !display) {
  throw new Error("One or more html elements are missing.");
}

// 4. Attach event listeners
hoursInput.addEventListener("blur", () => padInput(hoursInput));
minutesInput.addEventListener("blur", () => padInput(minutesInput));
secondsInput.addEventListener("blur", () => padInput(secondsInput));
controlButton.addEventListener("click", handleControlClick);
resetButton.addEventListener("click", handleResetClick);

// 5. Handler functions

function padInput(inputElement: HTMLInputElement): void {
  let num = parseInt(inputElement.value, 10);

  const min = parseInt(inputElement.min) || 0;
  const max = parseInt(inputElement.max) || Infinity;

  if (isNaN(num) || num < min) {
    num = min;
  } else if (num > max) {
    num = max;
  }

  inputElement.value = addZero(num);
}

function handleControlClick(): void {
  // START THE TIMER
  if (!isRunning) {
    // (i) CALCULATE TOTALSECONDS (Only if starting fresh)
    if (totalSeconds == 0) {
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;

      totalSeconds = hours * 3600 + minutes * 60 + seconds;

      // Prevent starting if totalSeconds is 0
      if (totalSeconds === 0) {
        controlButton.textContent = "Start";
        return;
      }
    }

    // (ii) START ENGINE & STATE UPDATE
    isRunning = true;
    controlButton.textContent = "Pause";
    // If the timer was paused, the time is already updated. If it's starting,
    // call tick() immediately to avoid a 1-second delay before the first update.
    updateDisplay();
    intervalId = setInterval(tick, 1000);

    // PAUSE THE TIMER
  } else {
    // 1. Stop engine & state update
    isRunning = false;
    clearInterval(intervalId);
    controlButton.textContent = "Resume";
  }
}

function handleResetClick(): void {
  // 1. Stop engine & state
  isRunning = false;
  clearInterval(intervalId);
  intervalId = undefined;
  totalSeconds = 0;

  // 2. Visual reset
  display.textContent = "00:00:00";
  controlButton.textContent = "Start";
  hoursInput.value = "00";
  minutesInput.value = "00";
  secondsInput.value = "00";
}

// 6. Supporting functions

// Callback fxn for setInterval()
function tick() {
  totalSeconds--;
  updateDisplay();

  if (totalSeconds <= 0) {
    isRunning = false;
    clearInterval(intervalId);
    intervalId = undefined;
    totalSeconds = 0;
    controlButton.textContent = "Start";
  }
}

// View function
function updateDisplay(): void {
  if (totalSeconds <= 0) {
    display.textContent = "00:00:00";
    return;
  }

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  display.textContent = `${addZero(h)}:${addZero(m)}:${addZero(s)}`;
}

// Utility function used by view function
function addZero(num: number): string {
  return num < 10 ? "0" + num : String(num);
}

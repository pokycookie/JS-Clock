const dateSpan = document.querySelector(".date_span");
const timeSpan = document.querySelector(".time_span");
const modeButtons = document.querySelectorAll(".mode_btn");
const modeForms = document.querySelectorAll(".mode_form");
const timerInputs = document.querySelectorAll(".timer_input");
const timerBtn = document.querySelectorAll(".timer_btn");
const timerInputArea = document.querySelector(".timer_input_area");
const stopwatchBtns = document.querySelectorAll(".stopwatch_btn");
const laptimeArea = document.querySelector(".laptime_area");
const modalArea = document.querySelector(".modal_area");
const modalWindow = document.querySelector(".modal_window");

let GET_CURRENT_TIME = setInterval(getTime, 1000);
let STOPWATCH_INTERVAL;
let TIMER_INTERVAL;

let TIMER_HOUR = 0;
let TIMER_MIN = 0;
let TIMER_SEC = 0;
let TIMER_BTN = 2;
let TIMER_TIME = 0;

let STOPWATCH_BTN = 3;
let STOPWATCH_TIME = 0;
let STOPWATCH_LAP = 1;
let LAPTIME_LIST = [];

let MODE = 0; // 0: Clock Mode, 1: Timer Mode, 2: Stopwatch Mode

function getTime() {
  const now = new Date();
  const years = now.getFullYear();
  const months = now.getMonth() + 1;
  const dates = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  if (MODE === 0) {
    paintClock(years, months, dates, hours, minutes, seconds);
  }
}

function paintClock(years, months, dates, hours, minutes, seconds) {
  dateSpan.innerText = `${years}.${months < 10 ? `0${months}` : months}.${dates < 10 ? `0${dates}` : dates}`;
  timeSpan.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function stopwatchStart() {
  if (STOPWATCH_BTN === 3) {
    timeSpan.innerText = "00:00:00";
  } else {
    const min = parseInt(STOPWATCH_TIME / 6000);
    const sec = parseInt((STOPWATCH_TIME % 6000) / 100);
    const milisec = (STOPWATCH_TIME % 6000) % 100;
    STOPWATCH_TIME += 1;
    if (MODE === 2) {
      timeSpan.innerText = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}:${milisec < 10 ? `0${milisec}` : milisec}`;
    }
  }
}

function paintLaptime() {
  console.log(STOPWATCH_TIME);
  const lapTime = document.createElement("li");
  const min = parseInt(STOPWATCH_TIME / 6000);
  const sec = parseInt((STOPWATCH_TIME % 6000) / 100);
  const milisec = (STOPWATCH_TIME % 6000) % 100;
  lapTime.innerText = `${STOPWATCH_LAP < 10 ? `0${STOPWATCH_LAP}` : STOPWATCH_LAP} | ${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}:${milisec < 10 ? `0${milisec}` : milisec}`;
  lapTime.classList.add("laptime_li");
  laptimeArea.appendChild(lapTime);
  laptimeArea.scrollTop = laptimeArea.scrollHeight;
  STOPWATCH_LAP += 1;
}

function removeLap() {
  const laptimeLis = document.querySelectorAll(".laptime_li");
  laptimeLis.forEach((element) => {
    element.remove();
  });
  STOPWATCH_LAP = 1;
}

function stopwatch(btn) {
  //btn 0: Start, 1: Pause, 2: LapTime, 3:Reset
  if (btn === 0 && STOPWATCH_BTN !== 0) {
    STOPWATCH_INTERVAL = setInterval(stopwatchStart, 10);
    STOPWATCH_BTN = 0;
    console.log("stopwatch_btn:", btn);
  } else if (btn === 1 && STOPWATCH_BTN !== 1) {
    clearInterval(STOPWATCH_INTERVAL);
    STOPWATCH_BTN = 1;
    console.log("stopwatch_btn:", btn);
  } else if (btn === 2) {
    paintLaptime();
  } else if (btn === 3) {
    clearInterval(STOPWATCH_INTERVAL);
    STOPWATCH_TIME = 0;
    STOPWATCH_BTN = 3;
    timeSpan.innerText = "00:00:00";
    removeLap();
    console.log("stopwatch_btn:", btn);
  }
}

function timerStart() {
  if (TIMER_TIME === 0) {
    //Timer Time UP
    TIMER_BTN = 2;
    clearInterval(TIMER_INTERVAL);
    getTimerTime();
    if (timerInputArea.classList.contains("started")) {
      timerInputArea.classList.remove("started");
    }
    //Modal Window Popup
    const modalContents = document.createElement("span");
    modalContents.innerText = "TIME'S UP";
    modalContents.classList.add("modal_contents");
    modalWindow.appendChild(modalContents);
    modalArea.classList.add("popup");
  } else {
    TIMER_TIME -= 1;
    const hour = parseInt(TIMER_TIME / (60 * 60));
    const min = parseInt((TIMER_TIME % (60 * 60)) / 60);
    const sec = (TIMER_TIME % (60 * 60)) % 60;
    if (MODE === 1) {
      timeSpan.innerText = `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
    }
  }
}

function timer(btn) {
  //btn 1: start, 2: pause, 3: reset
  if (btn === 0 && TIMER_BTN !== 0) {
    TIMER_BTN = 0;
    TIMER_INTERVAL = setInterval(timerStart, 1000);
    timerInputArea.classList.add("started");
    console.log("Timer Start");
  } else if (btn === 1 && TIMER_BTN !== 1) {
    TIMER_BTN = 1;
    clearInterval(TIMER_INTERVAL);
    console.log("Timer Pause");
  } else if (btn === 2) {
    TIMER_BTN = 2;
    TIMER_TIME = 0;
    clearInterval(TIMER_INTERVAL);
    timeSpan.innerText = "00:00:00";
    if (timerInputArea.classList.contains("started")) {
      timerInputArea.classList.remove("started");
    }
    console.log("Timer Reset");
    timerInputs.forEach((element) => {
      element.value = 0;
    });
  }
}

function getTimerTime() {
  //Validate Value
  for (let i = 0; i < timerInputs.length; i++) {
    if (timerInputs[i].value < 0) {
      timerInputs[i].value = 0;
    } else if (i === 0 && timerInputs[i].value > 23) {
      timerInputs[i].value = 23;
    } else if (i !== 0 && timerInputs[i].value > 59) {
      timerInputs[i].value = 59;
    }
    if (timerInputs[i].validity.valid === false) {
      timerInputs[i].value = 0;
    } else if (timerInputs[i].value == "") {
      timerInputs[i].value = 0;
    }
  }

  //Get Timer Time
  TIMER_HOUR = timerInputs[0].valueAsNumber;
  TIMER_MIN = timerInputs[1].valueAsNumber;
  TIMER_SEC = timerInputs[2].valueAsNumber;
  TIMER_TIME = TIMER_HOUR * 60 * 60 + TIMER_MIN * 60 + TIMER_SEC; //unit = seconds

  //Paint timeSpan with Timer Time
  timeSpan.innerText = `${TIMER_HOUR < 10 ? `0${TIMER_HOUR}` : TIMER_HOUR}:${TIMER_MIN < 10 ? `0${TIMER_MIN}` : TIMER_MIN}:${TIMER_SEC < 10 ? `0${TIMER_SEC}` : TIMER_SEC}`;
}

function getEventLinstener() {
  //Mode Buttons
  for (let i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      changeMode(i);
    });
  }
  //Stopwatch Buttons
  for (let i = 0; i < stopwatchBtns.length; i++) {
    stopwatchBtns[i].addEventListener("click", function (event) {
      event.preventDefault();
      stopwatch(i);
    });
  }
  //Timer Inputs
  for (let i = 0; i < timerInputs.length; i++) {
    timerInputs[i].addEventListener("input", function (event) {
      event.preventDefault();
      getTimerTime();
    });
  }
  //Timer Buttons
  for (let i = 0; i < timerBtn.length; i++) {
    timerBtn[i].addEventListener("click", function (event) {
      event.preventDefault();
      timer(i);
    });
  }
  //Close Modal Window
  window.addEventListener("click", function (event) {
    if (event.target == modalArea) {
      if (modalArea.classList.contains("popup")) {
        modalArea.classList.remove("popup");
        const modalContents = document.querySelectorAll(".modal_contents");
        modalContents.forEach((element) => {
          element.remove();
        });
      }
    }
  });
}

function changeMode(i) {
  for (let j = 0; j < modeForms.length; j++) {
    if (modeForms[j].classList.contains("checked")) {
      modeForms[j].classList.remove("checked");
    }
  }
  modeForms[i].classList.add("checked");
  if (i === 0 && MODE !== 0) {
    MODE = 0;
    getTime();
    GET_CURRENT_TIME = setInterval(getTime, 1000);
    removeLap();
    console.log("MODE:", MODE);
  } else if (i === 1 && MODE !== 1) {
    MODE = 1;
    removeLap();
    if (TIMER_BTN === 0) {
      timerStart();
    } else {
      getTimerTime();
    }
    console.log("MODE:", MODE);
  } else if (i === 2 && MODE !== 2) {
    MODE = 2;
    removeLap();
    stopwatchStart();
    console.log("MODE:", MODE);
  }
}

function init() {
  getTime();
  getEventLinstener();
}

init();

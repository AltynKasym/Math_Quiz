// Загрузка данных из JSON

window.addEventListener("load", loadDB);

let timer = "";
let rules = [];

function loadDB() {
  fetch("config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      timer = data.timer;
      data.rules.forEach((item) => rules.push(item));
    });
}

// Ввод имени

const userName = document.querySelector(".mainPage__username");
const userGreet = document.querySelector(".mainPage__usergreet");
const continues = document.querySelector(".mainPage__continue");
const section = document.querySelectorAll(".section");
const gameModeButton = document.querySelector(".mainPage__mode");
const stopGameButton = document.querySelector(".gameBoard-stop");
const back = document.querySelector(".gameBoard-back");
const mainPage = document.querySelector(".mainPage");

continues.addEventListener("click", () => {
  if (userName.value.trim() !== "") {
    section[0].classList.add("slide");
    userGreet.textContent = `Welcome ${userName.value}`;
  }
});

// Выбор режима

let gameMode;
const usernameInfo = document.querySelector(".gameBoard__info-username");

gameModeButton.addEventListener("click", (e) => {
  if (e.target.classList.contains("mainPage__mode-game")) {
    gameMode = e.target.getAttribute("data");

    section[1].classList.add("slide");
    usernameInfo.textContent = userName.value;
    if (gameMode === "time") {
      ShowTimer();
      startGame();
    }
  }
});

// Игра

const num1 = document.querySelector(".num-1");
const num2 = document.querySelector(".num-2");
const operator = document.querySelector(".operator");
const result = document.querySelector(".result");
const userScore = document.querySelector(".userscore");
const boardUserScore = document.querySelector(".gameBoard__info-userscore");
const userScoreStatus = document.querySelector(".userscore-status");
const exampleBoard = document.querySelector(".example-board");
let win = 0;

let game = true;
function startGame() {
  if (!game) return false;
  else {
    const getRandom = (min, max) => {
      return Math.round(Math.random() * (max - min) + min);
    };

    const operators = ["+", "-", "*", "/"];

    const sum = (a, b, operator) => {
      if (operator === "+") return a + b;
      if (operator === "-") return a - b;
      if (operator === "/") return a / b;
      return a * b;
    };

    const generateExample = () => {
      const operator = operators[getRandom(0, 3)];
      const num1 = getRandom(1, 10);
      const num2 = getRandom(1, 10);
      const result = sum(num1, num2, operator);
      if (operator === "/") {
        const num2 = getRandom(1, 10);
        const num1 = num2 * getRandom(1, 10);
        const result = sum(num1, num2, operator);
        return { num1, num2, operator, result };
      }
      return { num1, num2, operator, result };
    };

    exampleBoard.style.display = "flex";
    const renderExample = (data) => {
      num1.textContent = data.num1;
      num2.textContent = data.num2;
      operator.textContent = data.operator;
      //   setTimeout(() => {
      //     exampleBoard.style = "opacity:1";
      //   }, 5000);
    };

    let example = generateExample();

    renderExample(example);
    userScore.textContent = "0";

    result.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        if (!result.value && result.value !== 0) return;

        if (Number(result.value) === Number(example.result)) {
          win++;
          // audioScore();
          userScoreStatus.textContent = "+1";
          userScoreStatus.style = "opacity:1;color:darkgreen;";
          setTimeout(() => {
            userScoreStatus.style =
              "opacity:0;color:darkgreen;margin-top:-10px;";
          }, 1000);
        } else {
          win--;
          userScoreStatus.textContent = "-1";
          userScoreStatus.style =
            "opacity:1;color:darkred;margin-bottom:-10px;";
          setTimeout(() => {
            userScoreStatus.style =
              "opacity:0;color:darkred;margin-bottom:x`0px;";
          }, 1000);
        }

        userScore.textContent = win;
        result.value = "";
        example = generateExample();
        renderExample(example);
      }
    });
  }
}

function stopGame() {
  game = false;
  // time = 5;
}
function audioScore() {
  let audio = new Audio();
  audio.src = "./audio/score.mp3";
  audio.autoplay = true;
}

// Таймер

const boardTimer = document.querySelector(".gameBoard__timer");
function ShowTimer() {
  let genTime = timer.split(":");
  time = Number(genTime[0]) * 60 + Number(genTime[1]);
  boardTimer.innerText = `${genTime[0]}:${genTime[1]}`;
  function count() {
    time--;
    seconds = Math.floor(time % 60);
    minutes = Math.floor((time / 60) % 60);
    boardTimer.innerText = `${minutes}: ${seconds}`;
  }
  if (game) {
    setInterval(() => count(), 1000);
  } else return;
}

// Остановка игры

stopGameButton.addEventListener("click", () => {
  section[1].classList.remove("slide");
  collectUsers();
  stopGame();
  game = false;
  win = 0;
});

back.addEventListener("click", () => {
  //   section[0].classList.remove("slide");
  section[1].classList.remove("slide");
  collectUsers();
  showScore();
  stopGame();
  game = false;
  win = 0;
});

// Сбор пользователей

function collectUsers() {
  if (localStorage.getItem(`${gameMode}-users`) == null) {
    localStorage.setItem(`${gameMode}-users`, JSON.stringify([]));
  }
  let users = JSON.parse(localStorage.getItem(`${gameMode}-users`));

  if (users.findIndex((user) => user.username === userName.value) >= 0) {
    let userId = users.findIndex((user) => user.username === userName.value);
    let user = users.find((user) => user.username === userName.value);

    if (win > user.userscore) {
      users[userId] = { username: userName.value, userscore: win };
      localStorage.setItem(`${gameMode}-users`, JSON.stringify(users));
    }
    if (win <= user.userscore) {
      return;
    }
  } else {
    users.push({ username: userName.value, userscore: win });
    localStorage.setItem(`${mode}-users`, JSON.stringify(users));
  }
}

// Открытие и заполнение модального окна

const linkToWindow = document.querySelectorAll(".linkToWindow");
const boardWindow = document.querySelector(".window");
const windowClose = document.querySelector(".window__close");
const windowTitle = document.querySelector(".window-title");
const windowList = document.querySelector(".window__list");
const boardMode = document.querySelector(".window__mode");
const boardGameMode = document.querySelectorAll(".window__mode-item");

linkToWindow.forEach((link) => {
  link.addEventListener("click", function (e) {
    openWindow();
    if (e.target.getAttribute("data") === "data-rules") {
      showRules();
    }

    if (e.target.getAttribute("data") === "data-leaderBoard") {
      showLeaders();
    }
  });
});

windowClose.addEventListener("click", closeWindow);

function openWindow() {
  boardWindow.classList.add("openWindow");
}
function closeWindow() {
  boardWindow.classList.remove("openWindow");
}

// Показать правила
function showRules() {
  clearWindow();
  boardMode.classList.remove("window__mode-visiable");
  windowTitle.textContent = "Rules of the Game";
  rules.forEach((item) => {
    createListInner(item);
  });
}

// Показать очки

function showScore() {
  openWindow();
  clearWindow();
  boardMode.classList.remove("window__mode-visiable");
  windowTitle.textContent = "Your score:";
  createListInner(win);
  const lid = document.createElement("p");
  lid.setAttribute("class", "linkToWindow");
  lid.textContent = "LEADERBOARD";
  windowList.append(lid);

  lid.addEventListener("click", () => {
    showLeaders();
    section[1].classList.remove("slide");
  });
}

// Показать таблицу лидеров

function showLeaders() {
  windowTitle.textContent = "Table of Leaders";
  boardMode.classList.add("window__mode-visiable");
  showModeLeaders();
  selectMode();
}

function showModeLeaders() {
  clearWindow();
  boardGameMode.forEach((item) => {
    item.addEventListener("click", (e) => {
      clearWindow();

      let mode = e.target.getAttribute("data");
      selectMode(mode);
    });
  });
}

function selectMode(mode = gameMode ? gameMode : "practice") {
  let users = JSON.parse(localStorage.getItem(`${mode}-users`));
  users
    .sort((a, b) => b.userscore - a.userscore)
    .map((item) => {
      createListInner(item);
    });
}

// Заполнение окон "Правила" и "Лидерборд"

function createListInner(element) {
  const li = document.createElement("li");
  li.setAttribute("class", "window__list-item");
  if (typeof element === "object") {
    li.append(`Username: ${element.username}, score ${element.userscore}`);
  }
  if (typeof element === "string" || typeof element === "number") {
    li.append(element);
  }
  windowList.append(li);
}

// Очистка окна от старых данных

function clearWindow() {
  while (windowList.firstChild) {
    windowList.removeChild(windowList.firstChild);
  }
}

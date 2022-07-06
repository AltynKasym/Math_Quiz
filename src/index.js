import "./style/style.scss";
import "./config.json";

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
const gameMode = document.querySelector(".mainPage__mode");
const stopGame = document.querySelector(".gameBoard-stop");
const back = document.querySelector(".gameBoard-back");
const mainPage = document.querySelector(".mainPage");

continues.addEventListener("click", () => {
  if (userName.value.trim() !== "") {
    section[0].classList.add("slide");
    userGreet.innerText = `Welcome ${userName.value}`;
  }
});

// Выбор режима

let mode;
const usernameInfo = document.querySelector(".gameBoard__info-username");

gameMode.addEventListener("click", (e) => {
  if (e.target.classList.contains("mainPage__mode-game")) {
    mode = e.target.getAttribute("data");
    section[1].classList.add("slide");
    usernameInfo.textContent = userName.value;
  }
});

// Игра

const num1 = document.querySelector(".num-1");
const num2 = document.querySelector(".num-2");
const operator = document.querySelector(".operator");
const result = document.querySelector(".result");
const winElement = document.querySelector(".win");

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
  if (operator === "/") {
    const num2 = getRandom(1, 10);
    const num1 = num2 * getRandom(1, 10);
    const result = sum(num1, num2, operator);
    return { num1, num2, operator, result };
  } else {
    const num1 = getRandom(1, 10);
    const num2 = getRandom(1, 10);
    const result = sum(num1, num2, operator);
    return { num1, num2, operator, result };
  }
};

const renderExample = (data) => {
  num1.textContent = data.num1;
  num2.textContent = data.num2;
  operator.textContent = data.operator;
};

let win = 0;
let example = generateExample();
renderExample(example);

result.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    if (!result.value && result.value !== 0) return;
    win += Number(result.value) === Number(example.result) ? 1 : -1;
    winElement.textContent = win;
    result.value = "";
    example = generateExample();
    renderExample(example);
  }
});

// Остановка игры

stopGame.addEventListener("click", () => {
  section[1].classList.remove("slide");
  collectUsers();
  win = 0;
});

back.addEventListener("click", () => {
  section[0].classList.remove("slide");
  section[1].classList.remove("slide");
  collectUsers();
  win = 0;
});

// Сбор пользователей

function collectUsers() {
  if (localStorage.getItem(`${mode}-users`) == null) {
    localStorage.setItem(`${mode}-users`, JSON.stringify([]));
  }
  let users = JSON.parse(localStorage.getItem(`${mode}-users`));

  // Object.keys(users);
  // users.indexof(userName.value) >= 0 &&
  // users.forEach((user) => {
  //   if (userName.value === user.username && win === user.userscore) return;
  //   else {
  users.push({ username: userName.value, userscore: win });
  localStorage.setItem(`${mode}-users`, JSON.stringify(users));
  //   }
  // });
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
function showRules() {
  clearWindow();
  boardMode.classList.remove("window__mode-visiable");
  windowTitle.textContent = "Rules of the Game";
  rules.forEach((item) => {
    createListInner(item);
  });
}

function showLeaders() {
  windowTitle.textContent = "Table of Leaders";
  boardMode.classList.add("window__mode-visiable");
  showModeLeaders();
}

function showModeLeaders() {
  clearWindow();
  boardGameMode.forEach((item) => {
    item.addEventListener("click", (e) => {
      clearWindow();
      let mode = e.target.getAttribute("data");
      let users = JSON.parse(localStorage.getItem(`${mode}-users`));
      users
        .sort((a, b) => b.userscore - a.userscore)
        .map((item) => {
          createListInner(item);
        });
      // console.log(Object.keys(users));
    });
  });
}

function createListInner(element) {
  const li = document.createElement("li");
  li.setAttribute("class", "window__list-item");
  if (typeof element === "object") {
    li.append(`Username: ${element.username}, score ${element.userscore}`);
  }
  if (typeof element === "string") {
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

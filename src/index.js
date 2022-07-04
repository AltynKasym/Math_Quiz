import "./style/style.scss";
import("./config.json");

// window.addEventListener("load", loadDB);

// const timer = null;

// function loadDB() {
//   fetch("config.json")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       timer = data.timer;
//       console.log("data.timer", data.timer);
//     });
// }

// console.log("timer", timer);

const userInput = document.querySelector(".mainPage__userInput");
const username = document.querySelector(".mainPage__username");
const continues = document.querySelector(".mainPage__continue");
const section = document.querySelectorAll(".section");
const gameMode = document.querySelector(".mainPage__mode");
const stopGame = document.querySelector(".gameBoard-stop");
const back = document.querySelector(".gameBoard-back");
const mainPage = document.querySelector(".mainPage");

// if (localStorage.getItem("users") == !true) {
localStorage.setItem("users", JSON.stringify([]));
// }

continues.addEventListener("click", () => {
  if (userInput.value.trim() !== "") {
    let users = JSON.parse(localStorage.getItem("users"));
    console.log("users", users);
    users.push({ username: userInput.value, userscore: 0 });
    section[0].classList.add("slide");
    username.innerText = `Welcome ${userInput.value}`;
    localStorage.setItem("users", JSON.stringify(users));
    // userInput.value = "";
  }
});

let mode;
const usernameInfo = document.querySelector(".gameBoard__info-username");

gameMode.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    mode = e.target.innerText;
    console.log("Mode", mode);
    section[1].classList.add("slide");
    usernameInfo.textContent = userInput.value;
  }
});

console.log(userInput.value);

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

stopGame.addEventListener("click", () => {
  section[0].classList.remove("slide");
  section[1].classList.remove("slide");

  win = 0;
});

back.addEventListener("click", () => {
  section[1].classList.remove("slide");

  win = 0;
});

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

const leaderBoardButton = document.querySelector(".mainPage__boardText");
const leaderBoard = document.querySelector(".leaderBoard");
const leaderBoardClose = document.querySelector(".leaderBoard__close");

leaderBoardButton.addEventListener("click", showLeaderBoard);
leaderBoardClose.addEventListener("click", closeLeaderBoard);

function showLeaderBoard() {
  leaderBoard.classList.add("visiable");
}
function closeLeaderBoard() {
  leaderBoard.classList.remove("visiable");
}

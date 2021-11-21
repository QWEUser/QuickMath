//execute these functions when the page loads
window.onload = function () {
  populateCells(n);
  timer();
  document.querySelector(".timer").innerHTML = minutes + ":00";
};

//global variable declaration
let cellNumbers = [];
let finalSum;
let maxSum = 50;
let minutes = 1;
const equationContainer = document.querySelector("h2");
const currentScoreContainer = document.querySelector(".current-score");
const gameOverWindow = document.querySelector(".game-over-window");
const gameSettingsWindow = document.querySelector(".game-settings-window");
const gameOverWindowMessage = document.querySelector(
  ".game-over-window__message"
);
const plusOne = document.querySelector(".plus-one");
let n = 3; //(how many numbers the player needs to guess) + 1
let currentScore = 0;

function setDifficulty(difficultyLevel) {
  let elements = document.getElementsByClassName(
    "game-settings-window__button"
  );
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("game-settings-window__button--activated");
  }
  //event.target is depricated, fix this!
  event.target.classList.add("game-settings-window__button--activated");
  // this.addEventListener("click", function () {
  //   this.classList.add("game-settings-window__button--activated");
  // });
  console.log(difficultyLevel);
  if (difficultyLevel == "level-easy") {
    n = 3;
    maxSum = 20;
  } else if (difficultyLevel == "level-medium") {
    n = 3;
    maxSum = 50;
  } else if (difficultyLevel == "level-hard") {
    n = 4;
    maxSum = 100;
  }
}

function restartGame() {
  currentScore = 0;
  currentScoreContainer.innerHTML = currentScore;
  populateCells(n);
  timer();
  document.querySelector(".timer").innerHTML = minutes + ":00";
  gameOverWindow.style.display = "none";
}

function openSettings() {
  gameSettingsWindow.style.display = "block";
}

function closeSettings() {
  gameSettingsWindow.style.display = "none";
}

function createNumbers(m) {
  cellNumbers = [];

  //create the sum of the equation
  finalSum = Math.round(Math.random() * maxSum);

  //create the first solution integer
  const firstNumber = Math.round(Math.random() * finalSum);

  //create the second solution integer
  const secondNumber = finalSum - firstNumber;
  console.log(firstNumber + " + " + secondNumber + " = " + finalSum);
  cellNumbers.push(firstNumber, secondNumber);

  //create (m-2) random integers
  for (let i = 1; i < m - 1; i++) {
    cellNumbers.push(Math.round(Math.random() * finalSum));
  }

  //shuffle the array using Durstenfeld shuffle
  for (let i = cellNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cellNumbers[i], cellNumbers[j]] = [cellNumbers[j], cellNumbers[i]];
  }

  //polulate h2 with the equation
  initialEquation();
}

function timer() {
  let initialTime = minutes * 60;
  let timerDispaly = document.querySelector(".timer");
  let timer = setInterval(function () {
    let timerMinutes = Math.floor(initialTime / 60);
    let timerSeconds = initialTime - timerMinutes * 60;
    if (timerSeconds < 10) {
      timerSeconds = "0" + timerSeconds;
    }
    timerDispaly.innerHTML = timerMinutes + ":" + timerSeconds;
    initialTime--;
    if (initialTime < 0) {
      clearInterval(timer);
      gameOverWindow.style.display = "block";
      gameOverWindowMessage.innerHTML = `Time's up! Your final score is ${currentScore}.`;
    }
  }, 1000);
}

function initialEquation() {
  let equationText = "";
  for (i = 0; i < n - 2; i++) {
    equationText += "_ + ";
  }
  equationContainer.innerHTML = equationText + "_ = " + finalSum;
}

//Populate the grid with cells
function populateCells(n) {
  createNumbers(2 * n);
  let grid = document.querySelector(".grid-container");
  grid.innerHTML = "";
  grid.style.gridTemplateRows = "repeat(" + n + ",1fr)";
  grid.style.gridTemplateColumns = "repeat(" + n + ",1fr)";
  let activeNumbers = [];
  for (let i = 0; i < 2 * n; i++) {
    let btn = grid.appendChild(document.createElement("button"));
    btn.className = "grid__number-cells";
    btn.id = "cell" + i;
    btn.innerHTML = cellNumbers[i];
    //create a function for every button to add or remove class buttn-activated when button is pressed
    btn.onclick = function () {
      if (this.classList.contains("button--activated")) {
        this.classList.remove("button--activated");
        let targetNumber = parseInt(this.innerHTML);
        let index = activeNumbers.indexOf(targetNumber);
        if (index > -1) {
          activeNumbers.splice(index, 1);
        }
        console.log(activeNumbers);
        writeEquation();
        return;
      }
      if (activeNumbers.length <= n - 2) {
        this.classList.add("button--activated");
        activeNumbers.push(parseInt(this.innerHTML));
        writeEquation();
      }
      if (activeNumbers.length == n - 1) {
        const playerResult = activeNumbers.reduce(
          (accumulator, curr) => accumulator + curr
        );
        if (finalSum == playerResult) {
          // alert("Success!" + " " + finalSum + " = " + playerResult);
          populateCells(n);
          currentScore++;
          plusOne.classList.add("animation-fade-in-out");
          setTimeout(() => {
            plusOne.classList.remove("animation-fade-in-out");
          }, 1000);
        } else {
          // alert("Nope!" + " " + finalSum + " != " + playerResult);
        }
        currentScoreContainer.innerHTML = currentScore;
        //location.reload();
      }
      //a local function to refresh the equationContainer with updated equation after button is pressed
      function writeEquation() {
        let textResult = "";
        for (i = 0; i < n - 2; i++) {
          if (activeNumbers[i] == undefined) {
            textResult += " _ + ";
          } else {
            textResult += activeNumbers[i] + " + ";
          }
        }
        if (activeNumbers.length == n - 1) {
          equationContainer.innerHTML =
            textResult + " " + activeNumbers[n - 2] + " = " + finalSum;
          return;
        }
        equationContainer.innerHTML = textResult + " _ = " + finalSum;
      }
      console.log(activeNumbers);
    };
  }
}

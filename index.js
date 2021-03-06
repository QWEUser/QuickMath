//execute these functions when the page loads
window.onload = function () {
  populateCells(n);
  document.querySelector(".timer").innerHTML = minutes + ":00";
  initiateTimer();
};

//global variable declaration
let initialTime, countdown;

let solutionNumbers = [];
let finalSum;
let maxSum = 100;
let minSum = 30;
let minutes = 1;
const timerDispaly = document.querySelector(".timer");
const equationContainer = document.querySelector("h2");
const currentScoreContainer = document.querySelector(".current-score");
const highScoreContainer = document.querySelector(".high-score");
const gameOverWindow = document.querySelector(".game-over-window");
const gameSettingsWindow = document.querySelector(".game-settings-window");
const gameOverWindowMessage = document.querySelector(
  ".game-over-window__message"
);
const plusOne = document.querySelector(".plus-one");
let n = 3; //(how many numbers the player needs to guess) + 1
let currentScore = 0;
let highScore = 0;

//fetch highscore from localStorage, if it exists
if (typeof Storage !== "undefined") {
  let localStorageInfo = window.localStorage.getItem("highscore");
  highScore = localStorageInfo;
  highScoreContainer.innerHTML = highScore;
}

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
  if (difficultyLevel == "level-easy") {
    n = 3;
    maxSum = 30;
    minSum = 2;
  } else if (difficultyLevel == "level-medium") {
    n = 3;
    maxSum = 100;
    minSum = 30;
  } else if (difficultyLevel == "level-hard") {
    n = 4;
    maxSum = 50;
    minSum = 10;
  }
  displayDifficulty();
}

function restartGame() {
  currentScore = 0;
  currentScoreContainer.innerHTML = currentScore;
  populateCells(n);
  document.querySelector(".timer").innerHTML = minutes + ":00";
  initiateTimer();
  gameOverWindow.style.display = "none";
}

function openSettings() {
  gameSettingsWindow.style.display = "block";
}

function closeSettings() {
  gameSettingsWindow.style.display = "none";
}

function resetHighScore() {
  if (typeof Storage !== "undefined") {
    window.localStorage.setItem("highscore", 0);
  }
}

function stopAndOpenSettings() {
  clearInterval(countdown);
  gameOverWindow.style.display = "block";
  openSettings();
}

function createNumbers(m) {
  solutionNumbers = [];

  //create the sum of the equation
  finalSum = Math.floor(Math.random() * (maxSum - minSum + 1) + minSum);
  // if (finalSum > maxSum) {
  //   finalSum = finalSum - maxSum + minSum;
  // }

  //create solution integers
  let sumLeft = finalSum;
  let currentNumber;
  for (let i = 1; i < n - 1; i++) {
    currentNumber = Math.round(Math.random() * sumLeft);
    solutionNumbers.push(currentNumber);
    sumLeft = sumLeft - currentNumber;
    console.log("current number: " + currentNumber);
  }
  solutionNumbers.push(sumLeft);
  console.log(solutionNumbers);

  //create (m-2) random integers
  for (let i = 1; i < m - n + 2; i++) {
    solutionNumbers.push(Math.round(Math.random() * finalSum));
  }
  console.log(solutionNumbers);

  //shuffle the array using Durstenfeld shuffle
  for (let i = solutionNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [solutionNumbers[i], solutionNumbers[j]] = [
      solutionNumbers[j],
      solutionNumbers[i],
    ];
  }

  //populate h2 with the equation
  initialEquation();
}

function initiateTimer() {
  initialTime = minutes * 60;
  countdown = setInterval(timer, 1000);
}

function timer() {
  let timerMinutes = Math.floor(initialTime / 60);
  let timerSeconds = initialTime - timerMinutes * 60;
  if (timerSeconds < 10) {
    timerSeconds = "0" + timerSeconds;
  }
  timerDispaly.innerHTML = timerMinutes + ":" + timerSeconds;
  initialTime--;
  if (initialTime < 0) {
    clearInterval(countdown);
    gameOverWindow.style.display = "block";
    gameOverWindowMessage.innerHTML = `Time's up! Your final score is ${currentScore}.`;
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreContainer.innerHTML = highScore;

      //store high score to localStorage
      if (typeof Storage !== "undefined") {
        window.localStorage.setItem("highscore", highScore);
      }
    }
  }
}

function initialEquation() {
  let equationText = "";
  for (i = 0; i < n - 2; i++) {
    equationText += "_ + ";
  }
  equationContainer.innerHTML = equationText + "_ = " + finalSum;
}

function displayDifficulty() {
  let activeDifficultyLevel = document.querySelector(
    ".game-settings-window__button--activated"
  ).id;

  //remove "level-" from difficulty name
  activeDifficultyLevel = activeDifficultyLevel.slice(6);

  //Capitalize difficulty string
  activeDifficultyLevel =
    activeDifficultyLevel.charAt(0).toUpperCase() +
    activeDifficultyLevel.slice(1);
  document.querySelector("h1").innerHTML =
    "QuickMath - " + activeDifficultyLevel;
}

//Populate the grid with cells
function populateCells(n) {
  displayDifficulty();
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
    btn.innerHTML = solutionNumbers[i];

    //create a function for every button to add or remove class button-activated when button is pressed
    btn.onclick = function () {
      if (this.classList.contains("button--activated")) {
        this.classList.remove("button--activated");
        let targetNumber = parseInt(this.innerHTML);
        let index = activeNumbers.indexOf(targetNumber);
        if (index > -1) {
          activeNumbers.splice(index, 1);
        }
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
    };
  }
}

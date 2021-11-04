//execute these functions when the page loads
window.onload = function () {
  populateCells(n);
};

//global variable declaration
let cellNumbers = [];
let finalSum;
const equationContainer = document.querySelector("h2");
const n = 3; //(how many numbers the player needs to guess) + 1

function createNumbers(m) {
  cellNumbers = [];

  //create the sum of the equation
  finalSum = Math.round(Math.random() * 100);

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

function initialEquation() {
  let equationText = "";
  for (i = 0; i < n - 2; i++) {
    equationText += "_ + ";
  }
  equationContainer.innerHTML = equationText + "_ = " + finalSum;
}

//Populate the grid with cells
function populateCells(n) {
  createNumbers(n * n);
  let grid = document.querySelector(".grid-container");
  grid.style.gridTemplateRows = "repeat(" + n + ",1fr)";
  grid.style.gridTemplateColumns = "repeat(" + n + ",1fr)";
  let activeNumbers = [];
  for (let i = 0; i < n * n; i++) {
    let btn = grid.appendChild(document.createElement("button"));
    btn.className = "grid__number-cells";
    btn.id = "cell" + i;
    btn.innerHTML = cellNumbers[i];
    //create a function for every button to add or remove class buttn-activated when button is pressed
    btn.onclick = function () {
      if (this.classList.contains("button--activated")) {
        this.classList.remove("button--activated");
        let j = this.innerHTML;
        activeNumbers = activeNumbers.filter(function (i) {
          if (i != j) {
            return j;
          }
        });
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
          console.log("Success!" + " " + finalSum + " = " + playerResult);
        } else {
          console.log("Nope!" + " " + finalSum + " != " + playerResult);
        }
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

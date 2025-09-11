// Global variables
const wordle = wordsList[Math.floor(Math.random() * 2301)]
const rows = 6
const cols = 5
const charRegex = /^[A-Za-z]$/
let currentRow = 0
let currentCol = 0

// Elements
const sqrEl = document.querySelectorAll(".sqr")

// Functions
const getIndex = (row, col) => row * cols + col
const pushLetter = (letter) => {
  let index = getIndex(currentRow, currentCol)
  sqrEl[index].textContent = letter
  if (currentCol === 4 && currentRow != 5) {
    currentRow++
    currentCol = 0
  } else if (currentCol === 4 && currentRow === 5) {
    console.log("end reached")
    // TODO: CALL LOST FUNCTION HERE
  } else {
    currentCol++
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("submit guess")
  } else if (event.key === "Backspace") {
    console.log("delete character")
  } else if (charRegex.test(event.key)) {
    pushLetter(event.key)
  }
})

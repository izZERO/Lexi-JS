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

  if (currentRow <= 5) {
    sqrEl[index].textContent = letter
    if (currentCol === 4) {
      currentRow++
      currentCol = 0
    } else {
      currentCol++
    }
  } else {
    console.log("end reached")
  }
}

const deleteLetter = () => {
  let index = getIndex(currentRow, currentCol)

  if (!(currentCol === 0 && currentRow === 0)) {
    if (currentCol === 0) {
      sqrEl[index - 1].textContent = ""
      currentCol = 4
      currentRow--
    } else {
      sqrEl[index - 1].textContent = ""
      currentCol--
    }
  } else console.log("cannot delete any further")
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("submit guess")
  } else if (event.key === "Backspace") {
    deleteLetter()
  } else if (charRegex.test(event.key)) {
    pushLetter(event.key)
  }
})

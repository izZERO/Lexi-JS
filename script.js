// Global variables
const wordle = wordsList[Math.floor(Math.random() * 2301)].toUpperCase()
const rows = 6
const cols = 5
const charRegex = /^[A-Za-z]$/
let isGameOver = false
let currentRow = 0
let currentCol = 0
let guessArr = []
let correctGuess = []
console.log(wordle)

// Elements
const sqrEl = document.querySelectorAll(".sqr")

// Functions
const getIndex = (row, col) => row * cols + col

const pushLetter = (letter) => {
  let index = getIndex(currentRow, currentCol)

  if (currentRow < 6 && currentCol < 5) {
    sqrEl[index].textContent = letter.toUpperCase()
    guessArr.push(letter.toUpperCase())
    currentCol++

    //   if (currentCol === 4) {
    //     currentRow++
    //     currentCol = 0
    //   } else {
    //     currentCol++
    //   }
    // } else {
    //   console.log("end reached")
  }
}

const deleteLetter = () => {
  let index = getIndex(currentRow, currentCol)
  let rowOfIndex = Math.floor((index - 1) / cols)
  if (rowOfIndex === currentRow) {
    sqrEl[index - 1].textContent = ""
    guessArr.pop()
    currentCol--
  }
}

const handleWin = () => {
  isGameOver = true
  alert("you have Won the game!!!")
}

const handleLoss = () => {
  isGameOver = true
  alert("you lost the game")
}

const submitGuess = () => {
  if (guessArr.length === 0) return

  let guess = guessArr.join("").toLowerCase()

  if (!wordsList.includes(guess)) {
    alert("Word doesn't exist!")
    return
  }

  if (guess == wordle) {
    handleWin()
    return
  }
  // check letters
  guessArr.forEach((letter, index) => {
    if (wordle.includes(letter)) {
      if (letter === wordle[index]) {
        console.log(`${letter} is correct`)
      } else {
        console.log(`${letter} is correct but wrong place`)
      }
    } else {
      console.log(`${letter} is wrong`)
    }
  })

  currentRow++
  currentCol = 0
  guessArr = []

  if (currentRow === 6) {
    handleLoss()
    return
  }
}

document.addEventListener("keydown", (event) => {
  if (!isGameOver) {
    if (event.key === "Enter") {
      submitGuess()
    } else if (event.key === "Backspace") {
      deleteLetter()
    } else if (charRegex.test(event.key)) {
      pushLetter(event.key)
    }
  }
})

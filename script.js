// Global variables
const wordle = "APPLE" //wordsList[Math.floor(Math.random() * 2301)].toUpperCase()
const wordleArr = wordle.split("")
const rows = 6
const cols = 5
const charRegex = /^[A-Za-z]$/
let isGameOver = false
let currentRow = 0
let currentCol = 0
let guessArr = []
let correctGuess = []
let letterOccurrences = {}
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

const countLetterOccurrences = () => {
  wordleArr.forEach((letter) => {
    if (!letterOccurrences[letter]) {
      letterOccurrences[letter] = 1
    } else {
      letterOccurrences[letter]++
    }
  })
  console.log(letterOccurrences)
}

const submitGuess = () => {
  if (guessArr.length === 0) return

  const localOccurrences = { ...letterOccurrences }
  let guess = guessArr.join("")

  // if (!wordsList.includes(guess.toLowerCase())) {
  //   alert("Word doesn't exist!")
  //   return
  // }

  // check correct letters
  guessArr.forEach((letter, index) => {
    let sqrIndex = getIndex(currentRow, index)

    if (letter === wordle[index]) {
      sqrEl[sqrIndex].classList.add("correct")
      localOccurrences[letter]--
    }
  })
  // check wrong placed letters
  guessArr.forEach((letter, index) => {
    let sqrIndex = getIndex(currentRow, index)

    // skip already correct
    if (sqrEl[sqrIndex].classList.contains("correct")) return

    if (wordle.includes(letter) && localOccurrences[letter] > 0) {
      sqrEl[sqrIndex].classList.add("wrong-place")
      localOccurrences[letter]--
    } else {
      sqrEl[sqrIndex].classList.add("wrong")
    }
  })

  currentRow++
  currentCol = 0
  guessArr = []

  if (guess === wordle) {
    handleWin()
  } else if (currentRow === rows) {
    handleLoss()
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

countLetterOccurrences()

// Global variables
const rows = 6
const cols = 5
const charRegex = /^[A-Za-z]$/
let wordle = ""
let wordleArr = wordle.split("")
let isGameOver = false
let currentRow = 0
let currentCol = 0
let guessArr = []
let correctGuess = []
let hints = 3
let letterOccurrences = {}

// Elements
const sqrEl = document.querySelectorAll(".sqr")
const gameStatusEl = document.querySelector("#game-status")
const playAgainButtonEl = document.querySelector("#play-again")
const hintsEl = document.querySelector("#hints")
const hintsMessageEl = document.querySelector("#hint-message-container")
const remainingHints = document.querySelector("#hints-remaining")

// Functions
const initializeGame = () => {
  wordle = wordsList[Math.floor(Math.random() * 2301)].toUpperCase()
  wordleArr = wordle.split("")
  isGameOver = false
  currentRow = 0
  currentCol = 0
  guessArr = []
  correctGuess = []
  hints = 3
  remainingHints.textContent = hints
  letterOccurrences = {}
  countLetterOccurrences()
  console.log(wordle)
}

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
  gameStatusEl.textContent = "You Have Guessed The Word 😁"
  playAgainButtonEl.textContent = "Play Again 🫡"
}

const handleLoss = () => {
  isGameOver = true
  gameStatusEl.textContent = "You Have Lost 😞"
  playAgainButtonEl.textContent = "Play Again 🫡"
}

const hintCount = () => {
  if (hints < 1) return

  const localOccurrences = { ...letterOccurrences }

  // subtract letters already marked as correct
  correctGuess.forEach((letter) => {
    if (localOccurrences[letter] > 0) {
      localOccurrences[letter]--
    }
  })

  // build a list of available letters left for hints
  let filteredList = []
  Object.keys(localOccurrences).forEach((letter) => {
    for (let i = 0; i < localOccurrences[letter]; i++) {
      filteredList.push(letter)
    }
  })

  // pick a random letter from remaining pool
  let randomLetter =
    filteredList[Math.floor(Math.random() * filteredList.length)]

  let newElem = document.createElement("span")
  newElem.classList.add("hint-message")
  newElem.textContent = `You've used a Hint! Letter is: ${randomLetter}`
  hintsMessageEl.appendChild(newElem)

  remainingHints.textContent = --hints
}

const countLetterOccurrences = () => {
  wordleArr.forEach((letter) => {
    if (!letterOccurrences[letter]) {
      letterOccurrences[letter] = 1
    } else {
      letterOccurrences[letter]++
    }
  })
}

const submitGuess = () => {
  if (guessArr.length === 0) return

  const localOccurrences = { ...letterOccurrences }
  let guess = guessArr.join("")

  if (!wordsList.includes(guess.toLowerCase())) {
    alert("Word doesn't exist!")
    return
  }

  // check correct letters
  guessArr.forEach((letter, index) => {
    let sqrIndex = getIndex(currentRow, index)

    if (letter === wordle[index]) {
      sqrEl[sqrIndex].classList.add("correct")
      localOccurrences[letter]--
      correctGuess.push(letter)
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

// Event Listeners
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

playAgainButtonEl.addEventListener("click", initializeGame)

hintsEl.addEventListener("click", hintCount)

initializeGame()

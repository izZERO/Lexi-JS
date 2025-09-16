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
const mainContainer = document.getElementById("game-container")
const sqrEl = document.querySelectorAll(".sqr")
const gameStatusEl = document.querySelector("#game-status")
const playAgainButtonEl = document.querySelector("#play-again")
const hintsEl = document.querySelector("#hints")
const hintsMessageEl = document.querySelector("#hint-message-container")
const remainingHints = document.querySelector("#hints-remaining")
const keys = document.querySelectorAll(".key")
// Functions
const initializeGame = () => {
  isGameOver = false
  wordle = wordsList[Math.floor(Math.random() * 2301)].toUpperCase()
  wordleArr = wordle.split("")
  currentRow = 0
  currentCol = 0
  guessArr = []
  correctGuess = []
  hints = 3
  remainingHints.textContent = hints
  gameStatusEl.textContent = ""
  gameStatusEl.classList.remove("game-status-animation")
  hintsMessageEl.innerHTML = ""
  playAgainButtonEl.textContent = "Restart Game ❓"
  letterOccurrences = {}
  countLetterOccurrences()

  sqrEl.forEach((sqr) => {
    sqr.textContent = ""
    sqr.classList.remove("correct", "wrong", "wrong-place")
  })

  keys.forEach((key) => {
    key.classList.remove("correct", "wrong", "wrong-place")
  })

  mainContainer.focus()
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
  gameStatusEl.classList.add("game-status-animation")
  playAgainButtonEl.textContent = "Play Again 🫡"
}

const handleLoss = () => {
  isGameOver = true
  gameStatusEl.textContent = "You Have Lost 😞"
  gameStatusEl.classList.add("game-status-animation")
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

  // flip animation
  guessArr.forEach((letter, index) => {
    let sqrIndex = getIndex(currentRow, index)
    sqrEl[sqrIndex].classList.add("flip")

    setTimeout(() => {
      sqrEl[sqrIndex].classList.remove("flip")
    }, 600)
  })

  setTimeout(() => {
    // check correct letters
    guessArr.forEach((letter, index) => {
      let sqrIndex = getIndex(currentRow, index)

      if (letter === wordle[index]) {
        sqrEl[sqrIndex].classList.add("correct")
        localOccurrences[letter]--
        correctGuess.push(letter)
        keys.forEach((key) => {
          if (key.textContent === letter) {
            key.classList.add("correct")
          }
        })
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
        keys.forEach((key) => {
          if (key.textContent === letter) {
            key.classList.add("wrong-place")
          }
        })
      } else {
        keys.forEach((key) => {
          if (key.textContent === letter) {
            key.classList.add("wrong")
          }
        })
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
  }, 300)
}

// Event Listeners

// key clicks
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

//screen keyboard
keys.forEach((key) => {
  key.addEventListener("click", () => {
    if (!isGameOver) {
      if (key.textContent === "ENTER") {
        submitGuess()
      } else if (key.id === "key-delete") {
        deleteLetter()
      } else if (charRegex.test(key.textContent)) {
        pushLetter(key.textContent)
      }
    }
  })
})
playAgainButtonEl.addEventListener("click", initializeGame)

hintsEl.addEventListener("click", () => {
  if (!isGameOver) {
    hintCount()
  }
})

initializeGame()

// import dictionary from './dictionary.json' assert { type: 'json' }

const WORD_LENGTH = 5

const deleteBtn = document.querySelector('[data-delete]')
const enterBtn = document.querySelector('[data-enter]')

let word
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'API-KEY',
    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
  },
}
function getWord() {
  fetch(
    'https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5',
    options,
  )
    .then(response => response.json())
    .then(response => (word = response.word.replace(/\s/g, '')))
    .catch(err => console.error(err))
}

console.log(process.env.API_KEY)

getWord()
startInteraction()

function startInteraction() {
  console.log(word)
  document.addEventListener('keydown', handleKeyPress)
  document.addEventListener('click', handleClick)
}
function stopInteraction() {
  document.removeEventListener('keydown', handleKeyPress)
  document.removeEventListener('click', handleClick)
}

function handleClick(e) {
  if (e.target.getAttribute('data-delete')) {
    deleteLetter()
  }
  if (e.target.getAttribute('data-enter')) {
    submit()
  }
  if (e.target.getAttribute('data-key')) {
    addLetter(e.target.dataset.key)
  }
}

function handleKeyPress(e) {
  const activeKey = document.activeElement

  if (e.key === 'Enter' && activeKey.hasAttribute('data-key')) {
    addLetter(e.key)
    return
  } else if (e.key === 'Enter' && activeKey.hasAttribute('data-delete')) {
    deleteLetter()
    return
  } else if (e.key === 'Enter') {
    submit()
    return
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    deleteLetter()
    return
  }

  if (e.key.match(/^[a-zA-Z]$/)) {
    addLetter(e.key)
    return
  }
}

function addLetter(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length === WORD_LENGTH) return
  const tile = document.querySelector('.tile:not([data-letter])')
  tile.textContent = key.toUpperCase()
  tile.dataset.letter = key.toLowerCase()
  tile.dataset.state = 'active'
}

function deleteLetter() {
  const activeTiles = getActiveTiles()
  if (activeTiles.length === 0) return
  activeTiles[activeTiles.length - 1].textContent = ''
  delete activeTiles[activeTiles.length - 1].dataset.letter
  delete activeTiles[activeTiles.length - 1].dataset.state
}

function submit() {
  stopInteraction()
  const activeTiles = getActiveTiles()
  if (activeTiles.length < 5) return console.log('ffff')

  let guessWord = ''
  for (let i = 0; activeTiles.length > i; i++) {
    guessWord += activeTiles[i].dataset.letter
  }

  if (guessWord === word) {
    winning()
  } else {
    let checkWord = word.split('')
    activeTiles.forEach((elem, index) => {
      setTimeout(() => {
        elem.classList.add('flip')
      }, (500 * index) / 2)
      elem.addEventListener(
        'transitionend',
        () => {
          elem.classList.remove('flip')
          const letter = elem.dataset.letter
          const indexOfLetter = checkWord.indexOf(letter)

          const key = document.querySelector(
            `.key[data-key="${letter.toUpperCase()}"]`,
          )

          if (letter === checkWord[index]) {
            key.dataset.state = 'correct'
            elem.dataset.state = 'correct'
            return
          } else if (indexOfLetter !== -1) {
            key.dataset.state = 'wrong-place'
            elem.dataset.state = 'wrong-place'
            return
          } else {
            key.dataset.state = 'wrong'
            elem.dataset.state = 'wrong'
            return
          }
        },
        { once: true },
      )
    })
    startInteraction()
  }
}

function getActiveTiles() {
  return document.querySelectorAll('.tile[data-state="active"]')
}

function showAlert(str) {
  setTimeout(() => {
    alert(str)
  }, 2000)
}

function winning() {
  stopInteraction()
  const activeTiles = getActiveTiles()

  const animation = new Promise((resolve, reject) => {
    activeTiles.forEach((elem, index) => {
      setTimeout(() => {
        elem.classList.add('win')
        elem.dataset.state = 'correct'
        if (index === activeTiles.length - 1) resolve()
      }, (500 * index) / 5)
      elem.addEventListener(
        'transitionend',
        () => {
          elem.classList.remove('win')
        },
        { once: true },
      )
    })
  })
  animation.then(() => showAlert('You win!!!'))
}

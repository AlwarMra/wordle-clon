// import dictionary from './dictionary.json' assert { type: 'json' }

const guessGrid = document.querySelector('[data-guess-grid]')
const keyword = document.querySelector('[data-keyboard]')

const deleteBtn = document.querySelector('[data-delete]')
const enterBtn = document.querySelector('[data-enter]')

const word = 'daily'

startInteraction()

function startInteraction() {
  document.addEventListener('keydown', handleKeyPress)
  document.addEventListener('click', handleClick)
}

function handleClick(e) {
  if (e.target.getAttribute('data-delete')) {
    console.log('delete')
  }
}

function handleKeyPress(e) {
  const activeKey = document.activeElement

  if (e.key === 'Enter' && activeKey.hasAttribute('data-key')) {
    addLetter()
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
    console.log(e.key)
    return
  }
}

function deleteLetter() {
  console.log('delete')
}

function addLetter() {
  console.log('add letter')
}

function submit() {
  console.log('submit')
}

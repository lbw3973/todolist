import sortable from 'sortablejs';
import {readTodos, createTodo, updateTodo, deleteTodo} from './request.js';

let preventDoubleClick = false
const buttonEl = document.querySelector('.create button')
const inputEl = document.querySelector('.create input')
const listEl = document.querySelector('.list')
const modalContainerEl = document.querySelector('.modal-container')
const modalContentEl = document.querySelector('.modal-content')
const inputModifyEl = document.querySelector('#input-modify')
const btnModifyEl = document.querySelector('#btn-modify')
const btnCancelEl = document.querySelector('#btn-cancel')

let inputText = ''
inputEl.addEventListener('input', () => {
  inputText = inputEl.value
})

inputEl.addEventListener('keyup', e => {
  if(e.key === 'Enter'){
    buttonEl.click()
    inputEl.value = ''
  }
})

buttonEl.addEventListener('click', async () => {
  if(preventDoubleClick) {return}
  preventDoubleClick = true
  await createTodo(inputText)
  const todos = await readTodos()
  renderTodos(todos)
  preventDoubleClick = false
})

new sortable(listEl, {
  handle: '.handle',
  animation: 150,
  // ghostClass: 'blue-backgrount-class'
});

;(async () => {
  const todos = await readTodos()
  renderTodos(todos)
})()

const renderTodos = async todos => {
  let index = 0
  const liEls = todos.map(todo => {

    const createdAt = new Date(todo.createdAt).toLocaleString()
    const updatedAt = new Date(todo.updatedAt).toLocaleString()

    const liEl = document.createElement('li')
    liEl.dataset.index = index++
    // todo.order = Number(liEl.dataset.index)
    liEl.innerHTML = /* html */`
    <div class="material-symbols-outlined handle">apps</div>
    <input type="checkbox">
    <p class="title">${todo.title}</p>
    <div class="edit-time">
      <span>작성: ${createdAt}</span>
      <span>수정: ${updatedAt}</span>
    </div>
     `
    
    // liEl.addEventListener('dragend', async () => {
    //   // setListIndex(todo)
    //   await updateTodo(todo)
    //   // await allUpdate()
    //   const todos = await readTodos()
    //   renderTodos(todos)
    // })
    
    const checkEl = liEl.querySelector('input')
    checkEl.checked = todo.done
    checkEl.addEventListener('click', async () => {
      todo.done = checkEl.checked
      await updateTodo(todo)
      const todos = await readTodos()
      renderTodos(todos)
    })

    // Edit modal show
    const pEl = liEl.querySelector('p')
    pEl.addEventListener('dblclick', (e) => {
      makemodal(pEl)
    })

    const btnEl = document.createElement('button')
    btnEl.textContent = '삭제!'
    btnEl.addEventListener('click', async () => {
      await deleteTodo(todo)
      const todos = await readTodos()
      renderTodos(todos)
    })
    liEl.append(btnEl)


    if(checkEl.checked === true){
      checkEl.parentElement.querySelector('p').style.textDecorationLine = "line-through"
    }

    return liEl
  })
  listEl.innerHTML = ''
  listEl.append(...liEls)
}

function makemodal(El) {
  const inputEl = modalContainerEl.querySelector('input')
  inputEl.value = El.textContent
  btnModifyEl.dataset.index = El.parentElement.dataset.index
  

  modalContainerEl.style.display = 'block'
}

// function setListIndex(todo) {
//   const liEls = listEl.querySelectorAll('li')
//   let index = 0

//   liEls.forEach(x => {
//     // console.log(x.querySelector('p').innerText)

//     x.dataset.index = index++

//     todo.order = Number(x.dataset.index)
//     console.log(x.querySelector('p').innerText, x.dataset.index, todo.order)
//   })

// }
async function allUpdate() {
  const liEls = listEl.querySelectorAll('li')
  liEls.forEach(async x => await updateTodo(x.dataset.id))
}

modalContainerEl.addEventListener('click', e => {
  if(e.target.className === 'modal-container'){
    modalContainerEl.style.display = 'none'
  }
})

window.addEventListener('keyup', e => {
  if(e.key === 'Escape'){
    modalContainerEl.style.display = 'none'
  }
})

    
btnModifyEl.addEventListener('click', async () => {
  let todo = await readTodos()
  todo = todo[btnModifyEl.dataset.index]  
  todo.title = inputModifyEl.value
  await updateTodo(todo)
  const todos = await readTodos()
  renderTodos(todos)
  modalContainerEl.style.display = 'none'
})

btnCancelEl.addEventListener('click', () => {
  modalContainerEl.style.display = 'none'
})

inputModifyEl.addEventListener('keyup', e => {
  if(e.key === 'Enter'){
    btnModifyEl.click()
  }
})
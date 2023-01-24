import sortable from 'sortablejs';
import {readTodos, createTodo, updateTodo, deleteTodo} from './request.js';

let preventDoubleClick = false
const buttonEl = document.querySelector('.create button')
const inputEl = document.querySelector('.create input')
const listContainerEl = document.querySelector('.list-container')
const listEl = document.querySelector('.list')
const btnAllDeleteEl = document.querySelector('.btn-all-delete')
const modalContainerEl = document.querySelector('.modal-container')
const inputModifyEl = document.querySelector('#input-modify')
const btnModifyEl = document.querySelector('#btn-modify')
const btnCancelEl = document.querySelector('#btn-cancel')
const fixedLoadingEl = document.querySelector('.fixed-loading')

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
  fixedLoadingEl.style.display = 'block'
  await createTodo(inputText)
  const todos = await readTodos()
  renderTodos(todos)
  preventDoubleClick = false
})

new sortable(listEl, {
  handle: '.handle',
  animation: 150,
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
    liEl.innerHTML = /* html */`
    <div class="material-symbols-outlined handle">apps</div>
    <input type="checkbox">
    <p class="title">${todo.title}</p>
    <div class="edit-time">
      <span>작성: ${createdAt}</span>
      <span>수정: ${updatedAt}</span>
    </div>
     `
    
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
    btnEl.classList.add('btn-delete')
    btnEl.addEventListener('click', async () => {
      if(!confirm("삭제 하시겠습니까?")) { return } 
      fixedLoadingEl.style.display = 'block'

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

  listContainerEl.style.backgroundImage = 'none'
  fixedLoadingEl.style.display = 'none'
  
  listEl.childElementCount < 1 ? btnAllDeleteEl.style.display = 'none' : btnAllDeleteEl.style.display = 'block'
}

function makemodal(El) {
  const inputEl = modalContainerEl.querySelector('input')
  inputEl.value = El.textContent
  btnModifyEl.dataset.index = El.parentElement.dataset.index

  modalContainerEl.style.display = 'block'
}

window.addEventListener('keyup', e => {
  if(e.key === 'Escape'){
    if(!confirm("취소 하시겠습니까?")) { return }
    modalContainerEl.style.display = 'none'
  }
})

    
btnModifyEl.addEventListener('click', async () => {
  if(!confirm("수정 하시겠습니까?")) { return }

  let todo = await readTodos()
  todo = todo[btnModifyEl.dataset.index]  
  todo.title = inputModifyEl.value
  await updateTodo(todo)

  const todos = await readTodos()
  renderTodos(todos)
  modalContainerEl.style.display = 'none'
})

btnCancelEl.addEventListener('click', () => {
  if(!confirm("취소 하시겠습니까?")) { return }

  modalContainerEl.style.display = 'none'
})

inputModifyEl.addEventListener('keyup', e => {
  if(e.key === 'Enter'){
    btnModifyEl.click()
  }
})

btnAllDeleteEl.addEventListener('click', async () => {
  if (!confirm("전체 삭제 하시겠습니까?")) { return; }

  fixedLoadingEl.style.display = 'block'
  
  const todos = await readTodos();
  await todos.map((todo) => {
    deleteTodo(todo);
  });

  renderTodos([]);
})
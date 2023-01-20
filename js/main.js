import {readTodos, createTodo, updateTodo, deleteTodo} from './request.js'

let preventDoubleClick = false
const buttonEl = document.querySelector('.create button')
const inputEl = document.querySelector('.create input')
const listEl = document.querySelector('.list')

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


;(async () => {
  const todos = await readTodos()
  renderTodos(todos)
})()

const renderTodos = todos => {
  const liEls = todos.map(todo => {

    const createdAt = new Date(todo.createdAt).toLocaleString()
    const updatedAt = new Date(todo.updatedAt).toLocaleString()

    const liEl = document.createElement('li')
    liEl.innerHTML = /* html */`
    <input type="checkbox">
    <p>${todo.title}</p>
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

    const btnEl = document.createElement('button')
    btnEl.textContent = '삭제!'
    btnEl.addEventListener('click', async () => {
      await deleteTodo(todo)
      const todos = await readTodos()
      renderTodos(todos)
    })
    liEl.append(btnEl)

    if(checkEl.checked === true){
      checkEl.parentElement.style.textDecorationLine = "line-through"
    }

    return liEl
  })
  listEl.innerHTML = ''
  listEl.append(...liEls)
}

import sortable from "sortablejs";
import {
  readTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reOrderTodo,
} from "./request.js";

let preventDoubleClick = false;
const buttonEl = document.querySelector(".create button");
const inputEl = document.querySelector(".create input");
const listContainerEl = document.querySelector(".list-container");
const listEl = document.querySelector(".list");
const btnAllDeleteEl = document.querySelector(".btn-all-delete");
const modalContainerEl = document.querySelector(".modal-container");
const inputModifyEl = document.querySelector("#input-modify");
const btnModifyEl = document.querySelector("#btn-modify");
const btnCancelEl = document.querySelector("#btn-cancel");
const fixedLoadingEl = document.querySelector(".fixed-loading");

let inputText = "";
inputEl.addEventListener("input", () => {
  inputText = inputEl.value;
});

inputEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    buttonEl.click();
    inputEl.value = "";
  }
});

buttonEl.addEventListener("click", async () => {
  if (preventDoubleClick) {
    return;
  }
  preventDoubleClick = true;
  fixedLoadingEl.style.display = "block";
  const liEls = Array.from(document.querySelectorAll(".list li"));
  await createTodo(inputText, liEls.length);
  const todos = await readTodos();
  renderTodos(todos);
  preventDoubleClick = false;
});

new sortable(listEl, {
  handle: ".handle",
  animation: 150,
});

(async () => {
  modalContainerEl.style.display = "none";
  const todos = await readTodos();
  renderTodos(todos);
})();

const renderTodos = async (todos) => {
  let index = 0;
  const liEls = todos.map((todo) => {
    const createdAt = new Date(todo.createdAt).toLocaleString();
    const updatedAt = new Date(todo.updatedAt).toLocaleString();

    const liEl = document.createElement("li");
    liEl.dataset.id = todo.id;
    liEl.dataset.index = index++;
    liEl.innerHTML = /* html */ `
    <div class="material-symbols-outlined handle">apps</div>
    <input type="checkbox">
    <p class="title">${todo.title}</p>
    <div class="edit-time">
      <span>??????: ${createdAt}</span>
      <span>??????: ${updatedAt}</span>
    </div>
     `;

    const checkEl = liEl.querySelector("input");
    checkEl.checked = todo.done;
    checkEl.addEventListener("click", async () => {
      todo.done = checkEl.checked;
      await updateTodo(todo);
      const todos = await readTodos();
      renderTodos(todos);
    });

    // Edit modal show
    const pEl = liEl.querySelector("p");
    pEl.addEventListener("dblclick", (e) => {
      makemodal(pEl);
    });

    const btnEl = document.createElement("button");
    btnEl.classList.add("btn-delete");
    btnEl.addEventListener("click", async () => {
      if (!confirm("?????? ???????????????????")) {
        return;
      }
      fixedLoadingEl.style.display = "block";

      await deleteTodo(todo);
      const todos = await readTodos();
      renderTodos(todos);
    });
    liEl.append(btnEl);

    if (checkEl.checked === true) {
      checkEl.parentElement.querySelector("p").style.textDecorationLine =
        "line-through";
    }
    liEl.addEventListener("drop", async () => {
      const liEls = Array.from(document.querySelectorAll(".list li"));
      const res = liEls.map((li) => li.dataset.id);
      await reOrderTodo(res);
    });

    return liEl;
  });
  listEl.innerHTML = "";
  listEl.append(...liEls);

  listContainerEl.style.backgroundImage = "none";
  fixedLoadingEl.style.display = "none";

  listEl.childElementCount < 1
    ? (btnAllDeleteEl.style.display = "none")
    : (btnAllDeleteEl.style.display = "block");
};

function makemodal(El) {
  const inputEl = modalContainerEl.querySelector("input");
  inputEl.value = El.textContent;
  btnModifyEl.dataset.id = El.parentElement.dataset.id;

  modalContainerEl.style.display = "block";
  inputEl.focus();
}

window.addEventListener("keyup", (e) => {
  if (modalContainerEl.style.display == "none") {
    return;
  }
  if (e.key === "Escape") {
    if (!confirm("?????? ???????????????????")) {
      return;
    }
    modalContainerEl.style.display = "none";
  }
});

btnModifyEl.addEventListener("click", async (e) => {
  if (!confirm("?????? ???????????????????")) {
    return;
  }

  const todo = (await readTodos()).find(
    (todo) => todo.id == e.target.dataset.id
  );
  todo.id = e.target.dataset.id;
  todo.title = inputModifyEl.value;
  await updateTodo(todo);

  const todos = await readTodos();
  renderTodos(todos);
  modalContainerEl.style.display = "none";
});

btnCancelEl.addEventListener("click", () => {
  if (!confirm("?????? ???????????????????")) {
    return;
  }

  modalContainerEl.style.display = "none";
});

inputModifyEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    btnModifyEl.click();
  }
});

btnAllDeleteEl.addEventListener("click", async () => {
  if (!confirm("?????? ?????? ???????????????????")) {
    return;
  }

  fixedLoadingEl.style.display = "block";

  const todos = await readTodos();
  await todos.map((todo) => {
    deleteTodo(todo);
  });

  renderTodos([]);
});

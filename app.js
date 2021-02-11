const Enum = Object.freeze({
  COMPLETED: "completed",
  UNCOMPLETED: "uncompleted",
});

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const headerTitle = document.querySelector("#header-title");
let passedPushID;

//Header title
const init = (e) => {
  let url = new URL(window.location.href);
  let pushParam = url.searchParams.get("pushID");
  passedPushID = pushParam;
  let categoryParam = url.searchParams.get("category");
  headerTitle.innerHTML = decodeURI(categoryParam);
};

todoInput.addEventListener("input", updateValue);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);
document.addEventListener("DOMContentLoaded", init);

function goBack() {
  window.location.replace("category.html");
}

function addTodo(event) {
  event.preventDefault();
  //CHECK IF INPUT IS EMPTY
  if (todoInput.value.length > 0) {
    firebase.database().ref(`User/${uid}/${passedPushID}`).child("todos").push({
      item: todoInput.value,
      status: Enum.UNCOMPLETED,
    });
    todoInput.value = "";
    todoInput.focus();
    todoInput.select();
    todoButton.disabled = true;
    todoButton.classList.remove("enabledButton");
    todoButton.classList.add("disabledButton");
  }
}

function setFirebaseTodoStatus(snapshotKeyTodoStatus, enumValue) {
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos/${snapshotKeyTodoStatus}/status`)
    .set(enumValue);
}

function createTodoItem(todoItem, todoStatus, snapshotKey) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create LI
  const newTodo = document.createElement("li");
  //CHECK IF INPUT IS EMPTY
  if (todoItem.length > 0) {
    newTodo.innerText = todoItem;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //CHECKMARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></li>';
    completedButton.classList.add("completed-btn");
    completedButton.onclick = (e) => {
      if (todoStatus === Enum.UNCOMPLETED) {
        setFirebaseTodoStatus(snapshotKey, Enum.COMPLETED);
      } else {
        setFirebaseTodoStatus(snapshotKey, Enum.UNCOMPLETED);
      }
    };
    todoDiv.appendChild(completedButton);
    //TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    trashButton.onclick = (e) => {
      removeFirebaseTodo(snapshotKey);
    };
    todoDiv.appendChild(trashButton);
    todoList.appendChild(todoDiv);
    if (todoStatus === Enum.COMPLETED) {
      todoDiv.classList.add(Enum.COMPLETED);
    }
  }
}

function removeFirebaseTodo(firebaseSnapshotKey) {
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos/${firebaseSnapshotKey}`)
    .remove();
}

function deleteCheck(e) {
  const item = e.target;
  //DELETE TODO
  if (item.classList.contains("trash-btn")) {
    const todo = item.parentElement;
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList.contains("completed-btn")) {
    const todo = item.parentElement;
    todo.classList.toggle(Enum.COMPLETED);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case Enum.COMPLETED:
        if (todo.classList.contains(Enum.COMPLETED)) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case Enum.UNCOMPLETED:
        if (!todo.classList.contains(Enum.COMPLETED)) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;

      default:
        todo.style.display = "flex";
        break;
    }
  });
}

function updateValue(e) {
  if (!e.target.value.length) {
    todoButton.disabled = true;
    todoButton.classList.remove("enabledButton");
    todoButton.classList.add("disabledButton");
  } else {
    todoButton.disabled = false;
    todoButton.classList.remove("disabledButton");
    todoButton.classList.add("enabledButton");
  }
}

//Firebase query handler
const todosSnapshotHandler = (snapshot) => {
  if (!(snapshot.key == "todos")) {
    let item = snapshot.val().item;
    let status = snapshot.val().status;
    createTodoItem(item, status, snapshot.key);
  }
};

//Firebase events for initial UI elements and for every child added
document.addEventListener("userAuthed", () => {
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos`)
    .once("value", todosSnapshotHandler);
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos`)
    .on("child_added", todosSnapshotHandler);
});

//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const headerTitle = document.querySelector("#header-title");
let passedPushID;

//header title
const init = function (e) {
  console.log(window.location.href);
  let url = new URL(window.location.href);
  let pushParam = url.searchParams.get("pushID");
  passedPushID = pushParam;
  let categoryParam = url.searchParams.get("category");
  headerTitle.innerHTML = decodeURI(categoryParam);

  // const todosSnapshotHandler = (snapshotTodo) => {
  //   console.log(snapshotTodo.value);
  //   // snapshotTodo.forEach(function (childNodes) {
  //   //   console.log(childNodes);
  //   //   childNodes.forEach(function (pushID) {
  //   //     console.log(pushID.key());
  //   //      pushID.forEach(function (category) {
  //   //        createBoard(category.val(), pushID.key);
  //   //      });
  //   //   });
  //   // });
  // };

  // document.onload = function () {
  //   const newTodoItem = document.createElement("div");
  //   newTodoItem.classList.add("todo");
  //   //let firebase = app_firebase;
  //   firebase
  //     .database()
  //     .ref(`User/${uid}/${passedPushID}/todos`)
  //     .once("value", todosSnapshotHandler);
  //   console.log(uid + "IDDDD");
  //   firebase
  //     .database()
  //     .ref(`User/${uid}/${passedPushID}/todos`)
  //     .on("child_added", todosSnapshotHandler);
  //   console.log(uid + "IDDDD");
  // };
};

//Event Listeners
todoInput.addEventListener("input", updateValue);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);
document.addEventListener("DOMContentLoaded", init);

//Functions

function goBack() {
  window.location.replace("category.html");
}

function addTodo(event) {
  //Prevent form from submiting
  event.preventDefault();
  //Todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create LI
  const newTodo = document.createElement("li");
  //CHECK IF INPUT IS EMPTY
  if (todoInput.value.length > 0) {
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //CHECKMARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></li>';
    completedButton.classList.add("completed-btn");
    todoDiv.appendChild(completedButton);
    //TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    todoList.appendChild(todoDiv);
    let temp = todoInput.value;
    firebase.database().ref(`User/${uid}/${passedPushID}`).child("todos").push({
      item: todoInput.value,
      status: "uncompleted",
    });
    console.log(uid);
    todoInput.value = "";
    todoInput.focus();
    todoInput.select();
    todoButton.disabled = true;
    todoButton.classList.remove("enabledButton");
    todoButton.classList.add("disabledButton");
  }
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
    todo.classList.toggle("completed");
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
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

const todosSnapshotHandler = (snapshot) => {
  snapshot.forEach(function (childNodes) {
    console.log(childNodes);
    console.log(uid + "read ID");
    // childNodes.forEach(function (pushID) {
    //   console.log(pushID.key());
    //   // pushID.forEach(function (category) {
    //   //   createBoard(category.val(), pushID.key);
    //   // });
    // });
  });
};

// (function () {
//   const newTodoItem = document.createElement("div");
//   newTodoItem.classList.add("todo");
//   //let firebase = app_firebase;
//   firebase
//     .database()
//     .ref(`User/${uid}/${passedPushID}/todos`)
//     .once("value", todosSnapshotHandler);
//   console.log(uid);
//   firebase
//     .database()
//     .ref(`User/${uid}/${passedPushID}/todos`)
//     .on("child_added", todosSnapshotHandler);
// })();

document.onload = function () {
  const newTodoItem = document.createElement("div");
  newTodoItem.classList.add("todo");
  //let firebase = app_firebase;
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos`)
    .once("value", todosSnapshotHandler);
  console.log(uid);
  firebase
    .database()
    .ref(`User/${uid}/${passedPushID}/todos`)
    .on("child_added", todosSnapshotHandler);
};

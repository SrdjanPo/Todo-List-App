let categoryClicked = "";
const firebase = app_firebase;
const categoryContainer = document.querySelector(".category-container");
var modal = document.getElementById("categoryModal");
var newCategoryBtn = document.getElementsByClassName("category-new-box");
var span = document.getElementsByClassName("close")[0];
const modalInputValue = document.getElementsByClassName("modal-input")[0];
const createBoardModalBtn = document.getElementById("newCategoryModalBtn");

newCategoryBtn[0].onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function goBack() {
  window.history.back();
}
createBoardModalBtn.onclick = (event) => {
  event.preventDefault();
  createCategory();
  modalInputValue.value = "";
  modal.style.display = "none";
};

function createCategory() {
  if (modalInputValue.value.length > 0) {
    firebase.database().ref(`User/${uid}`).push({
      category: modalInputValue.value,
    });
  } else {
    console.log("Input is empty");
  }
}

function createBoard(boardText, boardID) {
  const newCategory = document.createElement("div");
  newCategory.classList.add("category-box");
  newCategory.innerText = boardText;
  const deleteCategory = document.createElement("span");
  deleteCategory.innerText = "X";
  deleteCategory.classList.add("delete-category-btn");
  deleteCategory.onclick = (e) => {
    e.stopPropagation();
    firebase.database().ref(`User/${uid}/${boardID}`).remove();
    newCategory.remove();
  };
  newCategory.appendChild(deleteCategory);
  categoryContainer.prepend(newCategory);
  newCategory.onclick = function () {
    categoryClicked = boardText;
    window.location.replace(
      "authSuccessful.html" +
        "?pushID=" +
        boardID +
        "&category=" +
        categoryClicked
    );
  };
}

//Firebase query handler
const snapshotHandler = (categorySnapshot) => {
  if (!(categorySnapshot.key == uid)) {
    categorySnapshot.forEach(function (childNodes) {
      if (childNodes.key == "category") {
        createBoard(childNodes.val(), categorySnapshot.key);
      }
    });
  }
};

//Firebase events for initial UI elements and for every child added
document.addEventListener("userAuthed", () => {
  firebase.database().ref(`User/${uid}`).once("value", snapshotHandler);
  firebase.database().ref(`User/${uid}`).on("child_added", snapshotHandler);
});

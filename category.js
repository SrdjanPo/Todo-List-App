//Selectors
const categoryContainer = document.querySelector(".category-container");

// Get the modal
var modal = document.getElementById("categoryModal");

// Get the button that opens the modal
var newCategoryBtn = document.getElementsByClassName("category-new-box");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the text from input
const modalInputValue = document.getElementsByClassName("modal-input")[0];

// Get the "Create Board" button from modal
const createBoardModalBtn = document.getElementById("newCategoryModalBtn");

// When the user clicks on the button, open the modal
newCategoryBtn[0].onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

createBoardModalBtn.onclick = function (event) {
  event.preventDefault();
  createCategory();
  modalInputValue.value = "";
  modal.style.display = "none";
};

function createCategory() {
  const newCategory = document.createElement("div");
  newCategory.classList.add("category-box");
  if (modalInputValue.value.length > 0) {
    newCategory.innerText = modalInputValue.value;
    categoryContainer.prepend(newCategory);
    let firebase = app_firebase;
    firebase
      .database()
      .ref("User/" + uid)
      .push({
        category: modalInputValue.value,
      });
  } else {
    console.log("Input is empty");
  }
}

function createAddNewBoardBtn() {
  const newBoard = document.createElement("div");
  newBoard.innerHTML = "Create new board";
  newBoard.classList.add("category-new-box");
  newBoard.onclick = function () {
    modal.style.display = "block";
  };
  categoryContainer.append(newBoard);
}

window.onload = function readCategories() {
  //createAddNewBoardBtn();

  const newCategory = document.createElement("div");
  newCategory.classList.add("category-box");
  let firebase = app_firebase;
  let categoryArray = [];
  firebase
    .database()
    .ref("User/" + uid)
    .on("value", function (snapshot) {
      snapshot.forEach(function (childNodes) {
        childNodes.forEach(function (pushID) {
          pushID.forEach(function (category) {
            categoryArray.push(category.val());
            const newCategory = document.createElement("div");
            newCategory.classList.add("category-box");
            newCategory.innerText = category.val();
            categoryContainer.prepend(newCategory);
          });
        });
      });
    });
};

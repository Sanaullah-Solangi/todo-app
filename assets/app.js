//! GETTING ELEMENTS
var list = document.querySelector(".list"); // IT IS TODO LIST
var showDeleteAllBtn = document.querySelector(".deleteAllBtn"); // DELETE ALL BTN
var pendingTodos = document.querySelector(".pendingTodos"); // PENDING TODO'S SPAN
var completedTodos = document.querySelector(".completedTodos"); // COMPLETED TODO'S SPAN
var pendingTodo = 0;
var completedTodo = 0;
var deletedTodo = 0;
//! ADDING TODOS IN LIST
function addTodo() {
  // GETTING VALUE FROM INPUT
  var todo = document.querySelector("#todo");
  if (todo.value) {
    todo.placeholder = "Enter your todo";
    // ADDING 'li' IN TODO LIST
    list.innerHTML += `
  <li class="w-100 d-flex jc-between">
  <input disabled type="text" value="${todo.value}">
  <div class="listBtns d-flex jc-center">
   <!--!?=== edit btn ===-->
  <div class="editBtn pointer d-flex jc-center al-center" onclick="editList(this)">
  <i class="fa-solid fa-pen-to-square"></i>
  </div>
  <!--!?=== delete btn ===-->
  <div class="deleteBtn pointer d-flex jc-center al-center" onclick="deleteList(this)">
  <i class="fa-solid fa-trash"></i>
  </div>
  <!--!?=== check btn ===-->
  <div id="checked" class="checkbtn pointer d-flex jc-center al-center" onclick="checkList(this)">
  <i class="fa-solid fa-check"></i>
  </div>
  </div>
  </li>`;
    // EMPTY USER INPUT AFTER ASSINGNING IT'S VALUE TO THE 'li'
    todo.value = "";
    // CALLING SHOW DELETE ALL BTN WHEN 'lis' ARE ADDED
    showDelAllHistoryBtn();
    pendingTodo++;
    showStatus(pendingTodo, completedTodo);
  } else {
    todo.placeholder = "please Enter any value";
  }
}
//! CALLING 'addTodo()' FUNCTION ON 'ENTER KEY'
function addTodoOnEnter(event) {
  if (event.keyCode === 13) {
    // CALLING FUNCTION TO ADD 'li' TO THE LIST
    addTodo();
    // CALLING SHOW DELETE ALL BTN WHEN 'lis' ARE ADDED
    showDelAllHistoryBtn();
    // CALLING 'showStatus()' FUNCTION TO SHOW PENDING & COMPLETED TODOS
  }
}

//! FUNCTION TO EDIT VALUE
function editList(btn) {
  // GETTING ELEMENT
  btn.parentElement.parentElement.childNodes[1].removeAttribute("disabled");
  btn.parentElement.parentElement.childNodes[1].setAttribute(
    "onkeypress",
    "updateList(event)"
  );
  btn.parentElement.parentElement.childNodes[1].value = "";
  btn.parentElement.parentElement.childNodes[1].focus();
}
//! FUNCTION TO UPDATE VALUE
function updateList(event) {
  if (event.keyCode == 13) {
    event.target.setAttribute("disabled", "true");
  }
}
//! FUNCTION TO CHECK LIST
var checkCounter = 0; // TO CALCULATEF PENDING & COMPLETED TODOS
function checkList(btn) {
  // GETTING TODO'S VALUE
  var parent = btn.parentElement.parentElement.childNodes[1];
  // CONDITIONS TO CHECK OR UNCHECK TODO ITEM
  if (btn.hasAttribute("id")) {
    parent.style.textDecoration = "line-through";
    parent.style.textDecorationColor = "green";
    btn.style.backgroundColor = "var(--mainColor1)";
    btn.removeAttribute("id");
    // INCREAMENTING COUNTER IF ANY TASK IS COMPLETED
    completedTodo++;
    pendingTodo--;
    showStatus(pendingTodo, completedTodo);
  } else {
    parent.style.textDecoration = "none";
    btn.style.backgroundColor = "var(--mainColor2)";
    btn.setAttribute("id", "checked");
    // DECREAMENTING COUNTER IF ANY TASK IS CHECKED BY MISTAKE
    completedTodo--;
    pendingTodo++;
    showStatus(pendingTodo, completedTodo);
  }
}

//! FUNCTION TO DELETE LIST
function deleteList(btn) {
  // GETTING ALL 'lis' IN TODO LIST
  var li = document.querySelectorAll(".list > li");
  if (li.length != 1) {
    // IF THERE ARE MORE THAN ONE LI THAN DELETE SELECTEDF LI
    btn.parentElement.parentElement.remove();
  } else {
    // IF JUST ONE 'li' IS REMAINING THAN EPMTY THE TODO LIST
    list.innerHTML = "";
  }
  // SHOWING OR HIDING DELETE ALL BTN
  setTimeout(showDelAllHistoryBtn, 300);
  if (checkbtn.hasAttribute("id")) {
    console.log(checkbtn);
    console.log("hang");
    pendingTodo--;
    showStatus(pendingTodo, completedTodo);
  }
}

//! FUNCTION TO SHOW & HIDE THE 'CLEAR ALL HISTORY' BUTTON
function showDelAllHistoryBtn() {
  if (list.innerHTML) {
    // DELETE ALL BTN WILL APEAR IF THERE IS ANY VALUE IN TODO LIST
    showDeleteAllBtn.classList.add("showDeleteAllBtn");
  } else {
    // IT WILL DISAPEAR IF TODO LIST IS EMPTY
    showDeleteAllBtn.classList.remove("showDeleteAllBtn");
  }
}

//! FUNCTION TO CLEAR ALL HISTORY & HIDE 'ALL CLEAR' BUTTON
showDeleteAllBtn.addEventListener("click", () => {
  list.innerHTML = ""; // EMPTY TODO LIST
  setTimeout(showDelAllHistoryBtn, 300); // HIDING DELETE ALL BTN
});

//! FUNCTION TO SHOW STATUS
function showStatus(pending, completed) {
  pendingTodos.innerHTML = `pending todos are ${pending}`;
  completedTodos.innerHTML = `completed todos are ${completed}`;
}

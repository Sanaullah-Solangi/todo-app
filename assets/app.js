//! GETTING ELEMENTS
var list = document.querySelector(".list"); // IT IS TODO LIST
var showDeleteAllBtn = document.querySelector(".deleteAllBtn"); // DELETE ALL BTN
var pendingTodos = document.querySelector(".pendingTodos"); // PENDING TODO'S SPAN
var completedTodos = document.querySelector(".completedTodos"); // COMPLETED TODO'S SPAN
//! ADDING TODOS IN LIST
function addTodo() {
  // GETTING VALUE FROM INPUT
  var todo = document.querySelector("#todo");
  if (todo.value) {
    todo.placeholder = "Enter your todo";
    // ADDING 'li' IN TODO LIST
    list.innerHTML += `
  <li class="w-100 d-flex jc-between pending">
  <input class="liInput" disabled type="text" value="${todo.value}">
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
    // UPDATING PENDING TODOS LENGTH
    updateStatus();
    list.scrollTop = list.scrollHeight;
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
  var li = btn.closest("li");
  var liInput = li.querySelector("input");
  liInput.removeAttribute("disabled");
  liInput.setAttribute("onkeypress", "updateList(event)");
  liInput.value = "";
  liInput.focus();
  btn.style.backgroundColor = "var(--mainColor1)";
  liInput.style.borderBottom = "3px solid red";
}
//! FUNCTION TO UPDATE VALUE
function updateList(event) {
  if (event.keyCode == 13) {
    event.target.setAttribute("disabled", "true");
    var editBtn = document.querySelector(".editBtn");
    editBtn.style.backgroundColor = "var(--mainColor2)";
    event.target.closest("li").style.borderBottom =
      "1px solid rgba(0, 0, 0, 0.3)";
  }
}
//! FUNCTION TO CHECK LIST
function checkList(btn) {
  // GETTING TODO'S VALUE
  var li = btn.closest("li");
  var liInput = li.querySelector("input");
  // CONDITIONS TO CHECK OR UNCHECK TODO ITEM
  if (li.classList.contains("pending")) {
    liInput.style.textDecoration = "line-through";
    liInput.style.textDecorationColor = "green";
    btn.style.backgroundColor = "var(--mainColor1)";
    // REPLACING PENDING CLASS WITH COMPLETED IF ANY TASK IS COMPLETED
    li.classList.replace("pending", "completed");
    updateStatus();
  } else {
    liInput.style.textDecoration = "none";
    btn.style.backgroundColor = "var(--mainColor2)";
    // REPLACING PENDING CLASS WITH COMPLETED IF ANY TASK IS COMPLETED
    li.classList.replace("completed", "pending");
    updateStatus();
  }
}

//! FUNCTION TO DELETE LIST
function deleteList(btn) {
  // GETTING ALL 'lis' IN TODO LIST
  var li = document.querySelectorAll(".list > li");
  if (li.length != 1) {
    // IF THERE ARE MORE THAN ONE LI THAN DELETE SELECTEDF LI
    btn.closest("li").remove();
  } else {
    // IF JUST ONE 'li' IS REMAINING THAN EPMTY THE TODO LIST
    list.innerHTML = "";
  }
  // SHOWING OR HIDING DELETE ALL BTN
  setTimeout(showDelAllHistoryBtn, 300);
  updateStatus();
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
  updateStatus(); // UPDATING THE LENGTH OF LIS
  setTimeout(showDelAllHistoryBtn, 300); // HIDING DELETE ALL BTN
});

//! FUNCTION TO SHOW STATUS
function updateStatus() {
  var pendings = document.querySelectorAll(".pending");
  var completed = document.querySelectorAll(".completed");
  pendingTodos.innerHTML = `pending todos are ${pendings.length}`;
  completedTodos.innerHTML = `completed todos are ${completed.length}`;
}

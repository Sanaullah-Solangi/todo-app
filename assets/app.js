//! GETTING ELEMENTS
import {
  app,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  provider,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getFirestore,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./firebase.js";

let list = document.querySelector(".list"); // IT IS TODO LIST
let showDeleteAllBtn = document.querySelector(".deleteAllBtn"); // DELETE ALL BTN
let pendingTodos = document.querySelector(".pendingTodos"); // PENDING TODO'S SPAN
let completedTodos = document.querySelector(".completedTodos"); // COMPLETED TODO'S SPAN
let editBtn = document.querySelectorAll(".editBtn");
let logInContainer = document.querySelector(".logInContainer");
let capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let smallLetters = "abcdefghijklmnopqrstuvwxyz";
let numbers = "0123456789";
let symbols = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
let storPassword = "";
let nameValidation;
let emailValidation;
let passwordValidation;
let spiner = document.querySelector(".spinerContainer");
let spinerText = document.querySelector(".spinerText");
//! VALIDATE THE UESR NAME USING REGULAR EXPRESSION.
window.validateName = function (event) {
  const usernameRegex = /^(?!\s*$).+/;
  let name = document.querySelector("#name");
  if (!usernameRegex.test(name.value)) {
    nameValidation = false;
    return false;
  }
  nameValidation = true;
};

//! VALIDATE THE EMAIL ADDRESS USING REGULAR EXPRESSION.
window.validateEmail = function (event) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let email = document.querySelector("#email");
  if (!emailRegex.test(email.value)) {
    emailValidation = false;
    return false;
  }
  emailValidation = true;
};

//! VALIDATE THE PASSWORD USING REGULAR EXPRESSION.
window.validatePassword = function (event) {
  const passwordRegex = /^.{6,}$/;
  let password = document.querySelector("#password");
  if (!passwordRegex.test(password.value)) {
    passwordValidation = false;
    return false;
  }
  passwordValidation = true;
};

//! UPDATING LABLE'S POSITOIN OF PLACEHOLDER ON THE LENGTH OF INPUT
window.updateLabelPosition = function (event) {
  let input = event.target;
  let inputCover = input.closest(".inputCover");
  let label = inputCover.querySelector("label");
  if (input.value.length > 0) {
    label.classList.add("labelPositionChange");
  } else {
    label.classList.remove("labelPositionChange");
  }
};

//! TOGGLE THE VISIBILITY OF THE PASSWORD FIELD.
window.togglePasswordVisibility = function () {
  let password = document.querySelector("#password");
  let showPassword = document.querySelector(".show");
  let hidePassword = document.querySelector(".hide");
  if (password.type == "password") {
    showPassword.classList.toggle("d-none");
    hidePassword.classList.toggle("d-none");
    password.type = "text";
  } else {
    showPassword.classList.toggle("d-none");
    hidePassword.classList.toggle("d-none");
    password.type = "password";
  }
};

//! PROGRAME TO CHECK PASSWORD STRENGTH LEVEL IN SIGNUP FORM
window.checkPasswordStatus = function () {
  var password = document.querySelector("#password");
  storPassword = password.value;
  var smallLettersFlag = false;
  var capitalLettersFlag = false;
  var numbersFlag = false;
  var symbolsFlag = false;
  let char;
  for (var i = 0; i < password.value.length; i++) {
    char = storPassword[i];
    if (capitalLetters.includes(char)) capitalLettersFlag = true;
    if (smallLetters.includes(char)) smallLettersFlag = true;
    if (numbers.includes(char)) numbersFlag = true;
    if (symbols.includes(char)) symbolsFlag = true;
  }
  showPasswordStatus(
    capitalLettersFlag,
    smallLettersFlag,
    numbersFlag,
    symbolsFlag
  );
};

//! FUNCTION TO SHOW STRENTH OF PASSWORD IN SINGUP FORM
window.showPasswordStatus = function (
  capsFlag,
  smallsFlag,
  numsFlag,
  symsFlag
) {
  let password = document.querySelector("#password");
  var strength = capsFlag + smallsFlag + numsFlag + symsFlag;
  //? conditional statements
  if (strength === 4) {
    password.style.border = "2px solid green";
  } else if (strength === 3) {
    password.style.border = "2px solid blue";
  } else if (strength === 2) {
    password.style.border = "2px solid orange";
  } else if (strength === 1) {
    password.style.border = "2px solid red";
  } else {
    password.style.border = "2px solid var(--mainColor3)";
  }
};

//! SIGN UP FUNCTION.
window.signUp = function () {
  let name = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let inputs = document.querySelectorAll("input");
  let formData = true;
  let lables = [];
  for (let input of inputs) {
    let inputCover = input.closest(".inputCover");
    let label = inputCover.querySelector("label");
    lables.push(label);
    if (!input.value) {
      formData = false;
    }
  }
  if (formData) {
    validateName();
    validateEmail();
    validatePassword();
    if (!nameValidation) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Sorry...",
        text: "Please enter a valid username.",
      });
      nameValidation = true;
    } else if (!emailValidation) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Sorry...",
        text: "Please enter a valid email address.",
      });
      emailValidation = true;
    } else if (!passwordValidation) {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Sorry...",
        text: "Password must be at least 6 characters long.",
      });
      passwordValidation = true;
    } else if (nameValidation && emailValidation && passwordValidation) {
      spinerText.innerHTML = "Please wait while we create your account...";
      spiner.classList.replace("d-none", "d-flex");

      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          const user = userCredential.user;

          //* SENDING VARIFICATION EMAIL
          sendEmailVerification(auth.currentUser).then(() => {
            spiner.classList.replace("d-flex", "d-none");
            //* SENDING DATA TO THE FIRESTORE DATA BASE & SWITCHING TO THE LOGIN PAGE
            addUserDataToFireStore(user);
            //* DOING EMPTY ALL INPUTS
            name.value = "";
            email.value = "";
            password.value = "";
          });
          // Swal.fire({
          //   customClass: {
          //     container: "sweatContainer",
          //     popup: "sweatPopup",
          //     title: "sweatTitle",
          //     htmlContainer: "sweatPara",
          //     confirmButton: "sweatBtn",
          //     cancelButton: "sweatBtn",
          //   },
          //   icon: "success",
          //   title: "Congratulations!",
          //   text: "You are logged in. A verification email has been sent to your email address. Please verify it.",
          // });
          //* UPDATING POSITION OF LABLES
          lables.forEach((label) => {
            label.classList.remove("labelPositionChange");
          });
          lables = [];
        })
        .catch((error) => {
          spiner.classList.replace("d-flex", "d-none");

          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode == "auth/network-request-failed") {
            Swal.fire({
              customClass: {
                container: "sweatContainer",
                popup: "sweatPopup",
                title: "sweatTitle",
                htmlContainer: "sweatPara",
                confirmButton: "sweatBtn",
                cancelButton: "sweatBtn",
              },
              icon: "error",
              title: "Network Error",
              text: "A network error occurred. Please check your internet connection and try again.",
            });
          } else {
            Swal.fire({
              customClass: {
                container: "sweatContainer",
                popup: "sweatPopup",
                title: "sweatTitle",
                htmlContainer: "sweatPara",
                confirmButton: "sweatBtn",
                cancelButton: "sweatBtn",
              },
              icon: "error",
              title: "User Already Exists",
              text: "An account with this email already exists.",
            });
          }
        });
    }
  } else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "sorry...",
      text: "please enter complete detail!",
    });
    formData = true;
  }
};

//! SIGN UP WITH GOOGLE
window.signUpWithGoogle = function () {
  let name = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      //* SENDING VARIFICATION EMAIL
      sendEmailVerification(auth.currentUser).then(() => {
        //* SENDING DATA TO THE FIRESTORE DATA BASE & SWITCHING TO THE LOG IN PAGE
        addUserDataToFireStore(user);

        //* DOING EMPTY ALL INPUTS
        name.value = "";
        email.value = "";
        password.value = "";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "User Already Exists",
        text: "An account with this email already exists.",
      });
    });
};

//! LOG IN FUNCTION
window.logIn = function () {
  let email = logInContainer.querySelector("#email");
  let password = logInContainer.querySelector("#password");
  let inputs = logInContainer.querySelectorAll("input");
  let lables = [];
  let formData = true;
  for (let input of inputs) {
    let inputCover = input.closest(".inputCover");
    let label = inputCover.querySelector("label");
    lables.push(label);
    if (!input.value) {
      formData = false;
    }
  }

  if (formData) {
    spinerText.innerHTML = "Logging you in...";
    spiner.classList.replace("d-none", "d-flex");
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        spiner.classList.replace("d-flex", "d-none");
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "success",
          title: "Welcome Back!",
          text: "You have successfully logged in. Welcome back!",
        });

        //* DOING EMPTY ALL INPUTS
        email.value = "";
        password.value = "";

        //* UPDATING POSITION OF LABLES
        lables.forEach((label) => {
          label.classList.remove("labelPositionChange");
        });
        lables = [];

        const user = userCredential.user;
        localStorage.setItem("uid", user.uid);
        setTimeout(() => {
          location.href = "../main.html";
        }, 2000);
      })
      .catch((error) => {
        spiner.classList.replace("d-flex", "d-none");

        const errorCode = error.code;
        const errorMessage = error.message;
        if (error.code === "auth/user-not-found") {
          // Show "User Not Found" error alert
          Swal.fire({
            customClass: {
              container: "sweatContainer",
              popup: "sweatPopup",
              title: "sweatTitle",
              htmlContainer: "sweatPara",
              confirmButton: "sweatBtn",
              cancelButton: "sweatBtn",
            },
            icon: "error",
            title: "User Not Found",
            text: "No account found with this email. Please check your email or sign up.",
          });
        } else if (error.code === "auth/invalid-credential") {
          Swal.fire({
            customClass: {
              container: "sweatContainer",
              popup: "sweatPopup",
              title: "sweatTitle",
              htmlContainer: "sweatPara",
              confirmButton: "sweatBtn",
              cancelButton: "sweatBtn",
            },
            icon: "error",
            title: "Invalid Credential",
            text: "Please check your email or password.",
          });
        } else {
          // Handle other errors here
          Swal.fire({
            customClass: {
              container: "sweatContainer",
              popup: "sweatPopup",
              title: "sweatTitle",
              htmlContainer: "sweatPara",
              confirmButton: "sweatBtn",
              cancelButton: "sweatBtn",
            },
            icon: "error",
            title: "Authentication Error",
            text: `Error: ${error.message}`,
          });
          console.log(errorCode);
        }
      });
  } else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "sorry...",
      text: "please enter complete detail!",
    });
    formData = true;
  }
};

window.logOut = function () {
  spinerText.innerHTML = "logging you out";
  spiner.classList.replace("d-none", "d-flex");
  signOut(auth)
    .then(() => {
      spiner.classList.replace("d-flex", "d-none");

      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
      });
      setTimeout(() => {
        location.href = "../logIn.html";
      }, 2000);
    })

    .catch((error) => {
      spiner.classList.replace("d-flex", "d-none");

      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "Logout Failed",
        text: "An error occurred while logging out. Please try again.",
      });

      // An error happened.
    });
};

//!SEND USER DATA TO FIRESTORE DATABASE
window.addUserDataToFireStore = async function (user) {
  spinerText.innerHTML = "Almost done, saving your data...";
  spiner.classList.replace("d-none", "d-flex");
  try {
    const response = await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      emailVarification: user.emailVerified,
      uid: user.uid,
      todos: [],
    });
    spiner.classList.replace("d-flex", "d-none");
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "success",
      title: "Account Created!",
      text: "Your account has been created successfully. A verification email has been sent to your email address. Please verify it.",
    });

    setTimeout(() => {
      location.href = "../logIn.html";
    }, 1000);
  } catch (error) {
    spiner.classList.replace("d-flex", "d-none");
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Error",
      text: "Failed to save your data. Please try again.",
    });

    console.log(error);
  }
};

window.updateTodoStatusInFireStore = async function (val, status) {
  spinerText.innerHTML = "Updating todo status... Please wait.";
  spiner.classList.replace("d-none", "d-flex");
  let currentUserUid = localStorage.getItem("uid");
  const userRef = doc(db, "users", currentUserUid);
  const userData = await getDoc(userRef);
  let arrayOfTodos = userData.data().todos;
  arrayOfTodos.forEach((todoObj, objInd) => {
    if (todoObj.value == val) {
      if (status == "pending") {
        arrayOfTodos[objInd].status = "completed";
      } else {
        arrayOfTodos[objInd].status = "pending";
      }
    }
  });
  await updateDoc(userRef, {
    todos: arrayOfTodos,
  });
  spiner.classList.replace("d-flex", "d-none");
  getUserDataFromFireStore();
};

//!GETTING USER DATA FROM FIRESTORE DATABASE
window.getUserDataFromFireStore = async function (user) {
  spinerText.innerHTML = "Retrieving your todo list...";
  spiner.classList.replace("d-none", "d-flex");
  try {
    let currentUserUid = localStorage.getItem("uid");
    const userRef = doc(db, "users", currentUserUid);
    const userData = await getDoc(userRef);
    spiner.classList.replace("d-flex", "d-none");

    if (userData.exists()) {
      let data = userData.data();
      let todos = data.todos;
      list.innerHTML = "";
      for (let todo of todos) {
        // ADDING 'li' IN TODO LIST
        list.innerHTML += `
          <li class="w-100 d-flex jc-between ${
            todo.status == "pending" ? "pending" : "completed"
          }">
          <input class="liInput" disabled type="text" value="${todo.value}">
          <div class="listBtns d-flex jc-center">
           <!--!?=== edit btn ===-->
          <div class="editBtn pointer d-flex jc-center al-center" onclick="modifyTodo(this)">
          <i class="fa-solid fa-pen-to-square" ></i>
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
      }
      // SHOWING OR HIDING DELETE ALL BTN
      checkList();
      updateStatus();
      setTimeout(showDelAllHistoryBtn, 300);
      list.scrollTop = list.scrollHeight;
    } else {
      Swal.fire({
        customClass: {
          container: "sweatContainer",
          popup: "sweatPopup",
          title: "sweatTitle",
          htmlContainer: "sweatPara",
          confirmButton: "sweatBtn",
          cancelButton: "sweatBtn",
        },
        icon: "error",
        title: "No Data Available",
        text: "You have no todos. Please add some todos first.",
      });

      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
    spiner.classList.replace("d-flex", "d-none");
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Error",
      text: "An error occurred while fetching data. Please try again later.",
    });
  }
};

//! RESET PASSWORD
window.resetPassword = function () {
  let email = logInContainer.querySelector("#email");
  let formData = true;
  if (!email.value) {
    formData = false;
  }

  if (formData) {
    sendPasswordResetEmail(auth, email.value)
      .then(() => {
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "success",
          title: "Email Sent!",
          text: "Password reset email has been sent to your email. Please check your inbox.",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          customClass: {
            container: "sweatContainer",
            popup: "sweatPopup",
            title: "sweatTitle",
            htmlContainer: "sweatPara",
            confirmButton: "sweatBtn",
            cancelButton: "sweatBtn",
          },
          icon: "error",
          title: "Error",
          text: `Error: ${errorMessage}`,
        });
      });
  } else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "Sorry...",
      text: "Please fill in the email field.",
    });

    formData = true;
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user);
    if (location.pathname == "/main.html") {
      getUserDataFromFireStore();
    }

    // ...
  } else {
    // User is signed out
    console.log("user not exist");
    // ...
  }
});

//! ADD TODOS IN FIRESTORE DATABASE
window.addTodoToFireStore = async (val) => {
  spinerText.innerHTML = "Adding your todo to the list...";
  // console.log(auth.currentUser);
  spiner.classList.replace("d-none", "d-flex");
  let currentUserUid = localStorage.getItem("uid");
  const washingtonRef = doc(db, "users", currentUserUid);
  try {
    await updateDoc(washingtonRef, {
      todos: arrayUnion({ value: val, status: "pending" }),
    });
    spiner.classList.replace("d-flex", "d-none");
    getUserDataFromFireStore();
  } catch (error) {
    spiner.classList.add("d-none");
    spiner.classList.remove("d-flex");
    console.log("arrError", error);
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Error",
      text: "Failed to add your todo. Please try again later.",
    });
  }
};

//! DELETE TODOS FROM FIRESTORE DATABASE
window.delTodoFromFireStore = async (val, sta = "pending") => {
  spinerText.innerHTML = "Deleting your todo item...";
  spiner.classList.replace("d-none", "d-flex");
  // console.log(auth.currentUser);
  let currentUserUid = localStorage.getItem("uid");
  const washingtonRef = doc(db, "users", currentUserUid);
  try {
    await updateDoc(washingtonRef, {
      todos: arrayRemove({ value: val, status: sta }),
    });
    spiner.classList.replace("d-flex", "d-none");
    getUserDataFromFireStore();
  } catch (error) {
    spiner.classList.replace("d-flex", "d-none");
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "error",
      title: "Error",
      text: "An error occurred while deleting your todo item. Please try again.",
    });

    console.log("arrError", error);
  }
  // Atomically add a new region to the "regions" array field.
};

//! ADDING TODOS IN LIST
window.addTodo = function () {
  // GETTING VALUE FROM INPUT
  let todoInput = document.querySelector("#todo");
  if (todoInput.value) {
    todoInput.placeholder = "Enter your todo";
    list.innerHTML = "";
    addTodoToFireStore(`${todoInput.value}`);
    // EMPTY USER INPUT AFTER ASSINGNING IT'S VALUE TO THE 'li'
    todoInput.value = "";
  } else {
    Swal.fire({
      customClass: {
        container: "sweatContainer",
        popup: "sweatPopup",
        title: "sweatTitle",
        htmlContainer: "sweatPara",
        confirmButton: "sweatBtn",
        cancelButton: "sweatBtn",
      },
      icon: "warning",
      title: "Warning",
      text: "Please enter something before trying to add!",
    });
  }
};

//! CALLING 'addTodo()' FUNCTION ON 'ENTER KEY'
todo.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    // CALLING FUNCTION TO ADD 'li' TO THE LIST
    addTodo();
    // CALLING SHOW DELETE ALL BTN WHEN 'lis' ARE ADDED
    showDelAllHistoryBtn();
    // CALLING 'showStatus()' FUNCTION TO SHOW PENDING & COMPLETED TODOS
  }
});

//! FUNCTION TO EDIT VALUE
let inputValue;
window.modifyTodo = function (btn) {
  let li = btn.closest("li");
  let liInput = li.querySelector("input");
  liInput.setAttribute("onkeypress", "updataTodo(event)");
  liInput.removeAttribute("disabled");
  inputValue = liInput.value;
  liInput.value = "";
  liInput.focus();
  btn.style.backgroundColor = "var(--mainColor1)";
  liInput.style.borderBottom = "3px solid red";
};
//! FUNCTION TO UPDATE VALUE
window.updataTodo = async function (event) {
  if (event.keyCode == 13) {
    spinerText.innerHTML = "updating todos... Please wait.";
    spiner.classList.replace("d-none", "d-flex");
    let input = event.target;
    let li = input.closest("li");
    let editBtn = li.querySelector(".editBtn");
    let currentUserUid = localStorage.getItem("uid");
    const userRef = doc(db, "users", currentUserUid);
    const userData = await getDoc(userRef);
    let arrayOfTodos = userData.data().todos;
    arrayOfTodos.forEach((todoObj, todoInd) => {
      if (todoObj.value == inputValue) {
        arrayOfTodos[todoInd].value = input.value;
      }
    });
    await updateDoc(userRef, {
      todos: arrayOfTodos,
    });
    input.setAttribute("disabled", "true");
    editBtn.style.backgroundColor = "var(--mainColor2)";
    input.style.borderBottom = "3px solid transparent";
    spiner.classList.replace("d-flex", "d-none");
    getUserDataFromFireStore();
  }
};
//! FUNCTION TO CHECK LIST
window.checkList = function (btn) {
  // GETTING TODO'S VALUE
  let lis = document.querySelectorAll(".list > li");
  if (btn) {
    let li = btn.closest("li");
    let liInput = li.querySelector("input");
    let statusClass = li.classList.contains("completed")
      ? "completed"
      : "pending";
    updateTodoStatusInFireStore(liInput.value, statusClass);
    // CONDITIONS TO CHECK OR UNCHECK TODO ITEM
  }
  lis.forEach((li) => {
    let liInput = li.querySelector("input");
    let btn = li.querySelector(".checkbtn");
    if (li.classList.contains("pending")) {
      liInput.style.textDecoration = "none";
      btn.style.backgroundColor = "var(--mainColor2)";
      // REPLACING PENDING CLASS WITH COMPLETED IF ANY TASK IS COMPLETED
    } else {
      liInput.style.textDecoration = "line-through";
      liInput.style.textDecorationColor = "green";
      btn.style.backgroundColor = "var(--mainColor1)";
      // REPLACING PENDING CLASS WITH COMPLETED IF ANY TASK IS COMPLETED
    }
  });
};

//! FUNCTION TO DELETE LIST
window.deleteList = function (btn) {
  let lis = document.querySelectorAll(".list > li"); // GETTING ALL 'lis' IN TODO LIST
  let li = btn.closest("li");
  let input = li.querySelector("input");
  let statusClass = li.classList.contains("completed")
    ? "completed"
    : "pending";

  // IF THERE ARE MORE THAN ONE LI THAN DELETE SELECTEDF LI
  if (lis.length != 1) {
    delTodoFromFireStore(input.value, statusClass);
    // btn.closest("li").remove();
  } else {
    // IF JUST ONE 'li' IS REMAINING THAN EPMTY THE TODO LIST
    list.innerHTML = "";
    delTodoFromFireStore(input.value, statusClass);
  }
};

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
showDeleteAllBtn.addEventListener("click", async () => {
  spinerText.innerHTML = "Deleting all todos... Please wait.";
  spiner.classList.replace("d-none", "d-flex");
  let currentUserUid = localStorage.getItem("uid");
  const userRef = doc(db, "users", currentUserUid);
  const userData = await getDoc(userRef);
  let arrayOfTodos = userData.data().todos;
  arrayOfTodos = [];
  await updateDoc(userRef, {
    todos: arrayOfTodos,
  });
  spiner.classList.replace("d-flex", "d-none");
  getUserDataFromFireStore();
});

//! FUNCTION TO SHOW STATUS
function updateStatus() {
  let pendings = document.querySelectorAll(".pending");
  let completed = document.querySelectorAll(".completed");
  pendingTodos.innerHTML = `pending todos are ${pendings.length}`;
  completedTodos.innerHTML = `completed todos are ${completed.length}`;
}

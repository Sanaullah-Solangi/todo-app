import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6qhGfmsASOQsEK4cFUSXSpus_rHoojJI",
  authDomain: "todo-app-e06f3.firebaseapp.com",
  projectId: "todo-app-e06f3",
  storageBucket: "todo-app-e06f3.appspot.com",
  messagingSenderId: "881204715034",
  appId: "1:881204715034:web:d70ca34d5d33140c81bba3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export {
  app,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  provider,
  signInWithPopup,
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
};

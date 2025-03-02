import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import { auth } from "./firebaseConfig.js";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

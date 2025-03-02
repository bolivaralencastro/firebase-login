import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_lM91RKrTdnz7zKirQTia7L7WXH-_8IA",
  authDomain: "fir-login-a10ce.firebaseapp.com",
  projectId: "fir-login-a10ce",
  storageBucket: "fir-login-a10ce.firebasestorage.app",
  messagingSenderId: "499292799259",
  appId: "1:499292799259:web:95c5f2868ae3bbf92693be"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
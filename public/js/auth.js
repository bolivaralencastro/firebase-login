// auth-fix.js
import { auth } from './firebaseConfig.js';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { updateUI } from './ui.js';

// Provedor de autenticação do Google
const provider = new GoogleAuthProvider();

// Função para fazer login com Google - versão simples e direta
export const loginWithGoogle = async () => {
  // Limpar qualquer estado persistente que possa estar causando o problema
  window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
  localStorage.clear();
  sessionStorage.clear();
  
  console.log("Estado antes do login:", auth.currentUser);
  
  try {
    // Usando popup diretamente - abordagem mais simples
    const result = await signInWithPopup(auth, provider);
    console.log("Login bem-sucedido:", result.user);
    updateUI(result.user);
    return result.user;
  } catch (error) {
    console.error("Erro detalhado durante login:", error);
    console.error("Código:", error.code);
    console.error("Mensagem:", error.message);
    
    if (error.code === 'auth/popup-blocked') {
      alert("Por favor, permita popups para este site e tente novamente.");
    } else {
      alert("Erro ao fazer login: " + error.message);
    }
    return null;
  }
};

// Função para fazer logout com limpeza completa
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logout realizado");
    
    // Limpar todos os caches e dados locais
    localStorage.clear();
    sessionStorage.clear();
    window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    
    // Forçar atualização da UI
    updateUI(null);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    alert("Erro ao fazer logout: " + error.message);
  }
};

// Inicialização simplificada
export const initAuth = () => {
  console.log("Inicializando sistema de autenticação...");
  
  // Monitorar mudanças de estado de autenticação
  auth.onAuthStateChanged((user) => {
    console.log("Estado de autenticação alterado:", user ? "Logado" : "Deslogado");
    updateUI(user);
  });
};
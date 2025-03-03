// main.js
import { initAuth } from './auth.js';
import { initUI } from './ui.js';

// Função principal para inicializar a aplicação
const initApp = () => {
  console.log('Inicializando aplicação...');
  
  // Limpar TUDO antes de iniciar
  localStorage.clear();
  sessionStorage.clear();
  
  try {
    window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
  } catch (e) {
    console.warn("Não foi possível limpar IndexedDB:", e);
  }
  
  // Inicializa a interface
  initUI();
  
  // Inicializa a autenticação
  initAuth();
  
  console.log('Aplicação inicializada com sucesso!');
};

// Inicializar somente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);
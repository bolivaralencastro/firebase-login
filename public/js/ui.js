// ui.js - versão simplificada
import { loginWithGoogle, logout } from './auth.js';
import { addPost, getPosts } from './firestore.js';
import { auth } from './firebaseConfig.js';

// Função para atualizar a interface
export const updateUI = (user) => {
  console.log("Atualizando UI para:", user ? "usuário logado" : "usuário deslogado");
  
  const loginSection = document.getElementById('login-section');
  const postSection = document.getElementById('post-section');
  const userInfo = document.getElementById('user-info');
  
  if (user) {
    // Usuário logado
    loginSection.style.display = 'none';
    postSection.style.display = 'block';
    userInfo.innerHTML = `
      <p>Bem-vindo, ${user.displayName || 'Usuário'}</p>
      <button id="logout-btn" class="btn">Sair</button>
    `;
    
    document.getElementById('logout-btn').onclick = logout;
    
    // Carregar posts
    loadPosts();
  } else {
    // Usuário deslogado
    loginSection.style.display = 'block';
    postSection.style.display = 'none';
    userInfo.innerHTML = '';
  }
};

// Função para carregar e exibir posts
export const loadPosts = async () => {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '<p>Carregando publicações...</p>';
  
  const posts = await getPosts();
  
  if (posts.length === 0) {
    postsList.innerHTML = '<p>Nenhuma publicação encontrada.</p>';
    return;
  }
  
  postsList.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>Por: ${post.userName} - ${post.createdAt.toDate ? post.createdAt.toDate().toLocaleString() : 'Data desconhecida'}</small>
    `;
    postsList.appendChild(postElement);
  });
};

// Inicializa elementos UI - versão simplificada
export const initUI = () => {
  // Configurar botão de login
  const loginButton = document.getElementById('login-btn');
  if (loginButton) {
    // Remover qualquer handler anterior
    loginButton.onclick = null;
    // Adicionar novo handler
    loginButton.onclick = () => {
      console.log("Botão de login clicado");
      loginWithGoogle();
    };
  }
  
  // Configurar formulário de post
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.onsubmit = async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('post-title').value;
      const content = document.getElementById('post-content').value;
      
      if (!title || !content) {
        alert('Por favor preencha todos os campos');
        return;
      }
      
      const user = auth.currentUser;
      if (!user) {
        alert('Você precisa estar logado para publicar');
        return;
      }
      
      const success = await addPost(title, content, user.uid, user.displayName || 'Usuário');
      
      if (success) {
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        loadPosts();
      }
    };
  }
};
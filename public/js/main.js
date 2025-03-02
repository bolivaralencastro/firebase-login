import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logout, 
  observeAuth, 
  resetPassword 
} from "./auth.js";

import { 
  saveData, 
  fetchUserData, 
  updateData, 
  removeData, 
  fetchAllPosts 
} from "./firestore.js";

import { 
  initTabs, 
  initThemeToggle, 
  showLoading, 
  hideLoading, 
  showMessage, 
  togglePostsView, 
  confirmAction 
} from "./ui.js";

// Seleção de elementos da interface
const loggedOutView = document.getElementById("loggedOutView");
const loggedInView = document.getElementById("loggedInView");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordLink = document.getElementById("forgotPassword");

const btnGoogle = document.getElementById("btnGoogle");
const btnLogout = document.getElementById("btnLogout");

const dataInput = document.getElementById("dataInput");
const btnSaveData = document.getElementById("btnSaveData");
const dataList = document.getElementById("dataList");
const dataMessage = document.getElementById("dataMessage");

const publicSearchInput = document.getElementById("publicSearchInput");
const publicSortSelect = document.getElementById("publicSortSelect");
const listViewBtn = document.getElementById("listViewBtn");
const gridViewBtn = document.getElementById("gridViewBtn");
const publicPostsList = document.getElementById("publicPostsList");

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

let currentUser = null;
let editingDocId = null;
let currentPage = 1;
const limit = 5;

function initApp() {
  initTabs();
  initThemeToggle();

  // Login via formulário
  if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = loginForm.querySelector("#loginEmail").value.trim();
          const password = loginForm.querySelector("#loginPassword").value.trim();
          try {
              showLoading();
              await loginWithEmail(email, password);
          } catch (error) {
              showMessage(loginForm.querySelector(".message"), parseAuthError(error), "error");
          } finally {
              hideLoading();
              loginForm.reset();
          }
      });
  }

  // Registro de usuário
  if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const name = registerForm.querySelector("#registerName").value.trim();
          const email = registerForm.querySelector("#registerEmail").value.trim();
          const password = registerForm.querySelector("#registerPassword").value.trim();
          const passwordConfirm = registerForm.querySelector("#registerPasswordConfirm").value.trim();

          if (password !== passwordConfirm) {
              showMessage(registerForm.querySelector(".message"), "As senhas não coincidem.", "error");
              return;
          }
          try {
              showLoading();
              await registerWithEmail(email, password);
              showMessage(registerForm.querySelector(".message"), "Registro bem-sucedido!", "success");
          } catch (error) {
              showMessage(registerForm.querySelector(".message"), parseAuthError(error), "error");
          } finally {
              hideLoading();
              registerForm.reset();
          }
      });
  }

  // Login com Google
  if (btnGoogle) {
      btnGoogle.addEventListener("click", async () => {
          try {
              showLoading();
              await loginWithGoogle();
          } catch (error) {
              const messageEl = loginForm.querySelector(".message");
              showMessage(messageEl, parseAuthError(error), "error");
          } finally {
              hideLoading();
          }
      });
  }

  // Esqueceu a senha
  if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", async (e) => {
          e.preventDefault();
          const email = prompt("Digite seu email para recuperação de senha:");
          if (email) {
              try {
                  showLoading();
                  await resetPassword(email);
                  alert("Email de recuperação enviado.");
              } catch (error) {
                  alert(parseAuthError(error));
              } finally {
                  hideLoading();
              }
          }
      });
  }

  // Logout
  if (btnLogout) {
      btnLogout.addEventListener("click", async () => {
          try {
              showLoading();
              await logout();
          } catch (error) {
              alert("Erro ao fazer logout.");
          } finally {
              hideLoading();
          }
      });
  }

  // Publicar ou atualizar publicação
  if (btnSaveData) {
      btnSaveData.addEventListener("click", async () => {
          const text = dataInput.value.trim();
          if (!text) {
              showMessage(dataMessage, "Digite algo para publicar.", "error");
              return;
          }
          try {
              showLoading();
              if (editingDocId) {
                  await updateData(editingDocId, text);
                  showMessage(dataMessage, "Publicação atualizada com sucesso!", "success");
                  editingDocId = null;
                  btnSaveData.textContent = "Publicar";
              } else {
                  await saveData(text, currentUser.uid);
                  showMessage(dataMessage, "Publicação salva com sucesso!", "success");
              }
              dataInput.value = "";
              loadUserData();
          } catch (error) {
              showMessage(dataMessage, "Erro ao salvar publicação.", "error");
          } finally {
              hideLoading();
          }
      });
  }

  // Pesquisa e ordenação de publicações públicas
  if (publicSearchInput) {
      publicSearchInput.addEventListener("input", () => {
          currentPage = 1;
          loadPublicPosts();
      });
  }

  if (publicSortSelect) {
      publicSortSelect.addEventListener("change", () => {
          currentPage = 1;
          loadPublicPosts();
      });
  }

  // Troca de visualização (lista/grade)
  if (listViewBtn && gridViewBtn) {
      listViewBtn.addEventListener("click", () => {
          listViewBtn.classList.add("active");
          gridViewBtn.classList.remove("active");
          togglePostsView("publicPostsContainer", "list");
      });
      gridViewBtn.addEventListener("click", () => {
          gridViewBtn.classList.add("active");
          listViewBtn.classList.remove("active");
          togglePostsView("publicPostsContainer", "grid");
      });
  }

  // Paginação de publicações públicas
  if (prevPageBtn && nextPageBtn) {
      prevPageBtn.addEventListener("click", () => {
          if (currentPage > 1) {
              currentPage--;
              loadPublicPosts();
          }
      });
      nextPageBtn.addEventListener("click", () => {
          currentPage++;
          loadPublicPosts();
      });
  }

  // Observador de autenticação
  observeAuth((user) => {
      currentUser = user;
      if (user) {
          loggedOutView.hidden = true;
          loggedInView.hidden = false;
          loadUserData();
      } else {
          loggedOutView.hidden = false;
          loggedInView.hidden = true;
          dataList.innerHTML = "";
      }
      loadPublicPosts();
  });
}

// Carrega publicações do usuário (dados privados) com paginação (exemplo simples)
async function loadUserData() {
    console.log("currentUser:", currentUser); // Adicione esta linha
  if (!currentUser) return;
  try {
      showLoading();
      const options = {
          search: "",
          sort: "recent",
          page: 1,
          limit: 10
      };
      const posts = await fetchUserData(currentUser.uid, options);
      dataList.innerHTML = "";
      posts.forEach(post => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${post.data}</span>
              <button class="edit-btn" data-id="${post.id}">Editar</button>
              <button class="delete-btn" data-id="${post.id}">Deletar</button>`;
          li.querySelector(".edit-btn").addEventListener("click", () => {
              dataInput.value = post.data;
              btnSaveData.textContent = "Atualizar";
              editingDocId = post.id;
          });
          li.querySelector(".delete-btn").addEventListener("click", async () => {
              const confirmed = await confirmAction("Tem certeza que deseja deletar esta publicação?");
              if (confirmed) {
                  try {
                      showLoading();
                      await removeData(post.id);
                      loadUserData();
                  } catch (error) {
                      alert("Erro ao deletar publicação.");
                  } finally {
                      hideLoading();
                  }
              }
          });
          dataList.appendChild(li);
      });
  } catch (error) {
      showMessage(dataMessage, "Erro ao carregar suas publicações.", "error");
  } finally {
      hideLoading();
  }
}

// Carrega publicações públicas com pesquisa, ordenação e paginação
async function loadPublicPosts() {
  try {
      showLoading();
      const options = {
          search: publicSearchInput ? publicSearchInput.value.trim() : "",
          sort: publicSortSelect ? publicSortSelect.value : "recent",
          page: currentPage,
          limit: limit
      };
      const posts = await fetchAllPosts(options);
      publicPostsList.innerHTML = "";
      posts.forEach(post => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${post.data}</span>`;
          publicPostsList.appendChild(li);
      });
      pageInfo.textContent = "Página " + currentPage;
      prevPageBtn.disabled = currentPage === 1;
  } catch (error) {
      console.error("Erro ao carregar publicações públicas:", error);
  } finally {
      hideLoading();
  }
}

// Converte códigos de erro do Firebase para mensagens amigáveis
function parseAuthError(error) {
  if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
       return "Email ou senha inválidos.";
  } else if (error.code === "auth/invalid-email") {
       return "Email inválido.";
  } else if (error.code === "auth/email-already-in-use") {
       return "Este email já está em uso.";
  } else {
       return "Ocorreu um erro. Tente novamente.";
  }
}

initApp();

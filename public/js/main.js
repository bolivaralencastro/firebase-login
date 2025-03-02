// main.js
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  observeAuth,
  saveData,
  fetchUserData,
  updateData,
  removeData,
  fetchAllPosts
} from "./auth.js";

// Elementos da Interface
const loggedOutView = document.getElementById("loggedOutView");
const loggedInView = document.getElementById("loggedInView");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnGoogle = document.getElementById("btnGoogle");
const btnLogout = document.getElementById("btnLogout");
const message = document.getElementById("message"); // Mensagem geral

// Elementos do Firestore
const dataInput = document.getElementById("dataInput");
const btnSaveData = document.getElementById("btnSaveData");
const dataList = document.getElementById("dataList");
const dataMessage = document.getElementById("dataMessage");
const publicPostsList = document.getElementById("publicPostsList");


let currentUser = null;
let editingDocId = null; // ID do documento em edição (null = criação)

// --- Funções de Autenticação ---

// Event Listener para o botão de Login com Email/Senha
btnLogin.addEventListener("click", async () => {
  message.textContent = ""; // Limpa mensagens anteriores
  try {
      await loginWithEmail(emailInput.value.trim(), passwordInput.value.trim());
      message.textContent = "Login bem-sucedido!";
      message.style.color = "green";

  } catch (error) {
      message.style.color = "red";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          message.textContent = "Email ou senha inválidos.";
      } else if (error.code === "auth/invalid-email") {
          message.textContent = "Email inválido.";
      } else {
          message.textContent = "Erro ao fazer login.";
          console.error(error);
      }
  } finally {
      emailInput.value = "";
      passwordInput.value = "";
  }
});

// Event Listener para o botão de Login com Google
btnGoogle.addEventListener("click", async () => {
  message.textContent = "";
  try {
      await loginWithGoogle();
      message.textContent = "Login com Google bem-sucedido!";
      message.style.color = "green";
  } catch (error) {
      message.textContent = "Erro ao fazer login com Google.";
      message.style.color = "red";
      console.error(error);
  }
});

// Event Listener para o botão de Logout
btnLogout.addEventListener("click", async () => {
  try {
      await logout();
      message.textContent = "Logout bem-sucedido!";
      message.style.color = "green";
  } catch (error) {
      message.textContent = "Erro ao fazer logout.";
      message.style.color = "red";
      console.error(error);
  }
});

// --- Observador de Autenticação ---
observeAuth(async (user) => {
  console.log("observeAuth chamado, user:", user);
  currentUser = user;

  loadPublicPosts(); // Carrega posts públicos sempre

  if (user) {
      loggedOutView.hidden = true;
      loggedInView.hidden = false;
      loadData(); // <-- Chama loadData() aqui (CORRIGIDO)
  } else {
      loggedOutView.hidden = false;
      loggedInView.hidden = true;
      dataList.innerHTML = ""; // Limpa dados privados
  }
});

// --- Funções do Firestore ---

// Função ÚNICA para lidar com o clique no botão "Salvar" (criação OU edição)
async function handleSaveClick() {
  dataMessage.textContent = "";
  if (!currentUser) {
      dataMessage.textContent = "Você precisa estar logado para salvar/editar dados.";
      dataMessage.style.color = "red";
      return;
  }

  const data = dataInput.value.trim();
  if (!data) {
      dataMessage.textContent = "Por favor, digite algo para salvar.";
      dataMessage.style.color = "red";
      return;
  }

  try {
      if (editingDocId) {
          // MODO DE EDIÇÃO
          await updateData(editingDocId, data);
          dataMessage.textContent = "Dado atualizado com sucesso!";
          editingDocId = null;
          btnSaveData.textContent = "Salvar";
      } else {
          // MODO DE CRIAÇÃO
          await saveData(data, currentUser.uid);
          dataMessage.textContent = "Dado salvo com sucesso!";
      }

      dataMessage.style.color = "green";
      await loadData(); // Recarrega dados PRIVADOS

  } catch (error) {
      dataMessage.textContent = "Erro ao salvar/atualizar dado.";
      dataMessage.style.color = "red";
      // console.error(error);  // Já estamos tratando o erro em auth.js
  } finally {
      dataInput.value = "";
  }
}

btnSaveData.addEventListener("click", handleSaveClick);

async function loadData() {
  if (!currentUser) {
      dataList.innerHTML = "";
      return;
  }

  dataList.innerHTML = ""; // Limpa a lista
  try {
      const data = await fetchUserData(currentUser.uid);
      data.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${item.data}</span>
              <button class="edit-btn" data-id="${item.id}">✏️ Editar</button>
              <button class="delete-btn" data-id="${item.id}">🗑️ Deletar</button>
          `;

          const editButton = li.querySelector(".edit-btn");
          const deleteButton = li.querySelector(".delete-btn");
          const span = li.querySelector("span");

          editButton.addEventListener("click", () => {
              editData(item.id, span.textContent);
          });

          deleteButton.addEventListener("click", async () => {
              try {
                  await removeData(item.id);
                  await loadData();
              } catch (error) {
                  alert("Erro ao remover dado: " + error.message);
              }
          });

          dataList.appendChild(li);
      });

  } catch (error) {
      dataMessage.textContent = "Erro ao carregar dados.";
      dataMessage.style.color = "red";
      console.error("Erro ao carregar dados:", error);
  }
}

function editData(docId, currentValue) {
  dataInput.value = currentValue;
  btnSaveData.textContent = "Atualizar";
  editingDocId = docId;
}

async function loadPublicPosts() {
  try {
      const data = await fetchAllPosts();
      publicPostsList.innerHTML = ""; // Limpa a lista pública
      data.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${item.data}</span>`;
          publicPostsList.appendChild(li);
      });
  } catch (error) {
      console.error("Erro ao carregar posts públicos:", error);
  }
}
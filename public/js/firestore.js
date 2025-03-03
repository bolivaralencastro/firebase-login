// firestore.js
import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Função para adicionar uma nova publicação
export const addPost = async (title, content, userId, userName) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      userId,
      userName,
      createdAt: Timestamp.now()
    });
    console.log("Publicação adicionada com ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Erro ao adicionar publicação:", error);
    alert("Erro ao adicionar publicação: " + error.message);
    return false;
  }
};

// Função para buscar todas as publicações
export const getPosts = async () => {
  try {
    // Usando query para ordenar por data de criação
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return posts;
  } catch (error) {
    console.error("Erro ao buscar publicações:", error);
    
    // Mensagem mais detalhada para o erro de permissões
    if (error.message.includes("Missing or insufficient permissions")) {
      alert("Erro de permissões no Firestore. Verifique as regras de segurança do seu banco de dados.");
    } else {
      alert("Erro ao buscar publicações: " + error.message);
    }
    
    return [];
  }
};
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

import { auth, db } from "./firebaseConfig.js";

export function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
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

// --- Funções do Firestore ---

export async function saveData(data, userId) {
    try {
        await addDoc(collection(db, "meusDados"), {
            userId: userId,
            data: data,
            timestamp: serverTimestamp()
        });
        console.log("Dado salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar dado:", error);
        console.error("Código do erro:", error.code);
        console.error("Mensagem do erro:", error.message);
        throw error;
    }
}

export async function fetchUserData(userId) {
    try {
        const q = query(
            collection(db, "meusDados"),
            where("userId", "==", userId),
            orderBy("timestamp")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        throw error;
    }
}

export async function updateData(docId, newData) {
    try {
        const docRef = doc(db, "meusDados", docId);
        await updateDoc(docRef, {
            data: newData,
            timestamp: serverTimestamp()
        });
        console.log("Dado atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar dado:", error);
        console.error("Código do erro:", error.code);
        console.error("Mensagem do erro:", error.message);
        throw error;
    }
}

export async function removeData(docId) {
    try {
        const docRef = doc(db, "meusDados", docId);
        await deleteDoc(docRef);
        console.log("Dado removido com sucesso!");
    } catch (error) {
        console.error("Erro ao remover dado:", error);
        console.error("Código do erro:", error.code);
        console.error("Mensagem do erro:", error.message);
        throw error;
    }
}

// --- Função para buscar TODOS os posts (para a área pública) ---
export async function fetchAllPosts() {
    try {
        const querySnapshot = await getDocs(collection(db, "meusDados")); // Sem where!
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar publicações públicas:", error);
        throw error; // Propaga o erro
    }
}
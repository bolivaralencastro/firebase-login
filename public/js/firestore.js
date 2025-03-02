import {
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

import { db } from "./firebaseConfig.js";

export async function saveData(data, userId) {
    try {
        const docRef = await addDoc(collection(db, "meusDados"), {
            userId: userId,
            data: data,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

export async function fetchUserData(userId, options = {}) {
    // Opções: search (texto), sort ("recent" ou "oldest"), page e limit para paginação
    const sortOrder = options.sort === "oldest" ? "asc" : "desc";
    const q = query(
        collection(db, "meusDados"),
        where("userId", "==", userId),
        orderBy("timestamp", sortOrder)
    );
    console.log("Firestore Query:", q); // Adicione esta linha
    const snapshot = await getDocs(q);
    console.log("Firestore QuerySnapshot:", querySnapshot); // Adicione esta linha
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched User Data:", data); // Adicione esta linha
    if (options.search) {
        data = data.filter(item => item.data.toLowerCase().includes(options.search.toLowerCase()));
    }
    if (options.page && options.limit) {
        const start = (options.page - 1) * options.limit;
        data = data.slice(start, start + options.limit);
    }
    return data;
}

export async function updateData(docId, newData) {
    try {
        const docRef = doc(db, "meusDados", docId);
        await updateDoc(docRef, {
            data: newData,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        throw error;
    }
}

export async function removeData(docId) {
    try {
        const docRef = doc(db, "meusDados", docId);
        await deleteDoc(docRef);
    } catch (error) {
        throw error;
    }
}

export async function fetchAllPosts(options = {}) {
    // Busca todas as publicações, com opções de ordenação, pesquisa e paginação
    const sortOrder = options.sort === "oldest" ? "asc" : "desc";
    const q = query(
        collection(db, "meusDados"),
        orderBy("timestamp", sortOrder)
    );
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (options.search) {
        data = data.filter(item => item.data.toLowerCase().includes(options.search.toLowerCase()));
    }
    if (options.page && options.limit) {
        const start = (options.page - 1) * options.limit;
        data = data.slice(start, start + options.limit);
    }
    return data;
}

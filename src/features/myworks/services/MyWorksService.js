// src/features/myworks/services/MyWorksService.js
import { db } from '../../../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const newsCollection = collection(db, 'news');

// Ambil berita milik user langsung dengan query Firestore
export const getUserNews = async (userUid) => {
  if (!userUid) throw new Error('User ID harus diisi');

  const q = query(newsCollection, where('author.id', '==', userUid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Hapus berita berdasarkan ID berita
export const deleteUserNews = async (newsId) => {
  if (!newsId) throw new Error('newsId harus diisi');

  const docRef = doc(db, 'news', newsId);
  await deleteDoc(docRef);
  return true;
};

// Update berita berdasarkan ID berita dan data baru
export const updateUserNews = async (newsId, updatedData) => {
  if (!newsId) throw new Error('newsId harus diisi');

  const docRef = doc(db, 'news', newsId);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date()
  });

  // Ambil data terbaru setelah update
  const updatedDoc = await getDoc(docRef);
  return { id: newsId, ...updatedDoc.data() };
};

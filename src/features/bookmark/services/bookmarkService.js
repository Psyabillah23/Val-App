// src/features/bookmark/services/bookmarkService.js
import { db } from '../../../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const bookmarksCollection = collection(db, 'bookmarks');

// Ambil semua bookmark user berdasarkan userId (user.uid)
export const getBookmarks = async (userId) => {
  if (!userId) throw new Error('User ID is required to fetch bookmarks');

  const q = query(bookmarksCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Tambah bookmark baru dengan data berita lengkap dan fallback author
export const addBookmark = async (userId, news) => {
  if (!userId) throw new Error('User ID is required to add bookmark');
  if (!news || !news.id) throw new Error('Valid news object with id is required');

  // Cek apakah bookmark sudah ada
  const q = query(bookmarksCollection,
    where('userId', '==', userId),
    where('newsId', '==', news.id)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('News already bookmarked');
  }

  const authorData = news.author && typeof news.author === 'object'
    ? news.author
    : { id: '', name: 'Unknown', profilePicture: null };

  const bookmarkData = {
    userId,
    newsId: news.id,
    newsTitle: news.title || 'No Title',
    newsImage: news.image || null,
    author: authorData,
    content: news.content || '',
    comments: Array.isArray(news.comments) ? news.comments : [],
    likes: typeof news.likes === 'number' ? news.likes : 0,
    createdAt: news.createdAt || new Date(),
  };

  const docRef = await addDoc(bookmarksCollection, bookmarkData);
  return { id: docRef.id, ...bookmarkData };
};

// Hapus bookmark berdasarkan id dokumen bookmark Firestore
export const removeBookmark = async (bookmarkId) => {
  if (!bookmarkId) throw new Error('Bookmark ID is required to remove bookmark');

  const docRef = doc(db, 'bookmarks', bookmarkId);
  await deleteDoc(docRef);
  return true;
};

// Cek apakah berita sudah di-bookmark user
export const isBookmarked = async (userId, newsId) => {
  if (!userId || !newsId) return false;

  const q = query(bookmarksCollection,
    where('userId', '==', userId),
    where('newsId', '==', newsId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

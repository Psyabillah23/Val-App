import { db } from '../../../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// Referensi koleksi news
const newsCollection = collection(db, 'news');

// Fetch all news, sorted by createdAt desc
export const fetchNews = async () => {
  const q = query(newsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch news by ID
export const fetchNewsById = async (id) => {
  const docRef = doc(db, 'news', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('News not found');
  return { id: docSnap.id, ...docSnap.data() };
};

// Search news by query on title or content
export const searchNews = async (queryStr) => {
  if (!queryStr) return [];

  const qTitle = query(
    newsCollection,
    where('title', '>=', queryStr),
    where('title', '<=', queryStr + '\uf8ff')
  );
  const qContent = query(
    newsCollection,
    where('content', '>=', queryStr),
    where('content', '<=', queryStr + '\uf8ff')
  );

  const [snapTitle, snapContent] = await Promise.all([getDocs(qTitle), getDocs(qContent)]);

  const resultsMap = new Map();

  snapTitle.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
  snapContent.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));

  return Array.from(resultsMap.values());
};

// Add new news dengan inisialisasi likedBy dan likesCount
export const addNews = async (newsData) => {
  const now = new Date();
  const newNews = {
    ...newsData,
    createdAt: now,
    updatedAt: now,
    comments: [],
    likesCount: 0,
    likedBy: [],
  };
  const docRef = await addDoc(newsCollection, newNews);
  const addedDoc = await getDoc(docRef);
  return { id: docRef.id, ...addedDoc.data() };
};

// Update existing news by id
export const updateNews = async (id, data) => {
  const docRef = doc(db, 'news', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// Delete news by id
export const deleteNews = async (id) => {
  const docRef = doc(db, 'news', id);
  await deleteDoc(docRef);
  return true;
};

// Add comment to news
export const addComment = async (newsId, comment) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const newComment = {
    id: String(Date.now()), // Generate unique ID using timestamp
    ...comment,
    createdAt: new Date(),
    likedBy: [],
    likesCount: 0,
  };

  const updatedComments = [...(newsData.comments || []), newComment];

  await updateDoc(docRef, {
    comments: updatedComments,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// Update comment
export const updateComment = async (newsId, commentId, newContent) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const comments = newsData.comments || [];

  const updatedComments = comments.map(comment =>
    comment.id === commentId
      ? { ...comment, content: newContent, updatedAt: new Date() }
      : comment
  );

  const commentFound = updatedComments.some(comment =>
    comment.id === commentId && comment.content === newContent
  );

  if (!commentFound) {
    throw new Error('Comment not found');
  }

  await updateDoc(docRef, {
    comments: updatedComments,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// Delete comment
export const deleteComment = async (newsId, commentId) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const comments = newsData.comments || [];

  const updatedComments = comments.filter(comment => comment.id !== commentId);

  if (updatedComments.length === comments.length) {
    throw new Error('Comment not found');
  }

  await updateDoc(docRef, {
    comments: updatedComments,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// Add a reply to a specific comment
export const addReplyToComment = async (newsId, commentId, reply) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const comments = newsData.comments || [];

  const newReply = {
    id: String(Date.now()),
    ...reply,
    createdAt: new Date(),
  };

  let commentFound = false;
  const updatedComments = comments.map(comment => {
    if (comment.id === commentId) {
      commentFound = true;
      const updatedReplies = [...(comment.replies || []), newReply];
      return { ...comment, replies: updatedReplies };
    }
    return comment;
  });

  if (!commentFound) {
    throw new Error('Comment to reply to not found');
  }

  await updateDoc(docRef, {
    comments: updatedComments,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};


// Toggle like on a specific news article
export const toggleLike = async (newsId, userId) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const likedBy = newsData.likedBy || [];
  const hasLiked = likedBy.includes(userId);

  let updatedLikedBy;
  if (hasLiked) {
    updatedLikedBy = likedBy.filter(id => id !== userId); // unlike
  } else {
    updatedLikedBy = [...likedBy, userId]; // like
  }

  const updatedLikesCount = updatedLikedBy.length;

  await updateDoc(docRef, {
    likedBy: updatedLikedBy,
    likesCount: updatedLikesCount,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// Toggle like on a specific comment
export const toggleCommentLike = async (newsId, commentId, userId) => {
  const docRef = doc(db, 'news', newsId);
  const newsDoc = await getDoc(docRef);
  if (!newsDoc.exists()) throw new Error('News not found');

  const newsData = newsDoc.data();
  const comments = newsData.comments || [];

  let commentFound = false;
  const updatedComments = comments.map(comment => {
    if (comment.id === commentId) {
      commentFound = true;
      const likedBy = comment.likedBy || [];
      const hasLiked = likedBy.includes(userId);

      let updatedLikedBy;
      if (hasLiked) {
        updatedLikedBy = likedBy.filter(id => id !== userId);
      } else {
        updatedLikedBy = [...likedBy, userId];
      }

      return {
        ...comment,
        likedBy: updatedLikedBy,
        likesCount: updatedLikedBy.length,
      };
    }
    return comment;
  });

  if (!commentFound) {
    throw new Error('Comment not found');
  }

  await updateDoc(docRef, {
    comments: updatedComments,
    updatedAt: new Date(),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};
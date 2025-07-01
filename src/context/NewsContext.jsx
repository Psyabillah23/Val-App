import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    fetchNews,
    fetchNewsById,
    searchNews,
    addNews,
    deleteNews,
    addComment,
    updateNews,
    updateComment,
    deleteComment,
    toggleLike, // Fungsi untuk suka pada berita
    addReplyToComment, // BARU: Impor fungsi balasan komentar
    toggleCommentLike // BARU: Impor fungsi suka komentar pada komentar
} from '../features/news/services/newsService';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const [news, setNews] = useState([]);
    const [currentNews, setCurrentNews] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi untuk memuat semua berita
    const loadNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const newsData = await fetchNews();
            setNews(newsData);
        } catch (err) {
            setError(err.message || 'Gagal memuat berita');
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong karena fungsi tidak bergantung pada props/state lain

    // Efek samping untuk memuat berita saat komponen dimuat
    useEffect(() => {
        loadNews();
    }, [loadNews]);

    // Fungsi untuk mendapatkan berita berdasarkan ID
    const getNewsById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const newsItem = await fetchNewsById(id);
            setCurrentNews(newsItem);
            return newsItem;
        } catch (err) {
            setError(err.message || 'Gagal memuat berita');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong karena fungsi tidak bergantung pada props/state lain

    // Fungsi untuk memperbarui berita
    const handleUpdateNews = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const updatedNews = await updateNews(id, data);
            setNews(prevNews => prevNews.map(item =>
                item.id === id ? updatedNews : item
            ));
            if (currentNews && currentNews.id === id) {
                setCurrentNews(updatedNews);
            }
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal memperbarui berita');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentNews]); // Dependensi: currentNews untuk memperbarui jika berita yang sedang dilihat berubah

    // Fungsi pembantu untuk memperbarui state berita di konteks tanpa memanggil API (digunakan setelah operasi komentar)
    const updateNewsInContext = useCallback((updatedNewsItem) => {
        setNews(prevNews => prevNews.map(item =>
            item.id === updatedNewsItem.id ? updatedNewsItem : item
        ));
        if (currentNews && currentNews.id === updatedNewsItem.id) {
            setCurrentNews(updatedNewsItem);
        }
    }, [currentNews]); // Dependensi: currentNews

    // Fungsi untuk mencari berita
    const handleSearchNews = useCallback(async (query) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchNews(query);
            return results;
        } catch (err) {
            setError(err.message || 'Pencarian gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong

    // Fungsi untuk menambahkan berita baru
    const handleAddNews = useCallback(async (newsData) => {
        setLoading(true);
        setError(null);
        try {
            const newNews = await addNews(newsData);
            setNews(prevNews => [newNews, ...prevNews]);
            return newNews;
        } catch (err) {
            setError(err.message || 'Gagal menambahkan berita');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong

    // Fungsi untuk menghapus berita
    const handleDeleteNews = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteNews(id);
            setNews(prevNews => prevNews.filter(item => item.id !== id));
        } catch (err) {
            setError(err.message || 'Gagal menghapus berita');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Dependensi kosong

    // Fungsi untuk menambahkan komentar utama
    const handleAddComment = useCallback(async (newsId, comment) => {
        setLoading(true);
        setError(null);
        try {
            const updatedNews = await addComment(newsId, comment);
            updateNewsInContext(updatedNews); // Perbarui konteks setelah berhasil
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal menambahkan komentar');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [updateNewsInContext]); // Dependensi: updateNewsInContext

    // BARU: Fungsi untuk menambahkan balasan ke komentar
    const handleAddReplyToComment = useCallback(async (newsId, parentCommentId, reply) => {
        setLoading(true);
        setError(null);
        try {
            const updatedNews = await addReplyToComment(newsId, parentCommentId, reply);
            updateNewsInContext(updatedNews); // Perbarui konteks setelah berhasil
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal menambahkan balasan');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [updateNewsInContext]); // Dependensi: updateNewsInContext

    // Fungsi untuk memperbarui komentar
    const handleUpdateComment = useCallback(async (newsId, commentId, newContent) => {
        setError(null);
        try {
            const updatedNews = await updateComment(newsId, commentId, newContent);
            updateNewsInContext(updatedNews); // Perbarui konteks setelah berhasil
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal memperbarui komentar');
            throw err;
        }
    }, [updateNewsInContext]); // Dependensi: updateNewsInContext

    // Fungsi untuk menghapus komentar
    const handleDeleteComment = useCallback(async (newsId, commentId) => {
        setError(null);
        try {
            const updatedNews = await deleteComment(newsId, commentId);
            updateNewsInContext(updatedNews); // Perbarui konteks setelah berhasil
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal menghapus komentar');
            throw err;
        }
    }, [updateNewsInContext]); // Dependensi: updateNewsInContext

    // BARU: Fungsi untuk mengaktifkan/menonaktifkan suka pada komentar
    const handleToggleCommentLike = useCallback(async (newsId, commentId, userId) => {
        setError(null);
        try {
            const updatedNews = await toggleCommentLike(newsId, commentId, userId);
            updateNewsInContext(updatedNews); // Perbarui konteks setelah berhasil
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Gagal memperbarui suka komentar');
            throw err;
        }
    }, [updateNewsInContext]); // Dependensi: updateNewsInContext

    // Nilai konteks yang akan disediakan ke komponen anak
    const contextValue = useMemo(() => ({
        news,
        currentNews,
        loading,
        error,
        loadNews,
        getNewsById,
        searchNews: handleSearchNews,
        addNews: handleAddNews,
        deleteNews: handleDeleteNews,
        addComment: handleAddComment,
        updateNews: handleUpdateNews,
        updateComment: handleUpdateComment,
        deleteComment: handleDeleteComment,
        toggleLike, // toggleLike adalah fungsi yang diimpor, tidak perlu dimasukkan dalam dependency array useMemo
        addReply: handleAddReplyToComment, // BARU: Tambahkan ke konteks
        toggleCommentLike: handleToggleCommentLike, // BARU: Tambahkan ke konteks
        updateNewsInContext // Tambahkan ini ke nilai konteks
    }), [
        news,
        currentNews,
        loading,
        error,
        loadNews,
        getNewsById,
        handleSearchNews,
        handleAddNews,
        handleDeleteNews,
        handleAddComment,
        handleUpdateNews,
        handleUpdateComment,
        handleDeleteComment,
        handleAddReplyToComment, // BARU: Tambahkan ke dependency array
        handleToggleCommentLike, // BARU: Tambahkan ke dependency array
        updateNewsInContext // Tambahkan ini ke dependency array
    ]);

    return (
        <NewsContext.Provider value={contextValue}>
            {children}
        </NewsContext.Provider>
    );
};
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    fetchNews,
    fetchNewsById,
    searchNews,
    addNews,
    deleteNews,
    addComment,
    updateNews
} from '../features/news/services/newsService';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const [news, setNews] = useState([]);
    const [currentNews, setCurrentNews] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const newsData = await fetchNews();
            setNews(newsData);
        } catch (err) {
            setError(err.message || 'Failed to load news');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNews();
    }, [loadNews]);

    const getNewsById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const newsItem = await fetchNewsById(id);
            setCurrentNews(newsItem);
            return newsItem;
        } catch (err) {
            setError(err.message || 'Failed to load news');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

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
            setError(err.message || 'Failed to update news');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentNews]);

    const handleSearchNews = useCallback(async (query) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchNews(query);
            return results;
        } catch (err) {
            setError(err.message || 'Search failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddNews = useCallback(async (newsData) => {
        setLoading(true);
        setError(null);
        try {
            const newNews = await addNews(newsData);
            setNews(prevNews => [newNews, ...prevNews]);
            return newNews;
        } catch (err) {
            setError(err.message || 'Failed to add news');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteNews = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteNews(id);
            setNews(prevNews => prevNews.filter(item => item.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete news');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddComment = useCallback(async (newsId, comment) => {
        setLoading(true);
        setError(null);
        try {
            const updatedNews = await addComment(newsId, comment);
            if (currentNews && currentNews.id === newsId) {
                setCurrentNews(updatedNews);
            }
            setNews(prevNews => prevNews.map(item => item.id === newsId ? updatedNews : item));
            return updatedNews;
        } catch (err) {
            setError(err.message || 'Failed to add comment');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentNews]);

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
        updateNews: handleUpdateNews
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
        handleUpdateNews
    ]);

    return (
        <NewsContext.Provider value={contextValue}>
            {children}
        </NewsContext.Provider>
    );
};

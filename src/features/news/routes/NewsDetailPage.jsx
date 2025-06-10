import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsDetail from '../components/NewsDetail';
import './NewsDetailPage.css';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNews, loading, error, getNewsById } = useNews();
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        await getNewsById(id);
      } catch (err) {
        console.error(err);
        // If news not found, redirect to home page
        if (err.message === 'News not found') {
          navigate('/');
        }
      }
    };
    
    fetchNews();
  }, [id, getNewsById, navigate]);
  
  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => getNewsById(id)} className="reload-btn">Try Again</button>
      </div>
    );
  }
  
  if (!currentNews) {
    return <div className="loading-indicator">Loading...</div>;
  }
  
  return (
    <div className="news-detail-page">
      <NewsDetail news={currentNews} />
    </div>
  );
};

export default NewsDetailPage;

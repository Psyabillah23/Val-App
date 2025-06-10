// src/features/news/routes/Dashboard.jsx
import React, { useEffect, useCallback } from 'react'; // Tambahkan useCallback di sini
import { useNews } from '../hooks/useNews';
import NewsListItem from '../components/NewsListItem';
import './Dashboard.css';

const Dashboard = () => {
  const { news, loading, error, loadNews } = useNews();
  
  useEffect(() => {
    // Reload news when dashboard is mounted
    loadNews();
  }, [loadNews]);
  
  // Menggunakan struktur data stabil
  const renderNewsList = useCallback(() => {
    return news.map(item => (
      <NewsListItem key={item.id} news={item} />
    ));
  }, [news]);
  
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Latest News</h1>
      
      {loading && <div className="loading-indicator">Loading...</div>}
      
      {error && (
        <div className="error-message">
          <p>Failed to load news: {error}</p>
          <button onClick={loadNews} className="reload-btn">Try Again</button>
        </div>
      )}
      
      {!loading && !error && news.length === 0 && (
        <div className="empty-state">
          <p>No news available at the moment.</p>
        </div>
      )}
      
      <div className="news-list">
        {!loading && renderNewsList()}
      </div>
    </div>
  );
};

export default Dashboard;
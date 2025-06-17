import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import NewsListItem from '../../news/components/NewsListItem';
import { getUserNews, deleteUserNews } from '../services/MyWorksService';
import Button from '../../../components/common/Button/Button';
import './MyWorksList.css';

const MyWorksList = () => {
  const { user } = useAuth();
  const [userNews, setUserNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserNews = useCallback(async () => {
    if (!user || !user.uid) {
      setUserNews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const news = await getUserNews(user.uid);
      setUserNews(news);
    } catch (err) {
      setError(err.message || 'Failed to load your news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserNews();
  }, [fetchUserNews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteUserNews(id);
      setUserNews(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="loading-spinner"></div>
        <span>Loading your news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchUserNews} className="reload-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (userNews.length === 0) {
    return (
      <div className="empty-works">
        <div className="empty-icon">📰</div>
        <h3>No news articles yet</h3>
        <p>You haven't created any news yet.</p>
        <Link to="/add-news" className="btn-add-news">
          <Button variant="primary">Create Your First News</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="my-works-container">
      <div className="my-works-list">
        <div className="my-works-header">
          <div className="header-content">
            <h2>Your Published News</h2>
            <p className="header-subtitle">
              Manage and edit your published articles
            </p>
          </div>
          <Link to="/add-news" className="btn-add-news">
            <Button variant="primary" size="small">
              <span className="btn-icon">+</span>
              Add News
            </Button>
          </Link>
        </div>

        <div className="works-stats">
          <div className="stat-item">
            <span className="stat-number">{userNews.length}</span>
            <span className="stat-label">Total Articles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {userNews.filter(news =>
                new Date(news.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </span>
            <span className="stat-label">Last 30 Days</span>
          </div>
        </div>

        <div className="works-list">
          {userNews.map(news => (
            <div key={news.id} className="work-item">
              <div className="work-meta">
                <div className="meta-info">
                  <span className="work-status">
                    <span className="status-dot published"></span>
                    Published
                  </span>
                  <span className="work-date">
                    Last Updated: {formatDate(news.updatedAt)}
                  </span>
                </div>
                <div className="work-actions">
                  <Link to={`/edit-news/${news.id}`}>
                    <Button variant="secondary" size="small">
                      <span className="btn-icon">✏️</span>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(news.id)}
                  >
                    <span className="btn-icon">🗑️</span>
                    Delete
                  </Button>
                </div>
              </div>

              <div className="work-content">
                <NewsListItem news={news} />

                <div className="work-footer">
                  <div className="work-tags">
                    {news.tags && news.tags.map(tag => (
                      <span key={tag} className="work-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="work-views">
                    <span className="views-count">
                      👁️ {news.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="works-pagination">
          <p className="pagination-info">
            Showing {userNews.length} of {userNews.length} articles
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyWorksList;
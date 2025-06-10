import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import NewsListItem from '../../news/components/NewsListItem';
import { getBookmarks, removeBookmark } from '../services/bookmarkService';
import './BookmarkList.css';

const BookmarkList = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const bookmarksData = await getBookmarks(user.uid);
        setBookmarks(bookmarksData);
      } catch (err) {
        setError(err.message || 'Failed to load bookmarks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleRemoveBookmark = async (bookmarkId) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await removeBookmark(bookmarkId);
      setBookmarks(prev => prev.filter(bm => bm.id !== bookmarkId));
    } catch (err) {
      setError(err.message || 'Failed to remove bookmark');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading bookmarks...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button
          onClick={() => getBookmarks(user.uid).then(setBookmarks)}
          className="reload-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="empty-bookmarks">
        <p>You don't have any bookmarks yet.</p>
      </div>
    );
  }

  return (
    <div className="bookmarks-list">
      {bookmarks.map(bookmark => (
        <div key={bookmark.id} className="bookmark-item">
          <NewsListItem news={{
            id: bookmark.newsId,
            title: bookmark.newsTitle,
            image: bookmark.newsImage,
            author: bookmark.author,
            content: bookmark.content,
            comments: bookmark.comments,
            likes: bookmark.likes,
            createdAt: bookmark.createdAt,
          }} />

          {/* Tombol Remove di bawah */}
          <div className="bookmark-actions">
            <button
              className="action-btn remove remove-bookmark-btn"
              onClick={() => handleRemoveBookmark(bookmark.id)}
              aria-label="Remove bookmark"
              title="Remove bookmark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkList;

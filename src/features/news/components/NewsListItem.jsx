import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaRegComment } from 'react-icons/fa';
import Card from '../../../components/common/Card/Card';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import {
  addBookmark,
  removeBookmark,
  isBookmarked
} from '../../bookmark/services/bookmarkService';
import { toggleLike } from '../services/newsService';
import './NewsListItem.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const NewsListItem = ({ news }) => {
  const { user } = useAuth();

  const [bookmarked, setBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likesCount || 0);

  useEffect(() => {
    if (user && news.likedBy) {
      setIsLiked(news.likedBy.includes(user.uid));
    } else {
      setIsLiked(false);
    }
    setLikeCount(news.likesCount || 0);
  }, [news.likedBy, news.likesCount, user]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updatedNews = await toggleLike(news.id, user.uid);
      setIsLiked(updatedNews.likedBy.includes(user.uid));
      setLikeCount(updatedNews.likesCount);
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (bookmarked) {
        await removeBookmark(user.uid, news.id);
        setBookmarked(false);
      } else {
        await addBookmark(user.uid, news);
        setBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark action failed:', err);
    }
  };

  useEffect(() => {
    const checkBookmark = async () => {
      if (user) {
        const status = await isBookmarked(user.uid, news.id);
        setBookmarked(status);
      }
    };
    checkBookmark();
  }, [user, news.id]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';

    let date;

    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    } else if (typeof dateValue === 'string' || dateValue instanceof String) {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return 'Unknown date';
    }

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="news-item" padding={false}>
      <Link to={`/news/${news.id}`} className="news-item-link">
        <div className="news-item-content">
          <div className="news-item-author">
            <img
              src={(news.author && news.author.profilePicture) || defaultAvatar}
              alt={(news.author && news.author.name) || 'Unknown Author'}
              className="author-avatar"
              loading="lazy"
              width="24"
              height="24"
            />
            <span className="author-name">{(news.author && news.author.name) || 'Unknown'}</span>
          </div>

          <h3 className="news-item-title">{news.title || 'No Title'}</h3>
          <p className="news-item-excerpt">
            {news.content
              ? news.content.length > 200
                ? news.content.substring(0, news.content.lastIndexOf(' ', 200)) + '...'
                : news.content
              : ''}
          </p>
          

          <div className="news-item-footer">
            <span className="news-item-date">{formatDate(news.createdAt)}</span>

            <div className="news-item-stats">
              <span className="news-item-comments">
                <FaRegComment className="icon comment-icon" />
                {news.comments ? news.comments.length : 0}
              </span>

              <span className="news-item-likes" onClick={handleLikeClick}>
                {isLiked ? (
                  <FaHeart className="icon like-icon active" />
                ) : (
                  <FaRegHeart className="icon like-icon" />
                )}
                {likeCount}
              </span>

              <span className="news-item-bookmark" onClick={handleBookmarkClick}>
                {bookmarked ? (
                  <FaBookmark className="icon bookmark-icon active" />
                ) : (
                  <FaRegBookmark className="icon bookmark-icon" />
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="news-item-image">
          <img
            src={news.image || news.newsImage || defaultAvatar}
            alt={news.title || 'No Title'}
            loading="lazy"
            width="280"
            height="100%"
          />
        </div>
      </Link>
    </Card>
  );
};

export default NewsListItem;

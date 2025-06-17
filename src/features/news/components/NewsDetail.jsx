import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNews } from '../hooks/useNews';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './NewsDetail.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const NewsDetail = ({ news }) => {
  const { user } = useAuth();
  const { deleteNews, updateComment, deleteComment } = useNews();
  const navigate = useNavigate();

  const isAuthor = user && news.author?.id === user.uid;

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    if (dateValue.toDate) {
      return dateValue.toDate().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    const date = new Date(dateValue);
    if (isNaN(date)) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseMarkdownLink = (markdown) => {
    const match = /\[(.+?)\]\((.+?)\)/.exec(markdown);
    if (match) {
      return { text: match[1], url: match[2] };
    }
    return null;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await deleteNews(news.id);
        navigate('/my-works');
      } catch (err) {
        alert('Failed to delete news: ' + (err.message || 'Unknown error'));
        console.error(err);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(news.id, commentId);
      } catch (err) {
        alert('Failed to delete comment: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      await updateComment(news.id, commentId, newContent);
    } catch (err) {
      alert('Failed to update comment: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="news-detail">
      <div className="news-header">
        <h1 className="news-title">{news.title}</h1>

        <div className="news-meta">
          <div className="news-author">
            <img
              src={news.author?.profilePicture || defaultAvatar}
              alt={news.author?.name || 'Unknown'}
              className="author-avatar"
            />
            <span className="author-name">{news.author?.name || 'Unknown'}</span>
          </div>
          <span className="news-date">{formatDate(news.createdAt)}</span>
        </div>
      </div>

      <div className="news-image">
        <img src={news.image} alt={news.title} />
      </div>

      <div className="news-content">
        <p>{news.content}</p>

        {news.link &&
          (() => {
            const link = parseMarkdownLink(news.link);
            if (!link) return null;
            return (
              <p className="news-link">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text}
                </a>
              </p>
            );
          })()}
      </div>

      <div className="news-actions">
        <div className="news-stats">
          <span className="news-comments">
            <i className="comment-icon"></i>
            {news.comments?.length || 0} Comments
          </span>

          <span className="news-likes">
            <i className="like-icon"></i>
            {news.likes || 0} Likes
          </span>
        </div>

        {isAuthor && (
          <div className="news-author-actions">
            <Link to={`/edit-news/${news.id}`} className="btn-edit">
              <i className="edit-icon"></i> Edit
            </Link>

            <button className="btn-delete" onClick={handleDelete}>
              <i className="delete-icon"></i> Delete
            </button>
          </div>
        )}
      </div>

      <div className="news-comments-section">
        <h3 className="comments-title">Comments</h3>

        {user ? (
          <CommentForm newsId={news.id} />
        ) : (
          <div className="comments-login-prompt">
            <p>
              <Link to="/login">Login</Link> or{' '}
              <Link to="/register">register</Link> to post a comment.
            </p>
          </div>
        )}

        <CommentList
          comments={news.comments || []}
          currentUserId={user?.uid}
          onDelete={handleDeleteComment}
          onUpdate={handleUpdateComment}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
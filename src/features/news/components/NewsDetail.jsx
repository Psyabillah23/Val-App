import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNews } from '../hooks/useNews';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
// toggleLike sudah diimpor, pastikan dari newsService
import { toggleLike } from '../services/newsService';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './NewsDetail.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const NewsDetail = ({ news }) => {
  const { user } = useAuth();
  // Pastikan Anda mendapatkan semua fungsi yang relevan dari useNews
  const { deleteNews, updateComment, deleteComment, updateNewsInContext } = useNews();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likesCount || 0);

  const isAuthor = user && news.author?.id === user.uid;

  // Perbarui status suka saat prop berita berubah
  useEffect(() => {
    if (user && news.likedBy) {
      setIsLiked(news.likedBy.includes(user.uid));
    } else {
      setIsLiked(false);
    }
    setLikeCount(news.likesCount || 0);
  }, [news.likedBy, news.likesCount, user]);

  const handleLikeClick = async () => {
    if (!user) return;

    try {
      const updatedNews = await toggleLike(news.id, user.uid);
      setIsLiked(updatedNews.likedBy.includes(user.uid));
      setLikeCount(updatedNews.likesCount);

      // Perbarui konteks dengan data suka yang baru
      updateNewsInContext(updatedNews);
    } catch (error) {
      console.error('Gagal memperbarui suka:', error);
    }
  };

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
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await deleteNews(news.id);
        navigate('/my-works');
      } catch (err) {
        alert('Gagal menghapus berita: ' + (err.message || 'Error tidak diketahui'));
        console.error(err);
      }
    }
  };

  // Fungsi ini sekarang akan memicu pembaruan melalui NewsContext
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      try {
        // Panggilan ke NewsContext.deleteComment akan memperbarui news di context secara otomatis
        await deleteComment(news.id, commentId);
      } catch (err) {
        alert('Gagal menghapus komentar: ' + (err.message || 'Error tidak diketahui'));
      }
    }
  };

  // Fungsi ini sekarang akan memicu pembaruan melalui NewsContext
  const handleUpdateComment = async (commentId, newContent) => {
    try {
      // Panggilan ke NewsContext.updateComment akan memperbarui news di context secara otomatis
      await updateComment(news.id, commentId, newContent);
    } catch (err) {
      alert('Gagal memperbarui komentar: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // Callback ini akan dipicu setiap kali komentar atau balasan baru ditambahkan
  const handleCommentAddedToNews = (updatedNews) => {
    // Karena NewsContext sudah memanggil updateNewsInContext,
    // state 'news' di sini harus sudah diperbarui.
    // Anda bisa menambahkan logika UI tambahan di sini jika perlu.
    console.log("Komentar atau balasan baru ditambahkan/diperbarui. Data berita terbaru:", updatedNews);
  };

  return (
    <div className="news-detail">
      <div className="news-header">
        <h1 className="news-title">{news.title}</h1>

        <div className="news-meta">
          <div className="news-author">
            <img
              src={news.author?.profilePicture || defaultAvatar}
              alt={news.author?.name || 'Tidak Dikenal'}
              className="author-avatar"
            />
            <span className="author-name">{news.author?.name || 'Tidak Dikenal'}</span>
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
            {news.comments?.length || 0} Comment
          </span>

          <span className="news-likes" onClick={handleLikeClick} style={{ cursor: user ? 'pointer' : 'default' }}>
            {isLiked ? (
              <FaHeart className="like-icon active" style={{ color: '#e74c3c' }} />
            ) : (
              <FaRegHeart className="like-icon" />
            )}
            {likeCount} Like
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
        <h3 className="comments-title">Comment</h3>

        {user ? (
          <CommentForm
            newsId={news.id}
            onCommentAdded={handleCommentAddedToNews} // Teruskan callback
          />
        ) : (
          <div className="comments-login-prompt">
            <p>
              <Link to="/login">Login</Link> atau{' '}
              <Link to="/register">daftar</Link> untuk memposting komentar.
            </p>
          </div>
        )}

        <CommentList
          comments={news.comments || []}
          newsId={news.id} // Sangat penting: Teruskan newsId ke CommentList
          currentUserId={user?.uid}
          onDelete={handleDeleteComment}
          onUpdate={handleUpdateComment}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
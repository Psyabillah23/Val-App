import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNews } from '../hooks/useNews';
import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import CommentForm from './CommentForm';

import './CommentList.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const CommentItem = ({ comment, newsId, currentUserId, onDelete, onUpdate, onCommentAdded }) => {
  const { user } = useAuth();
  const { toggleCommentLike } = useNews();

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isAuthor = currentUserId === (comment.author && comment.author.id);
  const hasLikedComment = user && comment.likedBy?.includes(user.uid);

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    if (isNaN(date)) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const startEditing = () => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = () => {
    if (editContent.trim() === '') {
      alert('Konten komentar tidak boleh kosong');
      return;
    }
    onUpdate(comment.id, editContent.trim());
    setEditingId(null);
    setEditContent('');
  };

  const handleReplyClick = () => {
    setShowReplyForm((prev) => !prev);
  };

  const handleToggleLike = () => {
    if (!user) {
      alert('Silakan masuk untuk menyukai komentar.');
      return;
    }
    toggleCommentLike(newsId, comment.id, user.uid);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <img
            src={(comment.author && comment.author.profilePicture) || defaultAvatar}
            alt={(comment.author && comment.author.name) || 'Tidak Dikenal'}
            className="author-avatar"
          />
          <span className="author-name">{(comment.author && comment.author.name) || 'Tidak Dikenal'}</span>
        </div>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>

      <div className="comment-content">
        {editingId === comment.id ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="edit-textarea"
            />
            <div className="edit-buttons">
              <button onClick={saveEdit} className="action-btn edit-btn">Save</button>
              <button onClick={cancelEditing} className="action-btn delete-btn">Batal</button>
            </div>
          </>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      <div className="comment-footer">
        <span className="comment-likes" onClick={handleToggleLike} style={{ cursor: user ? 'pointer' : 'default' }}>
          {hasLikedComment ? (
            <FaHeart className="like-icon active" style={{ color: '#e74c3c' }} />
          ) : (
            <FaRegHeart className="like-icon" />
          )}
          {comment.likesCount || 0} Like
        </span>

        {user && (
          <span className="comment-likes reply-button" onClick={handleReplyClick}>
            <FaRegCommentDots className="reply-icon" style={{ color: 'var(--primary-color)' }} />
            Reply
          </span>
        )}

        {isAuthor && editingId !== comment.id && (
          <div className="comment-actions">
            <button onClick={startEditing} className="action-btn edit-btn">Edit</button>
            <button onClick={() => onDelete(comment.id)} className="action-btn delete-btn">Delete</button>
          </div>
        )}
      </div>

      {showReplyForm && user && (
        <div className="reply-form-wrapper">
          <CommentForm
            newsId={newsId}
            parentCommentId={comment.id}
            parentAuthorName={comment.author?.name || ''}
            onCommentAdded={onCommentAdded}
            onCancelReply={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              newsId={newsId}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments, newsId, currentUserId, onDelete, onUpdate }) => {
  const handleCommentAddedOrUpdated = () => {
    // Tambahkan logika jika perlu update komentar
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          newsId={newsId}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onCommentAdded={handleCommentAddedOrUpdated}
        />
      ))}
    </div>
  );
};

export default CommentList;

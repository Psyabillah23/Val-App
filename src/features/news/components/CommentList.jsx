import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import CommentForm from './CommentForm';
import Button from '../../../components/common/Button/Button';
import { deleteComment } from '../services/newsService'; // ← ini bener
import './CommentList.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';


const CommentList = ({ newsId, comments = [], onCommentsUpdate }) => {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleEditClick = (commentId) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleDeleteClick = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(newsId, commentId);
        // update list setelah delete
        if (onCommentsUpdate) {
          onCommentsUpdate();
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCommentOwner = (comment) => {
    return user && comment.author.id === user.uid;
  };

  return (
    <div className="comment-list">
      <h3 className="comment-list-title">
        Comments ({comments.length})
      </h3>

      {/* Comments */}
      <div className="comments">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {editingCommentId === comment.id ? (
                <CommentForm
                  newsId={newsId}
                  editingComment={comment}
                  onCancelEdit={handleCancelEdit}
                />
              ) : (
                <div className="comment-content">
                  <div className="comment-header">
                    <img
                      src={comment.author.profilePicture || defaultAvatar}
                      alt={comment.author.name}
                      className="comment-author-avatar"
                    />
                    <div className="comment-meta">
                      <span className="comment-author-name">
                        {comment.author.name}
                      </span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                          <span className="comment-edited"> (edited)</span>
                        )}
                      </span>
                    </div>

                    {isCommentOwner(comment) && (
                      <div className="comment-actions">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleEditClick(comment.id)}
                          className="edit-comment-btn"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleDeleteClick(comment.id)}
                          className="delete-comment-btn"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="comment-text">
                    {comment.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;

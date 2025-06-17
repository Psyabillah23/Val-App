import React, { useState } from 'react';
import './CommentList.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const CommentList = ({ comments, currentUserId, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = () => {
    if (editContent.trim() === '') {
      alert('Comment content cannot be empty');
      return;
    }
    onUpdate(editingId, editContent.trim());
    setEditingId(null);
    setEditContent('');
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => {
        const isAuthor = currentUserId === (comment.author && comment.author.id);

        return (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-author">
                <img
                  src={(comment.author && comment.author.profilePicture) || defaultAvatar}
                  alt={(comment.author && comment.author.name) || 'Unknown'}
                  className="author-avatar"
                />
                <span className="author-name">{(comment.author && comment.author.name) || 'Unknown'}</span>
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
                    <button onClick={saveEdit} className="btn-save">
                      Save
                    </button>
                    <button onClick={cancelEditing} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p>{comment.content}</p>
              )}
            </div>

            {isAuthor && editingId !== comment.id && (
              <div className="comment-actions">
                <button onClick={() => startEditing(comment)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => onDelete(comment.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;

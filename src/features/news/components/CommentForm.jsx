import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNews } from '../hooks/useNews';
import Button from '../../../components/common/Button/Button';
import './CommentForm.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

const CommentForm = ({
  newsId,
  editingComment = null,
  onCancelEdit = null
}) => {
  const { user } = useAuth();
  const { addComment, updateComment, deleteComment } = useNews();

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Set initial value when editing
  useEffect(() => {
    if (editingComment) {
      setComment(editingComment.content);
    } else {
      setComment('');
    }
  }, [editingComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (editingComment) {
        // Update existing comment
        await updateComment(newsId, editingComment.id, {
          content: comment,
          updatedAt: new Date().toISOString(),
        });

        if (onCancelEdit) {
          onCancelEdit();
        }
      } else {
        // Add new comment
        await addComment(newsId, {
          content: comment,
          author: {
            id: user.uid,
            name: user.name,
            profilePicture: user.profilePicture || defaultAvatar,
          },
          createdAt: new Date().toISOString(),
        });
      }

      setComment('');
    } catch (err) {
      setError(err.message || `Failed to ${editingComment ? 'update' : 'add'} comment`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingComment) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteComment(newsId, editingComment.id);

      if (onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      console.error(err);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    setError(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="comment-form-container">
      {error && <div className="form-error">{error}</div>}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Comment</h3>
            <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-input-group">
          <img
            src={user?.profilePicture || defaultAvatar}
            alt={user?.name || 'User'}
            className="comment-avatar"
          />

          <input
            type="text"
            placeholder={editingComment ? "Edit your comment..." : "What are your thoughts?"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
            disabled={isLoading}
          />
        </div>

        <div className="comment-form-actions">
          {editingComment && (
            <>
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
                className="delete-btn"
              >
                Delete
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={isLoading || !comment.trim()}
          >
            {isLoading
              ? (editingComment ? 'Updating...' : 'Posting...')
              : (editingComment ? 'Update' : 'Post')
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
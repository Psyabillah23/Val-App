// src/features/news/components/EditNewsForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './AddNewsForm.css';

const EditNewsForm = () => {
  const { id } = useParams();
  const { getNewsById, updateNews } = useNews();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '/images/placeholders/news-default.jpg', // default sama seperti AddNewsForm
    link: ''
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    content: '',
    link: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(id);
        setFormData({
          title: data.title || '',
          content: data.content || '',
          image: data.image || '/images/placeholders/news-default.jpg',
          link: data.link || ''
        });
      } catch (err) {
        setError('Failed to load news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, getNewsById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.content) errors.content = 'Content is required';

    // Validasi sederhana untuk link format markdown jika diperlukan
    if (formData.link && !/^\[.*\]\(https?:\/\/.+\)$/.test(formData.link)) {
      errors.link = 'Link format is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateNews(id, formData);
      navigate('/my-works');
    } catch (err) {
      setError('Failed to update news: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="add-news-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error" role="alert">
          <span role="img" aria-label="Warning">⚠</span> {error}
        </div>
      )}

      <Input
        label="Title"
        name="title"
        value={formData.title}
        placeholder="Enter an engaging title"
        onChange={handleChange}
        error={formErrors.title}
        required
      />

      <div className="form-group">
        <label htmlFor="content" className="input-label">
          Content <span className="required">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          placeholder="Enter news content"
          className={`textarea-field ${formErrors.content ? 'textarea-error' : ''}`}
          onChange={handleChange}
          rows={6}
          required
        />
        {formErrors.content && <p className="error-message">{formErrors.content}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="link" className="input-label">Source Link</label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          placeholder="Markdown format: [text](https://example.com)"
          className={`input-field ${formErrors.link ? 'input-error' : ''}`}
          onChange={handleChange}
        />
        {formErrors.link && <p className="error-message">{formErrors.link}</p>}
      </div>

      <div className="form-group image-upload-container">
        <label htmlFor="image-upload" className="input-label">
          Cover Image
        </label>
        <div className="image-upload-section">
          <div className="image-preview">
            {formData.image && (
              <img
                src={formData.image}
                alt="Cover Preview"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            )}
          </div>
          <div className="upload-controls">
            <p className="upload-hint">Select an eye-catching image for your article</p>
            <label htmlFor="image-upload" className="custom-file-input">
              Choose Image
              <input
                type="file"
                id="image-upload"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
};

export default EditNewsForm;

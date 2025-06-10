import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({ src, alt, size = 'medium', onChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`avatar avatar-${size}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src || '/images/placeholders/profile.png'}
        alt={alt || 'User Avatar'}
        className="avatar-image"
      />
      {onChange && (
        <>
          <div className={`avatar-overlay ${isHovered ? 'avatar-overlay-visible' : ''}`}>
            <span className="avatar-edit-text">Change</span>
          </div>
          <input
            type="file"
            className="avatar-input"
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default Avatar;

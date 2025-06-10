import React from 'react';
import AddNewsForm from '../components/AddNewsForm';
import './AddNews.css';

const AddNews = () => {
  return (
    <div className="add-news-page">
      <h1 className="page-title">Add News</h1>
      <AddNewsForm />
    </div>
  );
};

export default AddNews;
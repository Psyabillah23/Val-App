// src/features/myworks/pages/MyWorksPage.jsx
import React from 'react';
import MyWorksList from '../components/MyWorksList';
import './MyWorksPage.css';

const MyWorksPage = () => {
  return (
    <div className="my-works-page">
      <h1 className="page-title">My Works</h1>
      <MyWorksList />
    </div>
  );
};

export default MyWorksPage;

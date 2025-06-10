import React from 'react';
import BookmarkList from '../components/BookmarkList';
import './BookmarkPage.css';

const BookmarkPage = () => {
  return (
    <div className="bookmark-page">
      <h1 className="page-title">My Bookmarks</h1>
      <BookmarkList />
    </div>
  );
};

export default BookmarkPage;

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsListItem from '../components/NewsListItem';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { searchNews } = useNews();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';
  
  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchNews(query);
        setResults(searchResults);
      } catch (err) {
        setError(err.message || 'Search failed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [query, searchNews]);
  
  // Render items dengan useCallback untuk stabilitas
  const renderResults = useCallback(() => {
    return results.map(item => (
      <NewsListItem key={item.id} news={item} />
    ));
  }, [results]);
  
  return (
    <div className="search-results">
      <h1 className="search-title">
        Search Results for: <span className="search-query">"{query}"</span>
      </h1>
      
      {loading && <div className="loading-indicator">Searching...</div>}
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
      
      {!loading && !error && results.length === 0 && (
        <div className="empty-results">
          <p>No results found for "{query}".</p>
        </div>
      )}
      
      <div className="results-count">
        {!loading && !error && results.length > 0 && (
          <p>Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
        )}
      </div>
      
      <div className="news-list">
        {!loading && renderResults()}
      </div>
    </div>
  );
};

export default SearchResults;
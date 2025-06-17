import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsListItem from '../components/NewsListItem';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchNews } = useNews();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef(null);

  // Initialize search query from URL on component mount
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(query);
  }, [location.search]);

  // Real-time search effect with debounce
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchNews(searchQuery);
        setResults(searchResults);
        // Update URL without page reload
        navigate(`?q=${encodeURIComponent(searchQuery)}`, { replace: true });
      } catch (err) {
        setError(err.message || 'Search failed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout with debounce (300ms)
    searchTimeoutRef.current = setTimeout(performSearch, 300);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchNews, navigate]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Render items dengan useCallback untuk stabilitas
  const renderResults = useCallback(() => {
    return results.map(item => (
      <NewsListItem key={item.id} news={item} />
    ));
  }, [results]);

  return (
    <div className="search-results">
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search news..."
          className="search-input"
          autoFocus
        />
      </div>

      <h1 className="search-title">
        Search Results for: <span className="search-query">"{searchQuery}"</span>
      </h1>

      {loading && <div className="loading-indicator">Searching...</div>}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && searchQuery && (
        <div className="empty-results">
          <p>No results found for "{searchQuery}".</p>
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
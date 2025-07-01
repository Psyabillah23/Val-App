import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsListItem from '../components/NewsListItem';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { news, loading, error, loadNews } = useNews();

  const [allNews, setAllNews] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Get query from URL
  const urlQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim();
  }, [location.search]);

  // Initialize search input dengan URL query
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Load all news data
  useEffect(() => {
    if (news && news.length > 0) {
      setAllNews(news);
    } else if (!loading) {
      loadNews();
    }
  }, [news, loading, loadNews]);

  // Real-time filtering berdasarkan searchInput
  const filteredResults = useMemo(() => {
    const query = searchInput.trim();

    if (!query) {
      return allNews;
    }

    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    const results = allNews.filter(newsItem => {
      const searchableText = [
        newsItem.title || '',
        newsItem.content || '',
        newsItem.description || '',
        (newsItem.author && newsItem.author.name) || '',
        newsItem.accountName || '',
        newsItem.source || '',
        newsItem.category || ''
      ].join(' ').toLowerCase();

      return queryWords.every(word => searchableText.includes(word));
    });

    return results;
  }, [allNews, searchInput]);

  // Cleanup - tidak perlu lagi

  // Loading state
  if (loading && allNews.length === 0) {
    return (
      <div className="search-results">
        <div className="loading-indicator">Loading news...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="search-results">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadNews} className="reload-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Search Header */}
      <div className="search-header">
        <h1 className="search-title">
          {searchInput.trim()
            ? `Search results for: "${searchInput.trim()}"`
            : 'All News'
          }
        </h1>

        <div className="results-count">
          <p>
            {searchInput.trim()
              ? `Found ${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`
              : `Showing ${filteredResults.length} news article${filteredResults.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      {/* Results */}
      {filteredResults.length === 0 ? (
        <div className="empty-results">
          <p>
            {searchInput.trim()
              ? `No results found for "${searchInput.trim()}". Try different keywords.`
              : 'No news articles available.'
            }
          </p>
          {searchInput.trim() && (
            <div className="search-suggestions">
              <p>Search tips:</p>
              <ul>
                <li>Try searching with broader keywords</li>
                <li>Check your spelling</li>
                <li>Search by author name or partial title</li>
                <li>Use single words or short phrases</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="news-list">
          {filteredResults.map(item => (
            <NewsListItem key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
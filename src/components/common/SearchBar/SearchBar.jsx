import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="Search your news here!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
                <i className="search-icon"></i>
            </button>
        </form>
    );
};

export default SearchBar;
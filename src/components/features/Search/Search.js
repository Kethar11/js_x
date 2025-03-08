import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchUsers } from '../../../redux/slices/userSlice';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Debounce function for search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else if (query.trim().length === 0) {
        setResults([]);
        setNoResults(false);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [query]);
  
  const performSearch = async () => {
    setIsSearching(true);
    try {
      const response = await dispatch(searchUsers(query)).unwrap();
      setResults(response);
      setNoResults(response.length === 0);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  const handleInputFocus = () => {
    if (query.trim().length >= 2) {
      setShowResults(true);
    }
  };
  
  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setShowResults(false);
    setQuery('');
  };
  
  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <i className="search-icon">🔍</i>
        <input
          type="text"
          className="search-input"
          placeholder="Search Twitter"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {query.length > 0 && (
          <button 
            className="clear-search-btn" 
            onClick={() => setQuery('')}
          >
            ✕
          </button>
        )}
        {isSearching && <div className="search-spinner"></div>}
      </div>
      
      {showResults && (
        <div className="search-results-dropdown">
          {results.length > 0 ? (
            <>
              <div className="search-results-header">
                <h4>Users</h4>
              </div>
              <div className="search-results-list">
                {results.map(user => (
                  <div 
                    key={user.id || user._id} 
                    className="search-result-item"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <div className="user-avatar">
                      <img 
                        src={user.profilePicture || "/default-avatar.png"} 
                        alt={user.username}
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name || user.username}</div>
                      <div className="user-username">@{user.username}</div>
                      {user.bio && <div className="user-bio">{user.bio}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-search-results">
              {noResults ? (
                <>
                  <p>No users found for "{query}"</p>
                  <span>Try searching for a different term</span>
                </>
              ) : (
                <p>Type to search for users</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
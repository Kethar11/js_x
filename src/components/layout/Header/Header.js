import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated, selectUser } from '../../../redux/slices/authSlice';
import { searchUsers } from '../../../redux/slices/userSlice';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    if (query.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await dispatch(searchUsers(query)).unwrap();
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle clicking on a search result
  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };
  
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/home" className="header-logo">
            <span className="logo-x">X</span>
          </Link>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            {isSearching && <div className="search-loading">Searching...</div>}
            
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(user => (
                  <div 
                    key={user._id || user.id} 
                    className="search-result-item"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <img 
                      src={user.profilePicture || "https://via.placeholder.com/40"} 
                      alt={user.username}
                      className="search-result-avatar"
                    />
                    <div className="search-result-info">
                      <div className="search-result-name">{user.name || user.username}</div>
                      <div className="search-result-username">@{user.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar">
                <img 
                  src={currentUser?.profilePicture || "https://via.placeholder.com/40"} 
                  alt="User avatar"
                />
              </div>
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <div className="user-name">{currentUser?.name || currentUser?.username}</div>
                  <div className="user-username">@{currentUser?.username}</div>
                </div>
                <Link to={`/profile/${currentUser?.username}`} className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Log in</Link>
              <Link to="/signup" className="signup-btn">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
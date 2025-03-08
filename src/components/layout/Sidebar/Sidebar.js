import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/authSlice';
import './Sidebar.css';

const Sidebar = ({ onTweetClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Navigation items
  const navItems = [
    { path: '/home', icon: '🏠', text: 'Home' },
    { path: '/explore', icon: '🔍', text: 'Explore' },
    { path: '/lists', icon: '📋', text: 'Lists' },
    // User profile item is added conditionally below
  ];

  // Determine if a link is active
  const isActive = (path) => {
    if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) {
      return true;
    }
    if (path.includes('/profile') && location.pathname.includes('/profile')) {
      return true;
    }
    return location.pathname === path;
  };

  // Handle tweet button click
  const handleTweetClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (onTweetClick) {
      onTweetClick();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              aria-label={item.text}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-text">{item.text}</span>
            </Link>
          ))}
          
          {/* Profile link - only shown when logged in */}
          {isAuthenticated && currentUser && (
            <Link
              to={`/profile/${currentUser.username}`}
              className={`nav-item ${isActive(`/profile/${currentUser.username}`) ? 'active' : ''}`}
              aria-label="Profile"
            >
              <div className="nav-icon">👤</div>
              <span className="nav-text">Profile</span>
            </Link>
          )}
          
          <button className="nav-item more-menu" aria-label="More">
            <div className="nav-icon">⋯</div>
            <span className="nav-text">More</span>
          </button>
        </nav>
        
        {/* Tweet button */}
        <button 
          className="sidebar-tweet-btn" 
          onClick={handleTweetClick}
          aria-label="Compose Tweet"
        >
          <span className="tweet-btn-text">Tweet</span>
          <span className="tweet-btn-icon">+</span>
        </button>
        
        {/* User account info - only shown when logged in */}
        {isAuthenticated && currentUser && (
          <div className="sidebar-user-account">
            <div className="user-avatar">
              <img 
                src={currentUser.profilePicture || "/default-avatar.png"} 
                alt={currentUser.username}
              />
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.name || currentUser.username}</div>
              <div className="user-handle">@{currentUser.username}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
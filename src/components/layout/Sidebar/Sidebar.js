import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/authSlice';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle tweet button click
  const handleTweetClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Scroll to tweet form or open tweet modal
      const tweetForm = document.querySelector('.tweet-form-container');
      if (tweetForm) {
        tweetForm.scrollIntoView({ behavior: 'smooth' });
        const textarea = tweetForm.querySelector('textarea');
        if (textarea) {
          textarea.focus();
        }
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-fixed">
        <div className="logo">
          <Link to="/home">X</Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`}>
            <i className="icon-home">🏠</i>
            <span className="nav-text">Home</span>
          </Link>
          
          <Link to="/bookmarks" className={`nav-item ${isActive('/bookmarks') ? 'active' : ''}`}>
            <i className="icon-bookmarks">🔖</i>
            <span className="nav-text">Bookmarks</span>
          </Link>
          
          <Link to="/lists" className={`nav-item ${isActive('/lists') ? 'active' : ''}`}>
            <i className="icon-lists">📋</i>
            <span className="nav-text">Lists</span>
          </Link>
          
          {isAuthenticated && currentUser && (
            <Link 
              to={`/profile/${currentUser.username}`} 
              className={`nav-item ${location.pathname.includes('/profile/') ? 'active' : ''}`}
            >
              <i className="icon-profile">👤</i>
              <span className="nav-text">Profile</span>
            </Link>
          )}
          
          <div className="nav-item more-item">
            <i className="icon-more">⋯</i>
            <span className="nav-text">More</span>
          </div>
        </nav>
        
        {/* Tweet Button */}
        <button className="tweet-button" onClick={handleTweetClick}>
          <span className="tweet-text">Tweet</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
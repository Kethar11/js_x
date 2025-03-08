import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../redux/slices/authSlice';
import './UserDropdownClick.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handler for clicks outside the dropdown
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown area
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    // Add event listener only when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Toggle dropdown open/closed
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle logout action
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };
  
  if (!user) return null;
  
  return (
    <div className="user-dropdown" ref={dropdownRef}>
      {/* Avatar button that toggles dropdown */}
      <div className="user-avatar-button" onClick={handleClick}>
        <img 
          src={user.profilePicture || "/default-avatar.png"} 
          alt={user.username} 
          className="avatar-img"
        />
      </div>
      
      {/* Dropdown menu - only rendered when isOpen is true */}
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="user-profile">
              <img 
                src={user.profilePicture || "/default-avatar.png"} 
                alt={user.username} 
                className="profile-img"
              />
              <div className="user-details">
                <span className="user-name">{user.name || user.username}</span>
                <span className="user-handle">@{user.username}</span>
              </div>
            </div>
            
            <div className="user-stats">
              <div className="stat-item">
                <span className="count">{user.followingCount || 0}</span>
                <span className="label">Following</span>
              </div>
              <div className="stat-item">
                <span className="count">{user.followerCount || 0}</span>
                <span className="label">Followers</span>
              </div>
            </div>
          </div>
          
          <div className="dropdown-items">
            <Link 
              to={`/profile/${user.username}`} 
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="item-icon">👤</span>
              <span className="item-text">Profile</span>
            </Link>
            
            <Link 
              to="/bookmarks" 
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="item-icon">🔖</span>
              <span className="item-text">Bookmarks</span>
            </Link>
            
            <Link 
              to="/lists" 
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="item-icon">📋</span>
              <span className="item-text">Lists</span>
            </Link>
            
            <div className="menu-divider"></div>
            
            <button 
              className="menu-item logout-button" 
              onClick={handleLogout}
            >
              <span className="item-icon">🚪</span>
              <span className="item-text">Log out @{user.username}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
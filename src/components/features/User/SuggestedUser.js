import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { followUser, unfollowUser } from '../../../redux/slices/userSlice';
import { selectIsAuthenticated } from '../../../redux/slices/authSlice';
import './SuggestedUser.css';

const SuggestedUser = ({ user, isFollowing: initialIsFollowing = false, onFollowToggle }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = user.id || user._id;
  
  const handleFollowToggle = async (e) => {
    e.preventDefault(); // Prevent navigation to profile
    e.stopPropagation(); // Prevent event bubbling
    
    if (!isAuthenticated || isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
      } else {
        await dispatch(followUser(userId)).unwrap();
      }
      
      // Toggle following state
      setIsFollowing(!isFollowing);
      
      // Notify parent component if callback provided
      if (onFollowToggle) {
        onFollowToggle(userId, !isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="suggested-user-card">
      <Link to={`/profile/${user.username}`} className="user-avatar-link">
        <img 
          src={user.profilePicture || "/default-avatar.png"} 
          alt={user.username}
          className="user-img"
        />
      </Link>
      <div className="user-info">
        <Link to={`/profile/${user.username}`} className="user-name-link">
          <div className="user-name">{user.name || user.username}</div>
          <div className="user-handle">@{user.username}</div>
        </Link>
        {user.bio && <div className="user-bio">{user.bio.substring(0, 60)}{user.bio.length > 60 ? '...' : ''}</div>}
      </div>
      
      <button 
        className={`follow-button ${isFollowing ? 'following' : ''}`}
        onClick={handleFollowToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={!isAuthenticated || isLoading}
      >
        {isLoading ? (
          '...'
        ) : isFollowing ? (
          <>
            <span className="follow-text">Following</span>
            <span className="unfollow-text">Unfollow</span>
          </>
        ) : (
          'Follow'
        )}
      </button>
    </div>
  );
};

export default SuggestedUser;
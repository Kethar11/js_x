import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, followUser, unfollowUser } from '../../redux/slices/userSlice';
import { fetchUserTweets } from '../../redux/slices/tweetSlice';
import { selectUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import Layout from '../../components/layout/Layout';
import TweetList from '../../components/features/TweetList/TweetList';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { currentProfile, isLoading, error } = useSelector(state => state.users);
  const { userTweets, isLoading: tweetsLoading } = useSelector(state => state.tweets);
  
  const [activeTab, setActiveTab] = useState('tweets');
  
  // Fetch user profile and tweets when username changes
  useEffect(() => {
    dispatch(fetchUserProfile(username));
    dispatch(fetchUserTweets(username));
  }, [dispatch, username]);
  
  // Check if this is the current user's profile
  const isOwnProfile = currentUser && currentProfile && 
    currentUser.id === currentProfile._id;
  
  // Check if the current user is following this profile
  const isFollowing = currentUser && currentProfile && 
    currentProfile.followers && 
    currentProfile.followers.some(follower => follower._id === currentUser.id);
  
  // Handle follow/unfollow
  const handleFollowAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFollowing) {
      dispatch(unfollowUser(currentProfile._id));
    } else {
      dispatch(followUser(currentProfile._id));
    }
  };
  
  // Handle edit profile
  const handleEditProfile = () => {
    navigate('/settings/profile');
  };
  
  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Handle API calls for different tabs
    if (tab === 'tweets') {
      dispatch(fetchUserTweets(username));
    } else if (tab === 'replies') {
      // API call to get user replies
    } else if (tab === 'media') {
      // API call to get user media tweets
    } else if (tab === 'likes') {
      // API call to get user liked tweets
    }
  };
  
  // Render content based on loading/error state
  const renderContent = () => {
    // Loading state
    if (isLoading && !currentProfile) {
      return (
        <div className="loading-profile">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      );
    }
    
    // Error state
    if (error && !currentProfile) {
      return (
        <div className="profile-error">
          <p>Error loading profile: {error}</p>
          <button onClick={() => dispatch(fetchUserProfile(username))}>Retry</button>
        </div>
      );
    }
    
    // Profile not found
    if (!isLoading && !currentProfile) {
      return (
        <div className="profile-not-found">
          <h2>User not found</h2>
          <p>The user @{username} does not exist.</p>
          <button onClick={() => navigate('/home')}>Go to Home</button>
        </div>
      );
    }
    
    // Profile found - render profile data
    return (
      <>
        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-header-top">
            <button className="back-button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="profile-header-info">
              <h2 className="profile-name">{currentProfile.name || currentProfile.username}</h2>
              <span className="profile-tweet-count">
                {currentProfile.tweetCount || 0} Tweets
              </span>
            </div>
          </div>
          
          {/* Profile banner */}
          <div className="profile-banner">
            {currentProfile.coverPhoto ? (
              <img src={currentProfile.coverPhoto} alt="Profile banner" />
            ) : (
              <div className="default-banner"></div>
            )}
          </div>
          
          {/* Profile info section */}
          <div className="profile-info-section">
            <div className="profile-avatar">
              <img 
                src={currentProfile.profilePicture || "https://via.placeholder.com/150"} 
                alt={currentProfile.username} 
              />
            </div>
            
            {/* Profile action button (Edit Profile or Follow/Unfollow) */}
            <div className="profile-action">
              {isOwnProfile ? (
                <button className="edit-profile-btn" onClick={handleEditProfile}>
                  Edit profile
                </button>
              ) : (
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowAction}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            
            {/* Profile details */}
            <div className="profile-details">
              <h2 className="profile-name">{currentProfile.name || currentProfile.username}</h2>
              <div className="profile-username">@{currentProfile.username}</div>
              
              {currentProfile.bio && (
                <div className="profile-bio">{currentProfile.bio}</div>
              )}
              
              <div className="profile-meta">
                {currentProfile.location && (
                  <div className="profile-location">
                    📍 {currentProfile.location}
                  </div>
                )}
                
                {currentProfile.website && (
                  <div className="profile-website">
                    🔗 <a href={currentProfile.website} target="_blank" rel="noopener noreferrer">
                      {currentProfile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                <div className="profile-joined">
                  🗓️ Joined {new Date(currentProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{currentProfile.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{currentProfile.followerCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile navigation tabs */}
        <div className="profile-nav">
          <button 
            className={`nav-tab ${activeTab === 'tweets' ? 'active' : ''}`}
            onClick={() => handleTabChange('tweets')}
          >
            Tweets
          </button>
          <button 
            className={`nav-tab ${activeTab === 'replies' ? 'active' : ''}`}
            onClick={() => handleTabChange('replies')}
          >
            Replies
          </button>
          <button 
            className={`nav-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleTabChange('media')}
          >
            Media
          </button>
          <button 
            className={`nav-tab ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => handleTabChange('likes')}
          >
            Likes
          </button>
        </div>
        
        {/* Tweets list */}
        <div className="profile-tweets">
          {activeTab === 'tweets' && (
            <TweetList 
              tweets={userTweets} 
              isLoading={tweetsLoading}
              error={null}
            />
          )}
          
          {activeTab === 'replies' && (
            <div className="coming-soon">
              <p>Replies view coming soon</p>
            </div>
          )}
          
          {activeTab === 'media' && (
            <div className="coming-soon">
              <p>Media view coming soon</p>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="coming-soon">
              <p>Likes view coming soon</p>
            </div>
          )}
        </div>
      </>
    );
  };
  
  return (
    <Layout>
      <div className="profile-content">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default Profile;
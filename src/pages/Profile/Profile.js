import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserProfile, 
  followUser, 
  unfollowUser 
} from '../../redux/slices/userSlice';
import { 
  fetchUserTweets, 
  clearUserTweets,
  fetchUserReplies
} from '../../redux/slices/tweetSlice';
import { selectUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import Layout from '../../components/layout/Layout';
import TweetList from '../../components/features/TweetList/TweetList';
import ProfileEditModal from '../../components/features/ProfileEdit/ProfileEditModal';
import './Profile.css';

// Follow Status Notification Component
const FollowStatusNotification = ({ status, username }) => {
  return (
    <div className="follow-status-transition">
      {status === 'followed' ? (
        <span>You followed @{username}</span>
      ) : (
        <span>You unfollowed @{username}</span>
      )}
    </div>
  );
};

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // UI state
  const [activeTab, setActiveTab] = useState('tweets');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followNotification, setFollowNotification] = useState(null);
  
  // Redux state
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userProfile = useSelector(state => state.users.currentProfile);
  const userTweets = useSelector(state => state.tweets.userTweets);
  const userReplies = useSelector(state => state.tweets.userReplies);
  const isLoading = useSelector(state => state.users.isLoading || state.tweets.isLoading);
  const error = useSelector(state => state.users.error || state.tweets.error);
  
  // Check if the profile belongs to the current user
  const isOwnProfile = currentUser && userProfile && 
    (currentUser.id === userProfile.id || currentUser._id === userProfile._id);
  
  // Check if the current user is following the profile user
  useEffect(() => {
    if (currentUser && userProfile && userProfile.followers) {
      // Handle different possible data structures
      const isCurrentUserFollowing = userProfile.followers.some(follower => {
        if (typeof follower === 'string') {
          return follower === currentUser.id || follower === currentUser._id;
        } else {
          return (follower.id && follower.id === currentUser.id) || 
                 (follower._id && follower._id === currentUser._id);
        }
      });
      
      setIsFollowing(isCurrentUserFollowing);
    }
  }, [currentUser, userProfile]);
  
  // Fetch user profile and tweets when username changes
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await dispatch(fetchUserProfile(username)).unwrap();
        await dispatch(fetchUserTweets(username)).unwrap();
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearUserTweets());
    };
  }, [dispatch, username]);
  
  // Fetch tweets or replies when the active tab changes
  useEffect(() => {
    if (!username) return;
    
    const fetchTabData = async () => {
      try {
        if (activeTab === 'replies' && userReplies.length === 0) {
          await dispatch(fetchUserReplies(username)).unwrap();
        } else if (activeTab === 'tweets' && userTweets.length === 0) {
          await dispatch(fetchUserTweets(username)).unwrap();
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };
    
    fetchTabData();
  }, [dispatch, username, activeTab, userReplies.length, userTweets.length]);
  
  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!userProfile || isFollowLoading) return;
    
    try {
      setIsFollowLoading(true);
      
      const userId = userProfile.id || userProfile._id;
      if (!userId) {
        console.error('Missing user ID for follow/unfollow');
        return;
      }
      
      // Update UI immediately for better user experience
      setIsFollowing(!isFollowing);
      
      // Show temporary notification
      setFollowNotification({
        status: isFollowing ? 'unfollowed' : 'followed',
        username: userProfile.username
      });
      
      // Clear notification after 2 seconds
      setTimeout(() => {
        setFollowNotification(null);
      }, 2000);
      
      // Make API call
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
      } else {
        await dispatch(followUser(userId)).unwrap();
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      
      // Revert UI state if the API call fails
      setIsFollowing(!isFollowing);
      
      // Show error notification
      alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`);
    } finally {
      setIsFollowLoading(false);
    }
  };
  
  // Open the edit profile modal (only for own profile)
  const openEditProfileModal = () => {
    if (isOwnProfile) {
      setShowEditModal(true);
    }
  };
  
  // Close the edit profile modal
  const closeEditProfileModal = () => {
    setShowEditModal(false);
  };
  
  // Loading state
  if (isLoading && !userProfile) {
    return (
      <Layout>
        <div className="profile-content">
          <div className="loading-profile">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (error && !userProfile) {
    return (
      <Layout>
        <div className="profile-content">
          <div className="profile-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Profile not found
  if (!isLoading && !error && !userProfile) {
    return (
      <Layout>
        <div className="profile-content">
          <div className="profile-not-found">
            <h2>User not found</h2>
            <p>This account doesn't exist or may have been removed.</p>
            <button onClick={() => navigate('/home')}>Back to Home</button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-top">
            <button className="back-button" onClick={handleBack}>
              ←
            </button>
            <div className="profile-header-info">
              <h2>{userProfile.name || userProfile.username}</h2>
              <span className="profile-tweet-count">
                {userProfile.tweetCount || userTweets.length || 0} Tweets
              </span>
            </div>
          </div>
          
          {/* Profile Banner */}
          <div className="profile-banner">
            {userProfile.bannerPicture ? (
              <img 
                src={userProfile.bannerPicture} 
                alt="Profile banner" 
              />
            ) : (
              <div className="default-banner"></div>
            )}
          </div>
          
          {/* Profile Info Section */}
          <div className="profile-info-section">
            <div className="profile-avatar">
              <img 
                src={userProfile.profilePicture || "/default-avatar.png"} 
                alt={userProfile.username} 
              />
            </div>
            
            <div className="profile-action">
              {isOwnProfile ? (
                <button 
                  className="edit-profile-btn"
                  onClick={openEditProfileModal}
                >
                  Edit profile
                </button>
              ) : isAuthenticated ? (
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  onMouseEnter={() => setIsFollowHovered(true)}
                  onMouseLeave={() => setIsFollowHovered(false)}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? (
                    'Processing...'
                  ) : isFollowing ? (
                    <>
                      <span className="follow-text">Following</span>
                      <span className="unfollow-text">Unfollow</span>
                    </>
                  ) : (
                    'Follow'
                  )}
                </button>
              ) : (
                <button 
                  className="follow-btn"
                  onClick={() => navigate('/login')}
                >
                  Follow
                </button>
              )}
            </div>
            
            <div className="profile-details">
              <h2>{userProfile.name || userProfile.username}</h2>
              <div className="profile-username">@{userProfile.username}</div>
              
              {userProfile.bio && (
                <div className="profile-bio">{userProfile.bio}</div>
              )}
              
              <div className="profile-meta">
                {userProfile.location && (
                  <div className="profile-location">
                    📍 {userProfile.location}
                  </div>
                )}
                
                {userProfile.website && (
                  <div className="profile-website">
                    🔗 <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                      {userProfile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                <div className="profile-joined">
                  🗓️ Joined {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-item" onClick={() => navigate(`/profile/${username}/following`)}>
                  <span className="stat-value">{userProfile.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item" onClick={() => navigate(`/profile/${username}/followers`)}>
                  <span className="stat-value">{userProfile.followerCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Navigation */}
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
              Tweets & replies
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
        </div>
        
        {/* Content display based on selected tab */}
        <div className="profile-content-section">
          {activeTab === 'tweets' && (
            isFollowing || isOwnProfile ? (
              <TweetList 
                tweets={userTweets} 
                isLoading={isLoading && userProfile} 
                error={error}
                emptyMessage={`@${userProfile.username} hasn't tweeted yet.`}
              />
            ) : (
              <div className="private-content-message">
                <div className="lock-icon">🔒</div>
                <h3>These tweets are protected</h3>
                <p>Only followers of @{userProfile.username} can see their tweets. Follow to view their content.</p>
                <button 
                  className="follow-btn"
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Processing...' : 'Follow'}
                </button>
              </div>
            )
          )}
          
          {activeTab === 'replies' && (
            isFollowing || isOwnProfile ? (
              <TweetList 
                tweets={userReplies} 
                isLoading={isLoading && userProfile} 
                error={error}
                emptyMessage={`@${userProfile.username} hasn't replied to any tweets yet.`}
              />
            ) : (
              <div className="private-content-message">
                <div className="lock-icon">🔒</div>
                <h3>These replies are protected</h3>
                <p>Only followers can see @{userProfile.username}'s replies. Follow to view their content.</p>
                <button 
                  className="follow-btn"
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Processing...' : 'Follow'}
                </button>
              </div>
            )
          )}
          
          {activeTab === 'media' && (
            isFollowing || isOwnProfile ? (
              <div className="coming-soon">
                <p>Media tweets will be available soon</p>
              </div>
            ) : (
              <div className="private-content-message">
                <div className="lock-icon">🔒</div>
                <h3>Media is protected</h3>
                <p>Only followers can see @{userProfile.username}'s media. Follow to view their content.</p>
                <button 
                  className="follow-btn"
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Processing...' : 'Follow'}
                </button>
              </div>
            )
          )}
          
          {activeTab === 'likes' && (
            isFollowing || isOwnProfile ? (
              <div className="coming-soon">
                <p>Liked tweets will be available soon</p>
              </div>
            ) : (
              <div className="private-content-message">
                <div className="lock-icon">🔒</div>
                <h3>Likes are protected</h3>
                <p>Only followers can see tweets @{userProfile.username} has liked. Follow to view their content.</p>
                <button 
                  className="follow-btn"
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Processing...' : 'Follow'}
                </button>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Edit Profile Modal - Only shown for own profile */}
      {isOwnProfile && showEditModal && (
        <ProfileEditModal onClose={closeEditProfileModal} />
      )}
      
      {/* Transient follow/unfollow notification */}
      {followNotification && (
        <FollowStatusNotification 
          status={followNotification.status} 
          username={followNotification.username} 
        />
      )}
    </Layout>
  );
};

export default Profile;
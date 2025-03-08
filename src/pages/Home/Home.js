import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from '../../redux/slices/tweetSlice';
import { fetchSuggestedUsers, followUser, unfollowUser } from '../../redux/slices/userSlice';
import { selectIsAuthenticated, selectUser } from '../../redux/slices/authSlice';
import Layout from '../../components/layout/Layout';
import TweetForm from '../../components/features/TweetForm/TweetForm';
import TweetList from '../../components/features/TweetList/TweetList';
import './Home.css';

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

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const tweets = useSelector(state => state.tweets.items);
  const isLoading = useSelector(state => state.tweets.isLoading);
  const error = useSelector(state => state.tweets.error);
  const suggestedUsers = useSelector(state => state.users.suggestedUsers);
  const isUserLoading = useSelector(state => state.users.isLoading);
  
  const [refreshing, setRefreshing] = useState(false);
  const [followingMap, setFollowingMap] = useState({});
  const [followNotification, setFollowNotification] = useState(null);
  
  // Fetch tweets and suggested users on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTweets());
      dispatch(fetchSuggestedUsers());
    }
  }, [dispatch, isAuthenticated]);
  
  // Set initial following status when suggested users are loaded
  useEffect(() => {
    if (suggestedUsers && suggestedUsers.length > 0 && currentUser) {
      const initialFollowingMap = {};
      
      suggestedUsers.forEach(user => {
        const userId = user.id || user._id;
        
        // Check if user is being followed by current user
        const isFollowing = user.followers && user.followers.some(follower => {
          if (typeof follower === 'string') {
            return follower === currentUser.id || follower === currentUser._id;
          } else {
            return (follower.id && follower.id === currentUser.id) || 
                   (follower._id && follower._id === currentUser._id);
          }
        });
        
        initialFollowingMap[userId] = isFollowing;
      });
      
      setFollowingMap(initialFollowingMap);
    }
  }, [suggestedUsers, currentUser]);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    await dispatch(fetchTweets());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Ensure the spinner shows for at least 1 second
  };
  
  // Handle follow/unfollow
  const handleFollowToggle = async (user) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const userId = user.id || user._id;
    const username = user.username;
    const currentlyFollowing = followingMap[userId];
    
    try {
      // Update UI immediately for better user experience
      setFollowingMap(prev => ({
        ...prev,
        [userId]: !currentlyFollowing
      }));
      
      // Show temporary notification
      setFollowNotification({
        status: currentlyFollowing ? 'unfollowed' : 'followed',
        username: username
      });
      
      // Clear notification after 2 seconds
      setTimeout(() => {
        setFollowNotification(null);
      }, 2000);
      
      // Make the API call
      if (currentlyFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
      } else {
        await dispatch(followUser(userId)).unwrap();
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      
      // Revert UI state if API call fails
      setFollowingMap(prev => ({
        ...prev,
        [userId]: currentlyFollowing
      }));
      
      // Show error notification
      alert(`Failed to ${currentlyFollowing ? 'unfollow' : 'follow'} user. Please try again.`);
    }
  };
  
  // If not logged in, show login prompt
  const renderLoginPrompt = () => (
    <div className="login-prompt">
      <h3>Welcome to Twitter Clone</h3>
      <p>Sign in to see the latest updates from your network and the world.</p>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Log in</Link>
        <Link to="/signup" className="signup-btn">Sign up</Link>
      </div>
    </div>
  );
  
  // Render a suggested user card
  const renderSuggestedUser = (user) => {
    const userId = user.id || user._id;
    const isFollowing = followingMap[userId] || false;
    
    return (
      <div key={userId} className="follow-item">
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
        </div>
        <button 
          className={`follow-button ${isFollowing ? 'following' : ''}`}
          onClick={() => handleFollowToggle(user)}
        >
          {isFollowing ? (
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
  
  return (
    <Layout>
      <div className="home-container">
        {/* Left sidebar - keeping this for layout consistency */}
        <div className="sidebar">
          {/* Content for the left sidebar could go here */}
        </div>
        
        {/* Main feed column */}
        <div className="home-feed">
          <div className="timeline-header">
            <h2>Home</h2>
            <button 
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              title="Refresh"
            >
              <i className="refresh-icon">🔄</i>
            </button>
          </div>
          
          {/* Tweet form or login prompt */}
          {isAuthenticated ? (
            <TweetForm />
          ) : (
            renderLoginPrompt()
          )}
          
          {/* Tweet list */}
          <TweetList 
            tweets={tweets} 
            isLoading={isLoading} 
            error={error}
            emptyMessage="No tweets to show. Follow some users to see their tweets!"
          />
        </div>
        
        {/* Right sidebar */}
        <div className="right-sidebar">
          {/* Suggested users section */}
          {isAuthenticated && (
            <div className="who-to-follow">
              <h3>Who to follow</h3>
              {isUserLoading ? (
                <div className="loading-users">
                  <div className="loading-spinner"></div>
                  <p>Loading suggestions...</p>
                </div>
              ) : suggestedUsers && suggestedUsers.length > 0 ? (
                suggestedUsers.map(user => renderSuggestedUser(user))
              ) : (
                <div className="no-suggestions">
                  <p>No user suggestions available at the moment.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Trending section */}
          <div className="trends-container">
            <h3>What's happening</h3>
            <div className="trend-item">
              <div className="trend-category">Technology · Trending</div>
              <div className="trend-name">#ReactJS</div>
              <div className="tweet-count">5,241 Tweets</div>
            </div>
            <div className="trend-item">
              <div className="trend-category">Sports · Trending</div>
              <div className="trend-name">Premier League</div>
              <div className="tweet-count">34.2K Tweets</div>
            </div>
            <div className="trend-item">
              <div className="trend-category">Business · Trending</div>
              <div className="trend-name">#TechStartup</div>
              <div className="tweet-count">12.8K Tweets</div>
            </div>
          </div>
        </div>
      </div>
      
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

export default Home;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from '../../redux/slices/tweetSlice';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';
import TweetForm from '../../components/features/TweetForm/TweetForm';
import TweetList from '../../components/features/TweetList/TweetList';
import Layout from '../../components/layout/Layout';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { items: tweets, isLoading, error } = useSelector(state => state.tweets);
  
  // Fetch tweets when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTweets());
    }
  }, [dispatch, isAuthenticated]);
  
  // Refresh tweets function
  const refreshTweets = () => {
    if (isAuthenticated) {
      dispatch(fetchTweets());
    }
  };
  
  return (
    <Layout>
      <div className="main-content">
        <div className="timeline-header">
          <h2>Home</h2>
          {isAuthenticated && (
            <button 
              onClick={refreshTweets} 
              className="refresh-btn"
              disabled={isLoading}
            >
              🔄
            </button>
          )}
        </div>
        
        <TweetForm onSuccess={refreshTweets} />
        
        {!isAuthenticated ? (
          <div className="login-prompt">
            <h3>Welcome to X Clone</h3>
            <p>Log in to see your timeline and start tweeting.</p>
            <div className="auth-buttons">
              <a href="/login" className="login-btn">Log in</a>
              <a href="/signup" className="signup-btn">Sign up</a>
            </div>
          </div>
        ) : (
          <TweetList 
            tweets={tweets} 
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </Layout>
  );
};

export default Home;
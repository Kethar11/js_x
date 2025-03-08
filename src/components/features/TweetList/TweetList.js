import React from 'react';
import { useSelector } from 'react-redux';
import Tweet from '../Tweet/Tweet';
import './TweetList.css';

const TweetList = ({ tweets = [], isLoading = false, error = null, emptyMessage }) => {
  const currentUser = useSelector(state => state.auth.user);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="loading-tweets">
        <div className="loading-spinner"></div>
        <p>Loading tweets...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="error-loading-tweets">
        <p>Error loading tweets: {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Empty state
  if (!tweets || tweets.length === 0) {
    return (
      <div className="empty-tweets">
        <p>{emptyMessage || "No tweets yet."}</p>
      </div>
    );
  }
  
  // Tweets list
  return (
    <div className="tweet-list">
      {tweets.map((tweet) => (
        <Tweet 
          key={tweet._id || tweet.id} 
          tweet={tweet} 
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default TweetList;
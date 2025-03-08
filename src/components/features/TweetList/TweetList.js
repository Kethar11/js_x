import React from 'react';
import Tweet from '../Tweet/Tweet';
import './TweetList.css';

const TweetList = ({ tweets = [], isLoading = false, error = null }) => {
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
        <button className="retry-button">Retry</button>
      </div>
    );
  }
  
  // Empty state
  if (tweets.length === 0) {
    return (
      <div className="empty-tweets">
        <p>No tweets yet. Be the first to tweet!</p>
      </div>
    );
  }
  
  // Tweets list
  return (
    <div className="tweet-list">
      {tweets.map((tweet) => (
        <Tweet key={tweet._id || tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default TweetList;
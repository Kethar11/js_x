import React from 'react';
import Tweet from '../Tweet/Tweet';
import './TweetList.css';

const TweetList = ({ tweets = [] }) => {
  if (tweets.length === 0) {
    return (
      <div className="empty-tweets">
        <p>No tweets yet. Be the first to tweet!</p>
      </div>
    );
  }
  
  return (
    <div className="tweet-list">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default TweetList;
import React from 'react';
import { useDispatch } from 'react-redux';
import { likeTweet, retweetTweet } from '../../../redux/slices/tweetSlice';
import './Tweet.css';

const Tweet = ({ tweet }) => {
  const dispatch = useDispatch();
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLike = () => {
    dispatch(likeTweet(tweet.id));
  };
  
  const handleRetweet = () => {
    dispatch(retweetTweet(tweet.id));
  };
  
  return (
    <div className="tweet">
      <div className="tweet-avatar">
        <img src={tweet.author.profileImage} alt={tweet.author.username} />
      </div>
      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-author-name">{tweet.author.name}</span>
          <span className="tweet-author-username">@{tweet.author.username}</span>
          <span className="tweet-date">· {formatDate(tweet.createdAt)}</span>
        </div>
        <div className="tweet-text">
          {tweet.content}
        </div>
        <div className="tweet-actions">
          <button className="tweet-action comment">
            <i className="icon-comment">💬</i>
            <span>{tweet.replyCount}</span>
          </button>
          <button className="tweet-action retweet" onClick={handleRetweet}>
            <i className="icon-retweet">🔄</i>
            <span>{tweet.retweetCount}</span>
          </button>
          <button className="tweet-action like" onClick={handleLike}>
            <i className="icon-heart">❤️</i>
            <span>{tweet.likeCount}</span>
          </button>
          <button className="tweet-action share">
            <i className="icon-share">🔗</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
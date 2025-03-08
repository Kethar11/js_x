import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeUnlikeTweet, retweetUnretweet, deleteTweet } from '../../../redux/slices/tweetSlice';
import { selectUser } from '../../../redux/slices/authSlice';
import './Tweet.css';

const Tweet = ({ tweet }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  
  // Helper functions
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const isLiked = () => {
    return tweet.likes && tweet.likes.includes(currentUser?.id);
  };
  
  const isRetweeted = () => {
    return tweet.retweets && tweet.retweets.includes(currentUser?.id);
  };
  
  // Get total likes and retweets
  const likeCount = tweet.likes ? tweet.likes.length : 0;
  const retweetCount = tweet.retweets ? tweet.retweets.length : 0;
  const commentCount = tweet.commentCount || 0;
  
  // Action handlers
  const handleLike = () => {
    if (currentUser) {
      dispatch(likeUnlikeTweet(tweet._id));
    } else {
      // Handle unauthenticated user - maybe redirect to login
      alert('Please log in to like tweets');
    }
  };
  
  const handleRetweet = () => {
    if (currentUser) {
      dispatch(retweetUnretweet(tweet._id));
    } else {
      // Handle unauthenticated user
      alert('Please log in to retweet');
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      dispatch(deleteTweet(tweet._id));
    }
  };
  
  return (
    <div className="tweet">
      <div className="tweet-avatar">
        <img 
          src={tweet.user.profilePicture || "https://via.placeholder.com/50"} 
          alt={tweet.user.username} 
        />
      </div>
      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-author-name">{tweet.user.name || tweet.user.username}</span>
          <span className="tweet-author-username">@{tweet.user.username}</span>
          <span className="tweet-date">· {formatDate(tweet.createdAt)}</span>
          
          {/* Show delete option if this is user's own tweet */}
          {currentUser && currentUser.id === tweet.user._id && (
            <button 
              className="tweet-delete-btn" 
              onClick={handleDelete}
              title="Delete tweet"
            >
              🗑️
            </button>
          )}
        </div>
        
        {/* If this is a reply, show who it's replying to */}
        {tweet.inReplyToUser && (
          <div className="tweet-reply-to">
            Replying to <span className="reply-username">@{tweet.inReplyToUser.username}</span>
          </div>
        )}
        
        <div className="tweet-text">
          {tweet.content}
        </div>
        
        {/* If this tweet has media, show it */}
        {tweet.media && tweet.media.length > 0 && (
          <div className="tweet-media">
            {tweet.media.map((mediaUrl, index) => (
              <img 
                key={index}
                src={mediaUrl} 
                alt="Tweet media" 
                className="tweet-media-item"
              />
            ))}
          </div>
        )}
        
        {/* If this is a quote tweet, show the quoted tweet */}
        {tweet.quoteTweet && (
          <div className="quoted-tweet">
            <div className="quoted-tweet-header">
              <span className="tweet-author-name">{tweet.quoteTweet.user.name || tweet.quoteTweet.user.username}</span>
              <span className="tweet-author-username">@{tweet.quoteTweet.user.username}</span>
              <span className="tweet-date">· {formatDate(tweet.quoteTweet.createdAt)}</span>
            </div>
            <div className="quoted-tweet-content">
              {tweet.quoteTweet.content}
            </div>
          </div>
        )}
        
        <div className="tweet-actions">
          <button className="tweet-action comment">
            <i className="icon-comment">💬</i>
            <span>{commentCount}</span>
          </button>
          <button 
            className={`tweet-action retweet ${isRetweeted() ? 'active' : ''}`} 
            onClick={handleRetweet}
          >
            <i className="icon-retweet">🔄</i>
            <span>{retweetCount}</span>
          </button>
          <button 
            className={`tweet-action like ${isLiked() ? 'active' : ''}`} 
            onClick={handleLike}
          >
            <i className="icon-heart">❤️</i>
            <span>{likeCount}</span>
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
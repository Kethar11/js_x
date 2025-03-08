import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  likeUnlikeTweet, 
  retweetUnretweet, 
  deleteTweet,
  addComment
} from '../../../redux/slices/tweetSlice';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/authSlice';
import TweetModal from '../TweetModal/TweetModal';
import './Tweet.css';

const Tweet = ({ tweet }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state and user info
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state for UI
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState({
    like: false,
    retweet: false,
    comment: false,
    delete: false
  });
  
  // Helper functions
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const isLiked = () => {
    if (!currentUser || !tweet.likes) return false;
    
    const userId = currentUser.id || currentUser._id;
    return tweet.likes.some(id => id === userId);
  };
  
  const isRetweeted = () => {
    if (!currentUser || !tweet.retweets) return false;
    
    const userId = currentUser.id || currentUser._id;
    return tweet.retweets.some(id => id === userId);
  };
  
  const isOwnTweet = () => {
    if (!currentUser || !tweet.user) return false;
    
    const currentUserId = currentUser.id || currentUser._id;
    const tweetUserId = tweet.user.id || tweet.user._id;
    
    return currentUserId === tweetUserId;
  };
  
  // Get total likes, retweets, and comments
  const likeCount = tweet.likeCount || (tweet.likes ? tweet.likes.length : 0);
  const retweetCount = tweet.retweetCount || (tweet.retweets ? tweet.retweets.length : 0);
  const commentCount = tweet.commentCount || 0;
  
  // Action handlers
  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const tweetId = tweet.id || tweet._id;
    
    if (!tweetId || isSubmittingAction.like) return;
    
    try {
      setIsSubmittingAction(prev => ({ ...prev, like: true }));
      await dispatch(likeUnlikeTweet(tweetId)).unwrap();
    } catch (error) {
      console.error('Error toggling like status:', error);
    } finally {
      setIsSubmittingAction(prev => ({ ...prev, like: false }));
    }
  };
  
  const handleRetweet = async (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const tweetId = tweet.id || tweet._id;
    
    if (!tweetId || isSubmittingAction.retweet) return;
    
    try {
      setIsSubmittingAction(prev => ({ ...prev, retweet: true }));
      await dispatch(retweetUnretweet(tweetId)).unwrap();
    } catch (error) {
      console.error('Error toggling retweet status:', error);
    } finally {
      setIsSubmittingAction(prev => ({ ...prev, retweet: false }));
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    
    if (!isOwnTweet() || isSubmittingAction.delete) return;
    
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      const tweetId = tweet.id || tweet._id;
      
      try {
        setIsSubmittingAction(prev => ({ ...prev, delete: true }));
        await dispatch(deleteTweet(tweetId)).unwrap();
      } catch (error) {
        console.error('Error deleting tweet:', error);
      } finally {
        setIsSubmittingAction(prev => ({ ...prev, delete: false }));
      }
    }
  };
  
  const handleCommentClick = (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Open reply modal
    setShowReplyModal(true);
  };
  
  const handleShare = (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    
    // Copy tweet URL to clipboard
    const tweetId = tweet.id || tweet._id;
    const url = `${window.location.origin}/tweet/${tweetId}`;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Tweet link copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  const closeReplyModal = () => {
    setShowReplyModal(false);
  };
  
  // Handle submission of a reply
  const handleReplySubmit = async (content, media = []) => {
    if (!content.trim() && media.length === 0) return;
    
    const tweetId = tweet.id || tweet._id;
    
    if (!tweetId || isSubmittingAction.comment) return;
    
    try {
      setIsSubmittingAction(prev => ({ ...prev, comment: true }));
      
      await dispatch(addComment({
        tweetId,
        content,
        media
      })).unwrap();
      
      setShowReplyModal(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmittingAction(prev => ({ ...prev, comment: false }));
    }
  };
  
  // Handle navigation to user profile
  const navigateToProfile = (e) => {
    e.stopPropagation(); // Prevent tweet click from propagating
    navigate(`/profile/${tweet.user.username}`);
  };
  
  // Navigate to tweet detail
  const navigateToTweet = () => {
    const tweetId = tweet.id || tweet._id;
    navigate(`/tweet/${tweetId}`);
  };
  
  return (
    <>
      <div className="tweet" onClick={navigateToTweet}>
        <div className="tweet-avatar" onClick={navigateToProfile}>
          <img 
            src={tweet.user.profilePicture || "/default-avatar.png"} 
            alt={tweet.user.username} 
          />
        </div>
        <div className="tweet-content">
          <div className="tweet-header">
            <div className="tweet-user-info" onClick={navigateToProfile}>
              <span className="tweet-author-name">{tweet.user.name || tweet.user.username}</span>
              <span className="tweet-author-username">@{tweet.user.username}</span>
              <span className="tweet-date">· {formatDate(tweet.createdAt)}</span>
            </div>
            
            {/* Show delete option if this is user's own tweet */}
            {isOwnTweet() && (
              <button 
                className="tweet-delete-btn" 
                onClick={handleDelete}
                title="Delete tweet"
                disabled={isSubmittingAction.delete}
              >
                {isSubmittingAction.delete ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
          
          {/* If this is a reply, show who it's replying to */}
          {tweet.inReplyToUser && (
            <div className="tweet-reply-to">
              Replying to <Link 
                to={`/profile/${tweet.inReplyToUser.username}`}
                className="reply-username"
                onClick={(e) => e.stopPropagation()}
              >
                @{tweet.inReplyToUser.username}
              </Link>
            </div>
          )}
          
          <div className="tweet-text">
            {tweet.content}
          </div>
          
          {/* If this tweet has media, show it */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="tweet-media">
              {tweet.media.map((mediaUrl, index) => (
                <div key={index} className="tweet-media-item-container">
                  {mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) || mediaUrl.startsWith('data:image') ? (
                    <img 
                      src={mediaUrl} 
                      alt="Tweet media" 
                      className="tweet-media-item"
                    />
                  ) : mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video 
                      src={mediaUrl} 
                      controls
                      className="tweet-media-item"
                    />
                  ) : (
                    <div className="tweet-media-item media-fallback">
                      Media
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* If this is a quote tweet, show the quoted tweet */}
          {tweet.quoteTweet && (
            <div 
              className="quoted-tweet"
              onClick={(e) => {
                e.stopPropagation();
                const quoteTweetId = tweet.quoteTweet.id || tweet.quoteTweet._id;
                navigate(`/tweet/${quoteTweetId}`);
              }}
            >
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
            <button 
              className="tweet-action comment"
              onClick={handleCommentClick}
              disabled={isSubmittingAction.comment}
            >
              <i className="icon-comment">💬</i>
              <span>{commentCount}</span>
            </button>
            <button 
              className={`tweet-action retweet ${isRetweeted() ? 'active' : ''}`} 
              onClick={handleRetweet}
              disabled={isSubmittingAction.retweet}
            >
              <i className="icon-retweet">{isRetweeted() ? '✅' : '🔄'}</i>
              <span>{retweetCount}</span>
            </button>
            <button 
              className={`tweet-action like ${isLiked() ? 'active' : ''}`} 
              onClick={handleLike}
              disabled={isSubmittingAction.like}
            >
              <i className="icon-heart">{isLiked() ? '❤️' : '🤍'}</i>
              <span>{likeCount}</span>
            </button>
            <button 
              className="tweet-action share"
              onClick={handleShare}
            >
              <i className="icon-share">🔗</i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Reply Modal */}
      {showReplyModal && (
        <TweetModal 
          onClose={closeReplyModal}
          replyTo={tweet}
          onSubmit={handleReplySubmit}
        />
      )}
    </>
  );
};

export default Tweet;
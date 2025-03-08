import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTweet } from '../../../redux/slices/tweetSlice';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/authSlice';
import './TweetForm.css';

const TweetForm = ({ replyTo, quoteTweet, onSuccess }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingChars, setRemainingChars] = useState(280);
  const dispatch = useDispatch();
  
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Update remaining characters as user types
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setRemainingChars(280 - newContent.length);
  };
  
  // Handle tweet submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to post a tweet');
      return;
    }
    
    if (!content.trim() && media.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare tweet data
      const tweetData = {
        content,
        media
      };
      
      // If this is a reply to another tweet
      if (replyTo) {
        tweetData.inReplyToTweetId = replyTo;
      }
      
      // If this is a quote tweet
      if (quoteTweet) {
        tweetData.quoteTweetId = quoteTweet;
      }
      
      // Dispatch create tweet action
      await dispatch(createTweet(tweetData)).unwrap();
      
      // Clear the form
      setContent('');
      setMedia([]);
      setRemainingChars(280);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle media upload (simplified version - real implementation would use a file upload)
  const handleMediaUpload = () => {
    // Simplified media upload - in a real app, this would connect to a file upload API
    const mockMediaUrl = prompt('Enter media URL (for demo purposes):');
    if (mockMediaUrl) {
      setMedia([...media, mockMediaUrl]);
    }
  };
  
  // Remove a media item
  const handleRemoveMedia = (index) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };
  
  return (
    <div className="tweet-form-container">
      {isAuthenticated ? (
        <>
          <div className="tweet-form-avatar">
            <img 
              src={currentUser?.profilePicture || "https://via.placeholder.com/50"} 
              alt="User avatar" 
            />
          </div>
          <div className="tweet-form-content">
            <form onSubmit={handleSubmit}>
              {/* If replying to someone, show who we're replying to */}
              {replyTo && (
                <div className="replying-to">
                  Replying to <span className="reply-username">@{replyTo}</span>
                </div>
              )}
              
              <textarea
                className="tweet-input"
                placeholder={replyTo ? "Tweet your reply" : "What's happening?"}
                value={content}
                onChange={handleContentChange}
                maxLength={280}
              />
              
              {/* Display uploaded media */}
              {media.length > 0 && (
                <div className="tweet-form-media">
                  {media.map((url, index) => (
                    <div key={index} className="media-preview">
                      <img src={url} alt="Media preview" />
                      <button 
                        type="button" 
                        className="remove-media-btn" 
                        onClick={() => handleRemoveMedia(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="tweet-form-footer">
                <div className="tweet-form-actions">
                  <button 
                    type="button" 
                    className="tweet-action-btn"
                    onClick={handleMediaUpload}
                  >
                    <i className="icon-image">📷</i>
                  </button>
                  <button type="button" className="tweet-action-btn">
                    <i className="icon-gif">GIF</i>
                  </button>
                  <button type="button" className="tweet-action-btn">
                    <i className="icon-poll">📊</i>
                  </button>
                  <button type="button" className="tweet-action-btn">
                    <i className="icon-emoji">😊</i>
                  </button>
                </div>
                
                <div className="tweet-form-submit">
                  {remainingChars <= 20 && (
                    <div className={`chars-remaining ${remainingChars <= 0 ? 'limit-reached' : ''}`}>
                      {remainingChars}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="tweet-submit-btn"
                    disabled={(!content.trim() && media.length === 0) || isSubmitting || remainingChars < 0}
                  >
                    {isSubmitting ? 'Posting...' : replyTo ? 'Reply' : 'Tweet'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="login-to-tweet">
          Please <a href="/login">log in</a> to post a tweet.
        </div>
      )}
    </div>
  );
};

export default TweetForm;
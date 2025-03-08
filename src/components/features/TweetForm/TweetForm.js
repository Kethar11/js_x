import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTweet } from '../../../redux/slices/tweetSlice';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/authSlice';
import EmojiPicker from 'emoji-picker-react';
import './TweetForm.css';

const TweetForm = ({ replyTo, quoteTweet, onSuccess }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingChars, setRemainingChars] = useState(280);
  const fileInputRef = useRef(null);
  
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
  
  // Handle file upload button click
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Process each file and convert to data URL for preview
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
        alert("File size should not exceed 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(prevMedia => [...prevMedia, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    e.target.value = '';
  };
  
  // Handle GIF selection (mock implementation)
  const handleGifSelect = () => {
    // In a real implementation, this would open a GIF search modal
    const mockGifUrl = prompt('Enter GIF URL (for demo purposes):');
    if (mockGifUrl) {
      setMedia([...media, mockGifUrl]);
    }
  };
  
  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    setContent(prevContent => prevContent + emojiData.emoji);
    setRemainingChars(prevRemainingChars => prevRemainingChars - 1);
    setShowEmojiPicker(false);
  };
  
  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
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
              src={currentUser?.profilePicture || "/default-avatar.png"} 
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
                      {url.startsWith('data:image') || url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img src={url} alt="Media preview" />
                      ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={url} controls={false} muted loop />
                      ) : (
                        <div className="media-fallback">Media</div>
                      )}
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
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
                hidden
              />
              
              <div className="tweet-form-footer">
                <div className="tweet-form-actions">
                  {/* Image upload button */}
                  <button 
                    type="button" 
                    className="tweet-action-btn"
                    onClick={handleFileButtonClick}
                    title="Add photo or video"
                  >
                    <i className="icon-image">📷</i>
                  </button>
                  
                  {/* GIF button */}
                  <button 
                    type="button" 
                    className="tweet-action-btn"
                    onClick={handleGifSelect}
                    title="Add GIF"
                  >
                    <i className="icon-gif">GIF</i>
                  </button>
                  
                  {/* Poll button */}
                  <button 
                    type="button" 
                    className="tweet-action-btn"
                    title="Add poll"
                  >
                    <i className="icon-poll">📊</i>
                  </button>
                  
                  {/* Emoji button */}
                  <button 
                    type="button" 
                    className="tweet-action-btn"
                    onClick={toggleEmojiPicker}
                    title="Add emoji"
                  >
                    <i className="icon-emoji">😊</i>
                  </button>
                  
                  {/* Emoji picker */}
                  {showEmojiPicker && (
                    <div className="emoji-picker-container">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        disableAutoFocus={true}
                        previewConfig={{
                          showPreview: false
                        }}
                      />
                    </div>
                  )}
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
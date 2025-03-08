import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTweet } from '../../../redux/slices/tweetSlice';
import { selectUser } from '../../../redux/slices/authSlice';
import EmojiPicker from 'emoji-picker-react';
import './TweetModal.css';

const TweetModal = ({ onClose, replyTo, quoteTweet, onSubmit }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingChars, setRemainingChars] = useState(280);
  
  const modalRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const contentContainerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  
  // Focus the textarea when the modal opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);
  
  // Handle click outside the emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker && 
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);
  
  // Handle click outside to close the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Close on escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Update remaining characters
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setRemainingChars(280 - newContent.length);
  };
  
  // Handle tweet submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!content.trim() && media.length === 0) || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        // Use the provided onSubmit callback for replies or quotes
        await onSubmit(content, media);
      } else {
        // Create a new tweet
        const tweetData = {
          content,
          media
        };
        
        // If this is a reply to another tweet
        if (replyTo) {
          tweetData.inReplyToTweetId = replyTo.id || replyTo._id;
        }
        
        // If this is a quote tweet
        if (quoteTweet) {
          tweetData.quoteTweetId = quoteTweet.id || quoteTweet._id;
        }
        
        await dispatch(createTweet(tweetData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to submit tweet:', error);
      alert('Failed to submit tweet. Please try again.');
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
    
    // Limit to 4 media items
    if (media.length + files.length > 4) {
      alert('You can only attach up to 4 media items per tweet.');
      return;
    }
    
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
      if (media.length >= 4) {
        alert('You can only attach up to 4 media items per tweet.');
        return;
      }
      setMedia([...media, mockGifUrl]);
    }
  };
  
  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPosition = textareaRef.current.selectionStart;
    
    // Insert emoji at cursor position
    const newContent = 
      content.substring(0, cursorPosition) + 
      emoji + 
      content.substring(cursorPosition);
    
    setContent(newContent);
    setRemainingChars(280 - newContent.length);
    
    // Focus textarea and set cursor position after emoji
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = cursorPosition + emoji.length;
      textareaRef.current.selectionEnd = cursorPosition + emoji.length;
    }, 0);
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
    <div className="tweet-modal-overlay">
      <div className="tweet-modal-container" ref={modalRef}>
        <div className="tweet-modal-header">
          <button 
            className="close-modal-btn" 
            onClick={onClose} 
            aria-label="Close"
          >
            ✕
          </button>
          {isSubmitting && <span className="submitting-indicator">Posting...</span>}
        </div>
        
        <div className="tweet-modal-scrollable" ref={contentContainerRef}>
          <div className="tweet-modal-content">
            <div className="tweet-modal-user">
              <div className="user-avatar">
                <img 
                  src={currentUser?.profilePicture || "/default-avatar.png"} 
                  alt={currentUser?.username || "User"} 
                />
              </div>
            </div>
            
            <div className="tweet-modal-form">
              {/* If this is a reply, show the original tweet info */}
              {replyTo && (
                <div className="replying-to-container">
                  <div className="replying-to">
                    Replying to <span className="reply-username">@{replyTo.user.username}</span>
                  </div>
                  <div className="reply-tweet-preview">
                    <p className="reply-tweet-text">{replyTo.content}</p>
                  </div>
                </div>
              )}
              
              {/* If this is a quote tweet, show the quoted tweet info */}
              {quoteTweet && (
                <div className="quoting-tweet-container">
                  <div className="quoting-tweet">
                    <span>Adding comment to Tweet by </span>
                    <span className="quote-username">@{quoteTweet.user.username}</span>
                  </div>
                  <div className="quote-tweet-preview">
                    <p className="quote-tweet-text">{quoteTweet.content}</p>
                  </div>
                </div>
              )}
              
              <textarea
                ref={textareaRef}
                className="tweet-modal-textarea"
                placeholder={
                  replyTo 
                    ? `Reply to @${replyTo.user.username}` 
                    : quoteTweet 
                      ? `Add your comment about @${quoteTweet.user.username}'s Tweet` 
                      : "What's happening?"
                }
                value={content}
                onChange={handleContentChange}
                maxLength={280}
              ></textarea>
              
              {/* Media preview */}
              {media.length > 0 && (
                <div className="tweet-modal-media">
                  {media.map((url, index) => (
                    <div key={index} className="media-preview">
                      {url.startsWith('data:image') || url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img src={url} alt="Media preview" />
                      ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={url} controls muted />
                      ) : (
                        <div className="media-fallback">Media</div>
                      )}
                      <button 
                        type="button" 
                        className="remove-media-btn" 
                        onClick={() => handleRemoveMedia(index)}
                        aria-label="Remove media"
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
            </div>
          </div>
          
          <div className="tweet-modal-divider"></div>
          
          <div className="tweet-modal-actions">
            <div className="tweet-modal-tools">
              {/* Image upload button */}
              <button 
                type="button" 
                className="tweet-action-btn"
                onClick={handleFileButtonClick}
                title="Add photo or video"
                aria-label="Add photo or video"
                disabled={media.length >= 4}
              >
                <i className="icon-image">📷</i>
              </button>
              
              {/* GIF button */}
              <button 
                type="button" 
                className="tweet-action-btn"
                onClick={handleGifSelect}
                title="Add GIF"
                aria-label="Add GIF"
                disabled={media.length >= 4}
              >
                <i className="icon-gif">GIF</i>
              </button>
              
              {/* Poll button */}
              <button 
                type="button" 
                className="tweet-action-btn"
                title="Add poll"
                aria-label="Add poll"
              >
                <i className="icon-poll">📊</i>
              </button>
              
              {/* Emoji button */}
              <button 
                ref={emojiButtonRef}
                type="button" 
                className="tweet-action-btn"
                onClick={toggleEmojiPicker}
                title="Add emoji"
                aria-label="Add emoji"
              >
                <i className="icon-emoji">😊</i>
              </button>
            </div>
            
            <div className="tweet-submit-container">
              {remainingChars <= 20 && (
                <div className={`chars-remaining ${remainingChars <= 0 ? 'limit-reached' : ''}`}>
                  {remainingChars}
                </div>
              )}
              
              <button 
                type="button" 
                className="tweet-submit-btn"
                onClick={handleSubmit}
                disabled={(!content.trim() && media.length === 0) || isSubmitting || remainingChars < 0}
              >
                {isSubmitting ? 'Posting...' : replyTo ? 'Reply' : quoteTweet ? 'Quote' : 'Tweet'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emoji picker positioned correctly */}
      {showEmojiPicker && (
        <div 
          className="emoji-picker-container"
          ref={emojiPickerRef}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableAutoFocus={true}
            searchDisabled={false}
            lazyLoadEmojis={true}
            previewConfig={{
              showPreview: false
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TweetModal;
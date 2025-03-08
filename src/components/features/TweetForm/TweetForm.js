import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTweet } from '../../../redux/slices/tweetSlice';
import './TweetForm.css';

const TweetForm = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(createTweet({ content })).unwrap();
      setContent('');
    } catch (error) {
      console.error('Failed to create tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="tweet-form-container">
      <div className="tweet-form-avatar">
        <img src="https://via.placeholder.com/50" alt="User avatar" />
      </div>
      <div className="tweet-form-content">
        <form onSubmit={handleSubmit}>
          <textarea
            className="tweet-input"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
          />
          <div className="tweet-form-footer">
            <div className="tweet-form-actions">
              <button type="button" className="tweet-action-btn">
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
            <button 
              type="submit" 
              className="tweet-submit-btn"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetForm;
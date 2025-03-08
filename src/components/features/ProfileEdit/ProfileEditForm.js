import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../../redux/slices/userSlice';
import { selectUser } from '../../../redux/slices/authSlice';
import './ProfileEditForm.css';

const ProfileEditForm = ({ onClose }) => {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profilePicture: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState('');
  const [charCount, setCharCount] = useState({
    bio: 0,
    location: 0,
    website: 0,
    name: 0
  });
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState('');
  
  // Set initial form data from current user
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        website: currentUser.website || '',
        profilePicture: currentUser.profilePicture || ''
      });
      
      // Set initial image preview
      setImagePreview(currentUser.profilePicture || '');
      
      // Set initial character counts
      setCharCount({
        name: currentUser.name ? currentUser.name.length : 0,
        bio: currentUser.bio ? currentUser.bio.length : 0,
        location: currentUser.location ? currentUser.location.length : 0,
        website: currentUser.website ? currentUser.website.length : 0
      });
    }
  }, [currentUser]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update character count for relevant fields
    if (['name', 'bio', 'location', 'website'].includes(name)) {
      setCharCount({
        ...charCount,
        [name]: value.length
      });
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please select a JPEG or PNG image.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB.');
      return;
    }
    
    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the file to your server here
    // For this example, we'll just use the data URL as the profile picture
    setFormData({
      ...formData,
      profilePicture: 'pending_upload' // Placeholder, will be replaced with the data URL
    });
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Remove profile picture
  const removeProfilePicture = () => {
    setImagePreview('');
    setFormData({
      ...formData,
      profilePicture: ''
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Don't submit if already loading
    if (loading) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Create object with only fields that have changed
      const updateData = {};
      
      // Check each field for changes
      if (formData.name !== (currentUser.name || '')) updateData.name = formData.name;
      if (formData.bio !== (currentUser.bio || '')) updateData.bio = formData.bio;
      if (formData.location !== (currentUser.location || '')) updateData.location = formData.location;
      if (formData.website !== (currentUser.website || '')) updateData.website = formData.website;
      
      // Handle profile picture update
      if (imagePreview && imagePreview !== currentUser.profilePicture) {
        updateData.profilePicture = imagePreview;
      } else if (formData.profilePicture === '' && currentUser.profilePicture) {
        // User removed the profile picture
        updateData.profilePicture = '';
      }
      
      // Only dispatch if there are changes
      if (Object.keys(updateData).length > 0) {
        const userId = currentUser.id || currentUser._id;
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        console.log('Updating profile with data:', updateData);
        console.log('For user ID:', userId);
        
        // Using the endpoint structure from the Swagger API
        const result = await dispatch(updateUserProfile({
          userId,
          profileData: updateData
        })).unwrap();
        
        console.log('Profile update result:', result);
        
        setSuccess(true);
        
        // Close modal after a brief delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // No changes made
        console.log('No changes detected, closing modal');
        onClose();
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-edit-modal">
      <div className="modal-header">
        <button type="button" className="close-button" onClick={onClose}>✕</button>
        <h2>Edit profile</h2>
        <button 
          type="button"
          className="save-button" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <div className="form-scrollable-content">
        <div className="profile-banner-section">
          <div className="banner-placeholder"></div>
          <div className="profile-image-container">
            <img 
              src={imagePreview || "/default-avatar.png"} 
              alt="Profile" 
              className="profile-image"
            />
            <div className="image-controls">
              <button 
                type="button"
                className="change-photo-button"
                onClick={triggerFileInput}
                aria-label="Change profile photo"
              >
                📷
              </button>
              {imagePreview && (
                <button
                  type="button"
                  className="remove-photo-button"
                  onClick={removeProfilePicture}
                  aria-label="Remove profile photo"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          {imageError && <div className="form-error">{imageError}</div>}
          {success && <div className="form-success">Profile updated successfully!</div>}
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              className="form-control"
            />
            <div className="character-count">{charCount.name}/50</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={160}
              className="form-control"
              placeholder="Describe yourself"
            ></textarea>
            <div className={`character-count ${charCount.bio > 140 ? 'near-limit' : ''}`}>
              {charCount.bio}/160
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength={30}
              className="form-control"
              placeholder="Add your location"
            />
            <div className="character-count">{charCount.location}/30</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              maxLength={100}
              className="form-control"
              placeholder="Add your website"
            />
            <div className="character-count">{charCount.website}/100</div>
            <div className="form-hint">
              URLs must start with http:// or https://
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
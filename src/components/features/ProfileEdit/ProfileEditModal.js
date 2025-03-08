import React, { useEffect, useRef } from 'react';
import ProfileEditForm from '../ProfileEdit/ProfileEditForm';
import './ProfileEditModal.css';

const ProfileEditModal = ({ onClose }) => {
  const modalRef = useRef(null);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Handle click outside to close modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <ProfileEditForm onClose={onClose} />
      </div>
    </div>
  );
};

export default ProfileEditModal;
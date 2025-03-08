import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">X</Link>
      </div>
      
      <nav className="sidebar-menu">
        <Link to="/" className="menu-item active">
          <i className="icon-home">🏠</i>
          <span>Home</span>
        </Link>
        <Link to="/explore" className="menu-item">
          <i className="icon-explore">🔍</i>
          <span>Explore</span>
        </Link>
        <Link to="/notifications" className="menu-item">
          <i className="icon-notifications">🔔</i>
          <span>Notifications</span>
        </Link>
        <Link to="/messages" className="menu-item">
          <i className="icon-messages">✉️</i>
          <span>Messages</span>
        </Link>
        <Link to="/profile" className="menu-item">
          <i className="icon-profile">👤</i>
          <span>Profile</span>
        </Link>
      </nav>
      
      <button className="tweet-button">Tweet</button>
    </div>
  );
};

export default Sidebar;
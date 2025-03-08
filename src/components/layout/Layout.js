import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Search from '../features/Search/Search';
import UserDropdown from '../features/UserDropdown/UserDropdown';
import TweetModal from '../features/TweetModal/TweetModal';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showTweetModal, setShowTweetModal] = useState(false);
  
  // Determine if we're on the home page
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  
  // Function to open the tweet modal
  const openTweetModal = () => {
    setShowTweetModal(true);
  };
  
  return (
    <div className="layout">
      <Header>
        <div className="header-content">
          <div className="header-logo">X</div>
          <div className="header-search">
            <Search />
          </div>
          <div className="header-user">
            <UserDropdown />
          </div>
        </div>
      </Header>
      
      <div className="layout-container">
        <Sidebar onTweetClick={openTweetModal} />
        
        <main className="layout-main">
          {children}
        </main>
        
        {!isHomePage && (
          <div className="sidebar-right">
            <div className="search-container-sidebar">
              <Search />
            </div>
            
            <div className="trends-container">
              <h3>What's happening</h3>
              <div className="trend-item">
                <div className="trend-category">Technology · Trending</div>
                <div className="trend-name">#ReactJS</div>
                <div className="tweet-count">5,241 Tweets</div>
              </div>
              <div className="trend-item">
                <div className="trend-category">Sports · Trending</div>
                <div className="trend-name">Premier League</div>
                <div className="tweet-count">34.2K Tweets</div>
              </div>
              <div className="trend-item">
                <div className="trend-category">Business · Trending</div>
                <div className="trend-name">#TechStartup</div>
                <div className="tweet-count">12.8K Tweets</div>
              </div>
            </div>
            
            <div className="footer-links-sidebar">
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#cookie">Cookie Policy</a>
              <a href="#accessibility">Accessibility</a>
              <a href="#ads">Ads Info</a>
              <div className="copyright">© 2023 Twitter Clone</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating tweet button for mobile */}
      <button 
        className="float-tweet-button"
        onClick={openTweetModal}
        aria-label="Compose Tweet"
      >
        <span>+</span>
      </button>
      
      {/* Tweet Modal */}
      {showTweetModal && (
        <TweetModal onClose={() => setShowTweetModal(false)} />
      )}
      
      <Footer />
    </div>
  );
};

export default Layout;
import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-main">
          {children}
        </main>
        <div className="trends-section">
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
          
          <div className="who-to-follow">
            <h3>Who to follow</h3>
            <div className="follow-item">
              <img src="https://via.placeholder.com/40" alt="User" className="user-img" />
              <div className="user-info">
                <div className="user-name">Tech News</div>
                <div className="user-handle">@technews</div>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="follow-item">
              <img src="https://via.placeholder.com/40" alt="User" className="user-img" />
              <div className="user-info">
                <div className="user-name">React Community</div>
                <div className="user-handle">@reactjs</div>
              </div>
              <button className="follow-button">Follow</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
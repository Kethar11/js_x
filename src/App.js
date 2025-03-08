import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, fetchCurrentUser } from './redux/slices/authSlice';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';

// Layout
import Layout from './components/layout/Layout';

import './App.css';

// Coming Soon Component
const ComingSoonPage = ({ title, icon, description }) => {
  const navigate = useNavigate();
  
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-icon">{icon}</div>
      <h1 className="coming-soon-title">{title}</h1>
      <p className="coming-soon-description">{description}</p>
      <button className="back-to-home" onClick={() => navigate('/home')}>
        Back to Home
      </button>
    </div>
  );
};

// Page Components with Layout
const ExplorePage = () => (
  <Layout>
    <ComingSoonPage 
      title="Explore" 
      icon="🔍" 
      description="Discover trending topics, popular hashtags, and interesting accounts to follow. This feature is coming soon."
    />
  </Layout>
);

const NotificationsPage = () => (
  <Layout>
    <ComingSoonPage 
      title="Notifications" 
      icon="🔔" 
      description="Stay updated with likes, retweets, replies, and mentions. This feature is coming soon."
    />
  </Layout>
);

const MessagesPage = () => (
  <Layout>
    <ComingSoonPage 
      title="Messages" 
      icon="✉️" 
      description="Connect privately with other users through direct messages. This feature is coming soon."
    />
  </Layout>
);

const BookmarksPage = () => (
  <Layout>
    <ComingSoonPage 
      title="Bookmarks" 
      icon="🔖" 
      description="Save tweets to read later. This feature is coming soon."
    />
  </Layout>
);

const ListsPage = () => (
  <Layout>
    <ComingSoonPage 
      title="Lists" 
      icon="📋" 
      description="Create and manage lists of Twitter accounts. This feature is coming soon."
    />
  </Layout>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Home route - redirect to login if not authenticated */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Sidebar/Header menu routes */}
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/lists" 
            element={
              <ProtectedRoute>
                <ListsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile page - accessible without authentication */}
          <Route path="/profile/:username" element={<Profile />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
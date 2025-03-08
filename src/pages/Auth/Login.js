import './Auth.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuth, clearError } from '../../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
    
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dispatch login action
    dispatch(loginUser({
      username: formData.username,
      password: formData.password
    }));
  };

  return (
    <div className="auth-container">
      <h2>Login to X</h2>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>
        Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link">Sign up</span>
      </p>
    </div>
  );
};

export default Login;
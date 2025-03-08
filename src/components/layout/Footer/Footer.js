import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookie">Cookie Policy</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/ads">Ads Info</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/status">Status</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/brand">Brand Resources</Link>
          <Link to="/advertise">Advertising</Link>
          <Link to="/marketing">Marketing</Link>
          <Link to="/business">X for Business</Link>
          <Link to="/developers">Developers</Link>
          <Link to="/directory">Directory</Link>
          <Link to="/settings">Settings</Link>
        </div>
        <div className="footer-copyright">
          © {currentYear} X Corp.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
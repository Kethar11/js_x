import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
//import Login from './pages/Auth/Login';
//import Signup from './pages/Auth/Signup';
//import Header from './components/layout/Header/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Header /> */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
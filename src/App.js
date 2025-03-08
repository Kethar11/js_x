import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';  // ✅ Uncommented
import Signup from './pages/Auth/Signup';  // ✅ Uncommented
//import Header from './components/layout/Header/Header';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Header /> */}
        <div className="container">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />  {/* ✅ Uncommented */}
            <Route path="/signup" element={<Signup />} />  {/* ✅ Uncommented */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

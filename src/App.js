import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import StateDetailPage from './pages/StateDetailPage';


function App() {
    return (
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/state/:stateName" element={<StateDetailPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
  
  export default App;

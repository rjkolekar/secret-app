import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import Component from './Fb';
// import YourComponent from './component1';
// import Login from './Login';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/" element={<Component />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;

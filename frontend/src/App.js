import React from 'react';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Dashboard />
    </Router>
  );
}

export default App;

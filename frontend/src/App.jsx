import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/renting-all" replace />} />
        <Route 
          path="/renting-all" 
          element={
            token ? 
              <AdminPanel onLogout={handleLogout} /> : 
              <Login onLogin={handleLogin} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
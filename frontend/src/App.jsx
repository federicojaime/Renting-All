import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    // Verificar si el token es válido al cargar la aplicación
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (currentToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/token/validate/${currentToken}`);
      const data = await response.json();
      
      if (!data.ok) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error validating token:', error);
      handleLogout();
    }
  };

  const handleLogin = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/renting-all" replace />} />
        <Route 
          path="/renting-all" 
          element={
            token ? (
              <AdminPanel onLogout={handleLogout} user={user} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
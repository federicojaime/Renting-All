// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useToast, ChakraProvider } from '@chakra-ui/react';

// Páginas
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

/**
 * Componente principal de la aplicación
 * Maneja autenticación y rutas principales
 */
function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const toast = useToast();

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (currentToken) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';
      const response = await fetch(`${apiUrl}/user/token/validate/${currentToken}`);
      const data = await response.json();

      if (!data.ok) {
        handleLogout('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
      }
    } catch (error) {
      console.error('Error al validar token:', error);
      handleLogout('Error de conexión. Por favor inicie sesión nuevamente.');
    }
  };

  const handleLogin = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);

    toast({
      title: '¡Bienvenido!',
      description: `Hola ${userData.nombre}. Has iniciado sesión correctamente.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const handleLogout = (message) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);

    if (message) {
      toast({
        title: 'Sesión finalizada',
        description: message,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard/*" 
        element={token ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
      />
      <Route 
        path="*" 
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

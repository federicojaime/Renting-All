import React, { useState } from 'react';
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
    <div className="App">
      {token ? <AdminPanel onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
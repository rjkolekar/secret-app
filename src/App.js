import React, { useState } from 'react';
import Dashboard from './components/Dashoard';
import Login from './components/Login';
import { updateUserAccessToken, loginUser } from './services/app';



const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async (userData) => {
    try {
      const existingUser = await loginUser(userData);
      if (existingUser) {
        // Update access token if user already exists
        await updateUserAccessToken(userData);
        setUser(userData);

        // Fetch admin posts after successful login
        
      }
    } catch (error) {
      console.error('Error handling login:', error);
    }
  };

  const handleLogout = () => {
    // Handle logout functionality if required
    localStorage.clear()
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

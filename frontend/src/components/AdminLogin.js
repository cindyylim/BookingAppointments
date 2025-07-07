// AdminLogin.js
// Simple login form for admin access.
import React, { useState } from 'react';

function AdminLogin({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: <input value={username} onChange={e => setUsername(e.target.value)} required /></label>
        </div>
        <div>
          <label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        </div>
        <button type="submit">Login</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default AdminLogin; 
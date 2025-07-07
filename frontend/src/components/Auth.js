// Auth.js
import React, { useState } from 'react';

function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      // Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jwt', data.token);
        onAuth(data.user);
      } else {
        setError('Invalid credentials');
      }
    } else {
      // Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, phone })
      });
      if (res.ok) {
        setIsLogin(true);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div style={{maxWidth: 400, margin: 'auto'}}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: <input value={username} onChange={e => setUsername(e.target.value)} required /></label>
        </div>
        <div>
          <label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        </div>
        {!isLogin && (
          <>
            <div>
              <label>Email: <input value={email} onChange={e => setEmail(e.target.value)} required /></label>
            </div>
            <div>
              <label>Phone: <input value={phone} onChange={e => setPhone(e.target.value)} /></label>
            </div>
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{marginTop: 10}}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}

export default Auth; 
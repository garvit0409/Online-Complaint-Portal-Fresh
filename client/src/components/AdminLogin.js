import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function generateCaptcha() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (captcha !== captchaText) {
      setError('Incorrect captcha.');
      setCaptchaText(generateCaptcha());
      setCaptcha('');
      return;
    }
    setError('');

    try {
      // This is the updated line
      const res = await fetch('https://online-complaint-and-grievance-portal.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        console.log('Login successful');
        navigate('/admindashboard');
      } else {
        setError('Invalid email or password');
        setCaptchaText(generateCaptcha());
        setCaptcha('');
      }
    } catch (err) {
      setError('Server error');
      setCaptchaText(generateCaptcha());
      setCaptcha('');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={{
          display: 'inline-block',
          textAlign: 'left',
          marginTop: '20px',
          padding: '30px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              background: '#f0f0f0',
              padding: '8px',
              borderRadius: '4px',
              marginRight: '10px',
              fontSize: '20px',
              fontFamily: 'monospace'
            }}
          >
            {captchaText}
          </span>
          <input
            type="text"
            placeholder="Enter Captcha"
            value={captcha}
            required
            onChange={(e) => setCaptcha(e.target.value)}
            style={{ flex: '1', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle Standard Email Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('${SERVER_URL}:${SERVER_PORT}/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(`Error: ${errorMessage}`);
      } else {
        const data = await response.json();
        if (data) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('id', data._id);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        navigate('/posts');
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error.message);
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const token = response.credential; // Google JWT token
      const googleResponse = await fetch('${SERVER_URL}:${SERVER_PORT}/auth/google', {
        method: 'POST', // Still using GET as the server expects it
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
  
      if (googleResponse.ok) {
        const data = await googleResponse.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('id', data._id);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/posts');
      } else {
        setErrorMessage('Google login failed.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('An error occurred during Google login.');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>Or login with Google</h3>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => setErrorMessage('Google login failed')}
        />
      </div>

      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;

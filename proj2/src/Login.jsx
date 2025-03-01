import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Extract role from the URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role');
    setRole(selectedRole);  // Set role from URL
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!username || !password || !role) {
      setErrorMessage('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully logged in
        console.log('Login successful', data.token);
        localStorage.setItem('token', data.token); // Store the token in localStorage or state
        navigate(`/${role}-dashboard`); // Redirect to the corresponding dashboard
      } else {
        // Failed login
        setErrorMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error during login', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section: Welcome Message and Description */}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to the Judiciary System</h1>
        <p className="welcome-text">
          The Judiciary System Management platform is designed to streamline judicial processes, ensuring efficiency, transparency, and security for all users. Whether you're a lawyer, judge, or administrator, this system provides the tools you need to manage cases, documents, and communications effectively.
        </p>
        <p className="welcome-text">
          Please log in to access your account and continue your work.
        </p>
      </div>

      {/* Right Section: Login Form */}
      <div className="login-card">
        <h2 className="login-title">Login to Your Account</h2>
        <p className="login-subtitle">Enter your credentials to access the system</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <span className="loading-text">Logging in...</span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
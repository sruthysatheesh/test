import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger initial animations
    setAnimate(true);
    
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role');
    if (selectedRole) {
      setRole(selectedRole);
    } else {
      setErrorMessage("Invalid role. Please select a role.");
    }
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
            body: JSON.stringify({ username, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }

        const data = await response.json();

        if (data && data.token && data.userId) {
            console.log('Login successful', data);
            localStorage.setItem('token', data.token);
            
            // Add success animation before navigation
            document.querySelector('.login-container').classList.add('success-animate');
            setTimeout(() => {
                navigate(`/${role}-dashboard`);
            }, 1000);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Login error:', error.message);
        setErrorMessage(error.message);
        document.querySelector('.login-container').classList.add('error-animate');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={`login-container ${animate ? 'animate-in' : ''}`}>
      {/* Left Section: Welcome Message */}
      <div className="welcome-section">
        <h1 className="welcome-title animate-text-pop">Welcome to the Judiciary System</h1>
        <p className="welcome-text animate-text-fade">
          The Judiciary System Management platform is designed to streamline judicial processes, ensuring efficiency, transparency, and security for all users.
        </p>
        <p className="welcome-text animate-text-fade">
          Please log in to access your account and continue your work.
        </p>
      </div>

      {/* Right Section: Login Form */}
      <div className="login-card">
        <h2 className="login-title animate-text-slide-up">Login to Your Account</h2>
        <p className="login-subtitle animate-text-fade-in">Enter your credentials to access the system</p>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group animate-form-field" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-animate"
            />
          </div>
          
          <div className="form-group animate-form-field" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-animate"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`login-button ${loading ? 'button-loading' : ''}`}
          >
            {loading ? (
              <span className="loading-text">
                <span className="loading-dots">.</span>
                <span className="loading-dots">.</span>
                <span className="loading-dots">.</span>
              </span>
            ) : 'Login'}
          </button>
        </form>
        
        {errorMessage && (
          <p className="error-message animate-error">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
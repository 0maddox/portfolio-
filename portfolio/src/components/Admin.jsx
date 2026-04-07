import React, { useState, useEffect } from 'react';

function getEmailInitials(value) {
  const localPart = (value || '').split('@')[0].replace(/[^a-zA-Z]/g, '');
  if (!localPart) return 'Ad';

  const first = localPart.charAt(0).toUpperCase();
  const second = localPart.length >= 4
    ? localPart.charAt(Math.floor(localPart.length / 2)).toLowerCase()
    : localPart.charAt(1).toLowerCase();

  return `${first}${second || ''}`;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/check-session', {
        credentials: 'include'
      });
      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
      setEmail(data.email || '');
    } catch {
      setIsLoggedIn(false);
      setEmail('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginData.email, password: loginData.password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setEmail((loginData.email || '').replace(/\s+/g, ''));
        setShowLogin(false);
        setLoginData({ email: '', password: '' });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch {
      alert('Unable to reach login server. Make sure backend is running on port 5000.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setIsLoggedIn(false);
    setEmail('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    setGeneratedToken('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setForgotMessage(data.message || 'Could not start password reset');
        return;
      }

      setGeneratedToken(data.resetToken || '');
      setResetToken(data.resetToken || '');
      setForgotMessage(data.message || 'Reset token created');
    } catch {
      setForgotMessage('Unable to reach server for password reset');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setForgotMessage(data.message || 'Could not reset password');
        return;
      }

      setForgotMessage(data.message || 'Password reset successfully');
      setShowForgotPassword(false);
      setLoginData({ email: forgotEmail, password: '' });
      setForgotEmail('');
      setResetToken('');
      setNewPassword('');
      setGeneratedToken('');
    } catch {
      setForgotMessage('Unable to reach server for password reset');
    }
  };

  return (
    <div
      className={`admin-icon ${isLoggedIn ? 'logged-in' : ''}`}
      onClick={() => {
        if (!isLoggedIn) {
          setShowLogin(!showLogin);
        }
      }}
      title={isLoggedIn ? `Logged in as ${email}` : 'Admin Login'}
    >
      {isLoggedIn ? (
        <>
          <span className="admin-initials-circle">{getEmailInitials(email)}</span>
          <button
            type="button"
            className="admin-logout-pop"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <span>Admin Login</span>
      )}

      {showLogin && !isLoggedIn && (
        <form onSubmit={handleLogin} className="login-form" onClick={(e) => e.stopPropagation()}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <button type="submit" onClick={(e) => e.stopPropagation()}>Login</button>
          <button
            type="button"
            className="forgot-link"
            onClick={(e) => {
              e.stopPropagation();
              setShowForgotPassword(!showForgotPassword);
              setForgotEmail(loginData.email);
              setForgotMessage('');
            }}
          >
            Forgot password?
          </button>

          {showForgotPassword && (
            <div className="forgot-panel" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleForgotPassword} className="forgot-form">
                <input
                  type="email"
                  placeholder="Admin email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <button type="submit">Generate reset token</button>
              </form>

              {generatedToken && <p className="token-preview">Token: {generatedToken}</p>}

              <form onSubmit={handleResetPassword} className="forgot-form">
                <input
                  type="text"
                  placeholder="Reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button type="submit">Reset password</button>
              </form>

              {forgotMessage && <p className="forgot-message">{forgotMessage}</p>}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
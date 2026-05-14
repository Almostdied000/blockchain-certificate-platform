import React, { useState } from 'react';
import { Shield, KeyRound, User, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../utils/storage';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (role === 'admin' && securityCode !== '8050') {
      setError('Invalid admin security code. Please enter the correct code to access the admin portal.');
      return;
    }
    
    try {
      const user = await loginUser(normalizedEmail, normalizedPassword);
      if (user) {
        if (user.role !== role) {
          setError(`This account is registered as a ${user.role}. Please select the correct role.`);
          return;
        }
        setUser(user);
        navigate(user.role === 'admin' ? '/admin' : '/student');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-logo">
          <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Shield size={40} color="#3b82f6" />
          </div>
          <h1>
            <span className="gradient-text">Certi</span>Chain
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Secure. Immutable. Verifiable.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button" 
            onClick={() => setRole('admin')}
            className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ flex: 1 }}
          >
            <Shield size={18} /> Admin
          </button>
          <button 
            type="button" 
            onClick={() => setRole('student')}
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ flex: 1 }}
          >
            <User size={18} /> Student
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {role === 'admin' && (
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label className="input-label">Admin Security Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="Enter security code"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  required={role === 'admin'}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Access Portal <ChevronRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Create One</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

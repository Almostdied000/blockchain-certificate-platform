import React, { useState } from 'react';
import { Shield, KeyRound, User, ChevronRight, Mail, UserPlus } from 'lucide-react';
import { registerUser } from '../../utils/storage';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: '450px' }}>
        <div className="auth-logo">
          <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <UserPlus size={40} color="#3b82f6" />
          </div>
          <h1>
            <span className="gradient-text">Certi</span>Chain
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create your secure account</p>
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

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="name"
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="John Doe"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="john@example.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="confirmPassword"
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Account <ChevronRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

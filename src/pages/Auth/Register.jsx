import React, { useState } from 'react';
import { Shield, KeyRound, User, ChevronRight, Mail, UserPlus, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { registerUser } from '../../utils/storage';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your primary school?",
  "What is your oldest sibling's middle name?",
  "What was the make of your first car?",
];

const Register = () => {
  const location = useLocation();

  const getInitialRole = () => {
    const params = new URLSearchParams(location.search);
    const r = params.get('role');
    if (r === 'admin' || r === 'student') return r;
    return 'student';
  };

  const [role, setRole] = useState(getInitialRole());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
    securityCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin' && formData.securityCode !== '8050') {
      setError('Invalid admin security code. You must enter the correct code to create an admin account.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'student' && !formData.securityAnswer.trim()) {
      setError('Please provide an answer to your security question.');
      return;
    }

    try {
      await registerUser({
        name: role === 'admin' ? 'Admin' : formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        role: role,
        securityQuestion: role === 'student' ? formData.securityQuestion : undefined,
        securityAnswer: role === 'student' ? formData.securityAnswer.trim().toLowerCase() : undefined,
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
          {/* Full Name / Admin Security Code */}
          {role === 'student' ? (
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
                  value={formData.name}
                  onChange={handleChange}
                  required={role === 'student'}
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label className="input-label">Admin Security Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="securityCode"
                  className="input-field"
                  style={{ paddingLeft: '3rem' }}
                  placeholder="Enter security code"
                  value={formData.securityCode}
                  onChange={handleChange}
                  required={role === 'admin'}
                />
              </div>
            </div>
          )}

          {/* Email */}
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
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="input-field"
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group" style={{ marginBottom: role === 'student' ? '1.5rem' : '2rem' }}>
            <label className="input-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="input-field"
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Security Question — students only */}
          {role === 'student' && (
            <div
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <HelpCircle size={16} color="#3b82f6" />
                <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Password Recovery
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                Choose a security question to recover your account if you forget your password.
              </p>

              {/* Dropdown */}
              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label className="input-label">Security Question</label>
                <select
                  name="securityQuestion"
                  className="input-field"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Answer */}
              <div>
                <label className="input-label">Your Answer</label>
                <div style={{ position: 'relative' }}>
                  <HelpCircle size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="securityAnswer"
                    className="input-field"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="Your answer (case-insensitive)"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required={role === 'student'}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Account <ChevronRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to={`/login?role=${role}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

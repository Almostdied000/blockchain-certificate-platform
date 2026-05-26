import React, { useState } from 'react';
import { Shield, KeyRound, Mail, ChevronRight, Eye, EyeOff, HelpCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { getUserByEmail, resetPassword } from '../../utils/storage';
import { Link, useNavigate } from 'react-router-dom';

/**
 * ForgotPassword — 3-step password reset flow for students.
 *
 * Step 1: Enter registered email → look up account
 * Step 2: Answer the security question set at registration
 * Step 3: Set a new password
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 | 2 | 3 | 'done'
  const [email, setEmail] = useState('');
  const [userRecord, setUserRecord] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Step 1: Find account by email ─────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await getUserByEmail(email.trim().toLowerCase());
      if (!user) {
        setError('No account found with that email address.');
        setLoading(false);
        return;
      }
      if (user.role !== 'student') {
        setError('Password reset is only available for student accounts.');
        setLoading(false);
        return;
      }
      if (!user.securityQuestion || !user.securityAnswer) {
        setError('This account was created before security questions were added. Please contact your admin.');
        setLoading(false);
        return;
      }
      setUserRecord(user);
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  // ── Step 2: Verify security answer ────────────────────────────
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!securityAnswer.trim()) {
      setError('Please enter your security answer.');
      return;
    }
    if (securityAnswer.trim().toLowerCase() !== userRecord.securityAnswer.toLowerCase()) {
      setError('Incorrect answer. Please try again.');
      return;
    }
    setStep(3);
  };

  // ── Step 3: Set new password ───────────────────────────────────
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email, securityAnswer, newPassword);
    setLoading(false);
    if (result.success) {
      setStep('done');
    } else {
      setError(result.error);
    }
  };

  // ── Step indicator ─────────────────────────────────────────────
  const StepDots = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
      {[1, 2, 3].map((s) => {
        const isActive = step === s;
        const isDone = typeof step === 'number' && step > s || step === 'done';
        return (
          <div
            key={s}
            style={{
              width: isActive ? 28 : 10,
              height: 10,
              borderRadius: 999,
              background: isDone
                ? '#10b981'
                : isActive
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                : 'rgba(255,255,255,0.12)',
              transition: 'all 0.35s ease',
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: 440 }}>

        {/* Logo */}
        <div className="auth-logo">
          <div style={{ display: 'inline-flex', background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Shield size={40} color="#3b82f6" />
          </div>
          <h1>
            <span className="gradient-text">Certi</span>Chain
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.875rem' }}>
            Student Password Recovery
          </p>
        </div>

        {/* ── DONE state ── */}
        {step === 'done' && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 30px rgba(16,185,129,0.3)',
            }}>
              <CheckCircle size={36} color="#10b981" />
            </div>
            <h2 style={{ color: '#10b981', marginBottom: '0.6rem', fontSize: '1.2rem' }}>
              Password Reset!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Go to Login <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── Steps 1-3 ── */}
        {step !== 'done' && (
          <>
            <StepDots />

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem',
                fontSize: '0.875rem', textAlign: 'center',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
                {error}
              </div>
            )}

            {/* ── Step 1: Email ── */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Find Your Account</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    Enter the email address you registered with.
                  </p>
                </div>

                <div className="input-group" style={{ marginBottom: '2rem' }}>
                  <label className="input-label">Registered Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      className="input-field"
                      style={{ paddingLeft: '3rem' }}
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? 'Searching…' : <>Continue <ChevronRight size={18} /></>}
                </button>
              </form>
            )}

            {/* ── Step 2: Security Question ── */}
            {step === 2 && userRecord && (
              <form onSubmit={handleAnswerSubmit} className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Security Verification</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    Answer your security question to continue.
                  </p>
                </div>

                {/* Account found badge */}
                <div style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '10px', padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  marginBottom: '1.5rem',
                }}>
                  <CheckCircle size={16} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Account Found</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{userRecord.name} · {email}</div>
                  </div>
                </div>

                {/* Security question */}
                <div style={{
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '10px', padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                }}>
                  <HelpCircle size={16} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ color: '#93c5fd', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
                    {userRecord.securityQuestion}
                  </p>
                </div>

                <div className="input-group" style={{ marginBottom: '2rem' }}>
                  <label className="input-label">Your Answer</label>
                  <div style={{ position: 'relative' }}>
                    <HelpCircle size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '3rem' }}
                      placeholder="Type your answer…"
                      value={securityAnswer}
                      onChange={e => setSecurityAnswer(e.target.value)}
                      required
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Answer is not case-sensitive.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); setSecurityAnswer(''); }}
                    className="btn btn-secondary"
                    style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Verify <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Set New Password</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    Choose a strong password for your account.
                  </p>
                </div>

                {/* New password */}
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showNew ? 'text' : 'password'}
                      className="input-field"
                      style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2, transition: 'width 0.3s, background 0.3s',
                          width: newPassword.length < 6 ? '25%' : newPassword.length < 10 ? '60%' : '100%',
                          background: newPassword.length < 6 ? '#ef4444' : newPassword.length < 10 ? '#f59e0b' : '#10b981',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.65rem', color: newPassword.length < 6 ? '#ef4444' : newPassword.length < 10 ? '#f59e0b' : '#10b981', marginTop: '0.2rem', display: 'block' }}>
                        {newPassword.length < 6 ? 'Too short' : newPassword.length < 10 ? 'Medium strength' : 'Strong password'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="input-group" style={{ marginBottom: '2rem' }}>
                  <label className="input-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className="input-field"
                      style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.35rem' }}>Passwords don't match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.35rem' }}>✓ Passwords match</p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep(2); setError(''); }}
                    className="btn btn-secondary"
                    style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                  >
                    {loading ? 'Resetting…' : <>Reset Password <ChevronRight size={18} /></>}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Back to login link */}
        {step !== 'done' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  User,
  Book,
  Calendar,
  Award,
  Hash,
  ArrowLeft,
  Search,
  QrCode,
  Loader,
} from 'lucide-react';
import { verifyCertificate } from '../../utils/storage';

const QRVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [certId, setCertId] = useState('');
  const [inputId, setInputId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [certDetails, setCertDetails] = useState(null);

  // Auto-verify if ?id= is present in URL (from QR scan)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setCertId(id);
      setInputId(id);
      runVerification(id);
    }
  }, [location.search]);

  const runVerification = async (id) => {
    setStatus('loading');
    setCertDetails(null);
    try {
      const result = await verifyCertificate(id);
      if (result) {
        setStatus('success');
        setCertDetails(result);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    setCertId(inputId.trim());
    runVerification(inputId.trim());
  };

  const templateColors = {
    professional: '#3b82f6',
    academic: '#6366f1',
    excellence: '#d97706',
    minimal: '#0ea5e9',
  };
  const accentColor = certDetails ? templateColors[certDetails.template] || '#3b82f6' : '#3b82f6';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          top: '-100px', left: '-100px',
          animation: 'pulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          bottom: '-80px', right: '-80px',
          animation: 'pulse 8s ease-in-out infinite reverse',
        }} />
      </div>

      {/* Back to login */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: '#94a3b8', borderRadius: '10px', padding: '0.5rem 1rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.85rem', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        <ArrowLeft size={16} /> Back to Login
      </button>

      {/* Card */}
      <div
        style={{
          width: '100%', maxWidth: 520,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 30px rgba(59,130,246,0.4)',
          }}>
            <Shield size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9',
            background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            CertiChain Verify
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Instant blockchain certificate verification
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.75rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              placeholder="Enter Certificate ID or Transaction Hash…"
              style={{
                width: '100%', padding: '0.9rem 3.2rem 0.9rem 1rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px', color: '#f1f5f9',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                border: 'none', borderRadius: '8px', padding: '0.5rem 0.9rem',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                fontSize: '0.8rem', fontWeight: 600, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <Search size={14} /> Verify
            </button>
          </div>
        </form>

        {/* ── States ── */}

        {/* Idle hint */}
        {status === 'idle' && (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
          }}>
            <QrCode size={48} color="#334155" />
            <p style={{ fontSize: '0.875rem' }}>
              Scan a CertiChain QR code or enter a certificate ID above to verify authenticity.
            </p>
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div style={{
            textAlign: 'center', padding: '2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            color: '#94a3b8',
          }}>
            <Loader size={36} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.9rem' }}>Querying blockchain…</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div
            className="animate-fade-in"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '14px', padding: '1.5rem',
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
            }}
          >
            <XCircle size={28} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ color: '#ef4444', marginBottom: '0.3rem', fontSize: '1rem' }}>
                Verification Failed
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Certificate ID <code style={{ color: '#fca5a5' }}>{certId}</code> was not found
                on the blockchain. It may be invalid or tampered.
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && certDetails && (
          <div className="animate-fade-in">
            {/* Success banner */}
            <div
              style={{
                background: 'rgba(16,185,129,0.10)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: '14px', padding: '1.25rem 1.5rem',
                display: 'flex', gap: '0.85rem', alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle size={28} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.2rem' }}>
                  ✅ Certificate Verified!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Authenticity confirmed on the blockchain.
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${accentColor}22`,
                borderRadius: '14px', padding: '1.5rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem',
              }}
            >
              {[
                { icon: User,     label: 'Recipient',  value: certDetails.studentName },
                { icon: Book,     label: 'Program',    value: certDetails.courseName },
                { icon: Calendar, label: 'Issued On',  value: certDetails.issueDate },
                { icon: Award,    label: 'Grade',      value: certDetails.grade },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Icon size={16} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.15rem' }}>
                      {label}
                    </div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.875rem' }}>
                      {value || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction hash */}
            <div style={{
              marginTop: '1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', padding: '0.9rem 1rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <Hash size={13} color="#64748b" />
                <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Blockchain Transaction Hash
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', color: accentColor }}>
                {certDetails.txnHash}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ color: '#334155', fontSize: '0.75rem', marginTop: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        Powered by <strong style={{ color: '#475569' }}>CertiChain</strong> · Blockchain Certificate Authority
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-fade-in { animation: fadeIn 0.35s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default QRVerify;

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
  Loader,
  Download,
  Share2,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { verifyCertificate } from '../../utils/storage';

/**
 * CertificatePreview — Renders a high-fidelity CSS replica of the certificate templates.
 */
const CertificatePreview = ({ cert }) => {
  const themes = {
    professional: {
      color: '#3b82f6',
      bg: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: '12px solid #1e293b',
      innerBorder: '2px solid #e2e8f0',
      title: 'Certificate of Achievement',
      subtitle: 'This is to officially recognize that',
      tagline: 'for the successful completion of the program',
      font: 'sans-serif'
    },
    academic: {
      color: '#6366f1',
      bg: '#fffdf9',
      text: '#1e293b',
      muted: '#64748b',
      border: '12px double #1e293b',
      innerBorder: 'none',
      title: 'Diploma of Completion',
      subtitle: 'This is to officially recognize that',
      tagline: 'for the successful completion of the program',
      font: 'serif'
    },
    excellence: {
      color: '#d97706',
      bg: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: '14px solid #d97706',
      innerBorder: 'none',
      title: 'Certificate of Excellence',
      subtitle: 'This is to officially recognize that',
      tagline: 'for the successful completion of the program',
      font: 'serif'
    },
    minimal: {
      color: '#0ea5e9',
      bg: '#0f172a',
      text: '#ffffff',
      muted: '#94a3b8',
      border: 'none',
      innerBorder: 'none',
      title: 'Certificate of Mastery',
      subtitle: 'This digital asset confirms that',
      tagline: 'Successfully achieved mastery in',
      font: 'sans-serif'
    }
  };

  const currentTheme = themes[cert.template] || themes.professional;

  return (
    <div 
      style={{
        width: '100%',
        aspectRatio: '1.414',
        background: currentTheme.bg,
        borderRadius: '12px',
        padding: cert.template === 'minimal' ? '0' : '2rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        border: cert.template === 'minimal' ? 'none' : currentTheme.border,
        boxSizing: 'border-box',
      }}
    >
      {cert.template === 'minimal' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '24px',
          background: currentTheme.color
        }} />
      )}
      
      <div 
        style={{
          border: currentTheme.innerBorder,
          width: '100%',
          height: '100%',
          padding: cert.template === 'minimal' ? '3rem 4rem' : '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: cert.template === 'minimal' ? 'flex-start' : 'center',
          justifyContent: 'center',
          textAlign: cert.template === 'minimal' ? 'left' : 'center',
          boxSizing: 'border-box',
        }}
      >
        {cert.template !== 'minimal' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: currentTheme.color }}>
            <Award size={36} />
          </div>
        )}

        <h2 style={{
          color: currentTheme.color,
          fontFamily: cert.template === 'academic' || cert.template === 'excellence' ? "'Playfair Display', Georgia, serif" : "var(--font-heading)",
          fontSize: cert.template === 'minimal' ? 'clamp(1rem, 3.5vw, 1.8rem)' : 'clamp(0.9rem, 2.5vw, 1.3rem)',
          fontWeight: 800,
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginTop: 0,
        }}>
          {currentTheme.title}
        </h2>
        
        <p style={{ 
          color: currentTheme.muted, 
          fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
          marginBottom: '0.75rem',
          fontWeight: 500,
          marginTop: 0,
        }}>
          {currentTheme.subtitle}
        </p>
        
        <h1 style={{
          color: currentTheme.text,
          fontFamily: cert.template === 'academic' || cert.template === 'excellence' ? "'Playfair Display', Georgia, serif" : "var(--font-heading)",
          fontSize: cert.template === 'minimal' ? 'clamp(1.5rem, 5vw, 2.6rem)' : 'clamp(1.3rem, 4vw, 2.1rem)',
          fontWeight: 700,
          borderBottom: cert.template === 'minimal' ? 'none' : `1px solid ${currentTheme.color}55`,
          paddingBottom: '0.25rem',
          minWidth: cert.template === 'minimal' ? 'auto' : '220px',
          marginBottom: '1rem',
          display: 'inline-block',
          marginTop: 0,
        }}>
          {cert.studentName}
        </h1>
        
        <p style={{ 
          color: currentTheme.muted, 
          fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
          marginBottom: '0.5rem',
          marginTop: 0,
        }}>
          {currentTheme.tagline}
        </p>
        
        <h3 style={{ 
          color: cert.template === 'minimal' ? currentTheme.color : currentTheme.text, 
          fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)', 
          marginBottom: '1.5rem', 
          fontWeight: 700,
          marginTop: 0,
        }}>
          {cert.course}
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          marginTop: 'auto', 
          alignItems: 'flex-end' 
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.55rem', color: currentTheme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Issue</div>
            <div style={{ color: currentTheme.text, fontSize: '0.7rem', fontWeight: 600 }}>{cert.date}</div>
          </div>

          {/* Signature and Seal */}
          {cert.template !== 'minimal' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentTheme.color,
                marginBottom: '4px',
                zIndex: 1,
                transform: 'translateY(2px)'
              }}>
                <CheckCircle size={24} />
              </div>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                border: `1px solid ${currentTheme.color}44`,
                background: `${currentTheme.color}0a`,
                position: 'absolute',
                top: '-4px',
                zIndex: 0,
                opacity: 0.5
              }} />
              <div style={{ fontSize: '0.5rem', color: currentTheme.muted, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Authorized Seal
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ 
                color: currentTheme.color,
                marginBottom: '4px'
              }}>
                <CheckCircle size={24} />
              </div>
              <div style={{ fontSize: '0.55rem', color: currentTheme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Signature</div>
            </div>
          )}

          <div style={{ textAlign: cert.template === 'minimal' ? 'left' : 'right' }}>
            <div style={{ fontSize: '0.55rem', color: currentTheme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade Achieved</div>
            <div style={{ color: currentTheme.text, fontSize: '0.7rem', fontWeight: 600 }}>{cert.grade}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QRVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [certId, setCertId] = useState('');
  const [inputId, setInputId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [certDetails, setCertDetails] = useState(null);
  const [shared, setShared] = useState(false);

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

  const resetVerification = () => {
    setStatus('idle');
    setCertDetails(null);
    setInputId('');
    setCertId('');
    navigate('/verify', { replace: true });
  };

  const handleShare = async () => {
    const verificationUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Verified Certificate',
          text: `Check out this blockchain-verified certificate for ${certDetails.studentName}!`,
          url: verificationUrl,
        });
      } else {
        throw new Error('Not supported');
      }
    } catch {
      navigator.clipboard.writeText(verificationUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!certDetails) return;
    const cert = {
      id: certDetails.id || certDetails.certId,
      course: certDetails.courseName,
      studentName: certDetails.studentName,
      date: certDetails.issueDate,
      grade: certDetails.grade,
      template: certDetails.template || 'professional'
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 850;

    const themes = {
      professional: { primary: '#3b82f6', secondary: '#1e40af', bg: '#ffffff', border: '#1e293b', font: 'sans-serif' },
      academic: { primary: '#1e293b', secondary: '#0f172a', bg: '#fffdf9', border: '#1e293b', font: 'serif' },
      excellence: { primary: '#d97706', secondary: '#92400e', bg: '#ffffff', border: '#d97706', font: 'serif' },
      minimal: { primary: '#0ea5e9', secondary: '#0369a1', bg: '#0f172a', border: '#334155', font: 'sans-serif' }
    };
    const theme = themes[cert.template] || themes.professional;

    // 1. Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Borders
    if (cert.template === 'academic') {
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 15;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
    } else if (cert.template === 'excellence') {
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 30;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
    } else if (cert.template === 'minimal') {
      ctx.fillStyle = theme.primary;
      ctx.fillRect(0, 0, 80, canvas.height);
    } else {
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 4;
      ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);
    }

    // 3. Content Layout
    if (cert.template === 'minimal') {
      ctx.textAlign = 'left';
      const startX = 150;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('CertiChain Verified', startX, 100);

      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText('CERTIFICATE', startX, 220);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('This digital asset confirms that', startX, 300);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 70px sans-serif';
      ctx.fillText(cert.studentName.toUpperCase(), startX, 400);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText(`Successfully achieved mastery in ${cert.course}`, startX, 480);

      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(`GRADE: ${cert.grade}`, startX, 550);

      ctx.fillStyle = '#475569';
      ctx.font = '14px monospace';
      ctx.fillText(`TXN: ${cert.id}`, startX, 780);
      ctx.fillText(`DATE: ${cert.date}`, startX, 810);
    } else {
      ctx.textAlign = 'center';

      ctx.fillStyle = theme.primary;
      ctx.font = `bold ${cert.template === 'excellence' ? '70px' : '60px'} ${theme.font}`;
      const title = cert.template === 'academic' ? 'DIPLOMA OF COMPLETION' :
        cert.template === 'excellence' ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF ACHIEVEMENT';
      ctx.fillText(title, canvas.width / 2, 180);

      ctx.fillStyle = '#64748b';
      ctx.font = `24px ${theme.font}`;
      ctx.fillText('This is to officially recognize that', canvas.width / 2, 260);

      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 85px ${theme.font}`;
      ctx.fillText(cert.studentName.toUpperCase(), canvas.width / 2, 360);

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 350, 385);
      ctx.lineTo(canvas.width / 2 + 350, 385);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = `24px ${theme.font}`;
      ctx.fillText('for the successful completion of the program', canvas.width / 2, 460);

      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 50px ${theme.font}`;
      ctx.fillText(cert.course.toUpperCase(), canvas.width / 2, 530);

      ctx.fillStyle = '#475569';
      ctx.font = `italic 22px ${theme.font}`;
      ctx.fillText(`Issued on ${cert.date} • Final Grade: ${cert.grade}`, canvas.width / 2, 600);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(`VERIFIED BLOCKCHAIN ID: ${cert.id}`, canvas.width / 2, 790);
    }

    // 4. Seal/Signature Section
    if (cert.template !== 'minimal') {
      ctx.save();
      ctx.translate(canvas.width / 2, 700);

      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fillStyle = `${theme.primary}15`;
      ctx.fill();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('CertiChain', 0, -12);
      ctx.font = '7px sans-serif';
      ctx.fillText('VERIFIED', 0, 24);

      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('✓', 0, 8);
      ctx.restore();
    } else {
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('✓ VERIFIED', canvas.width - 100, 750);
      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.fillText('Authorized Signature', canvas.width - 100, 770);
    }

    const link = document.createElement('a');
    link.download = `${cert.course.replace(/\s+/g, '_')}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ── 1. SUCCESS RENDER: Direct full-screen Certificate ──
  if (status === 'success' && certDetails) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Animated background blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            top: '-100px', left: '-100px',
            animation: 'pulse 6s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 450, height: 450, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            bottom: '-100px', right: '-100px',
            animation: 'pulse 8s ease-in-out infinite reverse',
          }} />
        </div>

        {/* Back to login */}
        <button
          onClick={() => navigate('/login')}
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', borderRadius: '10px', padding: '0.5rem 1rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.85rem', transition: 'all 0.2s', zIndex: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        {/* Certificate Display container */}
        <div 
          className="animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '820px',
            position: 'relative',
            zIndex: 2,
            boxSizing: 'border-box'
          }}
        >
          <CertificatePreview cert={{
            id: certDetails.id || certDetails.certId,
            course: certDetails.courseName,
            studentName: certDetails.studentName,
            date: certDetails.issueDate,
            grade: certDetails.grade,
            template: certDetails.template || 'professional'
          }} />
        </div>

        {/* Action Controls & Verification Info beneath Certificate */}
        <div 
          className="animate-fade-in"
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
            position: 'relative',
            zIndex: 2,
            width: '100%'
          }}
        >
          {/* Action Buttons Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem', minWidth: '180px' }}
            >
              <Download size={16} /> Download PNG
            </button>
            
            <button
              onClick={handleShare}
              className="btn btn-secondary"
              style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', minWidth: '130px' }}
            >
              <Share2 size={16} /> {shared ? 'Link Copied!' : 'Share Link'}
            </button>

            <button
              onClick={resetVerification}
              className="btn btn-secondary"
              style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', minWidth: '160px' }}
            >
              <RefreshCw size={16} /> Verify Another
            </button>
          </div>

          {/* Verification Badge & Technical Details */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Cryptographically Verified on CertiChain
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
              <span>ID: {certDetails.id}</span>
              <span>•</span>
              <span style={{ wordBreak: 'break-all', textAlign: 'center' }}>TX: {certDetails.txnHash}</span>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cookie&family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  // ── 2. SEARCH / LOADING / ERROR RENDER: Standard Verification Card ──
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
        boxSizing: 'border-box'
      }}
    >
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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
          fontSize: '0.85rem', transition: 'all 0.2s', zIndex: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        <ArrowLeft size={16} /> Back to Login
      </button>

      {/* Card */}
      <div
        style={{
          width: '100%', 
          maxWidth: 520,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 1,
          boxSizing: 'border-box'
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

        {/* Idle hint */}
        {status === 'idle' && (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
          }}>
            <Shield size={48} color="#334155" />
            <p style={{ fontSize: '0.875rem' }}>
              Enter a certificate ID or Transaction Hash above to verify its authenticity.
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
              <button 
                onClick={resetVerification}
                className="btn btn-secondary" 
                style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ color: '#334155', fontSize: '0.75rem', marginTop: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        Powered by <strong style={{ color: '#475569' }}>CertiChain</strong> · Blockchain Certificate Authority
      </p>

      {/* Styles */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default QRVerify;

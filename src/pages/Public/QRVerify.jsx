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
/**
 * PremiumBadge — Renders a custom gold foil seal with hanging ribbons or holographic secure chip.
 */
const PremiumBadge = ({ template }) => {
  const isMinimal = template === 'minimal';
  const isAcademic = template === 'academic';
  const isExcellence = template === 'excellence';

  const ribbonColorL = isAcademic ? 'linear-gradient(135deg, #b91c1c, #7f1d1d)' : 'linear-gradient(135deg, #f59e0b, #b45309)';
  const ribbonColorR = isAcademic ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #fbbf24, #d97706)';

  if (isMinimal) {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '54px',
          height: '54px',
          background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
          border: '2px dashed #38bdf8',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px' }} />
          <CheckCircle size={22} color="#38bdf8" />
        </div>
        <span style={{ fontSize: '0.5rem', color: '#38bdf8', marginTop: '6px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          VERIFIED CHIP
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', height: '75px' }}>
      {/* Hanging Ribbons */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '20px',
        width: '16px',
        height: '42px',
        background: ribbonColorL,
        transform: 'rotate(-10deg)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
        zIndex: 1,
        boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
      }} />
      <div style={{
        position: 'absolute',
        top: '25px',
        right: '20px',
        width: '16px',
        height: '42px',
        background: ribbonColorR,
        transform: 'rotate(10deg)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
        zIndex: 1,
        boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
      }} />

      {/* Starburst Foil Badge */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: isExcellence 
          ? 'radial-gradient(circle, #fff3b0 0%, #d4af37 60%, #aa7c11 100%)'
          : isAcademic
          ? 'radial-gradient(circle, #fffae6 0%, #e5c158 60%, #b89127 100%)'
          : 'radial-gradient(circle, #60a5fa 0%, #1e3a8a 80%, #0f172a 100%)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 2,
        outline: isExcellence || isAcademic ? '2px solid #d4af37' : '2px solid #1e3a8a',
        outlineOffset: '-4px'
      }}>
        {/* Inner dashed detail */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.7)',
          zIndex: 2
        }} />
        <CheckCircle size={22} color="#ffffff" style={{ zIndex: 3 }} />
      </div>
      <span style={{ 
        fontSize: '0.45rem', 
        color: isExcellence ? '#d4af37' : isAcademic ? '#84623e' : '#4b5563', 
        marginTop: '6px', 
        fontWeight: 800, 
        letterSpacing: '1px', 
        textTransform: 'uppercase',
        zIndex: 3
      }}>
        VERIFIED SEAL
      </span>
    </div>
  );
};

const CertificatePreview = ({ cert }) => {
  const getTemplateStyles = () => {
    switch (cert.template) {
      case 'academic':
        return {
          bg: '#faf6f0',
          textColor: '#2c2520',
          titleColor: '#84623e',
          subtitleColor: '#6e6259',
          fontFamily: "'Playfair Display', Georgia, serif",
          border: '10px double #84623e',
          innerBorder: '2px solid rgba(132, 98, 62, 0.2)',
          watermark: 'rgba(132, 98, 62, 0.03)'
        };
      case 'excellence':
        return {
          bg: 'linear-gradient(135deg, #090a0f 0%, #171923 100%)',
          textColor: '#f1f5f9',
          titleColor: '#d4af37',
          subtitleColor: '#94a3b8',
          fontFamily: "'Cinzel', serif",
          border: '12px solid #d4af37',
          innerBorder: '1px solid rgba(212, 175, 55, 0.3)',
          watermark: 'rgba(212, 175, 55, 0.02)'
        };
      case 'minimal':
        return {
          bg: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
          textColor: '#f1f5f9',
          titleColor: '#38bdf8',
          subtitleColor: '#94a3b8',
          fontFamily: "'Montserrat', sans-serif",
          border: '1px solid rgba(56, 189, 248, 0.2)',
          innerBorder: 'none',
          watermark: 'rgba(56, 189, 248, 0.03)'
        };
      case 'professional':
      default:
        return {
          bg: '#ffffff',
          textColor: '#0f172a',
          titleColor: '#1e3a8a',
          subtitleColor: '#4b5563',
          fontFamily: "'Montserrat', sans-serif",
          border: '16px solid #0f172a',
          innerBorder: '1px solid #d4af37',
          watermark: 'rgba(30, 58, 138, 0.02)'
        };
    }
  };

  const style = getTemplateStyles();

  const renderDecorations = () => {
    if (cert.template === 'academic') {
      return (
        <>
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', width: '30px', height: '30px', borderTop: '4px solid #84623e', borderLeft: '4px solid #84623e' }} />
          <div style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', borderTop: '4px solid #84623e', borderRight: '4px solid #84623e' }} />
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '30px', height: '30px', borderBottom: '4px solid #84623e', borderLeft: '4px solid #84623e' }} />
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '30px', height: '30px', borderBottom: '4px solid #84623e', borderRight: '4px solid #84623e' }} />
          {/* Watermark Crest */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '320px', height: '320px', pointerEvents: 'none', opacity: 0.08, zIndex: 0,
            border: '8px double #84623e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Award size={180} color="#84623e" />
          </div>
        </>
      );
    }
    if (cert.template === 'excellence') {
      return (
        <>
          {/* Glowing Radial Watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '500px', height: '500px', pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)'
          }} />
          {/* Gold Corners */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #d4af37', borderLeft: '2px solid #d4af37' }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #d4af37', borderRight: '2px solid #d4af37' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #d4af37', borderLeft: '2px solid #d4af37' }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #d4af37', borderRight: '2px solid #d4af37' }} />
        </>
      );
    }
    if (cert.template === 'minimal') {
      return (
        <>
          {/* Tech Grid Pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05, zIndex: 0,
            backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          {/* Glowing Tech blobs */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
          }} />
        </>
      );
    }
    return (
      <>
        {/* Subtle geometric lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02, zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, #1e3a8a, #1e3a8a 10px, transparent 10px, transparent 20px)'
        }} />
        {/* Thin Gold Inner Border */}
        <div style={{
          position: 'absolute', inset: '8px', border: '1px solid #d4af37', pointerEvents: 'none'
        }} />
      </>
    );
  };

  return (
    <div 
      style={{
        width: '100%',
        aspectRatio: '1.414',
        background: style.bg,
        borderRadius: '8px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        border: style.border,
        boxSizing: 'border-box',
        color: style.textColor,
        fontFamily: style.fontFamily
      }}
    >
      {renderDecorations()}

      <div 
        style={{
          border: style.innerBorder,
          width: '100%',
          height: '100%',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: cert.template === 'minimal' ? 'flex-start' : 'center',
          justifyContent: 'center',
          textAlign: cert.template === 'minimal' ? 'left' : 'center',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1
        }}
      >
        {cert.template !== 'minimal' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: style.titleColor }}>
            <Award size={48} />
          </div>
        )}

        <h2 style={{
          color: style.titleColor,
          fontSize: cert.template === 'excellence' ? 'clamp(1.1rem, 3.2vw, 1.8rem)' : 'clamp(0.9rem, 2.5vw, 1.4rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginTop: 0,
        }}>
          {cert.template === 'academic' ? 'Diploma of Completion' :
           cert.template === 'excellence' ? 'Certificate of Excellence' : 
           cert.template === 'minimal' ? 'CERTIFICATE OF MASTERY' : 'Certificate of Achievement'}
        </h2>
        
        <p style={{ 
          color: style.subtitleColor, 
          fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)', 
          marginBottom: '1rem',
          fontWeight: 500,
          marginTop: 0,
          letterSpacing: '1px'
        }}>
          {cert.template === 'minimal' ? 'This digital credential confirms that' : 'This is to officially recognize that'}
        </p>
        
        <h1 style={{
          color: cert.template === 'minimal' ? '#ffffff' : style.textColor,
          fontFamily: cert.template === 'academic' || cert.template === 'excellence' ? "'Cinzel', serif" : style.fontFamily,
          fontSize: cert.template === 'minimal' ? 'clamp(1.5rem, 4.5vw, 2.4rem)' : 'clamp(1.5rem, 4.2vw, 2.2rem)',
          fontWeight: 700,
          borderBottom: cert.template === 'minimal' ? 'none' : `2px solid ${style.titleColor}33`,
          paddingBottom: '0.5rem',
          minWidth: cert.template === 'minimal' ? 'auto' : '280px',
          marginBottom: '1rem',
          display: 'inline-block',
          marginTop: 0,
          letterSpacing: '1px'
        }}>
          {cert.studentName}
        </h1>
        
        <p style={{ 
          color: style.subtitleColor, 
          fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)', 
          marginBottom: '0.75rem',
          marginTop: 0,
        }}>
          {cert.template === 'minimal' ? 'Successfully completed and mastered the curriculum of' : 'for the successful completion of the program'}
        </p>
        
        <h3 style={{ 
          color: cert.template === 'minimal' ? style.titleColor : style.textColor, 
          fontSize: 'clamp(0.9rem, 2.8vw, 1.4rem)', 
          marginBottom: '2rem', 
          fontWeight: 700,
          marginTop: 0,
          letterSpacing: '0.5px'
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
            <div style={{ fontSize: '0.55rem', color: style.subtitleColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Date of Issue</div>
            <div style={{ color: style.textColor, fontSize: '0.75rem', fontWeight: 600 }}>{cert.date}</div>
          </div>

          {/* Secure Verification Stamp / Premium Badge */}
          <PremiumBadge template={cert.template} />

          <div style={{ textAlign: cert.template === 'minimal' ? 'left' : 'right' }}>
            <div style={{ fontSize: '0.55rem', color: style.subtitleColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Grade Achieved</div>
            <div style={{ color: style.textColor, fontSize: '0.75rem', fontWeight: 600 }}>{cert.grade}</div>
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

    // Premium Themes Configuration for Canvas
    const themes = {
      professional: {
        primary: '#1e3a8a',
        secondary: '#3b82f6',
        bg: '#ffffff',
        border: '#0f172a',
        gold: '#d4af37',
        text: '#0f172a',
        muted: '#4b5563',
        font: 'Montserrat, Arial, sans-serif'
      },
      academic: {
        primary: '#84623e',
        secondary: '#aa7c11',
        bg: '#faf6f0',
        border: '#84623e',
        gold: '#aa7c11',
        text: '#2c2520',
        muted: '#6e6259',
        font: 'Georgia, serif'
      },
      excellence: {
        primary: '#d4af37',
        secondary: '#aa7c11',
        bg: '#090a0f',
        border: '#d4af37',
        gold: '#d4af37',
        text: '#f1f5f9',
        muted: '#94a3b8',
        font: 'Georgia, serif'
      },
      minimal: {
        primary: '#38bdf8',
        secondary: '#818cf8',
        bg: '#020617',
        border: '#0f172a',
        gold: '#38bdf8',
        text: '#f1f5f9',
        muted: '#94a3b8',
        font: 'Montserrat, Arial, sans-serif'
      }
    };

    const theme = themes[cert.template] || themes.professional;

    // 1. Background
    if (cert.template === 'excellence') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#090a0f');
      grad.addColorStop(1, '#171923');
      ctx.fillStyle = grad;
    } else if (cert.template === 'minimal') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = theme.bg;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Watermarks / Background Patterns
    if (cert.template === 'academic') {
      // Draw Crest Watermark
      ctx.strokeStyle = 'rgba(132, 98, 62, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 160, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 140, 0, Math.PI * 2);
      ctx.stroke();
    } else if (cert.template === 'excellence') {
      // Draw Glowing Radial lines
      ctx.fillStyle = 'rgba(212, 175, 55, 0.02)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 300, 0, Math.PI * 2);
      ctx.fill();
    } else if (cert.template === 'minimal') {
      // Draw technical grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    } else {
      // Professional geometric background lines
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.02)';
      ctx.lineWidth = 10;
      for (let i = 0; i < canvas.width + canvas.height; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - canvas.height, canvas.height);
        ctx.stroke();
      }
    }

    // 3. Borders & Corner Decorations
    if (cert.template === 'academic') {
      // Dual frame
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = 'rgba(132, 98, 62, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Decorative corner brackets
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.primary;
      // Top Left
      ctx.beginPath(); ctx.moveTo(65, 95); ctx.lineTo(65, 65); ctx.lineTo(95, 65); ctx.stroke();
      // Top Right
      ctx.beginPath(); ctx.moveTo(canvas.width - 65, 95); ctx.lineTo(canvas.width - 65, 65); ctx.lineTo(canvas.width - 95, 65); ctx.stroke();
      // Bottom Left
      ctx.beginPath(); ctx.moveTo(65, canvas.height - 95); ctx.lineTo(65, canvas.height - 65); ctx.lineTo(95, canvas.height - 65); ctx.stroke();
      // Bottom Right
      ctx.beginPath(); ctx.moveTo(canvas.width - 65, canvas.height - 95); ctx.lineTo(canvas.width - 65, canvas.height - 65); ctx.lineTo(canvas.width - 95, canvas.height - 65); ctx.stroke();

    } else if (cert.template === 'excellence') {
      // Golden border frame (using gradient)
      const borderGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      borderGrad.addColorStop(0, '#f3e5ab');
      borderGrad.addColorStop(0.5, '#d4af37');
      borderGrad.addColorStop(1, '#aa7c11');
      
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 16;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

      // Gold corners
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      // Top Left
      ctx.strokeRect(55, 55, 20, 20);
      // Top Right
      ctx.strokeRect(canvas.width - 75, 55, 20, 20);
      // Bottom Left
      ctx.strokeRect(55, canvas.height - 75, 20, 20);
      // Bottom Right
      ctx.strokeRect(canvas.width - 75, canvas.height - 75, 20, 20);

    } else if (cert.template === 'minimal') {
      // Thin glowing border
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      // Modern side accents
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 0, 10, canvas.height);
    } else {
      // Professional solid thick border with gold thin inner border
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 20;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = theme.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    }

    // 4. Content Text
    ctx.textAlign = cert.template === 'minimal' ? 'left' : 'center';
    const alignX = cert.template === 'minimal' ? 120 : canvas.width / 2;

    // Header Title
    ctx.fillStyle = theme.primary;
    const title = cert.template === 'academic' ? 'DIPLOMA OF COMPLETION' :
                  cert.template === 'excellence' ? 'CERTIFICATE OF EXCELLENCE' : 
                  cert.template === 'minimal' ? 'CERTIFICATE OF MASTERY' : 'CERTIFICATE OF ACHIEVEMENT';
    ctx.font = `bold ${cert.template === 'excellence' ? '54px' : '48px'} ${theme.font}`;
    ctx.fillText(title, alignX, 190);

    // Subtitle
    ctx.fillStyle = theme.muted;
    ctx.font = `500 20px ${theme.font}`;
    const subtitle = cert.template === 'minimal' ? 'This digital credential confirms that' : 'This is to officially recognize that';
    ctx.fillText(subtitle, alignX, 260);

    // Student Name
    ctx.fillStyle = cert.template === 'minimal' ? '#ffffff' : theme.text;
    ctx.font = `bold 72px ${theme.font}`;
    ctx.fillText(cert.studentName.toUpperCase(), alignX, 360);

    // Separator line
    if (cert.template !== 'minimal') {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 300, 395);
      ctx.lineTo(canvas.width / 2 + 300, 395);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Tagline
    ctx.fillStyle = theme.muted;
    ctx.font = `20px ${theme.font}`;
    const tagline = cert.template === 'minimal' ? 'Successfully completed and mastered the curriculum of' : 'for the successful completion of the program';
    ctx.fillText(tagline, alignX, 450);

    // Course Name
    ctx.fillStyle = cert.template === 'minimal' ? theme.primary : theme.text;
    ctx.font = `bold 44px ${theme.font}`;
    ctx.fillText(cert.course.toUpperCase(), alignX, 520);

    // 5. Seal & Signature Section (Bottom)
    const sealX = canvas.width / 2;
    const sealY = 675;

    ctx.save();
    ctx.translate(sealX, sealY);

    if (cert.template !== 'minimal') {
      const isAcademic = cert.template === 'academic';
      const ribbonColorL = isAcademic ? ['#b91c1c', '#7f1d1d'] : ['#f59e0b', '#b45309'];
      const ribbonColorR = isAcademic ? ['#dc2626', '#991b1b'] : ['#fbbf24', '#d97706'];

      // Left Ribbon
      ctx.save();
      ctx.rotate(-10 * Math.PI / 180);
      const gradRibbonL = ctx.createLinearGradient(-12, 0, 12, 50);
      gradRibbonL.addColorStop(0, ribbonColorL[0]);
      gradRibbonL.addColorStop(1, ribbonColorL[1]);
      ctx.fillStyle = gradRibbonL;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(10, 15);
      ctx.lineTo(10, 60);
      ctx.lineTo(0, 50);
      ctx.lineTo(-10, 60);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right Ribbon
      ctx.save();
      ctx.rotate(10 * Math.PI / 180);
      const gradRibbonR = ctx.createLinearGradient(-12, 0, 12, 50);
      gradRibbonR.addColorStop(0, ribbonColorR[0]);
      gradRibbonR.addColorStop(1, ribbonColorR[1]);
      ctx.fillStyle = gradRibbonR;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(10, 15);
      ctx.lineTo(10, 60);
      ctx.lineTo(0, 50);
      ctx.lineTo(-10, 60);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Starburst Spikes (24-point star for foil seal look)
      const spikes = 24;
      const outerRadius = 32;
      const innerRadius = 26;
      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;

      let sealGrad;
      if (cert.template === 'excellence') {
        sealGrad = ctx.createLinearGradient(-30, -30, 30, 30);
        sealGrad.addColorStop(0, '#fff3b0');
        sealGrad.addColorStop(0.5, '#d4af37');
        sealGrad.addColorStop(1, '#aa7c11');
      } else if (cert.template === 'academic') {
        sealGrad = ctx.createLinearGradient(-30, -30, 30, 30);
        sealGrad.addColorStop(0, '#fffae6');
        sealGrad.addColorStop(0.5, '#e5c158');
        sealGrad.addColorStop(1, '#b89127');
      } else {
        sealGrad = ctx.createLinearGradient(-30, -30, 30, 30);
        sealGrad.addColorStop(0, '#3b82f6');
        sealGrad.addColorStop(0.5, '#1e3a8a');
        sealGrad.addColorStop(1, '#0f172a');
      }

      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerRadius;
        let y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();

      // Inner dashed circle details
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Checkmark symbol inside
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✓', 0, 7);

    } else {
      // Minimal Holographic secure chip
      const sealGrad = ctx.createLinearGradient(-25, -25, 25, 25);
      sealGrad.addColorStop(0, '#090d16');
      sealGrad.addColorStop(1, '#1e293b');
      
      ctx.fillStyle = sealGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-25, -25, 50, 50, 8);
      } else {
        ctx.rect(-25, -25, 50, 50);
      }
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-18, -18, 36, 36);

      // Checkmark inside chip
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('✓', 0, 7);
    }

    ctx.restore();

    // Seal text
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.muted;
    ctx.font = `bold 12px ${theme.font}`;
    ctx.fillText(cert.template === 'minimal' ? 'VERIFIED CHIP' : 'VERIFIED SEAL', sealX, sealY + 48);

    // Left info (Date of Issue)
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.muted;
    ctx.font = `bold 12px ${theme.font}`;
    ctx.fillText('DATE OF ISSUE', 120, sealY + 20);
    ctx.fillStyle = cert.template === 'minimal' ? '#ffffff' : theme.text;
    ctx.font = `bold 18px ${theme.font}`;
    ctx.fillText(cert.date, 120, sealY + 45);

    // Right info (Grade Achieved)
    ctx.textAlign = 'right';
    ctx.fillStyle = theme.muted;
    ctx.font = `bold 12px ${theme.font}`;
    ctx.fillText('GRADE ACHIEVED', canvas.width - 120, sealY + 20);
    ctx.fillStyle = cert.template === 'minimal' ? '#ffffff' : theme.text;
    ctx.font = `bold 18px ${theme.font}`;
    ctx.fillText(cert.grade, canvas.width - 120, sealY + 45);

    // Blockchain Verification ID (Center Bottom Footer)
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.muted;
    ctx.font = '12px monospace';
    ctx.fillText(`VERIFIED BLOCKCHAIN ID: ${cert.id}`, canvas.width / 2, 795);

    // Trigger PNG Download
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

import React, { useState, useEffect } from 'react';
import { Download, Share2, Award, Lock, ShieldAlert, CheckCircle, QrCode, X } from 'lucide-react';
import { getCertificates, getCurrentUser } from '../../utils/storage';
import QRCodeDisplay from '../../components/QRCodeDisplay';

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [activeQR, setActiveQR] = useState(null); // certId whose QR panel is open

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      const allCerts = await getCertificates();
      // Filter certificates for this student
      const studentCerts = allCerts.filter(c => 
        c.studentName?.toLowerCase() === user?.name?.toLowerCase() || 
        c.studentEmail === user?.email
      );
      setCertificates(studentCerts);
    };
    fetchData();
  }, []);

  const allCertificates = certificates.map(c => ({
    id: c.id,
    course: c.courseName,
    studentName: c.studentName,
    date: c.issueDate,
    issuer: 'Blockchain University',
    grade: c.grade,
    template: c.template,
    status: c.status || 'verified'
  }));

  const getCertificateCanvas = (cert) => {
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

    // 2. Borders (Unique for each)
    if (cert.template === 'academic') {
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 15;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
    } else if (cert.template === 'excellence') {
      // Gold Ornamental Border
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 30;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
    } else if (cert.template === 'minimal') {
      // Sleek side bar instead of full border
      ctx.fillStyle = theme.primary;
      ctx.fillRect(0, 0, 80, canvas.height);
    } else {
      // Standard Pro Border
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 4;
      ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);
    }

    // 3. Content Layout (Different for Minimal)
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
      // Centered Layouts (Pro, Academic, Excellence)
      ctx.textAlign = 'center';

      // Title
      ctx.fillStyle = theme.primary;
      ctx.font = `bold ${cert.template === 'excellence' ? '70px' : '60px'} ${theme.font}`;
      const title = cert.template === 'academic' ? 'DIPLOMA OF COMPLETION' :
        cert.template === 'excellence' ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF ACHIEVEMENT';
      ctx.fillText(title, canvas.width / 2, 180);

      // Body Text
      ctx.fillStyle = '#64748b';
      ctx.font = `24px ${theme.font}`;
      ctx.fillText('This is to officially recognize that', canvas.width / 2, 260);

      // Student Name
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 85px ${theme.font}`;
      ctx.fillText(cert.studentName.toUpperCase(), canvas.width / 2, 360);

      // Underline
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 350, 385);
      ctx.lineTo(canvas.width / 2 + 350, 385);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Program
      ctx.fillStyle = '#64748b';
      ctx.font = `24px ${theme.font}`;
      ctx.fillText('for the successful completion of the program', canvas.width / 2, 460);

      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 50px ${theme.font}`;
      ctx.fillText(cert.course.toUpperCase(), canvas.width / 2, 530);

      // Date & Grade
      ctx.fillStyle = '#475569';
      ctx.font = `italic 22px ${theme.font}`;
      ctx.fillText(`Issued on ${cert.date} • Final Grade: ${cert.grade}`, canvas.width / 2, 600);

      // ID
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(`VERIFIED BLOCKCHAIN ID: ${cert.id}`, canvas.width / 2, 790);
    }

    // 4. Seal/Signature Section (Common but theme-aware)
    if (cert.template !== 'minimal') {
      ctx.save();
      ctx.translate(canvas.width / 2, 700);

      // Circular Seal
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fillStyle = `${theme.primary}15`;
      ctx.fill();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Logo Text
      ctx.textAlign = 'center';
      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('CertiChain', 0, -5);
      ctx.font = '7px sans-serif';
      ctx.fillText('VERIFIED', 0, 8);

      // Dhanu Signature
      ctx.fillStyle = theme.secondary;
      ctx.font = 'italic 20px cursive';
      ctx.rotate(-0.2);
      ctx.fillText('Dhanu', 0, 5);
      ctx.restore();
    } else {
      // Minimal Signature on Right
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.primary;
      ctx.font = 'italic 28px cursive';
      ctx.fillText('Dhanu', canvas.width - 100, 750);
      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.fillText('Authorized Signature', canvas.width - 100, 770);
    }

    return canvas;
  };

  const handleDownload = (cert) => {
    const canvas = getCertificateCanvas(cert);
    const link = document.createElement('a');
    link.download = `${cert.course.replace(/\s+/g, '_')}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async (cert) => {
    const canvas = getCertificateCanvas(cert);
    const verificationUrl = window.location.origin + '/verify?id=' + cert.id;

    try {
      // Convert canvas to blob then to file for sharing
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `Certificate_${cert.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // ONLY share the file as requested, no text or URL
        await navigator.share({
          files: [file]
        });
      } else if (navigator.share) {
        // Fallback to text if file sharing is not supported by browser
        await navigator.share({
          title: 'My Certificate',
          text: `Check out my verified certificate for ${cert.course}!`,
          url: verificationUrl,
        });
      } else {
        throw new Error('Web Share not supported');
      }
    } catch (err) {
      // Final fallback to clipboard
      navigator.clipboard.writeText(verificationUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Certificates</h1>
          <p>View, download, and share your blockchain-verified credentials.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Earned</div>
            <div style={{ fontWeight: 700 }}>{allCertificates.length} Certificates</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {allCertificates.map((cert, index) => (
          <div key={index} className="certificate-card glass-panel">
            <div className="certificate-preview" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
              <div style={{ textAlign: 'center' }}>
                <Award size={48} color="var(--accent-secondary)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontFamily: 'serif' }}>{cert.course}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{cert.issuer}</div>
              </div>
            </div>

            <div className="certificate-details">
              <h3>{cert.course}</h3>
              <div className="certificate-meta">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Issued On:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{cert.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ID:</span>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{cert.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Grade:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{cert.grade}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                {cert.status === 'pending' ? (
                  <div className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '100%', justifyContent: 'center', padding: '0.5rem' }}>
                    <ShieldAlert size={14} /> Verification Pending
                  </div>
                ) : (
                  <div className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '100%', justifyContent: 'center', padding: '0.5rem' }}>
                    <CheckCircle size={14} /> Blockchain Verified
                  </div>
                )}
              </div>

              <div className="certificate-actions">
                <button
                  onClick={() => handleDownload(cert)}
                  className={`btn ${cert.status === 'pending' ? 'btn-disabled' : 'btn-primary'}`}
                  style={{ padding: '0.5rem', flex: 1 }}
                  disabled={cert.status === 'pending'}
                >
                  {cert.status === 'pending' ? <Lock size={16} /> : <Download size={16} />}
                  {cert.status === 'pending' ? 'Locked' : 'Download'}
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className={`btn ${cert.status === 'pending' ? 'btn-disabled' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem', flex: 1 }}
                  disabled={cert.status === 'pending'}
                >
                  {cert.status === 'pending' ? <Lock size={16} /> : <Share2 size={16} />}
                  {cert.status === 'pending' ? 'Locked' : 'Share'}
                </button>
                {/* QR Code button */}
                <button
                  onClick={() => setActiveQR(activeQR === cert.id ? null : cert.id)}
                  className={`btn ${cert.status === 'pending' ? 'btn-disabled' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem', flex: 1 }}
                  disabled={cert.status === 'pending'}
                  title="View QR Code"
                >
                  {cert.status === 'pending' ? <Lock size={16} /> : <QrCode size={16} />}
                  {cert.status === 'pending' ? 'Locked' : 'QR Code'}
                </button>
              </div>

              {/* QR Panel — slides open below the actions */}
              {activeQR === cert.id && cert.status !== 'pending' && (
                <div
                  className="animate-fade-in"
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <QRCodeDisplay
                    certId={cert.id}
                    size={150}
                    color="#8b5cf6"
                    showDownload
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Share this QR so employers can instantly verify your certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {allCertificates.length === 0 && (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '2rem' }}>
          <Award size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No Certificates Issued Yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>When your university issues a certificate, it will appear here instantly.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

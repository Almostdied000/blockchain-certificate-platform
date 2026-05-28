import React, { useState, useEffect } from 'react';
import { Download, Share2, Award, Lock, ShieldAlert, CheckCircle } from 'lucide-react';
import { getCertificates, getCurrentUser } from '../../utils/storage';

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);

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
      ctx.lineWidth = 8;
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
              </div>
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

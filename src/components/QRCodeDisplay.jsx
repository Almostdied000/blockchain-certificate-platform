import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import QRCode from 'qrcode';
import { Download, QrCode, CheckCircle } from 'lucide-react';

/**
 * QRCodeDisplay — Reusable QR code generator for CertiChain certificates.
 *
 * Props:
 *  - certId      : string  — the certificate ID to encode in the QR URL
 *  - size        : number  — pixel size of the QR code (default: 180)
 *  - compact     : bool    — if true, renders a minimal version (for certificate preview embed)
 *  - showDownload: bool    — if true, shows the download button (default: true)
 *  - color       : string  — foreground colour of the QR modules (default: '#3b82f6')
 */
const QRCodeDisplay = ({
  certId,
  size = 180,
  compact = false,
  showDownload = true,
  color = '#3b82f6',
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Build the verification URL that the QR encodes
  const verifyUrl = `${window.location.origin}/verify?id=${certId}`;

  const handleDownloadQR = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const qrSize = 440;
      const padding = 24;
      const labelHeight = 70;
      const canvasWidth = qrSize + padding * 2;
      const canvasHeight = qrSize + padding * 2 + labelHeight;

      // Generate QR to offscreen canvas via qrcode library
      const offscreen = document.createElement('canvas');
      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;
      const ctx = offscreen.getContext('2d');

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Glow border
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(6, 6, canvasWidth - 12, canvasHeight - 12, 14);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw QR onto a temp canvas first
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, verifyUrl, {
        width: qrSize,
        margin: 1,
        color: { dark: color, light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });

      // White background behind QR
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, padding - 4, padding - 4, qrSize + 8, qrSize + 8, 10);
      ctx.fill();

      // Blit QR onto offscreen
      ctx.drawImage(qrCanvas, padding, padding);

      // Label section
      const labelY = padding + qrSize + 14;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scan to verify on CertiChain', canvasWidth / 2, labelY + 16);

      ctx.fillStyle = color;
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText(certId, canvasWidth / 2, labelY + 38);

      // Download
      const link = document.createElement('a');
      link.download = `QR-${certId}.png`;
      link.href = offscreen.toDataURL('image/png');
      link.click();

      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        setDownloading(false);
      }, 2500);
    } catch (err) {
      console.error('QR download failed, falling back to SVG:', err);
      setDownloading(false);
      // SVG fallback
      const svgEl = document.getElementById(`qr-svg-${certId}`);
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `QR-${certId}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2500);
      }
    }
  };

  // ── Compact mode: bare QR square (used inside certificate cards) ──
  if (compact) {
    return (
      <div
        style={{
          background: '#ffffff',
          padding: '4px',
          borderRadius: '4px',
          display: 'inline-flex',
        }}
        title={`Scan to verify: ${certId}`}
      >
        <QRCodeSVG
          id={`qr-svg-${certId}`}
          value={verifyUrl}
          size={size}
          fgColor="#0f172a"
          bgColor="#ffffff"
          level="H"
          includeMargin={false}
        />
      </div>
    );
  }

  // ── Full panel mode ──
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* QR title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        <QrCode size={14} color={color} />
        Scan to Verify
      </div>

      {/* QR code box */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${color}33`,
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          backdropFilter: 'blur(8px)',
          boxShadow: `0 0 30px ${color}15`,
          transition: 'box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 40px ${color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${color}15`;
        }}
      >
        {/* White frame around QR */}
        <div
          style={{
            padding: '8px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
          }}
        >
          <QRCodeSVG
            id={`qr-svg-${certId}`}
            value={verifyUrl}
            size={size}
            fgColor={color}
            bgColor="#ffffff"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Certificate ID label */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: color,
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            {certId}
          </div>
          <div
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              marginTop: '0.2rem',
            }}
          >
            Point camera to verify instantly
          </div>
        </div>
      </div>

      {/* Download button */}
      {showDownload && (
        <button
          onClick={handleDownloadQR}
          disabled={downloading}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: downloaded ? 'var(--success)' : undefined,
            borderColor: downloaded ? 'var(--success)' : undefined,
            transition: 'all 0.3s',
            opacity: downloading ? 0.7 : 1,
            cursor: downloading ? 'not-allowed' : 'pointer',
          }}
        >
          {downloaded ? (
            <>
              <CheckCircle size={16} /> Downloaded!
            </>
          ) : downloading ? (
            <>
              <QrCode size={16} /> Generating…
            </>
          ) : (
            <>
              <Download size={16} /> Download QR Code
            </>
          )}
        </button>
      )}
    </div>
  );
};

// Helper: draw a rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default QRCodeDisplay;

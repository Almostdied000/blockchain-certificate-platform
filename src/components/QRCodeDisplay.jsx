import React, { useRef, useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
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
  const canvasRef = useRef(null);
  const [downloaded, setDownloaded] = useState(false);

  // Build the verification URL that the QR encodes
  const verifyUrl = `${window.location.origin}/admin/verify?id=${certId}`;

  const handleDownloadQR = () => {
    // Render a fresh off-screen canvas at high resolution for download
    const offscreen = document.createElement('canvas');
    const qrSize = 400;
    offscreen.width = qrSize + 40;
    offscreen.height = qrSize + 80;

    const ctx = offscreen.getContext('2d');

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    // Rounded rect border
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, offscreen.width - 16, offscreen.height - 16, 12);
    ctx.stroke();

    // We need to draw the QRCode into canvas — use a temp hidden div trick
    // with QRCodeCanvas directly
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(
        offscreen,
        verifyUrl,
        {
          width: qrSize,
          margin: 2,
          color: {
            dark: color,
            light: '#0f172a',
          },
          errorCorrectionLevel: 'H',
        },
        () => {
          document.body.removeChild(tempDiv);

          // Label text at bottom
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('Scan to verify on CertiChain', offscreen.width / 2, qrSize + 30);
          ctx.fillStyle = color;
          ctx.font = 'bold 11px monospace';
          ctx.fillText(certId, offscreen.width / 2, qrSize + 52);

          const link = document.createElement('a');
          link.download = `QR-${certId}.png`;
          link.href = offscreen.toDataURL('image/png');
          link.click();

          setDownloaded(true);
          setTimeout(() => setDownloaded(false), 2500);
        }
      );
    }).catch(() => {
      // Fallback: just use the SVG approach and inform user
      document.body.removeChild(tempDiv);
      // Simple SVG-based download via the inline canvas
      const svgEl = document.getElementById(`qr-svg-${certId}`);
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.download = `QR-${certId}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2500);
      }
    });
  };

  // ── Compact mode: just the bare QR square (used inside certificate preview) ──
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
        {/* Coloured frame around QR */}
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
          }}
        >
          {downloaded ? (
            <>
              <CheckCircle size={16} /> Downloaded!
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

export default QRCodeDisplay;

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  Book,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { getCertificates, getCurrentUser } from '../../utils/storage';
import QRCodeDisplay from '../../components/QRCodeDisplay';

const templateColors = {
  professional: '#3b82f6',
  academic: '#6366f1',
  excellence: '#d97706',
  minimal: '#0ea5e9',
};

const StudentQRCodes = () => {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const load = async () => {
      const all = await getCertificates();
      // Filter only this student's certificates
      const mine = all
        .filter(
          (c) =>
            c.studentEmail?.toLowerCase() === user?.email?.toLowerCase() ||
            c.studentName?.toLowerCase() === user?.name?.toLowerCase()
        )
        .reverse();
      setCertificates(mine);
    };
    load();
  }, []);

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.courseName?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q) ||
      c.certId?.toLowerCase().includes(q)
    );
  });

  const handleCopyLink = (certId) => {
    const link = `${window.location.origin}/verify?id=${certId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(certId);
      setTimeout(() => setCopied(null), 2200);
    });
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>My QR Codes</h1>
          <p>Download or share your certificate QR codes for instant verification.</p>
        </div>
        <div
          className="glass-panel"
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <QrCode size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Certificates</div>
            <div style={{ fontWeight: 700 }}>{certificates.length} Issued</div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div
        className="glass-panel"
        style={{
          padding: '0.9rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by course or certificate ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          className="glass-panel"
          style={{ padding: '4rem 2rem', textAlign: 'center' }}
        >
          <QrCode
            size={64}
            color="var(--text-muted)"
            style={{ margin: '0 auto 1.5rem', opacity: 0.35 }}
          />
          <h2 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {search ? 'No results found' : 'No Certificates Yet'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {search
              ? 'Try a different keyword.'
              : 'Your QR codes will appear here once your certificates are issued.'}
          </p>
        </div>
      )}

      {/* Certificate accordion list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((cert) => {
          const color = templateColors[cert.template] || '#3b82f6';
          const isExpanded = expandedId === cert.id;
          const isCopied = copied === cert.id;

          return (
            <div
              key={cert.id}
              className="glass-panel animate-fade-in"
              style={{
                border: isExpanded
                  ? `1px solid ${color}55`
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px',
                overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
            >
              {/* Accordion header — click to expand */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : cert.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Mini QR thumb */}
                <div
                  style={{
                    background: '#fff',
                    padding: '5px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    boxShadow: `0 2px 12px ${color}40`,
                  }}
                >
                  <QRCodeDisplay
                    certId={cert.id}
                    size={44}
                    compact
                    showDownload={false}
                    color={color}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.2rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {cert.courseName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {cert.certId || cert.id}
                  </div>
                </div>

                {/* Status badge */}
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background:
                      cert.status === 'verified'
                        ? 'rgba(16,185,129,0.12)'
                        : 'rgba(245,158,11,0.12)',
                    color: cert.status === 'verified' ? '#10b981' : '#f59e0b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    flexShrink: 0,
                  }}
                >
                  {cert.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                </span>

                {/* Expand toggle */}
                <div style={{ color: color, flexShrink: 0 }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div
                  style={{
                    padding: '0 1.5rem 1.75rem',
                    borderTop: `1px solid ${color}22`,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '2rem',
                    alignItems: 'start',
                  }}
                >
                  {/* Left: cert details */}
                  <div style={{ paddingTop: '1.25rem' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {[
                        { icon: Book,     label: 'Program',   value: cert.courseName },
                        { icon: Award,    label: 'Grade',     value: cert.grade },
                        { icon: Calendar, label: 'Issued On', value: cert.issueDate },
                        { icon: Award,    label: 'Template',  value: cert.template },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ display: 'flex', gap: '0.6rem' }}>
                          <Icon size={15} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {label}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                              {value || '—'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Verify link */}
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Verification Link
                      </div>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: color,
                          wordBreak: 'break-all',
                        }}
                      >
                        {window.location.origin}/verify?id={cert.id}
                      </div>
                    </div>

                    {/* Action: copy link */}
                    <button
                      onClick={() => handleCopyLink(cert.id)}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: isCopied ? 'var(--success)' : undefined,
                        borderColor: isCopied ? 'var(--success)' : undefined,
                        transition: 'all 0.3s',
                      }}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle size={16} /> Link Copied!
                        </>
                      ) : (
                        <>
                          <Share2 size={16} /> Copy Verification Link
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: full QR code */}
                  <div style={{ paddingTop: '1.25rem' }}>
                    <QRCodeDisplay
                      certId={cert.id}
                      size={160}
                      color={color}
                      showDownload
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentQRCodes;

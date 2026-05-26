import React, { useState, useEffect } from 'react';
import { QrCode, Search, CheckCircle, XCircle, User, Book, Calendar, Award } from 'lucide-react';
import { getCertificates } from '../../utils/storage';
import QRCodeDisplay from '../../components/QRCodeDisplay';

const QRCodeViewer = () => {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const certs = await getCertificates();
      setCertificates([...certs].reverse());
    };
    load();
  }, []);

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.studentName?.toLowerCase().includes(q) ||
      c.courseName?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q) ||
      c.certId?.toLowerCase().includes(q)
    );
  });

  const colorMap = {
    professional: '#3b82f6',
    academic: '#1e293b',
    excellence: '#d97706',
    minimal: '#0ea5e9',
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>QR Code Manager</h1>
          <p>Generate, preview, and download QR codes for every issued certificate.</p>
        </div>
        <div
          className="glass-panel"
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <QrCode size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total QR Codes</div>
            <div style={{ fontWeight: 700 }}>{certificates.length} Generated</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '2rem', transition: 'all 0.3s' }}>
        {/* ── Left: Certificate list ── */}
        <div>
          {/* Search bar */}
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              className="input-field"
              placeholder="Search by student name, course, or certificate ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, padding: '0.25rem 0' }}
            />
          </div>

          {/* Certificate cards grid */}
          {filtered.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <QrCode size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
              <h2 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {search ? 'No certificates match your search' : 'No Certificates Issued Yet'}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                {search ? 'Try a different keyword.' : 'Issue a certificate first to generate its QR code.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((cert) => {
                const accentColor = colorMap[cert.template] || '#3b82f6';
                const isActive = selected?.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    className="glass-panel animate-fade-in"
                    onClick={() => setSelected(isActive ? null : cert)}
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      border: isActive
                        ? `2px solid ${accentColor}`
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      transition: 'all 0.25s',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isActive ? `0 8px 30px ${accentColor}25` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Card header: QR mini preview + status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      {/* Mini QR thumb */}
                      <div
                        style={{
                          background: '#ffffff',
                          padding: '6px',
                          borderRadius: '8px',
                          boxShadow: `0 2px 8px ${accentColor}40`,
                        }}
                      >
                        <QRCodeDisplay certId={cert.id} size={52} compact showDownload={false} color={accentColor} />
                      </div>
                      {/* Status badge */}
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '999px',
                          background: cert.status === 'verified' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color: cert.status === 'verified' ? '#10b981' : '#f59e0b',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {cert.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>

                    {/* Info */}
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      {cert.studentName}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {cert.courseName}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        paddingTop: '0.75rem',
                      }}
                    >
                      <span>{cert.issueDate}</span>
                      <span style={{ fontFamily: 'monospace', color: accentColor }}>{cert.id}</span>
                    </div>

                    {/* Click hint */}
                    <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: accentColor, fontWeight: 600 }}>
                      {isActive ? '▲ Click to collapse' : '▼ Click to view full QR'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right: Full QR panel (slides in) ── */}
        {selected && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem', borderRadius: '20px', border: `1px solid ${colorMap[selected.template] || '#3b82f6'}44` }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Certificate QR Code
            </h3>

            {/* Large QR */}
            <QRCodeDisplay
              certId={selected.id}
              size={200}
              color={colorMap[selected.template] || '#3b82f6'}
              showDownload
            />

            {/* Details below QR */}
            <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { icon: User,     label: 'Recipient',    value: selected.studentName },
                { icon: Book,     label: 'Program',      value: selected.courseName },
                { icon: Calendar, label: 'Issued On',    value: selected.issueDate },
                { icon: Award,    label: 'Grade',        value: selected.grade },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Icon size={16} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verify URL */}
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              {window.location.origin}/admin/verify?id={selected.id}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeViewer;

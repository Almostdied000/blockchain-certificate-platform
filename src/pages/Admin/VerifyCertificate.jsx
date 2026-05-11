import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, ShieldAlert, User, Book, Calendar, Award } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { verifyCertificate } from '../../utils/storage';

const VerifyCertificate = () => {
  const [certId, setCertId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // 'success', 'invalid', null
  const [certDetails, setCertDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setCertId(id);
      performVerification(id);
    }
  }, [location]);

  const performVerification = (id) => {
    const result = verifyCertificate(id);
    if (result) {
      setVerificationResult('success');
      setCertDetails(result);
    } else {
      setVerificationResult('invalid');
      setCertDetails(null);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId) return;
    performVerification(certId);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Verify Certificate</h1>
          <p>Validate the authenticity of a certificate using its unique ID or Hash.</p>
        </div>
      </div>

      <div className="verification-box glass-panel">
        <ShieldAlert size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Blockchain Verification Portal</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Enter the unique Certificate ID or Transaction Hash below to verify its existence on the blockchain.
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., CERT-0089 or 0xabc123..." 
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
            <Search size={20} /> Verify
          </button>
        </form>

        {/* Results section - Appears under text field */}
        <div style={{ marginBottom: '2rem' }}>
          {verificationResult === 'success' && certDetails && (
            <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle size={28} color="var(--success)" />
              <div>
                <h3 style={{ color: 'var(--success)', fontSize: '1.1rem' }}>✅ Certificate Verified Successfully!</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Authenticity confirmed on the blockchain.</p>
              </div>
            </div>
          )}

          {verificationResult === 'invalid' && (
            <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '12px', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <XCircle size={28} color="var(--error)" />
              <div>
                <h3 style={{ color: 'var(--error)', fontSize: '1.1rem' }}>❌ Verification Failed!</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>The ID <strong>{certId}</strong> was not found on the blockchain.</p>
              </div>
            </div>
          )}
        </div>

        {/* Details section - Only shown on success */}
        {verificationResult === 'success' && certDetails && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <User size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient</div>
                  <div style={{ fontWeight: 600 }}>{certDetails.studentName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Book size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program</div>
                  <div style={{ fontWeight: 600 }}>{certDetails.courseName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Calendar size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issued On</div>
                  <div style={{ fontWeight: 600 }}>{certDetails.issueDate}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Award size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Grade</div>
                  <div style={{ fontWeight: 600 }}>{certDetails.grade}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Blockchain Transaction Hash</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', color: 'var(--accent-primary)' }}>
                {certDetails.txnHash}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;

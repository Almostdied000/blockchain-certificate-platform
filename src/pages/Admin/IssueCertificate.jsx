import React, { useState } from 'react';
import { FilePlus, Hash, CheckCircle, Copy, Check, Award } from 'lucide-react';
import { saveCertificate } from '../../utils/storage';
import { CertificatePreview } from '../Public/QRVerify';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseName: '',
    issueDate: '',
    grade: '',
    template: 'professional'
  });

  const templates = [
    { id: 'professional', name: 'Modern Pro', color: '#3b82f6', icon: '💎' },
    { id: 'academic', name: 'Classic Uni', color: '#1e293b', icon: '🏛️' },
    { id: 'excellence', name: 'Gold Merit', color: '#d97706', icon: '🏆' },
    { id: 'minimal', name: 'Sleek Tech', color: '#0ea5e9', icon: '⚡' }
  ];

  const [isSuccess, setIsSuccess] = useState(false);
  const [issuedCert, setIssuedCert] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const newCert = await saveCertificate(formData);
      setIssuedCert(newCert);
      setIsSuccess(true);
    } catch (error) {
      alert('Error issuing certificate: ' + error.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Issue New Certificate</h1>
          <p>Generate and mint a new certificate on the blockchain.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {isSuccess ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
                <CheckCircle size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Certificate Minted!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                The certificate for <strong>{formData.studentName}</strong> has been successfully recorded on the blockchain.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Certificate ID</span>
                    <button 
                      onClick={() => handleCopy(issuedCert?.id)}
                      className="btn-icon" 
                      style={{ padding: '0.25rem', color: copied ? 'var(--success)' : 'var(--accent-primary)', border: 'none', background: 'transparent' }}
                      title="Copy ID"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{issuedCert?.id}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Transaction Hash</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', opacity: 0.8 }}>{issuedCert?.txnHash}</div>
                </div>
              </div>

              {/* Public verification note */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                You can share the Certificate ID with anyone to verify it on the public verification portal.
              </div>

              <button onClick={() => setIsSuccess(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Issue Another Certificate
              </button>
            </div>
          ) : (
            <form onSubmit={handleIssue}>
              <div className="input-group">
                <label className="input-label">Student Full Name</label>
                <input type="text" name="studentName" className="input-field" placeholder="E.g., John Doe" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label className="input-label">Student ID (Registration Number)</label>
                <input type="text" name="studentId" className="input-field" placeholder="E.g., STU-2023-001" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label className="input-label">Course / Program Name</label>
                <input type="text" name="courseName" className="input-field" placeholder="E.g., B.Sc Computer Science" onChange={handleChange} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Date of Issue</label>
                  <input 
                    type="date" 
                    name="issueDate" 
                    className="input-field" 
                    onChange={handleChange} 
                    required 
                    max="2099-12-31"
                  />
                </div>
                
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Grade / GPA</label>
                  <input type="text" name="grade" className="input-field" placeholder="E.g., A or 3.8/4.0" onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Select Certificate Design</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {templates.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setFormData({...formData, template: t.id})}
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '8px', 
                        border: formData.template === t.id ? `2px solid ${t.color}` : '1px solid var(--border-strong)',
                        background: formData.template === t.id ? `${t.color}10` : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t.icon}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                <FilePlus size={18} /> Generate & Mint Certificate
              </button>
            </form>
          )}
        </div>

        {/* Live Preview */}
        <div>
          <div className="glass-panel" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem' }}>Certificate Preview</h3>
            
            <div style={{ width: '100%', maxWidth: '460px' }}>
              <CertificatePreview cert={{
                studentName: formData.studentName || 'Student Name',
                course: formData.courseName || 'Course Name',
                date: formData.issueDate || 'YYYY-MM-DD',
                grade: formData.grade || 'A+',
                template: formData.template
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;

import React, { useState } from 'react';
import { FilePlus, Hash, CheckCircle, Copy, Check, Award } from 'lucide-react';
import { saveCertificate } from '../../utils/storage';

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

  const handleIssue = (e) => {
    e.preventDefault();
    const newCert = saveCertificate(formData);
    setIssuedCert(newCert);
    setIsSuccess(true);
    
    // Reset form after 3 seconds or keep success view
    setTimeout(() => {
      // Optional: setIsSuccess(false);
    }, 5000);
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
          <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem' }}>Certificate Preview</h3>
            
            <div style={{ 
              width: '100%', 
              aspectRatio: '1.414', 
              background: formData.template === 'minimal' ? '#0f172a' : formData.template === 'academic' ? '#fffdf9' : '#ffffff', 
              borderRadius: '4px', 
              padding: formData.template === 'minimal' ? '0' : '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: formData.template === 'minimal' ? 'flex-start' : 'center', 
              justifyContent: 'center', 
              position: 'relative', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              border: formData.template === 'excellence' ? '12px solid #d97706' : 'none'
            }}>
              {formData.template === 'minimal' && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', background: templates.find(t => t.id === 'minimal').color }}></div>
              )}
              
              <div style={{ 
                border: formData.template === 'academic' ? '4px double #1e293b' : formData.template === 'minimal' || formData.template === 'excellence' ? 'none' : '2px solid #e2e8f0', 
                width: '100%', 
                height: '100%', 
                padding: formData.template === 'minimal' ? '3rem 4rem' : '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: formData.template === 'minimal' ? 'flex-start' : 'center', 
                justifyContent: 'center', 
                textAlign: formData.template === 'minimal' ? 'left' : 'center' 
              }}>
                <h2 style={{ 
                  color: templates.find(t => t.id === formData.template)?.color, 
                  fontFamily: formData.template === 'academic' || formData.template === 'excellence' ? 'serif' : 'sans-serif', 
                  fontSize: formData.template === 'minimal' ? '1.5rem' : '1.1rem', 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {formData.template === 'academic' ? 'Diploma of Completion' : 
                   formData.template === 'excellence' ? 'Certificate of Excellence' : 'Certificate of Achievement'}
                </h2>
                
                <p style={{ color: formData.template === 'minimal' ? '#94a3b8' : '#64748b', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                  {formData.template === 'minimal' ? 'This digital asset confirms that' : 'This is to officially recognize that'}
                </p>
                
                <h1 style={{ 
                  color: formData.template === 'minimal' ? '#ffffff' : '#0f172a', 
                  fontFamily: formData.template === 'academic' || formData.template === 'excellence' ? 'serif' : 'sans-serif', 
                  fontSize: formData.template === 'minimal' ? '2rem' : '1.5rem', 
                  borderBottom: formData.template === 'minimal' ? 'none' : `1px solid ${templates.find(t => t.id === formData.template)?.color}55`, 
                  paddingBottom: '0.25rem', 
                  minWidth: formData.template === 'minimal' ? 'auto' : '180px', 
                  marginBottom: '1rem' 
                }}>
                  {formData.studentName || 'Student Name'}
                </h1>
                
                <p style={{ color: formData.template === 'minimal' ? '#94a3b8' : '#64748b', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                  {formData.template === 'minimal' ? `Successfully achieved mastery in` : 'for the successful completion of the program'}
                </p>
                
                <h3 style={{ color: formData.template === 'minimal' ? templates.find(t => t.id === 'minimal').color : '#0f172a', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 700 }}>
                  {formData.courseName || 'Course Name'}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.6rem', color: formData.template === 'minimal' ? '#475569' : '#64748b' }}>Date of Issue</div>
                    <div style={{ color: formData.template === 'minimal' ? '#ffffff' : '#0f172a', fontSize: '0.7rem', fontWeight: 600 }}>{formData.issueDate || '--'}</div>
                  </div>
                  
                  {formData.template !== 'minimal' && (
                    <div style={{ 
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '50%', 
                      background: `${templates.find(t => t.id === formData.template)?.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${templates.find(t => t.id === formData.template)?.color}44`
                    }}>
                      <Award size={20} color={templates.find(t => t.id === formData.template)?.color} />
                    </div>
                  )}
                  
                  <div style={{ textAlign: formData.template === 'minimal' ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.6rem', color: formData.template === 'minimal' ? '#475569' : '#64748b' }}>Grade Achieved</div>
                    <div style={{ color: formData.template === 'minimal' ? '#ffffff' : '#0f172a', fontSize: '0.7rem', fontWeight: 600 }}>{formData.grade || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;

import React, { useState, useEffect } from 'react';
import { Users, FileBadge, CheckCircle, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import { getCertificates, getUsers, getVerifications, deleteUser, deleteCertificate, deleteVerification } from '../../utils/storage';

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [activeView, setActiveView] = useState(null); // 'issued', 'verified', 'students', null

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCertificates(getCertificates());
    setUsers(getUsers().filter(u => u.role === 'student'));
    setVerifications(getVerifications());
  };

  const handleDeleteStudent = (email) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteUser(email);
      refreshData();
    }
  };

  const handleDeleteCertificate = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate? This will permanently remove it from the blockchain record.')) {
      deleteCertificate(id);
      refreshData();
    }
  };

  const handleDeleteVerification = (timestamp) => {
    if (window.confirm('Are you sure you want to delete this verification log?')) {
      deleteVerification(timestamp);
      refreshData();
    }
  };

  const stats = {
    totalIssued: certificates.length,
    successVerifications: verifications.length,
    registeredStudents: users.length
  };

  const toggleView = (view) => {
    setActiveView(activeView === view ? null : view);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Total Issued Card */}
        <div 
          className="glass-panel stat-card" 
          style={{ cursor: 'pointer', border: activeView === 'issued' ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)' }} 
          onClick={() => toggleView('issued')}
        >
          <div className="stat-info">
            <h3>Total Certificates Issued</h3>
            <div className="value">{stats.totalIssued.toLocaleString()}</div>
            <p style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {activeView === 'issued' ? 'Hide List' : 'View All Log'}
            </p>
          </div>
          <div className="stat-icon icon-blue">
            <FileBadge size={24} />
          </div>
        </div>

        {/* Successful Verifications Card */}
        <div 
          className="glass-panel stat-card" 
          style={{ cursor: 'pointer', border: activeView === 'verified' ? '1px solid var(--success)' : '1px solid rgba(255,255,255,0.1)' }} 
          onClick={() => toggleView('verified')}
        >
          <div className="stat-info">
            <h3>Successful Verifications</h3>
            <div className="value">{stats.successVerifications.toLocaleString()}</div>
            <p style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {activeView === 'verified' ? 'Hide History' : 'View History'}
            </p>
          </div>
          <div className="stat-icon icon-green">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Registered Students Card */}
        <div 
          className="glass-panel stat-card" 
          style={{ cursor: 'pointer', border: activeView === 'students' ? '1px solid var(--accent-secondary)' : '1px solid rgba(255,255,255,0.1)' }} 
          onClick={() => toggleView('students')}
        >
          <div className="stat-info">
            <h3>Registered Students</h3>
            <div className="value">{stats.registeredStudents.toLocaleString()}</div>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {activeView === 'students' ? 'Hide Directory' : 'View Directory'}
            </p>
          </div>
          <div className="stat-icon icon-purple">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Complete Issuance Log (Dynamic) */}
      {activeView === 'issued' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileBadge size={20} color="var(--accent-primary)" /> 
            Complete Certificate Registry
          </h3>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cert ID</th>
                  <th>Student Name</th>
                  <th>Course Name</th>
                  <th>Issue Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...certificates].reverse().map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{row.id}</td>
                    <td style={{ fontWeight: 500 }}>{row.studentName}</td>
                    <td>{row.courseName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.issueDate}</td>
                    <td><span className="badge badge-success">Minted</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteCertificate(row.id)}
                        className="btn-icon" 
                        style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        title="Delete Certificate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {certificates.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No certificates issued yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification History (Dynamic) */}
      {activeView === 'verified' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--success)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--success)" /> 
            Blockchain Verification Logs
          </h3>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cert ID</th>
                  <th>Student</th>
                  <th>Program</th>
                  <th>Verification Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...verifications].reverse().map((log, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'monospace' }}>{log.certId}</td>
                    <td style={{ fontWeight: 500 }}>{log.studentName}</td>
                    <td>{log.courseName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteVerification(log.timestamp)}
                        className="btn-icon" 
                        style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        title="Delete Log"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {verifications.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No verification attempts recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Directory (Dynamic) */}
      {activeView === 'students' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent-secondary)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--accent-secondary)" /> 
            Registered Students Directory
          </h3>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((student, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td>{student.email}</td>
                    <td><span className="badge badge-success">Active</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteStudent(student.email)}
                        className="btn-icon" 
                        style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

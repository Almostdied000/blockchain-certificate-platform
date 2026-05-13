import React, { useState, useEffect } from 'react';
import { Users, Trash2, Mail, ShieldCheck, Search, X, Calendar, FileBadge, User } from 'lucide-react';
import { getUsers, deleteUser, getCertificates } from '../../utils/storage';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const allUsers = await getUsers();
    setStudents(allUsers.filter(u => u.role === 'student'));
    setCertificates(await getCertificates());
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening details modal
    if (window.confirm('Are you sure you want to delete this student account? This will remove all their access to the platform.')) {
      await deleteUser(id);
      if (selectedStudent?.id === id) setSelectedStudent(null);
      refreshData();
    }
  };

  const getStudentCerts = (studentName) => {
    return certificates.filter(c => c.studentName === studentName);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Directory of all students registered on the CertiChain platform.</p>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div 
          className="modal-overlay animate-fade-in" 
          onClick={() => setSelectedStudent(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
        >
          <div 
            className="modal-content glass-panel" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: '600px', 
              width: '100%',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Close Button at the Corner */}
            <button 
              className="btn-icon" 
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <X size={20} />
            </button>

            <div className="modal-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-strong)' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                <User size={24} color="var(--accent-primary)" /> Student Profile
              </h2>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', flexShrink: 0 }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedStudent.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} /> {selectedStudent.email}
                  </div>
                  <div className="badge badge-success" style={{ marginTop: '0.75rem' }}>
                    <ShieldCheck size={14} /> Registered Student
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileBadge size={18} /> Issued Certificates ({getStudentCerts(selectedStudent.name).length})
                </h4>
                <div className="certificate-list-mini" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {getStudentCerts(selectedStudent.name).map((cert, i) => (
                    <div key={i} className="mini-cert-item glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{cert.courseName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {cert.id} • {cert.issueDate}</div>
                      </div>
                      <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>Verified</div>
                    </div>
                  ))}
                  {getStudentCerts(selectedStudent.name).length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                      No certificates issued to this student yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          <div className="badge badge-success" style={{ padding: '0.75rem 1.25rem' }}>
            <Users size={16} /> Total Students: {students.length}
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Access Level</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <tr
                  key={i}
                  className="animate-fade-in clickable-row"
                  style={{ animationDelay: `${i * 0.05}s`, cursor: 'pointer' }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                        {student.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {student.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      <ShieldCheck size={12} /> Student Access
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={(e) => handleDelete(e, student.id)}
                      className="btn-icon"
                      style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                      title="Delete Student"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                    <p>No students found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;

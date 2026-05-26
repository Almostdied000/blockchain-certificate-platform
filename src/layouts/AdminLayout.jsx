import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileBadge, CheckCircle, LogOut, Shield, Users, QrCode } from 'lucide-react';

const AdminLayout = ({ setUser, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Shield size={28} color="#3b82f6" />
          <span className="gradient-text">CertiChain</span>
        </div>
        
        <nav className="nav-links">
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Registered Students
          </NavLink>
          <NavLink to="/admin/issue" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileBadge size={20} /> Issue Certificate
          </NavLink>
          <NavLink to="/admin/verify" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckCircle size={20} /> Verify Certificate
          </NavLink>
          <NavLink to="/admin/qr-codes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <QrCode size={20} /> QR Code Manager
          </NavLink>
        </nav>

        <div className="user-profile-sm">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.email}</div>
          </div>
          <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', color: 'var(--text-muted)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Administrator Portal</h2>
          <div className="badge badge-success">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span> Mainnet Connected
          </div>
        </header>
        
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

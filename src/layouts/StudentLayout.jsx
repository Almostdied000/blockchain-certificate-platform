import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';

const StudentLayout = ({ setUser, user }) => {
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
          <GraduationCap size={28} color="#8b5cf6" />
          <span className="gradient-text">CertiChain</span>
        </div>
        
        <nav className="nav-links">
          <NavLink to="/student" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> My Dashboard
          </NavLink>
        </nav>

        <div className="user-profile-sm">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.id}</div>
          </div>
          <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', color: 'var(--text-muted)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Portal</h2>
        </header>
        
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;

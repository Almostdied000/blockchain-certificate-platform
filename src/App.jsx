import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import Students from './pages/Admin/Students';
import IssueCertificate from './pages/Admin/IssueCertificate';
import VerifyCertificate from './pages/Admin/VerifyCertificate';
import StudentDashboard from './pages/Student/Dashboard';
import VerificationPortal from './pages/Public/VerificationPortal';
import { getCurrentUser } from './utils/storage';
import './App.css';

function App() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Public QR Verification — accessible without login */}
        <Route path="/verify" element={<VerificationPortal />} />

        {/* Admin / Verifier Routes */}
        <Route path="/admin" element={user && user.role === 'admin' ? <AdminLayout setUser={setUser} user={user} /> : <Navigate to="/login" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="issue" element={<IssueCertificate />} />
          <Route path="verify" element={<VerifyCertificate />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={user && user.role === 'student' ? <StudentLayout setUser={setUser} user={user} /> : <Navigate to="/login" />}>
          <Route index element={<StudentDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

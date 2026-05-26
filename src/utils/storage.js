// Local Storage Keys
const CERTS_KEY = 'certificates';
const VERIFICATIONS_KEY = 'verifications';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// Seed initial data if empty (for deployments like Vercel where localStorage starts blank)
const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([
      {
        id: "1",
        name: "Admin User",
        email: "admin@certichain.com",
        password: "password123",
        role: "admin"
      },
      {
        id: "2",
        name: "Dhanush Kumar",
        email: "student@certichain.com",
        password: "password123",
        role: "student",
        securityQuestion: "What city were you born in?",
        securityAnswer: "chennai"
      }
    ]));
  }
  if (!localStorage.getItem(CERTS_KEY)) {
    localStorage.setItem(CERTS_KEY, JSON.stringify([
      {
        id: "CERT-2026-0001",
        certId: "CERT-2026-0001",
        studentName: "Dhanush Kumar",
        studentId: "STU-2026-001",
        studentEmail: "student@certichain.com",
        courseName: "Blockchain Technology & Smart Contracts",
        issueDate: "2026-05-20",
        grade: "A+",
        template: "excellence",
        txnHash: "0x7b9a12c4e68d90f12a34b56c78d90f1234a56b78c90de12f3456a78b90c12d34",
        status: "verified",
        createdAt: "2026-05-20T10:00:00.000Z"
      },
      {
        id: "CERT-2026-0002",
        certId: "CERT-2026-0002",
        studentName: "Jane Doe",
        studentId: "STU-2026-002",
        studentEmail: "jane.doe@example.com",
        courseName: "Introduction to Ethereum Development",
        issueDate: "2026-05-22",
        grade: "A",
        template: "professional",
        txnHash: "0x12a34b56c78d90f1234a56b78c90de12f3456a78b90c12d345678b90f12c34d5",
        status: "verified",
        createdAt: "2026-05-22T14:30:00.000Z"
      }
    ]));
  }
};

initializeStorage();

// Helper functions
const getFromStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Certificate Management
export const getCertificates = async () => {
  return getFromStorage(CERTS_KEY);
};

export const saveCertificate = async (certificate) => {
  const certs = getFromStorage(CERTS_KEY);
  const certId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const txnHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
  
  const newCert = {
    ...certificate,
    id: Date.now().toString(),
    certId: certId,
    txnHash: txnHash,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  certs.push(newCert);
  saveToStorage(CERTS_KEY, certs);
  return newCert;
};

export const updateCertificate = async (id, updatedData) => {
  const certs = getFromStorage(CERTS_KEY);
  const index = certs.findIndex(c => c.id === id);
  if (index !== -1) {
    certs[index] = { ...certs[index], ...updatedData };
    saveToStorage(CERTS_KEY, certs);
    return certs[index];
  }
  return null;
};

export const deleteCertificate = async (id) => {
  const certs = getFromStorage(CERTS_KEY);
  const filteredCerts = certs.filter(c => c.id !== id);
  saveToStorage(CERTS_KEY, filteredCerts);
};

// Verification Management
export const getVerifications = async () => {
  const verifications = getFromStorage(VERIFICATIONS_KEY);
  return verifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const logVerification = async (verification) => {
  const verifications = getFromStorage(VERIFICATIONS_KEY);
  verifications.push({
    ...verification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
  saveToStorage(VERIFICATIONS_KEY, verifications);
};

export const deleteVerification = async (id) => {
  const verifications = getFromStorage(VERIFICATIONS_KEY);
  const filtered = verifications.filter(v => v.id !== id);
  saveToStorage(VERIFICATIONS_KEY, filtered);
};

export const verifyCertificate = async (searchId) => {
  const certs = getFromStorage(CERTS_KEY);
  const cert = certs.find(c => 
    c.id === searchId ||
    c.certId?.toUpperCase() === searchId.toUpperCase() || 
    c.txnHash === searchId
  );

  if (cert) {
    if (cert.status === 'pending') {
      cert.status = 'verified';
      saveToStorage(CERTS_KEY, certs);
    }

    await logVerification({
      certId: cert.certId || cert.id,
      studentName: cert.studentName,
      courseName: cert.courseName,
      status: 'Success'
    });

    return cert;
  }
  return null;
};

// User Management
export const getUsers = async () => {
  return getFromStorage(USERS_KEY);
};

export const registerUser = async (userData) => {
  const users = getFromStorage(USERS_KEY);
  if (users.find(u => u.email === userData.email)) {
    throw new Error('User already exists');
  }

  const newUser = {
    ...userData,
    id: Date.now().toString()
  };
  
  users.push(newUser);
  saveToStorage(USERS_KEY, users);
  return newUser;
};

export const getUserByEmail = async (email) => {
  const users = getFromStorage(USERS_KEY);
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
};

export const resetPassword = async (email, securityAnswer, newPassword) => {
  const users = getFromStorage(USERS_KEY);
  const index = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (index === -1) return { success: false, error: 'No account found with that email.' };
  const user = users[index];
  if (!user.securityAnswer) return { success: false, error: 'This account has no security question set.' };
  if (user.securityAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()) {
    return { success: false, error: 'Security answer is incorrect.' };
  }
  users[index] = { ...user, password: newPassword.trim() };
  saveToStorage(USERS_KEY, users);
  return { success: true };
};

export const loginUser = async (email, password) => {
  const users = getFromStorage(USERS_KEY);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const deleteUser = async (id) => {
  const users = getFromStorage(USERS_KEY);
  const filteredUsers = users.filter(u => u.id !== id);
  saveToStorage(USERS_KEY, filteredUsers);
};

export const logout = () => {
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

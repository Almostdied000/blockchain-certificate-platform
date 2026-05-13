// Local Storage Keys
const CERTS_KEY = 'certificates';
const VERIFICATIONS_KEY = 'verifications';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

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

export const loginUser = async (email, password) => {
  const users = getFromStorage(USERS_KEY);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const deleteUser = async (id) => {
  const users = getFromStorage(USERS_KEY);
  const filteredUsers = users.filter(u => u.id !== id);
  saveToStorage(USERS_KEY, filteredUsers);
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

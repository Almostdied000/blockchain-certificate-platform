
export const getCertificates = () => {
  const certs = localStorage.getItem('certificates');
  return certs ? JSON.parse(certs) : [];
};

export const saveCertificate = (certificate) => {
  const certs = getCertificates();
  const newCert = {
    ...certificate,
    id: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    txnHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
    status: 'pending' // Initial status is pending
  };
  certs.push(newCert);
  localStorage.setItem('certificates', JSON.stringify(certs));
  return newCert;
};

export const updateCertificate = (id, updatedData) => {
  const certs = getCertificates();
  const index = certs.findIndex(c => c.id === id);
  if (index !== -1) {
    certs[index] = { ...certs[index], ...updatedData };
    localStorage.setItem('certificates', JSON.stringify(certs));
    return certs[index];
  }
  return null;
};

export const deleteCertificate = (id) => {
  const certs = getCertificates();
  const updatedCerts = certs.filter(c => c.id !== id);
  localStorage.setItem('certificates', JSON.stringify(updatedCerts));
};

export const getVerifications = () => {
  const logs = localStorage.getItem('verifications');
  return logs ? JSON.parse(logs) : [];
};

export const logVerification = (verification) => {
  const logs = getVerifications();
  logs.push({
    ...verification,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('verifications', JSON.stringify(logs));
};

export const verifyCertificate = (certId) => {
  const certs = getCertificates();
  const index = certs.findIndex(c => c.id.toUpperCase() === certId.toUpperCase() || c.txnHash === certId);
  
  if (index !== -1) {
    const result = certs[index];
    
    // Automatically verify if found and currently pending
    if (result.status === 'pending') {
      certs[index].status = 'verified';
      localStorage.setItem('certificates', JSON.stringify(certs));
    }

    logVerification({
      certId: result.id,
      studentName: result.studentName,
      courseName: result.courseName,
      status: 'Success'
    });
    
    return certs[index];
  }
  return null;
};

// User Management
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [
    { email: 'admin@test.com', password: 'password', role: 'admin', name: 'Admin User' },
    { email: 'student@test.com', password: 'password', role: 'student', name: 'Test Student' }
  ];
};

export const registerUser = (userData) => {
  const users = getUsers();
  if (users.find(u => u.email === userData.email)) {
    throw new Error('User already exists');
  }
  const newUser = { ...userData };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const deleteUser = (email) => {
  const users = getUsers();
  const updatedUsers = users.filter(u => u.email !== email);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};

export const deleteVerification = (timestamp) => {
  const logs = getVerifications();
  const updatedLogs = logs.filter(l => l.timestamp !== timestamp);
  localStorage.setItem('verifications', JSON.stringify(updatedLogs));
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

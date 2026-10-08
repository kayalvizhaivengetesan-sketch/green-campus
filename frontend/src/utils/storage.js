const API_BASE_URL = 'http://localhost:5000/api';
const UPLOAD_URL = 'http://localhost:5000/upload';

const KEYS = {
  ADMIN_AUTH: 'gc_admin_auth',
};

export const setAdminAuth = (status) => {
  localStorage.setItem(KEYS.ADMIN_AUTH, JSON.stringify(status));
};

export const isAdminAuthenticated = () => {
  return JSON.parse(localStorage.getItem(KEYS.ADMIN_AUTH) || 'false');
};

// --- Upload Helper ---
const uploadImages = async (base64String) => {
  if (!base64String || !base64String.startsWith('data:image')) {
    return null;
  }
  
  try {
    const res = await fetch(base64String);
    const blob = await res.blob();
    
    const formData = new FormData();
    formData.append('images', blob, 'upload.jpg');
    
    const uploadRes = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    });
    
    if (uploadRes.ok) {
      const data = await uploadRes.json();
      return data.files && data.files.length > 0 ? `http://localhost:5000/uploads/${data.files[0]}` : null;
    }
  } catch (err) {
    console.error("Upload error", err);
  }
  return null;
};

// --- QR Codes ---
export const getQRCodes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/qr`);
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch QR codes:", e);
    return [];
  }
};

export const addQRCode = async (qrCode) => {
  const response = await fetch(`${API_BASE_URL}/qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qrCode)
  });
  return response.json();
};

export const deleteQRCode = async (id) => {
  await fetch(`${API_BASE_URL}/qr/${id}`, { method: 'DELETE' });
};

// --- Flora ---
export const getFlora = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/flora`);
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch Flora:", e);
    return [];
  }
};

export const getFloraById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flora/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch Flora by ID:", e);
    return null;
  }
};

export const addFlora = async (flora) => {
  let uploadedImage2 = null;
  if (flora.image2File && flora.image2File.startsWith('data:image')) {
    uploadedImage2 = await uploadImages(flora.image2File);
  }
  
  const finalFlora = {
    ...flora,
    image1: flora.image1Url || flora.image1 || '',
    image2: uploadedImage2 || flora.image2 || ''
  };
  delete finalFlora.image1Url;
  delete finalFlora.image2File;

  const response = await fetch(`${API_BASE_URL}/flora`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalFlora)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add flora');
  }
  return response.json();
};

export const updateFlora = async (updatedFlora) => {
  let uploadedImage2 = null;
  if (updatedFlora.image2File && updatedFlora.image2File.startsWith('data:image')) {
    uploadedImage2 = await uploadImages(updatedFlora.image2File);
  }
  
  const finalFlora = {
    ...updatedFlora,
    image1: updatedFlora.image1Url || updatedFlora.image1 || '',
    image2: uploadedImage2 || updatedFlora.image2 || ''
  };
  delete finalFlora.image1Url;
  delete finalFlora.image2File;

  const response = await fetch(`${API_BASE_URL}/flora/${finalFlora.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalFlora)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update flora');
  }
  return response.json();
};

export const deleteFlora = async (id) => {
  await fetch(`${API_BASE_URL}/flora/${id}`, { method: 'DELETE' });
};

// --- Fauna ---
export const getFauna = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fauna`);
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch Fauna:", e);
    return [];
  }
};

export const getFaunaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fauna/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch Fauna by ID:", e);
    return null;
  }
};

export const addFauna = async (fauna) => {
  let uploadedImage2 = null;
  if (fauna.image2File && fauna.image2File.startsWith('data:image')) {
    uploadedImage2 = await uploadImages(fauna.image2File);
  }
  
  const finalFauna = {
    ...fauna,
    image1: fauna.image1Url || fauna.image1 || '',
    image2: uploadedImage2 || fauna.image2 || ''
  };
  delete finalFauna.image1Url;
  delete finalFauna.image2File;

  const response = await fetch(`${API_BASE_URL}/fauna`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalFauna)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add fauna');
  }
  return response.json();
};

export const updateFauna = async (updatedFauna) => {
  let uploadedImage2 = null;
  if (updatedFauna.image2File && updatedFauna.image2File.startsWith('data:image')) {
    uploadedImage2 = await uploadImages(updatedFauna.image2File);
  }
  
  const finalFauna = {
    ...updatedFauna,
    image1: updatedFauna.image1Url || updatedFauna.image1 || '',
    image2: uploadedImage2 || updatedFauna.image2 || ''
  };
  delete finalFauna.image1Url;
  delete finalFauna.image2File;

  const response = await fetch(`${API_BASE_URL}/fauna/${finalFauna.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalFauna)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update fauna');
  }
  return response.json();
};

export const deleteFauna = async (id) => {
  await fetch(`${API_BASE_URL}/fauna/${id}`, { method: 'DELETE' });
};

// --- Feedback ---
export const getFeedback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch feedback:", e);
    return [];
  }
};

export const addFeedback = async (feedback) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  return response.json();
};

export const deleteFeedback = async (id) => {
  await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE' });
};

// --- Admin Login ---
export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

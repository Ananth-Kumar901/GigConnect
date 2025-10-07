import axios from 'axios';
import { setAuthToken } from './auth';

const API_BASE = 'http://localhost:5000/api/applications';

// ✅ Set token for authenticated requests
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
};

// ✅ Freelancer: Apply to a gig
export const applyToGig = async (gigId, payload) => {
  getAuthToken();

  // Validate bidAmount
  if (!payload.bidAmount || typeof payload.bidAmount !== 'number' || payload.bidAmount <= 0) {
    throw new Error('Invalid bid amount');
  }

  try {
    const res = await axios.post(`${API_BASE}/${gigId}/apply`, payload);
    return res.data;
  } catch (err) {
    console.error('applyToGig error:', err);
    throw err;
  }
};

// ✅ Client: Get applications for a gig
export const getApplicationsForGig = async (gigId) => {
  getAuthToken();

  if (!gigId) throw new Error('Gig ID is required');

  try {
    const res = await axios.get(`${API_BASE}/gig/${gigId}`);
    return res.data;
  } catch (err) {
    console.error('getApplicationsForGig error:', err);
    throw err;
  }
};

// ✅ Freelancer: Get own applications
export const getMyApplications = async () => {
  getAuthToken();
  try {
    const res = await axios.get(`${API_BASE}/me`);
    return res.data;
  } catch (err) {
    console.error('getMyApplications error:', err);
    throw err;
  }
};

// ✅ Client: Update application status (accept/reject)
export const updateApplicationStatus = async (applicationId, status) => {
  getAuthToken();

  if (!applicationId) throw new Error('Application ID is required');
  if (!['accepted', 'rejected'].includes(status)) throw new Error('Invalid status value');

  try {
    const res = await axios.patch(`${API_BASE}/${applicationId}/status`, { status });
    return res.data;
  } catch (err) {
    console.error('updateApplicationStatus error:', err.response?.data || err.message);
    throw err;
  }
};

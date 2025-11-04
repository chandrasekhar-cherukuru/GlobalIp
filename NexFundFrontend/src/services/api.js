import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request');
    } else {
      console.log('⚠️ No JWT token found');
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    console.error('❌ Error details:', error.response?.data);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🔐 Auth error - clearing tokens');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ===== AUTHENTICATION APIs =====
export const login = (credentials) => api.post('/login', credentials);
export const register = (userData) => api.post('/register', userData);

// ===== EVENTS API =====
export const createEvent = (eventData) => api.post('/events/create', eventData);
export const getAllEvents = () => api.get('/events/allEvents');
export const getEventById = (id) => api.get(`/events/${id}`);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// ===== GIFTS API =====
export const createGift = (giftData) => api.post('/gifts/create', giftData);
export const getAllGifts = () => api.get('/gifts/allGifts');
export const getGiftById = (id) => api.get(`/gifts/${id}`);
export const deleteGift = (id) => api.delete(`/gifts/${id}`);

// ===== DONATIONS API =====
export const createDonation = (donationData) => api.post('/donations/create', donationData);
export const getAllDonations = () => api.get('/donations/all');
export const getDonationById = (id) => api.get(`/donations/${id}`);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);

// ===== BACKEND QR GENERATION APIs =====
export const generateEventQRCode = (eventId) => {
  const url = `/api/upi/event/${eventId}/qr`;
  console.log('🔗 Calling Backend Event QR:', url);
  return api.get(url);
};

export const generateEventQRCodeWithAmount = (eventId, amount) => {
  const url = `/api/upi/event/${eventId}/qr/amount/${amount}`;
  console.log('🔗 Calling Backend Event QR with Amount:', url);
  return api.get(url);
};

export const generateGiftQRCode = (giftId) => {
  const url = `/api/upi/gift/${giftId}/qr`;
  console.log('🔗 Calling Backend Gift QR:', url);
  return api.get(url);
};

export const generateDonationQRCode = (donationId) => {
  const url = `/api/upi/donation/${donationId}/qr`;
  console.log('🔗 Calling Backend Donation QR:', url);
  return api.get(url);
};

// ===== PARTICIPANT VERIFICATION APIs =====
export const verifyParticipant = (participantData) => {
  console.log('🔄 Verifying participant:', participantData);
  return api.post('/participants/verify', participantData);
};

// 🚨 **CORRECTED: Proper participant loading functions**
export const getParticipantsByFundraiser = (fundraiserId) => {
  console.log('📋 Getting participants for fundraiser:', fundraiserId);
  return api.get(`/participants/fundraiser/${fundraiserId}`);
};

export const getMyFundraiserParticipants = () => {
  console.log('📋 Getting all my fundraiser participants');
  return api.get('/participants/my-fundraisers');
};

export const getParticipantStats = (fundraiserId) => {
  console.log('📊 Getting participant stats for fundraiser:', fundraiserId);
  return api.get(`/participants/stats/${fundraiserId}`);
};

// ===== FINAL VERIFICATION APIs =====
export const finallyVerifyParticipant = (participantId, requestBody = {}) => {
  console.log('🔄 Finally verifying participant:', participantId, 'with data:', requestBody);
  return api.post(`/participants/final-verify/${participantId}`, requestBody);
};

export const checkFinalVerification = (participantId) => {
  console.log('📋 Checking final verification for participant:', participantId);
  return api.get(`/participants/final-verify/check/${participantId}`);
};

export const getMyFinalVerifications = () => {
  console.log('📋 Getting all my final verifications');
  return api.get('/participants/final-verify/my-verifications');
};

export const getFinalVerificationsByFundraiser = (fundraiserId) => {
  console.log('📋 Getting final verifications for fundraiser:', fundraiserId);
  return api.get(`/participants/final-verify/fundraiser/${fundraiserId}`);
};

// ===== LEGACY UPI ENDPOINTS (fallback) =====
export const generateEventUpiLink = (eventId) => api.get(`/upi/event/generate/${eventId}`);
export const generateEventUpiLinkWithAmount = (eventId, amount) => api.get(`/upi/event/generate/${eventId}/amount/${amount}`);
export const generateGiftUpiLink = (giftId) => api.get(`/upi/gift/generate/${giftId}`);

export default api;

import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token expires in next 30 seconds (buffer time)
    return decodedToken.exp < (currentTime + 30);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const decodedToken = jwtDecode(token);
    return new Date(decodedToken.exp * 1000);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getTimeUntilExpiration = (token) => {
  if (!token) return 0;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return Math.max(0, decodedToken.exp - currentTime);
  } catch (error) {
    return 0;
  }
};

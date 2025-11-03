// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiresIn, setTokenExpiresIn] = useState(0);

  // **JWT token parsing function**
  const parseJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      return null;
    }
  };

  // **NEW: Check for OAuth2 redirect on app load**
  useEffect(() => {
    const checkOAuth2Token = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      if (tokenFromUrl) {
        console.log('🔑 OAuth2 token received from URL');
        handleOAuth2Success(tokenFromUrl);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      }
      return false;
    };

    // Check OAuth2 first, then check stored token
    if (!checkOAuth2Token()) {
      const token = localStorage.getItem('jwt_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        const decoded = parseJWT(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
          setTokenExpiresIn(decoded.exp - Math.floor(Date.now() / 1000));
        } else {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // **NEW: Handle OAuth2 success**
  const handleOAuth2Success = (token) => {
    try {
      const decoded = parseJWT(token);
      
      if (!decoded) {
        console.error('Failed to parse OAuth2 JWT token');
        return false;
      }

      localStorage.setItem('jwt_token', token);
      
      // For OAuth2, user info might be different
      const userObj = {
        id: decoded.sub,
        username: decoded.sub,
        email: decoded.email || '',
        name: decoded.name || decoded.sub,
        authProvider: 'GOOGLE' // Mark as OAuth2 user
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      setTokenExpiresIn(decoded.exp - Math.floor(Date.now() / 1000));
      
      console.log('✅ OAuth2 login successful:', userObj);
      return true;
    } catch (error) {
      console.error('OAuth2 token handling error:', error);
      return false;
    }
  };

  useEffect(() => {
    if (tokenExpiresIn <= 0) return;
    
    const timer = setInterval(() => {
      setTokenExpiresIn(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenExpiresIn]);

  // **Traditional login method (unchanged)**
  const login = async (username, password) => {
    try {
      localStorage.clear();
      
      const response = await api.post('/login', {
        username: username.trim(),
        password: password
      });

      const token = response.data;
      const decoded = parseJWT(token);
      
      if (!decoded) {
        console.error('Failed to parse JWT token');
        return false;
      }

      localStorage.setItem('jwt_token', token);
      
      const userObj = {
        id: decoded.sub,
        username: decoded.sub,
        email: '',
        authProvider: 'LOCAL' // Mark as traditional login
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      setTokenExpiresIn(decoded.exp - Math.floor(Date.now() / 1000));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/register', {
        username: username.trim(),
        email: email.trim(),
        password: password
      });

      return await login(username, password);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenExpiresIn(0);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    tokenExpiresIn,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

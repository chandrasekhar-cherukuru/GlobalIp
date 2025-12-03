// src/components/Auth/OAuth2Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 error:', error);
      toast.error('Google login failed. Please try again.');
      navigate('/', { replace: true });
    } else if (token) {
      console.log('✅ OAuth2 token received, processing...');
      
      // Store the token and user info
      localStorage.setItem('jwt_token', token);
      
      // Parse JWT to get user info
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        
        const userObj = {
          id: decoded.sub,
          username: decoded.sub,
          email: decoded.email || '',
          name: decoded.name || decoded.sub,
          authProvider: 'GOOGLE'
        };
        
        localStorage.setItem('user', JSON.stringify(userObj));
        
        toast.success('Google login successful!');
        navigate('/dashboard', { replace: true });
        
      } catch (parseError) {
        console.error('Token parsing error:', parseError);
        toast.error('Authentication failed. Please try again.');
        navigate('/', { replace: true });
      }
    } else {
      console.log('⚠️ No token or error received, redirecting to login...');
      navigate('/', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Gift className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Processing Google Login...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your authentication.
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default OAuth2Callback;

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check both query params and hash fragment
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    
    // Try multiple possible parameter names from query string
    let token = searchParams.get('token') || 
                searchParams.get('accessToken') || 
                searchParams.get('access_token') ||
                searchParams.get('jwt');
    
    // If not in query params, check hash fragment
    if (!token) {
      token = hashParams.get('token') || 
              hashParams.get('accessToken') || 
              hashParams.get('access_token') ||
              hashParams.get('jwt');
    }
    
    const error = searchParams.get('error') || hashParams.get('error');

    console.log('OAuth2 Redirect - Full URL:', window.location.href);
    console.log('OAuth2 Redirect - Hash:', window.location.hash);
    console.log('OAuth2 Redirect - Token:', token);
    console.log('OAuth2 Redirect - Error:', error);
    console.log('OAuth2 Redirect - Query params:', Object.fromEntries(searchParams));
    console.log('OAuth2 Redirect - Hash params:', Object.fromEntries(hashParams));

    if (token) {
      // Token received from backend OAuth2 redirect
      console.log('Token received:', token);
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('loggedIn', 'true');

      try {
        // Decode JWT to extract user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded JWT payload:', payload);
        
        // Extract user info from JWT payload
        // JWT typically has: sub (email), role, exp, iat
        const email = payload.sub || payload.email;
        const role = payload.role || 'USER';
        const username = payload.username || email.split('@')[0];
        
        console.log('Extracted user info:', { username, email, role });
        
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify({ username, email, role }));

        // Navigate based on role
        console.log('Navigating to dashboard for role:', role);
        if (role === 'ADMIN') {
          navigate('/admindashboard');
        } else if (role === 'ANALYST') {
          navigate('/analystdashboard');
        } else {
          navigate('/userdashboard');
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
        alert('Login successful but failed to process token. Please try again.');
        navigate('/');
      }
    } else if (error) {
      console.error('OAuth2 error received:', error);
      alert(`OAuth2 login failed: ${error}`);
      navigate('/');
    } else {
      console.log('No token or error found, redirecting to home');
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-700 font-semibold">Completing login...</p>
      </div>
    </div>
  );
}

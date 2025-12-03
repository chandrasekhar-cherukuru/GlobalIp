// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Gift, Calendar, Heart, LogOut, User } from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Icons array with their components and labels
  const icons = [
    { 
      component: <Gift className="h-6 w-6" />, 
      label: 'NexFund',
      subtitle: 'Gift Pooling'
    },
    { 
      component: <Calendar className="h-6 w-6" />, 
      label: 'NexFund',
      subtitle: 'Events'
    },
    { 
      component: <Heart className="h-6 w-6" />, 
      label: 'NexFund',
      subtitle: 'Donations'
    }
  ];

  // Rotate icons every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [icons.length]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getAuthProviderBadge = () => {
    if (!user?.authProvider) return null;
    
    if (user.authProvider === 'GOOGLE') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 ml-2">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </span>
      );
    } else if (user.authProvider === 'LOCAL') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 ml-2">
          <User className="w-3 h-3 mr-1" />
          Local
        </span>
      );
    }
    
    return null;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Rotating Icons */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 group"
            title={`NexFund - ${icons[currentIconIndex].subtitle}`}
          >
            <div className="transition-all duration-300 ease-in-out transform group-hover:scale-110">
              {icons[currentIconIndex].component}
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">{icons[currentIconIndex].label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-tight">
                {icons[currentIconIndex].subtitle}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/create" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Create Event
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Welcome, {user.name || user.username}!
                      {getAuthProviderBadge()}
                    </span>
                    {user.email && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

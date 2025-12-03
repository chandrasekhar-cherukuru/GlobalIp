import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const TokenExpirationWarning = () => {
  const { tokenExpiresIn, logout, isAuthenticated } = useAuth();
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || tokenExpiresIn <= 0) return;

    // Show warning when 5 minutes (300 seconds) left
    if (tokenExpiresIn <= 300 && tokenExpiresIn > 60 && !warningShown) {
      setWarningShown(true);
      toast((t) => (
        <div className="text-center">
          <p className="font-semibold text-orange-600">Session Expiring Soon</p>
          <p className="text-sm text-gray-600">
            Your session will expire in {Math.ceil(tokenExpiresIn / 60)} minutes
          </p>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => {
                window.location.reload(); // Simple way to extend session
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Extend Session
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    }

    // Auto logout when token expires
    if (tokenExpiresIn <= 0) {
      logout();
    }
  }, [tokenExpiresIn, isAuthenticated, warningShown, logout]);

  return null; // This component doesn't render anything visible
};

export default TokenExpirationWarning;

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, User, IndianRupee, Hash } from 'lucide-react';

const ThankYou = () => {
  const location = useLocation();
  const { 
    message, 
    participantName, 
    amount, 
    utrNumber 
  } = location.state || { 
    message: 'Thank you for your contribution!', 
    participantName: '',
    amount: '',
    utrNumber: ''
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          
          {/* Success Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-ping opacity-75"></div>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Thank You!
          </h1>
          
          {/* Success Message */}
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <p className="text-lg text-green-800 dark:text-green-300 font-semibold mb-2">
              Payment Successfully Submitted!
            </p>
            <p className="text-green-700 dark:text-green-200">
              {message}
            </p>
          </div>

          {/* Payment Details (if available) */}
          {(participantName || amount || utrNumber) && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
              <h3 className="text-gray-800 dark:text-gray-200 font-bold mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                {participantName && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{participantName}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">₹{amount}</span>
                  </div>
                )}
                {utrNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">UTR:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-mono text-xs">{utrNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>

          {/* Support Note */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Having issues? Contact support or the event creator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

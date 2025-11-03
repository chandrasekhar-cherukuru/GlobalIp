import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Gift, ArrowLeft, IndianRupee, Check, X, Clock } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import toast from 'react-hot-toast';

const VerifyGift = () => {
  const { user } = useAuth();
  const { payments, getUserFundraisers } = useData();
  const [verificationStatus, setVerificationStatus] = useState({});

  // Get user's gifts
  const userGifts = user ? getUserFundraisers(user.username).filter(f => f.type === 'gift') : [];

  // Get all payments for user's gifts
  const giftPayments = payments.filter(payment => 
    userGifts.some(gift => gift.id === payment.fundraiserId)
  );

  const handleVerifyPayment = (paymentId) => {
    setVerificationStatus(prev => ({ ...prev, [paymentId]: 'verified' }));
    toast.success('Gift contribution verified! Thank you message sent to contributor.');
  };

  const handleRejectPayment = (paymentId) => {
    setVerificationStatus(prev => ({ ...prev, [paymentId]: 'rejected' }));
    toast.error('Gift contribution rejected.');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/verify-participants"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Verify Participants</span>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Gift className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gift Pool Contributors Verification</h1>
          </div>
          <p className="text-gray-600">Verify gift contributions and acknowledge contributors</p>
        </div>

        {giftPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No Gift Contributors Yet</h3>
            <p className="text-gray-400">When people contribute to your gift pools, they will appear here for verification.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contributor Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gift Pool
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {giftPayments.map((payment) => {
                    const gift = userGifts.find(g => g.id === payment.fundraiserId);
                    const status = verificationStatus[payment.id] || 'pending';
                    
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.payerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{gift?.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">{payment.amount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status === 'pending' ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="inline-flex items-center p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                title="Verify Gift Contribution"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment.id)}
                                className="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                title="Reject Gift Contribution"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>Processed</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyGift;

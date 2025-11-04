import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Share2, Copy, IndianRupee, Users, Calendar, Heart, Gift, X, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../../services/api.js';

const LinkPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getFundraiser } = useData();
  
  const [amount, setAmount] = useState('');
  const [payerName, setPayerName] = useState('');
  const [email, setEmail] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiLink, setUpiLink] = useState('');
  
  const fundraiser = getFundraiser(id);
  const isCreated = searchParams.get('created') === 'true';

  useEffect(() => {
    if (isCreated) {
      toast.success('Fundraiser created! Share this link with others.');
    }
  }, [isCreated]);

  useEffect(() => {
    if (fundraiser && fundraiser.isFixedAmount) {
      setAmount(fundraiser.amount.toString());
    }
  }, [fundraiser]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/');
    }
  }, [navigate]);

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fundraiser Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The fundraiser may not be loaded yet or doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/link/${fundraiser.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const validateUpiId = (upiId) => {
    if (!upiId || typeof upiId !== 'string' || !upiId.trim()) {
      return { valid: false, message: 'UPI ID is missing' };
    }
    
    if (!upiId.includes('@')) {
      return { valid: false, message: 'UPI ID must contain @ symbol' };
    }
    
    return { valid: true, message: 'Valid UPI ID' };
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setAmount('');
      return;
    }
    
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    
    if (value.split('.').length > 2) {
      return;
    }
    
    if (value.includes('.')) {
      const [integer, decimal] = value.split('.');
      if (decimal && decimal.length > 2) {
        return;
      }
    }
    
    setAmount(value);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    
    if (!payerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (fundraiser.type === 'event' && !email.trim()) {
      toast.error('Please enter your email for event confirmation');
      return;
    }

    if (!amount || amount.trim() === '') {
      toast.error('Please enter an amount');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    const roundedAmount = Math.round(numericAmount * 100) / 100;

    const upiValidation = validateUpiId(fundraiser.upiId);
    if (!upiValidation.valid) {
      toast.error(`Payment Error: ${upiValidation.message}`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('🚀 Calling Backend QR APIs');
      
      let response;
      let exactUrl = '';
      
      if (fundraiser.backendTable === 'events') {
        if (fundraiser.isFixedAmount && roundedAmount === fundraiser.amount) {
          exactUrl = `http://localhost:8080/api/upi/event/${fundraiser.id}/qr`;
          response = await api.generateEventQRCode(fundraiser.id);
        } else {
          exactUrl = `http://localhost:8080/api/upi/event/${fundraiser.id}/qr/amount/${Math.round(roundedAmount)}`;
          response = await api.generateEventQRCodeWithAmount(fundraiser.id, Math.round(roundedAmount));
        }
      } else {
        exactUrl = `http://localhost:8080/api/upi/gift/${fundraiser.id}/qr`;
        response = await api.generateGiftQRCode(fundraiser.id);
      }

      const responseData = response.data;
      let hasValidData = false;
      
      if (typeof responseData === 'string' && responseData.startsWith('upi://pay')) {
        setUpiLink(responseData);
        hasValidData = true;
      }
      else if (typeof responseData === 'object' && responseData !== null) {
        const upiUrl = responseData.upiUrl || responseData.upiLink || responseData.upi;
        if (upiUrl && upiUrl.startsWith('upi://pay')) {
          setUpiLink(upiUrl);
          hasValidData = true;
        }
        
        const qrBase64 = responseData.qrCodeBase64 || responseData.qrCode || responseData.qrImageBase64 || responseData.base64Image;
        if (qrBase64) {
          const qrDataUrl = qrBase64.startsWith('data:image/') ? qrBase64 : `data:image/png;base64,${qrBase64}`;
          setQrCodeUrl(qrDataUrl);
          hasValidData = true;
        }
      }
      else if (typeof responseData === 'string' && (responseData.startsWith('data:image/') || responseData.length > 1000)) {
        const qrDataUrl = responseData.startsWith('data:image/') ? responseData : `data:image/png;base64,${responseData}`;
        setQrCodeUrl(qrDataUrl);
        hasValidData = true;
      }
      
      if (!hasValidData) {
        throw new Error(`Invalid response from ${exactUrl}`);
      }
      
      setShowPaymentModal(true);
      
      if (qrCodeUrl && upiLink) {
        toast.success('🎉 Backend QR & UPI generated successfully!');
      } else if (upiLink) {
        toast.success('✅ UPI Link generated successfully!');
      } else if (qrCodeUrl) {
        toast.success('📱 QR Code generated successfully!');
      }
      
    } catch (error) {
      console.error('❌ Backend call failed:', error);
      
      let errorMessage = 'Backend QR generation failed';
      
      if (error.response?.status === 403) {
        errorMessage = 'Access denied - Check SecurityConfig allows /api/upi/**';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed - JWT token issue';
      } else if (error.response?.status === 404) {
        errorMessage = 'QR endpoint not found - Backend URL issue';
      } else if (error.response?.data) {
        errorMessage = `Backend error: ${error.response.data}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiPayment = () => {
    if (!upiLink) {
      toast.error('UPI link not available. Please generate payment first.');
      return;
    }
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      navigator.clipboard.writeText(upiLink).then(() => {
        toast.success('UPI link copied! Open on mobile device.');
      });
      return;
    }

    try {
      window.location.href = upiLink;
      setTimeout(() => {
        toast.success('UPI app should open now.');
      }, 1000);
    } catch (error) {
      toast.error('Could not open UPI app. Please scan QR code.');
    }
  };

  const validateUTR = (str) => /^\d{12}$/.test(str);

  // 🚨 **FIXED**: Added backend API call to update creator dashboard
  const handleConfirmPayment = async () => {
    if (!payerName.trim() || !utrNumber.trim()) {
      toast.error('Please enter your name and UTR number');
      return;
    }

    if (!validateUTR(utrNumber.trim())) {
      toast.error('UTR number must be exactly 12 digits');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 🚨 **BACKEND API CALL** - This updates the creator's dashboard
      const participantData = {
        fundraiserId: fundraiser.id,
        participantName: payerName.trim(),
        utrNumber: utrNumber.trim(),
        amount: parseFloat(amount),
        email: email.trim() || null,
        fundraiserType: fundraiser.type,
        fundraiserTitle: fundraiser.title
      };

      console.log('🔄 Verifying participant:', participantData);

      // Call backend to save participant data
      const verifyResponse = await api.verifyParticipant(participantData);
      console.log('✅ Participant verified:', verifyResponse.data);

      // Create success message
      const message = fundraiser.type === 'event' 
        ? 'Thank you for your payment! You have been successfully verified. The creator will be notified.'
        : 'Thank you for your contribution! You have been successfully verified.';

      // Reset form
      setPayerName('');
      setUtrNumber('');
      setEmail('');
      setAmount(fundraiser.isFixedAmount ? fundraiser.amount.toString() : '');
      setShowPaymentModal(false);
      setQrCodeUrl('');
      setUpiLink('');

      // Show success message
      toast.success('Payment verification submitted successfully!');

      // Navigate to ThankYou page
      navigate('/thankyou', { 
        state: { 
          message: message,
          participantName: payerName,
          amount: amount,
          utrNumber: utrNumber
        } 
      });

    } catch (error) {
      console.error('❌ Participant verification failed:', error);
      
      // Handle specific errors
      let errorMessage = 'Failed to verify participant. Please try again.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          if (error.response.data.includes('UTR number already exists')) {
            errorMessage = 'This UTR number has already been used for this fundraiser. Please check your transaction.';
          } else if (error.response.data.includes('Missing required fields')) {
            errorMessage = 'Please fill in all required fields.';
          } else {
            errorMessage = error.response.data;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.clear();
        navigate('/');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please login again.';
        localStorage.clear();
        navigate('/');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case 'donation':
        return <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />;
      case 'gift':
        return <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <Gift className="h-6 w-6 text-gray-600 dark:text-gray-400" />;
    }
  };

  const upiValidation = validateUpiId(fundraiser.upiId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        
        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs">
            <p className="text-yellow-800 dark:text-yellow-300 mb-2 font-bold">🎯 CALLING YOUR EXACT BACKEND URLS!</p>
            <p className="text-yellow-700 dark:text-yellow-200"><strong>🆔 Fundraiser ID:</strong> {fundraiser.id}</p>
            <p className="text-yellow-700 dark:text-yellow-200"><strong>📂 Type:</strong> {fundraiser.type} | <strong>🗄️ Backend:</strong> {fundraiser.backendTable}</p>
            <p className="text-yellow-700 dark:text-yellow-200"><strong>🔗 EXACT URL:</strong> {
              fundraiser.backendTable === 'events' 
                ? `http://localhost:8080/api/upi/event/${fundraiser.id}/qr` 
                : `http://localhost:8080/api/upi/gift/${fundraiser.id}/qr`
            }</p>
            <p className="text-green-700 dark:text-green-300 font-bold">✅ Same format as your working Postman requests!</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            {getTypeIcon(fundraiser.type)}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{fundraiser.type}</h1>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
          {fundraiser.imageUrl && (
            <div className="aspect-video bg-gray-100 dark:bg-gray-700">
              <img
                src={fundraiser.imageUrl}
                alt={fundraiser.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{fundraiser.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{fundraiser.description}</p>

            {/* Creator Information */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Creator Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Creator:</span>
                  <span className="text-blue-900 dark:text-blue-200 font-semibold">{fundraiser.createdBy}</span>
                </div>
                {upiValidation.valid && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">UPI ID:</span>
                    <span className="font-mono text-blue-900 dark:text-blue-200 text-sm">{fundraiser.upiId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Message */}
            {fundraiser.paymentMessage && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Message:</h3>
                <p className="text-blue-700 dark:text-blue-200">{fundraiser.paymentMessage}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-300 font-medium">Collected</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                  ₹{fundraiser.collected.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-800 dark:text-blue-300 font-medium">Contributors</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {fundraiser.participants}
                </div>
              </div>
            </div>

            {/* UPI Warning */}
            {!upiValidation.valid && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">❌ Payment Issue:</h3>
                <p className="text-red-700 dark:text-red-200">{upiValidation.message}</p>
              </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handlePayNow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>

              {fundraiser.type === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email * (for event confirmation)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount to Pay *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 text-lg font-medium">₹</span>
                  <input
                    type="text"
                    required
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={fundraiser.isFixedAmount || isSubmitting}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      fundraiser.isFixedAmount ? 'bg-gray-50 dark:bg-gray-600' : ''
                    }`}
                    placeholder="Enter amount (e.g., 50, 100.50)"
                    inputMode="decimal"
                  />
                </div>
                {fundraiser.isFixedAmount ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fixed amount for this event</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter any amount you wish to contribute</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !upiValidation.valid}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                  upiValidation.valid 
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white' 
                    : 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Calling Backend...</span>
                  </>
                ) : (
                  <span>{upiValidation.valid ? '🎯 Call Backend QR API' : 'Creator needs to add UPI ID'}</span>
                )}
              </button>
            </form>

            {/* UTR Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">After Payment Confirmation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment UTR Number *</label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter 12-digit UTR number"
                    maxLength="12"
                    disabled={isSubmitting}
                  />
                </div>
                {/* 🚨 **UPDATED BUTTON**: Now with loading state and backend API call */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={!utrNumber || !payerName || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Confirm Payment & Verify</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Share this fundraiser</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">🎯 Backend Success!</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 text-center bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
              
              {/* Payment Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">₹{amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payer:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{payerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creator:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-300">{fundraiser.createdBy}</span>
                  </div>
                </div>
              </div>

              {/* BACKEND QR CODE */}
              {qrCodeUrl && (
                <div className="mb-8">
                  <div className="mx-auto inline-block p-6 border-4 border-green-500 dark:border-green-400 rounded-xl bg-green-50 dark:bg-green-900/30">
                    <div className="bg-white dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                      <img 
                        src={qrCodeUrl} 
                        alt="Backend Generated QR Code" 
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">📱 Scan with any UPI app</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-bold">
                        ✅ Generated by YOUR Backend API
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300 text-center font-bold">
                  🎯 Successfully called your backend QR APIs!
                </p>
              </div>

              {/* Pay Buttons */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={handleUpiPayment}
                  disabled={!upiLink}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 dark:from-orange-500 dark:to-red-500 dark:hover:from-orange-600 dark:hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-3 text-lg"
                >
                  <Smartphone className="h-6 w-6" />
                  <span>💳 Pay Now via UPI App</span>
                </button>
                
                {upiLink && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(upiLink);
                      toast.success('UPI link copied!');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="h-5 w-5" />
                    <span>📋 Copy UPI Link</span>
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 text-left">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-center">Payment Instructions:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>• Tap "Pay Now" to open your UPI app</li>
                  <li>• Or scan the QR code with your UPI scanner</li>
                  <li>• Complete payment in your UPI app</li>
                  <li>• Return here and enter UTR number</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkPage;

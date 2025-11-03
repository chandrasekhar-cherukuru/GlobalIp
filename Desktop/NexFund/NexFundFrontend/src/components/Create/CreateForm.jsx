import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, Heart, Gift, Upload, CreditCard, MessageSquare } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import toast from 'react-hot-toast';

const CreateForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createFundraiser } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: searchParams.get('type') || 'event',
    amount: '',
    isFixedAmount: true,
    upiId: '',
    paymentMessage: '',
    imageUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setFormData(prev => ({
        ...prev,
        type,
        isFixedAmount: type === 'event'
      }));
    }
  }, [searchParams]);

  const getTypeConfig = (type) => {
    switch (type) {
      case 'event':
        return {
          icon: <Calendar className="h-6 w-6" />,
          title: 'Create Event',
          color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
          description: 'Fixed amount collection for specific events'
        };
      case 'donation':
        return {
          icon: <Heart className="h-6 w-6" />,
          title: 'Create Donation',
          color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
          description: 'Accept any amount for charitable causes'
        };
      case 'gift':
        return {
          icon: <Gift className="h-6 w-6" />,
          title: 'Create Gift Pool',
          color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
          description: 'Pool money together for group gifts'
        };
      default:
        return {
          icon: <Gift className="h-6 w-6" />,
          title: 'Create Fundraiser',
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700',
          description: 'Create your fundraiser'
        };
    }
  };

  const typeConfig = getTypeConfig(formData.type);

  const validateUpiId = (upiId) => {
    if (!upiId || !upiId.trim()) {
      return { valid: false, message: 'UPI ID is required' };
    }
    
    const trimmedUpiId = upiId.trim();
    
    if (!trimmedUpiId.includes('@')) {
      return { valid: false, message: 'UPI ID must contain @ symbol (e.g., user@paytm)' };
    }
    
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiRegex.test(trimmedUpiId)) {
      return { valid: false, message: 'Invalid UPI ID format' };
    }
    
    return { valid: true, message: 'Valid UPI ID' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 Form Data:', formData);
    console.log('👤 Current User:', user);
    console.log('🔑 JWT Token exists:', !!localStorage.getItem('jwt_token'));
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      console.error('❌ Validation failed: Title is empty');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      console.error('❌ Validation failed: Description is empty');
      return;
    }

    const upiValidation = validateUpiId(formData.upiId);
    if (!upiValidation.valid) {
      toast.error(upiValidation.message);
      console.error('❌ Validation failed: UPI ID invalid -', upiValidation.message);
      return;
    }

    if (formData.isFixedAmount && (!formData.amount || parseFloat(formData.amount) <= 0)) {
      toast.error('Please enter a valid amount');
      console.error('❌ Validation failed: Amount is invalid -', formData.amount);
      return;
    }

    if (!user) {
      toast.error('Please log in to create a fundraiser');
      console.error('❌ Validation failed: User not logged in');
      return;
    }

    setIsSubmitting(true);

    const fundraiserData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      amount: formData.isFixedAmount ? parseFloat(formData.amount) : 0,
      isFixedAmount: formData.isFixedAmount,
      upiId: formData.upiId.trim(),
      paymentMessage: formData.paymentMessage.trim() || `Payment for ${formData.title.trim()}`,
      imageUrl: formData.imageUrl,
      createdBy: user.username,
      collected: 0,
      participants: 0
    };

    console.log('🚀 Creating fundraiser with processed data:', fundraiserData);

    try {
      const id = await createFundraiser(fundraiserData);
      
      console.log('✅ Fundraiser created successfully with ID:', id);
      toast.success('Fundraiser created successfully!');
      
      setTimeout(() => {
        navigate(`/link/${id}?created=true`);
      }, 500);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      let errorMessage = 'Failed to create fundraiser. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Authentication required')) {
          errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('Validation error')) {
          errorMessage = error.message;
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again in a few moments.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      
      if (error.message && error.message.includes('Authentication')) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/'), 2000);
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📷 Image upload started:', file.name, 'Size:', file.size, 'Type:', file.type);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only image files (JPEG, PNG, GIF, WebP)');
      console.error('❌ Invalid file type:', file.type);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      console.error('❌ File too large:', file.size);
      return;
    }

    setIsImageUploading(true);

    try {
      const base64Image = await convertToBase64(file);
      
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: base64Image 
      }));
      
      console.log('✅ Image uploaded successfully:', file.name);
      toast.success(`Image "${file.name}" uploaded successfully!`);
    } catch (error) {
      console.error('❌ Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    console.log('🗑️ Image removed');
    toast.success('Image removed');
  };

  const upiValidation = validateUpiId(formData.upiId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Development Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-xs">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">🔧 Development Debug Info:</h4>
            <div className="space-y-1 text-blue-800 dark:text-blue-200">
              <p><strong>User:</strong> {user?.username || 'Not logged in'}</p>
              <p><strong>JWT Token:</strong> {localStorage.getItem('jwt_token') ? 'Present ✅' : 'Missing ❌'}</p>
              <p><strong>Form Type:</strong> {formData.type}</p>
              <p><strong>UPI Validation:</strong> {upiValidation.valid ? '✅ Valid' : '❌ ' + upiValidation.message}</p>
              <p><strong>Backend API:</strong> http://localhost:8080</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                {typeConfig.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{typeConfig.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{typeConfig.description}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['event', 'donation', 'gift'].map((type) => {
                const config = getTypeConfig(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      type: type,
                      isFixedAmount: type === 'event'
                    }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === type
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className={`p-2 rounded-lg mx-auto mb-2 w-fit ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="text-sm font-medium capitalize text-gray-900 dark:text-white">{type}</div>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter a catchy title for your fundraiser"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Describe what this fundraiser is for..."
                disabled={isSubmitting}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom Image Upload
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800">
                <div className="space-y-1 text-center">
                  {formData.imageUrl ? (
                    <div className="space-y-3">
                      <img
                        src={formData.imageUrl}
                        alt="Uploaded preview"
                        className="mx-auto h-40 w-auto rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex justify-center space-x-2">
                        <label
                          htmlFor="file-upload-replace"
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                        >
                          Replace Image
                          <input
                            id="file-upload-replace"
                            name="file-upload-replace"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isSubmitting || isImageUploading}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isImageUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploading image...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                            >
                              <span>Upload your custom image</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageUpload}
                                disabled={isSubmitting || isImageUploading}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, GIF, WebP up to 5MB</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Amount - Only for Events */}
            {formData.type === 'event' && (
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fixed Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 dark:text-gray-500 font-medium text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    required
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {/* UPI ID Field with Real-time Validation */}
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enter your UPI ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="upiId"
                  required
                  value={formData.upiId}
                  onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    formData.upiId && !upiValidation.valid 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                      : formData.upiId && upiValidation.valid
                        ? 'border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  placeholder="example@paytm, example@phonepe, example@upi"
                  disabled={isSubmitting}
                />
                {formData.upiId && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {upiValidation.valid ? (
                      <span className="text-green-500 dark:text-green-400 text-sm">✓</span>
                    ) : (
                      <span className="text-red-500 dark:text-red-400 text-sm">✗</span>
                    )}
                  </div>
                )}
              </div>
              <p className={`mt-1 text-sm ${
                formData.upiId && !upiValidation.valid ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formData.upiId && !upiValidation.valid 
                  ? upiValidation.message 
                  : 'Enter your UPI ID for receiving payments (e.g., yourname@paytm)'
                }
              </p>
            </div>

            {/* Payment Message */}
            <div>
              <label htmlFor="paymentMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Message
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <textarea
                  id="paymentMessage"
                  rows={3}
                  value={formData.paymentMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMessage: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Optional message that will be displayed to contributors during payment"
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This message will be shown to people when they make a payment</p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isImageUploading || (formData.upiId && !upiValidation.valid)}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Generate Link'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;

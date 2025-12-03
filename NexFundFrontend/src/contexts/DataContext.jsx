import React, { createContext, useContext, useState, useEffect } from 'react';
import * as apiService from '../services/api';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [fundraisers, setFundraisers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFundraisers();
    
    const storedPayments = localStorage.getItem('payments');
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments);
      setPayments(parsedPayments);
      updateFundraiserStats(parsedPayments);
    }
  }, []);

  const updateFundraiserStats = (paymentsData) => {
    setFundraisers(prev => prev.map(fundraiser => {
      const fundraiserPayments = paymentsData.filter(p => p.fundraiserId === fundraiser.id);
      const collected = fundraiserPayments.reduce((sum, p) => sum + p.amount, 0);
      const participants = fundraiserPayments.length;
      
      return {
        ...fundraiser,
        collected,
        participants
      };
    }));
  };

  const loadFundraisers = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading all fundraisers from backend...');
      
      const [eventsResponse, giftsResponse] = await Promise.allSettled([
        apiService.getAllEvents(),
        apiService.getAllGifts()
      ]);

      const allFundraisers = [];

      // Load Events
      if (eventsResponse.status === 'fulfilled') {
        const events = eventsResponse.value.data.map(item => ({
          id: item.id,
          title: item.eventTitle,
          description: item.eventDescription,
          type: 'event',
          amount: item.eventAmount,
          isFixedAmount: true,
          upiId: item.upiId,
          paymentMessage: item.upiMsg,
          imageUrl: item.imageDataUrl || '',
          createdBy: item.createdByUsername,
          collected: 0,
          participants: item.participants?.length || 0,
          createdAt: new Date().toISOString(),
          backendTable: 'events'
        }));
        allFundraisers.push(...events);
        console.log('✅ Loaded events:', events.length);
      }

      // Load Gifts (includes donations stored as gifts)
      if (giftsResponse.status === 'fulfilled') {
        const gifts = giftsResponse.value.data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'gift', // Default to gift, will be overridden if needed
          amount: 0,
          isFixedAmount: false,
          upiId: item.upiId,
          paymentMessage: item.upiMsg,
          imageUrl: item.imageDataUrl || '',
          createdBy: item.creatorUsername,
          collected: 0,
          participants: 0,
          createdAt: new Date().toISOString(),
          backendTable: 'gifts'
        }));
        allFundraisers.push(...gifts);
        console.log('✅ Loaded gifts:', gifts.length);
      }

      console.log('📊 Total fundraisers loaded:', allFundraisers.length);
      setFundraisers(allFundraisers);
      
    } catch (error) {
      console.error('❌ Error loading fundraisers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFundraiser = async (fundraiserData) => {
    try {
      console.log('🚀 Creating fundraiser:', fundraiserData);
      
      // Validation
      if (!fundraiserData.title?.trim()) {
        throw new Error('Title is required');
      }
      
      if (!fundraiserData.description?.trim()) {
        throw new Error('Description is required');
      }
      
      if (!fundraiserData.upiId?.trim()) {
        throw new Error('UPI ID is required');
      }
      
      if (!fundraiserData.createdBy?.trim()) {
        throw new Error('Creator username is required');
      }

      let response;
      let newFundraiser;
      
      if (fundraiserData.type === 'event') {
        if (!fundraiserData.amount || parseFloat(fundraiserData.amount) <= 0) {
          throw new Error('Event amount must be greater than 0');
        }
        
        console.log('📅 Creating EVENT in events table...');
        const backendData = {
          eventTitle: fundraiserData.title.trim(),
          eventDescription: fundraiserData.description.trim(),
          eventAmount: parseInt(fundraiserData.amount),
          upiId: fundraiserData.upiId.trim(),
          upiMsg: fundraiserData.paymentMessage.trim() || `Payment for ${fundraiserData.title}`,
          createdByUsername: fundraiserData.createdBy.trim(),
          imageDataUrl: fundraiserData.imageUrl || '',
          participants: []
        };
        
        response = await apiService.createEvent(backendData);
        newFundraiser = {
          id: response.data.id,
          title: response.data.eventTitle,
          description: response.data.eventDescription,
          type: 'event',
          amount: response.data.eventAmount,
          isFixedAmount: true,
          upiId: response.data.upiId,
          paymentMessage: response.data.upiMsg,
          imageUrl: response.data.imageDataUrl || '',
          createdBy: response.data.createdByUsername,
          collected: 0,
          participants: 0,
          createdAt: new Date().toISOString(),
          backendTable: 'events'
        };
        console.log('✅ Event created:', newFundraiser.id);
        
      } else {
        // Store ALL non-events (gifts AND donations) in gifts table
        console.log(`🎁 Creating ${fundraiserData.type.toUpperCase()} in gifts table...`);
        const backendData = {
          title: fundraiserData.title.trim(),
          description: fundraiserData.description.trim(),
          upiId: fundraiserData.upiId.trim(),
          upiMsg: fundraiserData.paymentMessage.trim() || `Payment for ${fundraiserData.title}`,
          creatorUsername: fundraiserData.createdBy.trim(),
          imageDataUrl: fundraiserData.imageUrl || '',
          amount: 0
        };
        
        response = await apiService.createGift(backendData);
        newFundraiser = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          type: fundraiserData.type, // Keep original type (gift or donation)
          amount: 0,
          isFixedAmount: false,
          upiId: response.data.upiId,
          paymentMessage: response.data.upiMsg,
          imageUrl: response.data.imageDataUrl || '',
          createdBy: response.data.creatorUsername,
          collected: 0,
          participants: 0,
          createdAt: new Date().toISOString(),
          backendTable: 'gifts' // Always stored in gifts table
        };
        console.log('✅ Gift/Donation created:', newFundraiser.id);
      }
      
      // Add to local state
      setFundraisers(prev => [...prev, newFundraiser]);
      
      console.log('✅ Fundraiser creation completed successfully');
      return newFundraiser.id;
      
    } catch (error) {
      console.error('❌ Error creating fundraiser:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        } else if (error.response.status === 403) {
          throw new Error('Access denied. Check your permissions.');
        } else if (error.response.status === 400) {
          const errorMsg = error.response.data?.error || error.response.data || 'Invalid data provided';
          throw new Error(`Validation error: ${errorMsg}`);
        } else if (error.response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          const errorMsg = error.response.data?.error || error.response.data || 'Unknown server error';
          throw new Error(`Server error: ${errorMsg}`);
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  };

  const deleteFundraiser = async (id, type) => {
    try {
      console.log(`🗑️ Deleting ${type} with ID:`, id);
      
      // Find the fundraiser to check which table it's in
      const fundraiser = fundraisers.find(f => f.id === id);
      const backendTable = fundraiser?.backendTable;
      
      if (backendTable === 'events' || type === 'event') {
        await apiService.deleteEvent(id);
      } else {
        // Everything else is in gifts table
        await apiService.deleteGift(id);
      }
      
      setFundraisers(prev => prev.filter(f => f.id !== id));
      console.log('✅ Fundraiser deleted successfully');
      
    } catch (error) {
      console.error('❌ Error deleting fundraiser:', error);
      throw error;
    }
  };

  const getFundraiser = (id) => {
    const fundraiser = fundraisers.find(f => f.id === id);
    if (fundraiser) {
      console.log('✅ Found fundraiser:', {
        id: fundraiser.id,
        title: fundraiser.title,
        type: fundraiser.type,
        backendTable: fundraiser.backendTable
      });
    } else {
      console.error('❌ Fundraiser not found in state:', id);
    }
    return fundraiser;
  };

  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    
    setFundraisers(prev => prev.map(fundraiser => {
      if (fundraiser.id === paymentData.fundraiserId) {
        return {
          ...fundraiser,
          collected: fundraiser.collected + paymentData.amount,
          participants: fundraiser.participants + 1
        };
      }
      return fundraiser;
    }));

    localStorage.setItem('payments', JSON.stringify(updatedPayments));
  };

  const getUserFundraisers = (userId) => {
    return fundraisers.filter(f => f.createdBy === userId);
  };

  const value = {
    fundraisers,
    payments,
    createFundraiser,
    deleteFundraiser,
    getFundraiser,
    addPayment,
    getUserFundraisers,
    loadFundraisers,
    isLoading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, Heart, Gift, Plus, Users, Trash2, Download, ExternalLink, IndianRupee, CheckCircle, RefreshCw } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import toast from 'react-hot-toast';
import * as api from '../../services/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserFundraisers, deleteFundraiser } = useData();
  
  const contextFundraisers = user ? getUserFundraisers(user.username) : [];
  const [userFundraisers, setUserFundraisers] = useState(contextFundraisers);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user && contextFundraisers.length > 0) {
      setUserFundraisers(contextFundraisers);
      enhanceFundraisersWithLiveData();
    }
  }, [user, contextFundraisers.length]);

  // **Calculate amount from FINALLY VERIFIED participants only**
  const enhanceFundraisersWithLiveData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    }

    try {
      console.log('🔄 Enhancing fundraisers with live data...');

      const enhancedFundraisers = await Promise.all(
        contextFundraisers.map(async (fundraiser) => {
          try {
            console.log(`📋 Getting participants for ${fundraiser.title} (${fundraiser.id})`);
            
            // Get all verified participants
            const participantsRes = await api.getParticipantsByFundraiser(fundraiser.id);
            const allParticipants = participantsRes.data || [];
            
            // **Get only FINALLY VERIFIED participants**
            const finallyVerifiedParticipants = [];
            let totalFinallyVerifiedAmount = 0;
            
            for (const participant of allParticipants) {
              try {
                // Check if this participant is finally verified
                const finalVerifyRes = await api.checkFinalVerification(participant.id);
                if (finalVerifyRes.data.isFinallyVerified) {
                  finallyVerifiedParticipants.push(participant);
                  totalFinallyVerifiedAmount += parseFloat(participant.amountPaid || 0);
                }
              } catch (error) {
                // Participant not finally verified - skip
              }
            }
            
            console.log(`✅ Found ${allParticipants.length} total participants, ${finallyVerifiedParticipants.length} finally verified, collected ₹${totalFinallyVerifiedAmount} for ${fundraiser.title}`);
            
            return {
              ...fundraiser,
              participants: allParticipants.length, // **Total participants who paid**
              finallyVerifiedCount: finallyVerifiedParticipants.length, // **Finally verified count**
              collected: totalFinallyVerifiedAmount, // **Amount from FINALLY VERIFIED only**
              liveDataLoaded: true
            };
          } catch (error) {
            console.warn(`⚠️ Could not get live data for ${fundraiser.title}:`, error.message);
            return {
              ...fundraiser,
              finallyVerifiedCount: 0,
              liveDataLoaded: false
            };
          }
        })
      );

      console.log('✅ Enhanced fundraisers:', enhancedFundraisers.length);
      setUserFundraisers(enhancedFundraisers);

      if (showRefreshIndicator) {
        toast.success('Dashboard refreshed with live data');
      }

    } catch (error) {
      console.error('❌ Failed to enhance fundraisers:', error);
      setUserFundraisers(contextFundraisers);
      
      if (showRefreshIndicator) {
        toast.error('Refresh failed, showing cached data');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    enhanceFundraisersWithLiveData(true);
  };

  const handleDelete = async (fundraiserId, title, type) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteFundraiser(fundraiserId, type);
        toast.success('Fundraiser deleted successfully');
        
        setUserFundraisers(prev => prev.filter(f => f.id !== fundraiserId));
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete fundraiser');
      }
    }
  };

  const handleDownloadReport = (fundraiser) => {
    const csvData = [
      ['Fundraiser Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Title', fundraiser.title],
      ['Type', fundraiser.type],
      ['Description', fundraiser.description],
      ['Target Amount', fundraiser.isFixedAmount ? `₹${fundraiser.amount}` : 'Any Amount'],
      ['Amount Collected (Finally Verified)', `₹${fundraiser.collected}`],
      ['Total Participants', fundraiser.participants.toString()],
      ['Finally Verified Participants', (fundraiser.finallyVerifiedCount || 0).toString()],
      ['Created Date', fundraiser.createdAt ? new Date(fundraiser.createdAt).toLocaleDateString() : 'N/A'],
      ['UPI ID', fundraiser.upiId || 'N/A'],
      ['Created By', fundraiser.createdBy],
      ['Data Source', fundraiser.liveDataLoaded ? 'Live Data' : 'Cached Data'],
      [''],
      ['Status', fundraiser.isFixedAmount && fundraiser.collected >= fundraiser.amount ? 'Target Reached' : 'Active']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fundraiser.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success('Report downloaded successfully');
  };

  const getVerifyLink = (fundraiserId) => {
    return `/verify-participants?fundraiserId=${fundraiserId}`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'donation':
        return <Heart className="h-5 w-5" />;
      case 'gift':
        return <Gift className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'event':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'donation':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'gift':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your events, donations, and gift pools
              {userFundraisers.some(f => f.liveDataLoaded) && (
                <span className="ml-2 text-green-600 dark:text-green-400 text-sm">• Live data loaded</span>
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
          </button>
        </div>

        {/* Create Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/create?type=event"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Event</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Fixed amount collection for specific events</p>
            <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
              <span className="text-blue-700 dark:text-blue-300 text-xs font-medium">Fixed Amount</span>
            </div>
          </Link>

          <Link
            to="/create?type=donation"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Donation</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Accept any amount for charitable causes</p>
            <div className="bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full inline-block">
              <span className="text-red-700 dark:text-red-300 text-xs font-medium">Any Amount</span>
            </div>
          </Link>

          <Link
            to="/create?type=gift"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Gift Pool</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Pool money together for group gifts</p>
            <div className="bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full inline-block">
              <span className="text-purple-700 dark:text-purple-300 text-xs font-medium">Any Amount</span>
            </div>
          </Link>
        </div>

        {/* Your Fundraisers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Fundraisers</h2>
          </div>
          
          {userFundraisers.length === 0 ? (
            <div className="p-8 text-center">
              <Gift className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No fundraisers yet</h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4">Create your first event, donation, or gift pool to get started</p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Now</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Verify Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {userFundraisers.map((fundraiser) => (
                    <tr key={fundraiser.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {fundraiser.title}
                            {fundraiser.liveDataLoaded && (
                              <span className="ml-2 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" title="Live data loaded"></span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{fundraiser.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(fundraiser.type)}`}>
                          {getTypeIcon(fundraiser.type)}
                          <span className="capitalize">{fundraiser.type}</span>
                        </span>
                      </td>
                      {/* Show only collected amount, no "/ ₹500" format */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {(fundraiser.collected || 0).toLocaleString()}
                          </span>
                        </div>
                        {/* Show verification status below amount */}
                        {fundraiser.liveDataLoaded && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {fundraiser.finallyVerifiedCount || 0} finally verified
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-900 dark:text-white font-medium">
                            {fundraiser.participants || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={getVerifyLink(fundraiser.id)}
                          className={`inline-flex items-center space-x-1 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors ${
                            (fundraiser.participants || 0) > 0 
                              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Verify ({fundraiser.participants || 0})</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/link/${fundraiser.id}`}
                            className="inline-flex items-center p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="View Fundraiser Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDownloadReport(fundraiser)}
                            className="inline-flex items-center p-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(fundraiser.id, fundraiser.title, fundraiser.type)}
                            className="inline-flex items-center p-1.5 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete Fundraiser"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

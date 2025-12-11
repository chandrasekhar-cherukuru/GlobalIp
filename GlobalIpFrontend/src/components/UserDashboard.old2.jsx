import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HiLightBulb, HiSearch, HiBell, HiChartBar, HiDocumentText, HiSave, HiX, HiEye, HiShare, HiBookmark } from 'react-icons/hi';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('patents');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock notifications
    setNotifications([
      { id: 1, type: 'alert', message: 'New patent filed in AI/ML category', time: '5 min ago', read: false },
      { id: 2, type: 'info', message: 'Your saved search "Blockchain Tech" has 12 new results', time: '1 hour ago', read: false },
      { id: 3, type: 'warning', message: 'Patent US20230001 expires in 30 days', time: '2 hours ago', read: true }
    ]);

    // Mock saved searches
    setSavedSearches([
      { id: 1, query: 'AI Machine Learning', type: 'patents', results: 234, lastRun: '2 hours ago' },
      { id: 2, query: 'Blockchain Technology', type: 'patents', results: 89, lastRun: '1 day ago' },
      { id: 3, query: 'Medical Devices', type: 'trademarks', results: 156, lastRun: '3 days ago' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Mock search results
    setSearchResults([
      {
        id: 'US20230001A1',
        title: 'Advanced Machine Learning System for Pattern Recognition',
        assignee: 'TechCorp Inc.',
        date: '2023-01-15',
        status: 'Granted',
        jurisdiction: 'US',
        type: searchType
      },
      {
        id: 'EP20230002B1',
        title: 'Neural Network Architecture for Real-Time Processing',
        assignee: 'InnovateLab',
        date: '2023-02-20',
        status: 'Published',
        jurisdiction: 'EP',
        type: searchType
      },
      {
        id: 'CN20230003A',
        title: 'Distributed Computing Framework with AI Integration',
        assignee: 'Future Systems',
        date: '2023-03-10',
        status: 'Pending',
        jurisdiction: 'CN',
        type: searchType
      }
    ]);
    setActiveTab('search');
  };

  // Mock data for charts
  const trendData = [
    { month: 'Jan', patents: 45, trademarks: 23 },
    { month: 'Feb', patents: 52, trademarks: 31 },
    { month: 'Mar', patents: 61, trademarks: 28 },
    { month: 'Apr', patents: 58, trademarks: 35 },
    { month: 'May', patents: 70, trademarks: 42 },
    { month: 'Jun', patents: 78, trademarks: 38 }
  ];

  const jurisdictionData = [
    { name: 'US', value: 340, color: '#F59E0B' },
    { name: 'EP', value: 180, color: '#FBBF24' },
    { name: 'CN', value: 240, color: '#FCD34D' },
    { name: 'JP', value: 120, color: '#FDE68A' },
    { name: 'Others', value: 90, color: '#FEF3C7' }
  ];

  const techDistribution = [
    { tech: 'AI/ML', count: 156 },
    { tech: 'Blockchain', count: 89 },
    { tech: 'IoT', count: 134 },
    { tech: 'Biotech', count: 67 },
    { tech: 'Clean Energy', count: 98 }
  ];

  const recentActivity = [
    { action: 'Search', detail: 'AI Machine Learning patents', time: '10 min ago' },
    { action: 'Save', detail: 'Patent US20230001A1', time: '1 hour ago' },
    { action: 'Alert', detail: 'New filing in Blockchain category', time: '2 hours ago' },
    { action: 'Export', detail: '25 patent records to PDF', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiLightBulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GlobalIP</h1>
                <p className="text-xs text-gray-500">User Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-primary-50/30' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 mt-2 rounded-full ${!notif.read ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'USER'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {
                { id: 'dashboard', label: 'Dashboard', icon: <HiChartBar className="text-lg" /> },
                { id: 'search', label: 'Search', icon: <HiSearch className="text-lg" /> },
                { id: 'saved', label: 'Saved Searches', icon: <HiSave className="text-lg" /> },
                { id: 'alerts', label: 'Alerts', icon: <HiBell className="text-lg" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Searches', value: '156', change: '+12%', icon: <HiSearch className="text-2xl text-white" />, color: 'from-blue-500 to-blue-600' },
                { label: 'Saved Patents', value: '43', change: '+8%', icon: <HiBookmark className="text-2xl text-white" />, color: 'from-primary-500 to-primary-600' },
                { label: 'Active Alerts', value: '8', change: '+2', icon: <HiBell className="text-2xl text-white" />, color: 'from-green-500 to-green-600' },
                { label: 'Reports', value: '12', change: '+3', icon: <HiDocumentText className="text-2xl text-white" />, color: 'from-purple-500 to-purple-600' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      {stat.icon}
                    </div>
                    <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Filing Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorPatents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTrademarks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="patents" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPatents)" />
                    <Area type="monotone" dataKey="trademarks" stroke="#10B981" fillOpacity={1} fill="url(#colorTrademarks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Jurisdiction Distribution */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Jurisdiction Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jurisdictionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jurisdictionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technology Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technology Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={techDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="tech" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">{activity.action.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.detail}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">IP Search</h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Search patents, trademarks, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                    />
                  </div>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  >
                    <option value="patents">Patents</option>
                    <option value="trademarks">Trademarks</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-primary-500 hover:bg-primary-50 transition-all"
                  >
                    Advanced Filters
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    Save Search
                  </button>
                </div>
              </form>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Search Results ({searchResults.length})
                  </h3>
                  <button className="px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    Export Results
                  </button>
                </div>

                <div className="space-y-4">
                  {searchResults.map(result => (
                    <div key={result.id} className="p-6 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                              {result.id}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              result.status === 'Granted' ? 'bg-green-100 text-green-700' :
                              result.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {result.status}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                              {result.jurisdiction}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{result.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">Assignee: {result.assignee}</p>
                          <p className="text-xs text-gray-500">Filed: {result.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Searches Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Searches</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSearches.map(search => (
                  <div key={search.id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <HiSearch className="w-6 h-6 text-primary-600" />
                      </div>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <HiX className="w-5 h-5 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{search.query}</h4>
                    <p className="text-sm text-gray-600 mb-3">Type: {search.type}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-600 font-semibold">{search.results} results</span>
                      <span className="text-gray-500">{search.lastRun}</span>
                    </div>
                    <button className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                      Run Search
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Alert Configuration</h3>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  + New Alert
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, type: 'New Filings', keyword: 'AI Machine Learning', frequency: 'Daily', active: true },
                  { id: 2, type: 'Status Changes', keyword: 'Blockchain Technology', frequency: 'Weekly', active: true },
                  { id: 3, type: 'Expiry Warnings', keyword: 'Medical Devices', frequency: 'Monthly', active: false }
                ].map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <HiBell className={`w-6 h-6 ${alert.active ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{alert.type}</h4>
                        <p className="text-sm text-gray-600">Keyword: {alert.keyword}</p>
                        <p className="text-xs text-gray-500">Frequency: {alert.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={alert.active} className="sr-only peer" readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

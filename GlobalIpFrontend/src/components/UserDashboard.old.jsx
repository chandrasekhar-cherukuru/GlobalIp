import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('patents');
  const [searchFilters, setSearchFilters] = useState({
    jurisdiction: '',
    technology: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Patent Filed', message: 'AI/ML patent in US jurisdiction', time: '2h ago', read: false },
    { id: 2, title: 'Subscription Expiring', message: 'Renew your subscription', time: '1d ago', read: false },
    { id: 3, title: 'Search Alert', message: '5 new results for your saved search', time: '3d ago', read: true }
  ]);

  // Mock data
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      number: 'US20230001A1',
      title: 'Advanced Machine Learning System for Pattern Recognition',
      assignee: 'TechCorp Inc.',
      filingDate: '2023-01-15',
      status: 'Published',
      jurisdiction: 'US',
      technology: 'AI/ML'
    },
    {
      id: 2,
      number: 'EP20230002B1',
      title: 'Blockchain-based Secure Transaction Protocol',
      assignee: 'CryptoSystems Ltd',
      filingDate: '2023-02-20',
      status: 'Granted',
      jurisdiction: 'EP',
      technology: 'Blockchain'
    },
    {
      id: 3,
      number: 'CN20230003A',
      title: 'IoT Network Management System',
      assignee: 'SmartDevices Co',
      filingDate: '2023-03-10',
      status: 'Pending',
      jurisdiction: 'CN',
      technology: 'IoT'
    }
  ]);

  const activityData = [
    { month: 'Jan', searches: 45, alerts: 12 },
    { month: 'Feb', searches: 52, alerts: 18 },
    { month: 'Mar', searches: 48, alerts: 15 },
    { month: 'Apr', searches: 61, alerts: 22 },
    { month: 'May', searches: 55, alerts: 19 },
    { month: 'Jun', searches: 67, alerts: 25 }
  ];

  const technologyData = [
    { name: 'AI/ML', value: 35, color: '#F59E0B' },
    { name: 'Blockchain', value: 25, color: '#FBBF24' },
    { name: 'IoT', value: 20, color: '#FCD34D' },
    { name: 'Biotech', value: 15, color: '#FDE68A' },
    { name: 'Other', value: 5, color: '#FEF3C7' }
  ];

  const jurisdictionData = [
    { name: 'US', count: 45 },
    { name: 'EP', count: 38 },
    { name: 'CN', count: 32 },
    { name: 'JP', count: 28 },
    { name: 'IN', count: 15 }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching:', { searchQuery, searchType, searchFilters });
    // API call would go here
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">GlobalIP</h1>
                  <p className="text-xs text-gray-600">User Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'search', label: 'IP Search', icon: '🔍' },
              { id: 'monitoring', label: 'Monitoring', icon: '📡' },
              { id: 'alerts', label: 'Alerts', icon: '🔔' },
              { id: 'saved', label: 'Saved Items', icon: '⭐' },
              { id: 'reports', label: 'Reports', icon: '📈' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className={`w-6 h-6 text-gray-600 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.username}!</h2>
              <p className="text-gray-600">Monitor and search global IP intelligence</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span>⚙️</span>
                        <span>Settings</span>
                      </div>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span>👤</span>
                        <span>Profile</span>
                      </div>
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span>🚪</span>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Searches', value: '328', change: '+12%', icon: '🔍', color: 'from-blue-500 to-blue-600' },
                  { label: 'Active Alerts', value: '15', change: '+3', icon: '🔔', color: 'from-green-500 to-green-600' },
                  { label: 'Saved Items', value: '42', change: '+8', icon: '⭐', color: 'from-primary-500 to-primary-600' },
                  { label: 'Reports Generated', value: '7', change: '+2', icon: '📊', color: 'from-purple-500 to-purple-600' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {stat.icon}
                      </div>
                      <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Search Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Area type="monotone" dataKey="searches" stroke="#F59E0B" fillOpacity={1} fill="url(#colorSearches)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Technology Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={technologyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {technologyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Searches</h3>
                <div className="space-y-3">
                  {searchResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-bold">{result.jurisdiction}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{result.title}</h4>
                          <p className="text-sm text-gray-600">{result.number} • {result.assignee}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.status === 'Granted' ? 'bg-green-100 text-green-700' :
                        result.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {result.status}
                      </span>
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
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced IP Search</h3>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Search Type */}
                  <div className="flex space-x-4">
                    {['patents', 'trademarks', 'both'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSearchType(type)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          searchType === type
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Main Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by keyword, patent number, assignee, or inventor..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-lg"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                      value={searchFilters.jurisdiction}
                      onChange={(e) => setSearchFilters({...searchFilters, jurisdiction: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 outline-none"
                    >
                      <option value="">All Jurisdictions</option>
                      <option value="US">United States</option>
                      <option value="EP">Europe</option>
                      <option value="CN">China</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                    </select>

                    <select
                      value={searchFilters.technology}
                      onChange={(e) => setSearchFilters({...searchFilters, technology: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 outline-none"
                    >
                      <option value="">All Technologies</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT">IoT</option>
                      <option value="Biotech">Biotech</option>
                      <option value="Energy">Energy</option>
                    </select>

                    <input
                      type="date"
                      value={searchFilters.dateFrom}
                      onChange={(e) => setSearchFilters({...searchFilters, dateFrom: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 outline-none"
                      placeholder="From Date"
                    />

                    <input
                      type="date"
                      value={searchFilters.dateTo}
                      onChange={(e) => setSearchFilters({...searchFilters, dateTo: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 outline-none"
                      placeholder="To Date"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    Search IP Database
                  </button>
                </form>
              </div>

              {/* Search Results */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Search Results ({searchResults.length})</h3>
                  <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold">
                    Export Results
                  </button>
                </div>

                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-6 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-semibold text-sm">
                              {result.number}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                              result.status === 'Granted' ? 'bg-green-100 text-green-700' :
                              result.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {result.status}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                              {result.technology}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{result.title}</h4>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>🏢 {result.assignee}</span>
                            <span>📅 Filed: {new Date(result.filingDate).toLocaleDateString()}</span>
                            <span>🌍 {result.jurisdiction}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Save">
                            ⭐
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Competitor Filings', count: 12, frequency: 'Weekly', status: 'Active' },
                    { name: 'Technology Trends', count: 8, frequency: 'Daily', status: 'Active' },
                    { name: 'Expiry Alerts', count: 5, frequency: 'Monthly', status: 'Active' }
                  ].map((monitor, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-primary-50 to-amber-50 rounded-xl border border-primary-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">{monitor.name}</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {monitor.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600">Tracking {monitor.count} items</p>
                        <p className="text-sm text-gray-500">Frequency: {monitor.frequency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notifications & Alerts</h3>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-xl border transition-all ${
                      notif.read ? 'bg-gray-50 border-gray-200' : 'bg-primary-50 border-primary-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{notif.title}</h4>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

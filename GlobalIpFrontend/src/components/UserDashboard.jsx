import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, BookmarkIcon, FileText, BarChart3, Activity, TrendingUp, Lightbulb, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { VscSearch, VscSave, VscBell } from 'react-icons/vsc';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
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
    { name: 'AI/ML', value: 35, color: '#4169e1' },
    { name: 'Blockchain', value: 25, color: '#3854c9' },
    { name: 'IoT', value: 20, color: '#4d5bff' },
    { name: 'Biotech', value: 15, color: '#3d40f5' },
    { name: 'Other', value: 5, color: '#6b88ff' }
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
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-light text-gray-900 dark:text-white">GlobalIP</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">User Dashboard</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
              { id: 'search', label: 'IP Search', icon: <VscSearch className="w-5 h-5" /> },
              { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-5 h-5" /> },
              { id: 'alerts', label: 'Alerts', icon: <VscBell className="w-5 h-5" /> },
              { id: 'saved', label: 'Saved Items', icon: <BookmarkIcon className="w-5 h-5" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" /> : <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-white">Welcome back, {user.username}</h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">Monitor and search global IP intelligence</p>
            </div>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <div className="relative">
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light">{user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-light">
                      Edit Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-light">
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-light border-t border-gray-200 dark:border-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Searches', value: '324', icon: <VscSearch className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                  { label: 'Saved Items', value: '42', icon: <BookmarkIcon className="w-6 h-6" />, color: 'from-primary-500 to-primary-600' },
                  { label: 'Active Alerts', value: '12', icon: <VscBell className="w-6 h-6" />, color: 'from-accent-500 to-accent-600' },
                  { label: 'Reports', value: '8', icon: <FileText className="w-6 h-6" />, color: 'from-green-500 to-green-600' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-light text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary-600" />
                    <span>Search Activity</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: '1px solid #d1d5db' }} />
                      <Area type="monotone" dataKey="searches" stroke="#1677ff" fillOpacity={1} fill="url(#colorSearches)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <span>Technology Distribution</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={technologyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {technologyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: '1px solid #d1d5db' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Search className="w-6 h-6 text-primary-600" />
                  <span>IP Search</span>
                </h3>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    >
                      <option value="patents">Patents</option>
                      <option value="trademarks">Trademarks</option>
                    </select>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by keyword, assignee, inventor..."
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                    <button type="submit" className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                      value={searchFilters.jurisdiction}
                      onChange={(e) => setSearchFilters({ ...searchFilters, jurisdiction: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Jurisdictions</option>
                      <option value="US">United States</option>
                      <option value="EP">Europe</option>
                      <option value="CN">China</option>
                    </select>
                    <select
                      value={searchFilters.technology}
                      onChange={(e) => setSearchFilters({ ...searchFilters, technology: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Technologies</option>
                      <option value="AI">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT">IoT</option>
                    </select>
                    <input
                      type="date"
                      value={searchFilters.dateFrom}
                      onChange={(e) => setSearchFilters({ ...searchFilters, dateFrom: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={searchFilters.dateTo}
                      onChange={(e) => setSearchFilters({ ...searchFilters, dateTo: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </form>
              </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Search Results</h3>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-600 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">{result.title}</h4>
                          <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">{result.number}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Assignee: {result.assignee}</span>
                            <span>•</span>
                            <span>Filed: {result.filingDate}</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">{result.status}</span>
                          </div>
                        </div>
                        <button className="ml-4 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <BookmarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Bell className="w-6 h-6 text-primary-600" />
                <span>Recent Alerts</span>
              </h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border rounded-xl transition-all ${notif.read ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50' : 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{notif.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{notif.time}</p>
                      </div>
                      <button className="ml-4 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

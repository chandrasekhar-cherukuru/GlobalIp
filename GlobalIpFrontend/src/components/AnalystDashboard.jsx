import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, FileText, Eye, Globe, Bell, PieChart, Activity, Lightbulb, ChevronLeft, ChevronRight, Play, Pause, AlertCircle } from 'lucide-react';
import { VscGraphLine, VscPieChart, VscTarget } from 'react-icons/vsc';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function AnalystDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Subscription monitoring state
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, keyword: 'Artificial Intelligence', jurisdiction: 'US', status: 'Active', newFilings: 12, lastUpdate: '2h ago' },
    { id: 2, keyword: 'Blockchain Protocol', jurisdiction: 'EP', status: 'Active', newFilings: 8, lastUpdate: '5h ago' },
    { id: 3, keyword: 'IoT Security', jurisdiction: 'CN', status: 'Paused', newFilings: 0, lastUpdate: '1d ago' }
  ]);

  const analyticsData = [
    { date: 'Jan', patents: 450, trademarks: 320, filings: 180 },
    { date: 'Feb', patents: 520, trademarks: 380, filings: 210 },
    { date: 'Mar', patents: 610, trademarks: 420, filings: 240 },
    { date: 'Apr', patents: 580, trademarks: 450, filings: 220 },
    { date: 'May', patents: 700, trademarks: 510, filings: 280 },
    { date: 'Jun', patents: 780, trademarks: 580, filings: 320 }
  ];

  const trendData = [
    { technology: 'AI/ML', growth: 45, patents: 234 },
    { technology: 'Blockchain', growth: 32, patents: 189 },
    { technology: 'IoT', growth: 28, patents: 156 },
    { technology: 'Biotech', growth: 38, patents: 198 },
    { technology: 'Quantum', growth: 52, patents: 87 }
  ];

  const competitorActivity = [
    { company: 'TechCorp', filings: 45, grants: 28, pending: 17, trend: '+12%' },
    { company: 'InnovateLabs', filings: 38, grants: 22, pending: 16, trend: '+8%' },
    { company: 'FutureSystems', filings: 32, grants: 19, pending: 13, trend: '+15%' }
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSubscription = (id) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: sub.status === 'Active' ? 'Paused' : 'Active' } : sub
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <VscGraphLine className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-light text-gray-900 dark:text-white">GlobalIP</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">Analyst Dashboard</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
              { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-5 h-5" /> },
              { id: 'competitors', label: 'Competitors', icon: <Target className="w-5 h-5" /> },
              { id: 'subscriptions', label: 'Subscriptions', icon: <Bell className="w-5 h-5" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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
              <h2 className="text-2xl font-light text-gray-900 dark:text-white">Analyst Workspace</h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">Advanced IP intelligence and competitive analysis</p>
            </div>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <div className="relative">
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || 'Analyst'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light">{user?.email || 'analyst@globalip.com'}</p>
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
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Analyzed', value: '15,234', change: '+18%', icon: <BarChart3 className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
                  { label: 'Active Monitors', value: '89', change: '+12', icon: <Eye className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                  { label: 'Jurisdictions', value: '156', change: '+3', icon: <Globe className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
                  { label: 'Reports Generated', value: '234', change: '+45', icon: <FileText className="w-6 h-6" />, color: 'from-primary-500 to-primary-600' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {stat.icon}
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-sm font-semibold">{stat.change}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-light text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span>IP Activity Trends</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="colorPatents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="date" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: '1px solid #d1d5db' }} />
                      <Legend />
                      <Area type="monotone" dataKey="patents" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPatents)" />
                      <Area type="monotone" dataKey="trademarks" stroke="#1677ff" fillOpacity={1} fill="url(#colorPatents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span>Technology Growth</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="technology" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: '1px solid #d1d5db' }} />
                      <Bar dataKey="growth" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <span>Active Subscriptions</span>
                  </h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all">
                    + New Subscription
                  </button>
                </div>

                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className={`p-6 border-2 rounded-xl transition-all ${sub.status === 'Active' ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{sub.keyword}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                              {sub.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>{sub.jurisdiction}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{sub.newFilings} new filings</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4" />
                              <span>Updated {sub.lastUpdate}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSubscription(sub.id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${sub.status === 'Active' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'}`}
                            >
                              {sub.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              <span>{sub.status === 'Active' ? 'Pause' : 'Resume'}</span>
                            </button>
                            <button className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all">
                              View Filings
                            </button>
                            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                              Configure
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Subscription Monitoring</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Monitor patent and trademark filings by keyword, assignee, or inventor across multiple jurisdictions. Receive real-time alerts for new filings and legal status changes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Competitor Analysis</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Company</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Filings</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Granted</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Pending</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorActivity.map((comp, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{comp.company}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{comp.filings}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{comp.grants}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{comp.pending}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                            {comp.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

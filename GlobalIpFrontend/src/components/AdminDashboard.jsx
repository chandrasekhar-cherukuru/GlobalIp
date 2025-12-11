import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Server, Database, AlertCircle, CheckCircle, Clock, TrendingUp, Lightbulb, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { VscServerProcess, VscDatabase, VscAccount } from 'react-icons/vsc';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    setUsers([
      { id: 1, username: 'john.doe', email: 'john@example.com', role: 'USER', status: 'Active', lastLogin: '2 hours ago' },
      { id: 2, username: 'jane.analyst', email: 'jane@example.com', role: 'ANALYST', status: 'Active', lastLogin: '1 day ago' },
      { id: 3, username: 'bob.smith', email: 'bob@example.com', role: 'USER', status: 'Inactive', lastLogin: '5 days ago' },
      { id: 4, username: 'alice.tech', email: 'alice@example.com', role: 'ANALYST', status: 'Active', lastLogin: '3 hours ago' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const systemUsage = [
    { date: 'Jan', users: 450, searches: 2340, apiCalls: 12500 },
    { date: 'Feb', users: 520, searches: 2890, apiCalls: 14200 },
    { date: 'Mar', users: 610, searches: 3200, apiCalls: 16800 },
    { date: 'Apr', users: 580, searches: 3100, apiCalls: 15900 },
    { date: 'May', users: 700, searches: 3800, apiCalls: 18500 },
    { date: 'Jun', users: 780, searches: 4200, apiCalls: 21000 }
  ];

  const apiHealth = [
    { endpoint: '/api/search', status: 'Operational', uptime: '99.9%', avgResponse: '120ms' },
    { endpoint: '/api/patents', status: 'Operational', uptime: '99.8%', avgResponse: '95ms' },
    { endpoint: '/api/trademarks', status: 'Operational', uptime: '99.7%', avgResponse: '110ms' },
    { endpoint: '/api/analytics', status: 'Operational', uptime: '99.9%', avgResponse: '150ms' },
    { endpoint: '/api/reports', status: 'Operational', uptime: '99.6%', avgResponse: '200ms' }
  ];

  const recentLogs = [
    { id: 1, timestamp: '2024-12-11 14:23:45', level: 'INFO', service: 'API Gateway', message: 'Successful authentication for user: john.doe', ip: '192.168.1.100' },
    { id: 2, timestamp: '2024-12-11 14:22:30', level: 'WARN', service: 'Database', message: 'Slow query detected: 2.3s response time', ip: 'internal' },
    { id: 3, timestamp: '2024-12-11 14:21:15', level: 'INFO', service: 'Search Service', message: 'Patent search completed: 1,234 results', ip: '192.168.1.101' },
    { id: 4, timestamp: '2024-12-11 14:20:00', level: 'ERROR', service: 'External API', message: 'USPTO API timeout after 30s', ip: 'external' },
    { id: 5, timestamp: '2024-12-11 14:19:45', level: 'INFO', service: 'Auth Service', message: 'OAuth2 token refreshed', ip: '192.168.1.100' }
  ];

  const dbMetrics = {
    totalRecords: '15.2M',
    storageUsed: '234 GB',
    queryPerformance: '85ms avg',
    connections: '45/100'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-light text-gray-900 dark:text-white">GlobalIP</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">Admin Control</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
              { id: 'users', label: 'Users', icon: <VscAccount className="w-5 h-5" /> },
              { id: 'api-health', label: 'API Health', icon: <VscServerProcess className="w-5 h-5" /> },
              { id: 'logs', label: 'System Logs', icon: <Server className="w-5 h-5" /> },
              { id: 'database', label: 'Database', icon: <VscDatabase className="w-5 h-5" /> }
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
              <h2 className="text-2xl font-light text-gray-900 dark:text-white">System Administration</h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">Platform monitoring and management</p>
            </div>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <div className="relative">
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <AlertCircle className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || 'Admin'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light">{user?.email || 'admin@globalip.com'}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-light">
                      Edit Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-light">
                      System Settings
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
                  { label: 'Total Users', value: '780', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                  { label: 'API Calls Today', value: '21.5K', change: '+8%', icon: <VscServerProcess className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
                  { label: 'System Uptime', value: '99.9%', change: '↑', icon: <CheckCircle className="w-6 h-6" />, color: 'from-primary-500 to-primary-600' },
                  { label: 'Active Sessions', value: '234', change: '+15', icon: <Activity className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' }
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
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <span>System Usage Trends</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={systemUsage}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAPI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="date" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: '1px solid #d1d5db' }} />
                      <Legend />
                      <Area type="monotone" dataKey="users" stroke="#1677ff" fillOpacity={1} fill="url(#colorUsers)" />
                      <Area type="monotone" dataKey="apiCalls" stroke="#ef4444" fillOpacity={1} fill="url(#colorAPI)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Database className="w-5 h-5 text-red-600" />
                    <span>Database Metrics</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Records', value: dbMetrics.totalRecords, icon: <Database className="w-5 h-5 text-blue-600" /> },
                      { label: 'Storage Used', value: dbMetrics.storageUsed, icon: <Server className="w-5 h-5 text-green-600" /> },
                      { label: 'Query Performance', value: dbMetrics.queryPerformance, icon: <Clock className="w-5 h-5 text-purple-600" /> },
                      { label: 'Active Connections', value: dbMetrics.connections, icon: <Activity className="w-5 h-5 text-red-600" /> }
                    ].map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          {metric.icon}
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{metric.label}</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api-health' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <VscServerProcess className="w-6 h-6 text-red-600" />
                <span>API Health Status</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Endpoint</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Uptime</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Avg Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiHealth.map((api, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4 font-mono text-sm text-gray-900 dark:text-white">{api.endpoint}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-semibold">{api.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{api.uptime}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{api.avgResponse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Server className="w-6 h-6 text-red-600" />
                <span>System Logs</span>
              </h3>
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className={`p-4 border-l-4 rounded-r-lg ${
                    log.level === 'ERROR' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    log.level === 'WARN' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            log.level === 'ERROR' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                            log.level === 'WARN' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                            'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          }`}>
                            {log.level}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{log.service}</span>
                          <span className="text-gray-500 dark:text-gray-500 text-xs">{log.ip}</span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm mb-1">{log.message}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs">{log.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Users className="w-6 h-6 text-red-600" />
                <span>User Management</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Username</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            user.role === 'ANALYST' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{user.lastLogin}</td>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock users data
    setUsers([
      { id: 1, username: 'john.doe', email: 'john@example.com', role: 'USER', status: 'Active', lastLogin: '2 hours ago' },
      { id: 2, username: 'jane.analyst', email: 'jane@example.com', role: 'ANALYST', status: 'Active', lastLogin: '1 day ago' },
      { id: 3, username: 'bob.smith', email: 'bob@example.com', role: 'USER', status: 'Inactive', lastLogin: '5 days ago' },
      { id: 4, username: 'alice.tech', email: 'alice@example.com', role: 'ANALYST', status: 'Active', lastLogin: '3 hours ago' },
      { id: 5, username: 'charlie.user', email: 'charlie@example.com', role: 'USER', status: 'Active', lastLogin: '30 min ago' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // System Metrics Data
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

  const dbMetrics = {
    totalRecords: '15.2M',
    storageUsed: '234 GB',
    queryPerformance: '85ms avg',
    connections: '45/100'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GlobalIP Control Center</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'ADMIN'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>

              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'system', label: 'System', icon: '⚙️' },
                { id: 'logs', label: 'Logs', icon: '📝' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '780', change: '+12%', icon: '👥', color: 'from-blue-500 to-blue-600' },
                { label: 'API Calls Today', value: '21.5K', change: '+8%', icon: '🔌', color: 'from-green-500 to-green-600' },
                { label: 'System Uptime', value: '99.9%', change: '↑', icon: '✅', color: 'from-primary-500 to-primary-600' },
                { label: 'Active Sessions', value: '234', change: '+15', icon: '🟢', color: 'from-purple-500 to-purple-600' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Usage Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Usage Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={systemUsage}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="searches" stroke="#10B981" fillOpacity={1} fill="url(#colorSearches)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">API Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="apiCalls" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Database Metrics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Database Metrics</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{dbMetrics.totalRecords}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">{dbMetrics.storageUsed}</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Query Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{dbMetrics.queryPerformance}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{dbMetrics.connections}</p>
                </div>
              </div>
            </div>

            {/* API Health */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">API Health Status</h3>
              <div className="space-y-3">
                {apiHealth.map((api, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">{api.endpoint}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600">Uptime: </span>
                        <span className="font-bold text-green-600">{api.uptime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Response: </span>
                        <span className="font-bold text-gray-900">{api.avgResponse}</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {api.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  + Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Username</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Last Login</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{u.username}</td>
                        <td className="py-3 px-4 text-gray-700">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            u.role === 'ANALYST' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{u.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Configuration</h3>
              <div className="space-y-4">
                {[
                  { label: 'Maintenance Mode', value: 'Off', action: 'Enable' },
                  { label: 'Auto Backup', value: 'Daily at 2 AM', action: 'Configure' },
                  { label: 'Cache Strategy', value: 'Redis + CDN', action: 'Optimize' },
                  { label: 'Rate Limiting', value: '1000 req/min', action: 'Adjust' }
                ].map((config, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-red-300 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-600">{config.value}</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                      {config.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Logs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[
                  { time: '14:32:15', type: 'INFO', message: 'User login successful: john.doe' },
                  { time: '14:30:42', type: 'SUCCESS', message: 'Database backup completed successfully' },
                  { time: '14:28:01', type: 'WARNING', message: 'High API usage detected: 950 req/min' },
                  { time: '14:25:33', type: 'INFO', message: 'New user registered: alice.tech' },
                  { time: '14:22:18', type: 'ERROR', message: 'Failed authentication attempt from IP 192.168.1.45' },
                  { time: '14:20:05', type: 'INFO', message: 'System health check passed' }
                ].map((log, idx) => (
                  <div key={idx} className={`p-3 rounded-lg font-mono text-sm ${
                    log.type === 'ERROR' ? 'bg-red-50 text-red-700' :
                    log.type === 'WARNING' ? 'bg-yellow-50 text-yellow-700' :
                    log.type === 'SUCCESS' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    <span className="font-bold">[{log.time}]</span> 
                    <span className="mx-2">{log.type}</span> 
                    {log.message}
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

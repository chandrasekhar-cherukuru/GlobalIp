import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { HiChartBar, HiTrendingUp, HiTarget, HiDocumentText, HiEye, HiGlobe, HiBell, HiChartPie } from 'react-icons/hi';
import { MdAnalytics } from 'react-icons/md';

export default function AnalystDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Analytics Data
  const filingTrends = [
    { month: 'Jan', patents: 450, trademarks: 230, applications: 180 },
    { month: 'Feb', patents: 520, trademarks: 310, applications: 240 },
    { month: 'Mar', patents: 610, trademarks: 280, applications: 290 },
    { month: 'Apr', patents: 580, trademarks: 350, applications: 310 },
    { month: 'May', patents: 700, trademarks: 420, applications: 380 },
    { month: 'Jun', patents: 780, trademarks: 380, applications: 420 }
  ];

  const jurisdictionAnalysis = [
    { name: 'United States', value: 3400, growth: 12.5 },
    { name: 'European Union', value: 1800, growth: 8.3 },
    { name: 'China', value: 2400, growth: 15.2 },
    { name: 'Japan', value: 1200, growth: 5.7 },
    { name: 'South Korea', value: 980, growth: 9.1 },
    { name: 'Others', value: 1600, growth: 7.8 }
  ];

  const techCategories = [
    { category: 'AI/ML', patents: 1560, trademarks: 234, avgTime: 18 },
    { category: 'Blockchain', patents: 890, trademarks: 156, avgTime: 22 },
    { category: 'IoT', patents: 1340, trademarks: 289, avgTime: 20 },
    { category: 'Biotech', patents: 670, trademarks: 123, avgTime: 24 },
    { category: 'Clean Energy', patents: 980, trademarks: 167, avgTime: 21 },
    { category: 'Medical Devices', patents: 756, trademarks: 201, avgTime: 23 }
  ];

  const competitorAnalysis = [
    { company: 'TechCorp Inc.', patents: 234, trademarks: 45, score: 92 },
    { company: 'InnovateLab', patents: 189, trademarks: 67, score: 85 },
    { company: 'Future Systems', patents: 156, trademarks: 34, score: 78 },
    { company: 'GlobalTech', patents: 145, trademarks: 52, score: 76 },
    { company: 'NextGen Solutions', patents: 123, trademarks: 41, score: 72 }
  ];

  const radarData = [
    { subject: 'Patents', A: 120, B: 110, fullMark: 150 },
    { subject: 'Trademarks', A: 98, B: 130, fullMark: 150 },
    { subject: 'Applications', A: 86, B: 90, fullMark: 150 },
    { subject: 'Grants', A: 99, B: 85, fullMark: 150 },
    { subject: 'Citations', A: 85, B: 115, fullMark: 150 }
  ];

  const COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#FFFBEB'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdAnalytics className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GlobalIP Analytics</h1>
                <p className="text-xs text-gray-500">Analyst Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.username || 'Analyst'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'ANALYST'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
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
              {
                { id: 'analytics', label: 'Analytics', icon: <HiChartBar className="text-lg" /> },
                { id: 'trends', label: 'Trends', icon: <HiTrendingUp className="text-lg" /> },
                { id: 'competitors', label: 'Competitors', icon: <HiTarget className="text-lg" /> },
                { id: 'reports', label: 'Reports', icon: <HiDocumentText className="text-lg" /> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === tab.id ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {
                { label: 'Total Analyzed', value: '15,234', change: '+18%', icon: <HiChartBar className="text-2xl text-white" />, color: 'from-purple-500 to-purple-600' },
                { label: 'Active Monitors', value: '89', change: '+12', icon: <HiEye className="text-2xl text-white" />, color: 'from-blue-500 to-blue-600' },
                { label: 'Jurisdictions', value: '156', change: '+3', icon: <HiGlobe className="text-2xl text-white" />, color: 'from-green-500 to-green-600' },
                { label: 'Reports Generated', value: '234', change: '+45', icon: <HiDocumentText className="text-2xl text-white" />, color: 'from-primary-500 to-primary-600' }
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

            {/* Main Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Filing Trends */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Global Filing Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="patents" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="trademarks" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="applications" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Jurisdiction Distribution */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Jurisdictions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={jurisdictionAnalysis} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {jurisdictionAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technology Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technology Category Analysis</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={techCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patents" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="trademarks" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Jurisdiction Details Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Jurisdiction Growth Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Jurisdiction</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Total Filings</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Growth Rate</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurisdictionAnalysis.map((jur, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{jur.name}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{jur.value.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-green-600 font-semibold">+{jur.growth}%</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-green-500">↗</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">6-Month Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={filingTrends}>
                    <defs>
                      <linearGradient id="colorPatents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
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
                    <Area type="monotone" dataKey="patents" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorPatents)" />
                    <Area type="monotone" dataKey="trademarks" stroke="#10B981" fillOpacity={1} fill="url(#colorTrademarks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Comparative Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Current Period" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Radar name="Previous Period" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Rising Trend', desc: 'AI/ML category showing 25% growth', color: 'green' },
                { title: 'Stable Trend', desc: 'Biotech maintaining steady growth', color: 'blue' },
                { title: 'Emerging Trend', desc: 'Clean Energy gaining momentum', color: 'purple' }
              ].map((insight, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className={`w-12 h-12 bg-${insight.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <svg className={`w-6 h-6 text-${insight.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-gray-600 text-sm">{insight.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Competitor Intelligence</h3>
              <div className="space-y-4">
                {competitorAnalysis.map((comp, idx) => (
                  <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{comp.company}</h4>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            Score: {comp.score}
                          </span>
                        </div>
                        <div className="flex space-x-6 text-sm">
                          <div>
                            <span className="text-gray-600">Patents: </span>
                            <span className="font-bold text-gray-900">{comp.patents}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Trademarks: </span>
                            <span className="font-bold text-gray-900">{comp.trademarks}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Generated Reports</h3>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                  + Generate Report
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Q4 2024 Analysis', date: '2024-12-01', type: 'Quarterly', status: 'Ready' },
                  { title: 'Technology Trends', date: '2024-11-28', type: 'Custom', status: 'Ready' },
                  { title: 'Competitor Report', date: '2024-11-25', type: 'Monthly', status: 'Ready' },
                  { title: 'Jurisdiction Overview', date: '2024-11-20', type: 'Custom', status: 'Ready' }
                ].map((report, idx) => (
                  <div key={idx} className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <HiDocumentText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{report.title}</h4>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-600">{report.type}</span>
                      <span className="text-gray-500">{report.date}</span>
                    </div>
                    <button className="w-full py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                      Download PDF
                    </button>
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

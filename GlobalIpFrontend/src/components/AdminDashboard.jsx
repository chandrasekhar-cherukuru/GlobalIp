import React, { useState, useEffect, createContext, useContext } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

/*
  Pro-Max Single File Admin Dashboard (React + Tailwind + Recharts)
  - Yellow-themed header & sidebar
  - Comprehensive analytics with multiple chart types
  - Notification center with quick actions
  - Advanced user management with visual indicators
  - API monitoring with performance graphs
  - System logs with filtering and visualization
  - Database monitoring with storage visualization
  - Enhanced settings and deployment tools
*/

// ------- Auth & Context -------
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState("admin"); // admin | analyst | user
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const loginAs = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };
  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, setUserRole, setIsAuthenticated, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  return useContext(AuthContext);
}

// ------- Small utilities -------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------- Color Scheme -------
const COLORS = ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7", "#FFFBEB"];

// ------- Mock Data -------
const generateMockData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const displayMonths = months.slice(0, currentMonth + 1);
  
  // API usage data
  const apiUsageData = displayMonths.map((month, i) => ({
    month,
    WIPO: Math.floor(Math.random() * 1000) + 500,
    USPTO: Math.floor(Math.random() * 1000) + 300,
    EPO: Math.floor(Math.random() * 1000) + 200,
    TMView: Math.floor(Math.random() * 1000) + 100,
  }));
  
  // System performance data
  const systemPerformanceData = displayMonths.map((month, i) => ({
    month,
    responseTime: Math.floor(Math.random() * 100) + 50,
    throughput: Math.floor(Math.random() * 1000) + 500,
    errorRate: Math.floor(Math.random() * 10) + 1,
  }));
  
  // User activity data
  const userActivityData = displayMonths.map((month, i) => ({
    month,
    activeUsers: Math.floor(Math.random() * 100) + 50,
    newUsers: Math.floor(Math.random() * 50) + 10,
    pageViews: Math.floor(Math.random() * 1000) + 500,
  }));
  
  // Technology distribution data
  const techDistributionData = [
    { name: "AI/ML", value: 35, fill: COLORS[0] },
    { name: "Blockchain", value: 25, fill: COLORS[1] },
    { name: "IoT", value: 20, fill: COLORS[2] },
    { name: "Biotech", value: 15, fill: COLORS[3] },
    { name: "Other", value: 5, fill: COLORS[4] },
  ];
  
  // API status data
  const apiStatusData = [
    { name: "Response Time", current: 120, average: 100, unit: "ms" },
    { name: "Uptime", current: 99.9, average: 99.5, unit: "%" },
    { name: "Success Rate", current: 98.5, average: 97.8, unit: "%" },
    { name: "Throughput", current: 1200, average: 1000, unit: "req/s" },
  ];
  
  // Database usage data
  const databaseUsageData = [
    { name: "Used", value: 120, fill: COLORS[0] },
    { name: "Available", value: 380, fill: COLORS[4] },
  ];
  
  // System logs data
  const systemLogsData = [];
  for (let i = 0; i < 100; i++) {
    const date = new Date(Date.now() - i * 1000000);
    systemLogsData.push({
      id: i + 1,
      time: date.toISOString(),
      level: i % 10 === 0 ? "ERROR" : i % 5 === 0 ? "WARN" : "INFO",
      msg: `Sample log message ${i + 1}`,
      source: ["API", "Database", "Auth", "Cache"][Math.floor(Math.random() * 4)],
    });
  }
  
  return {
    apiUsageData,
    systemPerformanceData,
    userActivityData,
    techDistributionData,
    apiStatusData,
    databaseUsageData,
    systemLogsData,
  };
};

const mockData = generateMockData();

// ------- Small UI primitives -------
function Badge({ children, className = "" }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${className}`}>{children}</span>
  );
}

function Modal({ title, open, onClose, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-h-[90vh] overflow-auto w-full ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>✖</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// Simple toast system (small)
function Toast({ list, onDismiss }) {
  if (!list.length) return null;
  return (
    <div className="fixed right-4 bottom-6 z-70 flex flex-col gap-2">
      {list.map((t) => (
        <div key={t.id} className="bg-gray-900 text-white px-4 py-2 rounded shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">{t.message}</div>
            <button className="text-xs opacity-80" onClick={() => onDismiss(t.id)}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------- Main Component (export default) -------
export default function ProMaxAdminDashboard() {
  return (
    <AuthProvider>
      <DashboardCore />
    </AuthProvider>
  );
}

function DashboardCore() {
  // --- app state ---
  const { userRole, loginAs, setUserRole } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);

  // notification dropdown
  const [notifOpen, setNotifOpen] = useState(false);

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [rbacOpen, setRbacOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  // toasts
  const [toasts, setToasts] = useState([]);
  const pushToast = (message) => {
    const t = { id: Date.now() + Math.random(), message };
    setToasts((p) => [...p, t]);
    setTimeout(() => setToasts((p) => p.filter((i) => i.id !== t.id)), 6000);
  };
  const dismissToast = (id) => setToasts((p) => p.filter((i) => i.id !== id));

  // example data: users, apis, system
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Analyst", status: "Active", lastLogin: "2025-07-15T09:32:00Z" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive", lastLogin: "2025-06-20T14:15:00Z" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Admin", status: "Active", lastLogin: "2025-07-16T11:45:00Z" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Analyst", status: "Active", lastLogin: "2025-07-14T16:20:00Z" },
    { id: 5, name: "David Brown", email: "david@example.com", role: "User", status: "Active", lastLogin: "2025-07-12T08:10:00Z" },
  ]);

  const [apis, setApis] = useState([
    { id: 1, name: "WIPO", status: "Online", calls: 120, last: "2025-07-16T11:32:00Z", responseTime: 120, uptime: 99.9 },
    { id: 2, name: "USPTO", status: "Down", calls: 45, last: "2025-07-16T14:01:00Z", responseTime: 0, uptime: 95.2 },
    { id: 3, name: "EPO", status: "Online", calls: 78, last: "2025-07-16T09:10:00Z", responseTime: 150, uptime: 99.5 },
    { id: 4, name: "TMView", status: "Online", calls: 56, last: "2025-07-15T20:20:00Z", responseTime: 80, uptime: 99.8 },
  ]);

  const [systemLogs, setSystemLogs] = useState(mockData.systemLogsData);

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "ServiceKey-1", key: "sk_live_123abc", created: "2025-06-01", lastUsed: "2025-07-15T14:30:00Z" },
    { id: 2, name: "AnalyticsKey-2", key: "sk_live_456def", created: "2025-05-15", lastUsed: "2025-07-16T09:15:00Z" },
  ]);

  const [syncing, setSyncing] = useState(false);
  const [apiMonitorLive, setApiMonitorLive] = useState(true);

  useEffect(() => {
    if (notifOpen) {
      const handle = (e) => {
        // close when clicked outside
        if (!e.target.closest("[data-notif-root]")) setNotifOpen(false);
      };
      document.addEventListener("click", handle);
      return () => document.removeEventListener("click", handle);
    }
  }, [notifOpen]);

  // demo: refresh API statuses (mock)
  const refreshApiStatuses = async () => {
    // simulate network
    setApiMonitorLive(false);
    await sleep(600);
    setApis((prev) => prev.map((a) => ({ 
      ...a, 
      status: Math.random() > 0.15 ? (a.status === "Down" ? "Online" : a.status) : "Down", 
      calls: a.calls + Math.floor(Math.random() * 10),
      responseTime: a.status === "Online" ? Math.floor(Math.random() * 200) + 50 : 0
    })));
    setApiMonitorLive(true);
    pushToast(`API statuses refreshed`);
  };

  // trigger data sync
  const triggerDataSync = async () => {
    setSyncing(true);
    pushToast("Starting data sync...");
    await sleep(1400);
    // append a log entry
    setSystemLogs((p) => [{ id: Date.now(), time: new Date().toISOString(), level: "INFO", msg: "Manual data sync completed", source: "System" }, ...p].slice(0, 200));
    pushToast("Data sync completed successfully");
    setSyncing(false);
  };

  // rbac modal content: simple role assignment
  const openRbacModal = () => {
    setRbacOpen(true);
  };

  const openApiKeyModal = () => setApiKeyOpen(true);

  // handle notif click actions
  const handleNotifAction = (key) => {
    setNotifOpen(false);
    switch (key) {
      case "user-management":
        setActiveTab("users");
        pushToast("Opened User Management");
        break;
      case "rbac":
        openRbacModal();
        break;
      case "api-monitor":
        setActiveTab("apis");
        pushToast("Opened API Health Monitor");
        break;
      case "system-logs":
        setActiveTab("system");
        pushToast("Opened System Logs Viewer");
        break;
      case "api-keys":
        openApiKeyModal();
        break;
      case "trigger-sync":
        triggerDataSync();
        break;
      default:
        break;
    }
  };

  // user CRUD (simple)
  const addUser = (u) => setUsers((p) => [{ id: Date.now(), ...u }, ...p]);
  const updateUser = (id, u) => setUsers((p) => p.map((x) => (x.id === id ? { ...x, ...u } : x)));
  const deleteUser = (id) => setUsers((p) => p.filter((x) => x.id !== id));

  // api key handlers
  const createApiKey = (name) => {
    const k = `sk_live_${Math.random().toString(36).slice(2, 12)}`;
    setApiKeys((p) => [{ id: Date.now(), name, key: k, created: new Date().toISOString().slice(0, 10), lastUsed: new Date().toISOString() }, ...p]);
    pushToast(`Created API key ${name}`);
  };
  const revokeApiKey = (id) => {
    setApiKeys((p) => p.filter((k) => k.id !== id));
    pushToast(`Revoked API key`);
  };

  // system logs filter
  const [logFilter, setLogFilter] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState("ALL");
  const filteredLogs = systemLogs.filter((l) => {
    const matchesSearch = l.msg.toLowerCase().includes(logFilter.toLowerCase()) || l.source.toLowerCase().includes(logFilter.toLowerCase());
    const matchesLevel = logLevelFilter === "ALL" || l.level === logLevelFilter;
    return matchesSearch && matchesLevel;
  });

  // small helper to open modal with custom content
  const openModalWith = (title, node, wide = false) => {
    setModalContent({ title, node, wide });
    setModalOpen(true);
  };

  // Notification items list
  const notificationItems = [
    { id: "user-management", label: "User Management UI", subtitle: "Open user admin panel", icon: "👥" },
    { id: "rbac", label: "Role-Based Access Control", subtitle: "Manage roles & permissions", icon: "🔐" },
    { id: "api-monitor", label: "API Health Monitor", subtitle: "Live API status", icon: "🌐", badge: "Live" },
    { id: "system-logs", label: "System Logs Viewer", subtitle: "Inspect logs & errors", icon: "📜" },
    { id: "api-keys", label: "API Key Settings", subtitle: "Create or revoke keys", icon: "🔑" },
    { id: "trigger-sync", label: "Trigger Data Sync", subtitle: "Manual sync now", icon: "🔄" },
  ];

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col bg-yellow-50`}>
      {/* Header */}
      <header className="w-full sticky top-0 z-50 bg-yellow-400/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">Analyst Pro-Max</div>
            <div className="text-sm opacity-80">Enterprise Dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="px-2 py-1 rounded">
                <option value="admin">Admin</option>
                <option value="analyst">Analyst</option>
                <option value="user">User</option>
              </select>
              <button onClick={() => setDarkMode((d) => !d)} className="px-3 py-1 rounded bg-white/80">{darkMode ? "Light" : "Dark"}</button>
            </div>

            {/* Notification dropdown (Top-right) */}
            <div className="relative" data-notif-root>
              <button
                onClick={() => setNotifOpen((s) => !s)}
                className="px-3 py-2 rounded bg-white shadow flex items-center gap-2"
              >
                <span className="text-lg">🔔</span>
                <span className="hidden sm:inline">Notifications</span>
                <Badge className="bg-red-500 text-white ml-2">{systemLogs.filter(l => l.level === "ERROR").length}</Badge>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold">Quick Actions</div>
                      <div className="text-xs opacity-70">Tap an action to open</div>
                    </div>
                    <div className="text-xs opacity-70">{new Date().toLocaleString()}</div>
                  </div>

                  <div className="divide-y">
                    {notificationItems.map((it) => (
                      <button key={it.id} onClick={() => handleNotifAction(it.id)} className="w-full text-left py-2 flex items-start gap-3 hover:bg-yellow-50 px-1 rounded">
                        <div className="text-2xl leading-none mt-0.5">{it.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{it.label} {it.badge && <Badge className="bg-green-500 text-white ml-2">{it.badge}</Badge>}</div>
                          <div className="text-xs opacity-70">{it.subtitle}</div>
                        </div>
                      </button>
                    ))}

                    <div className="py-2 flex gap-2 mt-2">
                      <button onClick={() => { setNotifOpen(false); refreshApiStatuses(); }} className="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Refresh APIs</button>
                      <button onClick={() => { setNotifOpen(false); pushToast('Cleared quick notifications'); }} className="px-3 py-2 rounded bg-red-500 text-white">Clear</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-yellow-100 rounded-xl p-4 shadow-inner flex flex-col gap-4">
          <div className="font-semibold text-lg">Admin User</div>
          <div className="text-sm opacity-75">admin@company.com</div>

          <nav className="flex flex-col gap-2 mt-4">
            {[
              { key: "overview", label: "Overview", icon: "📊" },
              { key: "analytics", label: "Analytics", icon: "📈" },
              { key: "users", label: "Users", icon: "👥" },
              { key: "apis", label: "APIs", icon: "🌐" },
              { key: "system", label: "System", icon: "⚙️" },
              { key: "database", label: "Database", icon: "💾" },
              { key: "settings", label: "Settings", icon: "🔧" },
              { key: "deployment", label: "Deployment", icon: "🚀" },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`text-left px-3 py-2 rounded flex items-center gap-2 ${activeTab === t.key ? "bg-white shadow font-semibold" : "hover:bg-yellow-200"}`}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto text-xs opacity-70">Pro-Max Dashboard • Role: {userRole}</div>
        </aside>

        {/* Main content area */}
        <main className="flex-1">
          <div className="bg-white rounded-xl p-4 shadow mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{titleForTab(activeTab)}</h2>
                <div className="text-sm opacity-70">Overview & quick actions</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openModalWith('Quick Actions', <QuickActions setActiveTab={setActiveTab} openRbacModal={openRbacModal} openApiKeyModal={openApiKeyModal} triggerDataSync={triggerDataSync} />)} className="px-3 py-2 bg-gray-100 rounded">Open Quick Actions</button>
                <button onClick={() => pushToast('Saved snapshot')} className="px-3 py-2 bg-yellow-100 rounded">Save Snapshot</button>
              </div>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "overview" && <Overview users={users} apis={apis} systemLogs={systemLogs} setActiveTab={setActiveTab} />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "users" && <UsersTab users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} openModalWith={openModalWith} />}
          {activeTab === "apis" && <ApisTab apis={apis} refreshApiStatuses={refreshApiStatuses} apiMonitorLive={apiMonitorLive} openModalWith={openModalWith} />}
          {activeTab === "system" && <SystemTab logs={filteredLogs} logFilter={logFilter} setLogFilter={setLogFilter} logLevelFilter={logLevelFilter} setLogLevelFilter={setLogLevelFilter} />}
          {activeTab === "database" && <DatabaseTab />}
          {activeTab === "settings" && <SettingsTab openRbacModal={openRbacModal} openApiKeyModal={openApiKeyModal} />}
          {activeTab === "deployment" && <DeploymentTab triggerDataSync={triggerDataSync} syncing={syncing} />}

        </main>
      </div>

      {/* modal for RBAC */}
      <Modal title="Role-Based Access Control" open={rbacOpen} onClose={() => setRbacOpen(false)} wide={true}>
        <RbacManager users={users} setUsers={setUsers} />
      </Modal>

      {/* modal for API Keys */}
      <Modal title="API Key Settings" open={apiKeyOpen} onClose={() => setApiKeyOpen(false)} wide={true}>
        <ApiKeyManager apiKeys={apiKeys} createApiKey={createApiKey} revokeApiKey={revokeApiKey} />
      </Modal>

      {/* main generic modal */}
      <Modal title={modalContent?.title} open={modalOpen} onClose={() => setModalOpen(false)} wide={modalContent?.wide}>
        {modalContent?.node}
      </Modal>

      {/* toasts */}
      <Toast list={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ------- Small components used inside main UI -------
function titleForTab(key) {
  const map = {
    overview: "Overview Dashboard",
    analytics: "Analytics Dashboard",
    users: "User Management",
    apis: "API Management",
    system: "System Monitoring",
    database: "Database Monitoring",
    settings: "Admin Settings",
    deployment: "Deployment Tools",
  };
  return map[key] || "Dashboard";
}

function QuickActions({ setActiveTab, openRbacModal, openApiKeyModal, triggerDataSync }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setActiveTab('users')} className="px-3 py-2 bg-yellow-100 rounded">User Management</button>
        <button onClick={openRbacModal} className="px-3 py-2 bg-yellow-100 rounded">RBAC</button>
        <button onClick={() => setActiveTab('apis')} className="px-3 py-2 bg-yellow-100 rounded">API Monitor</button>
        <button onClick={() => setActiveTab('system')} className="px-3 py-2 bg-yellow-100 rounded">System Logs</button>
      </div>

      <div className="flex gap-2">
        <button onClick={openApiKeyModal} className="flex-1 px-3 py-2 bg-gray-100 rounded">API Keys</button>
        <button onClick={triggerDataSync} className="px-3 py-2 bg-blue-500 text-white rounded">Trigger Sync</button>
      </div>
    </div>
  );
}

// ------ Overview Tab ------
function Overview({ users, apis, systemLogs, setActiveTab }) {
  const [chartType, setChartType] = useState("line");
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card label="Total Users" value={users.length} icon="👥" change="+5%" />
        <Card label="APIs Online" value={apis.filter(a => a.status === 'Online').length} icon="🌐" change="+2%" />
        <Card label="System Uptime" value={'12 days'} icon="⏱️" change="0%" />
        <Card label="Recent Errors" value={systemLogs.filter(l=>l.level==='ERROR').length} icon="❗" change="-10%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">API Usage Trends</h3>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="px-2 py-1 border rounded text-sm">
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={mockData.apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="WIPO" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="USPTO" stroke={COLORS[1]} strokeWidth={2} />
                  <Line type="monotone" dataKey="EPO" stroke={COLORS[2]} strokeWidth={2} />
                  <Line type="monotone" dataKey="TMView" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart data={mockData.apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="WIPO" fill={COLORS[0]} />
                  <Bar dataKey="USPTO" fill={COLORS[1]} />
                  <Bar dataKey="EPO" fill={COLORS[2]} />
                  <Bar dataKey="TMView" fill={COLORS[3]} />
                </BarChart>
              ) : (
                <AreaChart data={mockData.apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="WIPO" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                  <Area type="monotone" dataKey="USPTO" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
                  <Area type="monotone" dataKey="EPO" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
                  <Area type="monotone" dataKey="TMView" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Technology Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.techDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.techDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent System Activity</h3>
          <button onClick={() => setActiveTab('system')} className="text-sm text-blue-500 hover:text-blue-700">View All</button>
        </div>
        <div className="space-y-2">
          {systemLogs.slice(0, 5).map(log => (
            <div key={log.id} className={`flex items-center gap-2 p-2 rounded ${log.level === 'ERROR' ? 'bg-red-50' : log.level === 'WARN' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <Badge className={log.level === 'ERROR' ? 'bg-red-500 text-white' : log.level === 'WARN' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'}>
                {log.level}
              </Badge>
              <span className="text-sm">{new Date(log.time).toLocaleString()}</span>
              <span className="flex-1 text-sm">{log.msg}</span>
              <span className="text-xs opacity-70">{log.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------ Analytics Tab ------
function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("6months");
  const [chartType, setChartType] = useState("line");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-3 py-2 border rounded">
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="px-3 py-2 bg-yellow-100 rounded">Export Report</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card label="Total API Calls" value="125,430" icon="📊" change="+12%" />
        <Card label="Active Users" value="1,234" icon="👥" change="+8%" />
        <Card label="Avg Response Time" value="120ms" icon="⏱️" change="-5%" />
        <Card label="Success Rate" value="99.2%" icon="✅" change="+0.3%" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">User Activity Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="activeUsers" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                <Area type="monotone" dataKey="newUsers" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">System Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.systemPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke={COLORS[0]} strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="throughput" stroke={COLORS[1]} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke={COLORS[2]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Technology Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.techDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, icon, change }) {
  const isPositive = change && change.startsWith('+');
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm uppercase text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
      {change && (
        <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {change.substring(1)}
        </div>
      )}
    </div>
  );
}

// ------ Users Tab ------
function UsersTab({ users, addUser, updateUser, deleteUser, openModalWith }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button onClick={() => openModalWith('Add User', <UserForm onSave={(u) => { addUser(u); } } />, false)} className="px-4 py-2 bg-yellow-100 rounded">Add User</button>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input 
              type="text" 
              placeholder="Search by name or email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="ALL">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="User">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => { setSearchTerm(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}
              className="w-full px-3 py-2 bg-gray-100 rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-yellow-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge className={
                    u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'Analyst' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {u.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{new Date(u.lastLogin).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openModalWith('Edit User', <UserForm initialData={u} onSave={(upd) => updateUser(u.id, upd)} />)} className="px-3 py-1 rounded bg-gray-100">Edit</button>
                    <button onClick={() => deleteUser(u.id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserForm({ initialData, onSave }) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState(initialData?.role || "User");
  const [status, setStatus] = useState(initialData?.status || "Active");

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
          <option>Admin</option>
          <option>Analyst</option>
          <option>User</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => { if (onSave) onSave({ name, email, role, status }); }} className="px-4 py-2 bg-yellow-100 rounded">Save</button>
      </div>
    </div>
  );
}

// ------ APIs Tab ------
function ApisTab({ apis, refreshApiStatuses, apiMonitorLive, openModalWith }) {
  const [selectedApi, setSelectedApi] = useState(null);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">API Health Monitor</h2>
        <div className="flex gap-2">
          <button onClick={refreshApiStatuses} className="px-3 py-2 rounded bg-gray-100">Refresh</button>
          <div className="px-3 py-2 rounded bg-white shadow">{apiMonitorLive ? 'Live' : 'Updating...'}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card label="Total APIs" value={apis.length} icon="🌐" />
        <Card label="Online APIs" value={apis.filter(a => a.status === 'Online').length} icon="✅" />
        <Card label="Avg Response Time" value={`${Math.round(apis.reduce((sum, a) => sum + a.responseTime, 0) / apis.length)}ms`} icon="⏱️" />
        <Card label="Avg Uptime" value={`${(apis.reduce((sum, a) => sum + a.uptime, 0) / apis.length).toFixed(1)}%`} icon="📊" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">API Response Times</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responseTime" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">API Uptime</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[95, 100]} />
                <Tooltip />
                <Bar dataKey="uptime" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">API</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Calls</th>
              <th className="px-4 py-3">Response Time</th>
              <th className="px-4 py-3">Uptime</th>
              <th className="px-4 py-3">Last</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apis.map(a => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-yellow-50">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">
                  {a.status === 'Online' ? 
                    <Badge className="bg-green-500 text-white">Online</Badge> : 
                    <Badge className="bg-red-500 text-white">Down</Badge>
                  }
                </td>
                <td className="px-4 py-3">{a.calls}</td>
                <td className="px-4 py-3">{a.responseTime}ms</td>
                <td className="px-4 py-3">{a.uptime}%</td>
                <td className="px-4 py-3">{new Date(a.last).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedApi(a)} className="px-3 py-1 rounded bg-gray-100">Details</button>
                    <button onClick={() => alert('Open logs for ' + a.name)} className="px-3 py-1 rounded bg-blue-500 text-white">Logs</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedApi && (
        <Modal title={`API Details: ${selectedApi.name}`} open={!!selectedApi} onClose={() => setSelectedApi(null)} wide={true}>
          <ApiDetails api={selectedApi} />
        </Modal>
      )}
    </div>
  );
}

function ApiDetails({ api }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{api.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge className={api.status === 'Online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {api.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Check:</span>
              <span>{new Date(api.last).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Performance Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Response Time:</span>
              <span>{api.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Uptime:</span>
              <span>{api.uptime}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Calls:</span>
              <span>{api.calls}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Response Time Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.systemPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="responseTime" stroke={COLORS[0]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ApiEditForm({ api }) {
  const [name, setName] = useState(api.name);
  const [status, setStatus] = useState(api.status);
  const [calls, setCalls] = useState(api.calls);
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold mb-1">API Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
          <option>Online</option>
          <option>Down</option>
          <option>Maintenance</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Calls</label>
        <input type="number" value={calls} onChange={(e) => setCalls(Number(e.target.value))} className="w-full p-2 border rounded" />
      </div>
      <div className="flex justify-end">
        <button onClick={() => alert('Saved (mock)')} className="px-4 py-2 bg-yellow-100 rounded">Save</button>
      </div>
    </div>
  );
}

// ------ System Tab ------
function SystemTab({ logs, logFilter, setLogFilter, logLevelFilter, setLogLevelFilter }) {
  const [logVisualization, setLogVisualization] = useState("table");
  
  // Count logs by level
  const logCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {});
  
  const logLevelData = Object.keys(logCounts).map(level => ({
    level,
    count: logCounts[level],
    fill: level === 'ERROR' ? '#EF4444' : level === 'WARN' ? '#F59E0B' : '#10B981'
  }));
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">System Logs</h2>
        <div className="flex gap-2 items-center">
          <select 
            value={logVisualization} 
            onChange={(e) => setLogVisualization(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="table">Table View</option>
            <option value="chart">Chart View</option>
          </select>
          <input 
            placeholder="Filter logs..." 
            value={logFilter} 
            onChange={(e) => setLogFilter(e.target.value)} 
            className="px-3 py-2 border rounded" 
          />
          <select 
            value={logLevelFilter} 
            onChange={(e) => setLogLevelFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="ALL">All Levels</option>
            <option value="ERROR">Errors</option>
            <option value="WARN">Warnings</option>
            <option value="INFO">Info</option>
          </select>
          <button className="px-3 py-2 rounded bg-gray-100">Export</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card label="Total Logs" value={logs.length} icon="📜" />
        <Card label="Errors" value={logCounts.ERROR || 0} icon="❗" />
        <Card label="Warnings" value={logCounts.WARN || 0} icon="⚠️" />
        <Card label="Info" value={logCounts.INFO || 0} icon="ℹ️" />
      </div>
      
      {logVisualization === "chart" ? (
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Log Distribution by Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={logLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count, percent }) => `${level}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {logLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className={`border-b ${l.level==='ERROR' ? 'bg-red-50' : l.level==='WARN' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-3 py-2">{new Date(l.time).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <Badge className={
                      l.level === 'ERROR' ? 'bg-red-500 text-white' : 
                      l.level === 'WARN' ? 'bg-yellow-500 text-white' : 
                      'bg-blue-500 text-white'
                    }>
                      {l.level}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">{l.source}</td>
                  <td className="px-3 py-2">{l.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------ Database Tab ------
function DatabaseTab() {
  const [dbMetrics, setDbMetrics] = useState({
    storage: { used: 120, total: 500 },
    performance: { readTime: 25, writeTime: 45, queryTime: 120 },
    backups: { lastBackup: "2025-07-15T02:30:00Z", autoBackup: true, retention: "30 days" }
  });
  
  const storageData = [
    { name: "Used", value: dbMetrics.storage.used, fill: COLORS[0] },
    { name: "Available", value: dbMetrics.storage.total - dbMetrics.storage.used, fill: COLORS[4] },
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Database Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card label="Storage Used" value={`${dbMetrics.storage.used}GB / ${dbMetrics.storage.total}GB`} icon="💾" />
        <Card label="Avg Query Time" value={`${dbMetrics.performance.queryTime}ms`} icon="⏱️" />
        <Card label="Last Backup" value={new Date(dbMetrics.backups.lastBackup).toLocaleDateString()} icon="🔄" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Storage Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value}GB (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Read Time</span>
                <span>{dbMetrics.performance.readTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: `${(dbMetrics.performance.readTime / 100) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Write Time</span>
                <span>{dbMetrics.performance.writeTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: `${(dbMetrics.performance.writeTime / 100) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Query Time</span>
                <span>{dbMetrics.performance.queryTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: `${(dbMetrics.performance.queryTime / 200) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h3 className="font-semibold mb-3">Backup Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium mb-1">Last Backup</div>
            <div>{new Date(dbMetrics.backups.lastBackup).toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium mb-1">Auto Backup</div>
            <div>{dbMetrics.backups.autoBackup ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium mb-1">Retention Period</div>
            <div>{dbMetrics.backups.retention}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ Settings Tab ------
function SettingsTab({ openRbacModal, openApiKeyModal }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordComplexity: 'medium',
    },
    appearance: {
      theme: 'light',
      accentColor: 'yellow',
      compactMode: false,
    }
  });
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>
      
      <div className="bg-white rounded-xl p-4 shadow space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Notification Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm opacity-70">Receive notifications via email</div>
              </div>
              <button 
                onClick={() => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: !prev.notifications.email }
                }))}
                className={`px-3 py-1 rounded ${settings.notifications.email ? 'bg-yellow-100' : 'bg-gray-100'}`}
              >
                {settings.notifications.email ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm opacity-70">Receive push notifications in browser</div>
              </div>
              <button 
                onClick={() => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: !prev.notifications.push }
                }))}
                className={`px-3 py-1 rounded ${settings.notifications.push ? 'bg-yellow-100' : 'bg-gray-100'}`}
              >
                {settings.notifications.push ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm opacity-70">Receive notifications via SMS</div>
              </div>
              <button 
                onClick={() => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms: !prev.notifications.sms }
                }))}
                className={`px-3 py-1 rounded ${settings.notifications.sms ? 'bg-yellow-100' : 'bg-gray-100'}`}
              >
                {settings.notifications.sms ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Security Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm opacity-70">Add an extra layer of security</div>
              </div>
              <button 
                onClick={() => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, twoFactor: !prev.security.twoFactor }
                }))}
                className={`px-3 py-1 rounded ${settings.security.twoFactor ? 'bg-yellow-100' : 'bg-gray-100'}`}
              >
                {settings.security.twoFactor ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm opacity-70">Automatically log out after inactivity</div>
              </div>
              <select 
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="px-3 py-1 border rounded"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Password Complexity</div>
                <div className="text-sm opacity-70">Require complex passwords</div>
              </div>
              <select 
                value={settings.security.passwordComplexity}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, passwordComplexity: e.target.value }
                }))}
                className="px-3 py-1 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Appearance</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm opacity-70">Choose your preferred theme</div>
              </div>
              <select 
                value={settings.appearance.theme}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, theme: e.target.value }
                }))}
                className="px-3 py-1 border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Accent Color</div>
                <div className="text-sm opacity-70">Choose your accent color</div>
              </div>
              <select 
                value={settings.appearance.accentColor}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, accentColor: e.target.value }
                }))}
                className="px-3 py-1 border rounded"
              >
                <option value="yellow">Yellow</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compact Mode</div>
                <div className="text-sm opacity-70">Use a more compact layout</div>
              </div>
              <button 
                onClick={() => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, compactMode: !prev.appearance.compactMode }
                }))}
                className={`px-3 py-1 rounded ${settings.appearance.compactMode ? 'bg-yellow-100' : 'bg-gray-100'}`}
              >
                {settings.appearance.compactMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button onClick={() => alert('Settings saved (mock)')} className="px-4 py-2 bg-yellow-100 rounded">Save Settings</button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Manage Roles & Permissions</div>
            <div className="text-sm opacity-70">Role-Based Access Control</div>
          </div>
          <div>
            <button onClick={openRbacModal} className="px-3 py-2 rounded bg-yellow-100">Open RBAC</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">API Keys</div>
            <div className="text-sm opacity-70">Create or revoke keys</div>
          </div>
          <div>
            <button onClick={openApiKeyModal} className="px-3 py-2 rounded bg-gray-100">API Key Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ Deployment Tab ------
function DeploymentTab({ triggerDataSync, syncing }) {
  const [deploymentStatus, setDeploymentStatus] = useState({
    currentVersion: "1.2.3",
    lastDeployment: "2025-07-10T14:30:00Z",
    environment: "production",
    health: "healthy",
    uptime: "15 days"
  });
  
  const [deploymentHistory, setDeploymentHistory] = useState([
    { id: 1, version: "1.2.3", date: "2025-07-10T14:30:00Z", status: "success", deployedBy: "John Doe" },
    { id: 2, version: "1.2.2", date: "2025-06-25T09:15:00Z", status: "success", deployedBy: "Jane Smith" },
    { id: 3, version: "1.2.1", date: "2025-06-10T16:45:00Z", status: "success", deployedBy: "Mike Johnson" },
    { id: 4, version: "1.2.0", date: "2025-05-28T11:20:00Z", status: "failed", deployedBy: "Sarah Williams" },
  ]);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Deployment Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card label="Current Version" value={deploymentStatus.currentVersion} icon="🏷️" />
        <Card label="Environment" value={deploymentStatus.environment} icon="🌍" />
        <Card label="Health Status" value={deploymentStatus.health} icon="💚" />
        <Card label="Uptime" value={deploymentStatus.uptime} icon="⏱️" />
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h3 className="font-semibold mb-3">Deployment Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-yellow-100 rounded flex items-center justify-center gap-2">
            <span>🚀</span>
            <span>Deploy New Version</span>
          </button>
          <button className="px-4 py-3 bg-gray-100 rounded flex items-center justify-center gap-2">
            <span>🔄</span>
            <span>Rollback Version</span>
          </button>
          <button onClick={triggerDataSync} className="px-4 py-3 bg-blue-500 text-white rounded flex items-center justify-center gap-2">
            <span>🔄</span>
            <span>{syncing ? 'Syncing...' : 'Trigger Data Sync'}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">Deployment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Version</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Deployed By</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deploymentHistory.map(deployment => (
                <tr key={deployment.id} className="border-b last:border-0 hover:bg-yellow-50">
                  <td className="px-4 py-3 font-medium">{deployment.version}</td>
                  <td className="px-4 py-3">{new Date(deployment.date).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge className={deployment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {deployment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{deployment.deployedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded bg-gray-100">Details</button>
                      {deployment.status === 'success' && (
                        <button className="px-3 py-1 rounded bg-gray-100">Rollback</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ------ RBAC Manager (modal) ------
function RbacManager({ users, setUsers }) {
  const [localUsers, setLocalUsers] = useState(users);
  const [permissions, setPermissions] = useState({
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
    analyst: ['read', 'write', 'view_analytics'],
    user: ['read']
  });

  useEffect(() => setLocalUsers(users), [users]);

  const changeRole = (id, role) => setLocalUsers((p) => p.map(u => u.id === id ? { ...u, role } : u));
  const save = () => {
    setUsers(localUsers);
    alert('Saved RBAC (mock)');
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Role Permissions</h3>
        <div className="space-y-2">
          {Object.entries(permissions).map(([role, perms]) => (
            <div key={role} className="bg-gray-50 p-3 rounded">
              <div className="font-medium capitalize mb-1">{role}</div>
              <div className="flex flex-wrap gap-2">
                {perms.map(perm => (
                  <Badge key={perm} className="bg-gray-200 text-gray-800">
                    {perm.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">User Roles</h3>
        <div className="space-y-2">
          {localUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">{u.name}</div>
              <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="px-2 py-1 border rounded">
                <option>Admin</option>
                <option>Analyst</option>
                <option>User</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button onClick={save} className="px-4 py-2 bg-yellow-100 rounded">Save Roles</button>
      </div>
    </div>
  );
}

// ------ API Key Manager (modal) ------
function ApiKeyManager({ apiKeys, createApiKey, revokeApiKey }) {
  const [name, setName] = useState('');
  const [showKey, setShowKey] = useState({});
  
  const toggleShowKey = (id) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Key name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (name.trim()) { createApiKey(name.trim()); setName(''); } }} className="px-3 py-2 bg-yellow-100 rounded">Create Key</button>
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <div className="font-semibold mb-2">Existing Keys</div>
        <div className="space-y-2">
          {apiKeys.map(k => (
            <div key={k.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-semibold text-sm">{k.name}</div>
                <div className="text-xs opacity-70">Created: {k.created}</div>
                <div className="text-xs opacity-70">Last Used: {new Date(k.lastUsed).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {showKey[k.id] ? k.key : k.key.substring(0, 8) + '...'}
                </div>
                <button onClick={() => toggleShowKey(k.id)} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {showKey[k.id] ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => navigator.clipboard?.writeText(k.key)} className="px-2 py-1 bg-gray-100 rounded text-xs">Copy</button>
                <button onClick={() => revokeApiKey(k.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

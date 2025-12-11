// src/pages/AdminDashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from "recharts";

/*
  Complete AdminDashboard.jsx - single-file milestone-1 frontend
  - No backend calls (mocked)
  - Logout clears localStorage and navigates to /login
  - Enhanced with yellow color accents in side navigation
  - Removed API Usage and Security tabs
*/

const INITIAL_TREND = [
  { month: "Jan", value: 1350 },
  { month: "Feb", value: 820 },
  { month: "Mar", value: 1480 },
  { month: "Apr", value: 1020 },
  { month: "May", value: 1600 },
  { month: "Jun", value: 1280 },
];

const INITIAL_USERS = [
  { id: 1, name: "Alice Baker", email: "alice@example.com", role: "User" },
  { id: 2, name: "Brian Cox", email: "brian@example.com", role: "Analyst" },
  { id: 3, name: "Carla Diaz", email: "carla@example.com", role: "Admin" },
];

const INITIAL_LOGS = [
  { id: 1, time: "2025-12-09 12:01:22", level: "INFO", msg: "GET /api/status — 200 OK" },
  { id: 2, time: "2025-12-09 12:02:11", level: "INFO", msg: "POST /sync/import — 201 Created" },
  { id: 3, time: "2025-12-09 12:05:33", level: "INFO", msg: "GET /api/usage — 200 OK" },
  { id: 4, time: "2025-12-09 12:10:02", level: "ERROR", msg: "Timeout contacting EPO API" },
  { id: 5, time: "2025-12-09 12:12:55", level: "WARN", msg: "High latency on USPTO" },
];

const INITIAL_API_KEYS = [
  { id: "k1", name: "WIPO Key", key: "••••••••", active: true },
  { id: "k2", name: "Analytics Key", key: "•••••••••", active: false },
];

// Define color accents for charts
const ACCENTS = ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7", "#FFFBEB"];

// Define months for charts
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Define years for timeline
const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"];

// Simple SVG Icon Components (replacing lucide-react)
const Bell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M1.54 14.04l4.24-4.24M18.46 14.04l4.24-4.24"></path>
  </svg>
);

const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Shield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const BarChart2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10"></path>
    <path d="M12 20V4"></path>
    <path d="M6 20v-6"></path>
  </svg>
);

const Database = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const RefreshCw = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const Upload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const Edit2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Plus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const LogIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

// Button component
function Btn({ children, className = "", onClick }) {
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("overview");

  // Profile
  const [profileName, setProfileName] = useState("Admin User");
  const [profileEmail, setProfileEmail] = useState("admin@example.com");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Users
  const [users, setUsers] = useState(INITIAL_USERS);
  const [userForm, setUserForm] = useState({ id: null, name: "", email: "", role: "User" });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // API Keys
  const [apiKeys, setApiKeys] = useState(INITIAL_API_KEYS);

  // Logs
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [logLevel, setLogLevel] = useState("ALL");
  const [logSearch, setLogSearch] = useState("");

  // Health & trend & sync
  const [health] = useState({
    WIPO: { uptime: "99.99%", latency: 120, status: "OK" },
    USPTO: { uptime: "99.95%", latency: 210, status: "OK" },
    EPO: { uptime: "98.70%", latency: 540, status: "Degraded" },
  });
  const [trendData] = useState(INITIAL_TREND);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | running | success | error

  // Additional state for new components
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Sync activeTab with window global for navigation
  useEffect(() => {
    window.__analytics_active_tab = activePage;
  }, [activePage]);
  
  // Sync nav button events
  useEffect(() => {
    const onTab = (e) => setActivePage(e.detail || "overview");
    window.addEventListener("analytics-tab-change", onTab);
    return () => window.removeEventListener("analytics-tab-change", onTab);
  }, []);

  // Define all tabs for navigation (removed API Usage and Security)
  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart2 /> },
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    { id: "users", label: "User Management", icon: <Users /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 /> },
    { id: "settings", label: "Settings", icon: <Settings /> },
    { id: "search-filters", label: "Advanced Search", icon: <SearchIcon /> },
    { id: "visualization", label: "Visualization Engine", icon: <BarChart2 /> },
    { id: "competitor", label: "Competitor Analytics", icon: <Users /> },
    { id: "portfolio", label: "Portfolio Tracker", icon: <Database /> },
    { id: "export", label: "Export Tools", icon: <Upload /> }
  ];

  // Render appropriate page based on activePage
  const renderPage = () => {
    switch (activePage) {
      case "overview": 
        return <OverviewPage 
          trendData={trendData} 
          health={health} 
          onTriggerSync={triggerDataSync} 
          syncStatus={syncStatus} 
          logs={visibleLogs} 
          clearLogs={clearLogs} 
          setLogLevel={setLogLevel} 
          setLogSearch={setLogSearch} 
        />;
      case "profile": 
        return <ProfilePage
          name={profileName}
          setName={setProfileName}
          email={profileEmail}
          setEmail={setProfileEmail}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />;
      case "users": 
        return <UserManagementPage
          users={filteredUsers}
          usersRaw={users}
          search={userSearch}
          setSearch={setUserSearch}
          form={userForm}
          setForm={setUserForm}
          isEditing={isEditingUser}
          onSubmit={handleUserSubmit}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          resetForm={resetUserForm}
        />;
      case "analytics": 
        return <Placeholder title="Analytics" description="Charts, exports, and scheduled reports." />;
      case "settings": 
        return <SettingsPage 
          apiKeys={apiKeys} 
          toggleApiKey={toggleApiKey} 
          createApiKey={createApiKey} 
          onTriggerSync={triggerDataSync} 
          syncStatus={syncStatus} 
        />;
      case "search-filters": 
        return <AdvancedSearchFilters setActivePage={setActivePage} />;
      case "visualization": 
        return <VisualizationEngine />;
      case "competitor": 
        return <CompetitorAnalytics />;
      case "portfolio": 
        return <PortfolioTracker />;
      case "export": 
        return <Placeholder title="Export Tools" description="Export functionality will be available in next release." />;
      default: 
        return <OverviewPage 
          trendData={trendData} 
          health={health} 
          onTriggerSync={triggerDataSync} 
          syncStatus={syncStatus} 
          logs={visibleLogs} 
          clearLogs={clearLogs} 
          setLogLevel={setLogLevel} 
          setLogSearch={setLogSearch} 
        />;
    }
  };

  /* -------------------- USER MGMT FUNCTIONS -------------------- */

  function resetUserForm() {
    setUserForm({ id: null, name: "", email: "", role: "User" });
    setIsEditingUser(false);
  }

  function handleUserSubmit(e) {
    e?.preventDefault?.();
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert("Please enter name and email.");
      return;
    }
    if (isEditingUser) {
      setUsers((prev) => prev.map((u) => (u.id === userForm.id ? { ...userForm } : u)));
    } else {
      const newUser = { ...userForm, id: Date.now() };
      setUsers((prev) => [newUser, ...prev]);
    }
    resetUserForm();
  }

  function handleEditUser(u) {
    setUserForm(u);
    setIsEditingUser(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteUser(id) {
    if (!window.confirm("Delete user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [users, userSearch]);

  /* -------------------- API KEY FUNCTIONS -------------------- */

  function toggleApiKey(id) {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, active: !k.active } : k)));
  }

  function createApiKey() {
    const id = `k${Date.now()}`;
    setApiKeys((prev) => [{ id, name: `New Key ${prev.length + 1}`, key: "••••••••", active: true }, ...prev]);
  }

  /* -------------------- LOGS FUNCTIONS -------------------- */

  function clearLogs() {
    if (!window.confirm("Clear all logs?")) return;
    setLogs([]);
  }

  const visibleLogs = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    return logs.filter((l) => (logLevel === "ALL" || l.level === logLevel) && (!q || l.msg.toLowerCase().includes(q)));
  }, [logs, logLevel, logSearch]);

  /* -------------------- SYNC MOCK -------------------- */

  async function triggerDataSync() {
    setSyncStatus("running");
    try {
      // Mock backend call
      await new Promise((res) => setTimeout(res, 1200));
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 1300);
      alert("Data sync started (mock).");
    } catch (err) {
      setSyncStatus("error");
    }
  }

  /* -------------------- LOGOUT -------------------- */
  function logout() {
    // Clear stored auth (if any) and redirect. Safe for Milestone-1.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  /* -------------------- RENDER -------------------- */
  return (
    <div className="flex h-screen bg-gray-100 text-slate-900">
      {/* Sidebar with enhanced yellow color scheme */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-gradient-to-b from-yellow-50 to-white shadow-xl p-6 flex flex-col transition-all duration-300 border-r-4 border-yellow-400`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold shadow-lg">IP</div>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-800">Global IP Platform</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map(tab => (
            <SidebarItem 
              key={tab.id}
              label={tab.label} 
              icon={tab.icon} 
              active={activePage === tab.id} 
              onClick={() => setActivePage(tab.id)} 
            />
          ))}
        </nav>

        <div className="space-y-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            {sidebarOpen ? <Settings /> : <BarChart2 />}
            {sidebarOpen && "Toggle Sidebar"}
          </button>

          <button onClick={logout} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
            <LogIn /> {sidebarOpen && "Logout"}
          </button>
        </div>

        {sidebarOpen && <p className="mt-6 text-xs text-gray-400">Version 1.0.0</p>}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Topbar name={profileName} email={profileEmail} />

        {/* Pages */}
        {renderPage()}

        <div className="h-20" />
      </main>
    </div>
  );
}

/* -------------------- Small UI components -------------------- */

function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
      active 
        ? "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 font-semibold shadow-sm border-l-4 border-yellow-500" 
        : "hover:bg-yellow-50 text-gray-700 hover:text-yellow-700"
    }`}>
      <span className={`${active ? "text-yellow-700" : "text-yellow-600"}`}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Topbar({ name, email }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 rounded-xl shadow-md">
        <input className="flex-1 bg-transparent placeholder-white focus:outline-none text-white" placeholder="Quick search patents, assignees..." />
        <button className="ml-3 bg-white text-yellow-700 px-4 py-1 rounded font-semibold hover:bg-yellow-50 transition">Search</button>
      </div>

      <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-yellow-500 px-5 py-2 rounded-xl text-white shadow-md">
        <Bell />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm">{email}</p>
        </div>
        <div className="bg-white text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">AD</div>
      </div>
    </div>
  );
}

/* -------------------- Overview Page -------------------- */
function OverviewPage({ trendData, health, onTriggerSync, syncStatus, logs, clearLogs, setLogLevel, setLogSearch }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="API Requests (24h)" value="12,430" />
        <StatCard title="Active Users" value="312" />
        <StatCard title="Failed Requests" value="43" />
        <StatCard title="Server Status" value="Operational" textColor="text-green-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">API Request Trends</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f5a623" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* API Health */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Health Monitor</h2>
          <ApiHealthRow name="WIPO" data={health.WIPO} />
          <ApiHealthRow name="USPTO" data={health.USPTO} />
          <ApiHealthRow name="EPO" data={health.EPO} />
        </div>

        {/* Logs */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">System Logs</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => { setLogLevel("ALL"); setLogSearch(""); }} className="px-3 py-1 rounded bg-gray-100">Reset</button>
              <button onClick={clearLogs} className="px-3 py-1 rounded bg-red-100 text-red-600">Clear</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <input placeholder="Search logs..." onChange={(e) => setLogSearch(e.target.value)} className="border p-2 rounded w-full" />
            <select onChange={(e) => setLogLevel(e.target.value)} className="border p-2 rounded">
              <option value="ALL">All</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warn</option>
              <option value="ERROR">Error</option>
            </select>
          </div>

          <div className="bg-black text-green-400 p-3 h-56 overflow-y-auto font-mono text-sm rounded-lg">
            {logs.length === 0 ? <div className="text-gray-400">No logs</div> : logs.map((l) => <div key={l.id}>[{l.time}] {l.level} — {l.msg}<br /></div>)}
          </div>

          <div className="mt-4 flex gap-3 items-center">
            <button onClick={onTriggerSync} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:from-yellow-500 hover:to-yellow-600 transition">
              <RefreshCw /> {syncStatus === "running" ? "Syncing..." : "Trigger Data Sync"}
            </button>
            <span className="text-sm text-gray-500">Sync status: {syncStatus}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------- Profile Page -------------------- */
function ProfilePage({ name, setName, email, setEmail, oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword }) {
  function saveProfile(e) {
    e?.preventDefault?.();
    alert("Profile saved (mock).");
  }
  function changePassword(e) {
    e?.preventDefault?.();
    if (!newPassword) return alert("Enter new password");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    alert("Password updated (mock).");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-yellow-600">Admin Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white flex items-center justify-center text-3xl font-bold">{(name || "A").charAt(0)}</div>
        <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
          <Upload /> Upload New Photo
          <input type="file" className="hidden" />
        </label>
      </div>

      <form onSubmit={saveProfile} className="mb-8 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-100 rounded mt-1" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-100 rounded mt-1" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded hover:from-yellow-500 hover:to-yellow-600 transition">Save Profile</button>
          <button type="button" onClick={() => { setName("Admin User"); setEmail("admin@example.com"); }} className="px-4 py-2 bg-gray-100 rounded">Reset</button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Old Password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-3 bg-gray-100 rounded mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 bg-gray-100 rounded mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-100 rounded mt-1" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded hover:from-yellow-500 hover:to-yellow-600 transition">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- User Management Page -------------------- */
function UserManagementPage({ users, usersRaw, search, setSearch, form, setForm, isEditing, onSubmit, onEdit, onDelete, resetForm }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="text-sm text-gray-500">Create / update / delete users & roles</div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-3 gap-3 mb-4">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="p-2 bg-gray-100 rounded col-span-1" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="p-2 bg-gray-100 rounded col-span-1" />
          <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className="p-2 bg-gray-100 rounded">
            <option>User</option>
            <option>Analyst</option>
            <option>Admin</option>
          </select>

          <div className="col-span-3 flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition">{isEditing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
          </div>
        </form>

        <div className="mb-3">
          <div className="relative">
            <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 pl-10 bg-gray-100 rounded" />
            <div className="absolute left-3 top-2 text-gray-400"><SearchIcon /></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-xs text-gray-500">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => onEdit(u)} className="p-2 rounded bg-blue-500 text-white"><Edit2 /></button>
                    <button onClick={() => onDelete(u.id)} className="p-2 rounded bg-red-500 text-white"><Trash2 /></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No users</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Settings Page -------------------- */
function SettingsPage({ apiKeys, toggleApiKey, createApiKey, onTriggerSync, syncStatus }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">API Key Settings</h2>
          <div>
            <button onClick={createApiKey} className="px-3 py-1 rounded bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition"><Plus /> New</button>
          </div>
        </div>

        <div className="space-y-2">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{k.name}</div>
                <div className="text-xs text-gray-500">{k.key}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleApiKey(k.id)} className={`px-3 py-1 rounded ${k.active ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" : "bg-gray-200 text-gray-700"}`}>{k.active ? "Enabled" : "Disabled"}</button>
                <button className="p-2 bg-gray-100 rounded"><Edit2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Admin Actions</h2>
        <div className="flex gap-3">
          <button onClick={onTriggerSync} className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition"><RefreshCw /> Trigger Data Sync</button>
          <p className="self-center text-sm text-gray-500">Trigger backend sync job (Spring Boot)</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Utility components -------------------- */
function StatCard({ title, value, textColor = "" }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function ApiHealthRow({ name, data }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-500">Latency: {data.latency}ms</div>
      </div>
      <div className="text-right">
        <div className={`font-mono ${data.status === "Degraded" ? "text-yellow-500" : "text-green-600"}`}>{data.uptime}</div>
        <div className="text-xs text-gray-400">{data.status}</div>
      </div>
    </div>
  );
}

function Placeholder({ title, description }) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

/* --- Advanced Search Filters --- */
function AdvancedSearchFilters({ setActivePage }) {
  const [searchType, setSearchType] = useState("patent");
  const [filters, setFilters] = useState({
    technology: "",
    assignee: "",
    dateRange: "",
    status: "",
    jurisdiction: "",
    keywords: "",
    citations: "",
    familyId: ""
  });
  const [savedFilters, setSavedFilters] = useState([]);
  
  const handleSaveFilter = () => {
    // In a real app, this would apply filter to search
    alert("Filter applied successfully");
    setSavedFilters(prev => [
      { id: Date.now(), name: "Custom Filter " + (prev.length + 1), filters, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };
  
  const handleApplyFilter = () => {
    // In a real app, this would apply filter to search
    alert("Filter applied successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Search Filters</h3>
        <div className="flex gap-2">
          <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" onClick={handleApplyFilter}>Apply Filters</Btn>
          <Btn className="bg-white border" onClick={() => setFilters({
    technology: "",
    assignee: "",
    dateRange: "",
    status: "",
    jurisdiction: "",
    keywords: "",
    citations: "",
    familyId: ""
  })}>Reset</Btn>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Search Type</h4>
          <div className="space-y-2">
            {["patent", "application", "publication", "legal"].map(type => (
              <label key={type} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  checked={searchType === type}
                  onChange={() => setSearchType(type)}
                  className="text-yellow-600"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Filter Options</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Technology</label>
              <select
                value={filters.technology}
                onChange={(e) => setFilters({...filters, technology: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Technologies</option>
                <option value="ai">AI & ML</option>
                <option value="iot">IoT</option>
                <option value="blockchain">Blockchain</option>
                <option value="biotech">Biotech</option>
                <option value="quantum">Quantum</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <input
                type="text"
                value={filters.assignee}
                onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                placeholder="Company or inventor name"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="granted">Granted</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jurisdiction</label>
              <select
                value={filters.jurisdiction}
                onChange={(e) => setFilters({...filters, jurisdiction: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Jurisdictions</option>
                <option value="us">United States</option>
                <option value="ep">Europe</option>
                <option value="cn">China</option>
                <option value="jp">Japan</option>
                <option value="kr">South Korea</option>
                <option value="wo">World Intellectual Property</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                placeholder="Enter keywords separated by commas"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Citations</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.citationsMin}
                  onChange={(e) => setFilters({...filters, citationsMin: e.target.value})}
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  value={filters.citationsMax}
                  onChange={(e) => setFilters({...filters, citationsMax: e.target.value})}
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Family ID</label>
              <input
                type="text"
                value={filters.familyId}
                onChange={(e) => setFilters({...filters, familyId: e.target.value})}
                placeholder="Enter patent family ID"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Btn onClick={handleSaveFilter} className="bg-white border">Save Filter</Btn>
            <Btn onClick={handleApplyFilter} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition">Apply Filter</Btn>
          </div>
        </div>
      </div>
      
      {savedFilters.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Saved Filters</h4>
          <div className="space-y-2">
            {savedFilters.map(saved => (
              <div key={saved.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">{saved.name}</span>
                <div className="text-sm text-gray-500">
                  Saved {new Date(saved.timestamp).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Btn className="text-xs bg-white border" onClick={() => {
                    setFilters(saved.filters);
                    setActivePage("search");
                  }}>Load</Btn>
                  <Btn className="text-xs bg-white border" onClick={() => {
                    setSavedFilters(prev => prev.filter(s => s.id !== saved.id));
                  }}>Remove</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Visualization Engine --- */
function VisualizationEngine() {
  const [chartType, setChartType] = useState("line");
  const [dataSource, setDataSource] = useState("patents");
  const [timeRange, setTimeRange] = useState("1year");
  const [selectedMetrics, setSelectedMetrics] = useState(["filings", "grants"]);
  const [chartConfig, setChartConfig] = useState({
    title: "Patent Analytics Visualization",
    showLegend: true,
    showGrid: true,
    animationDuration: 1000,
    colorScheme: "yellow"
  });
  
  const availableMetrics = {
    patents: [
      { id: "filings", name: "Patent Filings" },
      { id: "grants", name: "Patent Grants" },
      { id: "citations", name: "Citations" },
      { id: "families", name: "Patent Families" },
      { id: "renewals", name: "Renewals" }
    ],
    market: [
      { id: "share", name: "Market Share" },
      { id: "growth", name: "Growth Rate" },
      { id: "value", name: "Portfolio Value" },
      { id: "roi", name: "ROI" }
    ],
    technology: [
      { id: "trends", name: "Technology Trends" },
      { id: "adoption", name: "Adoption Rate" },
      { id: "maturity", name: "Technology Maturity" },
      { id: "emergence", name: "Emergence Score" }
    ]
  };
  
  const chartTypes = [
    { id: "line", name: "Line Chart", icon: "📈" },
    { id: "bar", name: "Bar Chart", icon: "📊" },
    { id: "pie", name: "Pie Chart", icon: "🥧" },
    { id: "area", name: "Area Chart", icon: "📉" },
    { id: "radar", name: "Radar Chart", icon: "🎯" },
    { id: "scatter", name: "Scatter Plot", icon: "⚡" },
    { id: "heatmap", name: "Heatmap", icon: "🔥" }
  ];
  
  const handleExportChart = () => {
    // In a real app, this would export chart as an image or data
    alert("Chart exported successfully");
  };
  
  const handleSaveConfig = () => {
    // In a real app, this would save chart configuration
    alert("Configuration saved successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visualization Engine</h3>
        <div className="flex gap-2">
          <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" onClick={handleExportChart}>Generate Visualization</Btn>
          <Btn className="bg-white border">Export</Btn>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Chart Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(type => (
              <div
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`p-3 rounded-lg border cursor-pointer text-center ${
                  chartType === type.id ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm">{type.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Data Source</h4>
          <div className="space-y-2">
            {["patents", "market", "technology"].map(source => (
              <label key={source} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="radio"
                  name="dataSource"
                  checked={dataSource === source}
                  onChange={() => setDataSource(source)}
                  className="text-yellow-600"
                />
                <span className="capitalize">{source}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Time Range</h4>
          <div className="space-y-2">
            {["3months", "6months", "1year", "2years", "5years", "all"].map(range => (
              <label key={range} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="radio"
                  name="timeRange"
                  checked={timeRange === range}
                  onChange={() => setTimeRange(range)}
                  className="text-yellow-600"
                />
                <span>
                  {range === "3months" && "Last 3 Months"}
                  {range === "6months" && "Last 6 Months"}
                  {range === "1year" && "Last Year"}
                  {range === "2years" && "Last 2 Years"}
                  {range === "5years" && "Last 5 Years"}
                  {range === "all" && "All Time"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Metrics</h4>
          <div className="space-y-2">
            {availableMetrics[dataSource].map(metric => (
              <label key={metric.id} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => {
                    if (selectedMetrics.includes(metric.id)) {
                      setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                    } else {
                      setSelectedMetrics([...selectedMetrics, metric.id]);
                    }
                  }}
                  className="text-yellow-600"
                />
                <span>{metric.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Chart Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={chartConfig.title}
                onChange={(e) => setChartConfig({...chartConfig, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={chartConfig.showLegend}
                  onChange={() => setChartConfig({...chartConfig, showLegend: !chartConfig.showLegend})}
                  className="text-yellow-600"
                />
                <span className="text-sm">Show Legend</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={chartConfig.showGrid}
                  onChange={() => setChartConfig({...chartConfig, showGrid: !chartConfig.showGrid})}
                  className="text-yellow-600"
                />
                <span className="text-sm">Show Grid</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Animation Duration (ms)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={chartConfig.animationDuration}
                  onChange={(e) => setChartConfig({...chartConfig, animationDuration: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-center text-sm">{chartConfig.animationDuration}ms</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Color Scheme</label>
              <div className="grid grid-cols-3 gap-2">
                {["yellow", "blue", "green", "purple", "red", "gray"].map(color => (
                  <div
                    key={color}
                    onClick={() => setChartConfig({...chartConfig, colorScheme: color})}
                    className={`p-2 rounded cursor-pointer text-center ${
                      chartConfig.colorScheme === color ? "border-2 border-" + color : "border border-gray-200"
                    }`}
                  >
                    <div className={`w-6 h-6 bg-${color}-400 rounded-full`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Btn onClick={handleSaveConfig} className="bg-white border">Save Configuration</Btn>
        <Btn onClick={handleExportChart} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition">Export Chart</Btn>
      </div>
    </div>
  );
}

/* --- Competitor Analytics Module --- */
function CompetitorAnalytics() {
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [comparisonType, setComparisonType] = useState("technology");
  const [timeframe, setTimeframe] = useState("yearly");
  const [analysisType, setAnalysisType] = useState("overview");
  
  const competitors = [
    { id: 1, name: "TechCorp", industry: "AI/ML", portfolioSize: 1245, growth: 12.3, marketShare: 18.5 },
    { id: 2, name: "InnovateLab", industry: "IoT", portfolioSize: 987, growth: 8.7, marketShare: 15.2 },
    { id: 3, name: "FutureSystems", industry: "Blockchain", portfolioSize: 756, growth: -3.2, marketShare: 12.1 },
    { id: 4, name: "SmartTech", industry: "Security", portfolioSize: 634, growth: 15.8, marketShare: 9.7 },
    { id: 5, name: "BioInnovations", industry: "Biotech", portfolioSize: 523, growth: 6.4, marketShare: 7.3 }
  ];
  
  const technologies = [
    { name: "AI/ML", trend: "up", change: 12.3 },
    { name: "IoT", trend: "up", change: 8.7 },
    { name: "Blockchain", trend: "down", change: -5.2 },
    { name: "Security", trend: "up", change: 15.8 },
    { name: "Biotech", trend: "up", change: 6.4 },
    { name: "Quantum", trend: "up", change: 24.1 },
    { name: "Robotics", trend: "stable", change: 0.3 }
  ];
  
  const handleCompareCompetitors = () => {
    // In a real app, this would perform a detailed comparison
    alert("Competitor comparison initiated");
  };
  
  const handleGenerateReport = () => {
    // In a real app, this would generate a detailed report
    alert("Competitor analysis report generated");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Competitor Analytics</h3>
        <div className="flex gap-2">
          <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" onClick={handleGenerateReport}>Generate Report</Btn>
          <Btn className="bg-white border">Export Data</Btn>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Select Competitors</h4>
          <div className="space-y-2">
            {competitors.map(competitor => (
              <label key={competitor.id} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCompetitors.includes(competitor.id)}
                  onChange={() => {
                    if (selectedCompetitors.includes(competitor.id)) {
                      setSelectedCompetitors(selectedCompetitors.filter(id => id !== competitor.id));
                    } else {
                      setSelectedCompetitors([...selectedCompetitors, competitor.id]);
                    }
                  }}
                  className="text-yellow-600"
                />
                <span>{competitor.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Comparison Type</h4>
          <div className="space-y-2">
            {["technology", "portfolio", "market", "growth"].map(type => (
              <label key={type} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="radio"
                  name="comparisonType"
                  checked={comparisonType === type}
                  onChange={() => setComparisonType(type)}
                  className="text-yellow-600"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-medium mb-3">Timeframe</h4>
          <div className="space-y-2">
            {["monthly", "quarterly", "yearly", "custom"].map(range => (
              <label key={range} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 cursor-pointer">
                <input
                  type="radio"
                  name="timeframe"
                  checked={timeframe === range}
                  onChange={() => setTimeframe(range)}
                  className="text-yellow-600"
                />
                <span className="capitalize">{range}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow">
        <h4 className="font-medium mb-3">Technology Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div key={index} className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{tech.name}</span>
                <span className={`text-sm ${tech.trend === "up" ? "text-green-600" : tech.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                  {tech.trend === "up" ? "↑" : tech.trend === "down" ? "↓" : "→"} {Math.abs(tech.change)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    tech.trend === "up" ? "bg-green-500" : 
                    tech.trend === "down" ? "bg-red-500" : 
                    "bg-gray-500"
                  }`} 
                  style={{width: `${Math.min(100, Math.max(10, 50 + tech.change * 2))}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition px-6" onClick={handleCompareCompetitors}>
          Compare Selected Competitors
        </Btn>
      </div>
    </div>
  );
}

/* --- Portfolio Tracker --- */
function PortfolioTracker() {
  const [portfolioView, setPortfolioView] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("1year");
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    value: 2540000,
    growth: 21.0,
    quality: 85.2,
    diversity: 72.5,
    risk: "medium"
  });
  
  const portfolioData = [
    { id: 1, name: "AI/ML Patents", value: 850000, count: 124, growth: 18.5, risk: "low" },
    { id: 2, name: "IoT Patents", value: 620000, count: 98, growth: 12.3, risk: "medium" },
    { id: 3, name: "Blockchain Patents", value: 480000, count: 76, growth: -5.2, risk: "high" },
    { id: 4, name: "Security Patents", value: 380000, count: 62, growth: 8.7, risk: "medium" },
    { id: 5, name: "Biotech Patents", value: 210000, count: 45, growth: 15.2, risk: "low" }
  ];
  
  const handleGenerateReport = () => {
    // In a real app, this would generate a detailed portfolio report
    alert("Portfolio report generated");
  };
  
  const handleScheduleReview = () => {
    // In a real app, this would schedule a portfolio review
    alert("Portfolio review scheduled");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Portfolio Tracker</h3>
        <div className="flex gap-2">
          <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" onClick={handleGenerateReport}>Generate Report</Btn>
          <Btn className="bg-white border">Schedule Review</Btn>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-2">Portfolio Value</h4>
          <div className="text-3xl font-bold text-yellow-700">${(portfolioMetrics.value / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-500 mt-1">+{portfolioMetrics.growth}% from last year</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-2">Portfolio Quality</h4>
          <div className="text-3xl font-bold text-yellow-700">{portfolioMetrics.quality}/100</div>
          <div className="text-sm text-gray-500 mt-1">Above industry average</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-2">Diversity Index</h4>
          <div className="text-3xl font-bold text-yellow-700">{portfolioMetrics.diversity}/100</div>
          <div className="text-sm text-gray-500 mt-1">Moderate diversity</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-2">Portfolio Risk</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Risk</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                portfolioMetrics.risk === "low" ? "bg-green-100 text-green-800" :
                portfolioMetrics.risk === "medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {portfolioMetrics.risk === "low" ? "Low" :
                 portfolioMetrics.risk === "medium" ? "Medium" : "High"}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Technology Concentration</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: "65%"}}></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Geographic Diversity</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: "40%"}}></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Patent Age</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: "25%"}}></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Renewal Risk</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{width: "35%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <select 
            value={portfolioView} 
            onChange={(e) => setPortfolioView(e.target.value)}
            className="px-3 py-2 rounded-md border"
          >
            <option value="overview">Overview</option>
            <option value="technology">By Technology</option>
            <option value="region">By Region</option>
            <option value="timeline">Timeline</option>
          </select>
          
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 rounded-md border"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="2years">Last 2 Years</option>
            <option value="5years">Last 5 Years</option>
          </select>
        </div>
      </div>
      
      {portfolioView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Portfolio Distribution</h4>
            <div style={{height: "300px"}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ACCENTS[index % ACCENTS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Portfolio Growth</h4>
            <div style={{height: "300px"}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHS.slice(0, 12).map((month, i) => ({
                  month,
                  value: 1000000 + i * 50000 + Math.random() * 20000
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Area type="monotone" dataKey="value" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {portfolioView === "technology" && (
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-3">Portfolio by Technology</h4>
          <div style={{height: "400px"}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {portfolioData.map(item => (
              <div key={item.id} className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">${(item.value / 1000000).toFixed(1)}M</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.risk === "low" ? "bg-green-100 text-green-800" :
                    item.risk === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {item.risk === "low" ? "Low" :
                       item.risk === "medium" ? "Medium" : "High"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {portfolioView === "region" && (
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-3">Portfolio by Region</h4>
          <div style={{height: "400px"}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { region: "North America", value: 1200000 },
                { region: "Europe", value: 850000 },
                { region: "Asia Pacific", value: 620000 },
                { region: "Rest of World", value: 320000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Bar dataKey="value" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {portfolioView === "timeline" && (
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="font-semibold mb-3">Portfolio Timeline</h4>
          <div style={{height: "400px"}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={YEARS.map(year => ({
                year,
                patents: 100 + Math.random() * 50,
                grants: 80 + Math.random() * 30,
                value: 1000000 + parseInt(year) * 200000 + Math.random() * 100000
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patents" stroke="#FBBF24" strokeWidth={2} />
                <Line type="monotone" dataKey="grants" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Btn className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition" onClick={handleGenerateReport}>Generate Report</Btn>
        <Btn className="bg-white border" onClick={handleScheduleReview}>Schedule Review</Btn>
      </div>
    </div>
  );
}
// src/components/IPDashboard.jsx
// Comprehensive IP Management Dashboard - Pro Max Version
// Requires: react, recharts, tailwindcss
// Paste whole content into src/components/IPDashboard.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";

/* --------------------------------------------------------------------------
  HELPERS & MOCK DATA
---------------------------------------------------------------------------*/

let _idCounter = 1000;
function genId(prefix = "id") {
  _idCounter += 1;
  return `${prefix}_${_idCounter}`;
}

function generatePatents(n = 50) {
  const techs = ["AI/ML", "Blockchain", "IoT", "Healthcare", "Energy", "Robotics", "Biotech", "Quantum"];
  const jurisdictions = ["US", "EP", "CN", "JP", "IN", "KR", "WO"];
  const statuses = ["Granted", "Pending", "Published", "Expired", "Abandoned"];
  const legalStatuses = ["Active", "Pending Examination", "Under Review", "Granted", "Expired", "Rejected"];

  return Array.from({ length: n }).map((_, i) => ({
    id: genId("patent"),
    number: `${jurisdictions[i % jurisdictions.length]}${2020000 + i}A1`,
    title: `Advanced ${techs[i % techs.length]} System and Method ${i + 1}`,
    abstract: `This patent describes an innovative approach to ${techs[i % techs.length].toLowerCase()} technology, providing significant improvements over existing solutions.`,
    assignee: ["TechCorp", "InnovateLab", "FutureSystems", "SmartTech", "BioInnovations"][i % 5],
    inventors: [`Dr. Smith ${i}`, `Prof. Johnson ${i}`],
    filingDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toISOString(),
    publicationDate: new Date(2021 + (i % 3), (i % 12), (i % 28) + 1).toISOString(),
    grantDate: i % 3 === 0 ? new Date(2022 + (i % 2), (i % 12), (i % 28) + 1).toISOString() : null,
    expiryDate: new Date(2040 + (i % 5), (i % 12), (i % 28) + 1).toISOString(),
    status: statuses[i % statuses.length],
    legalStatus: legalStatuses[i % legalStatuses.length],
    jurisdiction: jurisdictions[i % jurisdictions.length],
    technology: techs[i % techs.length],
    claims: Math.floor(10 + Math.random() * 30),
    citations: Math.floor(5 + Math.random() * 100),
    familyMembers: Math.floor(1 + Math.random() * 8),
    priority: ["High", "Medium", "Low"][i % 3],
    tags: [techs[i % techs.length], jurisdictions[i % jurisdictions.length]],
    value: Math.floor(100000 + Math.random() * 900000),
    renewalCost: Math.floor(1000 + Math.random() * 5000),
  }));
}

function generateSearchHistory() {
  const queries = ["AI patents", "Blockchain technology", "Medical devices", "Renewable energy", "Quantum computing"];
  return Array.from({ length: 10 }).map((_, i) => ({
    id: genId("search"),
    query: queries[i % queries.length],
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    results: Math.floor(10 + Math.random() * 100),
    filters: { technology: i % 2 === 0 ? "AI/ML" : "", jurisdiction: i % 3 === 0 ? "US" : "" },
  }));
}

function generateApiLogs() {
  const endpoints = ["/search", "/patents", "/analytics", "/export", "/details"];
  const methods = ["GET", "POST", "PUT", "DELETE"];
  return Array.from({ length: 30 }).map((_, i) => ({
    id: genId("api"),
    endpoint: endpoints[i % endpoints.length],
    method: methods[i % methods.length],
    status: [200, 201, 400, 404, 500][i % 5],
    responseTime: Math.floor(50 + Math.random() * 500),
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    user: `User${(i % 5) + 1}`,
    requestSize: Math.floor(100 + Math.random() * 1000),
    responseSize: Math.floor(500 + Math.random() * 5000),
  }));
}

function generateNotifications() {
  const types = ["new_filing", "expiry_alert", "status_change", "citation", "system"];
  const severities = ["info", "warning", "critical"];
  return Array.from({ length: 15 }).map((_, i) => ({
    id: genId("notif"),
    type: types[i % types.length],
    severity: severities[i % severities.length],
    title: [
      "New Patent Filing Detected",
      "Patent Expiry Approaching",
      "Legal Status Changed",
      "New Citation Received",
      "System Update Available"
    ][i % 5],
    message: `Detailed notification message ${i + 1} with relevant information about patent or system event.`,
    patentId: i % 3 === 0 ? `US${2020000 + i}A1` : null,
    timestamp: new Date(Date.now() - i * 7200000).toISOString(),
    read: i > 5,
    actions: ["View Details", "Dismiss", "Set Reminder"][i % 3],
  }));
}

/* --------------------------------------------------------------------------
  CONSTANTS / STYLES
---------------------------------------------------------------------------*/

const COLORS = ["#EAB308", "#F59E0B", "#FBBF24", "#FDE047", "#FEF08A", "#FACC15", "#EAB308", "#CA8A04"];
const STATUS_COLORS = {
  Granted: "#EAB308",
  Pending: "#F59E0B",
  Published: "#FBBF24",
  Expired: "#F97316",
  Abandoned: "#6B7280",
};

const JURISDICTION_COLORS = {
  US: "#EAB308",
  EP: "#F59E0B",
  CN: "#F97316",
  JP: "#FBBF24",
  IN: "#FDE047",
  KR: "#FACC15",
  WO: "#FEF08A",
};

/* --------------------------------------------------------------------------
  SMALL UI COMPONENTS
---------------------------------------------------------------------------*/

function Badge({ children, variant = "default", size = "xs", className = "" }) {
  const variants = {
    default: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  const sizes = {
    xs: "px-2 py-1",
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };
  return (
    <span
      className={`rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-yellow-500 hover:bg-yellow-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
    </div>
  );
}

/* --------------------------------------------------------------------------
  MAIN DASHBOARD COMPONENT
---------------------------------------------------------------------------*/

export default function IPDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [patents, setPatents] = useState(() => generatePatents(50));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => generateSearchHistory());
  const [apiLogs, setApiLogs] = useState(() => generateApiLogs());
  const [notifications, setNotifications] = useState(() => generateNotifications());
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    technology: "",
    jurisdiction: "",
    status: "",
    legalStatus: "",
    dateFrom: "",
    dateTo: "",
    assignee: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [searchAdvancedMode, setSearchAdvancedMode] = useState(false);
  const [searchSavedSearches, setSearchSavedSearches] = useState([]);
  const [apiTestEndpoint, setApiTestEndpoint] = useState("/search");
  const [apiTestParams, setApiTestParams] = useState('{"query": "AI patents"}');
  const [apiTestResponse, setApiTestResponse] = useState(null);
  const [apiIsTesting, setApiIsTesting] = useState(false);
  const [resultsViewMode, setResultsViewMode] = useState("list");
  const [resultsSelected, setResultsSelected] = useState([]);
  const [resultsSortBy, setResultsSortBy] = useState("relevance");
  const [detailsActiveTab, setDetailsActiveTab] = useState("overview");
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyDigest: false,
    newFilings: true,
    expiringPatents: true,
    competitorUpdates: true,
    citationAlerts: false,
    systemUpdates: true,
  });
  const [apiKey, setApiKey] = useState("sk_live_4242424242424242");
  const [apiEndpoint, setApiEndpoint] = useState("https://api.ipplatform.com/v1");
  const [subscription, setSubscription] = useState({
    plan: "Professional",
    status: "Active",
    apiQuota: 10000,
    apiUsed: 3450,
    nextBilling: "2024-02-15",
  });
  const searchInputRef = useRef(null);

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setApiLogs(prev => [
        {
          id: genId("api"),
          endpoint: ["/search", "/patents", "/analytics"][Math.floor(Math.random() * 3)],
          method: ["GET", "POST"][Math.floor(Math.random() * 2)],
          status: [200, 201, 400][Math.floor(Math.random() * 3)],
          responseTime: Math.floor(50 + Math.random() * 300),
          timestamp: new Date().toISOString(),
          user: `User${Math.floor(Math.random() * 5) + 1}`,
          requestSize: Math.floor(100 + Math.random() * 1000),
          responseSize: Math.floor(500 + Math.random() * 5000),
        },
        ...prev.slice(0, 29),
      ]);
      if (Math.random() > 0.9) {
        setNotifications(prev => [
          {
            id: genId("notif"),
            type: "new_filing",
            severity: "info",
            title: "New Patent Filing Detected",
            message: "A new patent matching your watch criteria has been filed.",
            patentId: `US${2020000 + Math.floor(Math.random() * 1000)}A1`,
            timestamp: new Date().toISOString(),
            read: false,
            actions: "View Details",
          },
          ...prev,
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Derived values
  const filteredPatents = useMemo(() => {
    return patents.filter(p => {
      const matchesQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTech = !filters.technology || p.technology === filters.technology;
      const matchesJurisdiction = !filters.jurisdiction || p.jurisdiction === filters.jurisdiction;
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesLegalStatus = !filters.legalStatus || p.legalStatus === filters.legalStatus;
      const matchesAssignee = !filters.assignee || p.assignee.toLowerCase().includes(filters.assignee.toLowerCase());
      return matchesQuery && matchesTech && matchesJurisdiction && matchesStatus && matchesLegalStatus && matchesAssignee;
    });
  }, [patents, searchQuery, filters]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const apiUsagePercent = (subscription.apiUsed / subscription.apiQuota) * 100;

  // Handlers
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const results = patents.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setSearchHistory(prev => [
        {
          id: genId("search"),
          query: searchQuery,
          timestamp: new Date().toISOString(),
          results: results.length,
          filters: { ...filters },
        },
        ...prev.slice(0, 9),
      ]);
      setIsSearching(false);
      setActiveTab("results");
    }, 1500);
  };

  const handleSavePatent = (patent) => {
    setNotifications(prev => [
      {
        id: genId("notif"),
        type: "system",
        severity: "success",
        title: "Patent Saved",
        message: `Patent ${patent.number} has been saved to your collection.`,
        timestamp: new Date().toISOString(),
        read: false,
        actions: "View Collection",
      },
      ...prev,
    ]);
  };

  const handleExportResults = (format = "csv") => {
    const data = searchResults.length > 0 ? searchResults : filteredPatents;
    setNotifications(prev => [
      {
        id: genId("notif"),
        type: "system",
        severity: "info",
        title: "Export Ready",
        message: `Your ${format.toUpperCase()} export with ${data.length} patents is ready for download.`,
        timestamp: new Date().toISOString(),
        read: false,
        actions: "Download",
      },
      ...prev,
    ]);
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleApiTest = () => {
    setApiIsTesting(true);
    setTimeout(() => {
      setApiTestResponse({
        status: 200,
        data: {
          total: 42,
          results: patents.slice(0, 3),
          took: "124ms",
          facets: {
            technologies: [
              { name: "AI/ML", count: 15 },
              { name: "Blockchain", count: 8 },
              { name: "IoT", count: 12 },
            ],
          },
        },
      });
      setApiIsTesting(false);
    }, 1500);
  };

  const handleResultsToggleSelection = (patentId) => {
    setResultsSelected(prev =>
      prev.includes(patentId)
        ? prev.filter(id => id !== patentId)
        : [...prev, patentId]
    );
  };

  const handleNotificationSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Memoized data for views
  const searchResultsData = useMemo(() => (searchResults.length > 0 ? searchResults : filteredPatents), [searchResults, filteredPatents]);
  const resultsTotalPages = Math.ceil(searchResultsData.length / resultsPerPage);
  const resultsPaginated = useMemo(() => searchResultsData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage), [searchResultsData, currentPage, resultsPerPage]);
  
  const resultsSorted = useMemo(() => {
    const sorted = [...resultsPaginated];
    switch (resultsSortBy) {
      case "date":
        return sorted.sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate));
      case "citations":
        return sorted.sort((a, b) => b.citations - a.citations);
      case "assignee":
        return sorted.sort((a, b) => a.assignee.localeCompare(b.assignee));
      default:
        return sorted;
    }
  }, [resultsPaginated, resultsSortBy]);

  const patentFamily = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: genId("family"),
      number: `${selectedPatent?.jurisdiction || "US"}${2020000 + i}B1`,
      jurisdiction: ["US", "EP", "CN", "JP", "WO"][i],
      status: ["Granted", "Pending", "Published"][i % 3],
      filingDate: new Date(2020 + i, (i % 12), (i % 28) + 1).toISOString(),
      publicationDate: new Date(2021 + i, (i % 12), (i % 28) + 1).toISOString(),
    })), [selectedPatent]
  );

  const citations = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: genId("citation"),
      number: `US${2021000 + i}A1`,
      title: `Related Patent ${i + 1}`,
      type: i % 2 === 0 ? "forward" : "backward",
      date: new Date(2021 + (i % 3), (i % 12), (i % 28) + 1).toISOString(),
    })), []
  );

  const techDistribution = useMemo(() => [
    { name: "AI/ML", value: 156, color: COLORS[0] },
    { name: "Blockchain", value: 98, color: COLORS[1] },
    { name: "IoT", value: 124, color: COLORS[2] },
    { name: "Healthcare", value: 87, color: COLORS[3] },
    { name: "Energy", value: 65, color: COLORS[4] },
    { name: "Robotics", value: 43, color: COLORS[5] },
  ], []);

  const citationTrends = useMemo(() => [
    { month: "Jan", citations: 120, newCitations: 15 },
    { month: "Feb", citations: 135, newCitations: 18 },
    { month: "Mar", citations: 142, newCitations: 22 },
    { month: "Apr", citations: 158, newCitations: 25 },
    { month: "May", citations: 175, newCitations: 28 },
    { month: "Jun", citations: 195, newCitations: 32 },
  ], []);

  const portfolioHealth = useMemo(() => [
    { subject: "Active Patents", value: 85, fullMark: 100 },
    { subject: "Pending Applications", value: 65, fullMark: 100 },
    { subject: "Citation Impact", value: 78, fullMark: 100 },
    { subject: "Geographic Coverage", value: 92, fullMark: 100 },
    { subject: "Technology Diversity", value: 70, fullMark: 100 },
    { subject: "Renewal Rate", value: 88, fullMark: 100 },
  ], []);

  const topAssignees = useMemo(() => [
    { name: "TechCorp", patents: 45, growth: 12 },
    { name: "InnovateLab", patents: 38, growth: 8 },
    { name: "FutureSystems", patents: 32, growth: -3 },
    { name: "SmartTech", patents: 28, growth: 15 },
    { name: "BioInnovations", patents: 24, growth: 6 },
  ], []);

  const statusData = useMemo(() => [
    { status: "Active", count: 245, percentage: 45 },
    { status: "Pending", count: 132, percentage: 24 },
    { status: "Under Review", count: 87, percentage: 16 },
    { status: "Granted", count: 54, percentage: 10 },
    { status: "Expired", count: 18, percentage: 3 },
    { status: "Rejected", count: 8, percentage: 1 },
  ], []);

  const timelineData = useMemo(() => [
    { month: "Jan", filed: 45, granted: 12, expired: 3 },
    { month: "Feb", filed: 52, granted: 15, expired: 5 },
    { month: "Mar", filed: 48, granted: 18, expired: 2 },
    { month: "Apr", filed: 61, granted: 22, expired: 4 },
    { month: "May", filed: 55, granted: 25, expired: 6 },
    { month: "Jun", filed: 58, granted: 28, expired: 3 },
  ], []);

  const jurisdictionStatus = useMemo(() => [
    { jurisdiction: "US", active: 120, pending: 45, total: 165 },
    { jurisdiction: "EP", active: 85, pending: 32, total: 117 },
    { jurisdiction: "CN", active: 65, pending: 28, total: 93 },
    { jurisdiction: "JP", active: 45, pending: 18, total: 63 },
    { jurisdiction: "IN", active: 35, pending: 15, total: 50 },
  ], []);

  const endpointStats = useMemo(() => {
    const stats = {};
    apiLogs.forEach((log) => {
      if (!stats[log.endpoint]) {
        stats[log.endpoint] = { count: 0, avgResponseTime: 0, errors: 0 };
      }
      stats[log.endpoint].count++;
      stats[log.endpoint].avgResponseTime += log.responseTime;
      if (log.status >= 400) stats[log.endpoint].errors++;
    });
    Object.keys(stats).forEach((endpoint) => {
      stats[endpoint].avgResponseTime = Math.round(stats[endpoint].avgResponseTime / stats[endpoint].count);
    });
    return stats;
  }, [apiLogs]);

  const plans = useMemo(() => [
    {
      name: "Starter",
      price: 29,
      features: [
        "100 API calls/month",
        "Basic search",
        "Email support",
        "5 saved searches",
      ],
      current: false,
    },
    {
      name: "Professional",
      price: 99,
      features: [
        "10,000 API calls/month",
        "Advanced search & filters",
        "Priority support",
        "Unlimited saved searches",
        "Export capabilities",
        "API access",
      ],
      current: true,
    },
    {
      name: "Enterprise",
      price: 299,
      features: [
        "100,000 API calls/month",
        "Full feature access",
        "Dedicated support",
        "Custom integrations",
        "White-label options",
        "Advanced analytics",
        "Team collaboration",
      ],
      current: false,
    },
  ], []);

  const billingHistory = useMemo(() => [
    { date: "2024-01-15", amount: 99, status: "Paid", method: "Credit Card" },
    { date: "2023-12-15", amount: 99, status: "Paid", method: "Credit Card" },
    { date: "2023-11-15", amount: 99, status: "Paid", method: "Credit Card" },
    { date: "2023-10-15", amount: 99, status: "Paid", method: "Credit Card" },
  ], []);

  const notificationTypes = useMemo(() => [
    { id: "new_filing", label: "New Patent Filings", description: "Alert when new patents match your criteria" },
    { id: "expiry_alert", label: "Patent Expiry", description: "Reminders for patents approaching expiration" },
    { id: "status_change", label: "Status Changes", description: "Updates on legal status changes" },
    { id: "citation", label: "Citation Alerts", description: "New citations to your patents" },
    { id: "competitor", label: "Competitor Activity", description: "Track competitor patent activities" },
  ], []);

  const notificationTemplates = useMemo(() => [
    {
      type: "New Patent Filing",
      subject: "New Patent Alert: {{patent_number}}",
      body: "A new patent matching your criteria has been filed:\n\nTitle: {{title}}\nAssignee: {{assignee}}\nTechnology: {{technology}}\n\nView details: {{link}}",
    },
    {
      type: "Patent Expiry",
      subject: "Patent Expiry Reminder: {{patent_number}}",
      body: "Your patent {{patent_number}} will expire on {{expiry_date}}.\n\nPlease take appropriate action to maintain your patent rights.\n\nManage renewal: {{link}}",
    },
  ], []);

  const portfolioValue = useMemo(() => [
    { year: "2019", value: 1200000, growth: 0 },
    { year: "2020", value: 1450000, growth: 20.8 },
    { year: "2021", value: 1780000, growth: 22.8 },
    { year: "2022", value: 2100000, growth: 18.0 },
    { year: "2023", value: 2540000, growth: 21.0 },
  ], []);

  const technologyTrends = useMemo(() => [
    { name: "AI/ML", 2019: 20, 2020: 35, 2021: 50, 2022: 75, 2023: 110 },
    { name: "Blockchain", 2019: 15, 2020: 25, 2021: 30, 2022: 45, 2023: 60 },
    { name: "IoT", 2019: 25, 2020: 30, 2021: 40, 2022: 55, 2023: 70 },
    { name: "Healthcare", 2019: 30, 2020: 40, 2021: 55, 2022: 70, 2023: 90 },
    { name: "Energy", 2019: 10, 2020: 15, 2021: 25, 2022: 35, 2023: 45 },
    { name: "Robotics", 2019: 5, 2020: 10, 2021: 20, 2022: 30, 2023: 40 },
  ], []);

  const renewalForecast = useMemo(() => [
    { month: "Jul", renewals: 12, cost: 24000 },
    { month: "Aug", renewals: 18, cost: 36000 },
    { month: "Sep", renewals: 15, cost: 30000 },
    { month: "Oct", renewals: 22, cost: 44000 },
    { month: "Nov", renewals: 25, cost: 50000 },
    { month: "Dec", renewals: 30, cost: 60000 },
  ], []);

  /* ------------------------------------------------------------------------
     OVERVIEW COMPONENT (NEW)
  -------------------------------------------------------------------------*/

  function Overview() {
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Patents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{patents.length}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">↑ 12% from last month</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Patents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{patents.filter(p => p.status === "Granted").length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 8% from last month</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Citations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{patents.reduce((sum, p) => sum + p.citations, 0)}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">↑ 24% from last month</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Portfolio Value</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${(patents.reduce((sum, p) => sum + p.value, 0) / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">↑ 18% from last year</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Value Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={portfolioValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Portfolio Value']} />
                <Area type="monotone" dataKey="value" fill="#FDE047" stroke="#EAB308" fillOpacity={0.3} />
                <Line type="monotone" dataKey="value" stroke="#EAB308" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Technology Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={techDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {techDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Technology Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={technologyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="2019" stroke="#FDE047" strokeWidth={2} />
                <Line type="monotone" dataKey="2020" stroke="#FACC15" strokeWidth={2} />
                <Line type="monotone" dataKey="2021" stroke="#EAB308" strokeWidth={2} />
                <Line type="monotone" dataKey="2022" stroke="#CA8A04" strokeWidth={2} />
                <Line type="monotone" dataKey="2023" stroke="#A16207" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Renewal Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={renewalForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="renewals" fill="#EAB308" />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {patents.slice(0, 5).map((patent) => (
              <div key={patent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{patent.title}</p>
                    <p className="text-sm text-gray-500">{patent.number} • {patent.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{patent.status}</p>
                  <p className="text-xs text-gray-500">{new Date(patent.filingDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     SEARCH UI COMPONENT
  -------------------------------------------------------------------------*/

  function SearchUI() {
    return (
      <div className="space-y-6">
        {/* Search Header */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Patent Search</h2>
          {/* Main Search Bar */}
          <div className="relative mb-4">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patent number, title, assignee, or keywords..."
              className="pr-24"
            />
            <div className="absolute right-2 top-8 flex gap-2">
              <Button onClick={() => setSearchAdvancedMode(!searchAdvancedMode)} variant="outline" size="sm">
                {searchAdvancedMode ? "Simple" : "Advanced"}
              </Button>
              <Button onClick={handleSearch} disabled={isSearching} size="sm">
                {isSearching ? <LoadingSpinner /> : "Search"}
              </Button>
            </div>
          </div>
          {/* Advanced Search Options */}
          {searchAdvancedMode && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Technology"
                  value={filters.technology}
                  onChange={(e) => setFilters({ ...filters, technology: e.target.value })}
                  options={[
                    { value: "", label: "All Technologies" },
                    { value: "AI/ML", label: "AI/ML" },
                    { value: "Blockchain", label: "Blockchain" },
                    { value: "IoT", label: "IoT" },
                    { value: "Healthcare", label: "Healthcare" },
                    { value: "Energy", label: "Energy" },
                  ]}
                />
                <Select
                  label="Jurisdiction"
                  value={filters.jurisdiction}
                  onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                  options={[
                    { value: "", label: "All Jurisdictions" },
                    { value: "US", label: "United States" },
                    { value: "EP", label: "Europe" },
                    { value: "CN", label: "China" },
                    { value: "JP", label: "Japan" },
                  ]}
                />
                <Select
                  label="Status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "Granted", label: "Granted" },
                    { value: "Pending", label: "Pending" },
                    { value: "Published", label: "Published" },
                    { value: "Expired", label: "Expired" },
                  ]}
                />
                <Input
                  label="Assignee"
                  value={filters.assignee}
                  onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                  placeholder="Company name"
                />
                <Input
                  label="Date From"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
                <Input
                  label="Date To"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ technology: "", jurisdiction: "", status: "", legalStatus: "", dateFrom: "", dateTo: "", assignee: "" })}
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => {
                    if (searchQuery) {
                      setSearchSavedSearches(prev => [
                        { id: genId("saved"), query: searchQuery, filters: { ...filters }, timestamp: new Date().toISOString() },
                        ...prev.slice(0, 4),
                      ]);
                    }
                  }}
                >
                  Save Search
                </Button>
              </div>
            </div>
          )}
        </Card>
        {/* Search History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
          <div className="space-y-3">
            {searchHistory.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{search.query}</div>
                  <div className="text-sm text-gray-500">
                    {search.results} results • {new Date(search.timestamp).toLocaleString()}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search.query);
                    setFilters(search.filters);
                  }}
                >
                  Run Again
                </Button>
              </div>
            ))}
          </div>
        </Card>
        {/* Saved Searches */}
        {searchSavedSearches.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
            <div className="space-y-3">
              {searchSavedSearches.map((saved) => (
                <div key={saved.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{saved.query}</div>
                    <div className="text-sm text-gray-500">
                      Saved {new Date(saved.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(saved.query);
                        setFilters(saved.filters);
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchSavedSearches(prev => prev.filter(s => s.id !== saved.id));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     API INTEGRATION COMPONENT
  -------------------------------------------------------------------------*/

  function APIIntegration() {
    return (
      <div className="space-y-6">
        {/* API Configuration */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="API Endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1"
              />
              <Input
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{subscription.apiUsed.toLocaleString()}</div>
                <div className="text-sm text-gray-600">API Calls This Month</div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{subscription.apiQuota.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Quota</div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{Math.round(apiUsagePercent)}%</div>
                <div className="text-sm text-gray-600">Usage</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(apiUsagePercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
        {/* API Testing */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Testing</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Endpoint"
                value={apiTestEndpoint}
                onChange={(e) => setApiTestEndpoint(e.target.value)}
                options={[
                  { value: "/search", label: "Search Patents" },
                  { value: "/patents", label: "Get Patent Details" },
                  { value: "/analytics", label: "Get Analytics" },
                  { value: "/export", label: "Export Data" },
                ]}
              />
              <Input
                label="Request Parameters (JSON)"
                value={apiTestParams}
                onChange={(e) => setApiTestParams(e.target.value)}
                placeholder='{"query": "AI patents"}'
              />
            </div>
            <Button onClick={handleApiTest} disabled={apiIsTesting}>
              {apiIsTesting ? "Testing..." : "Test API"}
            </Button>
            {apiTestResponse && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Response:</h4>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(apiTestResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
        {/* API Usage Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(endpointStats).map(([endpoint, stats]) => (
              <div key={endpoint} className="p-4 border rounded-lg">
                <div className="font-semibold text-sm text-gray-600">{endpoint}</div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Calls:</span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Time:</span>
                    <span className="font-medium">{stats.avgResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Errors:</span>
                    <span className="font-medium text-red-600">{stats.errors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* Recent API Calls */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent API Calls</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2">Timestamp</th>
                  <th className="text-left p-2">Endpoint</th>
                  <th className="text-left p-2">Method</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Response Time</th>
                  <th className="text-left p-2">User</th>
                </tr>
              </thead>
              <tbody>
                {apiLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="border-b dark:border-gray-700">
                    <td className="p-2">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2">{log.endpoint}</td>
                    <td className="p-2">
                      <Badge variant={log.method === "GET" ? "info" : "warning"}>{log.method}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={log.status === 200 ? "success" : "error"}>{log.status}</Badge>
                    </td>
                    <td className="p-2">{log.responseTime}ms</td>
                    <td className="p-2">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     RESULTS PAGE COMPONENT
  -------------------------------------------------------------------------*/

  function ResultsPage() {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Search Results</h2>
              <p className="text-gray-600">
                {searchResultsData.length} patents found for "{searchQuery}"
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={resultsViewMode === "list" ? "primary" : "outline"}
                onClick={() => setResultsViewMode("list")}
              >
                List View
              </Button>
              <Button
                variant={resultsViewMode === "grid" ? "primary" : "outline"}
                onClick={() => setResultsViewMode("grid")}
              >
                Grid View
              </Button>
            </div>
          </div>
          {/* Active Filters */}
          {Object.values(filters).some((v) => v) && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-sm font-medium">Active Filters:</span>
              {Object.entries(filters).map(([key, value]) =>
                value ? (
                  <Badge
                    key={key}
                    variant="info"
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, [key]: "" })}
                  >
                    {key}: {value} ×
                  </Badge>
                ) : null
              )}
            </div>
          )}
          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <Select
              value={resultsSortBy}
              onChange={(e) => setResultsSortBy(e.target.value)}
              options={[
                { value: "relevance", label: "Sort by Relevance" },
                { value: "date", label: "Sort by Date" },
                { value: "citations", label: "Sort by Citations" },
                { value: "assignee", label: "Sort by Assignee" },
              ]}
              className="w-64"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportResults("csv")}>
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExportResults("pdf")}>
                Export PDF
              </Button>
            </div>
          </div>
        </Card>
        {/* Bulk Actions */}
        {resultsSelected.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {resultsSelected.length} patents selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Add to Collection
                </Button>
                <Button variant="outline" size="sm">
                  Export Selected
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setResultsSelected([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}
        {/* Results Display */}
        {resultsViewMode === "list" ? (
          <div className="space-y-4">
            {resultsSorted.map((patent) => (
              <Card key={patent.id} className="p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={resultsSelected.includes(patent.id)}
                    onChange={() => handleResultsToggleSelection(patent.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-600 hover:underline cursor-pointer">
                          {patent.number}
                        </h3>
                        <h4 className="text-lg font-medium mb-2">{patent.title}</h4>
                      </div>
                      <Badge variant={STATUS_COLORS[patent.status] || "default"}>{patent.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{patent.abstract}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Assignee:</span>
                        <div className="font-medium">{patent.assignee}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Filing Date:</span>
                        <div className="font-medium">{new Date(patent.filingDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Jurisdiction:</span>
                        <div className="font-medium">{patent.jurisdiction}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Citations:</span>
                        <div className="font-medium">{patent.citations}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => setSelectedPatent(patent)}>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSavePatent(patent)}>
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resultsSorted.map((patent) => (
              <Card key={patent.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={resultsSelected.includes(patent.id)}
                    onChange={() => handleResultsToggleSelection(patent.id)}
                    className="mt-1"
                  />
                  <Badge variant={STATUS_COLORS[patent.status] || "default"} size="sm">
                    {patent.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-yellow-600 mb-1">{patent.number}</h3>
                <h4 className="font-medium mb-2 line-clamp-2">{patent.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{patent.abstract}</p>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-500">Assignee:</span> {patent.assignee}
                  </div>
                  <div>
                    <span className="text-gray-500">Citations:</span> {patent.citations}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => setSelectedPatent(patent)}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSavePatent(patent)}>
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* Pagination */}
        {resultsTotalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, resultsTotalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              disabled={currentPage === resultsTotalPages}
              onClick={() => setCurrentPage((prev) => Math.min(resultsTotalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     IP ASSET DETAILS COMPONENT
  -------------------------------------------------------------------------*/

  function IPAssetDetails() {
    const detailsTabs = [
      { id: "overview", label: "Overview" },
      { id: "legal", label: "Legal Status" },
      { id: "family", label: "Patent Family" },
      { id: "citations", label: "Citations" },
      { id: "documents", label: "Documents" },
    ];

    if (!selectedPatent) {
      return (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No Patent Selected</h3>
          <p className="text-gray-600">Search and select a patent to view its details</p>
          <Button className="mt-4" onClick={() => setActiveTab("search")}>
            Go to Search
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Patent Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedPatent.number}</h2>
              <h3 className="text-xl font-semibold mb-2">{selectedPatent.title}</h3>
              <p className="text-gray-600 mb-4">{selectedPatent.abstract}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSavePatent(selectedPatent)}>
                Save Patent
              </Button>
              <Button variant="outline">Export PDF</Button>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{selectedPatent.claims}</div>
              <div className="text-sm text-gray-600">Claims</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{selectedPatent.citations}</div>
              <div className="text-sm text-gray-600">Citations</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{selectedPatent.familyMembers}</div>
              <div className="text-sm text-gray-600">Family Members</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{selectedPatent.priority}</div>
              <div className="text-sm text-gray-600">Priority</div>
            </div>
          </div>
        </Card>
        {/* Detail Tabs */}
        <Card className="p-6">
          <div className="flex gap-4 border-b mb-6">
            {detailsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDetailsActiveTab(tab.id)}
                className={`pb-2 px-1 font-medium transition-colors ${
                  detailsActiveTab === tab.id
                    ? "text-yellow-600 border-b-2 border-yellow-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          {detailsActiveTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patent Number:</span>
                      <span>{selectedPatent.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filing Date:</span>
                      <span>{new Date(selectedPatent.filingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publication Date:</span>
                      <span>{new Date(selectedPatent.publicationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grant Date:</span>
                      <span>
                        {selectedPatent.grantDate
                          ? new Date(selectedPatent.grantDate).toLocaleDateString()
                          : "Not Granted"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span>{new Date(selectedPatent.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Classification</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technology:</span>
                      <span>{selectedPatent.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jurisdiction:</span>
                      <span>{selectedPatent.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={STATUS_COLORS[selectedPatent.status] || "default"}>
                        {selectedPatent.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legal Status:</span>
                      <span>{selectedPatent.legalStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span>{selectedPatent.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Assignee & Inventors</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Assignee:</span>
                    <div className="font-medium">{selectedPatent.assignee}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Inventors:</span>
                    <div className="font-medium">{selectedPatent.inventors.join(", ")}</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Abstract</h4>
                <p className="text-gray-600">{selectedPatent.abstract}</p>
              </div>
            </div>
          )}
          {detailsActiveTab === "legal" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Legal Status</h4>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={STATUS_COLORS[selectedPatent.status] || "default"}>
                      {selectedPatent.status}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Last updated: {new Date(selectedPatent.filingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedPatent.status === "Granted"
                      ? "This patent has been granted and is currently in force."
                      : selectedPatent.status === "Pending"
                      ? "This patent application is currently pending examination."
                      : selectedPatent.status === "Published"
                      ? "This patent has been published but is still pending examination."
                      : selectedPatent.status === "Expired"
                      ? "This patent has expired and is no longer in force."
                      : "This patent has been abandoned."}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Important Dates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Filing Date:</span>
                    <span>{new Date(selectedPatent.filingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publication Date:</span>
                    <span>{new Date(selectedPatent.publicationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grant Date:</span>
                    <span>
                      {selectedPatent.grantDate
                        ? new Date(selectedPatent.grantDate).toLocaleDateString()
                        : "Not Granted"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry Date:</span>
                    <span>{new Date(selectedPatent.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Renewal Information</h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Next Renewal Date:</span>
                    <span>{new Date(selectedPatent.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Estimated Renewal Cost:</span>
                    <span>${selectedPatent.renewalCost.toLocaleString()}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Set Renewal Reminder
                  </Button>
                </div>
              </div>
            </div>
          )}
          {detailsActiveTab === "family" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Patent Family Members</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left p-2">Patent Number</th>
                        <th className="text-left p-2">Jurisdiction</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Filing Date</th>
                        <th className="text-left p-2">Publication Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patentFamily.map((member) => (
                        <tr key={member.id} className="border-b dark:border-gray-700">
                          <td className="p-2 font-medium">{member.number}</td>
                          <td className="p-2">{member.jurisdiction}</td>
                          <td className="p-2">
                            <Badge variant={STATUS_COLORS[member.status] || "default"}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="p-2">{new Date(member.filingDate).toLocaleDateString()}</td>
                          <td className="p-2">{new Date(member.publicationDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Family Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{patentFamily.length}</div>
                    <div className="text-sm text-gray-600">Family Members</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {patentFamily.filter(m => m.status === "Granted").length}
                    </div>
                    <div className="text-sm text-gray-600">Granted</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {patentFamily.filter(m => m.status === "Pending").length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Set(patentFamily.map(m => m.jurisdiction)).size}
                    </div>
                    <div className="text-sm text-gray-600">Jurisdictions</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {detailsActiveTab === "citations" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Citations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left p-2">Patent Number</th>
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citations.map((citation) => (
                        <tr key={citation.id} className="border-b dark:border-gray-700">
                          <td className="p-2 font-medium">{citation.number}</td>
                          <td className="p-2">{citation.title}</td>
                          <td className="p-2">
                            <Badge variant={citation.type === "forward" ? "info" : "warning"}>
                              {citation.type}
                            </Badge>
                          </td>
                          <td className="p-2">{new Date(citation.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Citation Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{selectedPatent.citations}</div>
                    <div className="text-sm text-gray-600">Total Citations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {citations.filter(c => c.type === "forward").length}
                    </div>
                    <div className="text-sm text-gray-600">Forward Citations</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {citations.filter(c => c.type === "backward").length}
                    </div>
                    <div className="text-sm text-gray-600">Backward Citations</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(selectedPatent.citations / 5)}
                    </div>
                    <div className="text-sm text-gray-600">Citations/Year</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {detailsActiveTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Patent Documents</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Patent Application</div>
                        <div className="text-sm text-gray-600">Original patent application document</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Granted Patent</div>
                        <div className="text-sm text-gray-600">Final granted patent document</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Examination Report</div>
                        <div className="text-sm text-gray-600">Examination report and office actions</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Claims</div>
                        <div className="text-sm text-gray-600">Patent claims document</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     SUBSCRIPTION SYSTEM COMPONENT
  -------------------------------------------------------------------------*/

  function SubscriptionSystem() {
    return (
      <div className="space-y-6">
        {/* Current Subscription */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Subscription Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{subscription.plan}</div>
              <div className="text-sm text-gray-600 mt-1">Current Plan</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{subscription.apiUsed.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">API Calls Used</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{subscription.nextBilling}</div>
              <div className="text-sm text-gray-600 mt-1">Next Billing</div>
            </div>
          </div>
        </Card>
        {/* Available Plans */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-lg border-2 ${
                  plan.current
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold">{plan.name}</h4>
                  <div className="text-3xl font-bold mt-2">
                    ${plan.price}
                    <span className="text-sm font-normal">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.current ? "outline" : "primary"} disabled={plan.current}>
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
        {/* Billing History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Billing History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Payment Method</th>
                  <th className="p-2 text-left">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((bill, i) => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="p-2">{bill.date}</td>
                    <td className="p-2">${bill.amount}</td>
                    <td className="p-2">
                      <Badge variant="success">{bill.status}</Badge>
                    </td>
                    <td className="p-2">{bill.method}</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="font-medium">•••• 4242</div>
                  <div className="text-sm text-gray-600">Expires 12/24</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Default</Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              + Add Payment Method
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     LEGAL STATUS DASHBOARD COMPONENT
  -------------------------------------------------------------------------*/

  function LegalStatusDashboard() {
    return (
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusData.map((status) => (
            <Card key={status.status} className="p-4 text-center">
              <div className="text-2xl font-bold">{status.count}</div>
              <div className="text-sm text-gray-600">{status.status}</div>
              <div className="text-xs text-gray-500 mt-1">{status.percentage}%</div>
            </Card>
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Legal Status Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="filed" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                <Area type="monotone" dataKey="granted" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
                <Area type="monotone" dataKey="expired" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
        {/* Jurisdiction Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Status by Jurisdiction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jurisdictionStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jurisdiction" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" fill={COLORS[0]} />
              <Bar dataKey="pending" fill={COLORS[1]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Recent Status Changes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Status Changes</h3>
          <div className="space-y-3">
            {patents.slice(0, 5).map((patent) => (
              <div key={patent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{patent.number}</div>
                  <div className="text-sm text-gray-600">{patent.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status changed to {patent.legalStatus} on {new Date(patent.filingDate).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={patent.legalStatus === "Active" ? "success" : "warning"}>
                  {patent.legalStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     BASIC VISUALIZATIONS COMPONENT
  -------------------------------------------------------------------------*/

  function BasicVisualizations() {
    return (
      <div className="space-y-6">
        {/* Visualization Header */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-2">Patent Analytics & Visualizations</h2>
          <p className="text-gray-600">Comprehensive insights into your patent portfolio and market trends</p>
        </Card>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{patents.length}</div>
            <div className="text-sm text-gray-600">Total Patents</div>
            <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {patents.filter(p => p.status === "Granted").length}
            </div>
            <div className="text-sm text-gray-600">Granted Patents</div>
            <div className="text-xs text-green-600 mt-1">↑ 8% from last month</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {patents.reduce((sum, p) => sum + p.citations, 0)}
            </div>
                        <div className="text-sm text-gray-600">Total Citations</div>
            <div className="text-xs text-green-600 mt-1">↑ 24% from last month</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {new Set(patents.map(p => p.jurisdiction)).size}
            </div>
            <div className="text-sm text-gray-600">Jurisdictions</div>
            <div className="text-xs text-gray-600 mt-1">No change</div>
          </Card>
        </div>
        
        {/* Technology Distribution & Citation Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Technology Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={techDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {techDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Citation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={citationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="citations" stroke={COLORS[0]} strokeWidth={2} name="Total Citations" />
                <Line type="monotone" dataKey="newCitations" stroke={COLORS[1]} strokeWidth={2} name="New Citations" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        {/* Portfolio Health Radar */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Health Score</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={portfolioHealth}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Top Assignees & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Assignees</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAssignees}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patents" fill={COLORS[0]} />
                <Bar dataKey="growth" fill={COLORS[1]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="space-y-3">
              {Object.entries(
                patents.reduce((acc, p) => {
                  acc[p.jurisdiction] = (acc[p.jurisdiction] || 0) + 1;
                  return acc;
                }, {})
              ).map(([jurisdiction, count]) => (
                <div key={jurisdiction} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: JURISDICTION_COLORS[jurisdiction] }}
                    ></div>
                    <span className="font-medium">{jurisdiction}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${(count / patents.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Export Options */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export & Reports</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => handleExportResults("csv")}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportResults("excel")}>
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExportResults("pdf")}>
              Generate PDF Report
            </Button>
            <Button variant="outline" onClick={() => handleExportResults("json")}>
              Export JSON
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
    NOTIFICATIONS UI COMPONENT
  -------------------------------------------------------------------------*/

  function NotificationsUI() {
    return (
      <div className="space-y-6">
        {/* Notification Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-yellow-900">Notifications</h2>
              <p className="text-yellow-700">Manage your notification preferences and view recent alerts</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              >
                Mark All Read
              </Button>
              <Button variant="outline" onClick={handleClearNotifications}>
                Clear All
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-yellow-900">Delivery Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailAlerts}
                    onChange={() => handleNotificationSettingChange("emailAlerts")}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-medium">Email Alerts</div>
                    <div className="text-sm text-yellow-700">Receive notifications via email</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={() => handleNotificationSettingChange("pushNotifications")}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-yellow-700">Browser push notifications</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyDigest}
                    onChange={() => handleNotificationSettingChange("weeklyDigest")}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm text-yellow-700">Summary of weekly activities</div>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-yellow-900">Notification Types</h4>
              <div className="space-y-3">
                {notificationTypes.map((type) => (
                  <label key={type.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings[type.id] || false}
                      onChange={() => handleNotificationSettingChange(type.id)}
                      className="w-4 h-4 rounded"
                    />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-yellow-700">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Recent Notifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-900">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? "bg-white border-gray-200" : "bg-yellow-50 border-yellow-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">
                      {notification.type === "new_filing" && "📋"}
                      {notification.type === "expiry_alert" && "⏰"}
                      {notification.type === "status_change" && "🔄"}
                      {notification.type === "citation" && "📊"}
                      {notification.type === "system" && "⚙️"}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-900">{notification.title}</div>
                      <div className="text-sm text-yellow-700 mt-1">{notification.message}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-yellow-600">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.patentId && (
                          <span className="text-xs text-yellow-600">Patent: {notification.patentId}</span>
                        )}
                        <Badge
                          variant={
                            notification.severity === "critical"
                              ? "error"
                              : notification.severity === "warning"
                              ? "warning"
                              : "info"
                          }
                        >
                          {notification.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkNotificationRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Notification Templates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-900">Notification Templates</h3>
          <div className="space-y-4">
            {notificationTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg border-yellow-200">
                <h4 className="font-semibold mb-2 text-yellow-900">{template.type}</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Subject: </span>
                    <span className="text-sm text-yellow-700">{template.subject}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Body: </span>
                    <pre className="text-sm text-yellow-700 whitespace-pre-wrap bg-yellow-50 p-2 rounded">
                      {template.body}
                    </pre>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm">
                    Edit Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
    MAIN RENDER
  -------------------------------------------------------------------------*/

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "search", label: "Search", icon: "🔍" },
    { id: "api", label: "API Integration", icon: "🔌" },
    { id: "results", label: "Results", icon: "📋" },
    { id: "details", label: "IP Details", icon: "📄" },
    { id: "subscription", label: "Subscription", icon: "💳" },
    { id: "legal", label: "Legal Status", icon: "⚖️" },
    { id: "visualizations", label: "Visualizations", icon: "📈" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-yellow-300 p-4 flex flex-col`}>
        <div className="mb-4">
          <div className={`font-bold ${sidebarOpen ? "text-xl" : "text-sm"} text-yellow-900`}>📊 IP Platform</div>
          {sidebarOpen && <div className="text-xs text-yellow-900/80">Advanced Intelligence</div>}
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-left transition ${
                activeTab === item.id
                  ? "bg-yellow-400 text-white"
                  : "text-yellow-900 hover:bg-yellow-200"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="capitalize">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="text-xs text-yellow-900/80">
            <div className="font-semibold">Jane Analyst</div>
            <div>jane@analytics.com</div>
          </div>
        </div>
      </aside>

      {/* Main area with center yellow canvas */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold">User Dashboard</div>
            <div className="text-sm text-gray-500">Advanced • Analytics</div>
          </div>

          <div className="flex items-center gap-3">
            <input placeholder="Search analytics, reports..." className="px-3 py-2 rounded-md border" />
            <Button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-md bg-white shadow-sm">
              {darkMode ? "🌙" : "☀️"}
            </Button>
          </div>
        </div>

        {/* CENTER YELLOW CANVAS */}
        <div className="w-full bg-yellow-100 p-6 rounded-2xl shadow-inner">
          {/* children: pages rendered inside this yellow canvas */}
          {activeTab === "overview" && <Overview />}
          {activeTab === "search" && <SearchUI />}
          {activeTab === "api" && <APIIntegration />}
          {activeTab === "results" && <ResultsPage />}
          {activeTab === "details" && <IPAssetDetails />}
          {activeTab === "subscription" && <SubscriptionSystem />}
          {activeTab === "legal" && <LegalStatusDashboard />}
          {activeTab === "visualizations" && <BasicVisualizations />}
          {activeTab === "notifications" && <NotificationsUI />}
        </div>
      </main>
    </div>
  );
}
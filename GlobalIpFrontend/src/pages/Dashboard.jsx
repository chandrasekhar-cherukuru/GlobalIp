import React from "react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-800 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-center">MyDashboard</h2>
        <ul className="space-y-2">
          <li className="px-3 py-2 rounded bg-gray-700">Dashboard</li>
          <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Users</li>
          <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Reports</li>
          <li className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">Settings</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
            Admin
          </div>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 mb-2">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 mb-2">Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 mb-2">New Orders</h3>
            <p className="text-2xl font-bold text-gray-800">56</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 mb-2">Feedbacks</h3>
            <p className="text-2xl font-bold text-gray-800">24</p>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-800 mb-4 font-semibold">Sales Overview</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
              Chart Placeholder
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-800 mb-4 font-semibold">User Growth</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
              Chart Placeholder
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

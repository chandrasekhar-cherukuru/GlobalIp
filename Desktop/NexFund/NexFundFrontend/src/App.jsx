// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages & Components
import Landing from './pages/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuth2Callback from './components/Auth/OAuth2Callback';
import Dashboard from './components/Dashboard/Dashboard';
import CreateForm from './components/Create/CreateForm';
import LinkPage from './components/Link/LinkPage';
import VerifyParticipants from './components/Dashboard/VerifyParticipants';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
                <Route path="/link/:id" element={<LinkPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verify-participants"
                  element={
                    <ProtectedRoute>
                      <VerifyParticipants />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="bottom-center"
                containerStyle={{
                  bottom: 60,
                }}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '14px',
                    maxWidth: '500px',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
                reverseOrder={false}
              />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

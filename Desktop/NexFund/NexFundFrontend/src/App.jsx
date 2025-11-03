// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuth2Callback from './components/Auth/OAuth2Callback'; // **NEW IMPORT**
import Dashboard from './components/Dashboard/Dashboard';
import CreateForm from './components/Create/CreateForm';
import LinkPage from './components/Link/LinkPage';
import ThankYou from './components/ThankYou/ThankYou'; // 🚨 **ADDED THIS IMPORT**
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
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* **OAuth2 Callback Route** */}
                <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
                
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
                <Route path="/link/:id" element={<LinkPage />} />
                
                {/* 🚨 **ADDED THIS ROUTE** */}
                <Route path="/thankyou" element={<ThankYou />} />
                
                <Route
                  path="/verify-participants"
                  element={
                    <ProtectedRoute>
                      <VerifyParticipants />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
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

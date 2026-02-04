// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages publiques
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Pages protégées (existantes)
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import LocationsPage from './pages/LocationsPage';
import RecurringSchedulePage from './pages/RecurringSchedulePage';
import FindSlotPage from './pages/FindSlotPage';
import SettingsPage from './pages/SettingsPage';

// Layout
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Routes protégées avec Navbar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app">
                  <Navbar />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/locations" element={<LocationsPage />} />
                      <Route path="/schedule" element={<RecurringSchedulePage />} />
                      <Route path="/find-slot" element={<FindSlotPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

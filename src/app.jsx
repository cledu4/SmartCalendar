// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages publiques
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// Pages protégées (existantes)
import Dashboard from './pages/Dashboard.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import LocationsPage from './pages/LocationsPage.jsx';
import RecurringSchedulePage from './pages/RecurringSchedulePage.jsx';
import FindSlotPage from './pages/FindSlotPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

// Layout
import Navbar from "./components/Navbar.jsx";

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

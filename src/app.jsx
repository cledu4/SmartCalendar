// src/app.jsx - TOUTES LES ROUTES AJOUTÉES
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages publiques
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// Pages protégées
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';

// 👇 NOUVELLES PAGES À CRÉER
import CalendarPage from './pages/CalendarPage.jsx';
import FindSlotPage from './pages/FindSlotPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import LocationsPage from './pages/LocationsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

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
                      
                      {/* 👇 TOUTES LES ROUTES MANQUANTES AJOUTÉES */}
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/find-slot" element={<FindSlotPage />} />
                      <Route path="/schedule" element={<SchedulePage />} />
                      <Route path="/locations" element={<LocationsPage />} />
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

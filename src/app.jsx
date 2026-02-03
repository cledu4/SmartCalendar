import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CalendarPage from './pages/CalendarPage'
import FindSlotPage from './pages/FindSlotPage'
import LocationsPage from './pages/LocationsPage'
import SettingsPage from './pages/SettingsPage'
import RecurringSchedulePage from './pages/RecurringSchedulePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/calendar" replace />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="find-slot" element={<FindSlotPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="schedule" element={<RecurringSchedulePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
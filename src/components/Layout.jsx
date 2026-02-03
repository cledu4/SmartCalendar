// src/components/Layout.jsx
import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

function Layout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>📅 Smart Calendar</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/calendar" className={isActive('/calendar')}>
              📆 Calendrier
            </Link>
          </li>
          <li>
            <Link to="/find-slot" className={isActive('/find-slot')}>
              🔍 Trouver un créneau
            </Link>
          </li>
          <li>
            <Link to="/locations" className={isActive('/locations')}>
              📍 Mes lieux
            </Link>
          </li>
          <li>
            <Link to="/schedule" className={isActive('/schedule')}>
              📅 Emploi du temps
            </Link>
          </li>
          <li>
            <Link to="/settings" className={isActive('/settings')}>
              ⚙️ Paramètres
            </Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
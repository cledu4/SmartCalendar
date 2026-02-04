// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>📅 SmartCalendar</h2>
      </div>
      
      <div className="navbar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          🏠 Accueil
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          📅 Calendrier
        </NavLink>
        <NavLink to="/find-slot" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          🔍 Créneaux
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          🕐 Planning
        </NavLink>
        <NavLink to="/locations" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          📍 Lieux
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-active' : ''}>
          ⚙️ Paramètres
        </NavLink>
      </div>

      <div className="navbar-user">
        <span>👤 {user?.user_metadata?.username || 'Utilisateur'}</span>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          🚪 Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

// src/components/Navbar.jsx - NOUVELLE STRUCTURE
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, username, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-brand">
        <Link to="/dashboard">🗓️ SmartCalendar</Link>
      </div>

      {/* Pseudo ou Utilisateur */}
      <div className="nav-user">
        {username || user?.email?.split('@')[0] || 'Utilisateur'}
      </div>
      
      {/* NOUVEAUX LIENS */}
      <div className="nav-links">
        <Link to="/dashboard">Accueil</Link>
        <Link to="/calendar">Calendrier</Link>
        <Link to="/tasks">Tâches</Link>
        <Link to="/slots">Créneau</Link>
        <Link to="/schedule">Emploi du temps</Link>
        <Link to="/locations">Lieux</Link>
        <Link to="/settings">Paramètres</Link>
      </div>
      
      {/* Déconnexion */}
      <div className="nav-actions">
        <button onClick={logout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

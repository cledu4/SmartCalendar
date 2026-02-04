// src/components/Navbar.jsx - VERSION COMPLÈTE
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-brand">
        <Link to="/dashboard">🗓️ SmartCalendar</Link>
      </div>
      
      {/* Nom utilisateur */}
      <div className="nav-user">
        {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Utilisateur'}
      </div>
      
      {/* Liens navigation - ESPACÉS */}
      <div className="nav-links">
        <Link to="/dashboard">Accueil</Link>
        <Link to="/calendar">Calendrier</Link>
        <Link to="/tasks">Tâches</Link>
        <Link to="/ai-chat">IA</Link>
        <Link to="/messenger">Messagerie</Link>
      </div>
      
      {/* Bouton déconnexion */}
      <div className="nav-actions">
        <button onClick={logout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

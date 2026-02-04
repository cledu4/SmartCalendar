// src/components/Navbar.jsx - PSEUDO + SUPPRIME "IA"
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  // 👇 RÉCUPÈRE LE PSEUDO depuis la table profiles
  const getUsername = () => {
    return user?.user_metadata?.username || 'Utilisateur';
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-brand">
        <Link to="/dashboard">🗓️ SmartCalendar</Link>
      </div>
      
      {/* Nom utilisateur CORRIGÉ */}
      <div className="nav-user">
        {getUsername()}
      </div>
      
      {/* Liens navigation SANS IA */}
      <div className="nav-links">
        <Link to="/dashboard">Accueil</Link>
        <Link to="/calendar">Calendrier</Link>
        <Link to="/tasks">Tâches</Link>
        {/* 👈 IA supprimé */}
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

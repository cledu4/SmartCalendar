// src/components/Navbar.jsx - LIENS MODIFIÉS + PSEUDO VIA EMAIL
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  // 👇 EXTRAIT LE PSEUDO du pseudo déjà donné à l'inscription
  const getUsername = () => {
    // Essaie user_metadata.username (renseigné à l'inscription)
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }
    // Sinon prend début email
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-brand">
        <Link to="/dashboard">🗓️ SmartCalendar</Link>
      </div>

      {/* PSEUDO */}
      <div className="nav-user">
        {getUsername()}
      </div>
      
      {/* TOUS LES LIENS */}
      <div className="nav-links">
        <Link to="/dashboard">Accueil</Link>
        <Link to="/calendar">Calendrier</Link>
        <Link to="/find-slot">Trouver un Créneau</Link>
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

// src/pages/Dashboard.jsx - BIENVENUE + PSEUDO
import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, username } = useAuth();

  // 👇 RÉCUPÈRE LE PSEUDO (même logique que Navbar)
  const getUsername = () => {
    return username || user?.email?.split('@')[0]?.replace('.', ' ') || 'utilisateur';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {/* 👇 CORRECTION BIENVENUE */}
        <h2>Bienvenue, {getUsername()} !</h2>
        <p>SmartCalendar - Ton assistant intelligent</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-icon">📅</div>
          <h3>Calendrier</h3>
          <p>Gère tes événements</p>
          <a href="/calendar" className="card-link">Aller au calendrier</a>
        </div>

        <div className="card">
          <div className="card-icon">🔍</div>
          <h3>Tâches</h3>
          <p>Trouve sur mesure</p>
          <a href="/tasks" className="card-link">Voir les tâches</a>
        </div>

        <div className="card">
          <div className="card-icon">⏰</div>
          <h3>Emploi du temps</h3>
          <p>Importe tes fichiers</p>
          <a href="/schedule" className="card-link">Importer emploi</a>
        </div>

        <div className="card">
          <div className="card-icon">📍</div>
          <h3>Lieux</h3>
          <a href="/locations" className="card-link">Gérer les lieux</a>
        </div>

        <div className="card">
          <div className="card-icon">⚙️</div>
          <h3>Paramètres</h3>
          <p>Personnalise ton compte</p>
          <a href="/settings" className="card-link">Paramètres</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

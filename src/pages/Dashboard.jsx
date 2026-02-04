// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>👋 Bienvenue, {user?.user_metadata?.username || 'utilisateur'} !</h1>
      <p className="subtitle">Votre SmartCalendar personnel</p>

      <div className="dashboard-grid">
        <Link to="/calendar" className="dashboard-card card">
          <div className="card-icon">📅</div>
          <h3>Calendrier</h3>
          <p>Gérez vos tâches et événements</p>
        </Link>

        <Link to="/find-slot" className="dashboard-card card">
          <div className="card-icon">🔍</div>
          <h3>Trouver un créneau</h3>
          <p>Recherche intelligente de créneaux</p>
        </Link>

        <Link to="/schedule" className="dashboard-card card">
          <div className="card-icon">🕐</div>
          <h3>Emploi du temps</h3>
          <p>Vos horaires récurrents</p>
        </Link>

        <Link to="/locations" className="dashboard-card card">
          <div className="card-icon">📍</div>
          <h3>Mes lieux</h3>
          <p>Gérez vos adresses</p>
        </Link>

        <Link to="/settings" className="dashboard-card card">
          <div className="card-icon">⚙️</div>
          <h3>Paramètres</h3>
          <p>Configuration de l'app</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

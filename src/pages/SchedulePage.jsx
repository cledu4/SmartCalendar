// src/pages/SchedulePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function SchedulePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>🕐 Emploi du temps</h1>
        <p>Importez vos .ics ou fichiers emplois du temps</p>
      </div>
      
      <div className="page-content">
        <div className="upload-area">
          <div className="upload-zone">
            <div className="upload-icon">📁</div>
            <h3>Glissez votre fichier .ics ici</h3>
            <p>ou cliquez pour parcourir</p>
            <button className="upload-btn">Choisir fichier</button>
          </div>
          <div className="schedule-preview">
            <h3>Aperçu emploi du temps :</h3>
            <div className="schedule-week">
              <div className="schedule-day">
                <div className="day-name">Lundi</div>
                <div className="period">08h-10h Cours</div>
              </div>
              <div className="schedule-day">
                <div className="day-name">Mardi</div>
                <div className="period">14h-16h TD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;

// src/pages/TasksPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function TasksPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>✅ Tâches</h1>
        <p>Trouve sur mesure les créneaux parfaits</p>
      </div>
      
      <div className="page-content">
        <div className="tasks-placeholder">
          <div className="task-list">
            <h3>Vos tâches :</h3>
            <div className="task-item">
              <div className="task-checkbox">☐</div>
              <div className="task-details">
                <h4>Préparer réunion équipe</h4>
                <p>Deadline : Vendredi 17h</p>
              </div>
            </div>
            <div className="task-item completed">
              <div className="task-checkbox">☑️</div>
              <div className="task-details">
                <h4>Envoyer rapport</h4>
                <p>Terminé le 8 fév</p>
              </div>
            </div>
          </div>
          
          <div className="task-features">
            <h3>Fonctionnalités :</h3>
            <ul>
              <li>Création tâches avec IA</li>
              <li>Priorisation automatique</li>
              <li>Synchronisation calendrier</li>
              <li>Rappels intelligents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;

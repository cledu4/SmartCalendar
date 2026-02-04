// src/pages/TasksPage.jsx - CSS INTÉGRÉ
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function TasksPage() {
  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '0.5rem' }}>✅ Tâches</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Gérez vos tâches intelligemment</p>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Liste tâches */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Vos tâches :</h3>
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem', 
              borderBottom: '1px solid #eee',
              background: 'white',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem' }}>☐</div>
              <div>
                <h4 style={{ margin: '0', color: '#333' }}>Préparer réunion</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Deadline : Vendredi</p>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem', 
              background: '#e8f5e8',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.5rem' }}>☑️</div>
              <div>
                <h4 style={{ margin: '0', color: '#28a745' }}>Rapport envoyé</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Terminé hier</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fonctionnalités */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Fonctionnalités :</h3>
          <ul style={{ 
            background: '#f8f9fa', 
            borderRadius: '12px', 
            padding: '1.5rem',
            listStyle: 'none'
          }}>
            <li style={{ marginBottom: '1rem', padding: '0.5rem', background: 'white', borderRadius: '6px' }}>✨ IA suggère vos tâches</li>
            <li style={{ marginBottom: '1rem', padding: '0.5rem', background: 'white', borderRadius: '6px' }}>📱 Priorisation auto</li>
            <li style={{ marginBottom: '1rem', padding: '0.5rem', background: 'white', borderRadius: '6px' }}>🔔 Rappels intelligents</li>
            <li style={{ padding: '0.5rem', background: 'white', borderRadius: '6px' }}>🔄 Sync calendrier</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;

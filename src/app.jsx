// src/app.jsx - VERSION MINIMAL VERCEL
import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#3b82f6' }}>🚀 SmartCalendar</h1>
      <p style={{ color: '#6b7280' }}>
        <strong>✅ BUILD RÉUSSI !</strong><br/>
        Déploiement Vercel OK ! 🎉
      </p>
      <div style={{ 
        background: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginTop: '1rem'
      }}>
        <h3>📋 Prochaines étapes :</h3>
        <ul>
          <li>🔐 Config Supabase (.env)</li>
          <li>🗄️ Tables SQL</li>
          <li>⚡ Auth Login/Signup</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

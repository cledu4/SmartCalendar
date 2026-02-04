// src/pages/SlotsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function SlotsPage() {
  return (
    <div className="page" style={{ padding: '2rem
      <div className="page-header">
        <h1>🎯 Créneaux</h1>
        <p>Optimiseur de créneaux intelligents</p>
      </div>
      
      <div className="page-content">
        <div className="slots-demo">
          <h3>Tester un créneau :</h3>
          <div className="slot-selector">
            <div className="slot-option">
              <input type="radio" id="lundi" name="slot" />
              <label htmlFor="lundi">Lundi 14h-15h</label>
            </div>
            <div className="slot-option">
              <input type="radio" id="mardi" name="slot" />
              <label htmlFor="mardi">Mardi 10h-11h</label>
            </div>
            <button className="slot-btn">Valider créneau</button>
          </div>
          
          <div className="slot-info">
            <h3>Comment ça marche :</h3>
            <p>L'IA analyse tous les agendas et propose le créneau optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlotsPage;

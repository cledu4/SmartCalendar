// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react'
import storageService from '../services/storageService'

function SettingsPage() {
  const [settings, setSettings] = useState({
    nightStartTime: '21:00',
    nightEndTime: '06:00'
  });

  useEffect(() => {
    const savedSettings = storageService.getSettings();
    setSettings(savedSettings);
  }, []);

  const handleSave = () => {
    storageService.updateSettings(settings);
    alert('✅ Paramètres enregistrés');
  };

  const handleReset = () => {
    if (confirm('⚠️ Supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear();
      alert('✅ Toutes les données ont été supprimées');
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <h1>⚙️ Paramètres</h1>

      <div className="settings-section card">
        <h2>🌙 Horaires de nuit</h2>
        <p className="help-text">Période pendant laquelle vous n'êtes pas disponible (sommeil)</p>

        <div className="form-row">
          <div className="form-group">
            <label>Début de nuit</label>
            <input
              type="time"
              value={settings.nightStartTime}
              onChange={(e) => setSettings({ ...settings, nightStartTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Fin de nuit</label>
            <input
              type="time"
              value={settings.nightEndTime}
              onChange={(e) => setSettings({ ...settings, nightEndTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="settings-section card">
        <h2>🗺️ Calcul des trajets</h2>
        <div className="info-box">
          <h4>✅ Service gratuit activé</h4>
          <p>Smart Calendar utilise <strong>OSRM (OpenStreetMap)</strong> pour calculer automatiquement les temps de trajet.</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>✅ 100% gratuit et illimité</li>
            <li>✅ Pas de clé API nécessaire</li>
            <li>✅ Données OpenStreetMap (excellente qualité)</li>
            <li>✅ Fonctionne immédiatement</li>
          </ul>
        </div>
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} className="btn btn-success btn-large">
          💾 Enregistrer les paramètres
        </button>
      </div>

      <div className="danger-zone card">
        <h2>⚠️ Zone dangereuse</h2>
        <p>Supprimer toutes vos données (lieux, tâches, événements, paramètres)</p>
        <button onClick={handleReset} className="btn btn-danger">
          🗑️ Réinitialiser l'application
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
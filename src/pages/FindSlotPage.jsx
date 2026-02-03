// src/pages/FindSlotPage.jsx
import React, { useState, useEffect } from 'react'
import storageService from '../services/storageService'
import slotFinderService from '../services/slotFinderService'

function FindSlotPage() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [duration, setDuration] = useState(60);
  const [modeGo, setModeGo] = useState('driving');
  const [modeReturn, setModeReturn] = useState('driving');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const transportModes = [
    { value: 'walking', label: '🚶 À pied', speed: '~5 km/h' },
    { value: 'cycling', label: '🚲 Vélo', speed: '~15 km/h' },
    { value: 'driving', label: '🚗 Voiture', speed: '~40 km/h' },
    { value: 'transit', label: '🚍 Transports en commun', speed: '~25 km/h' }
  ];

  useEffect(() => {
    const locs = storageService.getLocations();
    setLocations(locs);
    if (locs.length > 0) {
      setSelectedLocation(locs[0].id);
    }
  }, []);

  const handleSearch = async () => {
    if (!selectedLocation || !duration) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const home = storageService.getLocations().find(loc => loc.isHome);
    if (!home) {
      setError("⚠️ Veuillez d'abord définir un lieu comme domicile dans 'Mes lieux'");
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const slots = await slotFinderService.findAvailableSlots(
        selectedLocation,
        duration,
        modeGo,
        modeReturn,
        14
      );

      if (slots.length === 0) {
        setError('Aucun créneau disponible trouvé sur les 14 prochains jours. Essayez une durée plus courte ou changez les modes de transport.');
      } else {
        setResults(slots);
      }
    } catch (err) {
      console.error('Erreur recherche:', err);
      setError(`Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    } else {
      return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  };

  const handleBookSlot = (slot) => {
    const location = locations.find(l => l.id === selectedLocation);

    const task = {
      title: `RDV - ${location.name}`,
      description: `Rendez-vous de ${duration} minutes\nAller: ${slot.modeGo}\nRetour: ${slot.modeReturn}`,
      startDatetime: slot.startTime.toISOString(),
      endDatetime: slot.endTime.toISOString(),
      locationId: selectedLocation,
      allowNightHours: false
    };

    storageService.addTask(task);
    alert('✅ Rendez-vous ajouté au calendrier !');
    setResults([]);
  };

  return (
    <div className="find-slot-page">
      <h1>🔍 Trouver un créneau disponible</h1>
      <p className="subtitle">
        L'algorithme calcule les temps de trajet selon vos modes de transport choisis
      </p>

      <div className="search-form card">
        <div className="form-group">
          <label>Lieu du rendez-vous *</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(parseInt(e.target.value))}
            disabled={locations.length === 0}
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.isHome && '🏠'}
              </option>
            ))}
          </select>
          {locations.length === 0 && (
            <p className="help-text">⚠️ Ajoutez d'abord des lieux dans "Mes lieux"</p>
          )}
        </div>

        <div className="form-group">
          <label>Durée du RDV (minutes) *</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="15"
            step="15"
          />
        </div>

        <div className="transport-modes-section">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🚀 Modes de transport</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Mode aller (vers le RDV)</label>
              <select
                value={modeGo}
                onChange={(e) => setModeGo(e.target.value)}
              >
                {transportModes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label} - {mode.speed}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mode retour (après le RDV)</label>
              <select
                value={modeReturn}
                onChange={(e) => setModeReturn(e.target.value)}
              >
                {transportModes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label} - {mode.speed}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="help-text">
            💡 Vous pouvez choisir des modes différents pour l'aller et le retour
          </p>
        </div>

        <button
          onClick={handleSearch}
          className="btn btn-primary btn-large"
          disabled={locations.length === 0 || loading}
        >
          {loading ? '🔄 Recherche en cours...' : '🔍 Rechercher des créneaux'}
        </button>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#FFEBEE', borderLeft: '4px solid #F44336' }}>
          <p style={{ color: '#C62828', margin: 0 }}>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="results">
          <h2>✅ {results.length} créneau{results.length > 1 ? 'x' : ''} disponible{results.length > 1 ? 's' : ''}</h2>

          {results.map(slot => (
            <div key={slot.id} className="slot-card card">
              <div className="slot-info">
                <div className="slot-date-badge">
                  {formatDateShort(slot.startTime)}
                </div>
                <h3>{formatDateTime(slot.startTime)}</h3>

                {/* Timeline des activités */}
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <span className="timeline-icon">📍</span>
                    <div>
                      <strong>{slot.previousActivity}</strong>
                      <p className="timeline-travel">
                        ↓ {slot.modeGo} : ~{slot.travelBefore} min
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item timeline-rdv">
                    <span className="timeline-icon">⏱️</span>
                    <div>
                      <strong>Rendez-vous</strong>
                      <p>{formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({duration} min)</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <span className="timeline-icon">📍</span>
                    <div>
                      <p className="timeline-travel">
                        ↓ {slot.modeReturn} : ~{slot.travelAfter} min
                      </p>
                      <strong>{slot.nextActivity}</strong>
                    </div>
                  </div>
                </div>

                <p className="total-time">
                  ⏰ Temps total bloqué : {duration + slot.travelBefore + slot.travelAfter} minutes
                </p>
              </div>

              <button
                onClick={() => handleBookSlot(slot)}
                className="btn btn-success"
              >
                📅 Réserver ce créneau
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="empty-state card">
          <h3>💡 Comment ça marche ?</h3>
          <ol style={{ textAlign: 'left', marginTop: '1rem' }}>
            <li>Ajoutez vos lieux fréquents dans <strong>"Mes lieux"</strong></li>
            <li>Marquez un lieu comme domicile 🏠</li>
            <li>Configurez votre emploi du temps dans <strong>"Emploi du temps"</strong></li>
            <li>Choisissez vos modes de transport (aller et retour)</li>
            <li>L'algorithme trouve les meilleurs créneaux !</li>
          </ol>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#E3F2FD', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#1976D2' }}>🚀 Modes de transport disponibles</h4>
            <ul style={{ textAlign: 'left', fontSize: '0.9rem', color: '#555', lineHeight: '1.8' }}>
              <li><strong>🚶 À pied</strong> - Pour les courtes distances (~5 km/h)</li>
              <li><strong>🚲 Vélo</strong> - Rapide et écologique (~15 km/h)</li>
              <li><strong>🚗 Voiture</strong> - Pour les longues distances (~40 km/h)</li>
              <li><strong>🚍 Transports en commun</strong> - Estimation avec attente (~25 km/h)</li>
            </ul>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontStyle: 'italic' }}>
              💡 Astuce : Vous pouvez aller en vélo et revenir à pied, ou toute autre combinaison !
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindSlotPage
// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react'
import storageService from '../services/storageService'

function RecurringSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    title: '',
    locationIds: [] // CHANGÉ : tableau pour plusieurs lieux
  });

  // ORDRE CORRIGÉ : Lundi (1) → Dimanche (0)
  const daysOfWeek = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 0, label: 'Dimanche' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const schedData = storageService.getRecurringSchedule();
    const locsData = storageService.getLocations();
    setSchedules(schedData);
    setLocations(locsData);
  };

  // NOUVEAU : Gérer la sélection multiple de lieux
  const handleLocationChange = (locationId) => {
    setForm(prev => {
      const currentIds = prev.locationIds;
      const newIds = currentIds.includes(locationId)
        ? currentIds.filter(id => id !== locationId) // Déselectionner
        : [...currentIds, locationId]; // Ajouter
      return { ...prev, locationIds: newIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.startTime || !form.endTime) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // SAUVEGARDE : locationIds au lieu de locationId
    storageService.addRecurringSchedule({
      ...form,
      locationIds: form.locationIds // Tableau de lieux
    });
    
    setForm({ dayOfWeek: 1, startTime: '', endTime: '', title: '', locationIds: [] });
    setShowForm(false);
    loadData();
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce créneau ?')) {
      storageService.deleteRecurringSchedule(id);
      loadData();
    }
  };

  const groupedSchedules = daysOfWeek.map(day => ({
    day: day.label,
    dayValue: day.value,
    schedules: schedules.filter(s => s.dayOfWeek === day.value)
  }));

  // NOUVEAU : Récupérer les noms des lieux pour un créneau
  const getLocationNames = (locationIds) => {
    if (!locationIds || locationIds.length === 0) return '📍 Aucun lieu';
    return locationIds.map(id => {
      const loc = locations.find(l => l.id === id);
      return loc ? `📍 ${loc.name}` : 'Lieu inconnu';
    }).join(', ');
  };

  return (
    <div className="schedule-page">
      <h1>📅 Emploi du temps récurrent</h1>
      <p className="subtitle">Configurez vos cours, horaires de travail et activités régulières</p>

      <div className="week-schedule">
        {groupedSchedules.map(group => (
          <div key={group.dayValue} className="day-section">
            <h3 className="day-title">{group.day}</h3>
            {group.schedules.length === 0 ? (
              <p className="empty-text">Pas d'emploi du temps</p>
            ) : (
              <div className="schedules-list">
                {group.schedules
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(sched => (
                    <div key={sched.id} className="schedule-card">
                      <div className="schedule-info">
                        <h4>{sched.title}</h4>
                        <p className="time">{sched.startTime} - {sched.endTime}</p>
                        {/* NOUVEAU : Affichage des lieux */}
                        {sched.locationIds && sched.locationIds.length > 0 && (
                          <p className="location-text">{getLocationNames(sched.locationIds)}</p>
                        )}
                      </div>
                      <button onClick={() => handleDelete(sched.id)} className="btn-delete">
                        🗑️
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-primary btn-large">
          + Ajouter un créneau
        </button>
      ) : (
        <div className="form-container card">
          <h2>Nouveau créneau</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Jour de la semaine</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })}
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Cours de mathématiques"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Heure de début *</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Heure de fin *</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* NOUVEAU : Sélection multiple de lieux */}
            {locations.length > 0 && (
              <div className="form-group">
                <label>Lieux (cliquez pour sélectionner plusieurs)</label>
                <div className="locations-multi-select">
                  {locations.map(location => (
                    <label key={location.id} className="location-checkbox">
                      <input
                        type="checkbox"
                        checked={form.locationIds.includes(location.id)}
                        onChange={() => handleLocationChange(location.id)}
                      />
                      <span>{location.name} {location.isHome && '🏠'}</span>
                    </label>
                  ))}
                </div>
                {form.locationIds.length > 0 && (
                  <p className="help-text">
                    Sélectionnés : {form.locationIds.length} lieu(x)
                  </p>
                )}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn btn-success">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default RecurringSchedulePage

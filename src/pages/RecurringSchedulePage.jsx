// src/pages/RecurringSchedulePage.jsx
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
    locationId: null
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
    if (locsData.length > 0 && !form.locationId) {
      setForm(prev => ({ ...prev, locationId: locsData[0].id }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.startTime || !form.endTime) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    storageService.addRecurringSchedule(form);
    setForm({ dayOfWeek: 1, startTime: '', endTime: '', title: '', locationId: locations[0]?.id });
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

            {locations.length > 0 && (
              <div className="form-group">
                <label>Lieu</label>
                <select
                  value={form.locationId}
                  onChange={(e) => setForm({ ...form, locationId: parseInt(e.target.value) })}
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
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
// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import storageService from '../services/storageService'

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [locations, setLocations] = useState([]);

  // Formulaires
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    locationId: null,
    allowNightHours: false
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    time: ''
  });

  useEffect(() => {
    loadData();
    loadLocations();
  }, [selectedDate]);

  const loadData = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const startOfDay = `${dateStr}T00:00:00`;
    const endOfDay = `${dateStr}T23:59:59`;

    const dayTasks = storageService.getTasks(startOfDay, endOfDay);
    const dayEvents = storageService.getEvents(dateStr, dateStr);

    setTasks(dayTasks);
    setEvents(dayEvents);
  };

  const loadLocations = () => {
    const locs = storageService.getLocations();
    setLocations(locs);
    if (locs.length > 0 && !taskForm.locationId) {
      setTaskForm(prev => ({ ...prev, locationId: locs[0].id }));
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    const dateStr = selectedDate.toISOString().split('T')[0];
    const task = {
      title: taskForm.title,
      description: taskForm.description,
      startDatetime: `${dateStr}T${taskForm.startTime}:00`,
      endDatetime: `${dateStr}T${taskForm.endTime}:00`,
      locationId: taskForm.locationId,
      allowNightHours: taskForm.allowNightHours
    };

    storageService.addTask(task);
    setShowTaskForm(false);
    setTaskForm({ title: '', description: '', startTime: '', endTime: '', locationId: locations[0]?.id, allowNightHours: false });
    loadData();
  };

  const handleAddEvent = (e) => {
    e.preventDefault();

    const dateStr = selectedDate.toISOString().split('T')[0];
    const event = {
      title: eventForm.title,
      description: eventForm.description,
      eventDate: dateStr,
      eventTime: eventForm.time || null
    };

    storageService.addEvent(event);
    setShowEventForm(false);
    setEventForm({ title: '', description: '', time: '' });
    loadData();
  };

  const handleDeleteTask = (id) => {
    if (confirm('Supprimer cette tâche ?')) {
      storageService.deleteTask(id);
      loadData();
    }
  };

  const handleDeleteEvent = (id) => {
    if (confirm('Supprimer cet événement ?')) {
      storageService.deleteEvent(id);
      loadData();
    }
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="calendar-page">
      <h1>📆 Mon Calendrier</h1>

      {/* LAYOUT 2 COLONNES : Calendrier à gauche, Tâches/Événements à droite */}
      <div className="calendar-layout">

        {/* COLONNE GAUCHE : CALENDRIER */}
        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale="fr-FR"
          />
        </div>

        {/* COLONNE DROITE : TÂCHES ET ÉVÉNEMENTS */}
        <div className="day-view">
          <h2>
            {selectedDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>

          {/* TÂCHES */}
          <div className="section">
            <div className="section-header">
              <h3>Tâches</h3>
              <button onClick={() => setShowTaskForm(true)} className="btn btn-primary">
                + Ajouter une tâche
              </button>
            </div>

            {tasks.length === 0 ? (
              <p className="empty-text">Aucune tâche pour ce jour</p>
            ) : (
              <div className="items-list">
                {tasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="card-content">
                      <h4>{task.title}</h4>
                      <p className="time">{formatTime(task.startDatetime)} - {formatTime(task.endDatetime)}</p>
                      {task.description && <p className="description">{task.description}</p>}
                    </div>
                    <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ÉVÉNEMENTS */}
          <div className="section">
            <div className="section-header">
              <h3>Événements</h3>
              <button onClick={() => setShowEventForm(true)} className="btn btn-success">
                + Ajouter un événement
              </button>
            </div>

            {events.length === 0 ? (
              <p className="empty-text">Aucun événement pour ce jour</p>
            ) : (
              <div className="items-list">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="card-content">
                      <h4>{event.title}</h4>
                      {event.eventTime && <p className="time">🕐 {event.eventTime}</p>}
                      {event.description && <p className="description">{event.description}</p>}
                    </div>
                    <button onClick={() => handleDeleteEvent(event.id)} className="btn-delete">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL AJOUT TÂCHE */}
      {showTaskForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nouvelle tâche</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Heure de début *</label>
                  <input
                    type="time"
                    value={taskForm.startTime}
                    onChange={(e) => setTaskForm({ ...taskForm, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Heure de fin *</label>
                  <input
                    type="time"
                    value={taskForm.endTime}
                    onChange={(e) => setTaskForm({ ...taskForm, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              {locations.length > 0 && (
                <div className="form-group">
                  <label>Lieu</label>
                  <select
                    value={taskForm.locationId}
                    onChange={(e) => setTaskForm({ ...taskForm, locationId: parseInt(e.target.value) })}
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={taskForm.allowNightHours}
                    onChange={(e) => setTaskForm({ ...taskForm, allowNightHours: e.target.checked })}
                  />
                  Autoriser horaires de nuit
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowTaskForm(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT ÉVÉNEMENT */}
      {showEventForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nouvel événement</h2>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Heure (optionnel)</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEventForm(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-success">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage
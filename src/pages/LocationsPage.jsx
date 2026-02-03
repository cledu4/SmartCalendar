// src/pages/LocationsPage.jsx
import React, { useState, useEffect } from 'react'
import storageService from '../services/storageService'

function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    isHome: false
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    const locs = storageService.getLocations();
    setLocations(locs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    storageService.addLocation({
      name: form.name,
      address: form.address,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      isHome: form.isHome
    });

    setForm({ name: '', address: '', latitude: '', longitude: '', isHome: false });
    setShowForm(false);
    loadLocations();
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce lieu ?')) {
      storageService.deleteLocation(id);
      loadLocations();
    }
  };

  return (
    <div className="locations-page">
      <h1>📍 Mes lieux fréquents</h1>
      <p className="subtitle">Gérez les lieux que vous fréquentez régulièrement</p>

      {locations.length === 0 ? (
        <div className="empty-state card">
          <h3>Aucun lieu enregistré</h3>
          <p>Ajoutez votre domicile, lieu de travail, école, etc.</p>
        </div>
      ) : (
        <div className="locations-list">
          {locations.map(location => (
            <div key={location.id} className="location-card card">
              <div className="location-info">
                <h3>
                  {location.name} {location.isHome && '🏠'}
                </h3>
                <p className="address">{location.address}</p>
                <p className="coords">
                  📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              </div>
              <button onClick={() => handleDelete(location.id)} className="btn-delete">
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-primary btn-large">
          + Ajouter un lieu
        </button>
      ) : (
        <div className="form-container card">
          <h2>Nouveau lieu</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom du lieu *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Domicile, Travail, École..."
                required
              />
            </div>

            <div className="form-group">
              <label>Adresse complète *</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Ex: 123 Rue de la République, 69001 Lyon"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="45.764043"
                  required
                />
              </div>

              <div className="form-group">
                <label>Longitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  placeholder="4.835659"
                  required
                />
              </div>
            </div>

            <div className="help-text">
              💡 Pour obtenir les coordonnées : Ouvrez Google Maps, faites un clic droit sur le lieu, puis cliquez sur les coordonnées pour les copier
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={form.isHome}
                  onChange={(e) => setForm({ ...form, isHome: e.target.checked })}
                />
                Marquer comme domicile 🏠
              </label>
            </div>

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

export default LocationsPage
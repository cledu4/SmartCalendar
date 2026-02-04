// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(email, password, username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container card">
        <div className="auth-header">
          <h1>🚀 Inscription</h1>
          <p>Créez votre compte SmartCalendar</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="clem4"
              minLength="3"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              minLength="6"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success btn-large"
            disabled={loading || !email || !password || !username || username.length < 3}
          >
            {loading ? '🔄 Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

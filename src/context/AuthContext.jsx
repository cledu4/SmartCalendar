// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email, password, username) => {
    // Créer l'utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) throw error;

    // Créer le profil utilisateur
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username,
        email,
        created_at: new Date().toISOString()
      });

    if (profileError) console.error('Erreur profil:', profileError);

    // Créer les données utilisateur vides
    const { error: dataError } = await supabase
      .from('user_data')
      .insert({
        user_id: data.user.id,
        locations: [],
        settings: {
          nightStartTime: '22:00',
          nightEndTime: '07:00'
        },
        tasks: [],
        recurring_schedule: []
      });

    if (dataError) console.error('Erreur données:', dataError);

    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.jsx - VERSION COMPLÈTE
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

  // 👇 FONCTION LOGIN AJOUTÉE
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // 👇 FONCTION SIGNUP AJOUTÉE
  const signup = async (email, password, username) => {
    // 1. Créer compte Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;

    // 2. Créer profil avec pseudo
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username,
        updated_at: new Date().toISOString()
      });
    }

    return data;
  };

  // 👇 FONCTION LOGOUT AJOUTÉE
  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { 
    user, 
    loading, 
    login,      ✅
    signup,     ✅
    logout      ✅
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

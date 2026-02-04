// src/context/AuthContext.jsx - PSEUDO SIMPLIFIÉ
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
  const [username, setUsername] = useState(null);  // 👈 ÉTAT PSEUDO
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, usernameInput) => {
    // 1. Créer compte avec pseudo
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: usernameInput }  // 👈 STOCKE DIRECT
      }
    });
    
    if (error) throw error;

    // 2. Créer profil
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username: usernameInput,
        updated_at: new Date().toISOString()
      });
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // 👇 CHARGE LE PSEUDO
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { 
    user, 
    username, 
    loading, 
    login, 
    signup, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

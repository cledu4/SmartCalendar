// src/context/AuthContext.jsx - RÉCUPÈRE LE PSEUDO
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const [username, setUsername] = useState('');  // 👈 AJOUTÉ
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, username) => {
    // 1. Créer compte
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }  // 👈 AJOUTÉ username dans metadata
      }
    });
    
    if (error) throw error;

    // 2. Créer profil
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username,  // 👈 STOCKÉ dans profiles
        updated_at: new Date().toISOString()
      });
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // 👇 RÉCUPÈRE LE USERNAME au login
  const fetchUserProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (data?.username) {
      setUsername(data.username);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUsername('');
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const value = { 
    user, 
    username,  // 👈 DISPONIBLE dans Navbar
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

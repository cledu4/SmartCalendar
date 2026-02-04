// src/services/authService.js
import { supabase } from '../lib/supabase'

export const authService = {
  async signup(email, password, username) {
    // Créer l'utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) throw error

    // Créer profil utilisateur
    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      avatar_url: null,
      updated_at: new Date().toISOString()
    })

    // Initialiser données utilisateur
    await supabase.from('user_data').insert({
      id: data.user.id,
      locations: [],
      settings: {
        nightStartTime: '22:00',
        nightEndTime: '07:00'
      },
      tasks: [],
      recurring_schedule: []
    })

    return data.user
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data.user
  },

  async logout() {
    await supabase.auth.signOut()
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const { data: userData } = await supabase
      .from('user_data')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return {
      ...session.user,
      profile,
      userData: userData || {}
    }
  }
}

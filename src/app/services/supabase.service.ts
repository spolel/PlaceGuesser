import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from '../../environments/environment'

export interface Profile {
  username: string
  country: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  get user() {
    return this.supabase.auth.user()
  }

  get session() {
    return this.supabase.auth.session()
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, country, avatar_url`)
      .eq('id', this.user?.id)
      .single()
  }

  usernameExists(username: string) {
    return this.supabase
      .from('profiles')
      .select()
      .eq('username', username)
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }


  signUp(email: string, password: string, username: string) {
    return this.supabase.auth.signUp({ email, password }, { data: { username } })
  }

  signInMagic(email: string) {
    return this.supabase.auth.signIn({ email }, { redirectTo: window.location.origin + "/login" })
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signIn({ email, password })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    })
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  newGuest(username: string) {
    return this.supabase.from('guests').upsert({
      username: username
    })
  }
}

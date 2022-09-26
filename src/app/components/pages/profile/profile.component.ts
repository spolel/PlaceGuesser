import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from 'src/app/services/supabase.service'
import { Session } from '@supabase/supabase-js'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading = false
  profile: Profile | undefined

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService, private router: Router) { }

  ngOnInit() {

    this.supabase.authChanges((_, session) => (this.session = session))

    this.getProfile()
  }

  async getProfile() {
    try {
      this.loading = true
      let { data: profile, error, status } = await this.supabase.profile

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      this.loading = false
    }
  }

  async updateProfile(
    username: string,
    country?: string,
    avatar_url?: string
  ) {
    console.log("updated: ", username, country, avatar_url)
    try {
      this.loading = true
      await this.supabase.updateProfile({ username, country, avatar_url })
    } catch (error) {
      console.log(error.message)
    } finally {
      this.loading = false
      
      this.getProfile()
    }
  }

  async signOut() {
    await this.supabase.signOut()

    this.router.navigate(['login']);
  }
}

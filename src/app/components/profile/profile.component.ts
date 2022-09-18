import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from 'src/app/services/supabase.service'
import { Session } from '@supabase/supabase-js'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading = false
  profile: Profile | undefined

  @Input() session: Session | undefined

  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit() {
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
      alert(error.message)
    } finally {
      this.loading = false
    }
  }

  async updateProfile(
    username: string,
    website: string,
    avatar_url: string = ''
  ) {
    try {
      this.loading = true
      await this.supabase.updateProfile({ username, website, avatar_url })
    } catch (error) {
      alert(error.message)
    } finally {
      this.loading = false
    }
  }

  async signOut() {
    await this.supabase.signOut()
  }
}

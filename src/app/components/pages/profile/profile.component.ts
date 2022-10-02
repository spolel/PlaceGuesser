import { Component, Input, OnInit } from '@angular/core';
import { Profile, SupabaseService } from 'src/app/services/supabase.service';
import { Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { GuestService } from 'src/app/services/guest.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loading = false;
  profile: Profile | undefined;

  session = this.supabase.session;

  get guestMode(): boolean {
    return this.guest.guestMode;
  }
  set guestMode(value: boolean) {
    this.guest.guestMode = value;
  }

  get guestUsername(): string {
    return this.local.getGuest().username;
  }

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private guest: GuestService,
    private local: LocalstorageService
  ) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));

    if (this.guestMode && !this.local.getGuest()) {
      this.guestMode = false;
      this.router.navigate(['login']);
    }

    if (!this.guestMode) {
      this.getProfile();
    }
  }

  async getProfile() {
    try {
      this.loading = true;
      let { data: profile, error, status } = await this.supabase.profile;

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(username: string, country?: string, avatar_url?: string) {
    console.log('updated: ', username, country, avatar_url);
    try {
      this.loading = true;
      await this.supabase.updateProfile({ username, country, avatar_url });
    } catch (error) {
      console.log(error.message);
    } finally {
      this.loading = false;

      this.getProfile();
    }
  }

  async editProfile() {
    this.router.navigate(['edit']);
  }

  async signOut() {
    await this.supabase.signOut();

    this.router.navigate(['login']);
  }

  signOutGuest() {
    this.guestMode = false;
    this.local.removeGuest();
    this.router.navigate(['login']);
  }
}

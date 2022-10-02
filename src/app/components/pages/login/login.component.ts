import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  get guestMode(): boolean {
    return this.guest.guestMode;
  }
  set guestMode(value: boolean) {
    this.guest.guestMode = value;
  }

  session = this.supabase.session;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private guest: GuestService,
    private local: LocalstorageService
  ) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => {
      this.session = session;

      //reroute on login
      if (this.session) {
        this.router.navigate(['']);
      }
    });

    //reroute if already logged in
    if (this.session) {
      this.router.navigate(['']);
    }

    //reroute if guest in localstorage
    if (this.local.getGuest()) {
      this.guestMode = true;
      this.router.navigate(['']);
    }
  }

  enterAsGuest() {
    this.guest.authNewGuest();
    this.guestMode = true;
    this.router.navigate(['']);
  }
}

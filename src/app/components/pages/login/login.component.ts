import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
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
    private guest: GuestService
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
  }

  enterAsGuest() {
    this.guestMode = true;
    this.router.navigate(['']);
  }
}

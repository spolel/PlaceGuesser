import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => {
      this.session = session

      //reroute on login
      if(this.session){
        this.router.navigate(['']);
      }
    })

    //reroute if already logged in
    if(this.session){
      this.router.navigate(['']);
    }
  }
}

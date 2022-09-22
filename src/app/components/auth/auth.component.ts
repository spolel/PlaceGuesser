import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/services/supabase.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loading = false

  email = new FormControl('', [Validators.required, Validators.email]);


  constructor(private readonly supabase: SupabaseService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  async handleLogin(input: string) {
    try {
      this.loading = true
      await this.supabase.signIn(input)
      this.openSnackBar('Check your email for the login link!','close')
    } catch (error) {
      console.log(error.error_description || error.message)
    } finally {
      this.loading = false
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter an email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service'
import { UsernameExistsValidator } from './usernameExists.validator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loading: boolean = false
  loadingLogin: boolean = false
  loadingSignup: boolean = false

  // magic = new FormControl('', [Validators.required, Validators.email]);
  loginEmail = new FormControl('', [Validators.required, Validators.email]);
  loginPass = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  signupEmail = new FormControl('', [Validators.required, Validators.email]);
  signupPass = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  signupUser = new FormControl('', [Validators.required, this.noWhitespaceValidator], [this.usernameExistsValid.validate]);

  loginError: string = "";
  signupError: string = "";

  constructor(private readonly supabase: SupabaseService,private usernameExistsValid: UsernameExistsValidator, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  noWhitespaceValidator(control: FormControl) {
    //const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isWhitespace = /\s/g.test(control.value)
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  async magicLogin(email: string) {
    try {
      this.loading = true
      await this.supabase.signInMagic(email)
      this.openSnackBar('Check your email for the login link!', 'close')
    } catch (error) {
      console.log(error.error_description || error.message)
    } finally {
      this.loading = false
    }
  }

  async passLogin(email: string, password: string) {
    try {
      this.loadingLogin = true
      const { user, session, error } = await this.supabase.signIn(email, password)
      if (error) {
        //this.openSnackBar(error.message, 'close')
        this.loginError = error.message
      }

    } catch (error) {
      console.log(error.error_description || error.message)
    } finally {
      this.loadingLogin = false
    }
  }

  async signUp(email: string, password: string, username: string) {
    try {
      this.loadingSignup = true
      const { user, session, error } = await this.supabase.signUp(email, password, username)
      this.openSnackBar('Check your email to verify the account!', 'close')

      if (error) {
        //this.openSnackBar(error.message, 'close')
        this.signupError = error.message
      }
    } catch (error) {
      console.log(error.error_description || error.message)
    } finally {
      this.loadingSignup = false
    }
  }

  getErrorMessage(form: FormControl) {
    return form.hasError('email') ? 'Not a valid email' : '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}

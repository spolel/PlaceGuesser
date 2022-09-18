import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loading = false

  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit(): void {
  }

  async handleLogin(input: string) {
    try {
      this.loading = true
      await this.supabase.signIn(input)
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false
    }
  }

}

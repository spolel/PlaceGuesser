import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamesettingsService } from 'src/app/services/gamesettings.service';
import { Profile, SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  get gameMode(): string {
    return this.gameSettings.gameMode;
  }
  set gameMode(value: string) {
    this.gameSettings.gameMode = value;
  }

  get zoneMode(): string {
    return this.gameSettings.zoneMode;
  }
  set zoneMode(value: string) {
    this.gameSettings.zoneMode = value;
  }

  get populationMode(): string {
    return this.gameSettings.populationMode;
  }
  set populationMode(value: string) {
    this.gameSettings.populationMode = value;
  }

  get countryCode(): string {
    return this.gameSettings.countryCode;
  }
  set countryCode(value: string) {
    this.gameSettings.countryCode = value;
  }

  loading: boolean;
  profile: Profile | undefined
  username: string;


  constructor(private router: Router, public gameSettings: GamesettingsService, private supabase: SupabaseService) { }

  ngOnInit(): void {

    this.getProfile()
    // console.log(this.gameMode)
    // console.log(this.zoneMode)
    // console.log(this.populationMode)
    // console.log(this.countryCode)
  }

  resetGame(){
    this.router.navigate([''])
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
        this.username = profile.username
        // console.log(this.username)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      this.loading = false
    }
  }

}

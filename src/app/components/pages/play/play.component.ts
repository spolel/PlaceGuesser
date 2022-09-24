import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamesettingsService } from 'src/app/services/gamesettings.service';

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


  get username(): string {
    return this.gameSettings.username;
  }
  set username(value: string) {
    this.gameSettings.username = value;
  }


  constructor(private router: Router, public gameSettings: GamesettingsService) { }

  ngOnInit(): void {
  }

  resetGame(){
    this.router.navigate(['home'])
  }

}

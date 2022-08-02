import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { UsernameValidator } from './username-validator';

const populationStats = {
  "worldwide": {
    "500": 159872,
    "10000": 34144,
    "50000": 9613,
    "100000": 4721,
    "500000": 968
  },
  "europe": {
    "500": 83566,
    "10000": 10869,
    "50000": 2083,
    "100000": 887,
    "500000": 110
  },
  "asia/oceania": {
    "500": 24379,
    "10000": 10896,
    "50000": 4197,
    "100000": 2195,
    "500000": 581
  },
  "africa": {
    "500": 4074,
    "10000": 2795,
    "50000": 1005,
    "100000": 553,
    "500000": 105
  },
  "americas": {
    "500": 47852,
    "10000": 9584,
    "50000": 2328,
    "100000": 1086,
    "500000": 172
  }

}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameStarted: boolean = false
  gameMode: string;
  populationMode: string;
  username: string;

  populationStats: any = populationStats;

  settingsOpen: boolean = false
  helpOpen: boolean = false
  statsOpen: boolean = false
  stats: any = {}
  barChartData: any[] = []
  rank: number;

  gameModeControl = new FormControl('');
  populationControl = new FormControl('');
  usernameControl = new FormControl(undefined, [
    Validators.maxLength(25)
  ]);

  //[UsernameValidator.createValidator()]

  imageId: number;
  backgroundUrl: string;

  backgroundStyle: any;


  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    //console.log(document.getElementsByClassName('app-container')[0]);
    this.imageId = Math.floor(Math.random() * 16) + 1;

    this.backgroundUrl = "../../assets/home-backgrounds/" + this.imageId + "-min.jpg"
    //console.log(this.backgroundUrl)

    this.backgroundStyle = 'linear-gradient(0deg, rgba(0, 0, 0, 0.90), rgba(0, 0, 0, 0.6)), url(' + this.backgroundUrl + ') no-repeat center center fixed'

    this.gameMode = 'worldwide'
    this.populationMode = '10000'
    this.gameModeControl.setValue(this.gameMode)
    this.populationControl.setValue(this.populationMode)

    this.getStats()
  }

  ngAfterViewInit() {

  }

  startGame() {
    this.settingsOpen = false
    this.gameStarted = true
    this.gameMode = this.gameModeControl.value
    this.populationMode = this.populationControl.value
    this.username = this.usernameControl.value
  }

  resetGame() {
    this.gameStarted = false
    this.getStats()
  }

  getStats() {
    if (localStorage.getItem('history') != null) {
      this.stats = JSON.parse(localStorage.getItem('history'))
    } else {
      this.stats = { played: 0, highscore: 0, distribution: [] }
    }

    this.barChartData = this.stats["distribution"]
    this.getRank()

  }

  getRank() {
    this.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: data => {
        this.rank = data.length
      },
      error: error => {
        console.log(error)
      }
    })

  }

  getRankFromLeaderboard(highscore: number): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_rank?highscore=' + highscore, { responseType: "json" });
  }

  getErrorMessage() {
    return this.usernameControl.hasError('maxlength') ? 'Maximum length 25' : '';
  }

  openSettings() {
    this.settingsOpen = true
  }

  closeSettings() {
    this.settingsOpen = false
  }

  openHelp() {
    this.helpOpen = true
  }

  closeHelp() {
    this.helpOpen = false
  }

  openStats() {
    this.statsOpen = true
  }

  closeStats() {
    this.statsOpen = false
  }

}

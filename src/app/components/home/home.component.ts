import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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

  userdata: any = {}

  gameModeControl = new FormControl('');
  populationControl = new FormControl('');
  usernameControl = new FormControl(undefined, [
    Validators.maxLength(25),
    this.noWhitespaceValidator
  ]);

  //[UsernameValidator.createValidator()]

  imageId: number;
  backgroundUrl: string;

  backgroundStyle: any;

  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  logging: boolean = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.isMobile()
    
    //console.log(document.getElementsByClassName('app-container')[0]);
    this.imageId = Math.floor(Math.random() * 16) + 1;

    this.backgroundUrl = "../../assets/home-backgrounds/" + this.imageId + "-min.jpg"
    //console.log(this.backgroundUrl)

    this.backgroundStyle = 'linear-gradient(0deg, rgba(0, 0, 0, 0.90), rgba(0, 0, 0, 0.6)), url(' + this.backgroundUrl + ') no-repeat center center fixed'

    this.gameMode = 'worldwide'
    this.populationMode = '10000'
    this.gameModeControl.setValue(this.gameMode)
    this.populationControl.setValue(this.populationMode)
    


    this.getUserdata()
    this.restoreHistoryFromDb()

    this.getStats()


  }

  ngAfterViewInit() {

  }

  noWhitespaceValidator(control: FormControl) {
    //const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isWhitespace = /\s/g.test(control.value)
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  startGame() {
    this.saveUserdata()
    this.restoreHistoryFromDb()

    this.settingsOpen = false
    this.gameStarted = true
    this.gameMode = this.gameModeControl.value
    this.populationMode = this.populationControl.value
    this.username = this.usernameControl.value
  }

  resetGame() {
    this.gameStarted = false
    this.getStats()
    this.getUserdata()
  }

  restoreHistoryFromDb() {
    if (this.userdata["username"] != "" && this.userdata["username"] != undefined && this.userdata["username"] != null) {
      if (this.logging) {
        console.log("restoring history with username :", this.userdata["username"], typeof this.userdata["username"])
      }

      this.getHistory(this.userdata["username"]).subscribe({
        next: data => {
          if (this.logging) {
            console.log(data)
          }
          if (data.length > 0) {
            localStorage.setItem("history", JSON.stringify(data[0]["history"]))
          } else {
            localStorage.setItem("history", JSON.stringify({ played: 0, highscore: 0, distribution: [] }))
          }
        },
        error: error => {
          console.log(error)
        }
      })

    } else {
      if (this.logging) {
        console.log("anonymous user not restoring stats")
      }
    }
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

  getUserdata() {
    if (localStorage.getItem('userdata') != null) {
      this.userdata = JSON.parse(localStorage.getItem('userdata'))

      this.usernameControl.setValue(this.userdata["username"])
      this.username = this.userdata["username"]
    }

  }

  saveUserdata() {
    if (this.usernameControl.value != "" && this.usernameControl.value != undefined && this.usernameControl.value != null) {
      localStorage.setItem('userdata', JSON.stringify({ username: this.usernameControl.value }))
    }

    this.userdata = { username: this.usernameControl.value }
  }

  getRank() {
    this.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: data => {
        this.rank = data.length + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  getRankFromLeaderboard(highscore: number): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_rank?highscore=' + highscore, { responseType: "json" });
  }

  getHistory(username: string): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_history?username=' + username, { responseType: "json" });
  }


  // getErrorMessage() {
  //   return this.usernameControl.hasError('maxlength') ? 'Maximum length 25' : '';
  // }

  getGameMulti(zone: string, population: string) {
    let zoneMultis = {
      "worldwide": 4,
      "europe": 0,
      "africa": 0,
      "americas": 1,
      "asia/oceania": 2.5
    }
    let popMultis = {
      "500": 5,
      "10000": 3,
      "50000": 2,
      "100000": 1,
      "500000": 0
    }
    return 1 + zoneMultis[zone] + popMultis[population]
  }

  getDifficulty(multi: number){
    if(multi >= 10){
      return "HARDCORE"
    }else if(multi >= 7){
      return "Hard"
    }else if(multi >= 3){
      return "Medium"
    }else {
      return "Easy"
    }
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

  closeAll(){
    this.statsOpen = false
    this.helpOpen = false
    this.settingsOpen = false
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

}

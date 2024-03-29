import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';

import { BackendService } from 'src/app/services/backend.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

import { CountryAutocompleteComponent } from '../../country-autocomplete/country-autocomplete.component';

import { countryToCode } from '../../../../assets/countryToCode'

//dictionary with the number of places present with that specific combination of zoneMode and POPULATION
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
  selector: 'app-home-old',
  templateUrl: './home-old.component.html',
  styleUrls: ['./home-old.component.scss']
})
export class HomeOldComponent implements OnInit {

  gameMode: string;
  zoneMode: string;
  populationMode: string;
  countryCode: string;
  username: string;
  stats: any = {}
  barChartData: any[] = []
  rank: number;
  userdata: any = {}

  //booleans used to control the state of the game and to open and close windows
  gameStarted: boolean = false
  settingsOpen: boolean = false
  helpOpen: boolean = false
  statsOpen: boolean = false

  // Form controls used in the game settings 
  zoneModeControl = new FormControl('');
  populationControl = new FormControl('');
  countrypopulationControl = new FormControl('');
  usernameControl = new FormControl(undefined, [
    Validators.maxLength(25),
    this.noWhitespaceValidator
  ]);
  //[UsernameValidator.createValidator()]

  populationStats: any = populationStats;

  //used for the home background photo
  imageId: number;
  backgroundUrl: string;
  backgroundStyle: any;

  @ViewChild('autocomplete') autocomplete: CountryAutocompleteComponent;

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  //when true all logs will be printed to console
  logging: boolean = false;

  constructor(private backendService: BackendService, private localstorageService: LocalstorageService) { }

  ngOnInit(): void {

    //setting a random photo for the home background
    this.imageId = Math.floor(Math.random() * 16) + 1;
    this.backgroundUrl = "../../assets/home-backgrounds/" + this.imageId + "-min.jpg"
    this.backgroundStyle = 'linear-gradient(0deg, rgba(0, 0, 0, 0.90), rgba(0, 0, 0, 0.6)), url(' + this.backgroundUrl + ') no-repeat center center fixed'

    //inizializing variables
    this.isMobile()
    this.gameMode = 'classic'
    this.zoneMode = 'worldwide'
    this.populationMode = '10000'
    this.zoneModeControl.setValue(this.zoneMode)
    this.populationControl.setValue(this.populationMode)
    this.countrypopulationControl.setValue(this.populationMode)

    this.getUserdata()
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

  tabChanged($event) {
    if ($event.index == 1) {
      this.gameMode = 'country'
    } else if ($event.index == 0) {
      this.gameMode = 'classic'
    }
  }

  startGame() {
    this.saveUserdata()
    this.syncStatsFromDb()

    this.settingsOpen = false
    this.gameStarted = true

    this.zoneMode = this.zoneModeControl.value
    if (this.gameMode == "classic") {
      this.populationMode = this.populationControl.value
    } else if (this.gameMode == "country") {
      this.populationMode = this.countrypopulationControl.value
    }
    this.username = this.usernameControl.value

    this.countryCode = countryToCode[this.autocomplete.countryCtrl.value]
  }

  resetGame() {
    this.gameStarted = false
    this.getStats()
    this.getUserdata()
  }

  //checks in the localstorage for userdata if you played previously
  // userdata :
  // { username : 'example' }
  getUserdata() {
    if (this.localstorageService.getUserdata() != null) {
      this.userdata = this.localstorageService.getUserdata()
      this.usernameControl.setValue(this.userdata["username"])
      this.username = this.userdata["username"]
    }
  }

  //saves your username to localstorage
  saveUserdata() {
    if (this.usernameControl.value != "" && this.usernameControl.value != undefined && this.usernameControl.value != null) {
      this.localstorageService.setUsername(this.usernameControl.value)
    }

    this.userdata = { username: this.usernameControl.value }
  }

  //gets you stats from the current username if present in the DB and saves them to localstorage
  syncStatsFromDb() {
    if (this.userdata["username"] != "" && this.userdata["username"] != undefined && this.userdata["username"] != null) {
      if (this.logging) {
        console.log("restoring history with username :", this.userdata["username"], typeof this.userdata["username"])
      }

      this.backendService.getHistory(this.userdata["username"]).subscribe({
        next: data => {
          if (this.logging) { console.log(data) }
          if (data.length > 0) {
            this.localstorageService.setHistory(JSON.stringify(data[0]["history"]))
          } else {
            this.localstorageService.setHistory(JSON.stringify({ played: 0, highscore: 0, distribution: [] }))
          }
        },
        error: error => {
          console.log(error)
        }
      })

    } else {
      if (this.logging) { console.log("anonymous user not restoring stats") }
    }
  }

  //gets stats from localstorage 
  getStats() {
    this.stats = this.localstorageService.getHistory()

    this.barChartData = this.stats.distribution
    this.getRank()
  }

  //gets you current highscore ranking in the global leaderboard from the db
  getRank() {
    this.backendService.getRankFromLeaderboard(parseInt(this.stats.highscore)).subscribe({
      next: rank => {
        this.rank = rank[0] + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  //returns the score mutiplier based on zoneMode and population
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

  //returns a description of the difficulty based on the score multiplier
  getDifficulty(multi: number) {
    if (multi >= 10) {
      return "HARDCORE"
    } else if (multi >= 7) {
      return "Hard"
    } else if (multi >= 3) {
      return "Medium"
    } else {
      return "Easy"
    }
  }

  //to open and close windows
  openSettings() {
    this.settingsOpen = true
    this.gameMode = 'classic'
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

  closeAll() {
    this.statsOpen = false
    this.helpOpen = false
    this.settingsOpen = false
  }

  //simple "mobile" check
  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

}

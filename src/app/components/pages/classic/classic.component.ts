import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GamesettingsService } from 'src/app/services/gamesettings.service';

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
  selector: 'app-classic',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.scss']
})
export class ClassicComponent implements OnInit {
  zoneModeControl = new FormControl('');
  populationControl = new FormControl('');

  populationStats: any = populationStats;

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

  constructor(private router: Router, public gameSettings: GamesettingsService) { }

  ngOnInit(): void {
    this.gameMode = 'classic'
    this.zoneMode = 'worldwide'
    this.populationMode = '10000'
    this.zoneModeControl.setValue(this.zoneMode)
    this.populationControl.setValue(this.populationMode)
  }

  startGame() {
    this.zoneMode = this.zoneModeControl.value
    this.populationMode = this.populationControl.value

    //route to game page
    this.router.navigate(['play'])
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

}

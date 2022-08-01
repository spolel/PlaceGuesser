import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameStarted: boolean = false
  gameMode: string;
  populationMode: string;

  settingsOpen: boolean = false
  helpOpen: boolean = false
  statsOpen: boolean = false
  stats: any = {}
  barChartData: any[] = []

  gameModeControl = new FormControl('');
  populationControl = new FormControl('');

  imageId: number;
  backgroundUrl: string;

  backgroundStyle: any;


  constructor() { }

  ngOnInit(): void {
    //console.log(document.getElementsByClassName('app-container')[0]);
    this.imageId = Math.floor(Math.random() * 16) + 1;

    this.backgroundUrl = "../../assets/home-backgrounds/" + this.imageId + "-min.jpg"
    //console.log(this.backgroundUrl)

    this.backgroundStyle = 'linear-gradient(0deg, rgba(0, 0, 0, 0.90), rgba(0, 0, 0, 0.6)), url(' + this.backgroundUrl + ') no-repeat center center fixed'

    this.gameModeControl.setValue('worldwide')
    this.populationControl.setValue('10000')

    this.getStats()
  }

  ngAfterViewInit() {

  }

  startGame() {
    this.settingsOpen = false
    this.gameStarted = true
    this.gameMode = this.gameModeControl.value
    this.populationMode = this.populationControl.value
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

    this.barChartData = this.generateBarChartData(this.stats["distribution"])

  }

  generateBarChartData(history: any[]) {
    let data = [
      { "name": "0", "value": 0 },
      { "name": "500", "value": 0 },
      { "name": "1000", "value": 0 },
      { "name": "1500", "value": 0 },
      { "name": "2000", "value": 0 },
      { "name": "2500", "value": 0 },
      { "name": "3000", "value": 0 },
      { "name": "3500", "value": 0 },
      { "name": "4000", "value": 0 },
      { "name": "4500", "value": 0 },
      { "name": "5000", "value": 0 }
    ];

    history.forEach(item => {
      data[this.getScoreCategory(item)]["value"] = data[this.getScoreCategory(item)]["value"] + 1
    })

    return data;
  }

  getScoreCategory(score: number) {
    switch (true) {
      case (score >= 5000):
        return 10
      case (score > 4500):
        return 9
      case (score > 4000):
        return 8
      case (score > 3500):
        return 7
      case (score > 3000):
        return 6
      case (score > 2500):
        return 5
      case (score > 2000):
        return 4
      case (score > 1500):
        return 3
      case (score > 1000):
        return 2
      case (score > 500):
        return 1
      default:
        return 0
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

}

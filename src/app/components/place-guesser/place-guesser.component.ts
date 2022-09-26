import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { catchError, concatMap, filter, map, mergeMap, Observable, of, switchMap } from 'rxjs';

import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { MapSelectorComponent } from '../map-selector/map-selector.component';

import { BackendService } from 'src/app/services/backend.service';

import { bounds } from '../../../assets/countryBoundingBoxes'
import { LocalstorageService } from 'src/app/services/localstorage.service';


@Component({
  selector: 'app-place-guesser',
  templateUrl: './place-guesser.component.html',
  styleUrls: ['./place-guesser.component.scss']
})

//implements the main component for the guessing game
export class PlaceGuesserComponent implements OnInit {
  @ViewChild('placecontainer') placecontainer: ElementRef;
  @ViewChild(MapSelectorComponent) map: MapSelectorComponent;
  @ViewChild(ImageCarouselComponent) carousel: ImageCarouselComponent;

  //game settings
  @Input() gameMode: string;
  @Input() zoneMode: string;
  @Input() populationMode: string;
  @Input() countryCode: string;
  @Input() username: string;

  //solution for the current round
  solution: Object;
  solutionCoords: google.maps.LatLng;

  //coordinated guessed by the user
  guessCoords: google.maps.LatLng;

  //distance of guess to solution
  distance: number;

  //true when images received from server
  imageLoaded: boolean = false;
  placeId: string;
  images: string[] = [];

  //current game info
  round: number = 1;
  score: number;
  totalScore: number = 0;
  totalScoreMulti: number = 0;
  multi: number = 0;
  rank: number;
  gameRank: number;
  gameEnded: boolean = false;
  roundEnded: boolean = false;
  gameStarted: boolean = false;
  bounds: any;

  //storing geoids of places this round, so that if we get the same random place again we fetch a new one
  roundGeoids: number[] = []

  //stats panel
  stats: any = {}
  statsOpen: boolean = false;
  barChartData: any[] = []

  //all paths of guesses and solution from the played game
  paths: any = []

  //confirmation of returning home during game
  askResetOpen: boolean = false;

  //logs to console if true
  solutionLogging: boolean = false;

  //when true it does not send place details requests to google that are very expensive
  saveMoney: boolean = false;

  @Output() resetGameEvent = new EventEmitter();

  //tracking if we are on a mobile device
  mobile: boolean = false
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private backendService: BackendService, private localstorageService: LocalstorageService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.isMobile()

    //forcing fullscreen mode when on mobile
    if (this.mobile) {
      document.documentElement.requestFullscreen();
    }

    if (this.solutionLogging) { console.log("Username: ", this.username) }

    this.getStats()


    //set map bounds when in country mode
    if (this.gameMode == 'country') {
      this.bounds = [
        new google.maps.LatLng(bounds[this.countryCode][1][1], bounds[this.countryCode][1][0]),
        new google.maps.LatLng(bounds[this.countryCode][1][3], bounds[this.countryCode][1][2]),
      ];
    }


  }

  ngAfterViewInit(): void {
    this.getNewPlace()
  }

  //gets a new random place and then it's photos from google maps
  getNewPlace() {
    this.backendService.getRandomPlace(this.gameMode, parseInt(this.populationMode), this.zoneMode, this.countryCode).pipe(
      filter(data => {
        //if the place was already seen this round we make the call again to find another place
        if (this.roundGeoids.includes(data["geonameid"])) {
          if (this.solutionLogging) { console.log('place already seen this round ... getting new one') }

          this.getNewPlace()
          return false
        }
        return true
      })
    ).subscribe({
      next: data => {
        this.solution = data

        this.solutionCoords = new google.maps.LatLng(this.solution["geometry"]["location"]["lat"], this.solution["geometry"]["location"]["lng"])

        this.roundGeoids.push(this.solution["geonameid"])


        if (this.solutionLogging) { console.log("SOLUTION: ", this.solution) }

        if (this.solution["photos"] == undefined) {
          if (this.solutionLogging) { console.log("PLACE WITH NO PHOTOS, GETTING NEW PLACE") }
          this.getNewPlace()
          return
        }

        this.images = []
        for (let i = 0; i < this.solution["photos"].length; i++) {
          this.backendService.getPhotoUrl(this.solution["photos"][i]["photo_reference"]).subscribe({
            next: imageUrl => {
              this.images[i] = imageUrl

              if (i == this.solution["photos"].length - 1) {
                this.ngZone.run(() => {
                  this.imageLoaded = true
                });
              }
            },
            error: error => {
              console.log(error)
            }
          })
        }

      },
      error: error => {
        console.log(error)
      }
    })
  }

  //checking guess against solution
  checkGuess(coordinates: google.maps.LatLng) {
    this.guessCoords = coordinates

    this.distance = this.getDistanceFromLatLonInKm(this.solutionCoords.lat(), this.solutionCoords.lng(), coordinates.lat(), coordinates.lng())

    this.score = this.generateScore(this.distance)
    this.totalScore += this.score

    this.roundOverview()
  }

  //behaviour for advancing to next round
  nextRound() {
    this.round += 1
    if (this.round > 5) {
      this.gameOver()
    } else {
      this.roundEnded = false
      this.imageLoaded = false
      this.getNewPlace()
      this.map.resetMarker()
    }
  }

  roundOverview() {
    this.roundEnded = true;
  }

  //behaviour when the game is ended
  gameOver() {
    this.gameEnded = true

    this.multiplyScore(this.totalScore)

    this.saveHistory()

    //saving score to leaderboard
    if (this.totalScore > 0 && this.username != null && this.username != undefined && this.username != "")
      this.backendService.saveScoreToLeaderboard(
        {
          username: this.username,
          score: this.totalScoreMulti,
          multi: this.multi,
          basescore: this.totalScore,
          zonemode: this.zoneMode,
          gamemode: this.gameMode,
          countrycode: this.countryCode,
          population: this.populationMode,
          paths: this.paths
        }
      ).subscribe({ error: e => { console.log(e) } })

    this.getGameRank()
    this.getStats()
  }

  //getting complete paths from child at end of game
  completePaths(paths: any) {
    this.paths = paths
  }

  //saves history to localstorage and DB
  saveHistory() {
    let history = this.localstorageService.getHistory()

    history["played"] = history["played"] + 1

    if (history["highscore"] < this.totalScoreMulti) {
      history["highscore"] = this.totalScoreMulti
    }

    history["distribution"].push(this.totalScoreMulti)

    this.localstorageService.setHistory(JSON.stringify(history))

    this.backendService.saveHistoryToDb(this.username, history).subscribe({ error: e => { console.log(e) } })

  }

  resetGame() {
    this.resetGameEvent.emit()
  }

  playAgain() {
    this.gameEnded = false
    this.imageLoaded = false
    this.getNewPlace()
    this.roundGeoids = []
    this.map.ngOnInit()
    this.round = 1
    this.totalScore = 0
  }

  //logic to generate the score based on distance to solution
  //based on the zone different parameters are used
  //uses a quadratic function over distance. If within 50km you get full score
  generateScore(distance) {

    let zoneMaxDistance = {
      "worldwide": 2500,
      "europe": 1500,
      "africa": 2500,
      "americas": 2000,
      "asia/oceania": 2000
    }

    let maxDistance = zoneMaxDistance[this.zoneMode]
    let maxPointsCutoff = 50

    //calculate maxDistance based on country bounds
    if (this.gameMode == 'country') {
      const diagonal = this.getDistanceFromLatLonInKm(bounds[this.countryCode][1][0], bounds[this.countryCode][1][1], bounds[this.countryCode][1][2], bounds[this.countryCode][1][3])

      maxDistance = diagonal / 4
      maxPointsCutoff = diagonal / 500
    }

    if (distance > maxDistance) {
      return 0
    } else if (distance <= maxPointsCutoff) {
      return 1000
    } else {
      //console.log(Math.floor(1000 * (1 - ((distance - maxPointsCutoff) / (maxDistance-maxPointsCutoff))) ** 2))
      return Math.floor(1000 * (1 - ((distance - maxPointsCutoff) / (maxDistance - maxPointsCutoff))) ** 2)
    }

  }

  // Zone
  // worldwide multiplier x4
  // europe multiplier x1
  // africa multiplier x1.5
  // americas multiplier x2
  // Asia/Oceania X2.5

  // Population
  // 500000 multiplier x1
  // 100000 multiplier x1.5
  // 50000 multiplier x2
  // 10000 multiplier x3
  // 500 multiplier x6

  //returns the score mutiplier based on zoneMode and population
  getGameMulti(gamemode: string, zone: string, population: string) {
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

    if (gamemode == "country") {
      return 1
    } else {
      return 1 + zoneMultis[zone] + popMultis[population]
    }

  }

  multiplyScore(score: number) {

    let multi = this.getGameMulti(this.gameMode, this.zoneMode, this.populationMode)

    if (this.solutionLogging) {
      console.log("Sore: ", score, " Multi: ", multi, " = ", score * multi)
    }

    this.totalScoreMulti = score * multi
    this.multi = multi
  }


  getProgress(distance) {
    return (1 - (distance / 20037.5))
  }

  //calculates distance from two pairs of coordinates
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km

    return Math.floor(d);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

  //gets stats from localstorage 
  getStats() {
    this.stats = this.localstorageService.getHistory()

    this.barChartData = this.stats["distribution"]
    this.getRank()

  }

  //gets you current highscore ranking in the global leaderboard from the db
  getRank() {
    this.backendService.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: rank => {
        this.rank = rank[0] + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  //gets rank on leaderboard of current game
  getGameRank() {
    this.backendService.getRankFromLeaderboard(this.totalScoreMulti).subscribe({
      next: rank => {
        this.gameRank = rank[0] + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  openStats() {
    this.statsOpen = true;
  }

  closeStats() {
    this.statsOpen = false;
  }

  openAskReset() {
    //do not ask when game is not ongoing
    if (!this.gameEnded) {
      this.askResetOpen = true
    } else {
      this.resetGame()
    }
  }

  closeAskReset() {
    this.askResetOpen = false
  }

  closeAll() {
    this.askResetOpen = false
  }

}

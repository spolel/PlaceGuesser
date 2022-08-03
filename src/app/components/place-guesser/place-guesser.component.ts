import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { catchError, map, Observable, of } from 'rxjs';

import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { MapSelectorComponent } from '../map-selector/map-selector.component';

import { codeToCountry } from '../../../assets/codeToCountry'


@Component({
  selector: 'app-place-guesser',
  templateUrl: './place-guesser.component.html',
  styleUrls: ['./place-guesser.component.scss']
})
export class PlaceGuesserComponent implements OnInit {
  @ViewChild('placecontainer') placecontainer: ElementRef;
  @ViewChild(MapSelectorComponent) map: MapSelectorComponent;
  @ViewChild(ImageCarouselComponent) carousel: ImageCarouselComponent;

  @Input() gameMode: string;
  @Input() populationMode: string;
  @Input() username: string;

  guessCoords: google.maps.LatLng;
  solutionCoords: google.maps.LatLng;
  solution: Object;
  imageUrl: string = "";
  imageLoaded: boolean = false;
  placeId: string;
  images: string[] = [];
  distance: number;

  palcesService: google.maps.places.PlacesService;

  round: number = 1;
  score: number;
  totalScore: number = 0;
  totalScoreMulti: number = 0;
  multi: number = 0;
  rank: number;
  gameRank: number;

  roundGeoids: number[] = [];

  gameEnded: boolean = false;
  roundEnded: boolean = false;

  gameStarted: boolean = false;

  stats: any = {}
  statsOpen: boolean = false;
  barChartData: any[] = []

  paths: any = []

  solutionLogging: boolean = false;

  @Output() resetGameEvent = new EventEmitter();

  mobile: boolean = false
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.isMobile()

    if (this.mobile) {
      document.documentElement.requestFullscreen();
    }

    if (this.solutionLogging) {
      console.log("Username: ", this.username)
    }

    this.getStats()

  }

  ngAfterViewInit(): void {

    //initialize google place service
    this.palcesService = new google.maps.places.PlacesService(this.placecontainer.nativeElement);

    this.getNewPlace()

  }

  getNewPlace() {

    //TODO make it so you cant get same place in a row twice

    this.getRandomPlace(parseInt(this.populationMode), this.gameMode).subscribe(data => {

      if (this.roundGeoids.includes(data[0]["geonameid"])) {
        if (this.solutionLogging) {
          console.log('place already seen this round ... getting new one')
        }

        this.getNewPlace()

      } else {
        this.solution = data[0]
        this.solutionCoords = new google.maps.LatLng(this.solution["latitude"], this.solution["longitude"])

        this.roundGeoids.push(this.solution["geonameid"])


        if (this.solutionLogging) {
          console.log("SOLUTION: ")
          console.log(this.solution)
        }

        this.getCachedPhotos(parseInt(this.solution["geonameid"])).subscribe({
          next: data => {
            // caching images disabled
            // data == null replaced with true 
            if (true) {
              if (this.solutionLogging) {
                console.log("Location not cached, ... getting new photos")
              }

              this.getPlacePhotos()
            } else {
              if (this.solutionLogging) {
                console.log("Photos from cash: ")
                console.log(data)
              }

              this.images = []
              data["photos"].forEach(item => {
                this.images.push(item)
              })

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

    })
  }

  getRandomPlace(pop: number, zone: string): Observable<Object> {
    //console.log('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_random_place?pop='+pop+'&zone='+zone)
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_random_place?pop=' + pop + '&zone=' + zone, { responseType: "json" });
  }

  getCachedPhotos(goenameid: number): Observable<Object> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_place_photos?geonameid=' + goenameid, { responseType: "json" });
  }

  savePlacePhotos(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_place_photos', body, { 'headers': headers });
  }

  saveScoreToLeaderboard(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_score_to_leaderboard', body, { 'headers': headers });
  }

  saveHistoryToDb(username: string, body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_history?username=' + username, body, { 'headers': headers });
  }




  getPlacePhotos() {

    //let queryString = this.solution["name"]+", "+codeToCountry[this.solution["country code"]]+", "+this.solution["admin1 code"]
    let queryString = this.solution["name"] + ", " + codeToCountry[this.solution["country code"]]

    if (this.solutionLogging) {
      console.log(queryString)
    }

    var request = {
      query: queryString,
      fields: ['name', 'place_id'],
      locationBias: this.solutionCoords
    };

    this.images = []

    this.palcesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (this.solutionLogging) {
          console.log("google query return: ")
          console.log(results)
        }
        // get only 1 image from basic details
        //this.imageUrl = results[0].photos[0].getUrl({maxWidth: 1000, maxHeight: 1000})
        //console.log(this.imageUrl)

        // this.images.push(results[0].photos[0].getUrl())
        // this.ngZone.run(() => {
        //         this.imageLoaded = true
        // });

        this.palcesService.getDetails(
          {
            placeId: results[0].place_id,
            fields: ['photos'],
          }
          , (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              if (results.photos == undefined) {
                if (this.solutionLogging) {
                  console.log("PLACE WITH NO PHOTOS, GETTING NEW PLACE")
                }
                this.getNewPlace()
                return
              }
              results.photos.forEach(item => {
                this.images.push(item.getUrl())
              })

              this.savePlacePhotos(
                {
                  geonameid: this.solution["geonameid"],
                  photos: this.images
                }
              ).subscribe({ error: e => { console.log(e) } })

              //console.log(this.images)
              this.ngZone.run(() => {
                this.imageLoaded = true
              });
            }
          });

      }
    });
  }

  checkGuess(coordinates: google.maps.LatLng) {
    //console.log(coordinates)
    this.guessCoords = coordinates

    this.distance = this.getDistanceFromLatLonInKm(this.solutionCoords.lat(), this.solutionCoords.lng(), coordinates.lat(), coordinates.lng())
    //console.log(this.distance)

    //this.score = Math.floor(this.getProgress(this.distance) * 1000)
    this.score = this.generateScore(this.distance)
    this.totalScore += this.score

    this.roundOverview()
  }

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

  gameOver() {
    this.gameEnded = true

    this.multiplyScore(this.totalScore)

    this.getGameRank()
    this.saveHistory()

    //saving score to leaderboard
    if (this.totalScore > 0 && this.username != null && this.username != undefined && this.username != "")
      this.saveScoreToLeaderboard(
        {
          username: this.username,
          score: this.totalScoreMulti,
          multi: this.multi,
          basescore: this.totalScore,
          gamemode: this.gameMode,
          population: this.populationMode,
          paths: this.paths
        }
      ).subscribe({ error: e => { console.log(e) } })

    this.getStats()
  }

  completePaths(paths: any) {
    this.paths = paths
  }

  saveHistory() {
    let history = {}
    if (localStorage.getItem('history') != null) {
      history = JSON.parse(localStorage.getItem('history'))
    } else {
      history = { played: 0, highscore: 0, distribution: [] }
    }

    history["played"] = history["played"] + 1

    if (history["highscore"] < this.totalScoreMulti) {
      history["highscore"] = this.totalScoreMulti
    }

    history["distribution"].push(this.totalScoreMulti)

    localStorage.setItem('history', JSON.stringify(history))

    this.saveHistoryToDb(this.username, history).subscribe({ error: e => { console.log(e) } })

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

  generateScore(distance) {
    if (this.gameMode == 'europe') {
      if (distance > 750) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance-50) / 700)))
      }
    } else if (this.gameMode == 'americas') {
      if (distance > 2000) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance-50) / 1950)))
      }
    } else if (this.gameMode == 'africa') {
      if (distance > 1500) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance-50) / 1450)))
      }
    } else if (this.gameMode == 'asia/oceania') {
      if (distance > 2000) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance-50) / 1950)))
      }
    } else {
      if (distance > 4000) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance-50) / 3950)))
      }
    }
  }

  //   Zone
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

  multiplyScore(score: number) {

    let multi = this.getGameMulti(this.gameMode,this.populationMode)

    if (this.solutionLogging) {
      console.log("Sore: ", score, " Multi: ", multi, " = ", score * multi)
    }

    this.totalScoreMulti = score * multi
    this.multi = multi
  }


  getProgress(distance) {
    return (1 - (distance / 20037.5))
  }

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
        this.rank = data.length + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  getGameRank() {
    this.getRankFromLeaderboard(this.totalScoreMulti).subscribe({
      next: data => {
        this.gameRank = data.length + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }


  getRankFromLeaderboard(highscore: number): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_rank?highscore=' + highscore, { responseType: "json" });
  }

  openStats() {
    this.statsOpen = true;
  }

  closeStats() {
    this.statsOpen = false;
  }



}

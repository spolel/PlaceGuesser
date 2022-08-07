import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { catchError, concatMap, filter, map, mergeMap, Observable, of, switchMap } from 'rxjs';

import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { MapSelectorComponent } from '../map-selector/map-selector.component';

import { BackendService } from 'src/app/services/backend.service';

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
  geocoder: google.maps.Geocoder;

  round: number = 1;
  score: number;
  totalScore: number = 0;
  totalScoreMulti: number = 0;
  multi: number = 0;
  rank: number;
  gameRank: number;

  roundGeoids: number[] = []
  gameEnded: boolean = false;
  roundEnded: boolean = false;

  gameStarted: boolean = false;

  stats: any = {}
  statsOpen: boolean = false;
  barChartData: any[] = []

  paths: any = []

  solutionLogging: boolean = true;
  saveMoney: boolean = false;

  @Output() resetGameEvent = new EventEmitter();

  mobile: boolean = false
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private backendService: BackendService, private ngZone: NgZone) {
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

    this.geocoder = new google.maps.Geocoder();

    this.getNewPlace()

  }

  //gets a new random place and then it's photos from google maps
  getNewPlace() {
    this.backendService.getRandomPlace(parseInt(this.populationMode), this.gameMode).pipe(
      filter(data => {
        //if the place was already seen this round we make the call again to find another place
        if (this.roundGeoids.includes(data[0]["geonameid"])) {
          if (this.solutionLogging) { console.log('place already seen this round ... getting new one') }

          this.getNewPlace()
          return false
        }
        return true
      })
    ).subscribe({
      next: data => {
        this.solution = data[0]
        this.solutionCoords = new google.maps.LatLng(this.solution["latitude"], this.solution["longitude"])

        this.roundGeoids.push(this.solution["geonameid"])


        if (this.solutionLogging) { console.log("SOLUTION: ", this.solution) }

        this.geocodeLatLng(this.geocoder, this.solutionCoords)
      },
      error: error => {
        console.log(error)
      }
    })
  }

  geocodeLatLng(
    geocoder: google.maps.Geocoder,
    coords: google.maps.LatLng
  ) {
    const latlng = {
      lat: coords.lat(),
      lng: coords.lng(),
    };

    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          let results = response.results

          if (this.solutionLogging) { console.log("google geocoding return: ", results) }


          let locality;
          for (const result of results) {
            if (result.types.includes("locality")) {
              locality = result
              break;
            }
          }

          let firstPolitical;
          for (const result of results) {
            if (result.types.includes("political")
              && !result.types.includes("country")
              && !result.types.includes("administrative_area_level_1")
              && !result.types.includes("administrative_area_level_2")
              && !result.types.includes("administrative_area_level_3")) {
              firstPolitical = result
              break;
            }
          }


          if (locality != undefined) {
            if (this.solutionLogging) { console.log("locality address: ", locality.formatted_address) }
            if (!this.saveMoney) { this.getPlaceDetails(locality.place_id) }
          } else if (firstPolitical != undefined) {
            if (this.solutionLogging) { console.log("first political address: ", firstPolitical.formatted_address) }
            if (!this.saveMoney) { this.getPlaceDetails(firstPolitical.place_id) }
          } else {
            console.log("No Locality Found")
            let address_components = results.find(obj => { return obj.types.includes("plus_code") }) ?
              results.find(obj => { return obj.types.includes("plus_code") }).address_components :
              results[0].address_components;

            let query = "";
            address_components.forEach(x => {
              if (x.types.includes("political")) {
                query += x.long_name + ", "
              }
            })
            if (this.solutionLogging) { console.log("query: ", query) }
            if (query != "") {
              this.getPlaceFromQuery(query)
            } else {
              if (this.solutionLogging) { console.log("No political types in address ... getting new place") }
              this.getNewPlace()
            }

          }

        } else {
          console.log("No results found");
        }
      })
      .catch((e) => console.log("Geocoder failed due to: " + e));
  }


  getPlaceFromQuery(queryString: string) {
    var request = {
      query: queryString,
      fields: ['name', 'place_id', 'geometry'],
      locationBias: this.solutionCoords
    };

    this.images = []

    this.palcesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (this.solutionLogging) {
          console.log("google query return: ")
          console.log(results)
          console.log(results[0]["geometry"]["location"].lat(), results[0]["geometry"]["location"].lng())
        }

        const queryDistance = this.getDistanceFromLatLonInKm(results[0]["geometry"]["location"].lat(), results[0]["geometry"]["location"].lng(), this.solutionCoords.lat(), this.solutionCoords.lng())
        if (this.solutionLogging) { console.log(queryDistance, "km away from solution") }
        if (queryDistance > 50) {
          if (this.solutionLogging) { console.log("Google text query returned a different place ..... getting new place") }
          this.getNewPlace()
        } else {
          if (!this.saveMoney) { this.getPlaceDetails(results[0].place_id) }
        }
      }
    })
  }

  getPlaceDetails(palce_id: string) {
    this.images = []

    this.palcesService.getDetails(
      {
        placeId: palce_id,
        fields: ['photos'],
      }
      , (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (results.photos == undefined) {
            if (this.solutionLogging) { console.log("PLACE WITH NO PHOTOS, GETTING NEW PLACE") }
            this.getNewPlace()
            return
          }
          results.photos.forEach(item => {
            this.images.push(item.getUrl())
          })

          this.backendService.savePlacePhotos(
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
      this.backendService.saveScoreToLeaderboard(
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

  generateScore(distance) {
    if (this.gameMode == 'europe') {
      if (distance > 1500) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance - 50) / 1450)) ** 2)
      }
    } else if (this.gameMode == 'americas') {
      if (distance > 2000) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance - 50) / 1950)) ** 2)
      }
    } else if (this.gameMode == 'africa') {
      if (distance > 2500) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance - 50) / 2450)) ** 2)
      }
    } else if (this.gameMode == 'asia/oceania') {
      if (distance > 2000) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance - 50) / 1950)) ** 2)
      }
    } else {
      if (distance > 2500) {
        return 0
      } else if (distance <= 50) {
        return 1000
      } else {
        return Math.floor(1000 * (1 - ((distance - 50) / 2450)) ** 2)
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

    let multi = this.getGameMulti(this.gameMode, this.populationMode)

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
    this.backendService.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: data => {
        this.rank = data.length + 1
      },
      error: error => {
        console.log(error)
      }
    })

  }

  getGameRank() {
    this.backendService.getRankFromLeaderboard(this.totalScoreMulti).subscribe({
      next: data => {
        this.gameRank = data.length + 1
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



}

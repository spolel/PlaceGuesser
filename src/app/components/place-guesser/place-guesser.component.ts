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

//implements the main component for the guessing game
export class PlaceGuesserComponent implements OnInit {
  @ViewChild('placecontainer') placecontainer: ElementRef;
  @ViewChild(MapSelectorComponent) map: MapSelectorComponent;
  @ViewChild(ImageCarouselComponent) carousel: ImageCarouselComponent;

  //game settings
  @Input() gameMode: string;
  @Input() populationMode: string;
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

  //used for requests to google geocoding and place service
  //TODO: eventually move to backend the geocoding part and only return image links from server
  palcesService: google.maps.places.PlacesService;
  geocoder: google.maps.Geocoder;

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

  constructor(private backendService: BackendService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.isMobile()

    //forcing fullscreen mode when on mobile
    if (this.mobile) {
      document.documentElement.requestFullscreen();
    }

    if (this.solutionLogging) { console.log("Username: ", this.username) }

    this.getStats()

  }

  ngAfterViewInit(): void {
    //initialize google place and geocoder service
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

  //getting the place on google maps from the coordinated using geocoding
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

          //getting lowest level political zone
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

          //trying to get the name of the city. Not always easy because different countries sometimes use different formats
          //I prioritize locality, if not present the first political zone is used (for example the Municipality ),
          //if not even a low level political is present is try to extract it from the plus code (https://maps.google.com/pluscodes/)
          //if even the plus code does not contain a political type I fin a new place
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

  //getting the place on google maps from a text search on google maps
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

  //getting the details given a placeId
  //this is used to get the 10 photos of the place
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

  //getting complete paths from child at end of game
  completePaths(paths: any) {
    this.paths = paths
  }

  //saves history to localstorage and DB
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

  //logic to generate the score based on distance to solution
  //based on the zone different parameters are used
  //uses a quadratic function over distance. If within 50km you get full score
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

  //returns the score mutiplier based on gamemode and population
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
    if (localStorage.getItem('history') != null) {
      this.stats = JSON.parse(localStorage.getItem('history'))
    } else {
      this.stats = { played: 0, highscore: 0, distribution: [] }
    }

    this.barChartData = this.stats["distribution"]
    this.getRank()

  }

    //gets you current highscore ranking in the global leaderboard from the db
  getRank() {
    this.backendService.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: rank => {
        this.rank = rank + 1
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
        this.gameRank = rank + 1
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
    }else{
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

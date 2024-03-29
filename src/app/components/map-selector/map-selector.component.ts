import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { codeToCountry } from '../../../assets/codeToCountry'


@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})

//implements component to input your guess on the map
export class MapSelectorComponent implements OnInit {
  //settings for google map
  center: google.maps.LatLng = new google.maps.LatLng(40, -3)
  zoom: number = 2
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 2,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    keyboardShortcuts: true
  }

  markerLatLng: google.maps.LatLng;
  markerSelected: boolean = false;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  guessCoords: google.maps.LatLng;
  path: google.maps.LatLng[];
  paths: any = [];

  mapClasses: string[] = ['map', 'size1'];
  containerClasses: string[] = ['container', 'bottom-right'];
  enlargedSize: string = "size2";
  sizeIndex: number = 2;
  isPinned: boolean = false;

  @Input() solutionCoords: google.maps.LatLng;
  @Input() solution: Object;
  //solution country is used to display flag of the country in the end of round screen
  solutionCountry: string;
  destinationCoords: google.maps.LatLng;

  @Input() gameEnded: boolean;
  @Input() distance: number;
  @Input() score: number;
  @Input() round: number;
  @Input() gameMode: string;
  @Input() bounds: any;


  roundEnded: boolean = false;

  // svgMarker: any = {
  //   path: google.maps.SymbolPath ,
  //   fillColor: "blue",
  //   fillOpacity: 0.6,
  //   strokeWeight: 0,
  //   rotation: 0,
  //   scale: 2,
  //   anchor: new google.maps.Point(15, 30),
  // };

  markerFlag: any = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };


  @Output() guessEvent = new EventEmitter<google.maps.LatLng>();
  @Output() nextRoundEvent = new EventEmitter();
  @Output() playAgainEvent = new EventEmitter();
  @Output() resetGameEvent = new EventEmitter();
  @Output() completePathsEvent = new EventEmitter<any>();


  @ViewChild('map') map: GoogleMap;

  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.responsiveClasses()
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.roundEnded == false && this.gameEnded == false) {
      if (event.key == " " || event.key == "Spacebar" || event.key == "Enter") {
        this.guess()
      }
    }
  }

  constructor() {

  }

  ngOnInit(): void {
    this.responsiveClasses()
    this.paths = []
  }

  ngAfterViewInit() {

    if (this.gameMode == "country") {
      this.setMapBounds(this.bounds[0], this.bounds[1])
    }

  }

  //setting css classes to component based on window size and round state 
  //(smaller during round and bigger in the middle of the screen to show end round solution)
  responsiveClasses() {
    //mobile
    if (window.innerWidth >= 1000) {
      this.mobile = false;
      if (this.roundEnded) {
        this.containerClasses = ['container', 'middle']
        this.mapClasses = ['map', 'size-middle']
      } else {
        this.containerClasses = ['container', 'bottom-right']
        this.mapClasses = ['map', 'size1']
      }

      this.isPinned = false

      //desktop 
    } else {
      this.mobile = true;
      if (this.roundEnded) {
        this.containerClasses = ['container-full', 'middle']
        this.mapClasses = ['map', 'mapfull']
      } else {
        this.containerClasses = ['container-mobile']
        this.mapClasses = ['map', 'mapfull']
      }

      this.isPinned = true
    }
  }

  //setting marker on map when clicking
  click(event: google.maps.MapMouseEvent) {
    //console.log(event.latLng.lat(),event.latLng.lng())
    if (!this.roundEnded) {
      this.markerLatLng = event.latLng
      this.markerSelected = true
    }
  }

  //centering the map on given coordinate pair bounds
  setMapBounds(a: google.maps.LatLng, b: google.maps.LatLng) {
    let bounds: google.maps.LatLngBounds;
    if (a.lng() < b.lng()) {
      bounds = new google.maps.LatLngBounds(a, b);
    } else {
      bounds = new google.maps.LatLngBounds(b, a);
    }

    this.center = bounds.getCenter()
    this.map.fitBounds(bounds)
  }

  //handles behaviour when guessing a location
  guess() {
    if (this.markerSelected) {
      this.destinationCoords = this.solutionCoords
      this.guessCoords = this.markerLatLng

      //emitting guess to parent
      this.guessEvent.emit(this.markerLatLng)

      this.path = [this.guessCoords, this.destinationCoords]
      this.paths.push(this.path)

      this.setMapBounds(this.guessCoords, this.destinationCoords)

      this.roundEnded = true
      this.responsiveClasses()
      this.isPinned = true

      this.solutionCountry = codeToCountry[this.solution["country code"]]
    }
  }

  //resets map marker
  resetMarker() {
    this.markerLatLng = new google.maps.LatLng(0)
    this.markerSelected = false
  }

  nextRound() {
    //if it was the last round send to parent all paths of guesses and solutions
    if (this.round == 5) {
      this.completePathsEvent.emit(this.paths)

      if (this.gameMode == "country") {
        this.options = {
          restriction: {latLngBounds: new google.maps.LatLngBounds(this.bounds[0],this.bounds[1]), strictBounds: false},
          zoomControl: true,
          scrollwheel: true,
          disableDoubleClickZoom: true,
          minZoom: 2,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          clickableIcons: false,
          keyboardShortcuts: true
        }
      }
    }

    this.roundEnded = false
    this.isPinned = false
    this.responsiveClasses()

    this.path = undefined
    this.markerLatLng = new google.maps.LatLng(0)
    this.markerSelected = false

    this.nextRoundEvent.emit()

    if (this.gameMode == "country") {
      this.setMapBounds(this.bounds[0], this.bounds[1])
    } else {
      this.setMapBounds(new google.maps.LatLng(-11, -76), new google.maps.LatLng(74, 80))
    }
  }

  playAgain() {
    this.playAgainEvent.emit()
  }

  resetGame() {
    this.resetGameEvent.emit()
  }

  //resize the map based on class
  resize(size: string) {
    this.mapClasses = ['map', size]
  }

  //resizing the map is disabled on hover if the map is pinned
  resizeHover(size: string) {
    if (!this.isPinned) {
      this.mapClasses = ['map', size]
    }
  }

  //increase size of the map
  enlarge() {
    if (this.sizeIndex < 4) {
      this.sizeIndex += 1
      this.resize("size" + this.sizeIndex)
    }
  }

  //reduce size of the map
  reduce() {
    if (this.sizeIndex > 1) {
      this.sizeIndex -= 1
      this.resize("size" + this.sizeIndex)
    }
  }

  //sets the size the map will change to when enlarged
  setEnlargedSize(size: string) {
    this.enlargedSize = size
    this.resize(this.enlargedSize)
  }

  //pins the map so it does not resize when hovering out
  pin() {
    this.isPinned = !this.isPinned
  }

}

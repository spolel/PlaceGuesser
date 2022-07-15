import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})

export class MapSelectorComponent implements OnInit {
  mapCenter: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    zoom: 2,
    minZoom: 1,
    center: new google.maps.LatLng(40, -3),
    fullscreenControl : false,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    keyboardShortcuts: true
  }
  markerLatLng: google.maps.LatLng;
  markerSelected: boolean = false;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  guessCoords: google.maps.LatLng;
  path: google.maps.LatLng[];
  paths: any = [];

  mapClasses: string[] = ['map','size1'];
  containerClasses: string[] = ['container','bottom-right'];
  enlargedSize: string = "size2";
  isPinned: boolean = false;

  @Input() solutionCoords: google.maps.LatLng;
  destinationCoords: google.maps.LatLng;

  @Input() gameEnded: boolean;
  @Input() distance: number;
  @Input() score: number;
  @Input() round: number;

  roundEnded: boolean = false;
  mobile: boolean;
  
  

  @Output() guessEvent = new EventEmitter<google.maps.LatLng>();
  @Output() nextRoundEvent = new EventEmitter();
  @Output() playAgainEvent = new EventEmitter();

  @HostListener("window:resize", []) onWindowResize() {  
    this.responsiveClasses()
    
  }

  responsiveClasses(){
    if (window.innerWidth >= 1000) {
      this.mobile = false;
      if(this.roundEnded){
        this.containerClasses = ['container', 'middle']
        this.mapClasses = ['map', 'size3']
      }else{
        this.containerClasses = ['container', 'bottom-right']
        this.mapClasses = ['map', 'size1']
      }
    } else {
      this.mobile = true;
      if(this.roundEnded){
        this.containerClasses = ['container', 'middle']
        this.mapClasses = ['map', 'mobile-map-middle']
      }else{
        this.containerClasses = ['container', 'mobile']
        this.mapClasses = ['map', 'mobile-map']
      }
      
      this.isPinned = true
    }
  }

  // svgMarker: any = {
  //   path: google.maps.SymbolPath ,
  //   fillColor: "blue",
  //   fillOpacity: 0.6,
  //   strokeWeight: 0,
  //   rotation: 0,
  //   scale: 2,
  //   anchor: new google.maps.Point(15, 30),
  // };


  constructor() {

  }

  ngOnInit(): void {
    this.paths = []
    this.markerLatLng = new google.maps.LatLng(0)
    this.markerSelected = false

    this.responsiveClasses()
  }

  click(event: google.maps.MapMouseEvent) {
    //console.log(event)
    if(!this.roundEnded){
      this.markerLatLng = event.latLng
      this.markerSelected = true
    }
  }

  guess(){
    if(this.markerSelected){
      this.destinationCoords = this.solutionCoords
      this.guessCoords = this.markerLatLng
  
      this.guessEvent.emit(this.markerLatLng)
  
      this.path = [this.guessCoords,this.destinationCoords]
      this.paths.push(this.path)
  
      this.roundEnded = true
      // this.containerClasses = ['container', 'middle']
      // this.mapClasses = ['map', 'size3']
      this.responsiveClasses()
      this.isPinned = true
    }
  }

  nextRound(){
    this.roundEnded = false
    // this.containerClasses = ['container', 'bottom-right']
    // this.mapClasses = ['map', 'size1']
    this.isPinned = false
    this.responsiveClasses()
    
    this.path = undefined
    this.markerLatLng = new google.maps.LatLng(0)
    this.markerSelected = false

    this.nextRoundEvent.emit()
  }

  playAgain(){
    this.playAgainEvent.emit()
  }

  resize(size: string){
    this.mapClasses = ['map', size]
  }

  enlarge(){
    //console.log(this.isPinned)
    if(!this.isPinned){
    this.resize(this.enlargedSize)
    }
  }

  reduce(){
    if(!this.isPinned){
    this.resize("size1")
    }
  }

  setEnlargedSize(size: string){
    this.enlargedSize = size
    this.resize(this.enlargedSize)
  }

  pin(){
    this.isPinned = !this.isPinned
    //console.log(this.isPinned)
  }





}

import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { catchError, map, Observable, of } from 'rxjs';

import {cities15000} from '../../../assets/cities15000'
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { MapSelectorComponent } from '../map-selector/map-selector.component';

@Component({
  selector: 'app-place-guesser',
  templateUrl: './place-guesser.component.html',
  styleUrls: ['./place-guesser.component.scss']
})
export class PlaceGuesserComponent implements OnInit {
  @ViewChild('placecontainer') placecontainer: ElementRef;
  @ViewChild(MapSelectorComponent) map: MapSelectorComponent;
  @ViewChild(ImageCarouselComponent) carousel: ImageCarouselComponent;
  
  guessCoords: google.maps.LatLng;
  solutionCoords: google.maps.LatLng;
  cities15000: Object = cities15000;
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

  gameEnded: boolean = false;
  roundEnded: boolean = false;

  gameStarted: boolean = false;

  solutionLogging: boolean = false;

  @Output() resetGameEvent = new EventEmitter();

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
   }

  ngOnInit(): void {
    this.getNewPlace()

  }

  ngAfterViewInit(): void{

    //initialize google place service
    this.palcesService = new google.maps.places.PlacesService(this.placecontainer.nativeElement);
    
    this.getPlacePhotos()

  }

  getNewPlaceAndPhotos(){
    this.getNewPlace()
    this.getPlacePhotos()
  }

  getNewPlace(){
    this.solution = this.cities15000[(Math.floor(Math.random()*25831)+1).toString()]
    if(this.solutionLogging){
      console.log("SOLUTION: ")
      console.log(this.solution)
    }
    

    this.solutionCoords = new google.maps.LatLng(this.solution["coordinates"].split(",")[0],this.solution["coordinates"].split(",")[1] )

  }

  getPlacePhotos(){

    var request = {
      query: this.solution["ascii_name"]+","+this.solution["country_name"],
      fields: ['name', 'place_id', 'photo'],
      locationBias: this.solutionCoords
    };

    this.images=[]

    this.palcesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if(this.solutionLogging){
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
              if(results.photos == undefined){
                if(this.solutionLogging){
                  console.log("PLACE WITH NO PHOTOS, GETTING NEW PLACE")
                }
                this.getNewPlaceAndPhotos()
                return
              }
              results.photos.forEach(item => {
                this.images.push(item.getUrl())
              })
              //console.log(this.images)
              this.ngZone.run(() => {
                this.imageLoaded = true
              });
            }
        });

      }
    });
  }

  checkGuess(coordinates: google.maps.LatLng){
    //console.log(coordinates)
    this.guessCoords = coordinates

    this.distance = this.getDistanceFromLatLonInKm(this.solutionCoords.lat(),this.solutionCoords.lng(),coordinates.lat(),coordinates.lng())
    //console.log(this.distance)

    this.score = Math.floor(this.getProgress(this.distance) * 1000)
    this.totalScore += this.score
    
    this.roundOverview()
  }

  nextRound(){
    this.round += 1
    if(this.round > 5){
      this.gameOver()
    }else{
      this.roundEnded = false
      this.getNewPlace()
      this.getPlacePhotos()
      this.map.resetMarker()
      this.carousel.ngOnInit()
    }
  }

  roundOverview(){
    this.roundEnded = true;
  }

  gameOver(){
    this.gameEnded = true
  }

  resetGame(){
    this.resetGameEvent.emit()
  }

  playAgain(){
    this.map.ngOnInit()

    this.getNewPlace()
    this.getPlacePhotos()

    this.round = 1
    this.gameEnded = false
    this.totalScore = 0
  }


  getProgress(distance){
    return (1-(distance/20037.5))
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km

    return Math.floor(d);
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  openHelp(){

  }

  

}

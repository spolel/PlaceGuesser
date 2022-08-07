import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsApiService {

  constructor() { }

  geocoder = new google.maps.Geocoder();


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


          return response.results[0].formatted_address;

        } else {
          window.alert("No results found");
          return response.results;
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }
}

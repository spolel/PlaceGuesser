import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamesettingsService {

  gameMode: string;
  zoneMode: string;
  populationMode: string; 
  countryCode: string;
  username:string;

  constructor() { }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  guestMode: boolean;
  
  constructor() { }
}

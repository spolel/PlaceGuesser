import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }


  constructor() { }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }
}

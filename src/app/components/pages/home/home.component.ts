import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MobileService } from 'src/app/services/mobile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private router: Router, private mobileService: MobileService) { }

  ngOnInit(): void {
    this.isMobile()
  }

  test() {
    console.log(this.mobile)
  }
  routeTo(routeName: string) {
    this.router.navigate([routeName])
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

}

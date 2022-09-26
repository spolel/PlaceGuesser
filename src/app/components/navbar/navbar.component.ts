import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() inLogin: boolean;

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isMobile()
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

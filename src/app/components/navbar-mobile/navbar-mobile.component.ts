import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss']
})
export class NavbarMobileComponent implements OnInit {

  get guestMode(): boolean {
    return this.guest.guestMode;
  }
  set guestMode(value: boolean) {
    this.guest.guestMode = value;
  }


  @Input() inLogin: boolean;

  constructor(private router: Router, private guest: GuestService) { }

  ngOnInit(): void {
  }

  routeTo(routeName: string){
    this.router.navigate([routeName])
  }

}

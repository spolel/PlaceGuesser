import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss']
})
export class NavbarMobileComponent implements OnInit {

  @Input() inLogin: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routeTo(routeName: string){
    this.router.navigate([routeName])
  }

}

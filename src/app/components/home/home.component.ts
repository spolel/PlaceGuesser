import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameStarted: boolean = true
  helpOpen: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  startGame(){
    this.gameStarted = true
  }

  resetGame(){
    this.gameStarted = false
  }

  openHelp(){
    this.helpOpen = true
  }

  closeHelp(){
    this.helpOpen = false
  }

}

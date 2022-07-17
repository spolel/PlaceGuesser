import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameStarted: boolean = false
  gameMode: string;
  populationMode: string;

  settingsOpen: boolean = false
  helpOpen: boolean = false

  gameModeControl = new FormControl('');
  populationControl = new FormControl('');

  constructor() { }

  ngOnInit(): void {
    this.gameModeControl.setValue('worldwide')
    this.populationControl.setValue('10000')
  }

  ngAfterViewInit(){
    
  }

  startGame(){
    this.settingsOpen = false
    this.gameStarted = true
    this.gameMode = this.gameModeControl.value
    this.populationMode = this.populationControl.value
  }

  resetGame(){
    this.gameStarted = false
  }

  openSettings(){
    this.settingsOpen = true
  }

  closeSettings(){
    this.settingsOpen = false
  }

  openHelp(){
    this.helpOpen = true
  }

  closeHelp(){
    this.helpOpen = false
  }

}

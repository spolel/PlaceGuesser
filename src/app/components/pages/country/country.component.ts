import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CountryAutocompleteComponent } from '../../country-autocomplete/country-autocomplete.component';
import { countryToCode } from '../../../../assets/countryToCode'
import { Router } from '@angular/router';
import { GamesettingsService } from 'src/app/services/gamesettings.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  populationControl = new FormControl('');

  get gameMode(): string {
    return this.gameSettings.gameMode;
  }
  set gameMode(value: string) {
    this.gameSettings.gameMode = value;
  }

  get populationMode(): string {
    return this.gameSettings.populationMode;
  }
  set populationMode(value: string) {
    this.gameSettings.populationMode = value;
  }

  get countryCode(): string {
    return this.gameSettings.countryCode;
  }
  set countryCode(value: string) {
    this.gameSettings.countryCode = value;
  }

  @ViewChild('autocomplete') autocomplete: CountryAutocompleteComponent;

  constructor(private router: Router, public gameSettings: GamesettingsService) { }

  ngOnInit(): void {
    this.gameMode = 'country'
    this.populationControl.setValue(this.populationMode)
    this.populationMode = '10000'
    this.populationControl.setValue(this.populationMode)
  }

  startGame() {
    this.populationMode = this.populationControl.value

    this.countryCode = countryToCode[this.autocomplete.countryCtrl.value]

    //route to game page
    this.router.navigate(['play'])
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {countries} from 'src/assets/countries'

const countriesNames: string[] = countries.map(a => a.name);

export interface Country {
  code: string;
  lat: number;
  long: number;
  name: string;
}

@Component({
  selector: 'app-country-autocomplete',
  templateUrl: './country-autocomplete.component.html',
  styleUrls: ['./country-autocomplete.component.scss']
})
export class CountryAutocompleteComponent implements OnInit {
  countries: Country[] = countries;


  countryCtrl = new FormControl('', [Validators.required, this.validCountry]);
  filteredCountries: Observable<Country[]>;

  constructor() { 
    this.filteredCountries = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map(country => (country ? this._filterCountries(country) : this.countries.slice())),
    );

  }

  ngOnInit(): void {
  }

  validCountry(control: FormControl) {
    const isValid = countriesNames.includes(control.value)
    return isValid ? null : { 'valid': true };
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {countries} from 'src/assets/countries'

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

  countryCtrl = new FormControl('');
  filteredCountries: Observable<Country[]>;

  constructor() { 
    this.filteredCountries = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map(country => (country ? this._filterCountries(country) : this.countries.slice())),
    );

  }

  ngOnInit(): void {
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

}

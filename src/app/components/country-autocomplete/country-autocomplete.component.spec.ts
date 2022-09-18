import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAutocompleteComponent } from './country-autocomplete.component';

describe('CountryAutocompleteComponent', () => {
  let component: CountryAutocompleteComponent;
  let fixture: ComponentFixture<CountryAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

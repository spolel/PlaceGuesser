import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceGuesserComponent } from './place-guesser.component';

describe('PlaceGuesserComponent', () => {
  let component: PlaceGuesserComponent;
  let fixture: ComponentFixture<PlaceGuesserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceGuesserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceGuesserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

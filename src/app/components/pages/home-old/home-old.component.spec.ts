import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOldComponent } from './home-old.component';

describe('HomeComponent', () => {
  let component: HomeOldComponent;
  let fixture: ComponentFixture<HomeOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

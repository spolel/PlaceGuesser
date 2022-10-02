import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGamesPagedComponent } from './user-games-paged.component';

describe('UserGamesPagedComponent', () => {
  let component: UserGamesPagedComponent;
  let fixture: ComponentFixture<UserGamesPagedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGamesPagedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGamesPagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

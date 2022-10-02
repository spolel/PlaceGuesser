import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardPagedComponent } from './leaderboard-paged.component';

describe('LeaderboardPagedComponent', () => {
  let component: LeaderboardPagedComponent;
  let fixture: ComponentFixture<LeaderboardPagedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardPagedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardPagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

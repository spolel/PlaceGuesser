import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardExpandableComponent } from './leaderboard-expandable.component';

describe('LeaderboardExpandableComponent', () => {
  let component: LeaderboardExpandableComponent;
  let fixture: ComponentFixture<LeaderboardExpandableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardExpandableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardExpandableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

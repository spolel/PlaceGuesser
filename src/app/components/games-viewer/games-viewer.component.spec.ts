import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesViewerComponent } from './games-viewer.component';

describe('GamesViewerComponent', () => {
  let component: GamesViewerComponent;
  let fixture: ComponentFixture<GamesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

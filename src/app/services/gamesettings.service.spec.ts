import { TestBed } from '@angular/core/testing';

import { GamesettingsService } from './gamesettings.service';

describe('GamesettingsService', () => {
  let service: GamesettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

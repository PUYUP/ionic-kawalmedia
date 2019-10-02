import { TestBed } from '@angular/core/testing';

import { EscortService } from './escort.service';

describe('EscortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EscortService = TestBed.get(EscortService);
    expect(service).toBeTruthy();
  });
});

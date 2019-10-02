import { TestBed, async, inject } from '@angular/core/testing';

import { ValidationGuard } from './validation.guard';

describe('ValidationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationGuard]
    });
  });

  it('should ...', inject([ValidationGuard], (guard: ValidationGuard) => {
    expect(guard).toBeTruthy();
  }));
});

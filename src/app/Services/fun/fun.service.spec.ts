import { TestBed } from '@angular/core/testing';

import { FunService } from './fun.service';

describe('FunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunService = TestBed.get(FunService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { StaticService } from './static.service';

describe('StaticService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaticService = TestBed.get(StaticService);
    expect(service).toBeTruthy();
  });
});

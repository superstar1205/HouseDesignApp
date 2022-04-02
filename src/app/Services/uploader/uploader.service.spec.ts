import { TestBed } from '@angular/core/testing';

import { UploaderService } from './uploader.service';

describe('UploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploaderService = TestBed.get(UploaderService);
    expect(service).toBeTruthy();
  });
});

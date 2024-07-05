import { TestBed } from '@angular/core/testing';

import { GetContentService } from './get-content.service';

describe('GetContentService', () => {
  let service: GetContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

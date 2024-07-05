import { TestBed } from '@angular/core/testing';

import { NewListService } from './new-list.service';

describe('NewListService', () => {
  let service: NewListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

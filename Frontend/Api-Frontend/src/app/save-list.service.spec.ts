import { TestBed } from '@angular/core/testing';

import { SaveListService } from './save-list.service';

describe('SaveListService', () => {
  let service: SaveListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

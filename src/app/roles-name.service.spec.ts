import { TestBed } from '@angular/core/testing';

import { RolesNameService } from './roles-name.service';

describe('RolesNameService', () => {
  let service: RolesNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

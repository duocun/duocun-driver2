import { TestBed } from '@angular/core/testing';

import { PickupByOrderService } from './pickup-by-order.service';

describe('PickupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickupByOrderService = TestBed.get(PickupByOrderService);
    expect(service).toBeTruthy();
  });
});

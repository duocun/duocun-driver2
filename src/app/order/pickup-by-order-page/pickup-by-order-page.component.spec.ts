import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupByOrderPageComponent } from './pickup-by-order-page.component';

describe('PickupPageComponent', () => {
  let component: PickupByOrderPageComponent;
  let fixture: ComponentFixture<PickupByOrderPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupByOrderPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupByOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

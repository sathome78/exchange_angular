import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookMobileComponent } from './order-book-mobile.component';

describe('OrderBookMobileComponent', () => {
  let component: OrderBookMobileComponent;
  let fixture: ComponentFixture<OrderBookMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderBookMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBookMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOrdersHistoryMobileComponent } from './embedded-orders-history-mobile.component';

describe('EmbeddedOrdersHistoryMobileComponent', () => {
  let component: EmbeddedOrdersHistoryMobileComponent;
  let fixture: ComponentFixture<EmbeddedOrdersHistoryMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedOrdersHistoryMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOrdersHistoryMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

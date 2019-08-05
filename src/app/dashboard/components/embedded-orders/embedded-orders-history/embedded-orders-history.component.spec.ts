import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOrdersHistoryComponent } from './embedded-orders-history.component';

describe('EmbeddedOrdersHistoryComponent', () => {
  let component: EmbeddedOrdersHistoryComponent;
  let fixture: ComponentFixture<EmbeddedOrdersHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedOrdersHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOrdersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

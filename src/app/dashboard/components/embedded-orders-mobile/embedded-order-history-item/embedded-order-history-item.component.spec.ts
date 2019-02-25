import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedOrderHistoryItemComponent } from './embedded-order-history-item.component';

describe('EmbeddedOrderHistoryItemComponent', () => {
  let component: EmbeddedOrderHistoryItemComponent;
  let fixture: ComponentFixture<EmbeddedOrderHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedOrderHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedOrderHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
